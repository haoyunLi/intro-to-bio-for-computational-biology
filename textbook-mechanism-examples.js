/* Original teaching examples: trace a mechanism before discussing inference limits. */
(() => {
  const chapters = (window.BIOCS_BOOK || []).flatMap(course => course.chapters);
  const byId = id => chapters.find(chapter => chapter.id === id);
  const pedigree = byId('x09');
  pedigree.sections.push([
    '从 1/2 到 2/3：观察怎样改变条件概率',
    `<p>这是虚构的单个位点课堂模型：亲本已知都是 Aa，aa 表现指定表型，AA 与 Aa 不表现；先假定完全外显、没有 phenocopy 或观察错误。一次妊娠的先验是 <code>P(AA)=1/4，P(Aa)=1/2，P(aa)=1/4</code>。现在只知道该子代没有表现，记为 U。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>Genotype</th><th>Prior</th><th>P(U | genotype)</th><th>未归一化权重</th></tr></thead><tbody><tr><td>AA</td><td>1/4</td><td>1</td><td>1/4</td></tr><tr><td>Aa</td><td>1/2</td><td>1</td><td>1/2</td></tr><tr><td>aa</td><td>1/4</td><td>0</td><td>0</td></tr></tbody></table></div><p>权重合计 <code>P(U)=3/4</code>，所以 <code>P(Aa | U)=(1/2)/(3/4)=2/3</code>。观察没有改变这个人的 DNA；它改变了我们对隐藏 genotype 的判断。若 aa 的表型外显率改为 80%，aa 也有 20% 概率不表现：其权重变为 <code>1/4×0.2=1/20</code>，总权重 0.8，carrier posterior 变为 <code>0.5/0.8=5/8</code>。这时不能把 aa 从候选中删掉。实际家系还需年龄、检测和纳入模型；此例不用于个体临床风险。</p>`,
    ['osMendel','nhPenetrance'],
  ]);
  pedigree.worked = ['已知子代未表现，重新归一化 genotype',[
    '先写 Aa×Aa 的三个 genotype 先验：1/4、1/2、1/4；不要直接把 1/2 当作条件概率。',
    '完全外显模型下，未表现事件 U 对应 likelihood：AA=1、Aa=1、aa=0。逐项乘 prior。',
    '把剩余权重之和 3/4 作为分母，得到 P(Aa | U)=2/3，而不是 1/2。',
    '改成 80% 外显率时，aa 的未表现权重为 1/20；分母变为 0.8，Aa posterior=5/8。被观察筛掉的是模型中的可能性，不是分子。',
  ]];
  pedigree.check = ['沿用 Aa×Aa 课堂模型，只有 aa 可表现且外显率为 80%。已知子代未表现，P(aa | U) 是多少？',
    'P(aa 且 U)=1/4×0.2=0.05；P(U)=1/4+1/2+0.05=0.8，因此 P(aa | U)=0.05/0.8=1/16。Aa 的 posterior 是 5/8；不能用未表现排除 aa。此计算依赖已声明的模型。'];

  const antigen = byId('i03');
  antigen.sections.push([
    '同一蛋白，起点与呈递路线怎样改变',
    `<p>先追踪蛋白在哪里，再追踪 peptide 如何到达 MHC。下表画常见路线；真实系统有例外，且任一 peptide 都须适配具体 HLA 才能被稳定展示。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>起点</th><th>加工与装载位置</th><th>表面展示</th><th>对应常规 T cell</th></tr></thead><tbody><tr><td>细胞自身 cytosol 中的蛋白</td><td>proteasome → peptide → TAP 进入 ER → 装载</td><td>MHC I–peptide</td><td>CD8</td></tr><tr><td>APC 摄入外部蛋白</td><td>endosomal/lysosomal protease → endosomal 装载</td><td>MHC II–peptide</td><td>CD4</td></tr><tr><td>部分 dendritic cell 摄入外部蛋白</td><td>cross-presentation，可进入 MHC I 路线</td><td>MHC I–peptide</td><td>CD8</td></tr></tbody></table></div><p>第三行说明“外部来源”不必然等于 MHC II；cross-presentation 也有多种机制。显示 peptide–MHC 后，仍须匹配 TCR、co-stimulation 与细胞状态，才能判断 activation 或 killing。</p>`,
    ['antigenProcessing2013'],
  ]);
  antigen.worked = ['追踪 cytosolic peptide，再预测阻断 TAP 的结果',[
    '设教学蛋白在 cell 的 cytosol 合成；其中一个 peptide 可结合该 cell 的 HLA I，其他条件保持一致。',
    '常见路径是 proteasome 产生 peptide → TAP 运输入 ER → MHC I 装载 → 细胞表面展示。识别这个组合的是匹配的常规 CD8 TCR。',
    '若仅阻断本例的 TAP-dependent 路径，预期该 peptide–MHC I 展示减少；不能用 protein RNA 仍高来否定这个中间环节的缺口。',
    '外部蛋白的 MHC II/endosomal 路线没有同一个 TAP 运输步骤；cross-presentation 与 TAP-independent 例外要另列。呈递减少可能限制识别，但功能还需单独测。',
  ]];
  antigen.check = ['本例只有 TAP-dependent 的 cytosolic peptide 路线被阻断，蛋白仍正常产生。该 peptide 的 MHC I 展示会怎样？能据此说所有 CD4 response 都消失吗？',
    '该 peptide 的常规 MHC I 展示预计减少，因为进入 ER 的运输被阻断。不能断言全部 CD4 response 消失：MHC II 的 endosomal 路线不同，且呈递、TCR 匹配与功能是不同环节。判断只适用于本例设定，真实系统有其他呈递路线。'];

  const respiration = byId('a05');
  respiration.sections[1][1] = respiration.sections[1][1].replace(
    'ETC complex I–IV 把 electron 最终交给 O₂，并跨 inner membrane 建 proton-motive force；',
    'ETC 把 electron 最终交给 O₂。Complex I、III、IV 泵 proton，complex II 传 electron 但不泵 proton；这些过程跨 inner membrane 建 proton-motive force；',
  );
  respiration.sections.push([
    '先预测：氧耗增加，ATP synthesis 为何反而下降',
    `<p>把 electron flow、proton-motive force 和 mitochondrial ATP synthesis 分成三个 readout。下表是假设底物、O₂ 与 ADP 充足，呼吸尚未到最大容量，且只改变指定环节的短时方向预测；箭头不是实测数据。Proton-motive force 同时含 voltage 与浓度差。</p><div class="lesson-table-wrap"><table class="lesson-table"><thead><tr><th>单独改变的环节</th><th>O₂ consumption</th><th>Proton-motive force</th><th>Mitochondrial ATP synthesis</th></tr></thead><tbody><tr><td>ETC 被抑制</td><td>下降</td><td>随后因泄漏耗散而下降</td><td>下降</td></tr><tr><td>ATP synthase 被抑制</td><td>通常下降：回压增大</td><td>早期通常升高</td><td>下降</td></tr><tr><td>Uncoupling：增加绕过 ATP synthase 的 H⁺ 回流</td><td>可上升：回压减小</td><td>下降</td><td>下降</td></tr></tbody></table></div><p>Uncoupling 消耗梯度，却没有把这部分回流耦合到 ATP synthesis；更多 electron 最终交给 O₂ 也不表示更多 mitochondrial ATP。完整细胞可用 glycolysis 补偿 ATP，过强扰动也可能损伤呼吸，所以这些方向不能无条件外推到所有 assay。</p>`,
    ['osOxPhos'],
  ]);
  respiration.worked = ['沿 uncoupling 推演三个方向',[
    '起点是 ETC 用 electron transfer 泵 proton，ATP synthase 用回流驱动 ATP synthesis；这是两种相连的流。',
    '增加绕过 ATP synthase 的 proton 回流后，proton-motive force 降低。回流本身不会都制造 ATP。',
    '在上述底物和容量条件下，ETC 的回压降低，electron flow/O₂ consumption 可上升，同时 mitochondrial ATP synthesis 下降。',
    '若看到 O₂ consumption 上升，另测 gradient 与 ATP synthesis，才能区分耦合供能和 uncoupling；不要用单个 OCR 代替三个量。',
  ]];
  respiration.check = ['沿用表中的短时模型，ETC inhibition 与 uncoupling 都使 mitochondrial ATP synthesis 下降。哪项 readout 有望区分两者，方向是什么？',
    'O₂ consumption：ETC inhibition 使它下降；在底物/O₂/ADP 充足、呼吸未达上限且未损伤系统的 uncoupling 情况，它可上升。两者的 gradient 都可降低。完整细胞的总 ATP 还受 glycolysis 补偿，需单独测量。'];
})();
