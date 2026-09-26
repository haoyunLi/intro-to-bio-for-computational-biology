/* Concrete novice-first examples replace the generic four-step template. */
(() => {
  const examples = {
    x03:['为什么末端会变短？',['画一段线性 DNA，把末端标成 3′ 与 5′；在 lagging strand 的末端放一个 RNA primer。','移走最后一个 primer 后，DNA polymerase 没有更上游的 3′-OH 可以从该处填回缺口。','比较有无 telomerase 的细胞：它可延长模板末端，但这不等于细胞能无限制增殖。','若实验测到 telomere 变短，仍要检查细胞分裂次数、测量方法和群体组成。']],
    x07:['同一段 DNA，为什么不同 cell 有不同 RNA？',['设想两个 cell 有相同 gene sequence；一个 cell 的附近 chromatin 较开放，另一个较紧。','开放状态增加某些 factor 接近 DNA 的机会，RNA 可能不同；histone mark 或 methylation 只是候选调控线索。','同时测 ATAC 与 RNA，确认二者在同一 cell type 和时间点是否一起变化。','再改变候选调控区域；仅凭相关的两个轨道不能断言某 mark 是原因。']],
    x11:['同一 genotype 不等于同一 phenotype',['假设 10 人都携带同一个风险 allele，只有 6 人出现某 phenotype：教学样本里的 penetrance 是 6/10。','在这 6 人里，症状可能轻重不同，这描述 expressivity，而不是 penetrance。','列出年龄、环境、其他 loci 和诊断方式等替代解释。','不要把 6/10 当作所有人群的固定值；需要合适队列和置信区间。']],
    x12:['身高为何不是一个“高个基因”？',['画出 100 个小效应 allele，每个只让预测身高略有移动；再画营养与成长环境的影响。','两个 genotype 相同的人也可能因环境产生不同 phenotype；两个不同 genotype 也可能长得一样高。','Heritability 是特定人群和环境中变异的比例，不是单个人身高里“多少百分比由基因造成”。','跨人群使用 polygenic score 前检查 ancestry、训练数据和环境是否相容。']],
    x13:['GWAS 一个点亮了，能找到 causal gene 吗？',['想象 SNP A 与 B 常一起遗传，疾病病例中 A 更常见，B 也会一起显著。','先画 LD block，区分 lead SNP 与真正产生效应的未知 variant。','再看 fine-mapping、相关 tissue 的 eQTL 与 perturbation；最近的 gene 只是一个候选。','若 ancestry 或 population structure 与病例状态相关，关联甚至可能不来自该 locus 的因果效应。']],
    x16:['把相关线索变成可检验的因果线索',['假设 gene X 的 RNA 在 tumor 中升高，并与增殖 marker 相关。','在合适 cell model 中抑制 X，观察增殖；用多个 guide 和 non-targeting control 排除 off-target。','再用抗干扰的 X 构建体 rescue：若 phenotype 回来，支持 X 的参与。','模型内作用仍不自动等于患者里的治疗靶点；检查组织、剂量和独立模型。']],
    e02:['节点旋转后，亲缘关系变了吗？',['画树 ((A,B),C)：A 与 B 的最近共同祖先比它们与 C 的更近。','把 A、B 在纸上的左右位置交换，或旋转整棵子树；分叉仍是 ((B,A),C)。','若 branch 没有长度比例尺，不根据线段画得长短比较“演化多少”。','最后问树有没有 root、tip 代表什么、节点支持来自什么数据。']],
    e04:['“更健康”与 fitness 是同一回事吗？',['设想 allele A 让个体平均活得更久，却在当前环境下留下较少后代。','比较 A 与其他 allele 的相对后代贡献，而不是只比较寿命或体型。','改变环境或 allele 频率时，收益可能翻转；把环境写进结论。','用多代追踪或竞争实验测 proxy，并说明 proxy 不等于全部自然史。']],
    e05:['地理隔开后就成了两个 species 吗？',['起初两群动物能交配；河流形成后，群体间 gene flow 减少。','几千代后检查再次接触时是否还会交配、后代能否生育，以及 genome 交换程度。','仅有形态差异不足以断定完全生殖隔离；仅有少量杂交也未必否定长期分化。','先说明采用哪个 species 概念，再报告证据与边界。']],
    u01:['没有 nucleus 就“简单”吗？',['画 bacterium、archaeon、eukaryotic cell：前两者没有 membrane-bound nucleus，但都需复制、代谢和环境响应。','比较 membrane lipid、ribosome 组成或 genome 信息处理，可见 bacteria 与 archaea 也不相同。','用一个环境样本的 sequence 分类前，先问 marker gene 和参考库能分到什么层级。','“prokaryote”描述某些细胞结构，不是低级或静止的演化阶段。']],
    u02:['病毒需要宿主，和细菌有什么不同？',['把 bacterium 想成具备自身 ribosome 的 cell；virus 粒子携带 genome，却需进入合适宿主 cell 才能复制。','追踪 entry → genome expression → genome replication → assembly → release。','PCR 检出 viral genome 只表明有序列；不能单独证明存在可复制的感染性粒子。','比较抗菌药与 antiviral target 时，先问目标步骤是否存在于该 pathogen。']],
    u03:['“会生长”背后的三种输入',['画一个 microbe 的三个需求：carbon 用来搭身体、energy 驱动工作、electron donor/acceptor 支持氧化还原。','比较用有机 carbon 和 oxygen 的菌与不用 oxygen 的菌；两者的代谢路径和产物不同。','生长曲线变陡可能来自更快 division，也可能是培养条件或测量 proxy 变化。','报告 medium、氧条件、温度、时间以及 OD 是否已校准到 cell number。']],
    u04:['菌群名单改变了，就知道功能变了吗？',['比较治疗前后 stool 中 species A 的相对比例：10% 变 20%。','分母中的其他微生物变少，也能让 A 比例上升，而 A 绝对数量不变。','把饮食、药物、采样时间与宿主状态列为竞争解释。','想问功能，应再看 absolute abundance、代谢物或扰动，而不是只看相对条形图。']],
    u05:['抗生素后耐药株为何变多？',['教学例：用药前 1000 个 bacteria 中已有 10 个 resistant，药物杀死大多数 sensitive cell。','用药后 resistant 的比例可能升高，即使没有任何 cell “为了活下来”定向突变。','追踪 plasmid 和接触传播可检验 horizontal gene transfer 是否也加入了耐药。','把体外 MIC、药物在病灶的浓度和临床结果分开，不把某一个数当全部疗效。']],
    h02:['药物进入血液要跨哪些边界？',['从肠腔画到 epithelial cell、组织液和血液；每个箭头对应一层不同的障碍。','即使药物能穿过单层 membrane，也可能被 transporter 排出或在肠壁代谢。','用 tracer 或吸收曲线区分屏障通透性与全身清除的影响。','不要把培养皿里的 permeability 值直接写成口服 bioavailability。']],
    h03:['血氧 98%，组织一定不缺氧吗？',['教学例：两人 pulse oximeter 都读 98%，但一人 hemoglobin 很低。','饱和度说已存在的 hemoglobin 有多少位点被氧占据，不是血液携氧总量。','再检查 hemoglobin、cardiac output 和局部 perfusion，沿氧运输链寻找瓶颈。','同一患者连续测量是纵向记录，不是许多独立患者。']],
    h04:['尿里少了某物，说明过滤少了吗？',['写下排出量 = filtered − reabsorbed + secreted，先给三项都标单位。','某溶质 filtered 100 单位、reabsorbed 90、secreted 0，最终排出 10；若回收变成 95，排出就变 5。','因此只看尿中浓度不能定位 glomerulus；还需血浓度、尿量与清除率等信息。','疾病数据解释时还要考虑生成量、药物和观察时间。']],
    h05:['激素浓度高，作用也更强吗？',['想象两人血中 insulin 都高，但一人的 target tissue 对信号较不敏感。','画 gland → blood → receptor → response → feedback，找出每一处可改变结果的节点。','同一数值在饭前、饭后和不同采样时刻可能含义不同。','若目标是定位故障，配合下游 response 与动态刺激测试，而非只盯一项浓度。']],
    h06:['吃下一份糖后，血糖由哪几个箭头决定？',['画食物消化、肠道吸收、肝脏输出、肌肉摄取和储存五个箭头。','餐后 blood glucose 下降可能来自吸收变少，也可能来自组织摄取增加。','分别用 tracer、时间序列或控制进食量的实验区分这些路径。','一次空腹血样不是整天 glucose flux 的录像。']],
    h07:['一个 embryo 的十个 cell 是十次独立实验吗？',['先画 parent pair → reproductive cycle → embryo → cell 的嵌套关系。','十个 cell 共享同一个 embryo、遗传来源与许多培养条件，不能当十个独立妊娠。','比较处理时在合适层级分配和汇总，并记录每层样本数。','讨论 sex-related phenotype 时明确测量的是 chromosome、gonad、hormone 还是其他层级。']]
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, worked] of Object.entries(examples)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for worked example: ${id}`);
    chapter.worked = worked;
  }
})();
