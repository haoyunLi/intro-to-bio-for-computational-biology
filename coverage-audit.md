# 从头复查：零基础计算生物学网站还能补什么

复查日期：2026-09-21。当前网站有 10 门课、69 章、335 个教学小节、143 个教材来源条目，共 8 个 HTML 页面。本轮逐章复查全部教材、12 课复习和独立交互练习，把“能否读懂数据”作为优先验收标准；现有 16 个原创机制动效、79 个步骤。网站是逐步扩展的教学项目；目前的部分课程仍是系统导论的深度，尚不能等同于几门完整本科教材。

## 本轮全站复核与修正

| 范围 | 已修改内容 |
| --- | --- |
| 基础材料与遗传 | 补 mol/μM、最终体积、组织细胞与基质；区分 bulk、single-cell/nucleus、Visium、Xenium 的观察单位；解释 cDNA read、GWAS；区分重组改变多位点组合与单个位点 allele frequency。 |
| 分子与细胞 | 逐步追踪复制与 0 reads、负链 GTF、junction 计数、移码、ATAC、跨组学 join、膜运输、ER→Golgi、通量、磷酸化时间轴、2C/4C 与肽–MHC–TCR；新增两张原创图和可展开判断题。 |
| 肿瘤与统计 | 将右删失限定为有已知的最后观察时间；缺少死亡和随访时间不能自动当删失。解释患者级独立重复、多重检验期望，以及代谢组相对峰强度。 |
| 空间与文件 | 按官方文档更新 Visium HD 分尺度目录与 Xenium Q20、细胞分配及 RNA/蛋白 feature 类型；panel 未测不填 0。 |
| 测序与定量 | 明确 raw count 经过比对与分配；区分 GDC gene length 与 transcript effective length、read 与 fragment；CPM 总和约束取决于分母；TPM 使用流程定义的完整 feature 集合；说明 DESeq2 几何均值为零的处理。 |
| 旧页面一致性 | 将坐标演示改成无真实 build 的 `toy_chr`，避免虚构的 A→G 被当成真实人类变异；标清三基因 toy 表的分母；修正细胞混合模型的零值解释与确定性 tile 拆分。 |
| 教材操作 | 搜索支持章节编号；跳到正文保留当前章节及 URL；手机目录打开时聚焦搜索、限制焦点在目录内，Escape 关闭并返回按钮；长代码允许换行。 |
| 练习操作 | 读段与缺失值题目标题不提前透露答案；单文件答对后立即解锁步骤导航；两个真实数据练习可重练；队列正确答案锁定，防止修改后仍显示已通过；尊重减少动态效果设置。 |
| 机制动效 | `motion-lab.html` 的播放器现有生物机制 8 场景 42 步、数据机制 8 场景 37 步。细胞分割扩成 nucleus-only、适度扩张、过度扩张、配准偏移、错误分配和矩阵传播；cohort join 扩成 case→clinical 连接与连接后表粒度。37 章有详细机制场景，全部 69 章有三步数据阅读导览；播放器支持播放/暂停、前后帧、进度拖动、倍速、减少动态效果设置、离屏暂停及移动端横向图容器。 |
| 空间分割误差 | Data Lab 第 9 题固定教学 true cell 与 transcript 位置，只改变观测边界；即时重算正确分配、错分、漏分、假阳性和 cell × gene 矩阵。四种模式明确把分割误差传播到下游计数。 |
| 完整队列与临床连接 | 真实队列页新增完整库存、临床连接和分析管线三个工作台。库存记录 1,231 file→1,226 sample→1,095 case→113 paired case；连接练习并列 `case_id`、`sample_id`、`file_id`，使错误键得到 0 行；八步管线展示每一步的输出物和检查点。 |

### 验证范围

