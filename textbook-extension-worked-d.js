/* Worked examples for infection, drugs, organismal form, and behavior. */
(() => {
  const examples = {
    j01:['检测到病原体，何时才叫 disease？',['在同一位病人中分开记录 microbe 检测、所在部位、宿主症状与组织损伤。','鼻腔 colonization 可没有 disease；同种 microbe 进入原本无菌部位可能造成 infection。','比较取样前后与对照人群，排查污染及非感染原因。','检测阳性、感染成立和“该病原体导致当前症状”是三个不同强度的判断。']],
    j02:['一个 virulence gene 能证明致病吗？',['画 adhesion → 进入/存活 → 组织损伤三步；某 gene 只可能参与其中一步。','比较 wild type、该 gene knockout 和 rescue strain 在匹配条件下的表现。','再看宿主免疫状态与取样部位是否影响结果。','基因存在不保证表达，更不保证单凭它能引发临床 disease。']],
    j03:['正链 RNA virus 的 RNA 为什么可直接翻译？',['画 host ribosome 读取 5′→3′ mRNA；某 positive-sense RNA genome 可先充当这种模板。','但要造出更多 genome，通常还需 viral RdRP 经互补 RNA 中间体复制。','把只检出 genome 与检出复制中间体/新粒子的证据分开。','不同 viral genome strategy 的第一步不同，不能套用同一张复制箭头图。']],
    j04:['有 receptor 就一定能感染？',['把 viral entry 分成接触、进入、uncoating、复制、组装和释放六个关口。','某 cell 表达 entry receptor，却可能缺少病毒所需宿主因子或能迅速抑制复制。','分别测进入后的 viral genome、viral RNA/protein 与感染性后代，而不是只测受体。','tropism 是整条 life cycle 在特定 cell 的兼容性，不是单个 receptor 名单。']],
    j05:['Bacterium 获得新耐药基因的三条路线',['画环境中游离 DNA、带 DNA 的 phage 和两个直接接触的 bacteria。','分别对应 transformation、transduction 和 conjugation；比较是否需要 phage 或细胞接触。','用有标记的 donor DNA 及适当阻断条件追踪来源。','发现相同 resistance gene 不直接说明传播路线，也可能来自共同祖先。']],
    j06:['MIC 较低就一定治疗成功吗？',['在培养皿中测 drug 浓度与 bacterial growth，得到体外 MIC。','再画给药量 → 血药暴露 → 病灶暴露 → pathogen target → 临床结局。','检查药物能否安全到达病灶，以及 biofilm、宿主免疫与耐药变化。','实验室敏感性与患者中的疗效相关，但不是一对一的保证。']],
    j07:['一次动物传人，就会出现大流行吗？',['画动物接触 → spillover 到人 → 人间传播的两道不同门槛。','记录一例感染不能证明后一门槛已打开；需调查继发病例和接触网络。','R₀ 是特定易感群体与条件下的平均量，不是病毒基因组上写死的常数。','把序列证据、流行病学接触史和采样偏差一起解释。']],
    j08:['服药 100 mg，靶点看到的也是 100 mg 吗？',['画口服 dose → 吸收 → 血中 concentration → tissue concentration → target occupancy → effect。','每一步都可能因代谢、清除、运输或 receptor 状态改变；相同 dose 可产生不同暴露。','分别用时间浓度曲线研究 PK，用浓度–效应曲线研究 PD。','治疗窗口须同时考虑有效和有害效应，不能由一个体外 Kd 决定。']],
    y01:['鲸鳍、人手和蝙蝠翼为何值得放在一起？',['不先看用途，先对齐骨骼位置与连接关系，找出共同的前肢基本结构。','再比较各自用于游泳、抓握和飞行时哪些部分被改造。','与昆虫翅的飞行功能相似做对照：功能相似不必然同源。','用发育、化石和 phylogeny 支持历史判断，不只靠外形。']],
    y02:['把小动物等比例放大十倍会怎样？',['若长度 ×10、几何形状不变，表面积约 ×100、体积约 ×1000。','身体重量与许多材料承载和散热量的 scaling 不同，较大动物通常需要改变结构和运动方式。','测 limb dimensions、肌力与 locomotion cost，检验哪个约束重要。','真实动物不会严格等比例放大；allometry 只是分析起点。']],
    y03:['鸟为什么此刻鸣唱？为什么这种行为存在？',['proximate 问题：今天日长、hormone 与 neural circuit 怎样让它开始唱。','ultimate 问题：在过去环境中，这种行为是否影响求偶或繁殖成功。','两类解释可以同时成立，而且需要不同实验和比较证据。','不能因为一个行为目前看起来有用，就断言它一定为该用途而演化。']],
    y04:['觅食更久一定更好吗？',['给动物两种选择：开阔地食物多但暴露风险高，隐蔽处食物少但安全。','用收益、时间和捕食风险构建简单 optimality model，再预测它停留多久。','实际观察若不合预测，检查模型遗漏的信息、能量限制或环境变化。','“最优”是给定假设下的预测，不表示动物在脑中计算方程。']],
    y05:['动物听到声音，何时它算 signal？',['雄蛙发出鸣声，雌蛙接收并改变择偶；记录 sender、medium、receiver 与 response。','捕食者的脚步声也携带信息，但不是为通知猎物而演化，可先称 cue。','改变背景噪声或声音频率，看接收与行为是否改变。','同一声响对不同 species 和环境未必传递相同信息。']],
    y06:['同一只鱼耐冷了，是发生进化吗？',['把一群鱼转入较冷水中，数日后个体生理状态改变，这是 acclimation 候选。','若不同环境下同一 genotype 呈现不同 phenotype，可画 reaction norm。','只有跨世代可遗传差异的频率改变，才是在讨论 population adaptation。','短期调节、发育 plasticity 与长期 evolution 需要不同时间尺度和数据。']]
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, worked] of Object.entries(examples)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for worked example: ${id}`);
    chapter.worked = worked;
  }
})();
