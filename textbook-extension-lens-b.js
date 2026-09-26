/* Neuroscience through animal behavior: observation, row unit, and inference boundary. */
(() => {
  const details = {
    n01:['电极记录 membrane potential 随时间变化。','一条记录来自一个 neuron、位置和刺激条件；重复脉冲不是独立动物。','电压变化可支持 ion-channel 模型，但不能仅凭波形确定每种 ion 的贡献。'],
    n02:['电极或成像可测 synapse 后的电位或 calcium signal。','记录 presynaptic input、postsynaptic cell、时间与 receptor 阻断条件。','同一种 neurotransmitter 的效果取决于 receptor；亮度不能直接当成兴奋性。'],
    n03:['神经活动成像和行为测量记录 circuit 的不同输出。','同一动物内多个 neuron/试次彼此相关，需保留 animal ID。','某区域活动相关不等于它是唯一或足以产生行为的控制中心。'],
    n04:['受控刺激与行为报告分开测外部输入和 perception。','刺激强度、感受器状态、报告方式及试次要对齐。','行为选择不是直接拍到主观体验；同一输入可有不同解释。'],
    n05:['训练前后测行为及 synaptic/circuit state。','试次嵌套于同一动物；记录训练间隔与延迟测试。','一次活动增强不等于形成持久记忆，也不证明单一 molecule 储存记忆。'],
    o01:['野外调查记录物种在某位置是否被发现。','一行是地点×时间×采样努力；未发现与真实不存在不同。','分布图不能只凭空白判断 habitat 不适合。'],
    o02:['连续普查估计出生、死亡、迁入和迁出。','按年龄结构和时间记录 population，不能只留总数。','短期增长率不保证长期指数增长。'],
    o03:['食物网研究把物种丰度、饮食和相互作用连起来。','观察单位可为地点、季节和物种对；配对观察并非独立实验。','负相关不能单独证明捕食，也可能来自共同环境。'],
    o04:['biomass、呼吸与同位素读数观察能量和元素的不同侧面。','库存量、浓度与单位时间通量不能混为一列。','元素可循环，能量在转换中耗散；高 biomass 不等于高流速。'],
    o05:['群落调查、基因型和功能性状分别量化 biodiversity。','比较时固定地点、面积、采样努力和时间。','相同 species count 不能代表相同功能、互动或恢复力。'],
    a04:['代谢物或 tracer 可观察 glucose carbon 进入 pentose phosphate pathway。','NADPH 比值与带标记的中间物分别是状态与碳流线索。','pathway gene RNA 多不等于 NADPH production flux 更高。'],
    a06:['脂质组与 isotope tracing 分开观察脂肪存量和合成/分解。','样本需标明 fed/fasted 状态、组织、时间及 lipid species。','脂肪池变小可能是合成少或消耗多，不能只凭终点区分。'],
    a07:['氨基酸、尿素和 tracer 读数追踪 carbon 与 nitrogen。','血和尿是不同区室；浓度要配采样时间及排泄量。','某氨基酸浓度高不直接说明其分解速度高。'],
    a08:['全身代谢需要多组织、血中分子与时间序列。','同一血样读数汇集 liver、muscle、adipose 等组织作用。','单个 tissue 的 RNA pathway 图不能给出全身物质通量。'],
    a09:['空间代谢物、氧和细胞标记可对齐 tumor 与 immune cell。','分析单位是 patient 与区域；每个像素不是独立患者。','营养竞争是候选机制，需与酸度、cytokine 和其他路径区分。'],
    a10:['质谱峰强度给 metabolite abundance，带标记底物的时间序列给 flux 线索。','记录内标、峰注释、采样时间、precursor labeling 和组织。','代谢物库存高不等于生成速率快；峰也未必是绝对浓度。'],
    w08:['flow cytometer 逐 event 记录散射和 fluorescence。','gating 顺序、单色对照、compensation 和 donor ID 决定最终比例。','gate 是分析规则；同一 donor 的十万个 events 不是十万个生物重复。'],
    w10:['实验记录把原始材料、文件、处理决定和图表连接。','每张图应能追到 sample ID、protocol、软件与参数版本。','能重画同一张图不一定证明 biological claim；仍要检查设计和独立重复。'],
    z01:['结构测量或预测提供 protein 的某些构象线索。','结构模型要关联 sequence、条件、链和状态，不能只存 PDB ID。','一张静态结构不涵盖活 cell 中全部构象和功能。'],
    z02:['pulse-chase 与降解实验区分 protein 合成和清除。','按时间记录 protein pool、标记比例与处理条件。','总 protein abundance 不变也可能掩盖快速周转。'],
    z03:['binding assay 测不同 ligand 浓度下的结合比例。','Kd、occupancy 与 cell response 分别是不同参数或读数。','高 affinity 不自动表示在 cell 中高占据或强效应。'],
    z04:['enzyme assay 测单位时间产物增加与 substrate 浓度关系。','初始反应速率须带温度、pH、enzyme amount 和 substrate。','较高 protein abundance 或较低 Km 都不直接给出活 cell 的 flux。'],
    z05:['ion current 和膜电位读数观察 electrochemical driving force。','注明膜两侧 ion 浓度、charge、channel 状态和时间。','只看浓度梯度不能断定带电 ion 的净流方向。'],
    z06:['衍射、cryo-EM 图像与 NMR 信号分别约束结构模型。','模型需附分辨率/局部质量、缺失区域及实验条件。','坐标文件不是直接拍摄的原子真值，也不是动态功能证明。'],
    z07:['结构预测文件提供坐标、pLDDT 与 PAE 等信心指标。','局部结构信心与 domain 相对方向是不同问题。','高预测信心不等于实验证实结合、定位或药效。'],
    j01:['培养、PCR 和症状/病理记录分别说明微生物存在与宿主损伤。','保留采样部位、时间、宿主状态与阴性对照。','阳性检测不自动等于 infection，更不自动证明致病因果。'],
    j02:['菌株基因组与感染模型可检验 adhesion、toxin 等步骤。','对照野生型、knockout、rescue 和相同宿主条件。','virulence gene 的存在不保证表达或导致疾病。'],
    j03:['viral genome、RNA 中间体与感染性粒子分别观察复制阶段。','记录 RNA 方向、采样时间与是否为可感染 particle。','仅有 viral genome 不能证明 cell 内正在复制。'],
    j04:['受体、入胞信号、viral RNA 和新粒子分别测 life cycle 关口。','按 cell type、病毒株和时间记录，不把 entry 当完整 infection。','有 receptor 仍可能因胞内限制而不产生后代 virus。'],
    j05:['phage、plasmid 和 bacterial genome 数据可追踪 gene transfer。','保留 donor、recipient 与传递条件；相同基因未必同一路线。','不能仅凭相似 resistance sequence 判定 transduction 或 conjugation。'],
    j06:['MIC 与药物暴露曲线分别测体外抑菌和体内暴露。','药物、isolate、病灶、剂量、时间及宿主状态须匹配。','体外 MIC 不能单独预测安全给药后一定治愈。'],
    j07:['病例接触史、序列和抽样日期共同描述传播。','区分动物到人的 spillover 与后续人传人病例。','R₀ 随接触网络与易感性而变，不是 pathogen 固定属性。'],
    j08:['血药浓度–时间曲线与浓度–效应曲线分别回答 PK 和 PD。','dose、血中暴露、tissue 暴露、target 和效果需分列。','给药量不等于靶点实际暴露，体外 affinity 也不等于治疗窗口。'],
    y01:['解剖、发育和序列比较共同判断结构的历史来源。','对齐相应骨骼/组织，而不是只比功能相似。','共同用途不证明 homology，外形差异也不排除共同祖先。'],
    y02:['视频与力传感器测运动学，身体尺寸与材料性质约束力学。','长度、面积、体积和体重有不同 scaling；注明物种与速度。','小动物等比例放大不能自动预测真实大动物的 locomotion。'],
    y03:['行为记录表与 hormone/神经读数回答不同层级问题。','一次行为需标个体、情境、时间和可重复的 ethogram 类别。','proximate 机制证据不自动证明该行为为何被自然选择保留。'],
    y04:['觅食选择与收益/风险记录可检验 strategy 模型。','模型条件、可用信息和个体状态要显式写出。','行为偏离“最优”预测可能是模型漏掉约束，不是动物犯了数学错误。'],
    y05:['声音、光或气味与接收者反应共同定义信息链。','同时记录 sender、medium、receiver、环境噪声与行为结果。','检测到刺激不证明它是专为接收者演化的 signal，可能只是 cue。'],
    y06:['同一 genotype 跨环境的 phenotype 曲线可显示 plasticity。','个体内短期变化与跨世代 allele frequency 需要不同取样设计。','acclimation 不能直接称为 evolutionary adaptation。']
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, [signal, unit, limit]] of Object.entries(details)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for data lens: ${id}`);
    if (window.BIOCS_DATA_LENS[id]) throw new Error(`Duplicate data lens: ${id}`);
    const keys = [...new Set(chapter.sections.flatMap(section => section[2] || []))].slice(0, 2);
    window.BIOCS_DATA_LENS[id] = [signal, unit, limit, keys, null];
  }
})();