- 全站 8 个 HTML 页面及 69 章内容的本地文件、315 个本地资源/锚点、图片 alt、重复 ID 和前置知识依赖图检查通过；所有教材引用键有效。
- 八个页面均在 1,280 px 桌面和 390 px 手机断点巡检：没有整页横向溢出、缺图或 console error/warning；宽表和示意图只在自己的容器内横向滚动。临床双表曾有 50 px 内部溢出，加入 grid 子项收缩规则后复查归零。
- 实际完成 Foundations 的序列输入/提前终止、细胞比例与 TPM 切换，Data Lab 九个练习、真实单文件五步、队列六步和完整队列工作台；检查错误反馈、步骤解锁、重置、临床 join 键切换与空间分割模式切换。
- 新膜运输与分泌通路 SVG 已渲染目检，并在手机端确认图像载入、横向滚动及判断题展开。归一化例题数值用脚本重算，读段/缺失值状态机检查通过。
- 检查 191 个不同外部 URL：180 个 HEAD 请求返回成功；3 个不支持 HEAD 的链接经 GET 确认为 200；未发现 404/410。另 8 个因网站限流或访问限制，不能仅用自动状态码确认（7 个 10x 链接、1 个 MIQE 论文链接）；相关内容依据官方浏览页面核对，自动访问受限不等于链接失效。
- 动效页现有 16 个场景、79 个步骤；静态验证确认每个场景、步骤与章节映射有效。新增场景和工作台另检查自动播放结束、暂停、重置、离屏暂停、减少动态效果设置和手机端容器布局。

这些是代码与代理模拟学习任务的检查结果，尚未做真人零基础学习者的理解度研究。

## 本轮已补进教材

