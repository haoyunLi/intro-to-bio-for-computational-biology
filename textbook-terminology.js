/* Display policy: explain in Chinese, keep biological technical terms in English. */
(() => {
  const pairs = [
    ['分子遗传学','Molecular Genetics'],['分子生物学','Molecular Biology'],['细胞生物学','Cell Biology'],['发育生物学','Developmental Biology'],['演化生物学','Evolutionary Biology'],['肿瘤生物学','Cancer Biology'],['微生物学','Microbiology'],['免疫学','Immunology'],['神经科学','Neuroscience'],['生态学','Ecology'],['结构生物学','Structural Biology'],['生物物理学','Biophysics'],['比较解剖学','Comparative Anatomy'],['动物行为学','Animal Behavior'],['病毒学','Virology'],['药理学','Pharmacology'],['代谢组学','metabolomics'],['生物信息学','bioinformatics'],['生物大分子','macromolecule'],['碳水化合物','carbohydrate'],['蛋白','protein'],['脂质','lipid'],['遗传','inheritance'],['性状','trait'],['谱系','lineage'],['配子','gamete'],['受精','fertilization'],['胚胎','embryo'],['物种','species'],['内分泌','endocrine'],['显微镜','microscopy'],['荧光','fluorescence'],['细胞培养','cell culture'],['流式细胞术','flow cytometry'],['蛋白折叠','protein folding'],['亲和力','affinity'],['动力学','kinetics'],['毒力','virulence'],['药代动力学','pharmacokinetics'],['药效动力学','pharmacodynamics'],['动物行为','animal behavior'],['比较解剖','comparative anatomy'],['微生物群落','microbial community'],
    ['主要组织相容性复合体','MHC'],['病原相关分子模式','PAMP'],['损伤相关分子模式','DAMP'],['变异等位基因分数','VAF'],['肿瘤微环境','tumor microenvironment'],['细胞外基质','extracellular matrix'],['电子传递链','electron transport chain'],['氧化磷酸化','oxidative phosphorylation'],['底物水平磷酸化','substrate-level phosphorylation'],['三羧酸循环','TCA cycle'],['柠檬酸循环','TCA cycle'],['磷酸戊糖途径','pentose phosphate pathway'],['糖异生','gluconeogenesis'],['糖酵解','glycolysis'],['脂肪酸氧化','fatty-acid oxidation'],['脂肪酸合成','fatty-acid synthesis'],['克隆选择','clonal selection'],['亲和力成熟','affinity maturation'],['免疫检查点','immune checkpoint'],['免疫耐受','immune tolerance'],['免疫记忆','immunological memory'],['抗原呈递细胞','antigen-presenting cell'],['自然杀伤细胞','natural killer cell'],['调理作用','opsonization'],['受体编辑','receptor editing'],['阳性选择','positive selection'],['阴性选择','negative selection'],['体细胞高频突变','somatic hypermutation'],['类别转换重组','class-switch recombination'],['适应性免疫','adaptive immunity'],['先天免疫','innate immunity'],['遗传连锁','genetic linkage'],['连锁不平衡','linkage disequilibrium'],['孟德尔遗传','Mendelian inheritance'],['数量性状','quantitative trait'],['群体结构','population structure'],['外显率','penetrance'],['表现度','expressivity'],['遗传力','heritability'],['多效性','pleiotropy'],['上位性','epistasis'],['剂量效应','dosage effect'],['拷贝数变异','copy-number variation'],['拷贝数','copy number'],['同源染色体','homologous chromosome'],['姐妹染色单体','sister chromatid'],['有丝分裂','mitosis'],['减数分裂','meiosis'],['同源重组','homologous recombination'],['基因转换','gene conversion'],['遗传漂变','genetic drift'],['基因流','gene flow'],['等位基因频率','allele frequency'],['等位基因','allele'],['单倍型','haplotype'],['基因型','genotype'],['表型','phenotype'],['染色体','chromosome'],['基因组','genome'],['基因','gene'],['胚系','germline'],['体细胞','somatic cell'],['顺式调控元件','cis-regulatory element'],['远端调控元件','distal regulatory element'],['转录因子','transcription factor'],['启动子','promoter'],['增强子','enhancer'],['沉默子','silencer'],['染色质','chromatin'],['组蛋白','histone'],['甲基化','methylation'],['表观遗传','epigenetics'],['染色质可及性','chromatin accessibility'],['外显子','exon'],['内含子','intron'],['可变剪接','alternative splicing'],['剪接','splicing'],['转录本','transcript'],['转录','transcription'],['翻译','translation'],['复制','replication'],['中心法则','Central Dogma'],['核苷酸','nucleotide'],['核酸','nucleic acid'],['氨基酸','amino acid'],['多肽','polypeptide'],['蛋白质','protein'],['酶','enzyme'],['底物','substrate'],['代谢物','metabolite'],['代谢通量','metabolic flux'],['代谢','metabolism'],['氧化还原','redox'],['氧化','oxidation'],['还原','reduction'],['自由能','free energy'],['化学键','chemical bond'],['共价键','covalent bond'],['氢键','hydrogen bond'],['受体','receptor'],['配体','ligand'],['信号转导','signal transduction'],['信号通路','signaling pathway'],['第二信使','second messenger'],['磷酸化','phosphorylation'],['反馈','feedback'],['细胞周期','cell cycle'],['细胞凋亡','apoptosis'],['程序性细胞死亡','programmed cell death'],['干细胞','stem cell'],['祖细胞','progenitor cell'],['细胞命运','cell fate'],['分化','differentiation'],['形态发生','morphogenesis'],['再生','regeneration'],['可塑性','plasticity'],['上皮–间质转化','EMT'],['上皮-间质转化','EMT'],['机械转导','mechanotransduction'],['细胞膜','cell membrane'],['细胞质','cytoplasm'],['细胞核','nucleus'],['细胞器','organelle'],['线粒体','mitochondrion'],['核糖体','ribosome'],['内质网','endoplasmic reticulum'],['高尔基体','Golgi apparatus'],['溶酶体','lysosome'],['吞噬作用','phagocytosis'],['细胞','cell'],['组织','tissue'],['器官','organ'],['抗原','antigen'],['抗体','antibody'],['补体','complement'],['细胞因子','cytokine'],['趋化因子','chemokine'],['炎症','inflammation'],['免疫治疗','immunotherapy'],['疫苗','vaccine'],['病原体','pathogen'],['免疫系统','immune system'],['免疫','immunity'],['微生物群','microbiota'],['微生物','microorganism'],['细菌','bacterium'],['病毒','virus'],['真菌','fungus'],['突变','mutation'],['变异','variant'],['重组','recombination'],['克隆','clone'],['亚克隆','subclone'],['癌症','cancer'],['肿瘤','tumor'],['进化','evolution'],['演化','evolution'],['自然选择','natural selection'],['适应度','fitness'],['共同祖先','common ancestor'],['系统发育树','phylogenetic tree'],['生态位','niche'],['生态系统','ecosystem'],['种群','population'],['群落','community'],['稳态','homeostasis'],['激素','hormone'],['神经递质','neurotransmitter'],['动作电位','action potential'],['膜电位','membrane potential'],['感受器','sensory receptor'],['单细胞','single-cell'],['空间转录组','spatial transcriptomics'],['转录组','transcriptome'],['蛋白质组','proteome'],['代谢组','metabolome'],['宏基因组','metagenome'],['测序','sequencing'],['读段','read'],['建库','library preparation'],['比对','alignment'],['归一化','normalization'],['批次效应','batch effect'],['独立重复','independent replicate'],['技术重复','technical replicate'],['混杂因素','confounder'],['因果关系','causality'],['相关性','correlation']
  ];

  const rules = pairs
    .sort((a,b) => b[0].length - a[0].length)
    .map(([from,to]) => [new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to]);
  const cjk = /[\u3400-\u9fff]/;
  const spaceMixedScripts = value => value
    .replace(/([\u3400-\u9fff])([A-Za-z0-9])/g, '$1 $2')
    .replace(/([A-Za-z0-9])([\u3400-\u9fff])/g, '$1 $2');
  const replaceTerm = (text,pattern,to) => text.replace(pattern,(match,offset,whole) => {
    const left = offset > 0 && cjk.test(whole[offset - 1]) ? ' ' : '';
    const rightIndex = offset + match.length;
    const right = rightIndex < whole.length && cjk.test(whole[rightIndex]) ? ' ' : '';
    return `${left}${to}${right}`;
  });
  const englishize = value => spaceMixedScripts(rules.reduce((text,[pattern,to]) => replaceTerm(text,pattern,to), String(value)));
  // Static pages contain ordinary Chinese prose as well as biological labels.
  // Avoid replacing short words that are also everyday verbs (for example
  // “重新组织内容”); their unambiguous technical compounds remain in `pairs`.
  const ambiguousStandaloneTerms = new Set(['组织','遗传','重组','克隆']);
  const legacyRules = pairs
    .filter(([from]) => !ambiguousStandaloneTerms.has(from))
    .map(([from,to]) => [new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to]);
  const englishizeLegacy = value => spaceMixedScripts(legacyRules.reduce((text,[pattern,to]) => replaceTerm(text,pattern,to), String(value)));
  const courseTitles = {
    '00':'Biology Foundations', '01':'Genetics', '01B':'Molecular Genetics', '02':'Central Dogma & Gene Regulation',
    '03':'Cell Biology', '04':'Cancer Biology', '05':'Experimental Design & Omics', '06':'Databases & Statistics',
    '07':'Spatial & Regulatory Biology', '08':'Biological Data Structures', '09':'RNA-seq & Quantification',
    '10':'Evolutionary Biology', '11':'Microbiology & Diversity', '12':'Animal & Human Physiology', '13':'Cell Signaling & Interactions', '14':'Developmental Biology',
    '15':'Immunology', '16':'Neuroscience', '17':'Ecology', '18':'Metabolism & Metabolomics',
    '19':'Experimental Cell & Molecular Biology', '20':'Structural Biology & Biophysics',
    '21':'Infection, Virology & Pharmacology', '22':'Organismal Biology & Behavior'
  };

  const convert = value => {
    if (typeof value === 'string') return englishize(value);
    if (Array.isArray(value)) return value.map(convert);
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => { value[key] = convert(value[key]); });
    }
    return value;
  };

  (window.BIOCS_BOOK || []).forEach(course => {
    course.title = courseTitles[course.code] || englishize(course.title);
    course.description = englishize(course.description);
    course.chapters.forEach(chapter => {
      Object.keys(chapter).forEach(key => {
        if (key === 'terms') return;
        chapter[key] = convert(chapter[key]);
      });
      chapter.terms = (chapter.terms || []).map(item => {
        const raw = String(item[0]);
        const label = raw.includes(' / ') ? raw.split(' / ')[0].trim() : englishize(raw);
        return [label, englishize(item[1]), item[2]];
      });
    });
  });
  if (window.BIOCS_INTUITION) convert(window.BIOCS_INTUITION);
  if (window.BIOCS_DATA_LENS) convert(window.BIOCS_DATA_LENS);
  window.BIOCS_ENGLISHIZE = englishize;
  window.BIOCS_ENGLISHIZE_LEGACY = englishizeLegacy;
})();
