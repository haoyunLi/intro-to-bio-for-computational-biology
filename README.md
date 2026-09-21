# Bio/CS · 从代码到细胞

一个面向**完全没有生物学背景**的 CS 研究者的中英混合计算生物学学习网站。核心目标是拿到陌生组学文件时，能解释**材料、实验、行列、单位、分母、ID 关系和推断边界**。主教材有 **10 门课、69 章、335 个教学小节、143 个来源条目**，从生命的物质基础与 Genetics、Central Dogma、细胞生物学，逐步进入肿瘤、多组学、TCGA、空间生物学、测序与 RNA 表达定量。每章提供“把这章接到数据上”卡片，并附逐步讲解、原创示意、例题、术语、理解检查及直接来源。

首页提供一条以读懂数据为终点的九步路线。`foundations-lab.html` 用三个可操作模型解释 DNA→RNA→蛋白、bulk 组织混合和 raw count/CPM/TPM；`data-lab.html` 提供九个虚构教学数据练习，包括 FASTQ read→比对→gene count、0 / NA / QC 失败判读，以及空间转录本如何因细胞分割边界而被错分或漏分。`motion-lab.html` 汇集 **16 个原创机制动效、79 个步骤**：8 个生物机制场景共 42 步，8 个数据机制场景共 37 步；37 章教材有对应详细机制图，其余章节也可使用三步数据阅读导览。`real-data-walkthrough.html` 用一份**真实公开的 TCGA-BRCA STAR Counts 文件**做五步读表判断；`real-cohort-lab.html` 从公开 API 的 TCGA-BRCA 完整文件库存开始，经 case 级临床连接和八步分析管线，再落到两病例、四文件的可核验配对子集。原来的 12 课保留作快速复习。肿瘤多组学是主线，也覆盖 Visium HD、Xenium、CODEX、enhancer、splicing、单细胞及医学影像。

零基础段包括测量信号与生物对象、DNA/RNA、数量/浓度/通量、物理尺度、基因结构、蛋白结构、酶动力学、复制叉、细胞周期、实验对照、PCR/RT-qPCR、遗传概率、单倍型、Hardy–Weinberg 和肿瘤纯度下的 VAF。B01–B05 与 G01–G06 另加 11 个“先猜再揭示”数据对象/分母练习。具体增补和后续缺口见 [`coverage-audit.md`](coverage-audit.md)。

## 本地预览

全站 8 个页面、69 章教材与 12 课复习均有静态结构检查。动效页现有 16 个场景、79 个步骤；临床连接、空间分割误差和完整队列工作台同时检查桌面、390 px 手机布局、键盘焦点、播放暂停、离屏暂停与减少动态效果设置。Data Lab 还固定提示 row、column、unit/denominator 与 independent n，并在每种 RNA 尺度下说明用途和推断边界。详细范围见 [`coverage-audit.md`](coverage-audit.md)。

建议用本地 HTTP 服务打开 `index.html`；真实队列页通过 `fetch` 读取随站点保存的 JSON 快照，直接以 `file://` 打开会被浏览器拦截。可在本目录运行：

```bash
npx serve .
```

网站是纯静态 HTML/CSS/JavaScript，没有构建步骤或第三方运行时依赖。69 章内容保存在 `textbook-part-*.js`，可直接编辑。

## 发布到 GitHub Pages

1. 新建 GitHub 仓库，将此目录中的文件复制到仓库根目录并提交。
2. 在仓库 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**。
3. 选择 `main` 分支和 `/ (root)`，保存。
4. 等待 GitHub 提供网站地址；访问页面并检查导航和外部资料链接。

如果你希望把这些文件保留在仓库的 `docs/` 文件夹，也可以在第 3 步选择 `/docs`。所有站内资源使用相对路径，两种方式都适用。

## 内容与来源