| 位置 | 增补 | 为什么需要 |
| --- | --- | --- |
| B01 | 生物对象 → 仪器信号 → 算法对象 | 不把 gene count、像素或删失变量误当成直接观察到的生物事实。 |
| B03 | DNA/RNA 的糖、碱基、链结构及功能对照 | 在讲转录、RNA 文库和测序前先认识材料本身。 |
| B04 | 数量、浓度、酶活性、代谢通量 | 避免由 RNA 表达直接推断蛋白活性或反应速度。 |
| B05 | nm、μm、mm 与放大/分辨率；原创尺度图 | 为显微图、空间 bin、细胞分割建立真实尺寸感。 |
| G01 | 用非回文 DNA 演示反向互补；bp 与 nt | 纠正初学者常见的方向和长度单位混淆。 |
| G02 | promoter、TSS、UTR、exon、intron、CDS 原创结构图 | 区分 DNA 基因座、转录本与蛋白编码区。 |
| G02 | genomic span、spliced RNA、CDS 三种长度 | 给后面的 TPM/FPKM 长度校正建立前提。 |
| G03 | 同源染色体、姐妹染色单体、DNA 含量和倍性 | 为肿瘤 CNV/VAF 的解释打基础。 |
| M02 | mRNA、rRNA、tRNA、调控性 RNA 对照 | 解释为什么不同 RNA-seq 文库会测到不同类别。 |
| M03 | TSS 与翻译起始 AUG 的区别 | 避免把 UTR 误读为不属于转录本。 |
| B02 | 共价键与可逆结合、摩尔浓度和稀释手算 | 让 DNA-蛋白、抗体-抗原、药物-靶点的“结合”具有物理意义。 |
| B03 | 氨基酸侧链、肽键、蛋白结构四层、定位与翻译后修饰；原创结构图 | 不把氨基酸序列、蛋白丰度、蛋白活性当作同一个变量。 |
| B04 | E+S⇌ES→E+P、底物饱和、Km/Vmax 手算、Kd 的区别；原创酶示意图 | 为靶向药物、信号通路和代谢通量建立实验直觉。 |
| M01 | 复制叉五步、姐妹染色单体与 DNA 含量、复制错误与测序错误 | 把生物变异和技术伪影分开。 |
| M05 | 核糖体与 tRNA 的具体工作、同义/错义/移码的初步解释 | 从 codon 真正走到多肽，而不只背 Central Dogma 箭头。 |
| C05 | G1/S/G2/M 的 2n 与 2C/4C 原创图、有丝分裂、增殖与净细胞数账本 | 解释肿瘤 CNV、流式 DNA 含量和增殖标记时避免混淆。 |
| D01 | 阴性/阳性/无模板对照、3×3 重复与患者级 n、观察性与干预性证据 | 学会判断一项实验排除了哪种替代解释。 |
| D02 | PCR 三步、RT-qPCR、Cq/Ct 的条件性解释、NTC 与 no-RT | 在 RNA-seq 前认识常用的目标验证及其假信号。 |
| G03 | Punnett 方格、外显率、X 连锁和线粒体遗传 | 分开“继承某 allele 的概率”与“出现疾病表型的概率”。 |
| G04 | haplotype/phasing 的 cis–trans 对照、20% 重组率手算 | 说明基因型两列为何不足以确定两个变异是否在同一条染色体。 |
| G05 | VAF 的 read 定义、50% 肿瘤纯度下的 0.25 手算 | 避免把 ALT read 比例误称为携带变异的细胞比例。 |
| G06 | Hardy–Weinberg 的 p²/2pq/q² 基线、群体频率与肿瘤 VAF 对照 | 给从人群遗传到肿瘤测序建立清晰的分母。 |
| B01–B05、G01–G06 | 11 个“先猜再展开”的小表与判断题 | 让读者亲自判断表格行数、患者级 n、VCF 字段和频率分母。 |
| 全部 69 章 | “实验信号 / 文件与单位 / 推断边界”卡片 | 每学一个生物概念，都能说出相应数据从何而来及哪些结论不能直接推出。 |
| 独立互动页 | DNA→RNA→蛋白、bulk 细胞比例、raw/CPM/TPM 三个可调模型 | 手动改变输入，观察生物对象与数据数值之间的关系。 |
| 真实数据页 | 固定公开 TCGA-BRCA STAR Counts 文件，五步读字段与结论 | 把虚构练习迁移到可追溯的公开 GDC ID、真实 count、零值和元数据。 |
| 真实队列页 | 完整公开库存、2 位病例临床表、4 份已核验文件和八步分析管线 | 先用完整 API 聚合数定义候选 cohort，再练习 case 级临床连接，最后用可逐行核验的配对子集理解 raw/TPM；把“队列规模”和“页面展示行数”分开。 |
| Data Lab 第 6 题 | 逐条判读三条虚构 FASTQ read 的 base quality、唯一/多重映射、gene count | 让读者看见 gene count 来自质控、参考比对和注释规则，而不是测序仪直接给出的数字。 |
| Data Lab 第 8 题 | 逐条判读已测零值、Xenium panel 未测、QC 失败与状态未知 | 避免把所有空格填成 0，也避免把失效文件当作阴性实验。 |
| Data Lab 第 9 题 | 固定 transcript 位置，切换 nucleus-only、5 µm-style、过度扩张和配准偏移边界 | 直接观察分割如何产生漏分、错分和假阳性，并改变 cell × gene 矩阵。 |
| B01 → D01 → K01 | 让虚构患者 P01、组织 T01 和三份 assay 文件贯穿三章 | 逐步看见“3 行文件、1 份材料、1 位患者”，并判断 join 后为何仍只有 1 位独立患者。 |
| G02 → M02 | 提前用 gene X 把 DNA、RNA、蛋白、细胞与对应 assay 放在一张表 | 先建立读数据的全貌，再按需要学习孟德尔概率、转录和翻译细节。 |

