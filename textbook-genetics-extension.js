/* Project-facing genetics extension: exceptions, regulatory genetics, immunogenetics and tumor evolution. */
(() => {
  const chapter = window.BIOCS_MAKE_BREADTH_CHAPTER;
  const term = window.BIOCS_TERM;
  const course = window.BIOCS_BOOK.find(item => item.code === '01B');
  if (!chapter || !term || !course) return;
  course.chapters.push(
    chapter({
      id:'x17', title:'Mosaicism、imprinting、X-inactivation 与 heteroplasmy', subtitle:'同一个人内部也不一定只有一种简单 genotype→phenotype 关系。',
      intuition:'受精卵给出起点，但之后的 somatic mutation、parent-of-origin regulation、随机 X-inactivation 与 mitochondrial segregation 会让同一个体内部出现不同遗传状态。',
      mental:'把个体想成一棵不断分叉的 cell lineage tree：越晚发生的 mutation 只进入较小分支；有些 allele 的作用还取决于来自父亲还是母亲、位于哪条 X chromosome，或一个细胞含多少 mutant mitochondria。',
      mechanism:'<strong>Mosaicism</strong>来自 fertilization 后产生并扩增的 genetic difference；若进入 germ cell lineage，下一代风险与 blood VAF 不能简单对应。<strong>Genomic imprinting</strong>通过 parent-of-origin-specific epigenetic state 让部分 locus 主要表达一个 parental allele。XX cell 的一条 X chromosome 在早期发生大范围 inactivation，但部分 gene escape，且不同 cell 的选择可形成 skew。Mitochondria 有多份 genome，<strong>heteroplasmy</strong>与 replicative segregation 使不同 tissue 的 mutant fraction 和 threshold effect 不同。',
      evidence:'Blood、saliva、skin 或 affected tissue 的 deep sequencing 可比较 mosaic fraction；parent–child phasing 帮确定 allele origin；allele-specific RNA 与 methylation 可观察 imprinting 或 X-linked expression；mitochondrial variant 要同时报告 tissue、depth 与 heteroplasmy。未在 blood 检出不能排除 tissue-limited 或 germline mosaicism。',
      project:'变异解释表必须分开 sample tissue、estimated mosaic fraction、phase、parental origin 和 phenotype tissue。Single-cell sequencing 可定位 lineage，但 amplification dropout 与 doublet 会制造假 mosaic。研究 X-linked expression 时把 sex chromosome dosage、escape status 与 cell mixture 纳入模型。',
      pitfall:'“一个人的 genotype”是方便的简写，不代表身体所有细胞、所有 allele 与所有 tissue 都以完全相同方式表达。',
      terms:[term('Mosaicism / 嵌合现象','同一个体内存在由一个 zygote 衍生但 genotype 不同的 cell population。','nhMutation'),term('Genomic imprinting / 基因组印记','部分 locus 的 activity 依赖 allele 的亲本来源。','osMendel'),term('X-inactivation / X 染色体失活','XX cell 中一条 X chromosome 发生大范围转录抑制的 dosage-compensation 过程。','nhChrom'),term('Heteroplasmy / 异质性线粒体状态','同一细胞或个体内共存不同 mitochondrial genome。','clinvar'),term('Germline mosaicism / 生殖系嵌合','部分 germ cell 携带而其他 tissue 可能低或未检出的 variant。','clinvar')],
      check:['Blood sequencing 没有检测到 parental variant，能把孩子的 variant 风险写成绝对 de novo 吗？','不能。还要考虑检测限、低水平或 germline mosaicism、sample tissue 与亲缘/样本确认。'],
      worked:['判断 8% blood VAF 的含义',['先核对 depth、strand、base quality 与 independent validation，排除 artifact。','确认 local copy number 与 sample composition。','把 8% 写成 blood DNA read-level observation，不直接写成 8% 全身细胞。','若 phenotype 位于其他 tissue，考虑对相关 tissue 或 family 做补充检测。']],
      sources:['nhMutation','osMendel','nhChrom','clinvar'], prereq:['x09','x10'], core:'Information Flow / 信息流', flow:[['Zygote','共同起点'],['Lineage','细胞逐步分叉'],['Allele state','origin/X/mtDNA'],['Tissue phenotype','比例与阈值']]
    }),
    chapter({
      id:'x18', title:'Structural variation、aneuploidy 与 whole-genome doubling', subtitle:'Genome 改变的不只是一两个 nucleotide，也可能是一整段或整套 chromosome。',
      intuition:'把 genome 想成有顺序、方向和份数的章节集合：small variant 改字，structural variant 可以删除、复制、翻转或把整段接到另一章；aneuploidy 改变整条 chromosome 的数量。',
      mental:'先画两条 homolog，再标记每段的方向和 copy number。任何事件都问三件事：断点在哪里、片段如何重新连接、每个 cell 最终有几份。',
      mechanism:'Structural variation 包括 deletion、duplication、inversion、insertion、translocation 与复杂 rearrangement。Copy-number change 会产生 gene dosage effect，也可形成 fusion gene、截断 regulatory domain 或暴露新的 enhancer context。<strong>Aneuploidy</strong>是特定 chromosome 数异常；<strong>whole-genome doubling</strong>使整个 genome copy 基线增加，之后仍可继续丢失或增益。Tumor 的 total CN=2 不应在所有 segment 被默认成正常 baseline。',
      evidence:'Paired-end orientation、split read、read depth、allele balance、long read、optical mapping、karyotype 与 FISH 各覆盖不同 size 和结构。Depth 告诉 copy 改变但不总能确定 adjacency；breakpoint read 告诉连接但在 repeat region 容易漏。Bulk caller 输出的是混合样本的模型估计，并受 purity、ploidy 和 subclone 影响。',
      project:'CNV/structural-variant 表要保留 genome build、segment boundary、total/minor CN、caller、quality 与 sample purity。解释 fusion 前同时检查 DNA breakpoint、RNA junction、reading frame 与 protein evidence。做 expression–CN 关联时按 patient 为 independent n，并控制 tumor type 与 composition。',
      pitfall:'“Amplification”不是 expression 的同义词；DNA copy gain 可能提高 dosage，但 transcription、feedback 与 cell state 决定最终 RNA/protein。',
      terms:[term('Structural variant / 结构变异','改变较大片段顺序、方向、位置或数量的 genome event。','gdcDNA'),term('Aneuploidy / 非整倍性','一个或多个 chromosome 数目偏离完整套数。','nhCNV'),term('Whole-genome doubling / 全基因组加倍','整个 chromosome complement 发生复制的事件。','nciCancer'),term('Breakpoint / 断点','reference 中原本不相邻或连续的片段在样本 genome 中被切断/连接的位置。','gdcVCF'),term('Minor copy number / 次要等位拷贝数','一个 segment 中较少的 allele copy 数模型估计。','nhCNV')],
      check:['某 tumor segment total CN=4，能直接称为 focal amplification 吗？','不能。若 tumor 经 whole-genome doubling，CN=4 可能接近其 genome-wide baseline；还需 ploidy、segment context 和 purity。'],
      worked:['从 depth 与 allele balance 解释 LOH',['先用 matched normal heterozygous SNP 确认原本存在两个 allele。','观察 tumor segment 的 depth 与 B-allele frequency。','结合 purity/ploidy 拟合 total CN 与 minor CN。','minor CN 接近 0 才支持 LOH；不要只凭 expression 下降。']],
      sources:['nhCNV','gdcDNA','gdcVCF','nciCancer'], prereq:['x14','x17'], core:'Information Flow / 信息流', flow:[['Breakage','DNA 断裂'],['Rejoin/segregate','重接或错误分离'],['Copy/structure','份数与邻接改变'],['Dosage/function','上下文依赖后果']]
    }),
    chapter({
      id:'x19', title:'Allele-specific expression 与 cis/trans regulation', subtitle:'总 expression 相同时，两条 homolog 的贡献也可能完全不同。',
      intuition:'Diploid cell 中两个 allele 共享大部分 trans environment；若其中一条持续表达更多，差异常提示与该 chromosome 同行的 cis effect，但测量偏差必须先排除。',
      mental:'把两个 allele 想成同一间厨房里的两份 recipe。TF 和 signaling 是共享的 trans environment；promoter/enhancer variant 是只贴在其中一份 recipe 上的 cis change。',
      mechanism:'在 heterozygous transcribed site 上，可用 allele-supporting reads 估计 <strong>allele-specific expression</strong>。Cis-regulatory variant、imprinting、X-inactivation、allele-specific methylation 或 nonsense-mediated decay 都可造成 imbalance；copy-number imbalance 也会改变 DNA 与 RNA allele ratio。Trans factor 改变通常同时影响两个 allele，但 allele-specific TF binding 可能放大 cis 差异。',
      evidence:'先在 DNA 确认 heterozygous genotype 和 allele balance，再比较 RNA allele counts。Reference-mapping bias 会让 reference allele 获得更多 reads；WASP-like remapping、personalized genome 或模拟可评估。Phasing 把 regulatory variant、coding marker 与 haplotype 相连。ASE 是 locus/sample-specific read count，不能把每个 read 当 independent biological replicate。',
      project:'分析 ASE 时记录 minimum depth、mapping policy、CNV、RNA editing、imprinting status 与 cell mixture。Single-cell ASE 很稀疏，allelic dropout 可模拟 monoallelic expression；优先在 donor/pseudobulk 层报告 uncertainty。用 CRISPR base edit 或 allele-specific perturbation 才能进一步验证 regulatory variant。',
      pitfall:'观察到 70:30 RNA allele ratio 不等于 promoter 活性正好差 70:30；RNA stability、splicing、mapping 与 copy number 都参与生成该比值。',
      terms:[term('Allele-specific expression / 等位基因特异表达','同一 heterozygous individual 中两个 allele 的 RNA contribution 不相等。','gtex'),term('Cis effect / 顺式效应','由同一 DNA molecule 上的 sequence/context 对附近 allele 产生的调控影响。','encodeProject'),term('Trans effect / 反式效应','可扩散 factor 或共享 cellular environment 对 allele 产生的调控影响。','encodeProject'),term('Mapping bias / 比对偏倚','read 因更接近 reference allele 而更容易被比对或保留。','gdcRNA'),term('Allelic imbalance / 等位基因失衡','两个 allele 在 DNA/RNA/结合 signal 中贡献不相等。','nhHaplotype')],
      check:['RNA 中 allele A:B=70:30，能直接证明 A 上的 enhancer 更强吗？','不能。先检查 DNA CN/allele balance、mapping bias、imprinting、NMD、cell mixture，再用原位 perturbation 测 enhancer。'],
      worked:['把 ASE 接回 enhancer variant',['在 DNA 证明样本对 marker 与 candidate variant 均 heterozygous。','用 phasing 确认两者是否位于同一 haplotype。','用 bias-aware pipeline 估计 RNA allelic imbalance。','在 matched context 做 allele-specific CRISPR perturbation，并查看 imbalance 是否按预测改变。']],
      sources:['gtex','encodeProject','gdcRNA','nhHaplotype'], prereq:['x06','x08','x10','x17'], core:'Information Flow / 信息流', flow:[['Heterozygous DNA','两个 allele'],['Cis/trans context','共享与非共享输入'],['Allelic reads','带偏差的观察'],['Perturbation','验证调控来源']]
    }),
    chapter({
      id:'x20', title:'eQTL、sQTL、colocalization 与 causal gene', subtitle:'Variant 和 molecular phenotype 相关，不等于已经找到疾病机制。',
      intuition:'Molecular QTL 把 genotype 与 RNA 层表型连接，是 GWAS locus 到机制之间的一座桥；桥是否通向同一个 causal signal、相关 tissue 与真实 target 仍需逐步检验。',
      mental:'想象 GWAS 与 eQTL 各自在地图上画出一片 LD 模糊区域。两片重叠不必然表示同一栋房子；colocalization 要比较它们是否可由同一个 hidden causal variant 解释。',
      mechanism:'<strong>eQTL</strong>检验 genotype 与 expression 的关联；<strong>sQTL</strong>连接 genotype 与 splicing phenotype。Cis window 是分析定义，不保证 biological cis target；trans-QTL 测试范围更广、multiple testing 与 batch 更困难。Colocalization 比较 shared causal signal 与 distinct linked signals 的模型。Mediation 提出 variant→molecular trait→disease 路线，但 unmeasured confounding、LD 与 sample overlap 会破坏简单解释。',
      evidence:'可靠分析要统一 genome build、effect allele、LD reference、ancestry 和 tissue/context，并检查是否存在 multiple causal signals。Bulk tissue eQTL 可能来自 cell proportion；stimulus-specific 或 cell-type-specific effect 会在静息 bulk 中消失。统计 colocalization 是优先级证据，不是 biochemical proof。',
      project:'建立 locus-to-gene 表时分列 nearest gene、eQTL/sQTL target、chromatin contact、coding consequence 与 perturbation evidence。不要把数据库的 mapped gene 合并成唯一答案。若 GWAS 与 QTL cohort ancestry 不匹配，LD 差异可改变 credible set 和 coloc posterior。',
      pitfall:'GWAS lead SNP 同时是 eQTL，不足以宣布该 gene mediates disease；同一 LD block 的两个 causal variant 也能制造表面重叠。',
      terms:[term('Expression quantitative trait locus / eQTL','与 gene expression quantitative variation 相关的 genomic locus。','gtex'),term('Splicing quantitative trait locus / sQTL','与 splicing phenotype variation 相关的 genomic locus。','gtex'),term('Colocalization / 共定位分析','比较两个 association signal 是否可能共享 causal variant 的统计方法。','ebiGwas'),term('Credible set / 可信集合','在模型与数据下包含 causal candidate 的一组 variants。','ebiGwas'),term('Mediation / 中介路径','一个 exposure 通过中间变量影响 outcome 的因果模型。','nhGWAS')],
      check:['GWAS locus 与 liver eQTL 的 lead SNP 相同，能直接写“liver expression mediates disease”吗？','不能。还需 LD/多信号 colocalization、方向、relevant cell/context 和 perturbation；相同 lead SNP 也可能标记不同 causal event。'],
      worked:['四层 locus-to-gene 证据表',['固定 build、effect allele、ancestry 与 LD reference。','分别记录 fine-mapping 与 eQTL/sQTL credible set。','评估 colocalization，并检查 multiple-signal sensitivity。','加入 enhancer contact、allele-specific 与 perturbation evidence，保留多个候选和不确定性。']],
      sources:['gtex','ebiGwas','nhGWAS','encodeProject'], prereq:['x10','x13','x19'], core:'Information Flow / 信息流', flow:[['GWAS','disease association'],['Molecular QTL','RNA phenotype association'],['Colocalization','shared-signal model'],['Function','target/机制验证']]
    }),
    chapter({
      id:'x21', title:'HLA variation、antigen presentation 与 immunogenetics', subtitle:'免疫系统“看见什么”部分由高度多态的 HLA genotype 决定。',
      intuition:'T cell 不是直接读取整条 tumor protein；peptide 必须被特定 HLA molecule 装载并展示。不同人拥有不同 HLA alleles，因此同一个 mutation 不会在每个人身上产生相同可见性。',
      mental:'把 HLA 想成形状不同的展示槽：protein 被切成 peptide 后，只有兼容的片段较稳定地装进槽并到达 cell surface；TCR 再识别 peptide–HLA 组合。',
      mechanism:'HLA class I 通常向 CD8 T cell 呈递 intracellular protein-derived peptide，class II 多向 CD4 T cell 呈递 endosomal/extracellular-derived peptide。HLA locus 高度 polymorphic 且需要 phasing/typing；每个 allele 有不同 binding preference。Tumor 可通过 HLA allele loss、B2M disruption、processing defect 或 interferon-pathway change 降低可见性。Somatic mutation 只生成 candidate neoantigen，仍需 expression、processing、binding、presentation、TCR recognition 与 functional response。',
      evidence:'HLA typing 可来自 targeted assay 或 sequencing inference；binding predictor 给候选 rank；immunopeptidomics 直接检测呈递 peptide 但 sensitivity 有限；tetramer、TCR reconstruction 与 killing assay 测 specificity/function。RNA expression 或 predicted affinity 单独不足以证明 surface presentation。',
      project:'Neoantigen pipeline 要保留 somatic variant QC、transcript isoform、tumor expression、HLA type、peptide processing/binding prediction 与 clonality。Train/test 按 patient 拆分，避免同一 peptide/HLA 近重复泄漏。HLA LOH 解释必须结合 allele-specific CNV 与 purity。',
      pitfall:'“Tumor 有 mutation”不等于“免疫系统能看见它”；“有 T cell”也不等于存在该 antigen-specific killing。',
      terms:[term('HLA genotype / HLA 基因型','个体携带的 human leukocyte antigen allele 组合。','uiucMcb408'),term('Antigen presentation / 抗原呈递','peptide 与 MHC/HLA 复合并展示给 T cell 的过程。','osAdaptiveImmune'),term('Neoantigen / 新生抗原','由 tumor-specific alteration 产生的候选新 peptide antigen。','nciCheckpoint'),term('Immunopeptidomics / 免疫肽组学','质谱测量 HLA-bound peptide repertoire 的方法。','uiucMcb408'),term('HLA loss of heterozygosity / HLA 杂合性缺失','tumor 丢失一个 HLA allele contribution 的 somatic event。','nciCancer')],
      check:['预测软件显示 mutant peptide 具有高 HLA binding affinity，能说患者一定有抗肿瘤 T-cell response 吗？','不能。还缺 expression、processing、真实 presentation、TCR repertoire、activation 与 tissue access 等环节。'],
      worked:['从 mutation 到可检验 neoantigen',['确认 mutation 为可靠 somatic event 并估计 clonality。','确认相关 transcript/isoform 在 tumor 中表达。','结合 patient HLA type 生成并排序 candidate peptide。','用 immunopeptidomics/tetramer/TCR 或 killing assay 验证 presentation 与功能。']],
      sources:['uiucMcb408','osAdaptiveImmune','nciCheckpoint','nciCancer'], prereq:['x08','x14','i03'], core:'Information Flow / 信息流', flow:[['Mutation','candidate sequence'],['Processing','产生 peptide'],['HLA','选择并呈递'],['TCR','识别与功能']]
    }),
    chapter({
      id:'x22', title:'Multi-region tumor phylogeny 与 resistance evolution', subtitle:'一块 biopsy 只看到肿瘤历史的一小片终点。',
      intuition:'Tumor 像一棵在空间和治疗压力下分叉的 cell lineage tree：trunk event 被许多后代共享，branch event 只在部分区域或时间点出现。',
      mental:'把不同 region/timepoint 画成树叶。先用 mutation/CNV 的共同与特有组合推断可能祖先，再把 treatment 放在时间线上，看哪些 branch 在治疗后扩张；不要按 VAF 大小直接排序事件。',
      mechanism:'Clone 通过 mutation、CNV、epigenetic state 与 microenvironmental selection 产生差异。<strong>Truncal event</strong>在 sampled clone 中广泛共享；<strong>branch/private event</strong>限于部分 lineage。Therapy 改变 fitness landscape，可选择 pre-existing resistant clone，也可允许新 event 后扩张。Phylogeny inference 依赖 purity/CN-adjusted CCF、mutation co-occurrence 与模型假设；recombination 少不代表 infinite-sites assumption 永远成立，copy loss、parallel evolution 与 sequencing dropout 会破坏简单树。',
      evidence:'Multi-region bulk 提供各区域 mutation prevalence；longitudinal sample 加入时间；single-cell DNA/RNA 可观察 event combinations 但有 dropout 与 limited coverage；ctDNA 混合多个 lesion，时间分辨率高但空间来源不明确。Tree 是与数据相容的模型，常存在多个近似解。',
      project:'建立 patient-level event matrix，按 region/timepoint 保存 VAF、purity、total/minor CN 和 detection limit。只在足够 coverage 的可比较位点判断 absence。报告 clone tree uncertainty，并把 treatment、anatomical site 与 sampling date 显式画在树旁。验证 resistance candidate 时回到 perturbation/rescue。',
      pitfall:'后期样本 VAF 较高不证明 mutation 在时间上更早；copy gain、purity 和 clone expansion 都会改变 VAF。',
      terms:[term('Truncal mutation / 主干突变','在所采样多个 tumor lineage 中广泛共享、与较早共同祖先相容的 mutation。','nciCancer'),term('Subclone / 亚克隆','由共同 tumor ancestor 衍生、携带额外可区分特征的 cell population。','vafPurityPaper'),term('Tumor phylogeny / 肿瘤系统发育','用遗传事件组合重建 tumor lineage branching 的模型。','gdcDNA'),term('Parallel evolution / 平行演化','不同 branch 独立改变同一 gene/pathway 的现象。','nhMutation'),term('Detection limit / 检测下限','在给定 depth、noise 与方法下可可靠发现 signal 的最低范围。','gdcVCF')],
      check:['Mutation A 在所有 region VAF≈0.2，mutation B 只在一个 region VAF≈0.5，能按 VAF 断定 B 比 A 更早吗？','不能。需要 purity、CN、CCF 和 event co-occurrence；B 的高 VAF 可来自 local LOH 或高-purity subclone。'],
      worked:['三份 biopsy 的最小 clone 推理',['逐样本校正 coverage、purity 与 allele-specific CN。','把 mutation 转成带 uncertainty 的 CCF，而不是直接用 VAF。','用共享 event 建 trunk 候选，用共现组合建 branch；保留多个兼容 tree。','把 treatment 与时间加回图中，再提出可扰动的 resistance mechanism。']],
      sources:['nciCancer','vafPurityPaper','gdcDNA','gdcVCF','nhMutation'], prereq:['x14','x18'], core:'Evolution / 演化', flow:[['Ancestor','共享早期事件'],['Branching','空间/时间分叉'],['Selection','环境与治疗'],['Resistance','clone 扩张与验证']]
    })
  );
  course.description = '22 章深入连接 chromosome、replication、repair、regulation、inheritance、molecular QTL、immunogenetics 与 tumor evolution。';
})();
