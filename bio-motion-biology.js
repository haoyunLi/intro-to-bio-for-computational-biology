// Original teaching diagrams. Every sequence and numerical example below is invented.
(() => {
  const C = {bg:'#f7f9fd', ink:'#17345b', muted:'#526a88', blue:'#4d79bf', teal:'#239b93', purple:'#8b6cb3', pink:'#c86e83', gold:'#d39a41', pale:'#e6eefb', mint:'#e0f4ef', lilac:'#eee7f7', gray:'#dce4ed'};
  const text = (x,y,s,color=C.ink,size=19,weight=600,anchor='start') => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,'Microsoft YaHei',sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${s}</text>`;
  const box = (x,y,w,h,fill,stroke='none',rx=12,sw=2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const line = (x1,y1,x2,y2,color=C.muted,sw=3,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const arrow = (x1,y1,x2,y2,color=C.ink,sw=4) => {
    const a=Math.atan2(y2-y1,x2-x1), q=12, p1=`${x2-q*Math.cos(a-.48)},${y2-q*Math.sin(a-.48)}`, p2=`${x2-q*Math.cos(a+.48)},${y2-q*Math.sin(a+.48)}`;
    return line(x1,y1,x2,y2,color,sw)+`<polygon points="${x2},${y2} ${p1} ${p2}" fill="${color}"/>`;
  };
  const circle = (x,y,r,fill,stroke='none',sw=2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const svg = (label,inside) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320" role="img" aria-label="${label}">${box(0,0,720,320,C.bg,'none',18)}${inside}</svg>`;
  const cap = (s) => text(32,39,s,C.ink,23,700);
  const strand = (x,y,w,seq,color) => box(x,y,w,42,color,'none',11)+text(x+w/2,y+28,seq,'#fff',21,700,'middle');
  const track = (key,markup) => `<g data-motion-key="${key}">${markup}</g>`;
  const step = (title,body,art) => ({title,body,svg:art});

  function replicationArt(k) {
    let v=cap('DNA 复制 · 每条旧链做模板');
    if(k===0){
      v+=track('old-top',strand(150,87,420,'5′  A T C G  3′',C.blue))+track('old-bottom',strand(150,161,420,'3′  T A G C  5′',C.blue));
      for(let x=205;x<=515;x+=103)v+=line(x,130,x,159,C.muted,2,'4 5');
      v+=text(360,254,'一条双链 DNA',C.muted,20,600,'middle');
    } else if(k<4){
      v+=track('old-top',strand(112,73,496,'旧链  5′  A T C G  3′',C.blue))+track('old-bottom',strand(112,213,496,'旧链  3′  T A G C  5′',C.blue));
      if(k===1){v+=arrow(360,130,360,185,C.purple)+text(425,168,'分开',C.purple,19,700,'middle');}
      if(k>=2){
        const w=k===2?124:390;
        v+=track('new-on-top',box(608-w,123,w,31,C.teal,'none',8))+track('new-on-bottom',box(112,167,w,31,C.teal,'none',8));
        v+=arrow(574,160,478,160,C.teal,3)+arrow(145,204,242,204,C.teal,3);
        v+=text(360,309,'新链只沿自身 5′→3′ 延长',C.muted,18,600,'middle');
      }
    } else {
      v+=track('old-top',strand(54,79,290,'旧 5′ ATCG 3′',C.blue))+track('new-on-top',strand(54,133,290,'新 3′ TAGC 5′',C.teal));
      v+=track('new-on-bottom',strand(376,79,290,'新 5′ ATCG 3′',C.teal))+track('old-bottom',strand(376,133,290,'旧 3′ TAGC 5′',C.blue));
      v+=text(360,262,'每条子代双链 = 1 条旧链 + 1 条新链',C.ink,20,700,'middle');
    }
    return svg(`DNA 复制第 ${k+1} 步，${['原始双链','旧链分开','新链开始延长','新链继续延长','两个半保留双链'][k]}`,v);
  }

  function transcriptionArt(k){
    let v=cap('转录 · RNA 以 DNA 模板合成');
    v+=box(52,70,116,42,C.lilac,'none',9)+text(110,98,'启动子',C.purple,19,700,'middle');
    v+=strand(176,71,486,'编码链  5′  A T C G  3′',C.blue)+strand(176,154,486,'模板链  3′  T A G C  5′',C.blue);
    v+=arrow(179,126,206,126,C.purple,3)+text(190,146,'TSS',C.purple,17,700);
    if(k>=1 && k<4){
      const px=[0,230,315,445,555][k];
      v+=track('rna-polymerase',box(px,110,108,53,C.purple,'none',25)+text(px+54,144,'聚合酶','#fff',18,700,'middle'));
    }
    if(k>=2){
      const seq=['','','5′ AU','5′ AUCG','5′ AUCG 3′'][k];
      v+=track('rna-product',box(164,224,k===2?150:278,43,C.mint,C.teal,10)+text(k===2?239:303,252,seq,C.teal,21,700,'middle'));
      v+=text(555,218,'RNA',C.teal,20,700,'middle');
    }
    if(k===4)v+=arrow(452,246,618,246,C.teal,4);
    if(k===0)v+=text(360,259,'RNA 与模板互补；和编码链近似，只把 T 写为 U',C.muted,18,600,'middle');
    return svg(`转录第 ${k+1} 步，${['DNA 与启动子','RNA 聚合酶结合','RNA 开始延长','RNA 延长','RNA 释放'][k]}`,v);
  }

  const exon=(x,y,w,label) => box(x,y,w,52,C.teal,'none',9)+text(x+w/2,y+34,label,'#fff',20,700,'middle');
  const intron=(x,y,w,label,active=false) => box(x,y,w,52,active?C.lilac:C.gray,active?C.purple:C.muted,9,2)+text(x+w/2,y+34,label,active?C.purple:C.muted,19,700,'middle');
  function splicingArt(k){
    let v=cap('剪接 · 从 pre-mRNA 到不同连接');
    if(k<=2){
      v+=track('exon-one',exon(38,119,105,'E1'))+track('intron-one',intron(153,119,100,'I1',k>=1))+track('exon-two',exon(263,119,105,'E2'))+track('intron-two',intron(378,119,100,'I2',k>=1))+track('exon-three',exon(488,119,105,'E3'));
      if(k===0)v+=text(360,221,'一条含外显子与内含子的前体 RNA',C.muted,19,600,'middle');
      if(k===1){v+=circle(204,105,11,C.purple)+circle(429,105,11,C.purple)+text(360,222,'剪接机器识别边界',C.purple,19,700,'middle');}
      if(k===2){v+=arrow(202,179,202,228,C.purple)+arrow(428,179,428,228,C.purple);v+=text(360,269,'内含子被移除，外显子接起来',C.muted,19,600,'middle');}
    } else {
      v+=text(46,104,'转录本 A',C.blue,18,700)+track('exon-one',exon(187,65,118,'E1'))+track('exon-two',exon(308,65,118,'E2'))+track('exon-three',exon(429,65,118,'E3'));
      if(k>=4){v+=text(46,218,'转录本 B',C.purple,18,700)+track('alt-exon-one',exon(187,178,118,'E1'))+track('alt-exon-three',exon(308,178,118,'E3'));}
      if(k===3)v+=text(360,271,'一种产物：E1 → E2 → E3',C.muted,19,600,'middle');
      if(k===4)v+=text(360,292,'另一些 RNA 分子可跳过 E2',C.muted,19,600,'middle');
      if(k===5){
        v+=box(291,85,48,20,C.gold,'none',7)+box(291,198,48,20,C.gold,'none',7);
        v+=text(360,292,'跨接 read 只支持局部连接',C.muted,19,600,'middle');
      }
    }
    return svg(`RNA 剪接第 ${k+1} 步，${['前体 RNA','识别剪接位点','移除内含子','一种成熟转录本','另一种成熟转录本','读段支持局部连接'][k]}`,v);
  }

  function translationArt(k){
    let v=cap('翻译 · 三个 RNA 字母为一组');
    v+=line(61,167,660,167,C.teal,8);
    const codons=[['AUG',88],['GCU',287],['UAA',486]];
    codons.forEach(([s,x],i)=>{v+=track(`codon-${i}`,box(x,139,126,56,k===0?C.mint:i<2?C.mint:C.lilac,i===2?C.purple:C.teal,9)+text(x+63,175,s,i===2?C.purple:C.teal,23,700,'middle'));});
    v+=text(58,183,'5′',C.teal,19,700)+text(668,183,'3′',C.teal,19,700);
    if(k>=1 && k<4){const x=[0,93,93,291][k];v+=track('ribosome',`<ellipse cx="${x+64}" cy="113" rx="98" ry="42" fill="${C.pale}" stroke="${C.blue}" stroke-width="3"/>`+text(x+64,120,'核糖体',C.blue,19,700,'middle'));}
    if(k>=2){
      const aa=(x,y,s,color)=>circle(x,y,25,color)+text(x,y+7,s,'#fff',18,700,'middle');
      v+=track('amino-met',aa(k===4?268:164,68,'Met',C.purple));
      if(k>=3){v+=line(k===4?293:189,68,k===4?338:259,68,C.ink,4);v+=track('amino-ala',aa(k===4?363:284,68,'Ala',C.gold));}
      if(k===2)v+=arrow(164,101,164,130,C.purple,3);
    }
    if(k===4){v+=box(472,220,176,46,C.lilac,'none',10)+text(560,251,'STOP：释放',C.purple,19,700,'middle');}
    if(k===0)v+=text(360,259,'教学 mRNA：AUG | GCU | UAA',C.muted,20,700,'middle');
    if(k===1)v+=text(360,259,'先确定起始位置与阅读框',C.muted,19,600,'middle');
    if(k===3)v+=text(360,258,'新肽键：Met–Ala',C.muted,19,600,'middle');
    return svg(`翻译第 ${k+1} 步，${['教学 mRNA','核糖体识别起始','甲硫氨酸进入','加上丙氨酸','终止与释放'][k]}`,v);
  }

  function cellCycleArt(k){
    let v=cap('细胞周期 · DNA 量与倍性分开看');
    const phase=['G1','S：复制中','G2','M：分离中','两个子细胞'][k];
    v+=box(39,57,160,40,C.pale,'none',10)+text(119,84,phase,C.blue,19,700,'middle');
    if(k<4){
      v+=track('cell-main',circle(360,171,88,'#fff',C.blue,5));
      const rods=k<2?[[334,151,334,192],[386,151,386,192]]:k===2?[[327,143,344,188],[344,143,327,188],[376,143,393,188],[393,143,376,188]]:[[300,149,300,190],[390,149,390,190],[330,149,330,190],[420,149,420,190]];
      rods.forEach((p,i)=>v+=track(`chromatid-${i}`,line(...p,k<2?(i===0?C.teal:C.purple):(i<2?C.teal:C.purple),6)));
      if(k===1){v+=circle(360,104,9,C.gold)+text(360,275,'DNA 复制正在发生',C.muted,19,600,'middle');}
      if(k===3)v+=line(360,90,360,251,C.gray,3,'7 7');
    }else{
      v+=track('cell-main',circle(248,172,68,'#fff',C.blue,5))+track('cell-daughter',circle(482,172,68,'#fff',C.blue,5));
      v+=line(232,153,232,188,C.teal,6)+line(265,153,265,188,C.purple,6)+line(465,153,465,188,C.teal,6)+line(498,153,498,188,C.purple,6);
      v+=text(248,269,'2n · 2C',C.ink,19,700,'middle')+text(482,269,'2n · 2C',C.ink,19,700,'middle');
    }
    if(k<4){
      const dna=k===0?'2C':k===1?'2C → 4C':'4C';
      v+=box(502,102,171,116,C.mint,'none',14)+text(588,144,`DNA 量 ${dna}`,C.teal,19,700,'middle')+text(588,183,k===3?'分裂中':'倍性 2n',C.ink,20,700,'middle');
    }
    return svg(`细胞周期第 ${k+1} 步，${phase} 的 DNA 量与倍性`,v);
  }

  function receptorShape(active){
    const color=active?C.teal:C.purple;
    return line(349,135,349,179,color,8)+line(349,135,322,107,color,8)+line(349,135,376,107,color,8)+line(349,179,322,204,color,7)+line(349,179,376,204,color,7);
  }
  function receptorArt(k){
    let v=cap('受体信号 · 结合不等于结果已经发生');
    v+=line(42,178,678,178,C.blue,7)+line(42,199,678,199,C.blue,7);
    v+=text(42,105,'细胞外',C.muted,19,600)+text(42,253,'细胞内',C.muted,19,600);
    v+=track('receptor',receptorShape(k>=2));
    const lx=k===0?164:k===1?288:349, ly=k===0?82:k===1?74:83;
    v+=track('ligand',circle(lx,ly,22,C.purple)+text(lx,ly+6,'L','#fff',18,700,'middle'));
    if(k>=2)v+=text(427,123,'受体状态改变',C.teal,18,700);
    if(k>=3){
      v+=track('relay-one',circle(280,252,22,C.mint,C.teal)+text(280,259,'P',C.teal,19,700,'middle'));
      v+=track('relay-two',circle(430,252,22,k>=4?C.mint:'#fff',C.teal)+text(430,259,k>=4?'P':'?',C.teal,19,700,'middle'));
      v+=arrow(305,252,402,252,C.teal,3);
    }
    if(k===4){v+=box(518,228,140,53,C.lilac,'none',12)+text(588,261,'下游反应',C.purple,19,700,'middle');}
    return svg(`受体信号第 ${k+1} 步，${['未结合','配体接近','配体结合','下游传递','可能的细胞反应'][k]}`,v);
  }

  function transportArt(k){
    let v=cap('膜运输 · 四条路线不能画成串联');
    v+=text(34,89,'外侧',C.muted,19,700)+text(34,257,'内侧',C.muted,19,700);
    v+=line(54,143,675,143,C.blue,6)+line(54,169,675,169,C.blue,6);
    const xs=[154,306,458,610];
    const labels=['O₂ 扩散','离子通道','葡萄糖载体','ATP 泵'];
    xs.forEach((x,i)=>v+=text(x,300,labels[i],i===k-1?C.teal:C.muted,18,700,'middle'));
    v+=track('ion-channel',box(286,125,41,64,C.pale,C.blue,13));
    v+=track('carrier',box(432,127,52,61,C.mint,C.teal,16));
    v+=track('active-pump',box(586,125,52,64,C.lilac,C.purple,16));
    const small=(x,y,s,fill)=>circle(x,y,22,fill)+text(x,y+6,s,'#fff',18,700,'middle');
    v+=track('oxygen',small(xs[0],k>=1?229:95,'O₂',C.pink));
    v+=track('ion',small(xs[1],k>=2?229:95,'Na⁺',C.blue));
    v+=track('glucose',small(xs[2],k>=3?229:95,'G',C.teal));
    v+=track('solute-x',small(xs[3],k>=4?88:230,'X',C.purple));
    if(k>=1)v+=arrow(xs[0]+37,112,xs[0]+37,216,C.pink,3);
    if(k>=2)v+=arrow(xs[1]+37,112,xs[1]+37,216,C.blue,3);
    if(k>=3)v+=arrow(xs[2]+38,112,xs[2]+38,216,C.teal,3);
    if(k>=4){v+=arrow(xs[3]-38,217,xs[3]-38,105,C.purple,3)+text(664,230,'ATP',C.purple,18,700,'middle');}
    if(k===0)v+=text(360,61,'教学条件：前三种顺梯度；X 逆梯度',C.muted,18,600,'middle');
    return svg(`跨膜运输第 ${k+1} 步，${['四个独立路线','氧直接扩散','离子过通道','葡萄糖过载体','溶质主动运输'][k]}`,v);
  }

  function enhancerArt(k){
    let v=cap('Enhancer · 候选调控元件到因果证据');
    const blocked=k===5;
    v+=track('dna-rail',line(49,156,674,156,C.blue,8));
    v+=track('enhancer',box(93,129,124,53,blocked?C.gray:C.lilac,blocked?C.muted:C.purple,11)+text(155,162,'enhancer',blocked?C.muted:C.purple,18,700,'middle'));
    v+=track('promoter',box(414,129,112,53,C.mint,C.teal,11)+text(470,162,'启动子',C.teal,18,700,'middle'));
    v+=track('target-gene',box(546,129,116,53,C.pale,C.blue,11)+text(604,162,'gene X',C.blue,19,700,'middle'));
    if(k>=1 && !blocked)v+=track('tf',circle(155,91,23,C.purple)+text(155,97,'TF','#fff',18,700,'middle'));
    if(k>=2 && !blocked)v+=`<path d="M 156 126 C 225 68, 400 68, 470 126" fill="none" stroke="${C.purple}" stroke-width="5" stroke-dasharray="8 7"/>`+text(354,76,'可能空间接近',C.purple,18,700,'middle');
    if(k>=3 && !blocked)v+=track('polymerase',box(k===3?399:438,193,92,42,C.teal,'none',20)+text(k===3?445:484,221,'Pol II','#fff',18,700,'middle'));
    if(k>=4){
      const n=blocked?1:3;
      for(let i=0;i<n;i++)v+=track(`rna-${i}`,box(538+i*39,242,31,22,C.mint,C.teal,8));
      v+=text(538,295,blocked?'较少 RNA':'更多 RNA',C.teal,18,700);
    }
    if(blocked){v+=line(122,102,189,211,C.pink,6)+line(189,102,122,211,C.pink,6)+text(355,77,'教学干预：抑制候选元件',C.pink,19,700,'middle');}
    if(k===0)v+=text(360,252,'序列上相隔较远；目标基因待验证',C.muted,19,600,'middle');
    return svg(`增强子第 ${k+1} 步，${['候选区域','转录因子结合','可能的空间接近','聚合酶被招募','观测 RNA 增加','干预后 RNA 下降'][k]}`,v);
  }

  const scenes = [
    {id:'replication',title:'DNA replication · 复制',subtitle:'两条旧链各做模板，为什么叫半保留？',chapters:['m01','g01'],sources:['osReplication','osFork','nhDNA'],assumption:'教学用 4 nt DNA；只画模板配对和 5′→3′ 延长，不按真实比例展示复制叉、引物或冈崎片段。',steps:[
      step('一条双链 DNA','初始对象是一条互补且反向平行的双链。序列文件只写字母；分子里实际还有方向、骨架和两条链。',replicationArt(0)),
      step('旧链分开','两条旧链分开，暴露各自的碱基，均可充当模板。这是在复制 DNA，不是把它转录成 RNA。',replicationArt(1)),
      step('新链开始延长','新核苷酸按互补规则加到正在生长的链。新链自身只能沿 5′→3′ 延长；图中两侧相反的方向由模板反向平行造成。',replicationArt(2)),
      step('继续复制','新链延长，覆盖更多模板位置。真实细胞有引物、校对和复杂复制叉，本图只保留序列信息如何传递。',replicationArt(3)),
      step('得到两条子代双链','每条子代双链各含一条旧链、一条新链。测序 VCF 后来报告的是样本相对参考的序列证据，不是直接观看细胞中这次复制。',replicationArt(4))
    ]},
    {id:'transcription',title:'Transcription · 转录',subtitle:'模板链、编码链、RNA 如何对应？',chapters:['m02','m03'],sources:['osTranscription','nhTrans','nhDogma'],assumption:'ATCG/TAGC 与 AUCG 是虚构短序列；图省略真实启动子结构、方向特异调控、RNA 加工和转录延伸复杂性。',steps:[
      step('先确定哪条是模板','RNA 聚合酶读取模板链 3′→5′；本例编码链为 5′–ATCG–3′。若把方向读反，RNA 字符串也会错。',transcriptionArt(0)),
      step('在起点附近开始','启动子附近的蛋白帮助转录机器定位；图上 TSS 是转录起点。启动子信号本身不等于某样本已生成多少 RNA。',transcriptionArt(1)),
      step('RNA 开始出现','新 RNA 以模板互补规则沿 5′→3′ 延长；本例先看到 AU。RNA-seq 测得的是建库、测序和计数后的信号。',transcriptionArt(2)),
      step('延长到教学终点','本例 RNA 成为 5′–AUCG–3′，与编码链相近但 U 代替 T。真实基因远长得多，也可产生不同转录本。',transcriptionArt(3)),
      step('RNA 离开 DNA','图中的 RNA 被释放；真核 mRNA 还常需加帽、剪接等加工。一个 RNA count 高，不直接证明蛋白活性高。',transcriptionArt(4))
    ]},
    {id:'splicing',title:'Splicing · RNA 剪接',subtitle:'同一基因如何产生不同转录本？',chapters:['m04','g02'],sources:['nhSplice','ncbiRNA','rmats'],assumption:'E1/E2/E3 与 I1/I2 是虚构外显子/内含子；两种产物表示不同 RNA 分子可能采取的路径，不代表同一分子同时变成两条。真实转录与剪接在时间上可以重叠，这里拆成步骤只为教学。',steps:[
      step('先有前体 RNA','一条教学 pre-mRNA 含 E1、E2、E3 外显子与 I1、I2 内含子。gene-level count 常把多个转录本汇总。',splicingArt(0)),
      step('识别剪接边界','剪接机器识别连接位置。仅知道基因 DNA 有这几个外显子，并不能推断这个样本实际采用哪种连接。',splicingArt(1)),
      step('移除内含子','内含子被移除，保留下来的片段接起来。RNA-seq 的跨接读段可提供某个连接存在的局部证据。',splicingArt(2)),
      step('一种成熟产物','一些 RNA 分子可形成 E1→E2→E3；这是一种转录本。它的数量和另一个转录本的数量需要分别估计。',splicingArt(3)),
      step('另一种连接','另一些 RNA 分子可形成 E1→E3，跳过 E2。两组样本即使 gene 总 count 相同，异构体比例也可能不同。',splicingArt(4)),
      step('读段只看到一小段','黄色块代表跨连接的短 read。E1→E3 junction read 支持这种局部连接，但不能仅靠它证明整条 RNA 的所有外显子排列；零条 read 也不等于生物学上绝无。',splicingArt(5))
    ]},
    {id:'translation',title:'Translation · 翻译',subtitle:'三联体怎样变成氨基酸链？',chapters:['m05','m02'],sources:['nhTranslation','nhCode','ncbiCode','osProtein'],assumption:'虚构 mRNA 5′–AUG GCU UAA–3′；按标准遗传密码表 AUG→Met、GCU→Ala、UAA→stop，仅演示一个短开放阅读框。',steps:[
      step('先把 RNA 分组三联体','mRNA 按 5′→3′ 阅读。本例每三个字母组成一个 codon；换一个起点会得到不同的阅读框。',translationArt(0)),
      step('找到起始位点','教学模型从 AUG 开始；核糖体确定阅读框。RNA-seq count 本身不告诉我们每个 RNA 都正在翻译。',translationArt(1)),
      step('加入第一个氨基酸','AUG 对应 Met，tRNA 帮助把氨基酸带进核糖体。密码子到氨基酸是序列规则，不是蛋白活性测量。',translationArt(2)),
      step('形成更长的肽链','下一个 GCU 对应 Ala，形成 Met–Ala。真实蛋白后续还需折叠、定位或修饰。',translationArt(3)),
      step('终止并释放','UAA 是终止密码子，不编码第三个氨基酸；短肽释放。DNA 变异可能影响阅读框或密码子，但功能后果仍需验证。',translationArt(4))
    ]},
    {id:'cell-cycle',title:'Cell cycle · 细胞周期',subtitle:'为什么 2n 的细胞可以有 4C DNA？',chapters:['c05','m01'],sources:['osCycle','osCheckpoint','nhCycle'],assumption:'只画一个典型二倍体、顺利完成分裂的细胞；图中的两条染色体仅是示意。2n 是染色体套数，C 是相对核 DNA 量；细胞也可停在 G0。',steps:[
      step('G1：复制前','教学二倍体细胞处于 G1 时，染色体套数记 2n，核 DNA 量为 2C。DNA 含量测量看到 2C 峰也不能只凭这一列确认细胞命运。',cellCycleArt(0)),
      step('S：DNA 在复制','进入 S 期后，DNA 量从 2C 逐渐走向 4C，而不是一瞬间跳变；此时并没有因为复制就变成 4n。流式 DNA 染色强度可粗略提示这个连续分布。',cellCycleArt(1)),
      step('G2：复制完成','每条染色体的 DNA 已复制为姐妹染色单体；整体 DNA 量约 4C，倍性仍描述为 2n。RNA count 高不能单独告诉我们细胞已到 G2。',cellCycleArt(2)),
      step('M：分开姐妹染色单体','有丝分裂过程中，复制得到的姐妹染色单体分向两侧。图固定在分裂中的教学快照；真实检查点、染色体排列与分离不是一个简单按钮。',cellCycleArt(3)),
      step('分裂后的两个细胞','成功分裂后，每个子细胞通常回到 2n、2C。原细胞的 4C 并非一个子细胞永久多出一套染色体；肿瘤细胞也可能偏离这套典型模型。',cellCycleArt(4))
    ]},
    {id:'receptor',title:'Receptor signaling · 受体信号',subtitle:'配体结合后，究竟测到了哪一级？',chapters:['c04','c01'],sources:['osSignalPropagation','nciSignal','osTransportPassive'],assumption:'虚构膜受体与 L 配体；只示意一种可能含磷酸化中继的路线，不代表所有受体、配体或组织都走同一网络。',steps:[
      step('受体在膜上','受体跨越膜，配体 L 还在外部；膜受体可在外侧接收信号，L 不必自己穿膜。基因 RNA 高仅是受体数量的间接线索。',receptorArt(0)),
      step('配体接近','L 移向受体；接近并不等于已结合。空间图上两类细胞相邻、配体和受体 RNA 共表达，也不能直接证明分子接触。',receptorArt(1)),
      step('发生结合','教学例子中 L 与受体结合，使受体状态改变。是否真结合，需要结合、占位或相应实验；不能从一个 transcript 值推断。',receptorArt(2)),
      step('细胞内开始传递','该教学路线中出现下游磷酸化中继。phosphosite 信号可比受体总蛋白更接近短时活动，但单个位点仍不能定义整个通路。',receptorArt(3)),
      step('可能产生反应','信号网络进一步改变细胞内状态；结果可能涉及 RNA、代谢或行为，需按时间测量。图不表示每次结合必然让细胞增殖。',receptorArt(4))
    ]},
    {id:'transport',title:'Membrane transport · 膜运输',subtitle:'扩散、通道、载体与泵分别怎么过膜？',chapters:['c01','b05'],sources:['osTransportPassive','osTransportActive','os5'],assumption:'四条并列的虚构路线：O₂、Na⁺、葡萄糖沿各自有利梯度向内；X 在外侧较多，需 ATP 驱动向外逆势运输。实际离子方向还受膜电位和通道状态影响。',steps:[
      step('先画边界与梯度','四个对象在膜两侧，路线彼此独立。判断运输方向前要知道浓度与离子的电位条件；只看运输蛋白 RNA 无法读出通量。',transportArt(0)),
      step('O₂ 直接扩散','小的非极性 O₂ 在这个教学条件下顺梯度穿过脂质双层。位移代表净方向，不表示每个分子只朝一个方向运动。',transportArt(1)),
      step('Na⁺ 借助通道','离子通过开放的通道沿电化学梯度净向内移动。通道提供路径，本身不等同于消耗 ATP 的泵；流量还需电位与开关状态。',transportArt(2)),
      step('葡萄糖借助载体','本例极性葡萄糖经载体顺有利梯度进入；载体会有构象变化。图示不能从表达值推出真实摄取率，需直接测摄取。',transportArt(3)),
      step('X 由主动运输外排','本例泵消耗 ATP，把 X 从低浓度一侧送到高浓度一侧。主动运输也可耦联其他梯度；这里的 X 是虚构溶质，不代表特定真实泵。',transportArt(4))
    ]},
    {id:'enhancer',title:'Enhancer · 增强子',subtitle:'从候选序列，到目标基因的功能证据。',chapters:['m06','g02'],sources:['encodeGlossary','encodeScreen','nhPromoter','osTranscription'],assumption:'gene X、位置、TF 和 RNA 数量均为虚构教学例。虚线环只表示可能的空间接近；候选增强子不一定调控最近基因，也不保证始终提高转录。最后一步是假设在匹配条件下做了特异干预。',steps:[
      step('先标记候选区域','DNA 上的候选 enhancer 与 gene X 在序列上相隔一段距离。ATAC 开放或 cCRE 注释可提供候选线索，却不能单独指定目标基因。',enhancerArt(0)),
      step('调控蛋白结合','教学条件下 TF 与候选区域结合。结合测量比 RNA 表达更接近这个事件，但仍不能单凭它宣布 gene X 必然被激活。',enhancerArt(1)),
      step('可能发生空间接近','染色质折叠可让较远序列在三维空间靠近；虚线不是一条信号分子飞向 gene X。接触数据仍是调控目标的候选证据。',enhancerArt(2)),
      step('转录机器可能被招募','在本例中，启动子附近聚合酶参与转录。真实调控依赖细胞类型、抑制因子和时间；不要把图中的环当成普遍必要步骤。',enhancerArt(3)),
      step('观测 RNA 差异','教学对照条件下 gene X 的 RNA 信号较高。ATAC、TF 结合、空间接触与 RNA 同时出现仍主要是关联，需要检查细胞组成和测量差异。',enhancerArt(4)),
      step('用干预测试功能','虚构匹配实验中抑制候选区域后，gene X 的 RNA 下降；这种对照比只看相关性更支持该区域在此条件下的功能。仍要排查脱靶并验证其他条件。',enhancerArt(5))
    ]}
  ];

  window.BIOCS_MOTION_SCENES = [...(window.BIOCS_MOTION_SCENES || []), ...scenes];
})();