以上示意与术语使用了 [OpenStax 核酸章节](https://openstax.org/books/biology-2e/pages/3-5-nucleic-acids)、[蛋白章节](https://openstax.org/books/biology-2e/pages/3-4-proteins)、[酶章节](https://openstax.org/books/biology-2e/pages/6-5-enzymes)、[孟德尔性状章节](https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits)、[群体进化章节](https://openstax.org/books/biology-2e/pages/19-1-population-evolution)、[细胞周期章节](https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle)、[PCR 章节](https://openstax.org/books/biology-2e/pages/17-1-biotechnology)、[NCBI 酶测定指导](https://www.ncbi.nlm.nih.gov/books/NBK92007/)、[MIQE 2.0 指南](https://academic.oup.com/clinchem/article/71/6/634/8119148)、[肿瘤 VAF 原始研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC9373375/)及 [NHGRI 单倍型说明](https://www.genome.gov/genetics-glossary/haplotype)核对；每个新小节在教材中也有就近来源链接。

## 下一轮最值得补的内容

这些是目前的**课程深度缺口**，按对 CS 背景肿瘤多组学读者的实用程度排列。

1. **遗传学进阶练习。** 已有 Punnett、外显率、X 连锁、单倍型、Hardy–Weinberg 和纯度影响 VAF 的基础例题；仍需完整 pedigree 判读、亲属间条件概率、等位基因特异 CNV、非整倍体及多区域肿瘤克隆频率的联合练习。可从 [OpenStax 遗传章节](https://openstax.org/books/biology-2e/pages/12-introduction)和 [NCI 癌症遗传说明](https://www.cancer.gov/about-cancer/causes-prevention/genetics)继续。
2. **细胞结构与时间过程。** 已补细胞周期、DNA 含量、膜运输、ER–Golgi 分泌路线与数据判断；细胞死亡途径、免疫细胞分化和时间序列实验仍可扩成更完整的图解练习。参照 [OpenStax 细胞章节](https://openstax.org/books/biology-2e/pages/4-introduction)。
3. **实验方法的实操判读。** 已补 PCR/qPCR 和对照逻辑；还需抗体免疫染色、Western blot、流式、CRISPR 干预、救援实验以及各方法的假阳性来源。参照 [OpenStax 生物技术章节](https://openstax.org/books/biology-2e/pages/17-introduction)。
4. **从教学队列走向可复现统计。** 现在已有完整 GDC 文件库存漏斗、case 级临床连接、固定配对子集和八步分析管线。下一步需要下载完整 count 矩阵，系统处理临床缺失、样本 QC、批次、协变量、差异表达设计与敏感性分析，并发布可复现脚本。数据版本和流程应固定并引用 [GDC mRNA 管线](https://docs.gdc.cancer.gov/Data/Bioinformatics_Pipelines/Expression_mRNA_Pipeline/)与 [GEO 数据说明](https://www.ncbi.nlm.nih.gov/geo/info/overview.html)。
5. **影像与空间数据的物理测量。** 现有分割练习已说明边界误差如何传播到 cell × gene 矩阵；下一步可加入真实切片、染色误差、像素到微米校准、配准评估、邻域统计以及病例级独立重复。
6. **计算推断与统计基础。** 为初学者增加概率模型、测量误差、multiple testing、effect size、批次混杂、训练/验证/测试划分，以及“模型预测”和“生物机制解释”之间的边界；用同一份小数据贯穿这些步骤。

## 以“理解数据”为标准的后续验收

网站已能让读者在站内完成单文件层的观测对象、行列、count、零值、来源与推断边界判断，也能从完整文件库存走到 case 级临床连接和两病例真实配对子集。尚未经过真人零基础可用性测试；也尚未下载**规模足够且有完整临床信息的真实 cohort** 并从 count 矩阵做到正式统计结果。下一轮优先让读者独立完成这些任务：

1. 给一份陌生 GDC metadata，数出不同的 case、sample、file，并指出分析的独立单位。
2. 给一个陌生 STAR Counts 文件，指出 `N_` 汇总行、gene ID、raw count、TPM 和零/空白的区别，并写出每个数的生成过程。
3. 对同一批公开病例做纳排、manifest 与临床 join，报告每一步保留的独立病例数；判断哪一列能进 count 模型，哪一列只适合描述表达。
4. 给出一个有限结论，同时列出组成、深度、批次、纯度和缺失等替代解释。

建议下一阶段按 **完整 count 矩阵与统计设计 → 细胞机制与实验判读 → 真实空间切片误差 → 多组学整合** 扩写；每一阶段都配原始文件、结构图、手算例题和能暴露常见误解的检查题。
