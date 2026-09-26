# Bio/CS 教学与视觉设计：下一轮改版原则

更新：2026-09-26。受众是生物零基础、会编程、需要理解生物项目的读者。UIUC MCB 是内容顺序的骨架，不是首页必须先背的课表；Plant Biology 不在范围内。

## 一章应像一组连贯的讲解画面

沿用 research-talk-slides 的「一页只做一件事」原则：单元入口先给一个读者能回答的问题，章节内每段给可复述的结论，结尾用一句明确过渡解释为什么接着读下一章。现在的 13 个单元都在数据里显式保存 question、outcome、bridge 与动手练习，审计会检查它们不缺失；下一轮仍需逐章把泛化的小节标题改成真正的 takeaway title。

1. **真实问题。** 用一个可判断的问题开场，例如「VAF 25% 是否表示 25% 癌细胞有 mutation？」而不是先列学习目标与术语。
2. **一句直觉。** 用读者熟悉的对象、比例或过程建立最小 mental model；English biological terms 只在对象出现时贴上。
3. **一张有推理任务的图。** 图必须帮助读者判断方向、分母、空间关系或时间顺序。图题说明简化了什么、不能推出什么。
4. **一步一步改变变量。** 每小节只推进一个因果或测量步骤；每个关键步骤最好有一组「改变前 / 改变后」或能手算的数字。
5. **证据与反例。** 从 biological object → assay signal → processed value → inference，把替代解释和必要的下一项实验摆在结论旁边。
6. **主动回忆。** 先让读者预测，再显示答案与理由；做完后回到同一个问题，看现在能否独立解释。

章节动效只有在「变化的过程」比静态图更容易误解时才使用，例如 replication fork、signal pulse 或细胞混合。每一步应能暂停、回退，并说明改变了什么变量；不做纯装饰性移动。若没有明确的观察任务，静态对照图更好。

## 网站层级

- **首页**回答「这里能帮我解决什么生物项目问题？」；展示 DNA variant → RNA expression → protein activity → cell behavior → tissue context → patient outcome，明确它们不是自动成立的因果链。随后只给一条 13 单元 / 78 步主线。
- **学习路径**按「对象 → 信息 → 调控 → 代谢 → 细胞协作 → 遗传 → 肿瘤 → 免疫疾病 → 测量 → 实验 → 文件 → 分析 → 项目」前进。章节 prereq 已自动核对；UIUC 五阶段对照与完整 180 章目录退到参考层，Deep Genetics、Immune × Metabolism、Data 是选读主题。
- **教材章页**先给问题和直觉，再给概念图、推理步骤、worked example、数据桥接与术语；目录与来源留在辅助层。
- **术语**先保留 English term，再用一句对象/机制的直觉解释、一个具体例子和一个常见误解帮助读者区分；602 个术语现均已具备释义、例子与误区，93 个核心概念默认先展示。章内首次遇到关键术语可点开，不强迫读者跳走。
- **Lab**只在某个概念需要操作才能学会时嵌入，例如 VAF 的分母、bulk composition、normalization 或 segmentation error。返回教材的链接应指向具体章节，而非泛泛回首页。
- **迁移到自己项目**不等到最后一页才发生：每个主线单元给一个可拿自己的数据回答的问题，并在该单元最后一章直接给 Project Lab 入口；Project Lab 先示范，再让读者写 biological question、object、assay、value/denominator、analysis design、control、claim 和 alternative。Spatial bin-to-cell、pseudobulk pathway age 与 methylation age 是可选方法练习，不宣称与读者当下数据完全相同。站点只检查八个环节是否写到，不把填满表格误称为掌握生物学或分析方法。

## 视觉系统

- 延续纸白教材、深蓝文字、少量赭橙强调；不用每个信息块都加色底、阴影与边框。
- 排版用宽窄、字号和留白表现层级：问题最大，直觉次之，步骤清晰，证据与限制易查；手机首屏必须看见本章核心解释，而非只有元数据。
- 图采用一致的「对象 → 测量 → 推断」视觉语法。颜色不单独承载意思，箭头必须有语义，移动端允许局部图横滑但不让整页横向溢出。
- 多数动效默认静止；尊重 reduced motion。读者操作导致的状态变化应即时解释，不让动画速度代替理解。

## 优先顺序与验收

1. **Genetics → Molecular Genetics。** 先逐章补方向性、分母、隐藏变量和条件概率的手算/交互题；G01 reverse complement、X14 VAF 作示范。
2. **Metabolism 与 Immunology。** 给每条 pathway 或 immune response 一个时空场景：底物从哪里来、能量/物质流向哪里、哪类 cell 在何时接触 antigen；避免平面名词链。
3. **Project Lab。** 以一份 specimen 的 DNA/RNA/protein/spatial 记录贯穿，要求读者逐步标注 object、assay、unit、claim、alternative explanation。
4. **其余基础章。** 对 180 章逐章检查：开头是否不靠预备术语也能懂？图能否让读者推理？是否有具体数字或反例？English term 是否自然融入句子？

2026-09-26 内容补全进展：102 个拓展章已逐章补上非通用的 worked example；180 章已逐章接到实验信号、数据行单位和推断边界。术语库 602/602 个词均有例子与误区。下一轮仍需把 73 个拓展章的通用小节标题改成具体 takeaway，并请真实零基础学习者按章节完成延迟回忆与陌生数据迁移任务；自动审计不能替代这两项。

验收方式不是数动效或章节，而是找生物零基础读者：读完后不看页面，能否解释一条机制；给出一份陌生 assay 结果，能否说清测到什么、不能推出什么、下一项实验是什么。此轮没有真人测试，不能宣称已经达成该目标。
