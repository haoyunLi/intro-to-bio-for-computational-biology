/* Worked examples for metabolism, lab interpretation, and protein physics. */
(() => {
  const examples = {
    a04:['葡萄糖除了做 ATP，还能去哪？',['把一分子 glucose-6-phosphate 画成岔路：进入 glycolysis，或进入 pentose phosphate pathway。','后一路可供应 NADPH 与 ribose-5-phosphate；细胞在合成脂质或 nucleotide 时需求不同。','测 NADPH/NADP⁺ 与代谢物丰度可提示状态；用标记 glucose 追踪碳流更接近回答“流向哪里”。','某 pathway 的 gene RNA 增加不证明实际 flux 已增加。']],
    a06:['吃下的脂肪为何不立刻全被“烧掉”？',['画 fatty acid 的两条去路：合成 triacylglycerol 储存，或进入 mitochondrion 做 β-oxidation。','比较 fed 与 fasted 条件下 hormone 和组织需求，说明同一分子可在不同时间走不同路线。','测 tissue lipid pool 只是存量；同位素或时间序列更能区分合成与分解。','β-oxidation 增加也不自动意味着全身脂肪总量一定减少。']],
    a07:['分解 amino acid 后，碳和氮去哪？',['把一个 amino acid 分成 carbon skeleton 与含氮 amino group 两条路线。','碳骨架可进入能量或生物合成路径，氮需安全转运并最终排出。','记录血中 amino acid、尿中 nitrogen-related product 与组织状态，但不要把一个浓度直接当 flux。','比较患者时还要考虑饮食、肾功能和采样时间。']],
    a08:['禁食时谁给脑提供燃料？',['画 liver、muscle、adipose 与 brain 四个盒子；标出 glucose、fatty acid 与 ketone body 的交换。','禁食初期和更长期的路径不同，insulin/glucagon 等信号改变各组织的放出与摄取。','同一血糖可由不同 hepatic output 和 tissue uptake 组合形成。','把器官级通量与单个 cell 的 pathway 图分开，避免用一个 bulk RNA 样本代表全身。']],
    a09:['Tumor 与免疫 cell 都需要营养，会发生什么？',['画 tumor cell、T cell、血管及局部 glucose/oxygen 的供给和消耗。','两类 cell 可竞争资源，但免疫抑制还可能来自酸度、cytokine 或其他信号。','联合空间位置、代谢物、同位素与功能读数，而非只比 glycolysis gene set。','同一 tumor 的区域和时间点不同，代谢状态也可能不同。']],
    a10:['代谢物多，是因为生产快吗？',['想象水池：pool size 是池中水量；inflow 和 outflow 都可能同时加快而水位不变。','两组样本 metabolite abundance 相同，不排除一组生产和消耗都更快。','加入 isotope-labeled substrate，连续取样，看 label 进入和离开 pool 的速度。','解释 tracer 时先写清 precursor labeling、采样时间和模型假设。']],
    w08:['Flow 图上的方框是天然 cell type 吗？',['从原始 event 开始，先去除 debris、doublet 和 dead-cell 候选，再看两个 marker 的散点图。','在单色对照下估计荧光串扰并做 compensation；再按预先声明的 gate 统计比例。','改变 gate 边界做敏感性检查，看看结论是否反转。','10 万个 events 来自同一 donor 仍主要是一个 biological replicate。']],
    w10:['别人能重算你的图吗？',['给一张“treatment 使 gene X 上调”的图，追问 sample ID、assay file、过滤规则和 normalization 版本。','保留 raw file、metadata、分析脚本与软件版本，让每一图点能追到材料。','让另一个人从空目录运行一次流程，并对照预期数值。','只写“按标准方法分析”不够；选择性排除样本的原因也要记录。']],
    z01:['序列确定，形状就永远固定吗？',['给同一 protein 画两种可能构象：open 和 closed；结合伙伴可改变其比例。','先识别 amino-acid sequence、domain 和可移动的 loop，再讨论功能。','一张结构图是某实验条件或计算模型下的状态，不是活 cell 中的完整影片。','若要验证作用，结合动力学、结合实验或细胞功能数据。']],
    z02:['错误折叠的 protein 会去哪？',['新合成链可能正确折叠、由 chaperone 协助，或被质量控制识别后降解。','设想合成 100 个分子、降解 100 个分子：总丰度不变，但周转很快。','用 pulse-chase 或抑制降解的时间实验区分合成与清除。','出现 aggregate 不自动证明它是疾病原因；还需功能和时间证据。']],
    z03:['100 个 receptor 中有多少被占据？',['假设简单 1:1 平衡结合且 ligand 浓度等于 Kd，预计平均 occupancy 约 50%。','提高浓度可增加占据，但 cell response 还受 receptor 数量、竞争和下游放大影响。','测 dose–response 与 binding curve，不把 Kd 当作起效剂量或安全剂量。','多个结合位点或 cooperative binding 时，这个简化 50% 关系不能照搬。']],
    z04:['酶使反应更快，是否改变最终平衡？',['画从底物到产物的一座能量山；enzyme 降低越过山顶所需的 activation barrier。','在相同初始条件下测 initial rate，酶能更快接近平衡，但不凭空改变反应 ΔG。','用不同 substrate 浓度估计 Km、Vmax，先确认测量处于初速区间。','Km 不总是纯粹的 binding affinity，也不等于 cell 中的固定速度。']],
    z05:['K⁺ 会往浓度低处流吗？',['先画膜内外 K⁺ 浓度与电荷差：chemical gradient 与 electrical force 可能相反。','只看浓度会猜一个方向；加入 membrane potential 后，净驱动力可能减小甚至反向。','改变膜电位或 channel 开关并记录 ion current，比较预测。','water 的 osmosis、离子的 electrochemical gradient 和主动 pump 是不同过程。']],
    z06:['结构图是相机拍到的每个原子吗？',['X-ray diffraction、cryo-EM image 和 NMR signal 都是仪器观测，不是同一种“照片”。','研究者从各自数据建立模型；有些 loop 或 side chain 因信号弱而不确定。','读一张结构时核对 resolution、局部质量、缺失区域和实验条件。','结构与功能因果之间仍隔着结合、动力学和细胞环境。']],
    z07:['AlphaFold 高 confidence 证明能结合药物吗？',['观察某段 protein 的 pLDDT 高，先只说模型对局部结构较有信心。','再看两个 domain 的相对 PAE、是否有缺失的 ligand、partner 或动态状态。','用实验结构或独立结合/功能实验检验需要的预测。','高 confidence 不等于蛋白在当前 cell 表达、定位正确或能与该药结合。']]
  };
  const chapters = window.BIOCS_BOOK.flatMap(course => course.chapters);
  for (const [id, worked] of Object.entries(examples)) {
    const chapter = chapters.find(item => item.id === id);
    if (!chapter) throw new Error(`Unknown chapter for worked example: ${id}`);
    chapter.worked = worked;
  }
})();
