/* Protein structure and physical chemistry: keep model confidence distinct from function. */
(() => {
  const details = {
    'Protein domain':['一个 kinase protein 可有催化 domain 与另一个调节 domain。','同一 domain 的存在不保证 protein 在当前 cell 一定有活性。'],
    'Secondary structure':['一段 polypeptide 可形成 α-helix，另一段形成 β-sheet。','局部 helix 不等于已知道整条 protein 的三维构象。'],
    'Hydrophobic effect':['非极性侧链在水中倾向减少暴露，帮助 protein 折叠。','它不是简单的“两个疏水原子之间有一根键”。'],
    'Quaternary structure':['四个 protein subunits 装配成一个功能复合体。','单链结构预测正确不保证多链装配方式也正确。'],
    'Conformational ensemble':['同一个 protein 可在开放与关闭等多个构象间切换。','一张静态结构图只显示其中一个状态或模型。'],
    'Protein folding':['新合成链逐渐形成能稳定存在或工作的结构集合。','序列相同也可能因环境与结合伙伴呈现不同状态。'],
    'Molecular chaperone':['chaperone 帮助新生 protein 避免错误聚集。','chaperone 不通常成为目标 protein 最终结构的一部分。'],
    'Intrinsically disordered region':['一段 protein 在游离状态下可没有单一固定三维形状。','“无序”不等于没有功能；结合时它可能形成特定构象。'],
    'Proteostasis':['cell 同时调节 protein 合成、折叠、运输与降解。','protein abundance 不变也可能隐藏很快的合成与降解周转。'],
    'Protein aggregation':['某些错误折叠的 protein 分子形成较大聚集体。','聚集体出现不自动说明它是疾病原因，也可能是结果。'],
    'Binding affinity':['两个分子在相同条件下结合倾向不同，可比较其 Kd。','高 affinity 不保证在 cell 中一定结合；浓度与可达性也重要。'],
    'Dissociation constant':['简单结合模型中，较低 Kd 常表示较强 affinity。','Kd 是平衡参数，不直接告诉结合和解离有多快。'],
    'Occupancy':['100 个可用 receptor 中约 60 个被 ligand 占据，occupancy 为 60%。','占据率高不等于 downstream signaling 一定强。'],
    'Avidity':['多价 antibody 同时抓住多个 epitope，可产生强整体结合。','avidity 与单个 binding site 的 affinity 不是同一量。'],
    'Allostery':['ligand 在 protein 一处结合，使远处 active site 的反应改变。','远处效应不要求两位置直接相邻。'],
    'Reaction kinetics':['用不同 substrate 浓度测初始反应速率，观察速率曲线。','速率参数来自特定条件，不可无条件搬到活 cell 中。'],
    'Activation free energy':['某 enzyme 降低过渡态所需能垒，反应速率提高。','这是速率障碍，不等于反应总 ΔG。'],
    'Michaelis constant':['简单 Michaelis–Menten 条件下，[S]=Km 时速率为约 Vmax/2。','Km 不总能直接等同 substrate binding Kd。'],
    'Turnover number':['饱和条件下，一个 active site 每秒完成若干次转换。','kcat 需结合 active enzyme 浓度和具体条件解释。'],
    'Cooperativity':['一个 subunit 结合 oxygen 后，可能改变其他 site 的结合倾向。','S 形曲线是线索，仍需排查其他机制与模型。'],
    'Osmosis':['外液有效溶质更多时，water 可跨 membrane 净流出 cell。','water 双向移动始终存在；净方向取决于有效梯度。'],
    'Electrochemical gradient':['K⁺ 的浓度差与膜电位可能对其流动方向产生相反作用。','只看浓度高低不能断定离子的净流向。'],
    'Permeability':['同一 membrane 对 oxygen 与带电 ion 的通过能力不同。','某 molecule 小也不保证它能轻易穿过带脂质的 membrane。'],
    'Surface-to-volume ratio':['小 cell 表面积相对体积更大，交换路径可能更有利。','比例变化只是几何约束，不单独决定最大 cell size。'],
    'X-ray crystallography':['用 crystal diffraction pattern 推断 protein 的 atomic model。','需要模型拟合数据；结构图不是直接拍到每个原子。'],
    'Cryogenic electron microscopy':['低温下采集大量 particle images，可重建三维密度。','局部分辨率可不同；单个模型不显示全部动态状态。'],
    'Nuclear magnetic resonance spectroscopy':['NMR 信号给出原子局部环境和距离约束，可研究部分结构与动态。','它与显微镜照片不同，结构仍由数据约束推断。'],
    'Electron density map':['衍射数据可得到密度图，研究者据此建 atomic model。','map 有不确定性，不能把拟合出的每个侧链都当同等确定。'],
    'Predicted Local Distance Difference Test':['AlphaFold2 模型某段 pLDDT=90，提示该段局部结构预测较有信心。','高局部信心不证明两个 domains 的相对方向正确；不同版本的粒度也可能不同。'],
    'Predicted aligned error':['两 domains 之间 PAE 高，表示模型对相对位置不太确定。','PAE 是预测误差估计，不是实验测出的实际位移。'],
    'Structure prediction':['把 sequence 输入模型，得到候选三维结构与信心指标。','模型结构不能单独证明 protein 在活 cell 中的结合或功能。'],
    'Molecular docking':['算法尝试把 ligand 放进 protein pocket 并给候选 pose 评分。','较好 docking score 不是实验证实的结合亲和力。'],
    'Model validation':['用独立实验结构或新的功能数据检查预测用途。','训练集表现好不等于模型对新 protein 和新条件可靠。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    entry.category = '基础对象';
  }
})();
