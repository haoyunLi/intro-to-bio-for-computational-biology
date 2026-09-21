/* Pure teaching models first; DOM wiring below. */
(function () {
  'use strict';
  function regulationModel(access, tf, contact, repressor) {
    const open=Number(access), t=Number(tf)/100, c=Number(contact)/100;
    const potential=open*t*(0.2+0.8*c);
    const output=Math.max(0,Math.min(100,2+98*potential*(repressor?0.24:1)));
    return {open,occupancy:open*t*100,contact:open*c*100,output};
  }
  function vafModel(purity, ccf, totalCopies, mutantCopies) {
    const p=Number(purity)/100,f=Number(ccf)/100,total=Number(totalCopies),mut=Math.min(Number(mutantCopies),total);
    const alt=p*f*mut;
    const denominator=p*total+(1-p)*2;
    return {alt,denominator,vaf:denominator?alt/denominator:0};
  }
  function signalModel(pattern, feedback) {
    const fb=Number(feedback)/100, values=[],inputs=[],steps=24;
    let state=0,adapt=0,late=0;
    for(let i=0;i<steps;i++){
      const input=pattern==='sustained'?1:pattern==='pulsed'?([1,2,8,9,15,16].includes(i)?1:0):(i<4?1:0);
      adapt=adapt*.78+state*.22;
      state=Math.max(0,input+state*.46-adapt*fb*.62);
      late+=Math.max(0,state-.55)*.12;
      inputs.push(input);values.push(state);
    }
    const peak=Math.max(...values),duration=values.filter(v=>v>.55).length;
    return {inputs,values,peak,duration,late};
  }
  const api={regulationModel,vafModel,signalModel};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(typeof window!=='undefined')window.BIOCS_GENETICS_LAB=api;
  if(typeof document==='undefined')return;
  const $=selector=>document.querySelector(selector);
  const pct=n=>`${Math.round(n)}%`;
  function renderRegulation(){
    const access=document.querySelector('input[name="access"]:checked').value,tf=$('#tf').value,contact=$('#contact').value,repressor=$('#repressor').checked;
    const model=regulationModel(access,tf,contact,repressor);
    $('#tf-value').textContent=pct(tf);$('#contact-value').textContent=pct(contact);
    $('#node-access span').textContent=model.open?'open':'closed';$('#node-tf span').textContent=pct(model.occupancy);$('#node-contact span').textContent=pct(model.contact);$('#node-rna span').textContent=pct(model.output);
    $('#reg-meter').style.width=pct(model.output);$('#reg-output').textContent=Math.round(model.output);
    $('#reg-explanation').innerHTML=!model.open?'<b>Chromatin closed 是当前瓶颈。</b>即使 TF 很多、接触概率很高，模型里也无法有效占据该位点。':repressor?`Accessibility 与 TF 允许调控，但 repressor 把输出压到 <b>${pct(model.output)}</b>。必要条件满足仍不代表达到最大 transcription。`:`当前四个条件给出 <b>${pct(model.output)}</b> 的教学输出。把任何一个变量单独称为“gene activation”都会遗漏其他门槛。`;
  }
  function renderVaf(){
    const purity=$('#purity').value,ccf=$('#ccf').value,copy=$('#copy').value,mutCopy=Math.min(Number($('#mut-copy').value),Number(copy));
    $('#mut-copy').max=copy;if(Number($('#mut-copy').value)>Number(copy))$('#mut-copy').value=copy;
    const model=vafModel(purity,ccf,copy,mutCopy);
    $('#purity-value').textContent=pct(purity);$('#ccf-value').textContent=pct(ccf);$('#copy-value').textContent=copy;$('#mut-copy-value').textContent=String(mutCopy);
    $('#alt-contribution').textContent=model.alt.toFixed(2);$('#total-contribution').textContent=model.denominator.toFixed(2);$('#vaf-output').textContent=pct(model.vaf*100);
    const count=20,tumor=Math.round(count*purity/100);$('#sample-strip').replaceChildren(...Array.from({length:count},(_,i)=>{const el=document.createElement('i');el.className=i<tumor?'tumor':'normal';return el;}));
    $('#sample-strip').setAttribute('aria-label',`${tumor} 个肿瘤比例圆点，${count-tumor} 个正常比例圆点；只表示 purity`);
    $('#vaf-explanation').innerHTML=`期望 ALT contribution = purity × CCF × mutant copies = <b>${model.alt.toFixed(2)}</b>；总 copy contribution 同时包含肿瘤与正常细胞 = <b>${model.denominator.toFixed(2)}</b>。所以 VAF 约为 <b>${pct(model.vaf*100)}</b>，它不是 CCF 的直接同义词。`;
  }
  function renderSignal(){
    const pattern=document.querySelector('input[name="pattern"]:checked').value,feedback=$('#feedback').value,model=signalModel(pattern,feedback),max=Math.max(...model.values,1);
    $('#feedback-value').textContent=pct(feedback);$('#signal-peak').textContent=model.peak.toFixed(2);$('#signal-duration').textContent=`${model.duration} / 24`;$('#signal-late').textContent=model.late.toFixed(2);
    $('#signal-chart').replaceChildren(...model.values.map((value,i)=>{const col=document.createElement('div');const bar=document.createElement('i');const input=document.createElement('span');bar.style.height=`${value/max*100}%`;bar.title=`t${i+1}: response ${value.toFixed(2)}`;input.className=model.inputs[i]?'input-on':'';col.append(bar,input);return col;}));
    const labels={short:'短 pulse 会在输入结束后回落',sustained:'持续输入会与 feedback 竞争并出现 adaptation',pulsed:'重复 pulse 让系统反复越过 threshold'};
    $('#signal-explanation').innerHTML=`<b>${labels[pattern]}</b>。当前 feedback=${pct(feedback)}，peak=${model.peak.toFixed(2)}，超过阈值 ${model.duration} 个时间点，late target 累积=${model.late.toFixed(2)}。最后一根柱无法概括这段历史。`;
  }
  $('#reg-form').addEventListener('input',renderRegulation);$('#vaf-form').addEventListener('input',renderVaf);$('#signal-form').addEventListener('input',renderSignal);
  $('#reg-reset').addEventListener('click',()=>{document.querySelector('input[name="access"][value="1"]').checked=true;$('#tf').value=65;$('#contact').value=55;$('#repressor').checked=false;renderRegulation();});
  $('#vaf-reset').addEventListener('click',()=>{$('#purity').value=50;$('#ccf').value=100;$('#copy').value=2;$('#mut-copy').value=1;renderVaf();});
  $('#signal-reset').addEventListener('click',()=>{document.querySelector('input[name="pattern"][value="short"]').checked=true;$('#feedback').value=45;renderSignal();});
  renderRegulation();renderVaf();renderSignal();
})();
