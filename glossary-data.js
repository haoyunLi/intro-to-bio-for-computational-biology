/* Short definitions are already attached to 180 chapters. This index makes them
   searchable everywhere; the entries below add a first-encounter explanation. */
(() => {
  const curated = {
    'Cell': ['有边界、能维持内部活动的生命基本单位。先把它想成会交换物质并作出反应的系统，而不是显微镜下的一个圆点。','一个 immune cell 收到信号后改变行为。','cell type 是分类；cell state 是同一类 cell 当下的状态。','基础对象'],
    'Tissue': ['许多 cell 与周围 extracellular matrix 组成的工作环境；位置和邻居会改变同一个 cell 的行为。','同样的 tumor cell，在缺氧区和血管旁可能表现不同。','组织样本不是一种纯 cell。','基础对象'],
    'DNA': ['由 nucleotide 连成的有方向的分子。base 的排列携带可被复制和读取的信息。','把一个位置的 A 改成 G 是 DNA sequence 的改变。','DNA 改变不自动意味着 protein 或疾病改变。','遗传信息'],
    'RNA': ['通常由 DNA 模板合成的分子；有些 RNA 是 protein 制作的中间步骤，另一些本身执行功能。','RNA-seq 记录样本中检测到的 RNA 信号。','RNA abundance 不等于 protein activity。','遗传信息'],
    'Protein': ['由 amino acid 连成并折叠的分子，能充当结构、enzyme、receptor 或运输工具。','一个 receptor protein 能感知 cell 外的 ligand。','测到 protein 很多，不等于它一定处于活性状态。','遗传信息'],
    'Genome': ['一个生物或 cell 拥有的整套遗传物质；gene 只是其中的一部分。','人类的 genome 包含 gene，也包含大量调控和其他非编码区域。','genome、chromosome 和 gene 不是同一层级。','遗传信息'],
    'Chromosome': ['把一条很长的 DNA 分子及其相关 protein 组织起来的结构；上面排列着许多 gene。','一个人通常从两位父母各继承一套 chromosome。','复制后的 sister chromatids 不等于来自父母的 homologous chromosomes。','遗传信息'],
    'Gene': ['能产生功能性 RNA 或 protein 产品的 DNA 区域；是否被使用、使用多少，还受调控影响。','同一个 gene 在 immune cell 与神经 cell 中可有不同表达。','一个 gene 不总是对应一个 protein。','遗传信息'],
    'Allele': ['同一 locus 的某个序列版本；来自父母的两条 homologous chromosomes 可带不同 allele。','同一 gene 的 A 版本和 G 版本是不同 allele。','allele 是版本，不是一个额外的 gene。','遗传信息'],
    'Variant': ['样本序列相对于指定 reference 的差异；要连同 genome build、位置和 allele 一起描述。','VCF 中一行可以记录一个候选 variant。','variant 不等于致病 mutation。','遗传信息'],
    'Genotype': ['某个人或 cell 在指定 locus 上拥有的 allele 组合。','一个 diploid locus 可以是 A/A 或 A/G。','genotype 不是直接观察到的 phenotype。','遗传信息'],
    'Phenotype': ['可观察或可测量的生物特征或状态，可以是疾病、蛋白量、cell 行为等。','某 cell 在药物后是否继续分裂是一个 phenotype。','同一 genotype 可能因环境和时间产生不同 phenotype。','遗传信息'],
    'Replication': ['以旧 DNA 链为模板合成新 DNA，使遗传信息在 cell 分裂前得到复制。','复制叉向前移动时，两条新链的合成方式并不相同。','replication 与 transcription 不是同一个过程。','遗传信息'],
    'Transcription': ['RNA polymerase 使用 DNA 模板合成 RNA 的过程。','某个 gene 被转录后，可以检测到对应 RNA。','转录变多不保证最终 protein activity 变高。','遗传信息'],
    'Translation': ['ribosome 按 mRNA 上的 codon 顺序组装 amino acid 链。','mRNA 序列中的 codon 指定接下来加入的 amino acid。','translation 之后仍有 folding、定位和修饰。','遗传信息'],
    'Enhancer': ['能在特定 cell 情境下影响 target gene transcription 的 DNA 调控区域。','删掉候选 enhancer 后，某 gene 的 RNA 下降可提供功能证据。','离 gene 最近不等于一定调控它。','遗传信息'],
    'Enzyme': ['加快某类化学反应的催化分子，通常是 protein；它改变反应速率，不凭空创造能量。','glycolysis 中不同 enzyme 控制不同反应步骤。','enzyme abundance 不等于实际 metabolic flux。','能量与代谢'],
    'ATP': ['能与许多耗能过程耦联的分子，是短期能量转移媒介。','离子泵消耗 ATP，把离子逆着梯度运过膜。','ATP 不是细胞唯一的能量或物质目标。','能量与代谢'],
    'Metabolism': ['cell 中彼此连接的化学反应网络，同时处理能量、原料和 redox balance。','glucose 的碳可以进入 ATP 产生，也可以用于 biosynthesis。','pathway 图不等于真实流量图。','能量与代谢'],
    'Metabolic flux': ['单位时间内物质经过某条反应或通路的流速。','isotope tracing 可以帮助判断碳实际流向哪里。','metabolite 的库存高，不一定表示流速高。','能量与代谢'],
    'Signal transduction': ['cell 把外部或内部的刺激转换成内部状态和行为变化的过程。','ligand 结合 receptor 后，后续 protein 活性随时间改变。','一个终点 RNA 值不能还原全部信号时间过程。','细胞与疾病'],
    'Antigen': ['可被免疫受体识别的分子特征；T cell 通常识别展示在 MHC 上的 peptide。','感染 cell 可展示来自 virus protein 的 peptide。','antigen 存在不等于免疫反应一定发生。','免疫'],
    'MHC': ['在 cell 表面展示 peptide 的分子家族，帮助 T cell 检查 cell 内外发生了什么。','MHC I 展示的 peptide 可被 CD8 T cell 识别。','MHC 不是 T-cell receptor 本身。','免疫'],
    'T cell': ['adaptive immunity 的 cell；不同类型负责识别、帮助、杀伤或调节。','CD8 T cell 可识别展示异常 peptide 的 target cell。','T cell 在组织里出现，不等于它正在有效杀伤。','免疫'],
    'Antibody': ['由 B cell 产生、能特异性结合目标结构的 protein。','同一抗体可在检测实验中标记某个 protein。','结合信号不直接证明目标 protein 的功能。','免疫'],
    'Tumor purity': ['肿瘤样本中 tumor cells 所占的比例；混入的 normal cells 会稀释肿瘤 DNA 信号。','50% purity 的样本里，一半 cell 是 tumor cells。','cell 比例不总等于某 locus 的 DNA copy 比例。','肿瘤遗传'],
    'VAF': ['在某个位置覆盖到的 reads 里，支持 ALT allele 的比例。先看 read 分母，再推断 cell。','50% purity、diploid 且 clonal heterozygous 的简单情形，可得到约 25% VAF。','25% VAF 不等于 25% tumor cells 携带 variant。','肿瘤遗传'],
    'CNV': ['一段 DNA 的 copy number 相对基线增加或减少。','肿瘤 cell 可在某段 chromosome 上有三份而非两份 DNA。','CNV 改变 VAF 的分子，不能只看 ALT reads。','肿瘤遗传'],
    'Copy number': ['一个 cell 在指定 DNA 区段拥有多少份拷贝；在 tumor 中不同区段和 clone 可能不同。','diploid 的一般体细胞通常有两份常染色体区段。','copy number 与有多少 cell 带 mutation 是两个问题。','肿瘤遗传'],
    'Clone': ['由共同祖先 cell 扩增而来、共享部分遗传改变的一群 cell。','治疗后某个耐药 clone 的比例可能上升。','相似 VAF 不能单独证明两个 variant 在同一 clone。','肿瘤遗传'],
    'Cancer cell fraction': ['肿瘤细胞中带某 mutation 的细胞比例，是结合 VAF、purity 和 copy number 的模型估计。','一个 mutation 可存在于所有 tumor cells，CCF 接近 1。','它不是测序仪直接给出的 VAF。','肿瘤遗传'],
    'Assay': ['把某种生物对象或状态转成可记录 signal 的实验流程。','RNA-seq assay 把样本中的 RNA 经过建库和测序变成 reads。','仪器 signal 不是未经处理的生物事实。','实验与数据'],
    'Sample': ['从某个生物对象在特定时间和位置取得的材料；一个 patient 可以贡献多个 samples。','同一 patient 的原发 tumor 和复发 tumor 是两个 samples。','sample 数不等于独立 patient 数。','实验与数据'],
    'Read': ['测序仪对单个 DNA/RNA 来源片段获得的一段序列观察。','FASTQ 里一条 read 带有碱基和质量值。','read 不直接等于一个完整 gene 或一个 cell。','实验与数据'],
    'Count': ['按既定比对与分配规则，归到某个 feature 的 reads 或 fragments 数。','gene count 可由多个 exon 的 read assignment 汇总。','raw count 不是该样本中 RNA 分子的绝对个数。','实验与数据'],
    'Normalization': ['为特定比较目的，调整测量规模或组成差异的处理。','CPM 与 TPM 使用不同分母，回答的问题也不同。','没有一种 normalization 适合所有分析。','实验与数据'],
    'Biological replicate': ['独立的生物材料或个体，用来观察真实生物差异；独立性要按研究设计判断。','三位 patient 的 tumor samples 通常比同一块组织切成三份更接近三个独立重复。','更多 reads 不会自动增加 biological replicate 数。','实验与数据'],
    'GWAS': ['在群体中逐位点寻找 variant 与 phenotype 的统计关联。','某区域与疾病风险关联后，还需定位 causal variant 和 gene。','显著关联只是定位线索；LD、群体结构和混杂都可能阻止直接确定 causal variant 或机制。','实验与数据'],
    'eQTL': ['与 gene expression 差异相关的遗传变异位置。','某 allele 与附近 gene 的 RNA 水平相关。','eQTL 关联不自动证明该 allele 直接调控那个 gene。','实验与数据'],
    'Atom': ['能参与化学结合的物质基本单位。生物大分子很大，但其形状和反应最终仍受原子间相互作用约束。','carbon 与 oxygen 原子可以组成 CO₂。','atom 不是 cell；它本身不是生命单位。','基础对象'],
    'Covalent bond': ['两个原子共享电子形成的强连接，可把小分子或 amino acid 串成较稳定的结构。','protein 中相邻 amino acid 通过 peptide bond 相连。','有 covalent bond 不代表分子间所有相互作用都同样强。','基础对象'],
    'pH': ['描述溶液中酸碱状态的尺度；数值变动会改变许多分子的带电状态和反应速度。','同一种 enzyme 在不同 pH 下可能活性不同。','pH 每差 1 不是线性差一小格，而是相关离子活度约十倍差。','基础对象'],
    'Nucleotide': ['DNA/RNA 链的一个构件，由 base、糖和 phosphate 组成。先认清它是构件，再看 base 顺序怎样携带信息。','DNA 中的 A nucleotide 与后一个 nucleotide 连成长链。','base、nucleotide 和整条 DNA 不是同一层级。','遗传信息'],
    'Amino acid': ['protein 链的一个构件；不同侧链的化学性质影响 protein 怎样折叠和工作。','某个 amino acid 由带电变为疏水，可能改变局部结合。','一个 amino acid 变化不保证整个 protein 一定失活。','基础对象'],
    'Lipid': ['偏疏水的一大类分子，可构成膜、储存能量或传递信号。','phospholipid 的排列形成细胞膜的主要屏障。','lipid 不是单一分子，也不只是脂肪储备。','基础对象'],
    'Eukaryote': ['cell 内有 nucleus 等膜包围结构的生物；这些隔间让不同过程在不同位置发生。','人类 cell 的 DNA 主要储存在 nucleus。','eukaryote 不等于多细胞生物；yeast 也是 eukaryote。','基础对象'],
    'Bulk assay': ['把一群 cell 的材料混合后得到总体信号的实验；观测值由 cell 类型、比例和各自状态共同决定。','bulk RNA-seq 中 gene 上升，可能因为某类 cell 变多。','总体平均值不能直接归给每一个 cell。','实验与数据'],
    'Pathway': ['研究者用来概括一组相互连接反应或信号步骤的模型。它告诉你可能的路径，不直接告诉你当前样本走了多快。','glycolysis 是 glucose 分解的一条 pathway。','图上的箭头不是测到的 metabolic flux。','基础对象'],
    'Phospholipid bilayer': ['带水亲和头部和疏水尾部的 phospholipid 在水中排成双层，形成 cell 与环境间的选择性边界。','离子通常需要 channel 或 transporter 才容易穿过。','膜不是完全密封的塑料袋。','基础对象'],
    'Diffusion': ['粒子因随机运动产生净扩散，常从高浓度区域走向低浓度区域。','oxygen 可沿浓度梯度进入组织。','有扩散不表示每个分子都只朝一个方向移动。','基础对象'],
    'Transporter': ['帮助特定分子跨膜的 protein，可能顺着梯度，也可能借能量逆着梯度移动。','glucose transporter 帮助 glucose 穿过 cell membrane。','transport signal 变大不一定表示 transporter 数量变多。','基础对象'],
    'Base pair': ['两条 nucleic acid 链上的 base 按配对规则结合，让一条链能作为另一条链的模板。','DNA 中 A 通常与 T 配对，G 通常与 C 配对。','配对规则不等于两条链的书写方向相同。','遗传信息'],
    'Reverse complement': ['把一条 DNA 序列按配对规则换成另一条链，再倒转为标准 5′→3′ 方向的写法。','5′-ATG-3′ 的 reverse complement 是 5′-CAT-3′。','只把 A 换 T 而不反转顺序，会得到错误方向。','遗传信息'],
    'DNA polymerase': ['沿模板链合成新 DNA 的 enzyme，只能把新 nucleotide 加到新链的 3′ 端。','replication fork 两侧的新链因此有不同合成方式。','它需要模板和起始端，不会凭空写出完整 DNA。','遗传信息'],
    'Central Dogma': ['描述遗传信息常见流向的教学框架：DNA 可以被复制，DNA 可转录为 RNA，mRNA 可翻译为 protein。','gene 的 DNA 序列经 transcription 与 translation 影响 protein。','它不是“所有 RNA 都必须做成 protein”的定律。','遗传信息'],
    'Template strand': ['transcription 时 RNA polymerase 实际读取的 DNA 链；新 RNA 与它互补。','要写出 RNA 序列，先固定 template strand 的方向。','template strand 与 coding strand 不能在同一 gene 上混用。','遗传信息'],
    'Promoter': ['靠近 transcription 起点、帮助招募转录机器的 DNA 区域。','某 promoter 的活性降低时，对应 gene 的 RNA 可能下降。','promoter 与远处 enhancer 都能调控，但位置和作用不相同。','遗传信息'],
    'Intron': ['gene 转录后通常会在 RNA 加工中被剪除的片段。','一个 pre-mRNA 的 intron 可在 splicing 时被移除。','intron 不等于完全无功能；有些位置参与调控。','遗传信息'],
    'Exon': ['成熟 RNA 中保留下来的转录片段；不同 exon 组合可形成不同 isoform。','某个 exon 被跳过时，protein 的一段结构可能变化。','exon 不都编码 protein，部分属于 untranslated region。','遗传信息'],
    'Codon': ['mRNA 上连续三个 nucleotide 组成的读取单位，通常指定一个 amino acid 或终止信号。','AUG 常作为 translation 的起始 codon。','codon 的意义依赖 reading frame；错一位就会重分组。','遗传信息'],
    'Reading frame': ['从哪里开始把 mRNA 每三个 nucleotide 分为一组的规则。','插入一个 nucleotide 后，后续 codon 可能全部重排。','看到一段序列不先定方向和起点，不能直接翻译。','遗传信息'],
    'Ribosome': ['沿 mRNA 读取 codon 并把 amino acid 接成 protein 链的分子机器。','ribosome 读到终止 codon 时结束这条链。','ribosome 做的是 translation，不是 transcription。','遗传信息'],
    'Transcription factor': ['能结合特定 DNA 区域并影响 gene transcription 的 protein；效果取决于 cell 情境和伙伴。','同一 TF 在有无开放 chromatin 时可能产生不同输出。','看到 binding peak 不足以证明它调控了某个 gene。','遗传信息'],
    'Chromatin': ['DNA 与相关 protein 组成的组织状态，影响某段 DNA 是否容易被读取或接触。','某 enhancer 附近 chromatin 变得更可及。','开放 chromatin 不等于该 gene 必然转录。','遗传信息'],
    'Nucleosome': ['DNA 绕在 histone protein 上形成的基本包装单元，可改变局部 DNA 的可及性。','TF 要结合某位点时可能与 nucleosome 竞争。','它不是一整条 chromosome。','遗传信息'],
    'Epigenetics': ['在 DNA 序列不变时仍能影响 gene 使用方式的可维持调控状态，常涉及 chromatin 与化学修饰。','同一 genome 的不同 cell type 可保持不同表达模式。','“epigenetic”不等于所有环境效应都可遗传给下一代。','遗传信息'],
    'Cis-regulatory element': ['位于某条 DNA 分子上的调控序列，影响同一分子附近或远处 target gene 的表达。','promoter 和 enhancer 都可属于 cis-regulatory element。','cis 指序列作用位置，不是说它一定紧贴 gene。','遗传信息'],
    'Spliceosome': ['识别 pre-mRNA 边界并完成 splicing 的 RNA–protein 机器。','它移除 intron，连接选定 exon。','spliceosome 参与加工 RNA，不是复制 DNA。','遗传信息'],
    'Isoform': ['同一 gene 产生的不同 RNA 或 protein 版本，可能由 splicing 或不同起止位置形成。','某组织保留一个 exon，而另一组织跳过它。','gene 总量不变时，isoform 比例仍可能变化。','遗传信息'],
    'Reaction coupling': ['把一个不利于自行发生的反应与有利反应连接，让整体过程可以推进。','ATP 水解可与离子逆梯度运输耦联。','ATP 不是魔法；必须有具体的耦联机制。','能量与代谢'],
    'Equilibrium': ['正反方向的净变化为零的状态；分子仍可来回反应。','封闭体系的某反应最终可能接近平衡。','处于 equilibrium 不表示所有分子都停止运动。','能量与代谢'],
    'NADH': ['携带高能电子的分子，能把代谢中获得的还原力交给 electron transport chain。','glucose 分解产生的部分 NADH 可支持 ATP 生成。','NADH 数量本身不等于 ATP 产量或 flux。','能量与代谢'],
    'Glycolysis': ['在 cytosol 中把 glucose 的六碳骨架分成较小分子的反应序列，同时转移部分能量。','一分子 glucose 可形成两分子 pyruvate。','glycolysis 存在不表示 cell 完全不用 mitochondrion。','能量与代谢'],
    'Tricarboxylic acid cycle': ['在线粒体内把进入的碳进一步氧化，并把电子转移给 NADH/FADH₂ 的循环。','acetyl-CoA 的碳进入循环后，部分最终以 CO₂ 离开。','循环图不表示每个中间物只用于燃烧；它们也可供 biosynthesis。','能量与代谢'],
    'Oxidative phosphorylation': ['electron transport 建立跨膜 proton 梯度，ATP synthase 利用这个梯度合成 ATP 的过程。','阻断 electron transport 可削弱这一路 ATP 产生。','oxygen consumption 不等于全部 ATP 都来自此过程。','能量与代谢'],
    'Ligand': ['能与 receptor 或其他目标分子结合的分子；结合后是否产生反应，还看目标状态。','一种 cytokine 可作为 receptor 的 ligand。','结合不一定等于激活；有些 ligand 会阻断或减弱 receptor 的反应。','细胞与疾病'],
    'Receptor': ['接收外部或内部信号并改变 cell 内部活动的分子，通常是 protein。','cell 表面的 receptor 识别 ligand 后启动后续 signaling。','检测到 receptor 不代表 downstream signaling 正在发生。','细胞与疾病'],
    'Checkpoint': ['在关键过程继续前检查条件的控制节点。','DNA 损伤未修复时，cell cycle checkpoint 可延缓分裂。','checkpoint 是调控机制，不是固定的时间点。','细胞与疾病'],
    'Negative feedback': ['过程的输出反过来抑制上游，使系统避免无限放大或帮助恢复稳定。','信号激活后诱导抑制蛋白，随后信号下降。','endpoint 相同不表示此前的时间轨迹相同。','细胞与疾病'],
    'Cytokine': ['immune 和其他 cell 用来传递局部或全身信息的一类小型 signaling protein。','受感染组织释放 cytokine，改变附近 immune cell 的行为。','测到 cytokine 高不自动指出是哪类 cell 产生。','免疫'],
    'Meiosis': ['生殖细胞形成时的特殊分裂，使 chromosome 套数减半并重新组合 allele。','父母各提供一套 chromosome 给子代。','meiosis 不等于普通体细胞的 mitosis。','遗传信息'],
    'Recombination': ['来自两条 homologous chromosomes 的 DNA 片段在 meiosis 中交换，产生新 allele 组合。','同一 chromosome 上两个 locus 也可能在后代中分开。','距离近的 locus 重组通常较少，但不是绝不发生。','遗传信息'],
    'Linkage': ['同一 chromosome 上的两个 locus 因物理邻近而倾向一起遗传。','相距很近的 marker 可帮助追踪疾病家系。','linkage 不是“一个 gene 直接调控另一个 gene”。','遗传信息'],
    'Linkage disequilibrium': ['群体中两个 allele 的组合频率偏离独立组合的情形。','GWAS hit 可能只是与真正 causal variant 处于 LD。','LD 是统计关联，不证明两个位点物理互作。','遗传信息'],
    'TCR': ['T-cell receptor，T cell 表面用来识别特定 peptide–MHC 组合的受体。','某 CD8 T cell 的 TCR 识别 tumor cell 呈递的 peptide。','TCR 不是游离 antibody，也不通常单独识别完整蛋白。','免疫'],
    'Antigen-presenting cell': ['处理 antigen 并将 peptide 展示给 T cell 的 cell，常同时提供激活所需的其他信号。','dendritic cell 可在淋巴结启动 naive T cell。','只展示 peptide 不一定足以产生有效激活。','免疫'],
    'PAMP': ['某些微生物常见、可被 innate immune receptor 识别的分子模式。','细菌的某些表面成分可触发先天免疫。','PAMP 是类别，不是一种特定病原体。','免疫'],
    'Immune checkpoint': ['调节 immune response 强度的抑制或共刺激控制机制。','PD-1 信号可降低部分 T cell 的效应活动。','阻断 checkpoint 不保证每个 tumor 都会响应。','免疫'],
    'Negative control': ['理论上不该产生目标信号的对照，用来检测背景、污染或非特异性。','无模板 PCR 管出现扩增，提示实验背景问题。','negative control 为零也不能排除所有系统误差。','实验与数据'],
    'Library': ['把样本 DNA/RNA 处理成可被测序仪读取的一组分子片段；建库规则会影响最终读数。','RNA-seq library 的片段后来被测成 reads。','library 不是原始组织，也不是测序后的 count table。','实验与数据'],
    'UMI': ['建库时加在分子上的短随机标签，用来近似识别哪些 reads 可能来自同一个原始分子。','同一 UMI 的重复 reads 可在特定规则下折叠。','UMI 不会自动消除所有 PCR 或捕获偏差。','实验与数据'],
    'FDR': ['多次检验中，对判为显著的一组结果所期望的错误发现比例的控制目标。','筛选许多 genes 时常用 FDR 而非只看原始 p 值。','FDR 5% 不表示单个结果有 95% 概率为真。','实验与数据'],
    'Composition bias': ['不同样本的大量分子构成变化会影响相对读数的分母，制造或掩盖表面差异。','少数 gene 占去更多 reads 后，其余 gene 的 CPM 可下降。','normalization 无法凭空恢复未测到的绝对分子数。','实验与数据']
  };

  const normalized = name => String(name).trim().toLocaleLowerCase();
  const entries = new Map();
  for (const course of window.BIOCS_BOOK || []) for (const chapter of course.chapters) for (const term of chapter.terms || []) {
    const key = normalized(term[0]);
    if (!entries.has(key)) entries.set(key, {label:term[0], simple:term[1], example:'', caution:'', category:'其他术语', chapterId:chapter.id, sourceKey:term[2]});
  }
  for (const [label, detail] of Object.entries(curated)) {
    const key = normalized(label);
    const original = entries.get(key) || {};
    const missingSources = {DNA:'osNucleic',RNA:'osNucleic',Protein:'osProtein',Genome:'osNucleic',Variant:'nhMutation',Antibody:'osAdaptiveImmune',Count:'gdcRNA',eQTL:'gtex'};
    const preferredChapter = {Cell:'b05',DNA:'g01',RNA:'m03',Protein:'m05',Genome:'g02',Variant:'g05',Antibody:'i04',Count:'d04',eQTL:'x20',VAF:'x14','Tumor purity':'x14','Copy number':'x14','Cancer cell fraction':'x14','T cell':'i03','Metabolic flux':'a02'};
    const preferredSource = {VAF:'vafPurityPaper'};
    entries.set(key, {...original, label, simple:detail[0], example:detail[1], caution:detail[2], category:detail[3], chapterId:preferredChapter[label] || original.chapterId || 'b01', sourceKey:preferredSource[label] || original.sourceKey || missingSources[label]});
  }
  window.BIOCS_GLOSSARY = {
    entries,
    normalized,
    essentials: Object.keys(curated),
    get(name) { return entries.get(normalized(name)); }
  };
})();
