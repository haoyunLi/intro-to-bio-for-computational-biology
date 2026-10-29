(function(root){
  'use strict';
  const sum=a=>a.reduce((x,y)=>x+y,0),mean=a=>sum(a)/a.length;
  function ambient(rho=.2){
    const total=1000,truth=[800,200,0],profile=[.05,.15,.8],actual=.2;
    const observed=truth.map((v,i)=>(1-actual)*v+total*actual*profile[i]);
    const raw=observed.map((v,i)=>(v-total*rho*profile[i])/(1-rho));
    const clipped=raw.map(v=>Math.max(0,v)),corrected=clipped.map(v=>v/sum(clipped)*total);
    return {total,truth,profile,actual,observed,raw,corrected,rho,negatives:raw.filter(v=>v< -1e-10).length,error:sum(corrected.map((v,i)=>Math.abs(v-truth[i])))};
  }
  function graph(mode='radius',radius=1.1,k=2,alpha=.5,steps=0){
    const points=[[0,0],[1,0],[0,1],[1,1],[3,0],[4,0],[3,1],[4,1]],n=points.length;
    const distances=points.map(a=>points.map(b=>Math.hypot(a[0]-b[0],a[1]-b[1])));
    const A=points.map(()=>Array(n).fill(0));
    for(let i=0;i<n;i++){
      const nearest=Array.from({length:n},(_,j)=>j).filter(j=>j!==i).sort((a,b)=>distances[i][a]-distances[i][b]||a-b);
      for(const j of (mode==='knn'?nearest.slice(0,k):nearest.filter(j=>distances[i][j]<=radius+1e-10)))A[i][j]=1;
    }
    for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(A[i][j]||A[j][i])A[i][j]=A[j][i]=1;
    const degree=A.map(sum),W=A.map((row,i)=>row.map(v=>degree[i]?v/degree[i]:0));
    let values=[0,0,0,0,10,10,10,10];const history=[[...values]];
    for(let t=0;t<steps;t++){values=values.map((v,i)=>degree[i]?(1-alpha)*v+alpha*sum(W[i].map((w,j)=>w*values[j])):v);history.push([...values]);}
    const edges=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(A[i][j])edges.push([i,j]);
    const center=mean(values),z=values.map(v=>v-center),den=sum(z.map(v=>v*v)),S0=sum(W.map(sum));
    const moran=S0&&den>1e-12?n/S0*sum(W.flatMap((row,i)=>row.map((w,j)=>w*z[i]*z[j])))/den:null;
    return {points,distances,A,W,degree,edges,values,history,moran,isolates:degree.filter(d=>!d).length,cross:edges.filter(([i,j])=>(i<4)!==(j<4)).length,contrast:mean(values.slice(4))-mean(values.slice(0,4)),alpha,steps,mode};
  }
  function integration(layout='balanced',shift=4,strength=1){
    const rows=[];
    for(let batch=0;batch<2;batch++)for(const type of (layout==='balanced'?[0,1]:[batch]))for(const noise of [-.25,.25])rows.push({batch,type,truth:type*4+noise,before:type*4+noise+batch*shift});
    const grand=mean(rows.map(r=>r.before)),batchMean=[0,1].map(b=>mean(rows.filter(r=>r.batch===b).map(r=>r.before)));
    rows.forEach(r=>r.after=r.before-strength*(batchMean[r.batch]-grand));
    const gap=key=>mean(rows.filter(r=>r.type===1).map(r=>r[key]))-mean(rows.filter(r=>r.type===0).map(r=>r[key]));
    return {rows,grand,batchMean,shift,strength,layout,beforeGap:gap('before'),afterGap:gap('after'),trueGap:4,batchGap:Math.abs((1-strength)*(batchMean[1]-batchMean[0])),identifiable:layout==='balanced'};
  }
  function deconvolution(contrast=6,noise=0){
    const truth=.65,A=[5+contrast/2,5-contrast/2],B=[5-contrast/2,5+contrast/2];
    const y=A.map((a,i)=>truth*a+(1-truth)*B[i]+(i===0?noise:-noise));
    const predict=w=>A.map((a,i)=>w*a+(1-w)*B[i]);
    const loss=w=>sum(predict(w).map((v,i)=>(v-y[i])**2));
    const fitted=contrast>1e-12?Math.max(0,Math.min(1,(y[0]-B[0])/contrast)):null;
    const bestLoss=loss(fitted??.5),grid=Array.from({length:101},(_,i)=>({w:i/100,loss:loss(i/100)}));
    const near=grid.filter(v=>v.loss<=bestLoss+.1+1e-12);
    return {truth,A,B,y,contrast,noise,fitted,bestLoss,grid,range:[near[0].w,near.at(-1).w],condition:contrast?10/contrast:null,prediction:predict(fitted??.5)};
  }
  function abundance(expansion=3,capture=1){
    const rows=[];
    for(let donor=0;donor<3;donor++)for(let treatment=0;treatment<2;treatment++){
      const absolute=[90+10*donor,110-10*donor,100*(treatment?expansion:1)],captured=absolute.map((v,i)=>v*(treatment&&i===0?capture:1)),total=sum(captured);
      rows.push({donor:donor+1,condition:treatment?'T':'C',absolute,captured,total,fraction:captured[0]/total,logratio:Math.log2(captured[0]/captured[1])});
    }
    const deltas=Array.from({length:3},(_,i)=>({fraction:rows[2*i+1].fraction-rows[2*i].fraction,logratio:rows[2*i+1].logratio-rows[2*i].logratio}));
    return {rows,deltas,expansion,capture,fractionDelta:mean(deltas.map(d=>d.fraction)),ratioDelta:mean(deltas.map(d=>d.logratio)),absoluteDelta:0};
  }
  function validation(strategy='interleaved',buffer=0,shift=4){
    const positions=Array.from({length:12},(_,i)=>i);
    let train,test;
    if(strategy==='donor'){train=positions.map(x=>({x,y:x,donor:'A'}));test=positions.map(x=>({x,y:x+shift,donor:'B'}));}
    else{const testIds=strategy==='block'?positions.slice(6):positions.filter(x=>x%2);train=positions.filter(x=>!testIds.includes(x)&&(strategy!=='block'||Math.min(...testIds.map(t=>Math.abs(t-x)))>buffer)).map(x=>({x,y:x,donor:'A'}));test=testIds.map(x=>({x,y:x,donor:'A'}));}
    const predictions=test.map(t=>{const nearest=[...train].sort((a,b)=>Math.abs(a.x-t.x)-Math.abs(b.x-t.x)||a.x-b.x)[0];return {...t,predicted:nearest.y,neighbor:nearest.x,distance:Math.abs(t.x-nearest.x),error:Math.abs(t.y-nearest.y)};});
    return {train,test:predictions,mae:mean(predictions.map(t=>t.error)),distance:mean(predictions.map(t=>t.distance)),strategy,buffer,shift};
  }
  const api={ambient,graph,integration,deconvolution,abundance,validation};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BIOCS_METHODS_MATH=api;
})(typeof window!=='undefined'?window:globalThis);