- 系统教材按知识依赖排成 10 门课、69 章。章节分别讲化学与细胞基础、遗传学、Central Dogma、细胞生物学、肿瘤演化、组学实验、TCGA 研究、空间组学和调控专题、文件与数据结构，以及测序和表达定量。九章测序专题从 RNA 文库、Sanger 与 Illumina SBS、FASTQ、比对/计数一路讲到 CPM、RPKM/FPKM、GDC FPKM-UQ、TPM、DESeq2 size factor、TMM、变换和 TCGA 实战。每章的“实验信号 / 文件与单位 / 推断边界”卡片与教学小节分别标明来源。
- Data Lab 使用虚构的教学数据，交互展示 case/sample join、raw count/CPM、VCF/BED 坐标、tile/患者级拆分、SBS 循环、三条 FASTQ read 的质量/比对/计数路径、五种表达尺度、四种缺失状态，以及 nucleus-only、5 µm-style、过度扩张和配准偏移下的空间细胞分割误差。每种表达尺度都显示数值含义、适用问题、不能直接回答的问题和下一步；分割练习逐点列出 true assignment → observed assignment。每个练习都链接官方格式或方法文档。
- Foundations Lab 的序列和数字是虚构教学模型；它展示改变序列、细胞组成和文库深度如何改变可观察值。页面写明模型假设、零值与证据边界，并链接原始论文或官方文档。
- 动效图解把复制、转录、剪接、翻译、细胞周期、受体信号、膜运输、enhancer、测序、read→count、归一化、bulk 混合、spatial binning、细胞分割、cohort join 和数据泄漏做成可逐帧观察的原创 SVG。播放器提供播放/暂停、前后帧、进度拖动与倍速；平滑过渡尊重系统减少动态效果设置，离屏自动暂停，手机上图像容器可横向滚动。每帧有解释，每个场景标出教学假设和来源；播放速度不代表真实生物反应速率。
- 真实文件练习选用 [NCI GDC 公开文件 UUID `ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13`](https://api.gdc.cancer.gov/files/ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13?expand=cases,cases.samples,analysis)。站内仅附九行非连续真实摘录与精简元数据快照；完整文件由 GDC 提供。下载内容的 MD5 与 API 记录一致（`0948d5b1ea684cd62a6ec7dafbeda026`）。此页训练单文件语义，不声称一份文件可完成组间比较。
- 真实队列练习先展示 2026-09-21 通过 GDC API 查询得到的 TCGA-BRCA 公开 STAR Counts 库存：1,231 个文件、1,226 个样本、1,095 个病例，其中 113 个病例在当前元数据中同时有 Primary Tumor 与 Solid Tissue Normal；113 还不是经过唯一文件选择、QC 与排除规则的最终分析配对数。页面区分人类可读的 `case.submitter_id` 与 GDC UUID `case_id`，再用 UUID 把 2 个示例病例的临床表与 4 个已核验 assay 文件连接，并逐例说明 `vital_status`、随访时间与右删失。四份完整 TSV 的 file size 与 MD5 均经下载核验；[站内快照](data/gdc-tcga-brca-paired-star-counts-snapshot.json)保存 API 筛选条件、查询时间、聚合数、临床字段、文件元数据和每份文件 4 个真实基因行。两病例子集只用于逐行核验，不支持统计、因果或临床推断。
- 12 课快速复习仍从 Genetics、DNA、染色体、遗传、变异进入 Central Dogma、细胞、实验、组学和 TCGA。第 6 课逐步推演转录、RNA 加工、密码子翻译、变异后果与组学读数；第 8 课补充细胞器、细胞周期和信号通路。完成进度只保存在当前浏览器。
- 概念地图中的数字脚注链接到页面底部的官方来源；详细课程的专有名词和本课来源直接链接到维护机构。
- 页面中的科学图、矩阵与细胞对比图均为本站绘制的教学示意，并在相关图注或正文标明参考资料；没有复制外部图像。
- 数据集介绍来自维护机构的官方文档。研究前请核对当前数据 release、权限与条款。
- TCGA 是主案例；专题课程进一步拆解 Visium HD、Xenium、CODEX / PhenoCycler、MERFISH、CosMx、IMC 的测量原理、输出和限制，以及 enhancer 与 alternative splicing 的证据链。具体癌种、基因和研究问题可在真实课题确定后补入。

## 文件

- `index.html`：概念地图、术语、引文和资源索引
- `textbook.html`：零基础系统教材；10 门课、69 章
- `textbook-data.js`、`textbook-part-*.js`：来源库与原创章节内容
- `textbook-data-lens.js`：69 章的生物概念→数据语义卡片
- `textbook.css`、`textbook.js`：教材布局、搜索、导航与本地进度
- `motion-lab.html`、`bio-motion.css`、`bio-motion.js`、`bio-motion-biology.js`、`bio-motion-data.js`：16 个机制动效、79 个步骤及全教材数据导览
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
