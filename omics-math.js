(function (root) {
  'use strict';
  const sum = xs => xs.reduce((a,b)=>a+b,0);
  const mean = xs => sum(xs)/xs.length;
  const median = xs => [...xs].sort((a,b)=>a-b)[Math.floor(xs.length/2)];
  function rank(matrix) {
    const a=matrix.map(row=>[...row]); let r=0;
    for(let c=0;c<a[0].length && r<a.length;c++) {
      let pivot=r; for(let i=r+1;i<a.length;i++) if(Math.abs(a[i][c])>Math.abs(a[pivot][c]))pivot=i;
      if(Math.abs(a[pivot][c])<1e-10)continue;
      [a[r],a[pivot]]=[a[pivot],a[r]];
      const scale=a[r][c]; for(let j=c;j<a[r].length;j++)a[r][j]/=scale;
      for(let i=0;i<a.length;i++)if(i!==r){const x=a[i][c];for(let j=c;j<a[i].length;j++)a[i][j]-=x*a[r][j];}
      r++;
    } return r;
  }
  function alignment(mode='id', confounded=false) {
    const counts=[10,12,30,32], ids=['S1','S2','S3','S4'];
    const meta=[{id:'S3',condition:'T',batch:'B'},{id:'S1',condition:'C',batch:'A'},{id:'S4',condition:'T',batch:'A'},{id:'S2',condition:'C',batch:'B'}];
    const rows=ids.map((id,i)=>{const m=mode==='id'?meta.find(x=>x.id===id):meta[i];return {id,count:counts[i],metadataId:m.id,condition:m.condition,batch:confounded?(m.condition==='T'?'B':'A'):m.batch};});
    const design=rows.map(r=>[1,Number(r.batch==='B'),Number(r.condition==='T')]);
    const control=mean(rows.filter(r=>r.condition==='C').map(r=>r.count));
    const treatment=mean(rows.filter(r=>r.condition==='T').map(r=>r.count));
    return {rows,meta,design,rank:rank(design),control,treatment,difference:treatment-control,matched:rows.every(r=>r.id===r.metadataId)};
  }
  function normalization(composition=800, depth=2) {
    const a=[100,100,800],b=[100*depth,100*depth,composition*depth];
    const gm=a.map((v,i)=>Math.sqrt(v*b[i]));
    const factors=[median(a.map((v,i)=>v/gm[i])),median(b.map((v,i)=>v/gm[i]))];
    const totals=[sum(a),sum(b)],cpm=[a[0]/totals[0]*1e6,b[0]/totals[1]*1e6];
    const normalized=[a[0]/factors[0],b[0]/factors[1]];
    return {a,b,gm,factors,totals,cpm,normalized,rawFC:Math.log2(b[0]/a[0]),cpmFC:Math.log2(cpm[1]/cpm[0]),ratioFC:Math.log2(normalized[1]/normalized[0])};
  }
  function logChoose(n,k) { if(k<0||k>n)return -Infinity;let r=0;for(let i=1;i<=Math.min(k,n-k);i++)r+=Math.log(n-i+1)-Math.log(i);return r; }
  function ora(N=200,K=20,n=20,k=5) {
    if(![N,K,n,k].every(Number.isInteger)||N<1||K<0||K>N||n<0||n>N||k<Math.max(0,n-(N-K))||k>Math.min(K,n))throw new Error('Invalid overlap table');
    const probabilities=Array.from({length:Math.min(K,n)+1},(_,x)=>Math.exp(logChoose(K,x)+logChoose(N-K,n-x)-logChoose(N,n)));
    return {N,K,n,k,expected:n*K/N,fold:k/n/(K/N),p:Math.min(1,sum(probabilities.slice(k))),probabilities,table:[[k,n-k],[K-k,N-K-n+k]]};
  }
  function adjustBH(values) {
    const order=values.map((p,i)=>({p,i})).sort((a,b)=>a.p-b.p),out=Array(values.length);let last=1;
    for(let j=order.length-1;j>=0;j--){last=Math.min(last,order[j].p*order.length/(j+1));out[order[j].i]=last;}return out;
  }
  function gsea(preset='positive',power=1) {
    const scores=[4,3,2,1,.5,-.5,-1,-2,-3,-4];
    const sets={positive:[0,2,3],negative:[6,8,9],mixed:[0,4,9]}, members=sets[preset];
    if(!members)throw new Error('Unknown gene set');
    const denominator=sum(members.map(i=>Math.abs(scores[i])**power));
    let running=0;const rows=scores.map((score,i)=>{const hit=members.includes(i),increment=hit?Math.abs(score)**power/denominator:-1/(scores.length-members.length);running+=increment;return {gene:`G${i+1}`,score,hit,increment,running};});
    const peak=rows.reduce((best,r,i)=>Math.abs(r.running)>Math.abs(rows[best].running)+1e-12?i:best,0);
    const maxPositive=Math.max(0,...rows.map(r=>r.running)),minNegative=Math.min(0,...rows.map(r=>r.running));
    // Standard two-sided fgsea convention: equal opposing extrema have no direction.
    const tied=Math.abs(maxPositive+minNegative)<1e-12;
    const es=tied?0:rows[peak].running;
    const leading=tied?[]:rows.filter((r,i)=>r.hit&&(es>0?i<=peak:i>=peak)).map(r=>r.gene);
    return {rows,es,peak:tied?null:peak+1,leading,denominator,power,tied,maxPositive,minNegative};
  }
  function pseudobulk(imbalance=90) {
    const cells=[100-imbalance,imbalance,imbalance,100-imbalance], values=[2,4,8,10];
    const rows=values.map((value,i)=>({donor:i<2?'D1':'D2',condition:i%2?'T':'C',cells:cells[i],perCell:value,targetCount:value*cells[i],referenceCount:100*cells[i]}));
    const pooledC=(rows[0].targetCount+rows[2].targetCount)/(cells[0]+cells[2]);
    const pooledT=(rows[1].targetCount+rows[3].targetCount)/(cells[1]+cells[3]);
    return {rows,pooledC,pooledT,pooledDifference:pooledT-pooledC,donorDifferences:[2,2],pairedDifference:2,donors:2,totalCells:sum(cells)};
  }
  function spatial(offset=0,temperature=4,threshold=.8) {
    const costA=(2-offset)**2,costB=(2-(4+offset))**2;
    const p=1/(1+Math.exp((costA-costB)/temperature)),q=1-p;
    const baseA=[16,3],baseB=[3,16],ambiguous=[4,4];
    const hardA=p>=.5,accepted=Math.max(p,q)>=threshold;
    const add=(base,w)=>base.map((x,i)=>x+w*ambiguous[i]);
    return {offset,temperature,threshold,costA,costB,p,q,entropy:-sum([p,q].map(x=>x>0?x*Math.log(x):0)),accepted,
      soft:[add(baseA,p),add(baseB,q),[0,0]],hard:[add(baseA,hardA?1:0),add(baseB,hardA?0:1),[0,0]],
      abstain:[add(baseA,accepted&&hardA?1:0),add(baseB,accepted&&!hardA?1:0),accepted?[0,0]:ambiguous],total:[23,23]};
  }
  const api={rank,alignment,normalization,ora,adjustBH,gsea,pseudobulk,spatial};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BIOCS_OMICS_MATH=api;
})(typeof window!=='undefined'?window:globalThis);
