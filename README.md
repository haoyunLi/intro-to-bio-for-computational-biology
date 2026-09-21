# Bio/CS · 从代码到细胞

一个面向**没有系统生物学背景**的计算研究者的中英混合学习网站。核心目标是先建立可以推理的 biology mental model，再把模型接到真实项目里的材料、实验、行列、单位、分母、ID 关系和推断边界。主教材现有 **19 门课、128 章、512 个教学小节、199 个来源条目**。全站以 [UIUC 2026–2027 MCB BSLAS](https://catalog.illinois.edu/undergraduate/las/molecular-cellular-biology-bslas/) 的先修结构为骨架：共同生物基础 → MCB 250/251 Molecular Genetics → MCB 252/253 Cells, Tissues & Development → MCB 354 Biochemical Basis → advanced MCB / research；再用 [MCB + Data Science](https://catalog.illinois.edu/undergraduate/las/molecular-cellular-biology-data-science-bslas/) 补上计算项目路线。

内容重点为 16 章 **Molecular Genetics**（chromatin、replication/repair、enhancer、epigenetics、splicing、pedigree、linkage/LD/phasing、GWAS、VAF/CNV/clonality、CRISPR）和 6 章 **Cell Signaling**（ligand–receptor、GPCR、RTK、JAK–STAT/Wnt/Notch、dynamics、单细胞/空间通信推断）。本科广度还覆盖 evolution、microbiology、physiology、development、immunology、neuroscience 和 ecology；按当前学习目标不纳入 Plant Biology。站内课程与 UIUC 课程号是概念映射，不代表官方学分、课程替代或 degree audit。

`uiuc-path.html` 是新的全站课程导航：显示五阶段 prerequisite map、UIUC MCB Core / Deep Genetics / MCB + Data Science 三种进入路线、advanced MCB 问题域和 supporting sciences。首页保留一条以机制与数据证据链为终点的九步路线。`genetics-lab.html` 新增三个真正可操作的因果模型：chromatin/TF/enhancer contact 的调控门槛、purity/CNV/CCF 对 VAF 的共同作用，以及 pulse/sustained input/feedback 对 signaling dynamics 的影响。`foundations-lab.html` 保留 DNA→RNA→蛋白、bulk 组织混合和 raw count/CPM/TPM；`data-lab.html` 提供九个文件与数据练习。`motion-lab.html` 只保留 **16 个有明确机制状态变化的原创图解、79 个步骤**；章节页不再给无专属机制图的章节自动生成装饰性“三步动画”。

零基础段包括测量信号与生物对象、DNA/RNA、数量/浓度/通量、物理尺度、基因结构、蛋白结构、酶动力学、复制叉、细胞周期、实验对照、PCR/RT-qPCR、遗传概率、单倍型、Hardy–Weinberg 和肿瘤纯度下的 VAF。B01–B05 与 G01–G06 另加 11 个“先猜再揭示”数据对象/分母练习。具体增补和后续缺口见 [`coverage-audit.md`](coverage-audit.md)。

## 本地预览

全站现有 10 个 HTML 页面、128 章教材与 12 课复习。教材侧栏和总目录均按 UIUC 五阶段分组，每章标题区标明所在阶段；同时保留全章“先建立直觉”、英文术语锚点，以及 UIUC MCB Core / Deep Genetics / MCB + Data Science 三条推荐路线。动效页现有 16 个场景、79 个步骤；交互模型同时尊重键盘与 reduced-motion 设置。Data Lab 固定提示 row、column、unit/denominator 与 independent n，并在每种 RNA 尺度下说明用途和推断边界。

建议用本地 HTTP 服务打开 `index.html`；真实队列页通过 `fetch` 读取随站点保存的 JSON 快照，直接以 `file://` 打开会被浏览器拦截。可在本目录运行：

```bash
npx serve .
```

网站是纯静态 HTML/CSS/JavaScript，没有构建步骤或第三方运行时依赖。原有内容保存在 `textbook-part-*.js`，本科广度、Molecular Genetics 和直觉入口分别保存在 `textbook-undergrad-*.js`、`textbook-genetics-deep.js` 与 `textbook-intuition.js`。

## 发布到 GitHub Pages

1. 新建 GitHub 仓库，将此目录中的文件复制到仓库根目录并提交。
2. 在仓库 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**。
3. 选择 `main` 分支和 `/ (root)`，保存。
4. 等待 GitHub 提供网站地址；访问页面并检查导航和外部资料链接。

如果你希望把这些文件保留在仓库的 `docs/` 文件夹，也可以在第 3 步选择 `/docs`。所有站内资源使用相对路径，两种方式都适用。

## 内容与来源

- 系统教材按知识依赖排成 19 门课、128 章。原有化学、细胞、肿瘤、组学、TCGA、空间和测序路线完整保留；新增的 Molecular Genetics 精讲紧跟 Genetics 概览，随后再进入 Central Dogma 与 cell biology。后半部分加入 evolution、microbiology、physiology、cell signaling、development、immunology、neuroscience 与 ecology。全章使用“直觉模型 → 机制变量 → 证据来源 → 项目用途”的读法。
- Data Lab 使用虚构的教学数据，交互展示 case/sample join、raw count/CPM、VCF/BED 坐标、tile/患者级拆分、SBS 循环、三条 FASTQ read 的质量/比对/计数路径、五种表达尺度、四种缺失状态，以及 nucleus-only、5 µm-style、过度扩张和配准偏移下的空间细胞分割误差。每种表达尺度都显示数值含义、适用问题、不能直接回答的问题和下一步；分割练习逐点列出 true assignment → observed assignment。每个练习都链接官方格式或方法文档。
- Foundations Lab 的序列和数字是虚构教学模型；它展示改变序列、细胞组成和文库深度如何改变可观察值。页面写明模型假设、零值与证据边界，并链接原始论文或官方文档。
- 机制图解只在章节拥有专属 causal process 时出现：复制、转录、剪接、翻译、细胞周期、受体信号、膜运输、enhancer、测序、read→count、归一化、bulk 混合、spatial binning、细胞分割、cohort join 和数据泄漏。播放器仍提供播放/暂停、逐步查看和 reduced-motion；没有专属机制图的章节不再出现泛化装饰动效。
- 真实文件练习选用 [NCI GDC 公开文件 UUID `ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13`](https://api.gdc.cancer.gov/files/ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13?expand=cases,cases.samples,analysis)。站内仅附九行非连续真实摘录与精简元数据快照；完整文件由 GDC 提供。下载内容的 MD5 与 API 记录一致（`0948d5b1ea684cd62a6ec7dafbeda026`）。此页训练单文件语义，不声称一份文件可完成组间比较。
- 真实队列练习先展示 2026-09-21 通过 GDC API 查询得到的 TCGA-BRCA 公开 STAR Counts 库存：1,231 个文件、1,226 个样本、1,095 个病例，其中 113 个病例在当前元数据中同时有 Primary Tumor 与 Solid Tissue Normal；113 还不是经过唯一文件选择、QC 与排除规则的最终分析配对数。页面区分人类可读的 `case.submitter_id` 与 GDC UUID `case_id`，再用 UUID 把 2 个示例病例的临床表与 4 个已核验 assay 文件连接，并逐例说明 `vital_status`、随访时间与右删失。四份完整 TSV 的 file size 与 MD5 均经下载核验；[站内快照](data/gdc-tcga-brca-paired-star-counts-snapshot.json)保存 API 筛选条件、查询时间、聚合数、临床字段、文件元数据和每份文件 4 个真实基因行。两病例子集只用于逐行核验，不支持统计、因果或临床推断。
- 12 课快速复习仍从 Genetics、DNA、染色体、遗传、变异进入 Central Dogma、细胞、实验、组学和 TCGA。第 6 课逐步推演转录、RNA 加工、密码子翻译、变异后果与组学读数；第 8 课补充细胞器、细胞周期和信号通路。完成进度只保存在当前浏览器。
- 概念地图中的数字脚注链接到页面底部的官方来源；详细课程的专有名词和本课来源直接链接到维护机构。
- 页面中的科学图、矩阵与细胞对比图均为本站绘制的教学示意，并在相关图注或正文标明参考资料；没有复制外部图像。
- 数据集介绍来自维护机构的官方文档。研究前请核对当前数据 release、权限与条款。
- TCGA 是主案例；专题课程进一步拆解 Visium HD、Xenium、CODEX / PhenoCycler、MERFISH、CosMx、IMC 的测量原理、输出和限制，以及 enhancer 与 alternative splicing 的证据链。具体癌种、基因和研究问题可在真实课题确定后补入。

## 文件

- `index.html`：概念地图、术语、引文和资源索引
- `uiuc-path.html`、`.css`、`.js`：UIUC 五阶段 prerequisite map、三条推荐路线与 advanced MCB 问题域
- `uiuc-curriculum.js`：UIUC 课程结构、阶段、advanced clusters 与 supporting sciences 元数据
- `textbook.html`：系统教材；19 门课、128 章
- `textbook-data.js`、`textbook-part-*.js`：来源库与原创章节内容
- `textbook-undergrad-*.js`、`textbook-genetics-deep.js`、`textbook-intuition.js`：本科广度、16 章分子遗传学精讲与全章直觉入口
- `textbook-data-lens.js`：原有 69 章的生物概念→数据语义卡片
- `textbook.css`、`textbook.js`：教材布局、搜索、导航与本地进度
- `genetics-lab.html`、`.css`、`.js`：enhancer 调控、VAF 分母与 signaling dynamics 三个因果模型
- `motion-lab.html`、`bio-motion.css`、`bio-motion.js`、`bio-motion-biology.js`、`bio-motion-data.js`：16 个机制图解、79 个步骤
- `foundations-lab.html`、`.css`、`.js`：三个互动生物与数据模型；新增序列逐碱基/逐 codon 播放与 bulk 比例扫描
- `data-lab.html`、`data-lab.css`、`data-lab.js`、`data-lab-mapping.js`、`data-lab-missingness.js`、`data-lab-segmentation.js`：九个交互式数据练习；SBS 逐轮加入/成像/解除阻断、空间分割边界与 cell × gene 矩阵误差，以及柱和 tile 变化动效
- `real-data-walkthrough.html`、`.css`、`.js`：真实 GDC 文件五步练习
- `real-cohort-lab.html`、`.css`、`.js`、`cohort-workbench.js`：完整 GDC 库存漏斗、case 级临床连接、八步分析管线，以及四份真实文件组成的六步配对练习
- `data/*.tsv`、`data/*.json`：真实文件摘录和来源快照
- `data-reading-card.md`：可复用的陌生组学文件阅读卡，附真实 GDC 填写示例
- `course.html`：从 Genetics 开始的 12 课快速复习
- `course.css`、`course.js`：课程布局、导航与本地进度
- `styles.css`：布局与响应式样式
- `script.js`：移动导航和数据集多选筛选
- `assets/*.svg`：原创示意图与图标
- `coverage-audit.md`：从零基础复查后的已补内容和后续扩写清单

内容核对日期：2026-09-21。
