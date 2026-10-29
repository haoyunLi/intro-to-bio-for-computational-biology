/* Original research-method chapters. Diagrams and numbers are synthetic teaching examples. */
(() => {
  'use strict';
  const S = window.BIOCS_SOURCES;
  Object.assign(S, {
    velocityOriginal: ['La Manno et al. · RNA velocity of single cells (2018)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6130801/'],
    velocityDynamics: ['Bergen et al. · Generalizing RNA velocity through dynamical modeling (2020)', 'https://doi.org/10.1038/s41587-020-0591-3'],
    velocityDocs: ['scVelo · Official documentation and modeling workflow', 'https://scvelo.readthedocs.io/en/stable/'],
    perturbSeqOriginal: ['Dixit et al. · Perturb-seq: Dissecting molecular circuits (2016)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5181115/'],
    gestaltOriginal: ['McKenna et al. · Whole-organism lineage tracing by genome editing (2016)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4967023/'],
    cellChatOriginal: ['Jin et al. · Inference and analysis of cell-cell communication using CellChat (2021)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7889871/'],
    scCODAOriginal: ['Büttner et al. · scCODA for compositional single-cell data (2021)', 'https://www.nature.com/articles/s41467-021-27150-6'],
    replicateDE: ['Squair et al. · Confronting false discoveries in single-cell differential expression (2021)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8479118/'],
    replicateDesign: ['Zimmerman et al. · A practical solution to pseudoreplication bias (2021)', 'https://www.nature.com/articles/s41467-021-21038-1']
  });
  const math = {
    velocity: (u, s, beta, gamma) => beta * u - gamma * s,
    composition: counts => {
      const total = counts.reduce((sum, x) => sum + x, 0);
      return { total, fractions: counts.map(x => total ? x / total : null) };
    },
    pairedDifference: pairs => pairs.map(([control, treatment]) => treatment - control)
  };
  window.BIOCS_MECHANISM_MATH = math;
  const text = (x, y, label, size = 17, color = '#17385f', anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${label}</text>`;
  const line = (x1, y1, x2, y2, color = '#315f91', width = 2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
  const box = (x, y, w, h, label, color = '#e9f1fa') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${color}" stroke="#8aacc8"/>${text(x + w / 2, y + h / 2 + 6, label, 17, '#17385f', 'middle')}`;
  const figure = (id, label, body, caption) => `<figure class="concept-figure"><div role="region" tabindex="0" aria-label="${label}（可横向滚动）" style="overflow-x:auto"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-figure-title ${id}-figure-desc" viewBox="0 0 640 330" style="display:block;width:100%;min-width:640px;font-family:Arial,sans-serif"><title id="${id}-figure-title">${label}</title><desc id="${id}-figure-desc">${caption}</desc>${body}</svg></div><figcaption>原创 synthetic example · ${caption} 手机可横向滑动；完整数值与推理见下方 worked example。</figcaption></figure>`;
  const vUp = math.velocity(4, 4, 1, .5), vDown = math.velocity(1, 4, 1, .5);
  const velocityFigure = figure('r07', '同样的 spliced RNA，可以有不同的变化方向',
    text(24, 32, 'Same s = 4; β = 1, γ = 0.5 (illustrative rates)') +
    box(25, 67, 154, 64, 'Unspliced u = 4') + line(179, 99, 242, 99) + text(190, 83, 'βu = 4', 15) + box(242, 67, 150, 64, 'Spliced s = 4') + line(392, 99, 470, 99) + text(401, 83, 'γs = 2', 15) + box(470, 67, 145, 64, `Net v = +${vUp}`, '#e0f1ed') +
    box(25, 184, 154, 64, 'Unspliced u = 1') + line(179, 216, 242, 216) + text(190, 200, 'βu = 1', 15) + box(242, 184, 150, 64, 'Spliced s = 4') + line(392, 216, 470, 216) + text(401, 200, 'γs = 2', 15) + box(470, 184, 145, 64, `Net v = ${vDown}`, '#fff0e4') +
    text(25, 294, 'v = production into spliced pool − degradation out of it', 16),
    '两种状态的 s 都为4。β=1、γ=0.5时，u=4给v=+2；u=1给v=−1。线条表示流入与流出，不是观测到的同一细胞时间轨迹。');
  const perturbFigure = figure('r08', '三种 perturbation 与 rescue 的结果必须一起读',
    text(24, 30, 'Synthetic phenotype relative to control (%)') + line(67, 65, 67, 254) + line(67, 254, 612, 254) +
    [0, 50, 100].map(v => text(54, 254 - v * 1.7 + 5, String(v), 14, '#395875', 'end') + line(67, 254 - v * 1.7, 612, 254 - v * 1.7, '#d1dce6', 1)).join('') +
    [100, 75, 80, 98].map((v, i) => `<rect x="${95 + i * 128}" y="${254 - v * 1.7}" width="70" height="${v * 1.7}" fill="${i === 3 ? '#167768' : '#2c63a3'}"/>${text(130 + i * 128, 244 - v * 1.7, String(v), 17, '#17385f', 'middle')}${text(130 + i * 128, 283, ['Control','Guide A','Guide B','Rescue'][i], 16, '#17385f', 'middle')}`).join('') + text(25, 317, 'Agreement + target engagement + rescue strengthen specificity', 15),
    'Control=100、Guide A=75、Guide B=80、rescue=98。它们是示意均值，没有重复与误差，不能由柱高计算显著性。');
  const lineageFigure = figure('r09', 'Lineage history 与 expression state 是两个坐标',
    text(24, 30, 'Barcode history: edits persist in this simplified tree') +
    box(240, 49, 160, 42, 'Ancestor [0,0]') + line(320, 91, 165, 133) + line(320, 91, 480, 133) +
    box(75, 133, 180, 42, 'Clone A [1,0]') + box(390, 133, 180, 42, 'Clone B [0,1]') +
    line(165, 175, 95, 219) + line(165, 175, 235, 219) + line(480, 175, 410, 219) + line(480, 175, 550, 219) +
    box(25, 219, 140, 44, '[1,0] · State X', '#e0f1ed') + box(165, 219, 140, 44, '[1,1] · State Y', '#fff0e4') + box(340, 219, 140, 44, '[0,1] · State X', '#e0f1ed') + box(480, 219, 140, 44, '[0,1] · State Y', '#fff0e4') +
    text(25, 307, 'Matching expression states can belong to different clones.', 16),
    '示意树中Clone A与Clone B各含State X和State Y。相同expression state不决定共同近祖；条形码也可能因缺失、同形编辑而含歧义。');
  const communicationFigure = figure('r10', 'Communication claim 需要跨过四个证据关口',
    box(25, 45, 260, 62, 'Sender: ligand RNA = 4') + box(355, 45, 260, 62, 'Receiver: R1 = 3, R2 = 0') +
    text(320, 85, '+', 26, '#17385f', 'middle') +
    box(110, 139, 420, 58, 'Toy pair score L × R1 = 12', '#e9f1fa') +
    text(25, 235, 'But an R1/R2 complex may lack its required R2 subunit.', 17) +
    text(25, 270, 'RNA → protein / location → receptor response → perturbation', 16) +
    text(25, 306, 'These are evidence checks; 12 is not a binding probability.', 16),
    'L×R1=12只是自编筛选分数；若功能性受体需要R1/R2而R2未检出，应核查检测能力与蛋白复合体。不能把未检出直接当绝对不存在，也不能把12当概率。');
  const before = math.composition([50, 50]), after = math.composition([50, 150]);
  const compositionFigure = figure('r11', 'Relative abundance 下降可以来自另一个群体扩增',
    text(25, 30, 'Absolute teaching counts') + text(375, 30, 'Relative composition') +
    text(25, 82, 'Before') + `<rect x="115" y="55" width="75" height="44" fill="#2c63a3"/><rect x="190" y="55" width="75" height="44" fill="#167768"/>` + text(115, 123, 'A = 50; B = 50', 16) +
    text(25, 193, 'After') + `<rect x="115" y="166" width="75" height="44" fill="#2c63a3"/><rect x="190" y="166" width="225" height="44" fill="#167768"/>` + text(115, 234, 'A = 50; B = 150', 16) +
    text(455, 84, `A: ${before.fractions[0] * 100}%`, 22) + text(455, 195, `A: ${after.fractions[0] * 100}%`, 22) +
    text(25, 285, 'A is unchanged in absolute count; its proportion halves.', 17) + text(25, 314, 'Blue = A; green = B. Relative data alone do not reveal totals.', 16),
    'A始终50；B从50到150。A的比例从50%变25%，A/B从1变1/3。由relative composition alone无法识别是哪个绝对量改变。');
  const pairs = [[10, 14], [20, 24], [5, 9], [30, 34]], differences = math.pairedDifference(pairs);
  const pairedFigure = figure('r12', 'Paired design 比较每位 donor 自己的变化',
    text(25, 30, 'Synthetic normalized expression; descriptive arithmetic only') + line(83, 65, 83, 266) + line(83, 266, 365, 266) +
    [0, 10, 20, 30].map(v => text(68, 266 - v * 5 + 5, String(v), 14, '#395875', 'end') + line(83, 266 - v * 5, 365, 266 - v * 5, '#d1dce6', 1)).join('') +
    pairs.map((p, i) => line(125, 266 - p[0] * 5, 310, 266 - p[1] * 5, ['#2c63a3','#167768','#9a5728','#705a9c'][i], 3) + `<circle cx="125" cy="${266 - p[0] * 5}" r="5" fill="#17385f"/><circle cx="310" cy="${266 - p[1] * 5}" r="5" fill="#17385f"/>` + text(408, 93 + i * 48, `Donor ${i + 1}: Δ = +${differences[i]}`, 19)).join('') + text(125, 298, 'Control', 17, '#17385f', 'middle') + text(310, 298, 'Treatment', 17, '#17385f', 'middle'),
    '四位donor配对数值为10→14、20→24、5→9、30→34，每位变化+4。这里的归一化数值仅展示配对比较；正式NB Pseudobulk模型使用integer raw counts并处理library size。');

  const chapters = [
    {
      id:'r07', title:'RNA velocity：从两种 RNA pool 推断局部变化', subtitle:'先理解 production、splicing 与 degradation，再判断箭头能支持什么。',
      intuition:['一个 pool 的水位只告诉你现在有多少；流入减去流出才告诉你将增还是减。Spliced RNA abundance 相同的 cells，也可以处于不同的转录阶段。','Input 是每个 cell×gene 的 unspliced/spliced measurements；Output 是模型估计的 expression change 和可视化投影。两次测量同一细胞与一次snapshot的模型推断，是不同证据。'],
      core:'Dynamics & inference', goals:['手算 ds/dt=βu−γs 的方向','区分 RNA velocity、pseudotime 与 lineage','知道哪些测量与模型设置可能翻转推断'], prereq:['m03','m04','d04'],
      sections:[
        ['先画两个 RNA pool，再读 rate', `${velocityFigure}<p>在一个简化的单 gene 模型里，u 表示 unspliced RNA，s 表示 spliced RNA。Transcription 以 rate α 把新 RNA 加入 u，splicing 以 βu 把它转入 s，degradation 以 γs 清除 s。于是 <code>du/dt=α−βu</code>、<code>ds/dt=βu−γs</code>。β、γ 是 inverse time；u、s 是分子量或经过模型处理的对应数值。算法输出的尺度常没有真实小时校准。</p>`,['velocityOriginal','velocityDynamics']],
        ['一步一步：从 reads 到有假设的方向', '<ol><li>确认 assay 是否能可靠区分 spliced/unspliced；保存原始 layers、annotation 与计数规则。</li><li>对 cells/genes 做有记录的 QC，检查每位 donor 的 coverage，而不是只看合并后的稠密图。</li><li>构建表示与 neighborhood；平滑会改变局部量，邻居数过大可能混合不同过程。</li><li>用适合数据覆盖的 steady-state 或 dynamical model 估计 rates、phase 与拟合质量。</li><li>先看 gene-level phase portrait 和 residual，再将高维 velocity 投影到 embedding。</li><li>对 genes、neighbors、batch 和 donor 子集做 sensitivity analysis，用 time course 或 lineage evidence 交叉核对。</li></ol>', ['velocityOriginal','velocityDynamics','velocityDocs']],
        ['何时用、如何设置、何时停下来', '<p>适合有转录变化、相关中间状态被采到、且splicing信息足够的snapshot数据。Steady-state近似较简单；dynamical model更灵活也需要可辨识的轨迹覆盖。先记录 filtering、n_neighbors、selected genes、normalization和model mode，再逐项改动看方向是否稳定。不要把默认参数当作跨组织的标准答案。仅有targeted spatial counts而没有可靠unspliced层时，这套输入条件可能不满足。</p><p>如果少数gene主导箭头、拟合残差大、移除一个donor方向就翻转，先检查表达动力学假设和数据覆盖。漂亮的streamline不能弥补错误的rates或邻居。</p>', ['velocityDocs','velocityDynamics']],
        ['用什么证据回答研究问题', '<p>RNA velocity是局部变化的模型估计；pseudotime是排序变量；lineage tracing记录继承历史。三者可以互相检验，但各自输出不能直接替代。跨不相连的cell states画出箭头，也不能单独证明cell fate、迁移路径或gene的因果作用。用于Pathway/Age时先问变化是否代表真正时间、cell composition或batch；age不同的donors不是同一个cell被连续追踪。</p>', ['velocityOriginal','velocityDynamics']]
      ],
      worked:['同样 s=4，为何一个增加一个减少？',['固定β=1、γ=0.5，spliced pool的流出都是γs=2。','状态A的u=4，流入βu=4，v=4−2=+2。','状态B的u=1，流入βu=1，v=1−2=−1。','若β、γ没有时间校准，只解释相对的局部方向；不把+2写成每小时增加2个RNA。']],
      terms:[['Unspliced RNA','尚未完成所定义splicing过程的RNA pool。','velocityOriginal'],['RNA velocity','RNA动力学模型估计的局部expression change。','velocityOriginal'],['Phase portrait','把同一gene的unspliced与spliced量放在一起检查模型轨迹。','velocityDynamics']],
      check:['若u=2、s=8、β=1、γ=0.5，v是多少？把γ错误设为0.1会怎样？','正确模型给v=2−4=−2；错设γ=0.1则v=2−0.8=+1.2，方向翻转。Rate估计与假设决定解释，不能只看embedding箭头。'],
      lens:['Unspliced/spliced layers 与 gene-level residuals，而非仅一张embedding。','每行cell、每列gene；rate与latent time的单位必须单独说明。','局部方向依赖kinetic和neighborhood假设；不能直接证明lineage或因果。',['velocityOriginal','velocityDynamics']]
    },
    {
      id:'r08', title:'Perturb-seq：把 guide、target engagement 与 phenotype 连起来', subtitle:'看见 guide 只说明分配线索，确认 perturbation 成功还需要另一条证据。',
      intuition:['给软件发出指令，不代表指令被执行；读到guide barcode，也不代表每个cell都完成了相同程度的target perturbation。','Input由guide assignment、transcriptome、donor/replicate与batch信息组成；Output是指定context中perturbation关联的表达或状态变化及uncertainty。'],
      core:'Intervention & specificity', goals:['区分guide assignment与target engagement','设计多guide、negative control和rescue比较','识别低效率与selection bias对结果的影响'], prereq:['x16','d01'],
      sections:[
        ['把四个关口分开记录',`${perturbFigure}<p>Guide sequence识别设计目标；barcode把guide关联到cell；target engagement检查目标RNA、protein或功能是否真的改变；phenotype测量系统输出。每个关口都会失败。Guide multiplet、barcode contamination、低效率或错误target annotation，可使同一标签混合不同细胞状态。Phenotype如果是viability，未存活的cells根本不会进入终点RNA matrix。</p>`,['perturbSeqOriginal']],
        ['逐步建立一个可解释的比较','<ol><li>先定义目标、cell context、time point与主要readout；说明为何这些变化能回答问题。</li><li>保留non-targeting controls、多个independent guides和biological replicates；检查control是否覆盖每个batch。</li><li>检查guide counts、multiplets和assignment置信信息，对ambiguous cells定义处理规则。</li><li>用独立measurement确认target engagement；低RNA不能在所有情况下等同protein功能丢失。</li><li>先看每条guide的效应方向，再作有明确模型的target-level合并，检查cell state和survival composition。</li><li>对候选做rescue或orthogonal perturbation，确认效应是否随目标功能恢复。</li></ol>',['perturbSeqOriginal']],
        ['设置有含义，修改有理由','<p>Guide assignment threshold增大，可能减少污染也丢掉低coverage cells；报告丢掉了哪些donors、states和conditions。Multiplicity与time point改变可解释对象：多重perturbation涉及interaction，晚期readout包含适应和selection。样本量应覆盖independent donor/experimental replicate，不能只扩大同一batch中的cell数。</p><p>比较组间RNA时保留raw counts和合适的library-size处理；对control-defined state分层可以帮助诊断，但condition影响的状态也可能是mediator，随意调整它会改变估计目标。先写清total effect还是state-conditional effect，再决定covariates。</p>',['perturbSeqOriginal','replicateDesign']],
        ['优势、限制与下一项验证','<p>Perturb-seq可把多种perturbations与丰富的cellular responses联系起来，适合筛选候选调控关系。代价是assignment、delivery、off-target、viability和context都会进入结果。单条guide的显著变化应先复现与检查特异性。Rescue接近control支持目标相关解释，但过表达剂量、递送差异和缺失controls仍需检查；它不自动证明每个下游gene都是direct target。</p>',['perturbSeqOriginal']]
      ],
      worked:['多guide与rescue给出怎样的证据？',['Synthetic control均值100；Guide A为75，Guide B为80，方向一致。','相对control下降分别为25%和20%；先检查两条guide是否都发生target engagement。','提供resistant construct后，rescue为98；这支持但不单独完成特异性论证。','这些数值只有示意均值；缺少independent replicate和variance时不算p-value，也不宣称临床效果。']],
      terms:[['Guide assignment','把捕获的guide信息关联到cell的步骤。','perturbSeqOriginal'],['Target engagement','目标分子或功能确实受到perturbation的证据。','perturbSeqOriginal'],['Rescue','重新提供目标功能并检查phenotype能否恢复的干预。','perturbSeqOriginal']],
      check:['Guide A改变了phenotype，但目标protein并未下降；Guide B已确认目标protein下降却没有相同phenotype。下一步先做什么？','先核查Guide A的特异性、assignment和其他作用，而不是把所有cells合并成更显著的p-value。需独立guide、target engagement、rescue/orthogonal assay和replicate共同支持目标相关解释。'],
      lens:['Guide counts、assignment、target measurement与phenotype矩阵应能追溯到同一cell/replicate。','Cell是measurement unit；独立性取决于donor、culture、随机分配和实验设计。','Perturbation label不是执行成功证明；selection和off-target可改变终点样本。',['perturbSeqOriginal','replicateDesign']]
    },
    {
      id:'r09', title:'Lineage tracing：给细胞状态补上继承历史', subtitle:'Expression 相似回答现在像谁；可遗传 barcode 帮助回答来自哪条 lineage。',
      intuition:['两个人穿着一样不说明他们是兄弟姐妹。Cell state相近也可能来自不同ancestor；可继承的barcode给出另一条历史线索。','Input是可遗传barcode/edits和细胞身份；Output是clone assignment或带不确定性的lineage relationship。Expression可以叠加在tree上，但不应决定树的全部历史。'],
      core:'History & cell state', goals:['区分clone、cell state与lineage tree','逐步解释累计编辑怎样记录历史','识别collision、dropout与sampling bias'], prereq:['v01','x04','e02'],
      sections:[
        ['两种关系放在同一张图上',`${lineageFigure}<p>Static barcode可标识共同来源的clone；mutable barcode随时间积累edits，可以提供更细的分支线索。简化模型假定早期edit被后代继承，新edit在分支上增加。真实编辑不是完全均匀随机：同样的repair outcome可独立发生，大片段deletion可删除较早记录，barcode还可能未被检测到。Tree需要在这些限制下推断。</p>`,['gestaltOriginal']],
        ['从barcode到lineage，一步一步核对','<ol><li>明确labeling发生于何时、哪些ancestor，以及label是否影响细胞功能。</li><li>保存barcode sequence、UMI/read evidence与cell metadata，校正测序错误时避免合并真实相近barcode。</li><li>记录没有barcode、多个barcode和coverage不足的cells，而不是默默删掉。</li><li>根据实验机制选择clone grouping或tree模型，写明edit collision和missingness假设。</li><li>把expression state、组织位置和time point叠加为另外的属性；检查同clone是否跨states。</li><li>用已知分裂关系、time course或额外标记检验拓扑；报告未分辨分支。</li></ol>',['gestaltOriginal']],
        ['参数怎样改变可见历史','<p>Barcode diversity不足会使不同founders碰撞；editing过慢缺少分辨率，过快可能很早耗尽信息或删除记录。采样时点、取样组织和capture效率决定哪些后代进入图。分析threshold改变小clone的保留率；先画clone-size和missing-barcode分布，再做阈值敏感性分析。</p><p>适合追问共享ancestor、命运分叉和clone扩增。对肿瘤clone，observed fraction变化还包含sampling、死亡与组织迁移；若没有绝对数量或明确增长模型，不把更大比例自动等同更快分裂。</p>',['gestaltOriginal']],
        ['与RNA velocity和空间邻近怎样互补','<p>同clone可进入多个expression states，不同clone也可趋同到同一state。RNA velocity估计局部expression change，空间邻近描述当前位置；它们都不自动给出ancestor关系。可把三类证据并列检验某个发育假说，但必须保留每种measurement的单位与时间尺度。没有观测到某条lineage，也可能只是未采到而非不存在。</p>',['gestaltOriginal','velocityOriginal']]
      ],
      worked:['两个states并不等于两条lineages',['图中早期barcode [1,0]定义Clone A，早期[0,1]定义Clone B。','Clone A的两个末端为[1,0]与[1,1]，共同保留早期第一个edit。','每个clone都含State X和State Y，按expression state分组会把两个lineages混在一起。','实际数据中[1,1]也可能由另一历史形成；需结合editing机制和更多位点，不能仅看两个bit便宣称唯一树。']],
      terms:[['Clone','在指定labeling定义下共享ancestor的细胞集合。','gestaltOriginal'],['Heritable barcode','可由后代继承并被测量的分子标记。','gestaltOriginal'],['Homoplasy','同一记录状态在不同lineages中独立出现的情况。','gestaltOriginal']],
      check:['两个cells的expression极相似，但可信的early barcodes不同。能否仅凭expression把它们并成同一clone？','不能。相似state不覆盖独立的继承证据。先检查barcode error、collision和标签定义；可靠证据下，它们可以属于不同clone而处于相同state。'],
      lens:['Barcode sequence/edits连接clone identity，expression与spatial coordinates是另一些属性。','Tree tip可对应cell或clone；branch length是否代表时间必须由设计或模型说明。','Missing barcode和edit homoplasy限制历史分辨率；state similarity不能替代继承证据。',['gestaltOriginal']]
    },
    {
      id:'r10', title:'Cell–cell communication：把候选边变成可检验的机制', subtitle:'从 ligand/receptor RNA 到真实信号传递，中间还有 protein、位置与 response。',
      intuition:['电话簿上同时有发件人与收件人的名字，提供联系的可能；确认消息真的送达，还需要线路、接收和响应证据。','Input通常是cell-group expression、数据库中已知ligand/receptor及可选spatial信息；Output是候选communication scores或prioritized edges。'],
      core:'Communication & evidence', goals:['解释expression-based edge为何是候选','识别受体复合体、空间与downstream response的作用','设计跨donor与perturbation验证'], prereq:['c04','l06','s04'],
      sections:[
        ['沿证据链逐个检查',`${communicationFigure}<p>Sender需要表达并产生可用的ligand；ligand需要被加工、释放或呈现在适当位置；receiver需要有可工作的receptor complex；最后才能激活指定response。RNA abundance只观察这条链的一部分。Required subunit未检出是需要核查的缺口，可能是真缺失也可能是测量不足。Secreted、contact-dependent和extracellular-matrix相关信号的空间条件不同。</p>`,['cellChatOriginal']],
        ['从矩阵到候选网络的六步','<ol><li>确定cell type/state标签和donor分组；检查marker与annotation uncertainty。</li><li>确认数据库species、gene ID、complex subunits与版本；排除无法匹配的features。</li><li>按方法要求计算group expression、表达比例和候选score，保留group大小与过滤规则。</li><li>若使用spatial evidence，明确距离单位、segmentation和registration误差；接触信号不能由远距离co-occurrence替代。</li><li>比较donor-level重现性和threshold/database/annotation的敏感性，明确permutation的null究竟打乱了什么。</li><li>对优先候选检查protein/localization、downstream target response，并安排阻断或rescue验证。</li></ol>',['cellChatOriginal']],
        ['算法设置如何影响结论','<p>Cell grouping过粗会混合不同receivers，过细会让mean和表达比例不稳定。Minimum cell count与expression threshold应报告丢弃的群体；不同conditions不能仅因为cell数更多就把更多显著edges叫更强communication。某些方法考虑population size，使用时要说明目标是总量还是每cell潜能。数据库和score定义不同，数值尺度不能直接横比。</p><p>优势是把很多表达关系整理成可验证的候选，适合Spatial项目提出实验方向。局限是数据库不完整、RNA与protein脱节，以及多个sender可能贡献同一ligand。算法间一致也可能只是共享同一数据库。</p>',['cellChatOriginal']],
        ['什么时候称作机制证据','<p>同组织中ligand与receptor一起升高是association；空间相邻增加可接触性依据；receiver的下游响应提供另一层证据；特异的ligand/receptor perturbation及适当controls帮助支持因果。每一层应单独报告，避免从一条粗网络边直接讲成“细胞A驱动细胞B”。Low transcript count和不完整panel也意味着没有预测边并不等于没有交流。</p>',['cellChatOriginal']]
      ],
      worked:['分数12为何不能叫12%的结合率？',['自编toy score只乘L=4与R1=3，结果12；它不是CellChat内部公式。','若真正receptor还需要R2，R2=0的RNA观测要求检查complex和检测能力。','即使各subunits的RNA被检测到，也还需protein、localization和response证据。','把候选交给protein/spatial/perturbation验证；不把toy score重新命名成calibrated probability。']],
      terms:[['Ligand–receptor pair','在指定知识库与生物背景下可发生相互作用的分子组合。','cellChatOriginal'],['Receptor complex','多个必要subunits共同形成的功能性受体结构。','cellChatOriginal'],['Communication score','依赖算法定义的候选边排序或强度量。','cellChatOriginal']],
      check:['Condition B的receiver cells比A多5倍，预测显著边也更多。能否直接说每个receiver的信号更强？','不能。Cell数、统计能力、composition和score是否考虑population size都能改变结果。先固定问题，比较可比的donor-level signal及适当sampling sensitivity，再用独立测量验证。'],
      lens:['Expression-derived候选边、数据库关系、距离与downstream measurements应分层保存。','节点可代表cell或group；edge score的单位由方法定义，通常不是概率。','RNA co-expression支持候选；protein、空间可达性与perturbation才逐步补上机制证据。',['cellChatOriginal']]
    },
    {
      id:'r11', title:'Compositional data：比例变化不唯一决定绝对变化', subtitle:'总和被固定后，一个群体扩增就能改变其他所有群体的比例。',
      intuition:['同一个饼变大一块，其他块的百分比会变小，即使它们的实际大小没有变。Single-cell sample里的cell-type proportions也有这样的约束。','Input是每个biological sample的cell-type counts和covariates；Output通常是相对composition的变化。绝对tissue cell number需要额外校准或计数。'],
      core:'Composition & identifiability', goals:['手算总量、比例与log-ratio','区分differential abundance和within-type expression','说明reference、zero处理和donor单位的影响'], prereq:['d04','k02'],
      sections:[
        ['先把分母画出来',`${compositionFigure}<p>一个sample的proportions加起来为1，因此各cell types的份额互相约束。Observed cell counts还受dissociation、capture、QC和sampling影响；测到200个cells不等于组织里只有200个。图中absolute numbers是已知的toy truth，真实single-cell proportions通常不能自己恢复tissue总量。</p>`,['scCODAOriginal']],
        ['逐步区分三个问题','<ol><li>为每个donor/sample统计cell-type counts，保存total cells与exclusion规则。</li><li>分别写下要问的是relative composition、absolute abundance还是within-type expression。</li><li>画每个sample的composition，检查rare types、zeros、batch和donor覆盖。</li><li>选择composition-aware模型或预设的log-ratio问题；明确reference与covariates。</li><li>比较reference、filtering和zero处理后的结论是否稳定，并报告effect size与uncertainty。</li><li>需要absolute abundance时补组织面积/体积、flow计数、spike-in或另一种适合assay的校准；说明校准假设。</li></ol>',['scCODAOriginal']],
        ['Reference和zero是实际建模选择','<p>Ratio A/B回答A相对于B怎样变化；它不能把变化唯一分解到A或B。Reference最好由实验背景和稳定性证据支持，并检查替换reference的敏感性。Rare type的sample zero可能是真缺失，也可能是sampling没抓到。Pseudocount会明显改变小counts的log-ratio，应记录选择和敏感性，不能用任意常数消除所有难题。</p><p>scCODA以联合模型处理compositional dependence并相对reference解释效应；它不从相对数据创造绝对细胞数。Donor层级样本不足时，增加同一donor的cells只能改善该donor composition的测量，不能替代independent replication。</p>',['scCODAOriginal','replicateDesign']],
        ['在Pathway/Age和Spatial中何时使用','<p>Age-related pathway score变化可能同时包含cell composition与within-type regulation，先分别作图。Spatial region的cell-type比例依赖边界和assigned objects；改变binning或segmentation后，分母也可能变化。优势是能明确比较群体组成；代价是结果常是相对解释，且需要可靠cell annotation与sample metadata。不要把A比例下降直接写成A细胞死亡增加。</p>',['scCODAOriginal']]
      ],
      worked:['A没减少，比例为什么减半？',['Before：A=50、B=50，总量100，A占50%。','After：A=50、B=150，总量200，A占25%；A的absolute count保持不变。','A/B从1变1/3，log-ratio change为ln(1/3)≈−1.099，描述的是相对变化。','若只给50%和25%，还兼容A减少或其他绝对变化；需要外部总量信息才能区分。']],
      terms:[['Composition','受总和约束的一组相对份额。','scCODAOriginal'],['Reference category','用于定义相对效应的比较类别。','scCODAOriginal'],['Log-ratio','两个正量的比值取对数，必须说明分子和分母。','scCODAOriginal']],
      check:['A=40、B=60变成A=80、B=120，A比例与绝对数各怎样变？仅看比例能发现这次总扩增吗？','A从40%到40%，absolute count翻倍。仅有composition无法识别所有群体同比例扩增；需要独立总量或绝对测量。'],
      lens:['Donor×cell-type count table及每个sample的总量、annotation与QC记录。','每行sample/donor，cell counts与tissue absolute abundance不是同一单位。','Relative change依赖分母；没有额外信息不能唯一恢复absolute change。',['scCODAOriginal','replicateDesign']]
    },
    {
      id:'r12', title:'Pseudobulk design：把 cells 放回独立实验单位', subtitle:'从聚合规则到 design matrix，每一步都要对应你想推广的对象。',
      intuition:['同一位donor的许多cells像一本书的许多页；页数更多让你更清楚这本书，不能自动变成更多不同作者。','Input是raw counts、cell type、donor/sample、condition和batch；Output是预设contrast下的gene效应与uncertainty。聚合不是丢掉研究问题，而是把问题放回正确层级。'],
      core:'Replication & design', goals:['按donor×condition×cell type聚合integer counts','读懂paired design的contrast和independence','识别完全混杂与fractional assignment的限制'], prereq:['d01','r03','k04'],
      sections:[
        ['先画独立单位，再写模型',`${pairedFigure}<p>Pseudobulk通常在同一biological sample与cell type内累加gene的observed integer raw counts，产生gene×sample矩阵。每列背后应能追溯donor、condition、batch和cell数。技术重复或同donor多个sections有依赖关系，design必须体现。单细胞很多但独立donors很少时，不能用cell数直接代替生物复制数。</p>`,['replicateDE','replicateDesign']],
        ['六步从cell matrix走到contrast','<ol><li>明确实验分配、biological replicate与目标人群；检查同donor多个sample的关系。</li><li>固定cell-type定义、QC与minimum-cell规则，标出哪些sample×type没有足够信息。</li><li>在正确分组内sum raw counts；log值的均值不是同一个量。</li><li>计算library-size/normalization因素，检查sample QC和gene filtering。</li><li>写design matrix和contrast：配对例子可用~donor+condition；独立组且donor与condition一一嵌套时不能再为每donor加入固定效应而期待识别condition。</li><li>拟合合适count model、检查dispersion/residual与outliers，报告effect size、uncertainty和multiple-testing处理。</li></ol>',['replicateDE','replicateDesign']],
        ['设置、优点和什么时候修改','<p>Minimum cells per sample×type应由测量稳定性和研究对象决定，不能只删掉“不显著”的groups。先报告完整分组表，再进行threshold敏感性分析。复杂design与少donors会消耗自由度；检查rank、各条件覆盖和可估计contrast。Paired设计适合每位donor都被测control与treatment，避免把不同人的baseline差异当treatment。</p><p>Pseudobulk实现较直接，并保留replicate层级的变异；但聚合可掩盖substate变化，稀有cell types也可能数据不足。必要时比较hierarchical/mixed models，但更复杂模型同样需要设计和足够replicates。Condition与batch完全一致时，模型不能凭空分清两者。</p>',['replicateDE','replicateDesign']],
        ['Spatial assignment后的数值要另查','<p>Hard assignment后对明确计数对象的整数累加与soft assignment的weighted/expected expression不同。Soft weights通常生成fractional values，普通integer raw-count likelihood的解释不能直接照搬。先说明估计对象、assignment uncertainty和分析方法如何接收这些量。图中四条线使用synthetic normalized values，只用于展示paired comparison；正式count inference应回到raw layer和模型相应处理。</p>',['replicateDE']]
      ],
      worked:['保留donor后，+4的含义更清楚',['四对synthetic normalized values为10→14、20→24、5→9、30→34。','每位donor的treatment−control都为+4；这是within-donor变化，而非单看treated cells总体均值。','如果第4位donor有100倍cells，按cell合并会使其baseline支配结果；按设计保留donor能暴露这个权重问题。','示意值没有sampling variance，也没有真实raw counts；不能从四条平行线宣称统计显著或生成真实NB结果。']],
      terms:[['Pseudobulk','在定义好的sample×cell type内聚合raw counts的表示。','replicateDE'],['Design matrix','把condition、covariates及设计结构编码为模型列的矩阵。','replicateDesign'],['Contrast','从模型参数中明确提出的一项比较。','replicateDE']],
      check:['Control全在batch A，treatment全在batch B。增加100倍cells，再使用~batch+condition可以解决吗？','不能。两列完全混杂，condition与batch效应不可分别识别；更多相关cells不改变design rank。需要有交叉覆盖的新实验或降低结论范围。'],
      lens:['Gene×biological-sample raw-count matrix、design matrix与sample manifest共同构成分析输入。','每个sample×cell type是一项聚合测量；重复sample仍需追溯donor依赖关系。','Replicate-aware inference不修复完全混杂；fractional weighted counts须另行论证likelihood。',['replicateDE','replicateDesign']]
    }
  ];
  const course = window.BIOCS_BOOK.find(item => item.code === '06');
  if (!course) throw new Error('Research methods require existing course 06.');
  const glossaryDetails = {
    'Unspliced RNA':['同样s=4时，u=4与u=1可给出相反的局部变化方向。','计数规则、annotation和assay决定可观测层；并非每种spatial panel都提供可靠unspliced量。'],
    'RNA velocity':['β=1、γ=0.5、u=4、s=4时，估计ds/dt=+2。','未校准的rate与latent time不能直接解释成真实小时；箭头不自动证明lineage。'],
    'Phase portrait':['把同一gene各cells的u和s作图，检查拟合关系与偏离。','平滑、缺少中间状态或错误rates可能产生看似整齐但误导的图。'],
    'Guide assignment':['一个cell的barcode counts支持将它标记为Guide A。','读到guide不等于目标protein确实下降；还需target engagement。'],
    'Target engagement':['给出guide后，用独立protein assay确认目标功能受到影响。','RNA下降、protein下降与最终功能丢失是可区分的measurement。'],
    'Rescue':['Guide A的phenotype为75，提供resistant construct后接近control的100。','Rescue需要剂量与递送controls，恢复phenotype不自动证明每个下游gene都是direct target。'],
    'Clone':['继承同一个early barcode的后代可属于多个expression states。','相同expression state不等于同一个clone；barcode collision也会制造假共享。'],
    'Heritable barcode':['一个early edit被分裂后的多个后代保留，提供历史线索。','标记可能缺失、碰撞或影响cell行为；没有测到barcode不等于没有该lineage。'],
    'Homoplasy':['两个不相近的lineages独立产生相同repair edit。','不能把每个相同edit都当成共享近祖的唯一证明。'],
    'Ligand–receptor pair':['Sender的ligand RNA与receiver的receptor RNA同时被检测到。','这提供候选关系，还需protein、空间可达性和response证据。'],
    'Receptor complex':['一个功能性受体需要R1和R2共同存在，单看R1不足。','R2未检出可能是缺失或检测不足，不能直接断言功能性受体不存在。'],
    'Communication score':['自编L×R1分数为4×3=12，用于解释候选排序。','此toy公式不是CellChat的实现，12也不是calibrated probability。'],
    'Composition':['A=50、B=150时，A的relative abundance是25%。','比例变化受分母约束，不能仅凭它恢复absolute abundance。'],
    'Reference category':['用A/B描述A相对B的变化，并检查更换reference的结果。','Reference的生物稳定性需要证据；相对数据本身通常不能唯一证明绝对稳定。'],
    'Log-ratio':['A/B从1变成1/3时，log-ratio change为ln(1/3)。','Zero需要明确处理；pseudocount可明显改变rare types的结果。'],
    'Pseudobulk':['把同donor、condition、cell type的integer raw counts按gene求和。','Log表达均值与fractional soft-assignment汇总不能直接当作同一种raw-count输入。'],
    'Design matrix':['配对control/treatment设计中，~donor+condition编码两种结构。','Condition与batch完全一致时增加cells不能修复design rank。'],
    'Contrast':['在拟合模型中明确定义treatment相对control的参数比较。','Contrast是否可估计取决于design；不能在完全混杂后凭名称分开两种效应。']
  };
  for (const chapter of chapters) {
    chapter.terms = chapter.terms.map(term => [...term, ...glossaryDetails[term[0]]]);
    window.BIOCS_DATA_LENS[chapter.id] = chapter.lens;
    delete chapter.lens;
    chapter.intro = '';
    course.chapters.push(chapter);
  }
})();
