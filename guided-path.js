/* One prerequisite-consistent sequence through the 180-chapter reference library.
   This editorial learning path is not a claim about UIUC course credit. */
(() => {
  const units = [
    {
      id:'objects', title:'先看见生物对象', question:'一份生物数据究竟来自什么？',
      outcome:'能分清 molecule、cell、tissue 与样本尺度。',
      transfer:['在自己的数据里挑一行：它对应 molecule、cell、tissue、sample 还是 patient？','project-lab.html#transfer-object'],
      bridge:'知道对象是什么后，再问细胞里的遗传信息如何保存和读取。',
      core:['b01','b02','b03','b05','b04','c01'],
      explore:['h02','y01'], practice:['foundations-lab.html','用可操作模型巩固对象与尺度']
    },
    {
      id:'information', title:'DNA 如何变成 protein', question:'信息怎样被复制、读成 RNA，再做成 protein？',
      outcome:'能把 replication、transcription 与 translation 画成三种不同过程。',
      transfer:['把你项目里的一项结果放回 DNA、RNA 或 protein 层；其他层真的测了吗？','project-lab.html#transfer-measurement'],
      bridge:'有了主干流程，再解释为什么同一套 DNA 在不同细胞里会有不同输出。',
      core:['g01','g02','m01','m02','m03','m04','m05'],
      explore:['x03','z01'], practice:['foundations-lab.html','自己改变 DNA 序列，观察 RNA 与 protein 输出']
    },
    {
      id:'regulation', title:'信息何时被使用', question:'有 gene，为什么有些 cell 不表达它？',
      outcome:'能区分 chromatin、promoter、enhancer、TF 与 RNA processing 的作用。',
      transfer:['看到 expression 变化时，写出两种可能的调控解释，以及 assay 无法区分的部分。','project-lab.html#transfer-alternative'],
      bridge:'gene 表达不是细胞的全部；执行过程还要消耗原料和能量。',
      core:['m06','x01','x02','x05','x06','x08'],
      explore:['x07','x16','x19','x20'], practice:['genetics-lab.html#regulation','调节 enhancer 与 TF，检验多条件调控']
    },
    {
      id:'energy', title:'细胞如何运转', question:'有 gene 和 enzyme，反应为什么仍可能不发生？',
      outcome:'能区分 enzyme、energy、redox、metabolic flux 与 organelle 的不同角色。',
      transfer:['你的代谢结果是 metabolite abundance 还是 flux？数值的时间和分母是什么？','project-lab.html#transfer-value'],
      bridge:'当细胞能维持自己，就可以讨论它怎样响应环境、分裂和协作。',
      core:['a01','a02','a03','a05','c02','c03'],
      explore:['a04','a06','a07','a08','a09','a10'], practice:['textbook.html#a10','用 isotope tracing 追问物质真正流向哪里']
    },
    {
      id:'coordination', title:'细胞怎样协作', question:'同一条信号，为什么在不同 cell 中有不同结果？',
      outcome:'能把 receptor、signaling、cell cycle、cell fate 和 tissue context 放在同一张图上。',
      transfer:['你的结果是一个时间点的状态，还是一段 signaling trajectory？写出不能反推的过程。','project-lab.html#transfer-claim'],
      bridge:'细胞环境会影响一个 variant 的后果；接着把变化放回家系与群体。',
      core:['c04','c05','c06','h01','l01','l04','v01'],
      explore:['l02','l03','l05','v02','v03'], practice:['genetics-lab.html#dynamics','比较短 pulse、持续信号与 feedback']
    },
    {
      id:'inheritance', title:'变化怎样被继承', question:'一个 variant 怎样从 DNA 走到家系或群体？',
      outcome:'能计算基础遗传概率，并区分 allele、recombination、linkage 与群体变化。',
      transfer:['把一个 variant 放回 allele、genotype、cell 与 patient 四个尺度，别把它们当同一个分母。','project-lab.html#transfer-object'],
      bridge:'家系与群体有自己的分母；肿瘤样本还需要考虑 purity、copy number 和 clone。',
      core:['g03','g04','g05','g06','e01','e03','x09','x10'],
      explore:['x11','x12','x13','x17'], practice:['textbook.html#x09','跟着 worked example 更新家系中的条件概率']
    },
    {
      id:'somatic', title:'从 DNA 损伤到肿瘤 clone', question:'25% VAF 是否意味着 25% 癌细胞带 mutation？',
      outcome:'能追踪 repair、VAF 分母、copy number 与 clone 假设。',
      transfer:['若手里有 VAF，写出 ALT reads 的分母，并列出 purity、copy number 和 clone 的替代解释。','project-lab.html#transfer-value'],
      bridge:'这些变化发生在组织里，也会与免疫系统和治疗压力互相影响。',
      core:['x04','x14','x15','m07'],
      explore:['x18','x21','x22'], practice:['genetics-lab.html#vaf','亲手改变 purity、copy number 与 clone 比例']
    },
    {
      id:'disease', title:'从防御到疾病', question:'免疫系统怎样识别异常，而 tumor 怎样改变环境？',
      outcome:'能从 antigen presentation 走到免疫反应、tumor evolution 与 microenvironment。',
      transfer:['一个 immune marker 升高时，写出它与 immune function 之间还缺哪项证据。','project-lab.html#transfer-alternative'],
      bridge:'机制故事必须有实验检验；下一单元学习仪器实际测到了什么。',
      core:['t01','t02','t03','t04','i01','i03','i04','i05'],
      explore:['i02','i06','i07','i10','j01','j03','j08'], practice:['project-lab.html#integration','用一个案例检查 tumor–immune–metabolism 假说']
    },
    {
      id:'measurement', title:'实验先产生信号', question:'怎样从材料走到一个可信的实验读数？',
      outcome:'能辨认独立样本、RNA library、sequencing read、measurement 与 control。',
      transfer:['为自己的文件写出 case → sample → aliquot → assay → read 的来源链。','project-lab.html#transfer-object'],
      bridge:'控制和测量清楚后，再学习常用的分子与细胞实验。',
      core:['d01','q01','q02','w01','w02','w03'],
      explore:['w10','z06'], practice:['data-lab.html#sbs','动手看 sequencing 循环和原始信号']
    },
    {
      id:'assays', title:'实验怎样检验机制', question:'PCR、Western blot、显微图分别能证明什么？',
      outcome:'能为一个假说选择 assay、control 与扰动，并说出推断边界。',
      transfer:['说明你选的 assay 直接看到什么，以及需要哪种 control 才敢比较。','project-lab.html#transfer-measurement'],
      bridge:'实验信号经处理才成为数据文件；下一单元沿处理链读懂它们。',
      core:['w04','w05','w06','w07','w09'],
      explore:['w08','d05','d06'], practice:['data-lab.html','用交互题练习从观察到结论']
    },
    {
      id:'raw-data', title:'从样本走到数据表', question:'一条 read、一个 gene count 或 VCF row 是怎样来的？',
      outcome:'能沿 sample → raw signal → processed value 解释数值来源。',
      transfer:['从手里的矩阵挑一个数，向上追溯原始 signal、处理步骤、单位和分母。','project-lab.html#transfer-value'],
      bridge:'有了文件和单位，才能比较样本、设计模型并判断统计结论。',
      core:['d02','q03','q04','d03','d04'],
      explore:['q06','d07','k03','k05'], practice:['real-data-walkthrough.html','打开可追溯的真实文件']
    },
    {
      id:'analysis', title:'从表格走到证据', question:'一个 count 差异或 p 值能支持多强的主张？',
      outcome:'能整理 case/sample ID、做基本 normalization 并分开 effect 与 confounder。',
      transfer:['写出比较组、真正独立的 replicate、方法为何匹配这种数据，以及 batch 等混杂。','project-lab.html#transfer-method'],
      bridge:'最后把多种 assay 放到同一案例，练习写出有限且可检验的结论。',
      core:['r01','k01','r02','k02','r03','k04','q05'],
      explore:['q07','q08','k06','s01','s02','s03'], practice:['real-cohort-lab.html','从公开 cohort 的文件库存走到病例级连接']
    },
    {
      id:'project', title:'独立解释一个项目', question:'多组学结果何时能连成机制，何时只能说相关？',
      outcome:'能固定 case/sample、比较替代解释，并写出证据允许的结论。',
      transfer:['完成自己的项目证据链：一句有限结论、一个替代解释和下一项最有区分力的实验。','project-lab.html#your-project'],
      bridge:'主线到这里结束；按自己的项目问题继续深入 Genetics、Metabolism、Immunology 或空间数据。',
      core:['r04','r05','r06'],
      explore:['s08','q09','a09','i10'], practice:['project-lab.html','完成贯穿 DNA、RNA、protein、tissue 与 outcome 的案例']
    }
  ];
  const ids = units.flatMap(unit => unit.core);
  const unitByChapter = Object.fromEntries(units.flatMap((unit, unitIndex) => unit.core.map((id, index) => [id, {unit, unitIndex, index}])));
  window.BIOCS_GUIDED_PATH = {units, ids, unitByChapter};
})();
