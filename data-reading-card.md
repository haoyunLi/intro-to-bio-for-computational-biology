# 组学数据阅读卡 / Omics Data Reading Card

先复制此表，再打开任何 TCGA、GEO、单细胞、空间或影像文件。每一格都应能指向原文件的一行、元数据字段或官方方法说明；暂时查不到就写 **unknown / 待核对**，不要猜。

## 1. 我究竟想回答什么？

- 研究问题：
- 目标人群、组织、疾病与取样时间：
- 想比较的组 / 暴露：
- 想解释或预测的结局：
- 预期分析单位（patient、sample、cell、tile 等）：

## 2. 真实材料 → assay → 文件

| 必填问题 | 我的答案 | 证据链接 / 字段 |
| --- | --- | --- |
| 材料来自谁？case / donor ID 是什么？ |  |  |
| 取了什么？组织、细胞、切片、部位、时间、tumor/normal？ |  |  |
| 哪种 assay？真正被测的分子或物理信号是什么？ |  |  |
| 仪器原始输出是什么？ |  |  |
| 软件做了哪些转换？参考版本、注释版本、workflow 是什么？ |  |  |
| 最终文件的 ID、格式、release、访问权限是什么？ |  |  |

## 3. 打开文件，先读 schema

| 必填问题 | 我的答案 | 证据链接 / 字段 |
| --- | --- | --- |
| 一行代表什么实体？特殊汇总行或表头如何识别？ |  |  |
| 一列代表什么实体或变量？是否所有列属于同一个样本？ |  |  |
| 一个值的单位是什么？由哪个信号和算法步骤产生？ |  |  |
| 分母或长度/规模校正是什么？是 raw count、CPM、FPKM、TPM，还是其他？ |  |  |
| 0、空白、NA、未测、QC 失败分别怎样编码？ |  |  |
| 有哪些 ID？每个 ID 的层级和唯一性是什么？ |  |  |

## 4. 比较之前再核对

- 独立生物样本数 **n**：
- case → sample → aliquot → file 的连接基数与重复规则：
- 纳入 / 排除后各剩多少 case、sample、file：
- 哪些样本缺失？缺失可能与分组或结局有关吗？
- assay、参考、annotation、workflow 和尺度是否一致？
- 可能的替代解释：细胞组成、测序深度、肿瘤纯度、批次、扫描仪、治疗、随访等：

## 5. 只写证据允许的结论

- **可说：**“在 [材料、assay、workflow] 下，观测到 [值、单位、样本数]。”
- **还不能说：**这是否代表因果机制、全体细胞状态、临床可用性或治疗效果？为什么？
- 下一种能缩小不确定性的实验或独立数据：
- 原始文件 / 元数据 / 方法文档链接、访问日期、校验值：

## 一个填好的最小例子

在本站[真实 GDC 文件练习](real-data-walkthrough.html)里，文件 ID 是 `ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13`；GDC 元数据把它连到病例 `TCGA-A8-A09E` 的 primary tumor 样本 `TCGA-A8-A09E-01A`。assay 是 RNA-Seq，workflow 是 STAR - Counts。这是**一个样本的一份 gene quantification TSV**：`TSPAN6` 行的 `unstranded` 值为 `3928`，表示按该流程归给该基因的计数；同一行的 `tpm_unstranded = 59.4987` 属于另一尺度。`WNT16` 的 `unstranded = 0` 是本次量化输出，不证明患者所有细胞没有 WNT16 DNA。只凭这份文件，没有组间比较或临床预测结果。

例子的原始证据：[GDC 文件元数据](https://api.gdc.cancer.gov/files/ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13?expand=cases,cases.samples,analysis)、[完整公开 TSV](https://api.gdc.cancer.gov/data/ead53b27-6ad9-4b96-b5d4-0d4f06fb2d13)、[GDC mRNA 管线说明](https://docs.gdc.cancer.gov/Data/Bioinformatics_Pipelines/Expression_mRNA_Pipeline/)。核对日期：2026-09-20。

## 再往前一步：四份文件如何组成小队列？

在[真实队列练习](real-cohort-lab.html)里，四份同一 RNA-Seq workflow 的公开文件分别来自 `TCGA-A7-A0DC` 与 `TCGA-GI-A2C8`。每位病例各有一份 Primary Tumor 与一份 Solid Tissue Normal；所以 **4 file = 4 sample = 2 case**。只筛肿瘤后是 2 file、2 sample、2 case；再按 case 与正常样本配对可得到 2 对。这个有意挑选的小子集可用于核对连接与读数，不能用于代表性估计、显著性检验或临床预测。

逐份的官方 UUID、MD5、样本类型和原始行数值记录在[可核验快照](data/gdc-tcga-brca-paired-star-counts-snapshot.json)；每个 UUID 也可从练习页跳转到 GDC 原始记录。核对时间：2026-09-21 UTC。
