/* All teaching data on this page are invented. Pure models at the top are also testable in Node. */
(function () {
  "use strict";

  const codonRows = {
    F:"UUU UUC", L:"UUA UUG CUU CUC CUA CUG", I:"AUU AUC AUA", M:"AUG",
    V:"GUU GUC GUA GUG", S:"UCU UCC UCA UCG AGU AGC", P:"CCU CCC CCA CCG",
    T:"ACU ACC ACA ACG", A:"GCU GCC GCA GCG", Y:"UAU UAC", H:"CAU CAC",
    Q:"CAA CAG", N:"AAU AAC", K:"AAA AAG", D:"GAU GAC", E:"GAA GAG",
    C:"UGU UGC", W:"UGG", R:"CGU CGC CGA CGG AGA AGG", G:"GGU GGC GGA GGG",
    Stop:"UAA UAG UGA"
  };
  const aminoNames = {F:"Phe",L:"Leu",I:"Ile",M:"Met",V:"Val",S:"Ser",P:"Pro",T:"Thr",A:"Ala",Y:"Tyr",H:"His",Q:"Gln",N:"Asn",K:"Lys",D:"Asp",E:"Glu",C:"Cys",W:"Trp",R:"Arg",G:"Gly",Stop:"Stop"};
  const codonMap = Object.fromEntries(Object.entries(codonRows).flatMap(([letter, codons]) => codons.split(" ").map(codon => [codon, aminoNames[letter]])));

  function groupTriplets(value) { return value.match(/.{1,3}/g)?.join(" ") || ""; }
  function sequenceModel(input) {
    const dna = String(input).toUpperCase().replace(/\s+/g, "");
    if (!/^[ACGT]+$/.test(dna) || dna.length < 3 || dna.length > 36 || dna.length % 3 !== 0) {
      return {error:"请输入 3–36 个 A/C/G/T 字母，长度须是 3 的倍数。"};
    }
    const template = dna.replace(/[ACGT]/g, base => ({A:"T",C:"G",G:"C",T:"A"})[base]);
    const rna = dna.replaceAll("T", "U");
    const codons = rna.match(/.{3}/g) || [];
    const protein = [];
    if (codons[0] === "AUG") {
      for (const codon of codons) {
        const amino = codonMap[codon];
        if (amino === "Stop") { protein.push("Stop"); break; }
        protein.push(amino);
      }
    }
    return {dna,template,rna,codons,protein,starts:codons[0]==="AUG",stops:protein.includes("Stop")};
  }

  function mixtureModel(tumorPercent) {
    const p = Number(tumorPercent) / 100;
    return {tumorPercent:Number(tumorPercent),immunePercent:100-Number(tumorPercent),immuneMarker:12*(1-p),tumorMarker:8*p};
  }

  const genes = [{name:"G1",kb:1},{name:"G2",kb:4},{name:"G3",kb:2}];
  function normalizationModel(scenario, unit) {
    const a = [20,80,100];
    const b = scenario === "composition" ? [20,80,300] : [40,160,200];
    function transform(values) {
      if (unit === "raw") return values;
      if (unit === "cpm") {
        const total = values.reduce((sum,n)=>sum+n,0);
        return values.map(n=>n/total*1000000);
      }
      const perKb = values.map((n,i)=>n/genes[i].kb);
      const total = perKb.reduce((sum,n)=>sum+n,0);
      return perKb.map(n=>n/total*1000000);
    }
    return {genes,rawA:a,rawB:b,totalA:200,totalB:b.reduce((sum,n)=>sum+n,0),a:transform(a),b:transform(b)};
  }

  const modelApi = {sequenceModel,mixtureModel,normalizationModel};
  if (typeof module !== "undefined" && module.exports) module.exports = modelApi;
  if (typeof window !== "undefined") window.BIOCS_FOUNDATIONS = modelApi;
  if (typeof document === "undefined") return;

  const byId = id => document.getElementById(id);
  const format = value => new Intl.NumberFormat("zh-CN",{maximumFractionDigits:0}).format(value);
  const short = value => Number(value.toFixed(1)).toString();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionStops = [];
  function pauseWhenAway(sectionId, stop) {
    motionStops.push(stop);
    if ("IntersectionObserver" in window) new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop("已暂停：模型已离开视口。");
    }).observe(byId(sectionId));
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) motionStops.forEach(stop => stop("已暂停：页面已切到后台。"));
  });
  reducedMotion.addEventListener?.("change", () => {
    if (reducedMotion.matches) motionStops.forEach(stop => stop("减少动态效果已开启；可继续逐步查看。"));
  });

  // Model 1: a short, intron-free CDS, deliberately distinct from abundance measurement.
  const seqInput = byId("coding-input");
  let seqStep = 0;
  let seqTimer = null, seqPlaying = false, seqProgress = 0, seqAnimated = false;
  const seqStepText = [
    "下一步：显示模板链", "下一步：转录为 RNA", "下一步：按密码子翻译", "已到最后一步"
  ];
  function sequenceTokens(value, start, end, visible = value.length) {
    return value.match(/.{1,3}/g).map((triplet, group) => `<span class="seq-triplet">${[...triplet].map((base, index) => {
      const position = group * 3 + index;
      return `<span class="seq-base${position >= start && position < end ? " active" : ""}${position >= visible ? " pending" : ""}">${position < visible ? base : "·"}</span>`;
    }).join("")}</span>`).join(" ");
  }
  function stopSequence(message) {
    if (!seqPlaying) return;
    clearTimeout(seqTimer); seqTimer = null; seqPlaying = false;
    byId("seq-play").textContent = "继续播放信息流";
    byId("seq-play").setAttribute("aria-pressed", "false");
    if (message) byId("seq-motion-status").textContent = message;
  }
  function renderSequence() {
    const result = sequenceModel(seqInput.value);
    const error = byId("seq-error");
    const invalid = Boolean(result.error);
    error.hidden = !invalid;
    error.textContent = result.error || "";
    byId("seq-next").disabled = invalid || seqStep === 3;
    byId("seq-play").disabled = invalid;
    byId("seq-next").textContent = seqStepText[seqStep];
    document.querySelectorAll("[data-seq]").forEach(button => button.setAttribute("aria-pressed",String(button.dataset.seq===seqInput.value)));
    ["template-row","rna-row","protein-row"].forEach((id,i)=>byId(id).hidden=invalid || seqStep < i+1);
    if (invalid) {
      byId("dna-output").textContent="等待有效 DNA 序列";
      byId("seq-observation").textContent="先输入有效的 DNA 编码链，才可以继续追踪分子信息。";
      return;
    }
    const index = seqAnimated ? seqProgress - 1 : -1;
    const spanStart = seqStep === 3 ? index * 3 : index;
    const spanEnd = seqStep === 3 ? spanStart + 3 : spanStart + 1;
    byId("dna-output").innerHTML=`5′ ${sequenceTokens(result.dna,seqStep===1?spanStart:-1,seqStep===1?spanEnd:-1)} 3′`;
    byId("template-output").innerHTML=`3′ ${sequenceTokens(result.template,seqStep<3?spanStart:-1,seqStep<3?spanEnd:-1,seqAnimated&&seqStep===1?seqProgress:result.template.length)} 5′`;
    byId("rna-output").innerHTML=`5′ ${sequenceTokens(result.rna,spanStart,spanEnd,seqAnimated&&seqStep===2?seqProgress:result.rna.length)} 3′`;
    const shownProtein = seqAnimated && seqStep===3 ? result.protein.slice(0,seqProgress) : result.protein;
    byId("protein-output").innerHTML=result.starts ? shownProtein.map((amino,i)=>`<span class="seq-amino${seqStep===3&&seqAnimated&&i===index?" active":""}">${amino}</span>`).join(" — ")+(result.stops?"":" · 此片段未见 Stop") : "首密码子不是 AUG；本模型不预测翻译产物";
    const notes = [
      "现在看到的是 <b>一段 DNA 序列</b>，不是细胞里有多少 RNA。DNA 双链方向相反；这段输入被指定为编码链。",
      "模板链与编码链 <b>互补且反向平行</b>。转录时 RNA 聚合酶读取模板链；这里按位置对齐写出 3′→5′ 的模板。",
      "在这个无内含子、固定阅读框的玩具例子里，mRNA 与编码链顺序相同，只把 T 改为 U。<b>序列相同不代表分子数量相同</b>。",
      result.starts ? `三个 RNA 字母构成一个 codon；本例得到 <b>${result.protein.join(" → ")}</b>。这只预测短肽的字母顺序，无法预测蛋白丰度、折叠或活性。` : "没有从首密码子 AUG 启动，本模型不能给出蛋白产物。真实翻译起始还依赖转录本上下文。"
    ];
    if (byId("seq-observation").innerHTML!==notes[seqStep]) byId("seq-observation").innerHTML=notes[seqStep];
  }
  function resetSequence() {
    stopSequence(); seqStep=0; seqProgress=0; seqAnimated=false;
    byId("seq-play").textContent="播放信息流";
    byId("seq-motion-status").textContent="播放会按碱基和密码子推进；也可用下一步直接查看一个阶段。速度为教学设定，不代表分子反应速度。";
    renderSequence();
  }
  function advanceSequence() {
    if (!seqPlaying) return;
    const result=sequenceModel(seqInput.value);
    if (result.error) {stopSequence();return;}
    if (seqStep===0) {seqStep=1;seqProgress=0;}
    const length=seqStep===3?(result.starts?result.protein.length:1):result.dna.length;
    if (seqProgress>=length) {
      if (seqStep===3) {
        stopSequence("信息流演示完成。Stop 是终止信号，不是一种氨基酸；可重播或改变 DNA 输入。");
        byId("seq-play").textContent="重播信息流"; return;
      }
      seqStep++; seqProgress=0;
    }
    seqProgress++;seqAnimated=true;renderSequence();
    byId("seq-motion-status").textContent=seqStep===3?`翻译：读取第 ${seqProgress} 个密码子，RNA 阅读框每次前进 3 个字母。`:`${seqStep===1?"互补配对示意（不是复制过程模拟）":"转录示意"}：位置 ${seqProgress} / ${result.dna.length}；高亮同一位置的对应碱基。`;
    seqTimer=setTimeout(advanceSequence,seqStep===3?1000:320);
  }
  byId("seq-play").addEventListener("click",()=>{
    if(seqPlaying){stopSequence("已暂停。可观察当前对应位置，或继续播放。");return;}
    const result=sequenceModel(seqInput.value);if(result.error)return;
    if(seqStep===3 && (!seqAnimated||seqProgress>=(result.starts?result.protein.length:1)))resetSequence();
    else if(!seqAnimated&&seqStep>0){seqProgress=result.dna.length;}
    seqPlaying=true;byId("seq-play").textContent="暂停信息流";byId("seq-play").setAttribute("aria-pressed","true");advanceSequence();
  });
  seqInput.addEventListener("input",()=>{seqInput.value=seqInput.value.toUpperCase().replace(/\s+/g,"");resetSequence();});
  byId("seq-next").addEventListener("click",()=>{if(!sequenceModel(seqInput.value).error && seqStep<3){stopSequence();seqStep++;seqAnimated=false;seqProgress=0;byId("seq-play").textContent="播放后续阶段";byId("seq-motion-status").textContent="已直接显示整个阶段。可逐步查看或播放后续信息流。";renderSequence();}});
  byId("seq-reset").addEventListener("click",()=>{resetSequence();seqInput.focus();});
  document.querySelectorAll("[data-seq]").forEach(button=>button.addEventListener("click",()=>{seqInput.value=button.dataset.seq;resetSequence();}));
  pauseWhenAway("sequence",stopSequence);

  // Model 2: cell proportions, with fixed within-cell marker expression.
  function renderCells(targetId, tumorPercent, label) {
    const target=byId(targetId);
    const tumorDots=Math.round(tumorPercent/5);
    if (!target.children.length) target.replaceChildren(...Array.from({length:20},()=>{const dot=document.createElement("i");dot.setAttribute("aria-hidden","true");return dot;}));
    [...target.children].forEach((dot,i)=>dot.classList.toggle("immune",i>=tumorDots));
    target.setAttribute("aria-label",`${label}：20 个示意细胞点，约 ${tumorDots} 个肿瘤细胞、${20-tumorDots} 个免疫细胞`);
  }
  function renderMixture() {
    const a=mixtureModel(byId("mix-a").value),b=mixtureModel(byId("mix-b").value);
    byId("mix-a-value").textContent=`${a.tumorPercent}%`;
    byId("mix-b-value").textContent=`${b.tumorPercent}%`;
    renderCells("cells-a",a.tumorPercent,"样本 A");
    renderCells("cells-b",b.tumorPercent,"样本 B");
    byId("mix-immune-a").textContent=short(a.immuneMarker);
    byId("mix-immune-b").textContent=short(b.immuneMarker);
    byId("mix-tumor-a").textContent=short(a.tumorMarker);
    byId("mix-tumor-b").textContent=short(b.tumorMarker);
    const direction = a.immuneMarker === b.immuneMarker ? "相同" : b.immuneMarker > a.immuneMarker ? "较高" : "较低";
    byId("mix-observation").innerHTML=`样本 B 的免疫 marker 为 <b>${short(b.immuneMarker)}</b>，与 A 的 <b>${short(a.immuneMarker)}</b> 相比${direction}。计算：B 的免疫细胞占 ${b.immunePercent}% × 每个免疫细胞 12 = ${short(b.immuneMarker)}。<b>单细胞表达设定始终没变</b>；改变的只是组成。`;
  }
  let mixTimer=null,mixPlaying=false,mixStarted=false;
  function stopMixture(message) {
    if(!mixPlaying)return;clearTimeout(mixTimer);mixTimer=null;mixPlaying=false;
    byId("mix-play").textContent="继续组成演示";byId("mix-play").setAttribute("aria-pressed","false");
    if(message)byId("mix-motion-status").textContent=message;
  }
  function advanceMixture() {
    if(!mixPlaying)return;
    const percent=Number(byId("mix-b").value);
    if(percent>=100){stopMixture("演示完成：B 的肿瘤比例已到 100%。每细胞表达一直固定；点击可从 0% 重播。");byId("mix-play").textContent="重播组成演示";return;}
    byId("mix-b").value=percent+5;renderMixture();
    mixTimer=setTimeout(advanceMixture,650);
  }
  byId("mix-play").addEventListener("click",()=>{
    if(mixPlaying){stopMixture("已暂停，可对照当前比例和 bulk 数值。");return;}
    if(!mixStarted||Number(byId("mix-b").value)>=100){byId("mix-b").value=0;renderMixture();}
    mixStarted=true;mixPlaying=true;byId("mix-play").textContent="暂停组成演示";byId("mix-play").setAttribute("aria-pressed","true");
    byId("mix-motion-status").textContent="样本 A 固定；B 每步增加 5% 肿瘤细胞。圆点变化表示替换组织组成，不表示一种细胞变成另一种。";
    mixTimer=setTimeout(advanceMixture,650);
  });
  byId("mix-reset").addEventListener("click",()=>{stopMixture();mixStarted=false;byId("mix-a").value=80;byId("mix-b").value=40;byId("mix-play").textContent="播放 B：0% → 100%";byId("mix-motion-status").textContent="已恢复 A = 80%、B = 40%；单细胞表达设定没有变化。";renderMixture();});
  ["mix-a","mix-b"].forEach(id=>byId(id).addEventListener("input",()=>{stopMixture("已暂停自动演示，当前比例由你控制。");mixStarted=true;renderMixture();}));
  pauseWhenAway("mixture",stopMixture);

  // Model 3: same count matrix, three units. No statistical inference from a toy matrix.
  function renderNormalization() {
    const scenario=document.querySelector('input[name="norm-scenario"]:checked').value;
    const unit=document.querySelector('input[name="norm-unit"]:checked').value;
    const model=normalizationModel(scenario,unit);
    const body=byId("norm-body");
    body.replaceChildren(...model.genes.map((gene,i)=>{
      const row=document.createElement("tr");
      [gene.name,`${gene.kb} kb`,format(model.a[i]),format(model.b[i])].forEach((value,j)=>{
        const cell=document.createElement(j===0?"th":"td");cell.textContent=value;row.appendChild(cell);
      });return row;
    }));
    byId("norm-total-b").textContent=format(model.totalB);
    const max=Math.max(model.a[0],model.b[0]);
    byId("bar-a").style.width=`${max?100*model.a[0]/max:0}%`;
    byId("bar-b").style.width=`${max?100*model.b[0]/max:0}%`;
    byId("bar-label-a").textContent=format(model.a[0]);
    byId("bar-label-b").textContent=format(model.b[0]);
    const ratesA=model.rawA.reduce((sum,n,i)=>sum+n/model.genes[i].kb,0),ratesB=model.rawB.reduce((sum,n,i)=>sum+n/model.genes[i].kb,0);
    byId("norm-denominator").textContent=unit==="raw"?"当前直接显示分配计数；没有除以样本总量。":unit==="cpm"?`CPM 分母：A = ${format(model.totalA)}；B = ${format(model.totalB)}（本题三行 count 合计）。`:`TPM 分母：A = ${short(ratesA)}；B = ${short(ratesB)}（三行 count ÷ 长度 kb 后的 rate 合计）。`;
    const messages={
      depth:{raw:"G1 在 B 的 raw count 从 20 到 40，恰好翻倍；<b>三行 gene count 合计也从 200 到 400</b>。先不要把它叫作生物学上调。",cpm:"G1 在 A、B 都是 100,000 CPM；按本题三行总数缩放后，纯粹的测序深度差异消失。",tpm:"G1 在 A、B 都约 222,222 TPM；长度相同，所有基因 raw count 都 ×2，长度校正后的相对份额不变。"},
      composition:{raw:"B 的 G1 raw 仍为 20，G3 却从 100 增到 300；<b>G1 本身的 count 没变</b>，整列总数增加。",cpm:"B 的 G1 CPM 降为 50,000：G3 占了更多文库份额。<b>相对值下降不等于 G1 的绝对分子数下降</b>。",tpm:"B 的 G1 TPM 约 105,263；长度校正后，G3 依然占去更大份额。TPM 也受样本表达组成影响。"}
    };
    byId("norm-observation").innerHTML=messages[scenario][unit]+" <b>行 = gene，列 = sample；这张表每个值的单位取决于所选尺度。</b>";
  }
  document.querySelectorAll('input[name="norm-scenario"],input[name="norm-unit"]').forEach(input=>input.addEventListener("change",renderNormalization));

  const quizFeedback={
    sequence:{right:"对。RNA count 是定量流程归给该基因的 read 或 fragment 计数，取决于文库与流程；DNA 是否存在，需要 DNA 层证据。低表达或检测不足也会产生 0。",wrong:"再想想：DNA 序列和 RNA 读数属于两个测量层。正确答案是“不能”；RNA count=0 不证明 DNA 缺失。"},
    mixture:{right:"对。即使每个免疫细胞都保持同样的 12 个示意分子，免疫细胞比例增加也足以提高 bulk 值。",wrong:"这个推断跨过了细胞组成。正确答案是“不能”；本模型中每个免疫细胞的表达从未变化。"},
    counts:{right:"对。G1 raw 翻倍的同时，本题三行 gene count 合计也翻倍；CPM/TPM 在这个场景下不变。",wrong:"先看分母。正确答案是“不能”；本题所有基因的 count 一起翻倍，可能只是测得更深。"}
  };
  document.querySelectorAll(".checkpoint").forEach(box=>{
    box.querySelectorAll("[data-answer]").forEach(button=>button.addEventListener("click",()=>{
      box.querySelectorAll("[data-answer]").forEach(other=>{other.classList.remove("selected-correct","selected-wrong");other.setAttribute("aria-pressed",String(other===button));});
      const answer=button.dataset.answer;
      button.classList.add(answer==="right"?"selected-correct":"selected-wrong");
      box.querySelector(".quiz-feedback").textContent=quizFeedback[box.dataset.quiz][answer];
    }));
  });

  renderSequence();renderMixture();renderNormalization();
})();
