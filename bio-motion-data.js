/* Original, deliberately simplified teaching diagrams. No patient or assay values below are real. */
(() => {
  'use strict';
  const C = {ink:'#17324d', muted:'#52677e', blue:'#2563eb', cyan:'#0891b2', violet:'#7c3aed', pale:'#edf5ff', light:'#f8fbff', line:'#b6cce4', white:'#ffffff', gray:'#d7e2ee', orange:'#c26b20'};
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
  const root = (label, art) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320" role="img" aria-label="${esc(label)}"><defs><marker id="tip" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M 0 0 L 9 4.5 L 0 9 Z" fill="${C.muted}"/></marker></defs><rect width="720" height="320" rx="22" fill="${C.light}"/>${art}<text x="22" y="308" fill="${C.muted}" font-size="17" font-family="Arial, sans-serif">TOY · 教学示意，非真实实验或患者数据</text></svg>`;
  const group = (key, art) => `<g data-motion-key="${esc(key)}">${art}</g>`;
  const rect = (x,y,w,h,fill=C.white,stroke=C.line,rx=12,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
  const circle = (x,y,r,fill,stroke=C.white,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
  const line = (x1,y1,x2,y2,color=C.line,width=3,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
  const text = (x,y,value,color=C.ink,size=18,anchor='start',weight=600) => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" dominant-baseline="middle" font-family="Arial, sans-serif">${esc(value)}</text>`;
  const heading = (value, note) => text(28,31,value,C.ink,20) + text(692,31,note,C.muted,17,'end',400);

  function sequencing(cycle) {
    const template=['T','G','C','A'], product=['A','C','G','T'];
    let art=heading('DNA 模板 3′ → 5′','SBS · 一个 cluster 的简化视图');
    art+=line(73,114,636,114,C.line,5)+line(73,219,636,219,C.line,5);
    template.forEach((base,i)=>{const x=136+i*136;art+=group(`template-${i+1}`,rect(x-28,82,56,64,C.pale,C.blue,12)+text(x,115,base,C.blue,25,'middle'));});
    art+=text(52,115,'3′',C.muted,20)+text(658,115,'5′',C.muted,20);
    art+=text(52,219,'5′',C.muted,20)+text(658,219,'3′',C.muted,20);
    product.slice(0,cycle).forEach((base,i)=>{const x=136+i*136;art+=group(`new-base-${i+1}`,rect(x-28,187,56,64,i===cycle-1?C.cyan:C.blue,C.white,12)+text(x,220,base,C.white,25,'middle'));});
    const activeX=136+(cycle-1)*136;
    art+=group('cycle-signal',circle(activeX,164,14,C.violet,C.white)+line(activeX,145,activeX,187,C.violet,3));
    art+=text(360,272,`Cycle ${cycle}: ${template[cycle-1]} → ${product[cycle-1]} · read 5′-${product.slice(0,cycle).join('')}-3′`,C.ink,18,'middle');
    return root(`第 ${cycle} 轮测序：模板 ${template[cycle-1]} 对应新链加入 ${product[cycle-1]}，read 延长到 ${product.slice(0,cycle).join('')}`,art);
  }

  function readCount(stage) {
    const labels=['R1 · A','R2 · A','R3 · B','R4 · A/B'];
    const positions=[78,130,182,234];
    let art=heading('FASTQ reads → gene count','单端 · 精确匹配的 toy rule');
    art+=rect(478,69,203,84,C.pale,C.blue)+rect(478,181,203,84,'#f2edff',C.violet);
    art+=text(500,94,'Gene A',C.blue,19)+text(654,128,`count ${stage===1?0:stage===2?1:2}`,C.blue,18,'end');
    art+=text(500,206,'Gene B',C.violet,19)+text(654,240,`count ${stage<3?0:1}`,C.violet,18,'end');
    const progress=[0,1,3,4][stage-1];
    labels.forEach((label,i)=>{
      const active=i<progress, rejected=i===3&&stage===4;
      const x=active&&!rejected?(i===2?351:323):active?307:69;
      const y=positions[i];
      if(active){
        if(rejected){art+=line(x+132,y+17,478,109,C.violet,2,'stroke-dasharray="6 5"')+line(x+132,y+17,478,222,C.violet,2,'stroke-dasharray="6 5"');}
        else art+=line(x+132,y+17,478,i===2?222:109,i===2?C.violet:C.blue,3,'marker-end="url(#tip)"');
      }
      art+=group(`read-${i+1}`,rect(x,y,132,35,rejected?'#fff5eb':active?C.white:C.pale,rejected?C.orange:active?C.cyan:C.line,8)+text(x+12,y+18,label,rejected?C.orange:C.ink,18));
    });
    art+=text(25,278,stage===4?'R4 命中两个 gene：不计入任一 gene':'每个 read 先有序列与质量，再由比对和注释决定去向',stage===4?C.orange:C.muted,17);
    return root(`四条教学 read，当前第 ${stage} 步；Gene A count ${stage===1?0:stage===2?1:2}，Gene B count ${stage<3?0:1}${stage===4?'，R4 多基因匹配不计数':''}`,art);
  }

  function normalization(stage) {
    const sets=[
      {unit:'raw count', values:[[100,100],[100,300]], max:300,formula:'A 的 raw 不变；B 在 S2 从 100 增到 300'},
      {unit:'CPM', values:[[500000,500000],[250000,750000]], max:750000,formula:'CPM = count / 本题两行合计 × 10⁶'},
      {unit:'rate (count/kb)', values:[[100,50],[100,150]], max:150,formula:'长度：A 1 kb，B 2 kb；rate = count / kb'},
      {unit:'TPM', values:[[666667,333333],[400000,600000]], max:666667,formula:'TPM = rate / 本题两行 rate 合计 × 10⁶'}
    ];
    const d=sets[stage-1];
    let art=heading(d.unit,'S1：A 100, B 100 · S2：A 100, B 300');
    [0,1].forEach(sample=>{
      const x=49+sample*350;
      art+=rect(x,59,320,196,C.white,C.line,15)+text(x+22,83,`Sample S${sample+1}`,C.ink,20);
      [0,1].forEach(gene=>{
        const y=133+gene*86,value=d.values[sample][gene],w=150*value/d.max;
        art+=text(x+22,y,gene?'B':'A',gene?C.violet:C.blue,19);
        art+=group(`bar-s${sample+1}-g${gene?'b':'a'}`,rect(x+55,y-15,w,31,gene?C.violet:C.cyan,'none',7));
        art+=text(x+292,y,value.toLocaleString('en-US'),C.ink,18,'end');
      });
    });
    art+=text(360,278,d.formula,C.muted,17,'middle');
    return root(`${d.unit} 两个样本的 toy gene 数值：S1 A ${d.values[0][0]} B ${d.values[0][1]}；S2 A ${d.values[1][0]} B ${d.values[1][1]}`,art);
  }

  function bulkMixture(stage) {
    const tumors=[8,6,4,4][stage-1],immune=10-tumors,average=immune;
    let art=heading('组织细胞比例 → bulk marker','每细胞可捕获 RNA 总量相同的 toy 假设');
    art+=rect(36,66,413,201,C.white,C.line,16);
    art+=text(56,91,`Tumor ${tumors} / Immune ${immune}`,C.ink,20);
    let slot=0;
    for(let i=0;i<tumors;i++,slot++){const x=87+(slot%5)*72,y=146+Math.floor(slot/5)*65;art+=group(`tumor-${i+1}`,circle(x,y,21,C.blue)+text(x,y,'T',C.white,18,'middle'));}
    for(let i=0;i<immune;i++,slot++){const x=87+(slot%5)*72,y=146+Math.floor(slot/5)*65;art+=group(`immune-${i+1}`,circle(x,y,21,C.violet)+text(x,y,'I',C.white,18,'middle'));}
    art+=rect(474,66,213,201,C.pale,C.cyan,16)+text(492,94,'Immune marker',C.ink,19);
    if(stage===4){
      art+=text(492,128,'A: 8 T / 2 I → 2',C.muted,17);
      art+=group('bulk-reference',rect(492,145,34,23,C.cyan,'none',6));
      art+=text(492,199,'B: 4 T / 6 I → 6',C.violet,17);
      art+=group('bulk-bar',rect(492,215,102,23,C.violet,'none',6));
    }else{
      art+=text(492,133,'I: 10 · T: 0',C.muted,18);
      art+=rect(492,172,170,31,C.gray,'none',7);
      art+=group('bulk-bar',rect(492,172,170*average/10,31,C.violet,'none',7));
      art+=text(578,235,`bulk 平均 ${average}`,C.violet,21,'middle');
    }
    return root(`十个示意细胞中肿瘤 ${tumors} 个、免疫 ${immune} 个；固定单细胞免疫 marker 为 10，bulk 平均 ${average}`,art);
  }

  const spots=[[90,90],[135,105],[190,135],[250,100],[350,95],[80,160],[185,210],[270,190],[340,240],[120,255]];
  function spatialBinning(stage) {
    let art=heading('同一组 RNA 检测点，不同空间网格','点位保持不变');
    art+=rect(58,53,350,223,'#f4faff',C.cyan,8);
    if(stage>=2){
      const n=stage===2?2:4;
      for(let i=1;i<n;i++){
        const x=58+350*i/n,y=53+223*i/n;
        art+=group(`grid-v-${i*4/n}`,rect(x-1.5,53,3,223,C.blue,'none',0));
        art+=group(`grid-h-${i*4/n}`,rect(58,y-1.5,350,3,C.blue,'none',0));
      }
      art+=rect(58,53,350/n,223/n,'#e9dcff',C.violet,2,'fill-opacity="0.45"');
    }
    spots.forEach(([x,y],i)=>{art+=group(`transcript-${i+1}`,circle(x,y,7,C.violet,C.white));});
    if(stage===4){
      art+=group('cell-outline',`<ellipse cx="170" cy="137" rx="92" ry="70" fill="none" stroke="${C.cyan}" stroke-width="4" stroke-dasharray="9 6"/>`);
    }
    art+=rect(450,64,237,196,C.white,C.line,15);
    const label=stage===1?'原始点位':stage===2?'2 × 2 bins':stage===3?'4 × 4 bins':'bin ≠ cell';
    const count=stage===2?4:stage>=3?2:null;
    art+=text(471,96,label,C.blue,21)+text(471,135,stage===1?'10 个检测点':`左上 bin: ${count} 点`,C.ink,19);
    art+=text(471,175,stage===1?'尚未汇总':stage===2?'网格大，合并更多点':stage===3?'网格小，单格点更少':'虚线细胞跨多个 bin',C.muted,17);
    art+=text(471,220,'同一张组织坐标',C.cyan,18);
    return root(`固定十个 RNA 检测点；${label}${count===null?'':`，左上 bin 含 ${count} 点`}${stage===4?'，虚线细胞轮廓跨多个 bin':''}`,art);
  }

  const molecules=[[151,115],[185,188],[219,152],[371,122],[402,215],[440,161],[290,242]];
  function segmentation(stage) {
    let art=heading('RNA 点位 → 分割边界 → cell matrix','Xenium 式输出的简化 toy 图');
    art+=rect(48,60,441,220,'#edf5ff',C.line,14);
    art+=group('nucleus-a',circle(184,160,34,'#b8c9f9',C.blue));
    art+=group('nucleus-b',circle(402,160,34,'#d9c7ff',C.violet));
    if(stage>=2){
      art+=group('mask-a',`<ellipse cx="184" cy="160" rx="${stage===2?42:101}" ry="${stage===2?42:92}" fill="none" stroke="${C.blue}" stroke-width="4" stroke-dasharray="8 5"/>`);
      art+=group('mask-b',`<ellipse cx="402" cy="160" rx="${stage===2?42:101}" ry="${stage===2?42:92}" fill="none" stroke="${C.violet}" stroke-width="4" stroke-dasharray="8 5"/>`);
    }
    molecules.forEach(([x,y],i)=>{const color=stage===4?(i<3?C.blue:i<6?C.violet:C.orange):C.cyan;art+=group(`rna-spot-${i+1}`,circle(x,y,7,color,C.white));});
    art+=rect(512,65,174,190,C.white,C.line,14);
    const labels=[['RNA detections','7 point coordinates'],['Nuclear masks','2 nuclei'],['Cell boundaries','larger than nuclei'],['Cell × gene','A 3 · B 3']][stage-1];
    art+=text(529,98,labels[0],C.ink,19)+text(529,137,labels[1],C.muted,18);
    if(stage===4)art+=text(529,190,'1 unassigned',C.orange,18);
    else art+=text(529,190,stage===1?'无 cell ID':stage===2?'边界仍待定义':'点位准备分配',C.muted,17);
    return root(`七个教学 RNA 点位，${labels[0]}：${labels[1]}${stage===4?'，另有一点未分配到细胞':''}`,art);
  }

  function node(key,x,y,w,label,kind='blue',dim=false) {
    const color=kind==='violet'?C.violet:kind==='cyan'?C.cyan:C.blue;
    return group(key,rect(x,y,w,37,dim?'#eef1f5':C.white,dim?C.gray:color,8,dim?'opacity="0.55"':'')+text(x+12,y+19,label,dim?C.muted:C.ink,17));
  }
  function cohortJoin(stage) {
    let art=heading('Case → sample → file','GDC 数据实体的 toy ID');
    art+=text(55,76,'Case',C.blue,20)+text(280,76,'Sample / type',C.cyan,20)+text(515,76,'File',C.violet,20);
    const dim=stage===4;
    if(stage>=2){
      art+=line(185,119,269,119,C.line,2)+line(185,119,269,166,C.line,2)+line(185,222,269,222,C.line,2);
    }
    if(stage>=3){
      [[463,119,503,104],[463,119,503,143],[463,166,503,182],[463,222,503,231]].forEach(([x1,y1,x2,y2],i)=>{art+=line(x1,y1,x2,y2,dim&&i===2?C.gray:C.line,2);});
    }
    art+=node('case-p01',55,100,130,'P01')+node('case-p02',55,203,130,'P02');
    if(stage>=2){art+=node('sample-s01',269,100,194,'S01 · Tumor','cyan');art+=node('sample-s02',269,148,194,'S02 · Normal','cyan',dim);art+=node('sample-s03',269,203,194,'S03 · Tumor','cyan');}
    if(stage>=3){art+=node('file-f01',503,86,175,'F01 · RNA','violet');art+=node('file-f02',503,125,175,'F02 · RNA','violet');art+=node('file-f03',503,164,175,'F03 · RNA','violet',dim);art+=node('file-f04',503,213,175,'F04 · RNA','violet');}
    const captions=['2 cases · 患者层 n = 2','3 samples · P01 有 tumor 和 normal','4 files · 同一 sample 可有多个文件','筛 Tumor：2 cases · 2 samples · 3 files'];
    art+=text(360,273,captions[stage-1],C.ink,19,'middle');
    return root(`${captions[stage-1]}；教学 ID 只说明实体层级，文件数不是独立患者数`,art);
  }

  const tileNames=['P01-T1','P01-T2','P02-T1','P02-T2','P03-T1','P03-T2'];
  function leakage(stage) {
    let art=heading('Tile 分组改变评估结论','三位 toy 患者，每人两张 tile');
    art+=rect(35,66,310,213,C.pale,C.blue,15)+rect(375,66,310,213,'#f4efff',C.violet,15);
    art+=text(54,91,stage===1?'Patient groups':'TRAIN',C.blue,20)+text(395,91,stage===1?'待拆分':'TEST',C.violet,20);
    if(stage===1){for(let patient=0;patient<3;patient++)art+=rect(54,108+patient*48,277,43,C.white,C.line,8);}
    tileNames.forEach((name,i)=>{
      let x,y;
      if(stage===1){x=63+(i%2)*141;y=114+Math.floor(i/2)*48;}
      else if(stage===2){const train=i%2===0;x=(train?63:405);y=114+Math.floor(i/2)*48;}
      else {const train=i<4;x=train?63+(i%2)*141:405+(i%2)*141;y=train?126+Math.floor(i/2)*62:150;}
      art+=group(`tile-${i+1}`,rect(x,y,112,35,C.white,i%2?C.violet:C.cyan,7)+text(x+8,y+18,name,C.ink,17));
    });
    if(stage===2){for(let i=0;i<3;i++)art+=line(338,131+i*48,382,131+i*48,C.orange,3,'stroke-dasharray="5 5"');}
    if(stage===4){art+=line(244,233,391,233,C.cyan,3,'marker-end="url(#tip)"')+text(360,255,'fit on TRAIN → apply to TEST',C.cyan,17,'middle');}
    const captions=['先识别嵌套：tile ⊂ patient','按 tile 拆分：3 位患者跨 train/test','按 patient 拆分：共享患者 = 0','预处理只在 train 拟合，再应用到 test'];
    if(stage<4)art+=text(360,275,captions[stage-1],stage===2?C.orange:C.ink,17,'middle');
    return root(`${captions[stage-1]}，教学示意中独立患者数始终为三`,art);
  }

  const scenes = [
    {
      id:'sequencing', title:'一轮测序如何长出一条 read？', subtitle:'模板碱基、合成新链与仪器信号逐轮对应', chapters:['d02','q01','q02','q03'], sources:['illuminaSBS','illuminaQ'],
      assumption:'教学示意：只画一个 4 bp 模板片段与一个 cluster；固定模板 3′-TGCA-5′，按互补配对生成 5′-ACGT-3′。不模拟接头、PCR、真实荧光通道或错误。',
      steps:[
        {title:'Cycle 1：先读到 A',body:'模板 T 对应新链加入 A。画中的亮点表示这一轮仪器可读信号；它还不是一个基因的表达值。',svg:sequencing(1)},
        {title:'Cycle 2：read 延长为 AC',body:'下一轮模板 G 对应 C。read 的顺序按新链 5′→3′ 记录；两轮只是两个碱基，不是两个独立样本。',svg:sequencing(2)},
        {title:'Cycle 3：获得 ACG',body:'模板 C 对应 G。每轮有碱基判读与质量信息；质量差时，记录的字母可能有误。',svg:sequencing(3)},
        {title:'Cycle 4：形成 ACGT',body:'模板 A 对应 T。真实 FASTQ 还记录 read ID 和逐碱基质量；之后才谈比对与计数。',svg:sequencing(4)}
      ]
    },
    {
      id:'read-count', title:'Read 怎么变成 gene count？', subtitle:'同一条 read 经过比对与注释，才可能给某个 gene +1', chapters:['d02','d04','q03','q04','k04'], sources:['gdcRNA','samSpec'],
      assumption:'四条虚构单端 read；假定通过质量门槛，精确比对；只在唯一归到一个 gene 时 +1。此规则仅供教学，真实 STAR/workflow 对多重比对与计数的处理要按版本核对。',
      steps:[
        {title:'先有四条 read',body:'左边是四条教学 read。FASTQ 只有序列和质量，还没有 gene count；一条 read 也不等于一个 RNA 分子。',svg:readCount(1)},
        {title:'R1 唯一归到 A',body:'R1 通过比对和 gene 注释，只对应 Gene A，本题给 A +1。真实流程需要参考基因组和注释版本。',svg:readCount(2)},
        {title:'R2 与 R3 继续分配',body:'R2 归到 A，R3 归到 B；现在 A=2、B=1。这些是处理后的单端 read 计数，不能直接当每细胞分子数。',svg:readCount(3)},
        {title:'R4 多基因匹配',body:'R4 同时可能归到 A/B；本题规则不计入任一基因，所以最终仍是 A=2、B=1。真实文件的 raw/未分配行需按具体 workflow 读。',svg:readCount(4)}
      ]
    },
    {
      id:'normalization', title:'为什么同一 raw count 会换出不同数字？', subtitle:'分母、基因长度和样本组成依次进入计算', chapters:['d04','k04','q05','q06','q07'], sources:['gdcRNA','tpmPaper','deseq2Guide'],
      assumption:'两基因完整 toy feature 集：A 长 1 kb，B 长 2 kb；S1 raw=(100,100)，S2 raw=(100,300)。假定两行 count 合计也正好等于公式使用的 mapped read/fragment 总量；无未分配 reads。每步是同一数据的不同尺度，柱长度按当步最大值重新缩放，不能跨单位比较柱长，更不能当差异表达检验。',
      steps:[
        {title:'Raw：A 仍是 100',body:'A 在两样本 raw 都为 100；B 从 100 到 300。仅凭两份 raw 不能断定 A 的绝对 RNA 分子数相同或 B 发生生物上调。',svg:normalization(1)},
        {title:'CPM：先换分母',body:'toy 总数 S1=200、S2=400。A 的 CPM 从 500,000 变为 250,000，尽管 raw 仍为 100；这是组成和分母效应。',svg:normalization(2)},
        {title:'回到 Raw：除以长度',body:'从原始 count 重新计算 TPM 的第一步：raw ÷ 假设长度（kb）。B 的 rate 为 50 与 150，A 仍为 100；上一步 CPM 是另一个分支。真实长度定义取决于定量层级与流程。',svg:normalization(3)},
        {title:'TPM：缩放全部 rate',body:'只因 toy 两行就是完整纳入 feature 集，未四舍五入的 TPM 在每个样本相加为 1,000,000。TPM 是相对丰度，不等于每细胞分子数，也不替代差异表达模型。',svg:normalization(4)}
      ]
    },
    {
      id:'bulk-mixture', title:'Bulk 高表达可能只是细胞比例变了', subtitle:'固定每类细胞的 marker，改变样本里的细胞组成', chapters:['t03','d04','d07','s01'], sources:['nciTME','gdcRNA'],
      assumption:'十个 toy 细胞；肿瘤细胞 T 的免疫 marker=0，免疫细胞 I 的 marker=10；各细胞贡献相同的可捕获 RNA 总量。图中 bulk 数值为每细胞示意平均，不是 raw read count。',
      steps:[
        {title:'8 T + 2 I：bulk 平均 2',body:'免疫 marker 只来自 2 个免疫细胞；toy 平均值为 2。单个免疫细胞的 marker 固定为 10。',svg:bulkMixture(1)},
        {title:'6 T + 4 I：平均升到 4',body:'免疫细胞多了，原有细胞的表达设定没有改变。bulk 值升高可以仅由组成解释。',svg:bulkMixture(2)},
        {title:'4 T + 6 I：平均升到 6',body:'比例继续改变，bulk 值继续上升。真实组织的不同细胞 RNA 含量与捕获率还会影响混合结果。',svg:bulkMixture(3)},
        {title:'回头看推断边界',body:'免疫 marker 从 2 到 6 不能单凭 bulk 证明每个免疫细胞“更活跃”。要分辨比例与细胞内状态，需额外证据或合适的单细胞/空间测量。',svg:bulkMixture(4)}
      ]
    },
    {
      id:'spatial-binning', title:'Spatial bin 为什么不是一个细胞？', subtitle:'固定 RNA 点位，只改变汇总网格的大小', chapters:['d07','s01','s02','k08'], sources:['visiumHD','visiumMatrix','visiumSpatial'],
      assumption:'十个虚构 RNA 点位在同一二维组织坐标；2×2 和 4×4 都是人为选择的教学网格。每个点在所属 bin 计一次；不模拟真实平台捕获、扩散或定量误差。',
      steps:[
        {title:'先看点位',body:'同一组织区域有 10 个 toy RNA 检测点。点位是坐标，不自动带有细胞身份。',svg:spatialBinning(1)},
        {title:'2×2：左上 bin 有 4 点',body:'粗网格把多个点汇成一个 bin 的计数。这个 bin 可以跨细胞边界，不能直接称为一个细胞。',svg:spatialBinning(2)},
        {title:'4×4：左上 bin 变为 2 点',body:'点位一动未动；缩小 bin 后，同名左上格的边界改变，计数从 4 变为 2。比较时必须记录 bin 尺度。',svg:spatialBinning(3)},
        {title:'叠加细胞轮廓',body:'虚线细胞轮廓跨多个 bin。bin × gene 矩阵和 cell × gene 矩阵是不同单位，需要明确分割和汇总规则。',svg:spatialBinning(4)}
      ]
    },
    {
      id:'segmentation', title:'细胞边界怎么改变空间表达矩阵？', subtitle:'同一批 RNA 点位，经不同边界与分配规则变成 cell × gene', chapters:['d07','s03','k07','k08'], sources:['xeniumSeg','xeniumOutput'],
      assumption:'七个虚构已检测 RNA 点位与两个示意细胞；图中的轮廓是手绘教学 mask，不是 Xenium 算法结果。这里只统计同一 marker；一个未落入 cell mask 的点保持未分配。',
      steps:[
        {title:'先有点位和细胞核',body:'点位和核的位置只是图像/检测数据；此时还不能把每个 RNA 点归到 cell ID。',svg:segmentation(1)},
        {title:'画出核轮廓',body:'核分割得到两个较小的 mask。只用核轮廓会漏掉细胞质中的 RNA，不能把核边界直接当细胞边界。',svg:segmentation(2)},
        {title:'估计细胞边界',body:'教学轮廓扩到细胞范围；点位自身未变，潜在分配对象却改变。真实输出要查实际分割方法与版本。',svg:segmentation(3)},
        {title:'按 cell ID 汇总',body:'本题 cell A=3、B=3，另有 1 点未分配；同一检测点列表经边界和质量规则才成为 cell × gene 值，不是无误差的“真实每细胞分子数”。',svg:segmentation(4)}
      ]
    },
    {
      id:'cohort-join', title:'为什么 4 个 file 不是 4 位患者？', subtitle:'GDC 的 case、sample、file 是不同实体', chapters:['r01','r02','r06','k02'], sources:['gdcBarcode','gdcDoc','gdcRNA'],
      assumption:'完全虚构的 P01/P02、S01–S03、F01–F04；P01 同时有 tumor/normal，S01 有两个 RNA file。实际队列须核对 sample_type、workflow 和 file 元数据。',
      steps:[
        {title:'先数 case：2',body:'如果研究目标是患者层面的推断，toy 中独立 case 只有 P01/P02 两位。病例 ID 是临床表连接键。',svg:cohortJoin(1)},
        {title:'再接 sample：3',body:'P01 有 tumor 和 normal 两份材料，P02 有一份 tumor。三份 sample 仍只来自两位患者。',svg:cohortJoin(2)},
        {title:'再接 file：4',body:'S01 对应两个 RNA 文件，文件行数增加并没有创造新患者；还要核对 assay/workflow 及是否重复处理。',svg:cohortJoin(3)},
        {title:'按 sample_type 筛选',body:'保留 tumor 后是 2 case、2 sample、3 file。按 case 接临床字段，避免把 P01 的两个 file 当成两个独立结局。',svg:cohortJoin(4)}
      ]
    },
    {
      id:'data-leakage', title:'为什么拆分 tile 要先看 patient ID？', subtitle:'同一患者的图像碎片会共享信号', chapters:['d01','d08','r03','k10'], sources:['sklearnGroup','sklearnLeak'],
      assumption:'三位虚构患者，每人两张 tile；tile 名中的 Pxx 是 patient ID。只演示分组泄漏与预处理顺序，不报告任何模型精度。',
      steps:[
        {title:'先识别嵌套关系',body:'6 张 tile 不是 6 位独立患者。要预测患者级结局时，独立单位是 P01/P02/P03。',svg:leakage(1)},
        {title:'按 tile 拆：患者跨两边',body:'每位患者的一张 tile 进 train，另一张进 test；测试集仍含训练患者的形态与染色信息，评估可能偏乐观。',svg:leakage(2)},
        {title:'按 patient 拆：不再共享',body:'P01/P02 只在 train，P03 只在 test；共享患者数为 0。toy 样本太小，不能据此估计真实泛化性能。',svg:leakage(3)},
        {title:'连预处理也守住边界',body:'标准化、特征选择等从 train 拟合，再应用到 test；若先看全体数据，仍可能泄漏。真实任务还要考虑医院/扫描仪等域转移。',svg:leakage(4)}
      ]
    }
  ];
  window.BIOCS_MOTION_SCENES = [...(window.BIOCS_MOTION_SCENES || []), ...scenes];
})();
