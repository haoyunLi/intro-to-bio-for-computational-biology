/* Immunity, nervous systems, and ecology: examples with observable boundaries. */
(() => {
  const details = {
    'DAMP':['受损 cell 释放的分子可提醒 innate immune cells 组织受伤。','DAMP 来自宿主损伤，不等同于 pathogen 的 PAMP。'],
    'Inflammation':['受伤组织可增加血流与 leukocyte 进入，以清除损伤并修复。','inflammation 并非总由感染引起，也并非越强越好。'],
    'Complement':['血浆 complement 蛋白级联可标记 bacterium 并帮助清除。','检测到 complement 成分不等于整个级联已有效完成。'],
    'Opsonization':['antibody 或 complement 附在 bacterium 表面，使 phagocyte 更易识别。','贴标记本身不是已经完成吞噬和杀灭。'],
    'Natural killer cell':['NK cell 综合 activating 与 inhibitory 信号，可杀伤部分异常 target。','单一 marker 阳性不能断定 NK cell 当下正在杀伤。'],
    'Clonal selection':['少数能结合特定 antigen 的 B cells 获得扩增机会。','antigen 不是临时设计出正确 receptor；受体多样性先已存在。'],
    'Affinity maturation':['B-cell lineage 经 mutation 与 selection 后，平均 binding affinity 可能提高。','affinity 变高不等于抗体必然更能 neutralize pathogen。'],
    'Isotype':['IgM 和 IgG 的 heavy-chain constant region 不同，执行功能也不同。','换 isotype 不必改变 antigen-binding specificity。'],
    'Immune tolerance':['发育和外周调节减少对正常自身 tissue 的有害攻击。','tolerance 不是免疫系统完全看不到自身分子。'],
    'Immunological memory':['再次遇到同一 antigen 时，memory lymphocytes 可更快响应。','有 memory cell 不保证绝不感染；保护还受时间与 pathogen 变化影响。'],
    'Positive selection':['thymus 保留能适度识别 self-MHC 的 developing T cells。','positive selection 不是筛出“最强攻击自身”的 cell。'],
    'Negative selection':['部分过强识别 self antigen 的 developing T cells 被删除。','这种筛选并不完美，外周 tolerance 仍然重要。'],
    'Receptor editing':['某 immature B cell 若强烈识别自身，可再次重排 light-chain gene。','editing 是改变受体，不是把已分泌 antibody 直接修改。'],
    'Immune repertoire':['测序得到一个人的大量 TCR sequences，可估计不同 clone 的组成。','只取血液样本看不到所有组织中的完整 repertoire。'],
    'Co-stimulation':['naive T cell 除识别 peptide–MHC 外，还常需要 APC 的第二类激活信号。','看到 antigen presentation 不自动表示 T cell 已充分激活。'],
    'Cytotoxic T lymphocyte':['效应 CD8 T cell 识别 target 的 peptide–MHC I 后可释放杀伤分子。','CD8 marker 出现不等于该 cell 对当前 tumor 有特异性。'],
    'Chemokine':['受损 tissue 产生 chemokine 梯度，可引导 leukocytes 移动。','chemokine RNA 高不说明 cell 已经实际迁入。','一类帮助引导 cell migration 与 tissue 定位的 signaling protein。'],
    'Extravasation':['leukocyte 先黏附血管内皮，再穿过血管壁进入组织。','血里有 immune cell 不等于它能进入 tumor。'],
    'T-cell exhaustion':['持续 antigen 刺激下，部分 T cells 出现特定功能与转录状态变化。','单独 PD-1 阳性不够诊断 exhaustion，也不意味着完全不可恢复。'],
    'Neutralizing antibody':['某 antibody 阻挡 virus 进入 cell，可在功能实验中降低感染。','能结合 virus 的 antibody 不一定具有 neutralization 功能。'],
    'Adjuvant':['疫苗中的 adjuvant 可增强先天信号，帮助形成更合适的 adaptive response。','adjuvant 不是被保护的病原体 antigen 本身。'],
    'Booster':['初次免疫之后再次给剂量，可提高或更新免疫反应。','booster 效果与间隔、antigen 变化和宿主状态有关。'],
    'Commensal microbe':['皮肤或肠道的一种微生物可长期与宿主共存。','共存不表示在所有宿主和组织条件下都无害。'],
    'Hypersensitivity':['花粉暴露后某人出现过度免疫反应并损伤组织。','免疫反应强不总是抵抗 pathogen 更好。'],
    'Allergen':['花生中的某 protein 对易感者可成为 allergen。','同一分子不是对每个人都引起过敏。'],
    'Autoimmunity':['immune cells 针对自身成分的反应参与某种疾病。','检出 autoantibody 不自动证明它已造成组织损伤。'],
    'Regulatory T cell':['Treg 可帮助抑制过强 immune response，保护 tissue。','某 marker 阳性不保证这颗 cell 在当前环境确有抑制功能。'],
    'Resolution':['炎症后 immune cells 与 tissue 主动清除残骸并恢复平衡。','resolution 不是简单地“没有再测到 cytokine”。'],
    'Cancer immunity cycle':['可从 tumor antigen 释放、呈递、T-cell 启动与进入肿瘤逐步检查。','任何一步受阻都可能削弱杀伤；模型不是每个患者都走同一时序。'],
    'Checkpoint blockade':['抗 PD-1 治疗阻断一类抑制信号，可能恢复部分 T-cell 活动。','阻断靶点不保证每个 tumor 有可恢复的特异 T cells。'],
    'Immune escape':['tumor 降低 antigen presentation，可能避开部分 T-cell recognition。','immune cell 少也可能因无法进入组织，而非 tumor 完全没有 antigen。'],
    'CAR-T cell':['工程化 T cell 用 CAR 识别 target cell 表面 antigen。','CAR 识别通常不依赖 peptide–MHC，但目标抗原与组织风险仍需评估。'],
    'Immune-related adverse event':['checkpoint therapy 后免疫反应也可能影响正常组织。','这类症状需要临床判断，不能仅靠一个 cytokine 数值归因。'],
    'Membrane potential':['神经 cell 膜内外的离子分布造成可测电压差。','电压变化不等于所有离子都朝一个方向移动。'],
    'Action potential':['足够刺激后，一次快速电压变化沿 axon 传播。','每个 spike 的高度并不简单编码刺激强度；频率和群体模式也重要。'],
    'Refractory period':['一次 spike 后，短时间内同一段 membrane 不易立刻再触发。','“不易”随阶段变化，不能把整个恢复期都当绝对不能发放。'],
    'Synapse':['axon 末端释放 neurotransmitter，影响下一个 neuron。','synapse 不都相同；有 chemical 与 electrical 等形式。'],
    'Neurotransmitter':['一个 presynaptic neuron 释放 glutamate，作用于后突触 receptor。','同一 neurotransmitter 的效果依 receptor 与电路情境而变。'],
    'Postsynaptic potential':['多个 synaptic inputs 可使后突触 membrane 更接近或远离发放阈值。','局部电位变化不是已经产生 action potential。'],
    'Neural circuit':['视觉输入经多个连接 neuron 层级形成行为相关输出。','一个功能不能总归给一颗孤立 neuron。'],
    'Recurrent network':['network 的输出又反馈给内部 neuron，影响下一时刻状态。','循环连接不自动意味着系统会无限放大。'],
    'Population coding':['某方向刺激由多颗 neuron 的联合 activity 模式表示。','不必存在一颗只负责那个方向的“唯一编码 cell”。'],
    'Sensory transduction':['视网膜 photoreceptor 把光刺激转换为细胞电信号变化。','检测到光不等于大脑已经完成视觉解释。'],
    'Receptive field':['视网膜一颗 neuron 对视野中某一区域的光变化敏感。','receptive field 受条件和电路状态影响，不是永远固定的圆。'],
    'Proprioception':['闭眼也能大致知道手臂的位置，依赖 body position 信息。','它与痛觉或视觉不同，但会与其他感觉整合。'],
    'Synaptic plasticity':['重复活动后，同一 synapse 的传递强度可能持久改变。','一次突触变化不独自等于学会一段完整记忆。'],
    'Consolidation':['新学信息经过时间和睡眠相关过程，可能变得更稳定。','行为成绩变好不单凭这一点就能定位具体 consolidation 机制。'],
    'Learning':['训练后动物在相同线索下改变选择行为。','短期表现变化也可能来自疲劳或动机，而非持久 learning。'],
    'Habitat':['河流的水流、温度和底质构成鱼的 habitat 条件。','同一 species 可在多个不同 habitat 生存。'],
    'Biotic factor':['捕食者数量改变猎物的生存压力。','温度与盐度是 abiotic，不属于 biotic factor。'],
    'Population':['某湖同一 species 的全部成年鱼可定义一个研究 population。','population 要先限定地点、时间和 species。'],
    'Carrying capacity':['有限食物与空间会限制某环境长期支持的个体规模。','它不是永恒固定的整数，环境变化会改变它。'],
    'Life history':['一个物种是早繁殖多后代，还是晚繁殖少后代，属于 life-history 差异。','不能用单一年龄或单一繁殖次数概括完整 life history。'],
    'Competition':['两种鱼共享有限食物，密度上升时双方生长可能下降。','同时出现不等于已证明资源竞争。'],
    'Mutualism':['清洁鱼从大鱼身上获得食物，大鱼可减少寄生物。','互动效果依条件而变，不保证每次对双方都有净收益。'],
    'Trophic cascade':['顶级捕食者改变草食动物数量，间接影响低营养级。','远端数量变化也可能由气候或资源变化造成。'],
    'Primary productivity':['海洋浮游微生物把无机碳固定成有机物，其速率可被估计。','这是产生有机碳的流速，不是某时刻的生物量库存。'],
    'Biogeochemical cycle':['海洋中的碳在微生物、溶解无机碳与沉积物之间转移。','元素循环不会只在生物体内发生。'],
    'Decomposer':['真菌和细菌分解动物尸体，释放可被其他 organism 利用的物质。','分解者不等于只吃某一类有机物的单一物种。'],
    'Biodiversity':['两片珊瑚礁即使 species 数相同，gene 多样性也可能不同。','只报 species richness 不能代表所有层次的 biodiversity。'],
    'Resilience':['海洋群落受扰动后能在一段时间恢复部分结构和功能。','恢复某个总量不表示原来每个 species 都回来了。'],
    'Habitat fragmentation':['道路把连续动物栖息地切成隔离小片。','总面积不变也可能因连接性下降改变 gene flow。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution, simple]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    if (simple) entry.simple = simple;
    entry.category = entry.chapterId.startsWith('i') || entry.chapterId.startsWith('j') ? '免疫' : entry.chapterId.startsWith('n') ? '细胞与疾病' : '基础对象';
  }
})();
