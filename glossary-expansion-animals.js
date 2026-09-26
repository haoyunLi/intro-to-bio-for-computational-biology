/* Animal form and behavior: connect observed patterns to mechanisms without teleology. */
(() => {
  const details = {
    'Body plan':['人和昆虫的身体都沿前后轴排列，但 segment 与 appendage 的具体组织不同。','body plan 概括大尺度结构，不意味着同类群每个物种外形完全一样。'],
    'Analogy':['鸟翼与昆虫翅都用于飞行，但对应结构并非源自共同祖先的一对同源翅。','功能相似不证明共同祖先已具有同一种结构；要与 homology 分开。'],
    'Allometry':['比较不同体重哺乳动物的 heart mass，可能发现它随 body mass 以非线性方式增加。','不能把不同物种的平均趋势直接套到单个个体。'],
    'Comparative anatomy':['比较鲸前肢、人手与蝙蝠翼的骨骼位置，寻找共同结构和不同功能。','外形相似或不同只是起点，还要结合发育与系统发生证据。'],
    'Biomechanics':['计算跳跃时腿部肌肉产生的力和关节转矩，解释动物怎样离地。','力学约束能排除不可能方案，但不单独揭示行为的进化历史。'],
    'Scaling':['若线性尺寸加倍，几何相似物体的表面积约增 4 倍、体积约增 8 倍。','真实动物会改变形状和材料，未必严格遵循几何相似。'],
    'Lever arm':['肌肉附着点离关节转轴更远时，相同肌力可产生更大 torque。','较大 torque 通常伴随运动速度或位移范围的 trade-off。'],
    'Elastic energy storage':['袋鼠跳跃时 tendon 受力伸长，随后回弹，返还部分机械能。','回弹不产生免费能量；每次储存和释放都有损失。'],
    'Locomotion':['鱼的尾鳍推动水、鸟的翅推动空气、人腿推地，三者都把力传给环境。','观察位移不等于知道能量成本或具体肌肉控制机制。'],
    'Proximate explanation':['一只鸟在日长改变时开始鸣唱，可从 hormone 与 neural circuit 解释“怎样发生”。','proximate explanation 回答机制与发育，不是对“为何被选择保留”的回答。'],
    'Ultimate explanation':['研究某鸣唱行为为何提高求偶成功，讨论它在进化史上的适应价值。','不能因为当前看似有用就断言该行为一定为此而进化；需要比较和选择证据。'],
    'Ethogram':['观察者先定义“理毛”“觅食”“攻击”等可重复判别的动作，再逐次记录。','若类别没有操作定义，观察者的主观印象会让数据难比较。'],
    'Sensitive period':['幼鸟在特定发育窗口接触同类叫声，对后来的鸣唱学习影响较大。','敏感期不一定是过期后绝对无法学习的“硬截止”。'],
    'Behavioral plasticity':['同一只动物在捕食者出现后改变觅食时间。','行为变化不必代表 DNA sequence 变了，也不能自动说它有利。'],
    'Behavioral ecology':['比较不同食物密度下动物觅食时间与捕食风险，研究行为与环境的关系。','观察到某行为和环境相关，不等于已证明具体因果或适应优势。'],
    'Optimality model':['模型预测动物在食物收益和暴露风险之间选择某种觅食时长，再与实测行为比较。','“最优”依赖设定的收益、约束和环境，不表示动物有意识求解公式。'],
    'Evolutionarily stable strategy':['若大多数个体用策略 A，少数用策略 B 不能获得更高长期繁殖收益，A 才可能稳定。','ESS 是模型条件下抵抗稀有替代策略，不等于行为永远不会变。'],
    'Inclusive fitness':['帮助亲属存活繁殖，可能间接增加与自己共享遗传变异的后代数量。','不能仅凭亲属间互助就证明 kin selection；需估计代价、收益和亲缘度。'],
    'Parental investment':['海鸟花时间孵卵和喂雏鸟，可能提高幼鸟存活，但减少其他繁殖机会。','投入不是单纯“关爱”；研究时要量化对未来繁殖的机会成本。'],
    'Biological signal':['雄蛙鸣叫被雌蛙接收并影响择偶，鸣声可作为 signal。','signal 通常涉及演化出的信息传递作用，不是环境中任何可感知变化。'],
    'Cue':['捕食者留下的气味可让猎物提前躲避，即使捕食者并非为通知猎物而释放。','cue 与 signal 的关键差别是信息是否为传递给接收者而演化。'],
    'Sensory ecology':['夜行蝙蝠在暗处用 echo 定位昆虫；研究它的感官与环境如何匹配。','不能用人类感官体验直接推断另一物种能感到什么。'],
    'Path integration':['蚂蚁在弯曲路线觅食后，综合方向和距离估计回巢直线。','它会累积误差，不能把回巢表现误当作脑内有精确地图。'],
    'Social learning':['一只动物观察同伴打开食物盒，随后更快学会类似动作。','群体行为相似也可能来自相同环境或遗传；要排除这些解释。'],
    'Acclimation':['鱼被转入较冷水温后，在数日内改变代谢或 membrane 特性。','acclimation 是个体在生存期内的变化，不是跨世代自然选择。'],
    'Evolutionary adaptation':['若某遗传变异使群体在寒冷环境中繁殖成功率更高，多代后可变得更常见。','不是个体因为“需要”而定向产生有益 mutation。'],
    'Phenotypic plasticity':['相同 genotype 的动物在不同营养条件下长成不同体型。','表型差异不总意味着 genotype 不同；plasticity 本身也可受遗传影响。'],
    'Reaction norm':['把同一 genotype 在不同温度下的生长速率画成一条曲线，与其他 genotype 比较。','一条 reaction norm 描述测过的环境范围，不能无限外推。'],
    'Life-history strategy':['小型啮齿类常较早繁殖并产生较多后代，较大型哺乳动物可能繁殖较晚且每胎较少。','它是多性状 trade-off 的概括，不是物种主动选择的长期计划。']
  };
  const glossary = window.BIOCS_GLOSSARY;
  for (const [label, [example, caution]] of Object.entries(details)) {
    const entry = glossary.get(label);
    if (!entry) throw new Error(`Unknown glossary term: ${label}`);
    entry.example = example;
    entry.caution = caution;
    entry.category = '拓展概念';
  }
})();
