/* Make advanced genetics through immunology accountable to an actual observation. */
(() => {
  const details = {
    x03:['Telomere length assay 估计 chromosome 末端重复序列的长度。','得到的是样本内的长度分布或测序估计，不是每个 cell 每条末端的精确长度。','平均 telomere 变短不能指出哪条末端最短，也不能单独证明 senescence。'],
    x07:['ATAC、methylation 与 histone-mark assay 分别测 chromatin 的不同信号。','Peak 区间和 methylation 比例要连到 genome build、cell type 与 sample。','mark 与 RNA 相关，不等于它就是改变 RNA 的因果开关。'],
    x11:['Genotype 与 phenotype 观察需在 person 和 family 层连接。','一个人是一个生物单位；估计 penetrance 要先定义 phenotype 和观察年龄。','从特定家系算出的比例不能直接当一般人群的风险。'],
    x12:['在许多独立个体中同时记录 trait 和 genotype。','效应量和 heritability 描述特定人群及环境中的变异。','heritability 不是某个人的性状有多少百分比“由 DNA 造成”。'],
    x13:['GWAS 汇总不同人的 variant–trait 关联。','每个 locus 都要保存 effect allele、ancestry、LD reference 与 genome build。','lead SNP 和最近 gene 未必是真正的 causal variant 或 target。'],
    x16:['Perturbation assay 测改变某 gene 后的 phenotype。','记录 guide、递送方式、control 与独立 biological replicate。','单个 guide 的效应可能是 off-target 或模型特异；rescue 可加强证据。'],
    x17:['深度测序和 allele-specific assay 比较不同 tissue 的遗传状态。','报告 tissue、depth、allele reads、phase 与 sample identity。','血液阴性不能排除 tissue-limited mosaicism；VAF 不是全身 cell 比例。'],
    x18:['Read depth、split read 与 allele balance 分别支持不同的结构事件判断。','VCF breakpoint、CNV segment 和 karyotype 的表格行单位不同。','total CN=4 可能只是 genome doubling 后的基线，不一定是局部 gain。'],
    x19:['可按 allele 统计 heterozygous 位点上的 RNA reads。','把 RNA allele count 与 DNA genotype、copy number 和 mapping rule 对齐。','RNA 70:30 不等于直接测得 promoter 活性比为 70:30。'],
    x20:['GWAS 与 molecular QTL 的统计结果可在同一 locus 对照。','做 colocalization 前核对 build、effect allele、ancestry/LD 与 tissue。','共享统计信号可提高候选优先级，却不能单独证明 mediation。'],
    x21:['HLA typing、tumor sequence 与 peptide/protein assay 观察呈递链的不同关口。','把患者 HLA alleles、tumor sample 和 candidate peptide 连起来。','预测能结合 HLA，不等于真的在 cell 表面呈递或引发 T-cell killing。'],
    x22:['多区域或纵向 DNA 样本仅显示 tumor lineage 的部分视角。','按 patient–region–timepoint 比较 purity/CN 校正后的 CCF 与不确定性。','一块 biopsy 或较高 VAF 都不能单独确定事件先后及完整 clone tree。'],
    e02:['Sequence 或形态差异是 phylogenetic model 的输入。','树文件包含 tip ID、branch、root，有时还含支持度和长度单位。','图上 tip 左右顺序可旋转；branch support 依赖模型和数据。'],
    e04:['存活和后代数量帮助估计相对繁殖成功。','分析单位是在指定环境与时间窗追踪的个体或 lineage。','寿命长或生长快，不自动等于整体 evolutionary fitness 高。'],
    e05:['两个 lineage 接触处可测杂交和 genome 交换。','报告 population、采样位置与 locus，而非只给一个 species 名。','少量 gene flow 不抹去所有分化；species 边界要依研究问题定义。'],
    u01:['Microscopy、marker gene 与 genome 数据揭示 microbe 的不同属性。','一个 amplicon read 或 genome bin 不自动等于培养出的 species 或 cell。','没有 nucleus 不代表 metabolism 简单，也不代表所有 prokaryote 是单一谱系。'],
    u02:['PCR、antigen assay 与 infectivity assay 测 virus 的不同性质。','记录 specimen、取样时间，并注明单位是 genome copy、protein signal 还是感染性 particle。','genome 检测阳性不能独自证明正在复制，也不能直接解释症状。'],
    u03:['Growth curve 与化学 assay 观察 biomass 及底物/产物变化。','OD、活菌数、metabolite concentration 和时间是不同数据列。','OD 曲线更陡不自动说明 cell division 更快或某条 flux 上升。'],
    u04:['Microbiome sequencing 统计群落中的 marker 或 shotgun reads。','相对丰度是组成型数据，嵌套在 person、身体部位与时间之下。','某 species 比例上升也可能是其他成员下降；名单不能单独说明功能。'],
    u05:['药敏试验、genome 和 plasmid 数据观察耐药的不同侧面。','把 isolate、药物浓度、MIC 方法和采样日期连在一起。','检测到 resistance gene 不等于它在表达，也不等于临床治疗必然失败。'],
    h02:['Tracer 和 permeability assay 测物质跨指定屏障的移动。','按区室和时间记录浓度；它与全身吸收是不同层级。','能跨一层 membrane 不保证能穿过整个上皮或到达有效临床暴露。'],
    h03:['血氧仪、血气、hemoglobin 与血流分别检查氧运输链的一步。','重复读数仍属于同一患者和时间背景。','正常 saturation 不保证总氧含量或 tissue oxygen delivery 正常。'],
    h04:['血和尿的化学读数常间接估计过滤与排出。','浓度需结合尿量、时间及身体状态解释。','尿中某物少，也可能来自回收或生成改变，并非只有 filtration 下降。'],
    h05:['Hormone assay 捕获特定时刻的血中浓度。','把 hormone 值连到进食、昼夜节律、药物及上下游测量。','循环 hormone 高可与 target response 低同时存在。'],
    h06:['饮食记录、血中 metabolite 与 isotope tracer 观察消化代谢的不同步骤。','多次餐食与重复血样嵌套在同一 person 内。','餐后一次血中浓度不能单独识别肠道吸收速度。'],
    h07:['Karyotype、hormone、imaging 和生育记录观察生殖的不同层级。','根据问题选 gamete、embryo、pregnancy 或 person 作为分析单位。','同一个 embryo 的多个 cell 不是多个独立 pregnancy。'],
    l02:['时间序列可记录 receptor 刺激后的 second messenger 或 phospho-protein。','每条信号要配 ligand 剂量、刺激后分钟数与 cell model。','receptor RNA 存在不能说明膜上 receptor 正在工作。'],
    l03:['phospho-MAPK/AKT 与稍后的 cell-cycle/viability 读数对应不同阶段。','按 treatment 和 sample 对齐早期 signaling 与后期 phenotype。','一个 pathway marker 激活不证明 cell 已分裂，也不能排除代偿。'],
    l05:['重复测 phospho-signal 可得到时间轨迹，而非只看终点。','每行注明刺激剂量、脉冲时长、timepoint 和 biological replicate。','终点相同的两组，峰值和 feedback 历史仍可能不同。'],
    l06:['scRNA/spatial 数据提供 ligand 与 receptor 表达及位置的候选信息。','cell 与 cell pair 嵌套在 tissue section 和 patient 内。','表达加邻近不是 protein 真正分泌或 receptor 被激活的录像。'],
    v02:['Imaging 和 reporter assay 记录胚胎轴上的信号与 fate marker。','位置、发育时间和 cell lineage 必须一起记录。','梯度与命运相关，不足以证明直接的浓度阈值机制。'],
    v03:['Time-lapse imaging 追踪 cell 移动、形状和 tissue 变形。','cell track 嵌套在同一个 embryo/tissue 内，并需要空间标尺。','终点形状无法单独区分 division、force 或 adhesion 的原因。'],
    v04:['Lineage tracing 检验长期更新及分化后代的产生。','在 niche 中长期追踪同一初始 cell 或 clone。','marker 阳性或短期 colony 不足以证明 stem-cell 功能。'],
    v05:['表达谱可比较 tumor 程序与发育状态。','比较前对齐 cell type、年龄/阶段、sample 和 assay。','gene 表达相似不表示完全退回 embryo，也不能独自证明因果复用。'],
    i02:['Complement 沉积、吞噬和杀灭 assay 分别观察连续免疫步骤。','particle、phagocyte 和 donor 是嵌套层级；各阶段要分开测。','现场有 phagocyte，不等于 pathogen 已被杀死。'],
    i06:['Immune-receptor sequencing 测 receptor 组合与 clone 频率。','一个 clonotype 是某 donor 和 timepoint 内的序列候选。','receptor 序列本身不能指出它识别什么 antigen 或会否响应。'],
    i07:['Antigen 呈递、activation、migration 和 killing 各需要不同 assay。','把 peptide/HLA、T-cell clone、tissue 与时间连起来。','血中有 antigen-specific T cell，不保证它到达或杀伤 tumor。'],
    i08:['Antibody、memory cell 和感染结局描述 vaccine 的不同作用。','按 person 连接剂量、pathogen 暴露与接种后时间。','单一 antibody titer 不能概括所有保护机制。'],
    i09:['Cytokine profile 与 tissue 病理观察异常免疫反应的不同侧面。','cytokine 值要标明位置、时间和 disease 情境。','一个高炎症指标不能区分 allergy、autoimmunity 与慢性炎症。'],
    i10:['Tumor sequence、HLA、空间免疫图和疗效分别覆盖证据链一环。','把 molecular assay 与 outcome 对齐到同一 patient、treatment 和时间。','mutation burden 或 T-cell density 单独都不是完整的 immunotherapy 机制。']
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
