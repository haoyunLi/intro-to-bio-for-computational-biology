# Bio/CS 逐章审阅记录

本轮清单：180 章。已逐章阅读并判断：13；结论/修改验证完成：13；尚待阅读：167。

状态只依据实际阅读正文、公式/例子、图表/实验和练习后手工写入的结论。自动清单导出、渲染检查或通用修复不代表章节已审阅。未改章节也记录保留理由；章节原有来源不等于本轮已逐条访问核验。

中文解释、English terminology；优先补推理缺口与可检验例子，保留已有有效内容。图示采用原创教学数据，区分观测、假设与因果主张。

## 00 · Biology Foundations

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [b01 · 生命科学到底在研究什么？](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#b01) | 已修改并验证 | 测量链、patient/sample/tile独立单位和反事实解释已充分；全局术语替换损坏普通中文表达，需共享修复，概念本身不需补更多段落。 | 保留科学内容；让中文解释不再做无上下文全局替换，English术语表保持。 | 待实际渲染与术语回归；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | — |
| [b02 · 原子、化学键、水与 pH](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#b02) | 已修改并验证 | 已有pH十倍尺度、1与2μM稀释计算及1020μL例外，浓度/暴露边界清楚；需修复共享术语替换。 | 保留已有化学与计算例子，应用共享语言修复。 | 浓度100×10/1000=1、100×20/1020≈1.96手算核对；待渲染；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | — |
| [b03 · 四类生物大分子](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#b03) | 已修改并验证 | DNA/RNA、肽链方向、蛋白四级结构与测量证据阶梯完整；替换器把激酶拆成激enzyme、蛋白组学拆成proteome学，并破坏一般动词。 | 保留现有原创结构图和正文，修复无上下文术语替换。 | 待蛋白/激酶/转译普通语义回归及图表检查；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | — |
| [b04 · 酶、能量与代谢](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#b04) | 已修改并验证 | Michaelis–Menten50/75、Km≠Kd和RNA≠通量已正确；顶部substrate→enzyme→product线性流程可能让初学者误以为酶被转换为产物。 | 改为E+S→ES→E+P→再次催化；共享术语修复保留普通中文组织/翻译/再生成。 | 待流程图与数值核对；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | [1](https://openstax.org/books/biology-2e/pages/6-5-enzymes) |
| [b05 · 细胞、组织与生物尺度](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#b05) | 已修改并验证 | bulk混合19/55、患者嵌套单位、尺度与分辨率已清楚；人体细胞有细胞核的概括缺成熟红细胞例外，且复制品被替换为replication品。 | 补成熟红细胞无细胞核/线粒体例外；保留混合例子并修复共享语言。 | 混合平均19和55已核对；待图示/浏览器验证；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | [1](https://openstax.org/books/biology-2e/pages/40-2-components-of-the-blood) |

## 01 · Genetics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [g01 · DNA：四个字母与双链方向](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g01) | 已审阅 · 无实质补充需要 | 双链方向与反向互补逐位手算正确；bp/nt对象区别、VCF参考版本和复制动画假设明确。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | ATCG→CGAT、AAG→CTT已手算；复制5步含一旧一新及方向标记逐步核对。 | — |
| [g02 · Genome、chromosome、gene 与 allele](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g02) | 已审阅 · 无实质补充需要 | 层级、非编码基因、TSS/start/stop、UTR/CDS与genomic span区别完整；RNA/蛋白证据阶梯已有具体数据例，无需重复补段。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | 100–109/200–209分别10nt，exon20与span110正确；gene-anatomy及剪接/增强子全部步骤与标签已读。 | — |
| [g03 · 二倍体、基因型与孟德尔模型](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g03) | 已审阅 · 无实质补充需要 | Aa×Aa的基因型概率、显性/外显率、姐妹染色单体与同源染色体、GT/AD/DP层级已具体拆开。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | 1:2:1与1/4手算；0/1:12,10:22及读段不等于染色体说明正确。 | — |
| [g04 · 减数分裂、重组与连锁](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g04) | 已审阅 · 无实质补充需要 | 重组率20%给出40/40/10/10，cis/trans双图解释两个未定相0/1的歧义；连锁与功能证据边界清楚。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | 四配子概率和为1、重组合计0.2；haplotype-phase.svg的两组连线/allele安排核对。 | — |
| [g05 · 变异、拷贝数与突变来源](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g05) | 已审阅 · 无实质补充需要 | VAF与携带细胞比例分母区别有40reads及50%纯度例；相同0.25的两情境已解释不可唯一反推。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | 10/40=0.25与50ALT/200copies=0.25手算；driver/passenger和CNV/亚克隆条件已读。 | — |
| [g06 · 群体遗传、进化与风险](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#g06) | 已审阅 · 无实质补充需要 | 人群AF、携带者比例、肿瘤VAF分别定义；重组不改单个位点频率与HWE零模型准确。 | 保留现有机制、具体算例与练习；共享语言修复已应用 | 0.64+0.32+0.04=1；10AA/20Aa/70aa给AF0.2、carrier0.3，检查题不把关联当因果。 | — |

## 01B · Molecular Genetics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [x01 · 染色质、核小体与 DNA 超螺旋](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x02 · DNA replication：复制叉的分工](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x03 · Telomere 与 chromosome end problem](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x04 · DNA damage、mutation 与 repair pathway](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x05 · Transcription：细菌与真核的共同逻辑和关键差异](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x06 · Promoter、enhancer 与 transcription factor](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x07 · Chromatin remodeling、histone mark 与 DNA methylation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x08 · RNA processing、alternative splicing 与 regulatory RNA](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x09 · Mendelian probability、pedigree 与 Bayes](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x09) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x10 · Linkage、recombination、LD 与 phasing](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x10) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x11 · Penetrance、expressivity、epistasis 与 pleiotropy](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x11) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x12 · Quantitative trait、heritability 与 polygenic model](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x12) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x13 · Population structure、GWAS 与 fine-mapping](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x13) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x14 · Somatic genetics：VAF、purity、CNV 与 clone](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x14) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x15 · Transposable element、gene duplication 与 genome evolution](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x15) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x16 · Functional genetics：CRISPR、screen、rescue 与因果证据](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x16) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x17 · Mosaicism、imprinting、X-inactivation 与 heteroplasmy](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x17) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x18 · Structural variation、aneuploidy 与 whole-genome doubling](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x18) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x19 · Allele-specific expression 与 cis/trans regulation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x19) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x20 · eQTL、sQTL、colocalization 与 causal gene](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x20) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x21 · HLA variation、antigen presentation 与 immunogenetics](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x21) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [x22 · Multi-region tumor phylogeny 与 resistance evolution](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#x22) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 02 · Central Dogma & Gene Regulation

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [m01 · DNA 复制、校对与修复](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m02 · Central Dogma：信息如何流动](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m03 · 转录：从 DNA 写出 RNA](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m04 · RNA 加工、剪接与转录本](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m05 · 密码子、翻译与蛋白结构](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m06 · 基因调控与表观遗传](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [m07 · 从变异到表型：证据链](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#m07) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 03 · Cell Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [c01 · 细胞膜与物质运输](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [c02 · 细胞器与蛋白定位](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [c03 · 线粒体、呼吸与能量预算](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [c04 · 细胞信号：从受体到反应](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [c05 · 细胞周期、检查点与死亡](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [c06 · 组织、免疫系统与细胞通讯](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#c06) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 04 · Cancer Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [t01 · 癌症从哪里来？](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#t01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [t02 · 肿瘤异质性与克隆演化](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#t02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [t03 · 肿瘤微环境、免疫与治疗](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#t03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [t04 · 病理、分期、治疗与结局](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#t04) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 05 · Experimental Design & Omics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [d01 · 实验设计：样本、重复与批次](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d02 · 测序：从组织到 FASTQ 与比对](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d03 · DNA 组学：VCF、CNV 与突变调用](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d04 · RNA-seq：count、归一化与差异表达](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d05 · 表观组学：甲基化、ATAC 与结合](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d06 · 蛋白质组与代谢组](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d07 · 单细胞与空间组学](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [d08 · 生物影像：从显微镜到 CT/MRI](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#d08) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 06 · Databases & Statistics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [r01 · TCGA、GDC、GEO 等资源地图](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [r02 · ID、矩阵与跨组学 join](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [r03 · 统计推断：效应、混杂与多重检验](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [r04 · 生存分析与临床预测](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [r05 · 多组学整合：从相关到机制](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [r06 · 第一次完整做 TCGA 研究](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#r06) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 07 · Spatial & Regulatory Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [s01 · Spatial biology：测量单位](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s02 · Visium HD：空间条形码与 binning](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s03 · Xenium：原位 RNA 成像](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s04 · CODEX：多重空间蛋白成像](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s05 · 其他空间平台与选型](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s06 · Enhancer：远端调控怎样影响基因](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s07 · Splicing：从 exon 组合到 RNA 事件](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [s08 · 把空间、enhancer 与 splicing 接回肿瘤研究](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#s08) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 08 · Biological Data Structures

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [k01 · 一份生物数据是怎么来的](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k02 · ID、主键与跨表连接](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k03 · 基因组坐标、build 与基因 ID](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k04 · RNA 矩阵：count、CPM、TPM 与变换](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k05 · 变异表：VCF、MAF、CNV 怎么读](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k06 · QC、批次、缺失值与异常样本](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k07 · 单细胞对象：AnnData 与伪重复](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k08 · 空间与影像数据：像素、坐标和分割](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k09 · 临床表：时间、结局和随访](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k09) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [k10 · 从数据到模型：拆分、验证与复现](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#k10) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 09 · RNA-seq & Quantification

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [q01 · 从组织里的 RNA 到测序文库](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q02 · 测序仪怎样逐个碱基读出序列](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q03 · FASTQ：序列和质量值怎么读](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q04 · 从 FASTQ 到 gene count：比对与定量](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q05 · Raw count 与 CPM：先校正测序深度](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q06 · RPKM、FPKM、TPM：为什么还要除以长度](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q07 · DESeq2 size factor 与 edgeR TMM：处理组成偏差](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q08 · log、VST、z-score 与批次：不要叫成同一种 normalization](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [q09 · 把测序与归一化接到 TCGA 实际研究](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#q09) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 10 · Evolutionary Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [e01 · 共同祖先与演化证据](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#e01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [e02 · 怎样读一棵系统发育树](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#e02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [e03 · 群体怎样随世代改变](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#e03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [e04 · 适应度、自然选择与权衡](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#e04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [e05 · 物种形成与宏演化](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#e05) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 11 · Microbiology & Diversity

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [u01 · Bacteria、Archaea 与真核细胞](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#u01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [u02 · Virus：寄生于细胞的信息包](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#u02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [u03 · 微生物代谢与生长](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#u03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [u04 · Microbiome：群落而不是物种名单](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#u04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [u05 · 抗菌药、耐药与水平基因转移](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#u05) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 12 · Animal & Human Physiology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [h01 · Homeostasis：活系统如何稳住内部环境](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h02 · 上皮、屏障与体液区室](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h03 · 循环与呼吸：把气体送到组织](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h04 · 肾脏：过滤、选择性回收与排出](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h05 · 内分泌：慢一些、远一些的协调信号](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h06 · 消化、吸收与全身代谢](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [h07 · 动物生殖与生命周期](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#h07) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 13 · Cell Signaling & Interactions

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [l01 · Ligand–receptor：先分清“结合”与“响应”](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [l02 · GPCR 与 second messenger](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [l03 · RTK、RAS–MAPK 与 PI3K–AKT](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [l04 · JAK–STAT、TGF-β、Wnt 与 Notch](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [l05 · Feedback、crosstalk 与 signaling dynamics](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [l06 · 从 scRNA/spatial 推断 cell–cell communication](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#l06) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 14 · Developmental Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [v01 · Cell fate：同一 genome 为什么长成不同细胞](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#v01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [v02 · Morphogen 与 positional information](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#v02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [v03 · Morphogenesis：形状从细胞行为中涌现](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#v03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [v04 · Stem cell、niche 与 tissue renewal](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#v04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [v05 · Development、regeneration 与 cancer 的共同逻辑](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#v05) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 15 · Immunology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [i01 · 屏障、innate sensing 与 inflammation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i02 · Complement、phagocytosis 与先天效应](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i03 · Antigen processing、MHC 与 T-cell recognition](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i04 · B cell、antibody 与 clonal selection](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i05 · Tolerance、memory、vaccine 与 tumor immunity](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i06 · Receptor diversity 与 lymphocyte development](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i07 · T-cell activation、effector function 与 migration](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i08 · Infection、vaccines 与 commensal microbes](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i09 · Allergy、chronic inflammation 与 autoimmunity](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i09) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [i10 · Cancer immunology 与 immunotherapy evidence chain](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#i10) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 16 · Neuroscience

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [n01 · Membrane potential 与 action potential](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#n01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [n02 · Synapse、neurotransmitter 与 integration](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#n02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [n03 · Neural circuit：从反射到分布式计算](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#n03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [n04 · 感觉、运动与 perception](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#n04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [n05 · Plasticity、learning、memory 与 behavior](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#n05) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 17 · Ecology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [o01 · Ecological scale、niche 与 distribution](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#o01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [o02 · Population growth 与 life history](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#o02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [o03 · Species interaction 与 food web](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#o03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [o04 · Energy flow 与 biogeochemical cycle](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#o04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [o05 · Biodiversity、disturbance 与 conservation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#o05) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 18 · Metabolism & Metabolomics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [a01 · Bioenergetics：为什么反应会向前走](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a02 · Redox、electron carrier 与 metabolic flux](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a03 · Glycolysis、fermentation 与 gluconeogenesis](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a04 · Pentose phosphate pathway、NADPH 与 biosynthesis](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a05 · TCA cycle 与 oxidative phosphorylation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a06 · Lipid metabolism：storage、β-oxidation 与 synthesis](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a07 · Amino acid、nitrogen 与 nucleotide metabolism](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a08 · Metabolic integration：fed、fasted 与 diabetes](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a09 · Cancer & immune metabolism](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a09) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [a10 · Metabolomics 与 isotope tracing](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#a10) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 19 · Experimental Cell & Molecular Biology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [w01 · Measurement：从体积、浓度到 uncertainty](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w02 · Buffers、pH 与 experimental controls](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w03 · DNA cloning、PCR 与 sequence validation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w04 · RNA extraction 与 RT–qPCR](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w05 · Protein quantification、SDS–PAGE 与 Western blot](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w06 · Microscopy、fluorescence 与 image quantification](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w07 · Cell culture、aseptic technique 与 transfection](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w07) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w08 · Flow cytometry：single-cell signal、gating 与 compensation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w08) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w09 · Perturbation、dose–response 与 causal validation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w09) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [w10 · Reproducibility、lab notebook 与 scientific communication](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#w10) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 20 · Structural Biology & Biophysics

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [z01 · Protein structure：sequence 怎样约束三维形状](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z02 · Folding、disorder 与 protein quality control](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z03 · Thermodynamics of binding：affinity、occupancy 与 competition](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z04 · Kinetics、enzyme catalysis 与 allostery](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z05 · Membrane biophysics：diffusion、osmosis 与 electrochemical gradient](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z06 · Structural methods：X-ray、cryo-EM、NMR 与 spectroscopy](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z06) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [z07 · AlphaFold 与 computational structure：confidence 不是 validation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#z07) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 21 · Infection, Virology & Pharmacology

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [j01 · Host–pathogen interaction：colonization 不等于 disease](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [j02 · Bacterial pathogenesis：adhesion、secretion、toxin 与 intracellular survival](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [j03 · Viral genome 与 replication strategy](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [j04 · Viral entry、tropism、assembly、release 与 latency](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [j05 · Phage、horizontal gene transfer 与 CRISPR](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [j06 · Antimicrobial 与 antiviral：mechanism 和 resistance](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j06) | 已修改并验证 | 药物靶点、MIC/MBC、组合治疗与设计例子完整；把 tolerant state 列为 resistance 机制，随后又说两者不同。 | 区分 MIC升高、群体慢杀灭和少数群体两阶段存活；避免把全部tolerance概括为不遗传，补共识来源。 | 正文、worked/check/terms/dataLens已读；Bio四项脚本通过，待浏览器；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | [1](https://pmc.ncbi.nlm.nih.gov/articles/PMC7136161/) |
| [j07 · Infectious-disease evolution、spillover 与 biosecurity](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j07) | 已修改并验证 | worked例子已分跨宿主与持续传播两道门槛，但mechanism把onward transmission写成spillover前提；R₀假设和毒力非必然下降准确。 | 将spillover感染和后续人际传播明确分开，补原始机制综述来源。 | 正文、worked/check/terms/dataLens已读；Bio四项脚本通过，待浏览器；本批构建/内容回归通过；1440/375px浏览器HTTP200、无横向溢出、无脚本错误或失败请求。 | [1](https://www.nature.com/articles/nrmicro.2017.45) |
| [j08 · Pharmacology：dose、exposure、target 与 therapeutic window](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#j08) | 待审阅 | 尚未逐章审阅 | — | — | — |

## 22 · Organismal Biology & Behavior

| 章节 | 实际状态 | 具体发现 / 保留理由 | 计划或已做修改 | 验证 | 本轮核验来源 |
| --- | --- | --- | --- | --- | --- |
| [y01 · Comparative anatomy：body plan、homology 与 functional constraint](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y01) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [y02 · Biomechanics、scaling 与 locomotion](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y02) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [y03 · Animal behavior：proximate 与 ultimate explanation](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y03) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [y04 · Behavioral ecology：decision、trade-off 与 strategy](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y04) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [y05 · Communication、sensory ecology、navigation 与 learning](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y05) | 待审阅 | 尚未逐章审阅 | — | — | — |
| [y06 · Organism–environment integration：acclimation、adaptation 与 life history](https://haoyunli.github.io/intro-to-bio-for-computational-biology/textbook.html#y06) | 待审阅 | 尚未逐章审阅 | — | — | — |
