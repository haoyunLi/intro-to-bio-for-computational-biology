/* Worked examples for signaling, development, immunity, brain, and ecology. */
(() => {
  const examples = {
    l02:['一个外部信号怎样变成 cell 内响应？',['把 ligand 放在 cell 外、GPCR 放在 membrane、G protein 和 second messenger 放在 cell 内。','ligand 结合后，receptor 改变形状，使 G protein 状态变化；下游 messenger 把效应扩散到多个 target。','用相同 ligand 浓度记录早期 messenger 与稍晚的 cell response，区分输入和输出。','receptor RNA 多不保证信号强；还要看 receptor protein、定位及反馈。']],
    l03:['生长因子升高，为什么不等于一定增殖？',['画 growth factor → RTK → RAS–MAPK 与 PI3K–AKT 两条分支。','一条分支可影响 cell-cycle 程序，另一条可影响存活与 metabolism；不同 cell 状态会改变结果。','在短时间序列中测 phospho-protein，再测后期分裂与死亡，而不是只测一个 RNA marker。','加入 pathway inhibitor 和 rescue，检查反馈及其他 pathway 是否补偿。']],
    l05:['同样总剂量，持续时间不同会怎样？',['给两组 cell 相同总量的 signaling input：一组短而强，一组长而弱。','每 5 分钟测一次 phospho-signal，画出峰值、持续时间和恢复速度。','若最终 RNA 不同，先问是峰值、累积暴露还是 feedback 导致，设计额外时间点区分。','单个终点的 RNA 值不能重建完整 signal trajectory。']],
    l06:['空间图上相邻，说明两细胞在通信吗？',['算法发现 cell A 表达 ligand RNA，邻近 cell B 表达 receptor RNA。','这只给出候选关系：RNA 不等于分泌的 protein，邻近也不等于真的结合。','加 protein 定位、receptor activation 时间测量，并扰动 ligand 或 receptor。','做统计时按 patient/section 而非把每对相邻 cell 当独立病例。']],
    v02:['同样 DNA 的 cell 怎样知道自己在胚胎哪里？',['画一排 cell 暴露于由左到右递减的 morphogen；给每个 cell 一个浓度读数。','不同阈值可能激活不同 gene program，于是出现相邻但不同的 cell fate。','再把暴露时间加入图：同样瞬时浓度也可能因持续时间不同而产生不同结果。','一个 marker 边界不能单独证明是该 morphogen 直接设定；需扰动和时间证据。']],
    v03:['组织弯曲是“基因把它弯了”吗？',['在纸上画一层原本平直的 cell sheet；其中一侧 cell 收缩，另一侧维持长度。','局部力、黏附和 matrix 约束共同使 sheet 改变形状；gene 调控通过这些 cell 行为起作用。','做 time-lapse imaging，观察力学变化是否先于最终形态。','静态终点图只能显示结果，不能定位究竟是增殖、迁移还是收缩造成弯曲。']],
    v04:['怎样证明一个 cell 是 stem cell？',['一个 cell 表达 stemness marker，只能先把它列为候选。','追踪其后代：它是否能长期自我更新，并形成需要的多种成熟 cell？','改变 niche 信号再看功能是否维持，区分 cell 内性质与环境支持。','培养皿里能形成 colony 不自动证明体内长期 tissue renewal。']],
    v05:['Tumor “像胚胎”是什么意思？',['比较 tumor 与 embryonic tissue 的某些 shared gene program，先指出具体重叠的基因和 cell 状态。','再看发育时该程序怎样受时间、位置和反馈限制，tumor 中哪些限制被破坏。','用 lineage tracing 或 perturbation 检验共同机制，而不是只看表达相似度。','共享程序不表示 tumor 真正回到 embryo，也不表示所有发育过程都参与 cancer。']],
    i02:['病原体被识别之后发生什么？',['画 pathogen 表面被 complement 标记，phagocyte 通过 receptor 识别并吞入。','分别观察标记、吞噬、胞内杀灭三个步骤；任一步失败都可能改变清除结果。','设置无 complement 或阻断 receptor 对照，看哪个步骤下降。','检测到 phagocyte 在场并不等于它已完成杀灭。']],
    i06:['T-cell receptor 多样性从哪里来？',['想象 immature lymphocyte 随机拼接不同 gene segments，生成各不相同的 receptor。','随后经过 selection：太难识别必要信号或强烈攻击自身的 cell 会减少。','用 receptor sequencing 测 repertoire，但序列存在不等于该 cell 识别了当前 antigen。','把“随机生成 receptor”与“感染后特定 clone 扩增”分开。']],
    i07:['T cell 碰到 antigen 为什么还可能不行动？',['画 antigen-presenting cell 同时展示 peptide–MHC、co-stimulatory signal 和 cytokine context。','只看到一个条件而其他条件不足时，T cell 的功能可能不同。','追踪 activation marker、分裂、迁移到 tissue 和最终 killing，每步用不同读数。','血样里有 antigen-specific T cell，不等于它已到达 tumor 或发生杀伤。']],
    i08:['疫苗怎样训练“下次更快”？',['第一次接触 antigen 后，部分 B/T cells 扩增并形成持久记忆群体。','再遇到相同或相关 antigen 时，比较响应速度、质量和感染结局。','不同 pathogen、进入 tissue 和免疫逃逸方式会改变需要哪类保护。','抗体滴度是重要读数，但不是所有感染保护的完整替代物。']],
    i09:['免疫反应“太强”是否足以解释疾病？',['比较 allergy、autoimmunity 与 chronic inflammation：分别问 target 是什么、发生在何 tissue、何时被启动。','同样的 cytokine 升高，在不同病因中可能是推动因素，也可能是结果。','用时间序列、组织定位和有针对性的阻断实验缩小机制。','不要把免疫指标单一高低当作一个“免疫力”刻度。']],
    i10:['有 tumor mutation，为何 immunotherapy 仍可能失败？',['沿 mutation → peptide → HLA presentation → T-cell entry → activation → killing 画六个关口。','给假想病例分别设置 HLA loss 或 T-cell 无法进入 tissue；同样的 mutation load 会有不同结局。','为每个关口配 assay：DNA/RNA、HLA、空间成像、功能实验和临床响应。','一个 biomarker 与 response 相关，不证明它覆盖整个机制链。']],
    n01:['神经 cell 的电位怎样突然变化？',['先画 membrane 两侧 Na⁺、K⁺ 浓度差，以及安静时哪些 channel 开着。','刺激使电压门控 channel 开启，ion 流改变 membrane potential；之后 channel 关闭/失活并恢复。','用电极记录电位，区分一次 action potential 的幅度与发放频率。','“电流沿神经传播”不是电子像金属导线那样穿过整根 axon。']],
    n02:['一颗 neuron 收到两种相反消息',['一条 synapse 使膜电位向阈值靠近，另一条使它远离；同一 neuron 把输入在时间和空间上合并。','改变两个输入的到达时间，看看是否达到 action-potential threshold。','记录 postsynaptic potential 并阻断特定 receptor，区分相关输入与作用路径。','neurotransmitter 名称本身不固定决定“兴奋”或“抑制”；要看 receptor 和 ion conductance。']],
    n03:['反射为何比“一个中心”更像 circuit？',['画 sensory neuron → interneuron → motor neuron → muscle，并标出反馈支路。','切断其中一条连接，再测反射速度与幅度，看看哪一步必要。','脑中更复杂行为常由分布式连接组成，不能把一块活跃区域当唯一控制器。','成像上某区域变亮是活动相关线索，不直接证明它足以产生行为。']],
    n04:['感觉输入和 perception 为什么不同？',['视网膜只记录有限光信号；脑还根据过去经验和上下文估计“外面是什么”。','同一模糊图像放在不同背景下可能被解释成不同物体。','用受控刺激与行为报告、神经记录比较输入与判断。','主观知觉不能直接等同某个感受器或单个 neuron 的读数。']],
    n05:['学会一件事，需要长出全新 neuron 吗？',['动物反复练习某任务，前后比较行为表现与相关 circuit 的连接强度。','Synaptic strength、network state 或表达程序都可能改变，不必产生新 neuron。','设计不训练的对照组和延迟测试，区分短期状态、真正保持与练习效应。','一个记忆相关分子变化不意味着它单独储存了整段记忆。']],
    o01:['同一种动物为何只出现在部分地区？',['画地区的温度、食物、捕食者和移动屏障，再标出该物种实际出现的位置。','没有出现可能是环境不适合，也可能是尚未到达、未被采到或曾被排除。','用标准化采样与迁移/移植实验区分环境限制和扩散限制。','一个地图上的空白不自动意味着该物种绝对不能在那里生活。']],
    o02:['100 只动物，下一年还会是 100 吗？',['把下一年数量写成当前 100 + 出生 30 − 死亡 20 + 迁入 5 − 迁出 8 = 107。','若幼体多而成年繁殖者少，单看总数可能掩盖未来趋势。','用年龄结构和多期观察估计率，并考虑采样误差。','短期增长不等于无限指数增长，资源限制和密度反馈会改变轨迹。']],
    o03:['捕食者增加，猎物一定减少吗？',['画 predator、prey 与 prey 的食物/竞争者，标出直接和间接箭头。','捕食者可能直接减少 prey，也可能抑制另一个竞争者而间接改变 prey。','用时间序列和操控实验区分食物、环境与捕食效应。','两 species 数量负相关，不能直接证明单一路径的捕食因果。']],
    o04:['能量与元素为何要画两种箭头？',['画动物吃食物获得化学能与碳、氮等元素。','能量在代谢中不断以热等形式散失；碳和氮可在空气、水、尸体及其他生物间循环。','比较 biomass、呼吸速率与元素通量，别把某个存量当流速。','“元素循环”不表示可用能量也会无损循环。']],
    o05:['物种数一样，生态系统就一样吗？',['两片区域都记录 10 个 species；一片由近亲且功能相似物种组成，另一片有不同功能和相互作用。','比较 abundance、遗传多样性、功能特征和食物网，而不只报 species count。','扰动前后按同样采样努力重复调查，避免把发现概率变化当成灭绝。','保育目标需说明想保护哪些过程和尺度，不是单一“多样性分数”。']]
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, worked] of Object.entries(examples)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for worked example: ${id}`);
    chapter.worked = worked;
  }
})();
