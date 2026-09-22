/* UIUC curriculum gap expansion: laboratory reasoning, biophysics, infection, and organismal behavior. */
(() => {
  const chapter = window.BIOCS_MAKE_BREADTH_CHAPTER;
  const term = window.BIOCS_TERM;
  const addCourse = course => window.BIOCS_BOOK.push(course);

  addCourse({
    code:'19',
    title:'Experimental Cell & Molecular Biology',
    description:'对应 MCB 251、MCB 253、MCB 301、MCB 364 与 BIOC 455 的 laboratory logic：不只会读 protocol，还能理解 control、measurement、assay limit 与 biological claim 怎样连接。',
    chapters:[
      chapter({
        id:'w01', title:'Measurement：从体积、浓度到 uncertainty', subtitle:'实验数字不是物体的真值，而是经过 instrument、calibration 与 sampling 得到的估计。',
        intuition:'Wet lab 像把不可直接看见的 biology 映射成数字。每次 pipetting、dilution 和 instrument reading 都是转换步骤；误差不会因为 spreadsheet 显示很多小数位就消失。',
        mental:'先画 sample → preparation → instrument → raw signal → normalized value 五个盒子。在每个箭头旁标出 unit、可能损失的 material、随机波动与系统偏差；这样能看见误差从哪里进入。',
        mechanism:'Concentration 是 amount/volume，molarity 按 molecule amount 计量；serial dilution 用已知比例逐步降低 concentration。Micropipette 通过 air displacement 转移小体积，读数准确仍依赖量程、tip、pre-wetting、viscosity 与操作角度。Accuracy 描述接近 reference，precision 描述重复值聚集程度。Calibration 连接 instrument signal 与已知 standard；limit of detection 以下不能把噪声当作精确浓度。Error propagation 会让上游不确定性进入下游 ratio、fold change 与 model parameter。',
        evidence:'用 balance 做 gravimetric pipette check 可把 water volume 转为 mass 验证；standard curve 的 blank、linear range、residual 与 replicate 展示 measurement quality。Technical replicate 衡量测量流程波动，biological replicate 才能估计 biological unit 之间的变异。',
        project:'读取实验数据时保留 raw value、unit、dilution factor、blank subtraction、calibration equation 与 sample identity。模型输入若来自不同 assay range，不应只做一次 z-score 就假定可比较；先检查 censoring、saturation 与 batch-specific standard。',
        pitfall:'更多 technical replicate 不能替代更多 independent biological replicate；它只会更精确地测同一个 biological sample。',
        terms:[term('Accuracy','测量平均结果接近 reference value 的程度。','uiucMcb364'),term('Precision','重复测量彼此接近的程度。','uiucMcb364'),term('Serial dilution','用连续固定比例逐步稀释 sample 的方法。','uiucMcb364'),term('Calibration curve','把已知 standard concentration 与 instrument signal 连接的函数。','uiucMcb364'),term('Limit of detection','给定流程能与 background 区分的最低 signal 或 amount 范围。','uiucMcb364')],
        check:['三次读数几乎完全相同，是否足以说明测量准确？','不够。它说明 precision 高；若 calibration 错误，三次都可能稳定地偏离真值。'],
        sources:['uiucMcb364','uiucMcbCatalog'], prereq:['q01'], core:'Evidence / 证据',
        flow:[['Sample','定义 biological unit'],['Preparation','转移与稀释'],['Measurement','signal + calibration'],['Estimate','value + uncertainty']]
      }),
      chapter({
        id:'w02', title:'Buffers、pH 与 experimental controls', subtitle:'Buffer 维持化学环境；control 决定观察到的变化能否归因于目标因素。',
        intuition:'一个 assay 像一场有规则的比赛。Buffer 维持比赛场地，control 告诉你计分板会不会自己变化；没有它们，再漂亮的 signal 也不知道来自 biology 还是流程。',
        mental:'画 treatment 与 control 两条平行流程，从同一批 sample 出发，只让一个关键变量不同。再加 positive control 检查系统能否响应、negative control 测 background、vehicle control 隔离 solvent effect。',
        mechanism:'pH 反映 proton activity 的对数尺度，小幅数字变化可对应显著 proton difference。Buffer 由 weak acid/base pair 吸收加入的 proton 或 base，在其有效范围内抵抗 pH 改变；temperature、ionic strength 与 CO₂ exchange 都会影响实际环境。Negative control 估计无 target 时的 signal，positive control 验证 assay 有能力得到预期 response，loading control 或 spike-in 可监控 sample amount 与 recovery。Randomization 分散未知 confounder，blinding 降低主观 measurement bias。',
        evidence:'先看 control 是否通过再解释 treatment。若 no-template PCR control 有 band、unstained flow sample 有强 signal、vehicle 本身改变 viability，实验主结论就失去可辨认的 baseline。Control 不是装饰性额外组，而是让 competing explanation 可被排除的 measurement。',
        project:'把每个 column 分成 treatment、control、covariate 或 outcome，并写一句它排除哪种解释。批量组学需在 extraction、library preparation 与 sequencing lane 层面安排 randomized block；只在统计模型最后加 batch label，未必能救回完全混杂的设计。',
        pitfall:'Housekeeping gene 或 loading protein 不会在所有组织、treatment 与 disease 中恒定；它本身也必须验证稳定性。',
        terms:[term('Buffer','在一定范围内抵抗 pH 快速改变的化学体系。','uiucBiop401'),term('Negative control','在缺少目标因素时估计 background 或非特异信号的条件。','uiucMcb364'),term('Positive control','使用已知可产生 response 的条件验证 assay 能工作。','uiucMcb364'),term('Vehicle control','只含递送 treatment 所用 solvent 或 carrier 的对照。','uiucMcb364'),term('Randomization','随机分配处理或流程位置以分散 confounding 的设计方法。','uiucMcbCatalog')],
        check:['Treatment 与 untreated group 不同，但没有 vehicle control，能否断定是 drug target effect？','不能。Solvent、delivery stress 或 handling difference 都可能造成变化。'],
        sources:['uiucMcb364','uiucBiop401','uiucMcbCatalog'], prereq:['w01','q02'], core:'Evidence / 证据',
        flow:[['Question','想隔离的变量'],['Controls','估计 background/capacity'],['Matched procedure','只改变关键因素'],['Inference','排除竞争解释']]
      }),
      chapter({
        id:'w03', title:'DNA cloning、PCR 与 sequence validation', subtitle:'构建 plasmid 是设计信息载体；成功长出 colony 不等于 insert 正确。',
        intuition:'Molecular cloning 像剪接并复制一段可执行说明书。你要确认内容、方向、边界和版本都正确，而不只是看到“有一本书”。',
        mental:'画 source DNA → amplify/assemble → plasmid → host cell → selected colony → verified construct。每一步写出可能的错误：mutation、wrong orientation、empty vector、mixed colony 或 sample swap。',
        mechanism:'PCR 通过 denaturation、primer annealing 与 extension 循环扩增 target；primer 决定边界，也可引入 adapter 或 mutation。Restriction–ligation、Gibson assembly 等策略用 compatible ends 把 insert 接入 vector。Transformation 让 plasmid 进入 competent cell，antibiotic selection 只证明 cell 获得可提供 resistance 的 construct。Colony PCR、restriction digest 与 Sanger sequencing 分别检查 size、map 与 base-level sequence。Expression construct 还要考虑 promoter、reading frame、tag、localization signal 与 host context。',
        evidence:'No-template control 检查 contamination，known template 检查 PCR capacity。Gel 上正确大小的 band 不能排除 point mutation；单向短 read 也可能漏掉 junction 或重复区域。最终证据应覆盖整个 functional insert 和关键 boundary，并保留 sequence file 与 construct map。',
        project:'计算设计 primer 时报告 target transcript/version、strand、amplicon、melting temperature、off-target 与 genomic DNA risk。读取 perturbation experiment 时先检查 construct identity、delivery efficiency 与 expression；错误 plasmid label 会让所有下游统计都无意义。',
        pitfall:'Antibiotic-resistant colony 只说明 selection marker 生效，不自动证明 target insert 存在、方向正确或 protein 能表达。',
        terms:[term('Polymerase chain reaction','通过温度循环和 primer 对特定 DNA 区域进行扩增的方法。','uiucMcb253'),term('Plasmid','可在 host cell 内复制、常用于携带 engineered sequence 的 DNA molecule。','uiucMcb253'),term('Transformation','把外源 nucleic acid 导入 cell 的过程，在 bacteria 中常指 plasmid uptake。','uiucMcb253'),term('Selectable marker','让携带 construct 的 cell 在选择条件下存活或被识别的 gene。','uiucMcb253'),term('Sanger sequencing','用 chain termination 读取 DNA sequence 的方法。','uiucMcb253')],
        check:['一个 colony PCR band 大小正确，为什么仍要 sequencing？','Band size 不能发现许多 point mutation、小 indel、错误 junction 或 mixed template；sequence validation 检查具体 base。'],
        sources:['uiucMcb253','uiucMcb364','ncbiGeneExpression'], prereq:['m01','m02','w02'], core:'Information Flow / 信息流',
        flow:[['Design','vector + insert'],['Assembly','连接 DNA'],['Selection','找到候选 clone'],['Validation','map + sequence + function']]
      }),
      chapter({
        id:'w04', title:'RNA extraction 与 RT–qPCR', subtitle:'qPCR 的 curve 是经过逆转录、扩增效率与 normalization 才能解释的相对量。',
        intuition:'RT–qPCR 像先把易损的 RNA 抄成 DNA，再不断复印目标页并记录何时越过可见阈值。较早越过通常表示起始模板更多，但中间步骤会改变结果。',
        mental:'画 tissue/cell → RNA extraction → quality check → reverse transcription → qPCR → Cq → normalized comparison。为每一步标 control：no-RT、no-template、reference gene、standard/efficiency。',
        mechanism:'RNA extraction 要快速抑制 RNase 并分离 nucleic acid；purity ratio 不等于 integrity。Reverse transcriptase 把 RNA 转为 cDNA，其 primer choice 与 enzyme efficiency 会引入偏差。qPCR fluorescence 随 amplicon accumulation 上升，Cq/Ct 是 curve 越过阈值的 cycle。理想情况下每 cycle 近似倍增，但 primer efficiency、inhibitor 与 nonspecific product 会破坏假设。Relative quantification 常比较 target 与稳定 reference，再比较 condition；ΔΔCq 的倍数解释依赖相近且合格的 amplification efficiency。',
        evidence:'Melt curve、gel 或 probe specificity 检查单一 product；no-RT control 暴露 genomic DNA，no-template control 暴露 reagent contamination。Biological replicate 应从独立 sample 开始，而不是同一 cDNA 的多个 well。RNA-seq 与 qPCR 的差异可能来自 isoform、dynamic range、normalization 与 primer location。',
        project:'报告 primer sequence/amplicon、RNA integrity、input amount、RT protocol、efficiency、reference validation 与 biological replicate。若 target 有多个 isoform，确认 primer 跨哪个 exon junction；否则 qPCR label 可能不是你以为的 transcript。',
        pitfall:'Cq 相差 1 并不在任何条件下都精确等于 2 倍；只有在效率近似 100%、阈值和 background 合理时才接近。',
        terms:[term('Reverse transcription','以 RNA 为 template 合成 complementary DNA 的过程。','uiucMcb364'),term('Quantitative PCR','用 fluorescence 随 cycle 追踪 DNA amplification 的方法。','uiucMcb364'),term('Quantification cycle','amplification signal 越过设定 threshold 的 cycle index。','uiucMcb364'),term('Reference gene','用于相对 normalization、且需在当前条件验证稳定的 gene。','uiucMcb364'),term('Amplification efficiency','每个 PCR cycle 中 target product 增加的相对效率。','uiucMcb364')],
        check:['Treatment 后 reference gene 也变化，继续做 ΔΔCq 会怎样？','Normalization baseline 被移动，target fold change 可能被夸大、缩小甚至翻转；应验证或更换 reference strategy。'],
        sources:['uiucMcb364','uiucMcb253'], prereq:['m03','w01','w02','w03'], core:'Evidence / 证据',
        flow:[['RNA','保留当时 transcript'],['cDNA','逆转录'],['Amplification','curve + efficiency'],['Comparison','reference-normalized estimate']]
      }),
      chapter({
        id:'w05', title:'Protein quantification、SDS–PAGE 与 Western blot', subtitle:'Band intensity 是 extraction、loading、transfer、antibody 与 exposure 共同形成的 signal。',
        intuition:'Western blot 像先按大小把一群 protein 排队，再用有选择性的探针寻找目标。看到一条 band 之前，sample 已经过多次筛选与损失。',
        mental:'画 cell → lysis → protein assay → equal loading → gel separation → membrane transfer → antibody detection → image。每步都问：总量是否相等？目标是否完整？signal 是否在线性范围？',
        mechanism:'Lysis buffer 释放 protein 并用 protease/phosphatase inhibitor 尽量保存状态。BCA 等 colorimetric assay 用 standard curve 估计 total protein。SDS 与 reducing agent 使多数 protein 展开并按 size 迁移；PAGE 的 pore size 影响分离范围。Transfer 把 protein 从 gel 移到 membrane，primary antibody 识别 epitope，labeled secondary antibody 放大 detection。Phospho-specific antibody 测 modification state，但常需同时测 total target。',
        evidence:'Positive lysate、knockout/knockdown sample、secondary-only control 与 expected molecular weight 帮助判断 specificity。Loading control 或 total-protein stain 用于 normalization，但必须在线性 exposure range。过曝 band 的像素 saturation 后不能做可靠 fold change；错误大小的 band 可能是 isoform、cleavage 或 nonspecific binding。',
        project:'定量时保存 uncropped image、exposure、lane annotation 与 normalization value，按 independent experiment 汇总而非把同一 blot 的 pixels 当 replicate。Protein abundance、phosphorylation 与 activity 是不同层级；若 claim 是 enzyme function，增加 activity 或 downstream readout。',
        pitfall:'一条“在正确高度”的 band 仍不足以证明 antibody specificity；多个 protein 可迁移到相近 apparent size。',
        terms:[term('SDS–PAGE','用 detergent 处理后主要按 apparent molecular size 分离 protein 的 electrophoresis。','uiucMcb364'),term('Western blot','把分离后的 protein 转移并用 antibody detection 的 assay。','uiucMcb364'),term('Epitope','antibody 或 immune receptor 识别的 molecular region。','uiucMcb364'),term('Loading control','用于估计 lane input 或 transfer 差异的 reference signal。','uiucMcb364'),term('Linear range','signal 与 analyte amount 保持可量化关系的区间。','uiucMcb364')],
        check:['目标 band 在 treatment 组更黑，为什么不能立刻说 protein 增加？','还需确认 loading、transfer、background、exposure linearity 与 antibody specificity；更黑也可能是 saturation 或 lane input 更多。'],
        sources:['uiucMcb364','uiucAdvanced'], prereq:['b03','w01','w02'], core:'Structure & Function / 结构与功能',
        flow:[['Extract','保存 protein state'],['Separate','按 apparent size'],['Detect','antibody signal'],['Normalize','independent experiment estimate']]
      }),
      chapter({
        id:'w06', title:'Microscopy、fluorescence 与 image quantification', subtitle:'Image 不是直接的 cell；它是 optics、label、sampling 与 processing 后的 measurement。',
        intuition:'Microscope 不是把真实世界原样放大，而是把 specimen 的光信号通过有限分辨率投到 pixels。颜色通常是人为映射，亮度也不等于 molecule count。',
        mental:'从 biological structure → fluorescent label → illumination → optical blur → detector pixel → segmentation → feature table 画一条链。每个环节都可能制造看似 biological 的 pattern。',
        mechanism:'Resolution 取决于 wavelength 与 numerical aperture，不同于 magnification。Widefield 收集焦平面内外光，confocal 通过 pinhole 改善 optical sectioning；z-stack 采样三维结构。Fluorophore 可由 antibody、fusion protein 或 chemical dye 定位，但 fixation、permeabilization、photobleaching 与 spectral overlap 会改变 signal。Segmentation 把 pixels 分配给 object，threshold、object size 和 touching-cell split 会直接影响 cell count 与 intensity。',
        evidence:'Unstained、single-color、secondary-only、known localization 和 perturbation control 用于验证 label。Nyquist sampling、constant acquisition setting、raw-image retention 与 blinded field selection 降低偏差。Colocalization 指空间 signal overlap，受 resolution 与 abundance 影响，不能单独证明 molecular binding。',
        project:'图像机器学习应按 biological sample 或 patient split，不能把同一 slide 的 neighboring tiles 分到 train/test。记录 objective、pixel size、exposure、bit depth、z-step 与 processing。先定义 biological unit 是 cell、field、well 还是 animal，再做统计。',
        pitfall:'提高 digital zoom 不会创造更高 optical resolution；它只是把已有 pixels 显示得更大。',
        terms:[term('Spatial resolution','成像系统区分相邻结构的能力。','uiucMcb364'),term('Fluorophore','吸收特定 wavelength 并发出较长 wavelength 光的 molecule。','uiucMcb364'),term('Point-spread function','点光源经过 optical system 后形成的空间 blur pattern。','idr'),term('Segmentation','把 image pixels 划分成 cell、nucleus 或 region 等 object 的过程。','idr'),term('Colocalization','两个 image signal 在给定分辨率下的空间重叠程度。','uiucMcb364')],
        check:['两个 fluorescent channel 高度重叠，能否证明两个 protein 直接结合？','不能。它们可能位于同一 organelle 但相距很多 nanometer；直接 binding 需要更合适的 physical/biochemical evidence。'],
        sources:['uiucMcb364','uiucMcb253','idr'], prereq:['c02','w01','w02'], core:'Evidence / 证据',
        flow:[['Structure','biological object'],['Label + optics','产生有限 signal'],['Pixels','sampled image'],['Features','segmentation 后的估计']]
      }),
      chapter({
        id:'w07', title:'Cell culture、aseptic technique 与 transfection', subtitle:'Culture dish 是受控模型环境，不是 tissue 的缩小复制品。',
        intuition:'Cell culture 像把 cell 从原来的城市搬到简化公寓。它便于控制 nutrient 和 treatment，但失去了许多 neighbor、matrix、flow 与 immune context。',
        mental:'画 tissue → isolation/immortalization → flask environment → passage → treatment。每次 passage 都是一次 bottleneck 与 selection；把 media、density、matrix 和 passage number 当成 biological variables。',
        mechanism:'Aseptic technique 通过 sterile field、正确开关容器和分离 clean/dirty flow 降低 bacteria、fungi 与 mycoplasma contamination。Adherent cell 依赖 attachment substrate，confluency 描述 surface coverage 而非精确 cell number。Trypsinization、counting 与 seeding density 影响 subsequent growth。Transfection 用 lipid、polymer 或 electroporation 让 nucleic acid 进入 cell；efficiency、toxicity 与 cell-type dependence 决定观察到的是全体还是 selected subpopulation。Primary cell 更接近 tissue 来源但寿命有限；cell line 易用却可能发生 drift 或 misidentification。',
        evidence:'Microscope inspection、mycoplasma test、short tandem repeat authentication、viability 与 transfection reporter 分别检查 culture quality。Mock-transfected control 隔离 delivery stress，non-targeting reagent 估计 sequence-independent effect。Population-average readout 可能被少数高-transfection cell 驱动。',
        project:'记录 cell line source、authentication、passage、media、serum lot、confluency、seeding time 与 treatment timing。跨实验 batch 的 cell state 差异可大于 treatment；在计算模型中把 plate、day 与 culture batch 保留为 hierarchy。',
        pitfall:'“同一个 cell line 名称”不保证两个 laboratory 的 cell 状态相同；长期 passage、cross-contamination 和 culture condition 都可造成分化。',
        terms:[term('Aseptic technique','降低 culture 与 reagent 被 microorganism 污染的操作体系。','uiucMcb364'),term('Confluency','adherent cell 覆盖 culture surface 的比例估计。','uiucMcb364'),term('Passage','把 growing culture 分开并转移到新 vessel 的过程。','uiucMcb364'),term('Transfection','向 eukaryotic cell 导入 nucleic acid 的实验过程。','uiucMcb364'),term('Cell line authentication','确认 cultured cell identity 并监测混淆或污染的验证。','uiucMcb364')],
        check:['同一 treatment 在高、低 confluency 下结果不同，哪一个一定是错的？','不一定有一个错。Density 会改变 nutrient、contact inhibition 与 signaling；应把它作为条件解释并标准化。'],
        sources:['uiucMcb364','uiucMcb253'], prereq:['c05','w01','w02'], core:'Systems / 系统',
        flow:[['Model choice','primary/cell line'],['Culture state','media + density + passage'],['Delivery','transfection/vehicle'],['Readout','population or single-cell']]
      }),
      chapter({
        id:'w08', title:'Flow cytometry：single-cell signal、gating 与 compensation', subtitle:'Flow cytometer 逐个测 particle；gating 是分析模型，不是发现天然存在的方框。',
        intuition:'Flow cytometry 像高速收费站：cell 单个经过 lasers，detector 记录散射光和 fluorescence。最后看到的 cell type 是 signal 加上 gating rule 得到的分类。',
        mental:'按顺序画 all events → time/quality → cells by scatter → singlets → live cells → marker-defined subsets。每一道 gate 都写出排除了什么，以及是否会误删真实 biology。',
        mechanism:'Forward/side scatter 常与 size 和 internal complexity 相关，但不是精确形态测量。Fluorophore emission 可进入多个 detector，compensation 用 single-stain control 估计 spectral spillover。Doublet discrimination 用 pulse height/area/width 排除多个 cell 同时通过。Viability dye 标记 membrane integrity 异常 cell。Threshold 与 transformation 决定低 signal 的显示；fluorescence minus one control 帮助设置多色 panel 中的 positive boundary。Cell sorting 在 measurement 后按 gate 物理分离 subset。',
        evidence:'Unstained、single-stain、FMO、biological negative 与 known positive control 回答不同问题。Gate 应在各组用一致逻辑并报告 event loss。Marker expression 是连续 distribution，把它切成 positive/negative 会丢失强度、异质性和 uncertainty。',
        project:'保存 FCS、panel、compensation matrix、gate hierarchy 与 counts。比较 proportion 时记住 compositional effect：一个 subset 比例上升可由它扩增，也可由其他 subset 减少。Rare-cell classifier 必须在 donor-level validation，并报告 detection limit 与 false positive。',
        pitfall:'Compensation 不是删除 biological overlap，也不是让 cloud 更好看；它只校正 fluorophore signal 在 detector 间的线性 spillover。',
        terms:[term('Flow cytometry','让 suspended particle 单个通过 optical detector 并测量多通道 signal 的技术。','uiucMcb364'),term('Gating','用 sequential rules 选择或定义 event population 的分析过程。','uiucMcb364'),term('Spectral compensation','估计并校正 fluorescence spillover 到其他 detector 的数学过程。','uiucMcb364'),term('Fluorescence minus one control','包含除一个 marker 外其余 fluorophore 的 gating control。','uiucMcb364'),term('Cell sorting','依据 measured signal 把 selected events 物理收集的过程。','uiucMcb364')],
        check:['Treatment 后某 subset 从 10% 到 20%，能否断定该 cell 数量翻倍？','不能。比例分母也可能改变；需要 absolute count、counting bead 或 total cell yield。'],
        sources:['uiucMcb364','uiucMcb408'], prereq:['w02','w06','i02'], core:'Evidence / 证据',
        flow:[['Events','逐个 particle'],['Quality gates','singlet + live'],['Marker space','continuous signals'],['Subset estimate','counts + proportions']]
      }),
      chapter({
        id:'w09', title:'Perturbation、dose–response 与 causal validation', subtitle:'改变一个系统并观察 response 才接近因果；但 off-target、toxicity 和 adaptation 仍要排除。',
        intuition:'如果 correlation 像看到雨伞和雨一起出现，perturbation 就是主动改变一个环节再看系统是否跟着变。但一个 drug 或 knockdown 往往不只推一个按钮。',
        mental:'画 target → immediate molecular readout → pathway response → cell phenotype 四层。分别设计 target engagement、rescue、orthogonal perturbation 与 toxicity control，检查因果链在哪一层断开。',
        mechanism:'Dose–response 描述 exposure 与 effect 的关系，EC50 是给定 assay/context 的 response parameter，不自动等于 binding Kd。Time course 区分 primary response 与 downstream adaptation。Knockout、knockdown、CRISPRi/a、small molecule 和 blocking antibody 在作用层级、速度与 off-target 上不同。Rescue 通过恢复 wild-type function 或 bypass downstream step 测 specificity；orthogonal validation 用不同 mechanism 得到一致 prediction。Viability assay 可能测 membrane integrity、metabolic activity 或 ATP，不能都叫“cell death”。',
        evidence:'Vehicle、non-targeting control、multiple guides/compounds、dose range、time series 与 direct target-engagement evidence 逐层增强结论。Apoptosis 需结合 phosphatidylserine exposure、caspase、DNA fragmentation 或 morphology 等互补 readout；单一 metabolic assay 下降也可能只是 proliferation 变慢。',
        project:'先写 causal graph 再选 assay：想声称 target X 控制 phenotype Y，就测 X 是否真的被改变、中间路径是否按时响应、Y 是否在非致死范围变化。统计上将 well、plate、experiment 和 donor 分层，避免把 thousands of cells 当 thousands of independent perturbations。',
        pitfall:'最高 dose 产生最大变化，不一定是最强 target-specific evidence；它也可能造成 membrane damage、global stress 或 assay interference。',
        terms:[term('Perturbation','人为改变 system component 或 condition 以检验 response 的实验操作。','uiucMcbCatalog'),term('Dose–response relationship','exposure level 与 measured effect 之间的关系。','uiucMcb466'),term('Target engagement','intervention 在 sample 中确实与预期 molecular target 相互作用的证据。','uiucMcb466'),term('Rescue experiment','恢复目标功能或绕过路径以测试 phenotype specificity 的实验。','uiucMcbCatalog'),term('Orthogonal validation','用不同 measurement 或 perturbation mechanism 检查同一结论。','uiucMcbCatalog')],
        check:['一个 drug 降低 ATP-based viability signal，能否直接说它诱导 apoptosis？','不能。Signal 可因 cell number、metabolism 或 assay interference 降低；要补 death-mode 与 target-specific evidence。'],
        sources:['uiucMcb364','uiucMcb466','uiucMcbCatalog'], prereq:['w02','w07','l01'], core:'Evidence / 证据',
        flow:[['Perturb','改变候选 cause'],['Engagement','确认 target 被改变'],['Time + dose','追踪 mechanism'],['Validation','rescue + orthogonal readout']]
      }),
      chapter({
        id:'w10', title:'Reproducibility、lab notebook 与 scientific communication', subtitle:'可复现不是把步骤写得很长，而是让另一个人能重建 decision、material、data 与 analysis lineage。',
        intuition:'实验记录像 data provenance：未来的你必须知道哪个 tube、哪个 script、哪个 figure 来自哪一步。没有 lineage，结果即使“显著”也无法可靠复查。',
        mental:'为每个 figure 反向追踪：panel → analysis output → raw file → sample ID → protocol batch → biological source。任何断开的箭头都是 reproducibility risk。',
        mechanism:'Lab notebook 记录 date、question、protocol version、deviation、lot、sample map、raw-data location 与即时 observation。File naming 与 immutable raw data 防止覆盖；version control 追踪 code/change。Biological replicate、randomization、blinding、predefined exclusion 与 power reasoning 在实验前减少 researcher degrees of freedom。Figure legend 应说明 object、n 的层级、summary/statistic、normalization 与 uncertainty。Research paper 用 claim–evidence–reasoning 结构，而不是按软件按钮顺序写 methods。',
        evidence:'Reproducibility 包含同一 data 重跑 analysis、同一 lab 重复 experiment、不同 setting 检验 generalization 等不同层次。失败复现可能来自 material drift、hidden condition、analysis leakage 或原结论不稳；不能只归结为操作者不熟练。Negative result 若 assay capacity 已由 control 验证，也能限制机制。',
        project:'建立 manifest 把 sample、donor、condition、batch、file 与 checksum 连接；analysis 从 raw/immutable intermediate 自动生成 table 和 figure。交付时附 environment、random seed、exclusion log 与 data dictionary。每个结论写清直接 observation、derived estimate 和 interpretation。',
        pitfall:'公开 code 不等于结果可复现；若缺 raw data、environment、metadata、parameter 和 provenance，代码仍无法重建分析。',
        terms:[term('Reproducibility','在明确条件下用同一 data 或流程获得一致结果的能力。','uiucMcbCatalog'),term('Data provenance','记录 data 从 sample 到 transformation 与 output 的来源链。','uiucMcbCatalog'),term('Biological replicate','来自独立 biological unit、用于估计 biological variation 的重复。','uiucMcb364'),term('Blinding','在 measurement 或 decision 时隐藏 group identity 以降低 bias。','uiucMcbCatalog'),term('Research integrity','诚实、透明、可追踪地设计、执行和报告 research 的规范。','uiucMcbCatalog')],
        check:['把同一 mouse 的 1,000 个 cells 当 n=1,000，为什么会夸大 certainty？','Cells 嵌套在同一 biological unit，共享遗传、环境和处理；独立信息更接近 mouse 数而非 cell 数。'],
        sources:['uiucMcbCatalog','uiucMcb364'], prereq:['w01','w02','q04'], core:'Evidence / 证据',
        flow:[['Question','预先定义 claim'],['Record','sample + decision lineage'],['Analyze','versioned workflow'],['Communicate','claim + evidence + limit']]
      })
    ]
  });

  addCourse({
    code:'20',
    title:'Structural Biology & Biophysics',
    description:'沿 UIUC BIOP 401 与 MCB 的 structural-biology 要求，从 thermodynamics、structure、binding 和 kinetics 理解 molecule 为什么会这样工作，以及结构数据究竟支持什么。',
    chapters:[
      chapter({
        id:'z01', title:'Protein structure：sequence 怎样约束三维形状', subtitle:'Structure 不是静态雕塑，而是受 chemistry 与 environment 约束的 ensemble。',
        intuition:'Amino-acid sequence 像一条带不同黏性、电荷和体积的软链。水环境与链内作用共同限制它常去哪些形状，但它仍会呼吸、摆动和切换 state。',
        mental:'按 primary sequence → local secondary structure → folded domain → multi-domain protein → complex 逐层画。每层都标 interaction 和 movement，不把 textbook ribbon 当作硬壳。',
        mechanism:'Peptide backbone 的 geometry 与 side-chain chemistry 限制 conformation。Hydrogen bond 稳定 α-helix 与 β-sheet，hydrophobic effect 倾向把 nonpolar surface 埋入 core，electrostatic、van der Waals 与 disulfide bond 进一步塑形。Domain 可相对独立 folding 并承担 function；quaternary structure 由多个 subunit 组装。Sequence variant 可能改变 local packing、stability、binding interface 或 regulation，也可能因位置宽容而几乎无效。Structure 是多个 conformation 的 probability distribution，ligand、pH、membrane 与 modification 可移动分布。',
        evidence:'X-ray/cryo-EM density、NMR restraint、crosslinking、mutagenesis 与 biochemical function 提供不同 constraint。PDB model 是对 experimental data 的解释，resolution、missing loop、occupancy 与 construct boundary 都影响可信度。漂亮的 rendered structure 不等于每个 atom 都被直接看见。',
        project:'解释 variant 时先定位 domain、solvent exposure、interface、conservation 与 known functional site，再提出可检验 mechanism。不要只用 3D distance 给 pathogenic label；structure prediction、population frequency、segregation 和 functional assay 应共同约束结论。',
        pitfall:'Protein 的“一个结构”通常是方便表示的 dominant/model state，不意味着 molecule 在 cell 中完全静止。',
        terms:[term('Protein domain','可形成相对独立结构并常承担特定 function 的 protein region。','uiucBiop401'),term('Secondary structure','backbone hydrogen-bond pattern 形成的 local helix、sheet 等结构。','uiucBiop401'),term('Hydrophobic effect','nonpolar surface 在 water 中聚集并减少暴露的 thermodynamic tendency。','uiucBiop401'),term('Quaternary structure','多个 protein subunit 组装成 complex 的层级。','rcsbPdb'),term('Conformational ensemble','同一 molecule 可占据的一组结构状态及其概率。','uiucBiop401')],
        check:['Variant 位于 predicted structure 的核心，能否直接判定致病？','不能。它提出 stability hypothesis；还要看 prediction confidence、population/clinical evidence 与 functional validation。'],
        sources:['uiucBiop401','rcsbPdb','uiucMcbCatalog'], prereq:['b03','b04'], core:'Structure & Function / 结构与功能',
        flow:[['Sequence','chemical constraints'],['Folding','ensemble of shapes'],['Assembly','domains + subunits'],['Function','binding/catalysis/motion']]
      }),
      chapter({
        id:'z02', title:'Folding、disorder 与 protein quality control', subtitle:'能合成出来不等于能正确 folding；cell 需要监控、修复与清除失败 molecule。',
        intuition:'Protein folding 像在拥挤房间里把长绳折成可工作的工具。多数 sequence 有偏好的低-free-energy 区域，但 crowding、heat、mutation 或高 concentration 会让绳子缠错并聚集。',
        mental:'画 nascent chain 从 ribosome 出来，分成 native state、misfolded intermediate、aggregate 与 degradation 四条路；chaperone 和 quality-control system 在岔路口改变去向。',
        mechanism:'Folding landscape 含多个 local state，native ensemble 常在当前环境下兼顾 stability 与 function。Molecular chaperone 避免暴露 hydrophobic region 错误相互作用，并帮助 refolding，但不替 molecule 指定全部结构。Intrinsically disordered region 不形成单一稳定 structure，却可通过 flexible motif 参与 signaling。ER quality control 监测 secreted/membrane protein；ubiquitin–proteasome 与 autophagy–lysosome system 清除不同 substrate。Stress response 提高 chaperone、降低 translation 或改变 degradation，长期失衡可形成 toxic aggregate。',
        evidence:'Thermal shift、circular dichroism、protease sensitivity、solubility、single-molecule assay 和 cellular localization 测不同层级。Loss of soluble protein 可来自 expression 降低、degradation 增加或 aggregation；单一 total lysate band 无法区分。',
        project:'对 missense variant 同时建模 abundance/stability 与 specific activity。若 variant phenotype 被 lower temperature 或 chaperone rescued，支持 folding component，但仍需检查 trafficking 和 function。Proteomics 缺失值可能反映 low abundance，也可能来自 insoluble fraction 未被提取。',
        pitfall:'Intrinsically disordered 不等于没有功能或错误 folding；disorder 本身可提供 flexible binding 和 regulation。',
        terms:[term('Protein folding','polypeptide ensemble 转向可执行 function 的结构状态过程。','uiucBiop401'),term('Molecular chaperone','帮助其他 protein folding 或避免错误聚集、但不成为最终结构的 protein。','uiucBiop401'),term('Intrinsically disordered region','在生理条件下缺少单一稳定三维结构的 protein region。','rcsbPdb'),term('Proteostasis','维持 protein synthesis、folding、trafficking 与 degradation 平衡的系统。','uiucMcbCatalog'),term('Protein aggregation','misfolded 或特定 protein 形成高阶聚集体的过程。','uiucBiop401')],
        check:['某 protein 的 disorder score 高，是否说明预测失败且该区域无用？','不说明。它可能真实缺少固定结构，并通过 short motif、phase behavior 或 flexible linkage 执行功能。'],
        sources:['uiucBiop401','rcsbPdb'], prereq:['z01','c03'], core:'Structure & Function / 结构与功能',
        flow:[['Synthesis','nascent chain'],['Folding landscape','native/misfolded states'],['Quality control','chaperone + degradation'],['Proteostasis','维持 functional pool']]
      }),
      chapter({
        id:'z03', title:'Thermodynamics of binding：affinity、occupancy 与 competition', subtitle:'Binding 是动态平衡；高 affinity 不等于永不分离，也不保证 cell response 强。',
        intuition:'Receptor 和 ligand 像不断相遇又分开的舞伴。Affinity 描述在给定环境下更偏爱 together 还是 apart；occupancy 还取决于现场有多少双方和竞争者。',
        mental:'画 free ligand + free receptor ⇌ complex。再加入 competitor、allosteric state 和 compartment，分别问 equilibrium 偏哪边、达到平衡多快、complex 是否产生 effect。',
        mechanism:'Association 与 dissociation 的 equilibrium ratio 可由 dissociation constant Kd 表示；简单 1:1 system 中 ligand concentration 接近 Kd 时约有一半 receptor occupied。Binding free energy 来自多种非共价 interaction 与 solvent rearrangement，enthalpy 与 entropy 可相互补偿。Multivalency 与 avidity 让多个弱 interaction 合成稳定 attachment。Competition 取决于 concentration 与 affinity；allostery 使一个 site 的 occupancy 改变另一个 site。Cell 中 local concentration、membrane confinement 与 nonspecific binding 使简单模型需要修正。',
        evidence:'Isothermal titration calorimetry、surface plasmon resonance、fluorescence polarization、pull-down 与 cellular occupancy assay 测量不同对象。Kd 来自明确 model fit；若 stoichiometry、active fraction 或 mass transport 假设不对，一个精确数字也可能误导。Co-immunoprecipitation 显示 complex-compatible association，不自动证明 direct 1:1 binding。',
        project:'使用 ligand–receptor database 时把“已报道 interaction”“当前 sample 共表达”“physical proximity”“binding”“downstream function”分成不同 evidence level。预测 drug occupancy 要用 free concentration、target abundance、competition 与 compartment，不只看体外 Kd。',
        pitfall:'较低 Kd 通常表示较高 affinity，但不等于较高 efficacy；binding 和 system response 是两个不同问题。',
        terms:[term('Binding affinity','binding partners 在给定条件下形成 complex 的 thermodynamic tendency。','uiucBiop401'),term('Dissociation constant','描述 reversible binding equilibrium 的 concentration-scale parameter。','uiucBiop401'),term('Occupancy','在某时刻被 ligand 占据的 target fraction。','uiucBiop401'),term('Avidity','多个 interaction 共同产生的整体 binding strength。','uiucBiop401'),term('Allostery','一个 site 的状态通过 structure/dynamics 影响另一个 site 的过程。','uiucBiop401')],
        check:['Drug A 的 Kd 比 drug B 低十倍，能否保证 A 的 clinical effect 更强？','不能。还要看 exposure、target engagement、efficacy、selectivity、tissue access 与 system feedback。'],
        sources:['uiucBiop401','uiucMcb466'], prereq:['b02','l01','a01'], core:'Energy & Matter / 能量与物质',
        flow:[['Encounter','partners 相遇'],['Equilibrium','free ↔ bound'],['Competition','context 改变 occupancy'],['Function','complex 是否产生 effect']]
      }),
      chapter({
        id:'z04', title:'Kinetics、enzyme catalysis 与 allostery', subtitle:'Thermodynamics 告诉你可不可以，kinetics 告诉你多快；enzyme 改变路径而不改平衡终点。',
        intuition:'一条路最终通向山谷不代表你马上到达。Activation barrier 像山口，enzyme 提供更低的路线；allosteric regulator 则改变道路开放程度。',
        mental:'把 reaction coordinate 画成 energy hill：reactant、transition state、product。再画有/无 enzyme 的 hill 高度；另开一张 rate 对 substrate concentration 的曲线，避免混淆 ΔG 与 velocity。',
        mechanism:'Rate constant 描述 elementary process 的时间尺度。Enzyme 通过定位 substrate、稳定 transition state 与调整 microenvironment 降低 activation free energy，但正反方向都加速，不改变 equilibrium constant。Michaelis–Menten model 在一组假设下用 Vmax 和 Km 描述 initial velocity；Km 不总等于 Kd。Competitive、uncompetitive 与 mixed inhibition 对 apparent parameters 影响不同。Cooperativity 与 allostery 让 response 呈 sigmoidal 或 context-dependent；feedback inhibition 把 end product 接回 pathway control。',
        evidence:'Initial-rate assay 需在 substrate 消耗少、product accumulation 小的窗口。拟合应显示 raw data、range、replicate 与 alternative model，而不只报 R²。Cellular enzyme flux 还受 substrate delivery、cofactor、compartment 和 competing reaction；purified enzyme parameter 不是体内固定常数。',
        project:'读 mutation 或 drug paper 时分辨 abundance、binding、catalytic rate 与 pathway flux。一个 inhibitor 让 product 降低，也可能作用于 transporter 或 upstream supply；用 purified assay、target engagement 和 metabolite time course 分层验证。',
        pitfall:'Km 常被口语化为 affinity，但只有特定 kinetic condition 下才可接近 binding constant；不要普遍互换。',
        terms:[term('Reaction kinetics','研究 process rate 与其条件依赖的框架。','uiucBiop401'),term('Activation free energy','system 到达 transition state 所需跨越的 free-energy barrier。','uiucBiop401'),term('Michaelis constant','Michaelis–Menten model 中达到一半 Vmax 的 substrate concentration parameter。','uiucBiop401'),term('Turnover number','enzyme active site 在饱和条件下单位时间转换 substrate 的速率尺度。','uiucBiop401'),term('Cooperativity','一个 binding/event 改变其他 site response 的现象。','uiucBiop401')],
        check:['Enzyme 加速反应一千倍，equilibrium 时 product/reactant ratio 是否也提高一千倍？','不会。Enzyme 降低动力学 barrier 并加快到达同一 equilibrium，不改变 equilibrium constant。'],
        sources:['uiucBiop401','uiucMcb354'], prereq:['z03','a01'], core:'Energy & Matter / 能量与物质',
        flow:[['Barrier','activation energy'],['Catalysis','提供较快路径'],['Rate law','速度随条件改变'],['Regulation','inhibition/allostery']]
      }),
      chapter({
        id:'z05', title:'Membrane biophysics：diffusion、osmosis 与 electrochemical gradient', subtitle:'Molecule 跨 membrane 的方向由 chemical 与 electrical driving force 共同决定。',
        intuition:'Membrane 像选择性边界，两侧的 particle 浓度和 charge 差储存势能。Channel 打开不是主动“推送”，而是给已有 driving force 一条路。',
        mental:'画 membrane 两侧每种 ion 的 concentration 与 voltage。对每个 species 单独画 chemical arrow 和 electrical arrow；两者合并才是 electrochemical gradient。',
        mechanism:'Diffusion 来自 random motion 与 concentration gradient，净流量受 gradient、area、distance 与 permeability 影响。Osmosis 是 water 对有效 solute difference 的响应，tonicity 取决于不能自由跨膜的 solute。Charged ion 的 equilibrium potential 同时考虑 concentration ratio 与 membrane voltage；actual flux 还取决于 conductance。Channel 提供 passive path，pump 用 chemical energy 建立 gradient，secondary transporter 利用一个 gradient 驱动另一个 solute。Small cell 有更高 surface-to-volume ratio，交换能力与内部 volume 的 scaling 因此不同。',
        evidence:'Patch clamp、tracer flux、osmotic swelling、voltage dye 与 transporter perturbation 测不同层级。Membrane potential change 不等于特定 ion flux，除非结合 selectivity、reversal potential 或 pharmacology。Endpoint concentration 相同也可能掩盖 turnover rate 不同。',
        project:'分析 electrophysiology 或 transporter data 时记录 ionic composition、temperature、holding potential 与 cell geometry。模型若只用 transcript abundance 预测 transport，需承认 trafficking、gating、gradient 和 membrane area 都缺失。',
        pitfall:'Na⁺/K⁺ pump 维持 gradient，但一次快速 action potential 的上升并不是 pump 瞬间把 Na⁺ 推入；主要是 channel conductance 改变。',
        terms:[term('Diffusion','particle random motion 造成从高 chemical potential 向低 chemical potential 的净扩散。','uiucBiop401'),term('Osmosis','water 跨选择性 membrane 响应有效 solute difference 的运动。','uiucBiop401'),term('Electrochemical gradient','chemical concentration difference 与 electrical potential difference 的组合 driving force。','uiucBiop401'),term('Permeability','barrier 允许特定 substance 通过的程度。','uiucBiop401'),term('Surface-to-volume ratio','object surface area 与 volume 的比值，影响交换与容量 scaling。','uiucBiop401')],
        check:['某 ion 在 cell 外浓度更高，它一定向 cell 内净流动吗？','不一定。还要考虑 membrane 对该 ion 的 permeability 与 electrical gradient；两种 force 可能同向或相反。'],
        sources:['uiucBiop401','osAnimalForm','osNervous'], prereq:['c01','z03','n01'], core:'Energy & Matter / 能量与物质',
        flow:[['Gradient','chemical + electrical'],['Barrier','selective membrane'],['Pathway','channel/transporter'],['Flux','direction + rate']]
      }),
      chapter({
        id:'z06', title:'Structural methods：X-ray、cryo-EM、NMR 与 spectroscopy', subtitle:'不同方法看见不同 signal；“structure”是 data、model 和 uncertainty 的组合。',
        intuition:'结构方法像从不同角度调查一座会动的建筑：X-ray 看规则 crystal 的 diffraction，cryo-EM 汇总许多 frozen particles，NMR 读 solution 中原子环境；没有一种万能。',
        mental:'为每种方法填四格：sample state、measured signal、inference/model、blind spot。比较时不要只看最终 ribbon image。',
        mechanism:'X-ray crystallography 从 crystal diffraction 推断 electron density，适合许多高分辨结构但 crystallization 与 crystal packing 可能筛选 state。Single-particle cryo-EM 对大量 particle image 做 alignment/classification 重建 density，适合较大 complex 并可分离部分 conformational class。NMR 用 nuclear spin signal 提供 distance/dynamics constraint，常用于 solution 中较小 system。Circular dichroism、FRET、mass spectrometry、crosslinking 与 scattering 提供 secondary structure、distance、composition 或 global shape 等互补信息。Resolution 是可区分 feature 的尺度，不等于所有 region quality 相同。',
        evidence:'Structure validation 查看 map/model fit、geometry、local resolution、missing residue、sample construct 与 ligand identity。Method agreement 增强结论；若 biochemical state、buffer 或 temperature 不同，结构差异也可能来自 condition。Functional mutation 应避免只因破坏整体 folding 而被误解为 interface-specific effect。',
        project:'下载 PDB 时保留 experimental method、resolution、chain、biological assembly、construct 与 missing residue。比较 structure 要先做 sequence/chain mapping；RMSD 是 summary，可能掩盖 local domain movement。将 figure 中 model 与 experimental density/confidence 清楚区分。',
        pitfall:'Cryo-EM 不是给单个 molecule 拍一张原子照片；常见 map 来自大量 particle 的计算重建与分类。',
        terms:[term('X-ray crystallography','利用 crystal diffraction data 构建 molecular structure model 的方法。','rcsbPdb'),term('Cryogenic electron microscopy','在低温保存 sample 并用 electron imaging 重建 structure 的方法集合。','rcsbPdb'),term('Nuclear magnetic resonance spectroscopy','利用 nuclear spin environment 与 interaction 推断 structure/dynamics 的方法。','uiucBiop401'),term('Resolution','measurement 区分空间 feature 的尺度。','rcsbPdb'),term('Electron density map','由 diffraction data 推断并用于约束 atomic model 的三维 density。','rcsbPdb')],
        check:['两个 structure 的 RMSD 很小，能否说明它们 function 完全相同？','不能。关键 active-site side chain、dynamics、ligand、modification 或少数 interface 差异都可能改变 function。'],
        sources:['uiucBiop401','rcsbPdb'], prereq:['z01','w06'], core:'Evidence / 证据',
        flow:[['Sample','state + construct'],['Physical signal','diffraction/images/spins'],['Reconstruction','density/constraints'],['Model','structure + uncertainty']]
      }),
      chapter({
        id:'z07', title:'AlphaFold 与 computational structure：confidence 不是 validation', subtitle:'Prediction 可产生强 hypothesis，但不会自动给出 ligand、dynamics、complex state 或 cellular function。',
        intuition:'Structure prediction 像根据大量已知建筑规律补全一张可能的蓝图。蓝图越自洽，不代表建筑在所有环境下都固定成这个样子，更不代表每个房间正在被怎样使用。',
        mental:'分开四层：input sequence → predicted coordinates → confidence/error estimate → biological interpretation。每跨一层都写需要什么额外证据。',
        mechanism:'AlphaFold 类 model 从 sequence、evolutionary pattern 与 learned structural regularity 预测 coordinate。Per-residue confidence 帮助识别 locally reliable region，predicted aligned error 描述 domain/chain 相对位置 uncertainty。Low confidence 可能对应 disorder、flexible linker、missing evolutionary information 或 model ambiguity。Prediction 常缺少 context-specific ligand、post-translational modification、membrane、alternative conformation 和 crowding；complex prediction 也不等于 interaction 在 cell 中发生。Template/database bias 与 sequence identity 影响 model behavior。',
        evidence:'将 prediction 与 experimental structure、mutational effect、crosslink/distance、binding interface 和 cellular localization 比较。High confidence 支持 geometry plausibility，不是 function 或 pathogenicity 的 probability。Docking score 和 predicted interface 需要 negative control、alternative partner 与 biochemical validation。',
        project:'用 prediction 解释 variant 时显示 confidence、domain boundary 与 alternative state；不要对 low-confidence tail 做精确 Å-level 结论。若用 predicted structure 训练 model，按 sequence homology/time split 避免 related protein leakage，并说明数据库日期。',
        pitfall:'高 pLDDT 不能把 predicted interaction、drug binding 或 disease mechanism 变成已证实事实；它主要评价 local structural confidence。',
        terms:[term('Predicted Local Distance Difference Test','AlphaFold 提供的 per-residue local confidence score。','alphafoldDb'),term('Predicted aligned error','预测两 residue 在结构对齐后相对位置误差的 estimate。','alphafoldDb'),term('Structure prediction','从 sequence 等输入计算 molecular coordinates 或 structural features 的任务。','alphafoldDb'),term('Molecular docking','搜索并评分两个 molecule 可能结合 pose 的 computational procedure。','alphafoldDb'),term('Model validation','用独立 data 与预期 use case 检验 model claim 的过程。','rcsbPdb')],
        check:['AlphaFold 对一个 interface 给出高 confidence，能否证明两 protein 在你的 tissue 中相互作用？','不能。还需 expression、localization、state、physical interaction 与 perturbation evidence。'],
        sources:['alphafoldDb','rcsbPdb','uiucBiop401'], prereq:['z01','z03','d04'], core:'Evidence / 证据',
        flow:[['Sequence','model input'],['Coordinates','predicted structure'],['Confidence','where prediction is stable'],['Validation','independent biological evidence']]
      })
    ]
  });

  addCourse({
    code:'21',
    title:'Infection, Virology & Pharmacology',
    description:'把 UIUC MCB 426、MCB 435、MCB 438、MCB 466 与 biosecurity 方向连成一条机制线：pathogen 如何进入、复制和传播，host 如何限制，drug 如何改变系统。',
    chapters:[
      chapter({
        id:'j01', title:'Host–pathogen interaction：colonization 不等于 disease', subtitle:'Disease 来自 pathogen trait、host state、location 与 time 的交互，不是某个 microbe 的固定标签。',
        intuition:'同一种 microbe 可以像访客、邻居或入侵者，取决于它在哪里、数量多少、host barrier 与 immune state 如何。检测到名字不等于它就是症状原因。',
        mental:'画 exposure → colonization → invasion/damage → transmission，并在每一步加 host barrier、microbiota、immune response 与 treatment 分支。',
        mechanism:'Colonization 是 organism 在 body site 建立与繁殖，infection 指进入 host 并产生 biological interaction，disease 强调功能损伤与症状。Virulence factor 可帮助 adhesion、nutrient acquisition、immune evasion 或 tissue damage，但 effect 依赖 host。Opportunistic pathogen 在 barrier breach 或 immune suppression 时更易致病。Pathology 既可来自 pathogen replication/toxin，也可来自过强或持续 host inflammation。Microbiota 提供 colonization resistance，也可能在生态失衡后改变 risk。',
        evidence:'Culture、microscopy、nucleic acid、antigen、serology 与 host-response marker 各自有不同时间窗。Koch-style causation 在很多 polymicrobial、unculturable 或 host-dependent disease 中需扩展；association 要结合 location、load、temporality、mechanism 与 intervention response。',
        project:'分析 metagenomics 或 infection cohort 时区分 presence、absolute load、activity 和 damage。Case/control 的 antibiotic use、sampling site、disease severity 与 cell composition 都会 confound。Pathogen read 也可能来自 reagent contamination 或 index hopping。',
        pitfall:'把健康人中也存在的 microbe 称为“无害”同样过度简化；它可能在不同 anatomical site 或 host state 造成 disease。',
        terms:[term('Colonization','microorganism 在 host site 建立而不必造成 disease 的状态。','uiucMcb438'),term('Infection','pathogen 与 host 建立并进行复制或持续 interaction 的过程。','uiucMcb438'),term('Virulence','microorganism 在特定 host/context 造成 damage 或 disease 的相对能力。','uiucAdvanced'),term('Opportunistic pathogen','在 barrier、microbiota 或 immunity 改变时更易致病的 organism。','uiucAdvanced'),term('Colonization resistance','resident microbiota 限制外来或潜在 pathogen 建立的作用。','u04')],
        check:['Patient sample 检出 pathogen DNA，能否单凭这一点认定它造成症状？','不能。还需 site、load/activity、host response、alternative cause 与时间关系等证据。'],
        sources:['uiucAdvanced','uiucMcb438','osProkaryotes'], prereq:['u01','u04','i01'], core:'Systems / 系统',
        flow:[['Exposure','接触 microbe'],['Colonization','在 site 建立'],['Host interaction','barrier + immunity'],['Outcome','clearance/carriage/disease']]
      }),
      chapter({
        id:'j02', title:'Bacterial pathogenesis：adhesion、secretion、toxin 与 intracellular survival', subtitle:'Bacteria 致病通常是多个步骤组合；一个 virulence gene 不等于一定发病。',
        intuition:'致病像完成一条障碍赛：到达合适位置、黏附、取得 nutrient、躲开 defense、传播。不同 bacteria 只需完成与其 niche 相符的组合。',
        mental:'画 barrier surface，标 adhesion、biofilm、secretion system、toxin、immune evasion 和 exit。把每个 factor 放在具体 step，而不是列一张“毒力词表”。',
        mechanism:'Adhesin 与 host surface molecule 促进 attachment；capsule 与 surface variation 可减少 clearance。Secretion system 把 effector 送到 extracellular space 或 host cell，重写 cytoskeleton、vesicle traffic 或 immune signaling。Exotoxin 是 secreted protein 等 factor，endotoxin 常指 Gram-negative outer membrane lipopolysaccharide 的 inflammatory component。Intracellular pathogen 可逃离 phagosome、阻止 fusion 或耐受 harsh compartment。Biofilm matrix 建立 spatial community，改变 nutrient、drug penetration 与 physiology。Quorum sensing 让 population density 影响 gene program。',
        evidence:'Isogenic deletion、complementation、competitive infection、microscopy 与 host readout 可把 gene 接到具体 step。Cell culture invasion 不等于 whole-animal disease；mutant growth defect 也可能让 apparent virulence 降低，需要体外 growth control。',
        project:'Genome 中检测 virulence gene 时报告完整性、expression、mobile element context 与 strain background。机器学习不能把 species label 当 disease ground truth；同 species 不同 strain 的 factor 与 host outcome 可差异很大。',
        pitfall:'Virulence factor 不是“只为伤害 host 而存在”的 molecule；许多 factor 在 environmental survival 或 colonization 中也有功能。',
        terms:[term('Adhesin','促进 microorganism 附着 host surface 的 molecular factor。','uiucAdvanced'),term('Secretion system','把 bacterial molecule 转运到外部或 host cell 的 multiprotein machinery。','uiucAdvanced'),term('Exotoxin','由 microorganism 产生并作用于 host process 的 secreted toxin。','uiucAdvanced'),term('Biofilm','cell 与 extracellular matrix 构成的 surface-associated microbial community。','osProkaryotes'),term('Quorum sensing','microbe 用 secreted signal 让 gene expression 响应 population density 的机制。','osProkaryotes')],
        check:['删除一个 gene 后 bacterial burden 下降，能否立刻称它为 immune-evasion factor？','不能。先排除一般 growth、metabolism 或 viability defect，再测它作用于哪一 host-defense step。'],
        sources:['uiucAdvanced','osProkaryotes'], prereq:['j01','u03','i02'], core:'Structure & Function / 结构与功能',
        flow:[['Attach','到达并黏附'],['Manipulate','effector/toxin'],['Persist','evade + biofilm'],['Spread','离开并传播']]
      }),
      chapter({
        id:'j03', title:'Viral genome 与 replication strategy', subtitle:'Virus 用不同 genome chemistry 解决同一个核心问题：怎样产生可被 ribosome 读取的 mRNA 与复制新 genome。',
        intuition:'不同病毒像使用不同格式的压缩包。Host ribosome 只会读取正义 mRNA，因此每种病毒首先要解决“如何生成可读信息”，再解决 genome copy 与 particle assembly。',
        mental:'对任何 virus 先问四题：genome 是 DNA/RNA、single/double、positive/negative？mRNA 从哪里来？需要哪种 polymerase？复制在哪个 compartment？',
        mechanism:'DNA virus 多利用或携带 DNA polymerase，并通过 host/viral transcription system 产生 mRNA。Positive-sense RNA 可直接作为 mRNA，negative-sense RNA virion 必须携带 RNA-dependent RNA polymerase。Double-stranded RNA 与 segmented genome 有各自复制和 reassortment logic。Retrovirus 用 reverse transcriptase 生成 DNA intermediate，并由 integrase 插入 host genome。Replication 常按 early gene、genome synthesis、late structural gene 分时序；error rate、proofreading 与 recombination 塑造 diversity。',
        evidence:'Strand-specific sequencing、metabolic labeling、polymerase inhibitor、subcellular imaging 与 infectious titer 区分 input genome、replication intermediate 和 productive infection。Total viral RNA 上升未必对应 infectious particle 同比例上升。',
        project:'做 viral sequencing 要区分 reference coordinate、segment、strand、consensus 与 within-host variant。Low-frequency variant 受 PCR/sequencing error 强烈影响；technical replicate 与 unique molecular identifier 可帮助。Variant growth advantage 需 competition 或 epidemiological evidence，不能由频率上升单独断言。',
        pitfall:'“RNA virus 变异快”是常见趋势而非无例外定律；polymerase fidelity、proofreading、generation time、population bottleneck 和 selection 都影响 observed rate。',
        terms:[term('Positive-sense RNA','可直接被 ribosome 读取为 mRNA 的 viral RNA polarity。','uiucMcb438'),term('RNA-dependent RNA polymerase','以 RNA 为 template 合成 RNA 的 enzyme。','uiucMcb438'),term('Reverse transcriptase','以 RNA 为 template 合成 DNA 的 enzyme。','uiucMcb438'),term('Replication intermediate','viral genome synthesis 过程中短暂存在的 nucleic-acid form。','uiucMcb438'),term('Reassortment','segmented virus 共感染时交换完整 genome segment 的过程。','uiucMcb438')],
        check:['检测到 positive-sense viral RNA，能否证明正在主动复制？','不能。它可能是 input genome、残留 RNA 或非感染性 particle；需 negative-strand/intermediate、time increase 或 infectious output。'],
        sources:['uiucMcb438','osViruses'], prereq:['u02','m02','m03'], core:'Information Flow / 信息流',
        flow:[['Genome format','DNA/RNA polarity'],['mRNA','让 host ribosome 可读'],['Replication','复制 genome'],['Assembly','产生 progeny']]
      }),
      chapter({
        id:'j04', title:'Viral entry、tropism、assembly、release 与 latency', subtitle:'Receptor 是入口条件之一；tropism 还取决于 cell 内兼容性与 host defense。',
        intuition:'一把钥匙能开大楼外门，不代表能使用里面的机器。Virus 即使进入 cell，也必须避开 defense、找到合适 factor 并完成 assembly 才形成 productive infection。',
        mental:'画 attachment → entry/uncoating → replication compartment → assembly → release，再加 abortive infection、latency 与 immune clearance 三条分支。',
        mechanism:'Viral surface protein 与 attachment factor/receptor 结合，随后通过 membrane fusion、endocytosis 或 genome injection 进入。Protease、pH 或 receptor-induced conformation 可触发 uncoating。Tropism 由 receptor availability、intracellular host factor、temperature、innate restriction 与 tissue accessibility共同决定。Capsid assembly 常依赖 self-organization 与 packaging signal；enveloped virus budding 获得 host-derived membrane。Latency 让 genome 保留但 productive gene program 受限，特定 signal 可 reactivation。Cytopathic effect 可来自 replication burden、membrane damage 或 host response。',
        evidence:'Pseudovirus 可隔离 entry，但不能验证 full replication cycle。Plaque assay、TCID50 与 focus assay 测 infectious output；qPCR 测 genome copy。Receptor knockout 支持 necessity，ectopic receptor 加上 intracellular compatibility 才能测试 sufficiency。',
        project:'分析 tissue tropism 时不要用 receptor RNA 单独下结论；加入 protein localization、cofactor、restriction factor、viral antigen 与 infectious evidence。Spatial data 可显示 infected neighborhood，但 ambient RNA 和 phagocytosed material 会制造假阳性。',
        pitfall:'细胞表达 viral receptor 不代表一定能被 productive infection；entry 后的 replication compatibility 同样关键。',
        terms:[term('Viral tropism','virus 偏好感染特定 host、tissue 或 cell type 的范围。','uiucMcb438'),term('Uncoating','viral genome 从 protective particle 中释放以进入 replication program 的过程。','uiucMcb438'),term('Budding','enveloped virus 穿过 membrane 释放并获得 envelope 的过程。','uiucMcb438'),term('Latency','viral genome 持续存在但 productive replication 受到限制的状态。','uiucMcb438'),term('Cytopathic effect','infection 在 cultured cell 中造成的可观察结构或生存改变。','uiucMcb438')],
        check:['Pseudovirus 能进入某 cell，能否证明原 virus 在该 cell 完成整个生命周期？','不能。Pseudovirus 主要测试 entry；replication、assembly、release 与 defense compatibility 尚未验证。'],
        sources:['uiucMcb438','osViruses'], prereq:['j03','c01','l01'], core:'Systems / 系统',
        flow:[['Attach/enter','receptor + membrane'],['Replicate','cellular compatibility'],['Assemble/release','infectious output'],['Persist/clear','latency or immunity']]
      }),
      chapter({
        id:'j05', title:'Phage、horizontal gene transfer 与 CRISPR', subtitle:'Microbial genome 不是封闭档案；virus 与 mobile DNA 持续重写 gene content。',
        intuition:'Bacterial genome 更像可交换模块的工作手册。Phage、plasmid 与 transposon 能搬运 gene；CRISPR–Cas 则保留部分入侵序列作为可继承的防御记忆。',
        mental:'画 donor DNA 通过 transformation、transduction、conjugation 进入 recipient；再画 selection 决定新 module 是否保留。把 CRISPR spacer acquisition、expression、interference 画成三步。',
        mechanism:'Transformation 吸收环境 DNA，conjugation 通过 cell contact 转移 mobile element，transduction 由 bacteriophage 搬运 DNA。Temperate phage 可 integration 成 prophage，并可能携带 toxin 或 regulation module；stress 可诱导 lytic switch。CRISPR array 含来自 past invader 的 spacer，转录后 guide Cas protein 识别 complementary nucleic acid，PAM 等 rule 减少 self-targeting。Anti-CRISPR、mutation 与 mobile element countermeasure 构成 coevolution。Horizontal transfer 可快速传播 antimicrobial resistance 与 metabolic capacity。',
        evidence:'Comparative genome 的 atypical composition、mobility gene、synteny break 与 phylogeny conflict 提示 transfer，但 assembly contamination 也可模拟。Plaque assay、lysogen induction、spacer match 与 conjugation experiment 连接 sequence 到 mechanism。',
        project:'做 metagenome resistance tracking 时保留 contig/plasmid context、host assignment 与 sampling time。发现 resistance gene 不等于当前 pathogen 表达或可转移；long-read、Hi-C、culture 或 transcript evidence 可提高 linkage confidence。',
        pitfall:'CRISPR 不是 bacteria 的有意识记忆，也不是所有 prokaryote 都有；它是一组多样、可演化且会失败的 molecular defense system。',
        terms:[term('Bacteriophage','infect bacteria 的 virus。','uiucAdvanced'),term('Transduction','由 phage 介导 bacterial DNA 转移的过程。','uiucAdvanced'),term('Conjugation','常经 cell contact 与 conjugative machinery 转移 DNA 的过程。','uiucAdvanced'),term('Prophage','integration 或稳定保留在 bacterial cell 中的 temperate phage genome。','uiucAdvanced'),term('CRISPR–Cas system','用 acquired guide sequence 与 Cas protein 识别 nucleic-acid invader 的 defense system。','uiucAdvanced')],
        check:['Metagenome contig 上有 resistance gene，能否断定它位于致病菌 plasmid 且可传播？','不能。Host 与 mobile context 仍可能不确定，需要更长 linkage 或实验 transfer evidence。'],
        sources:['uiucAdvanced','osViruses','osProkaryotes'], prereq:['u01','u05','j03'], core:'Information Flow / 信息流',
        flow:[['Mobile DNA','phage/plasmid'],['Transfer','DNA 进入新 host'],['Selection','保留有利 module'],['Defense','CRISPR 与反制']]
      }),
      chapter({
        id:'j06', title:'Antimicrobial 与 antiviral：mechanism 和 resistance', subtitle:'Drug 选择 pathogen-specific vulnerability；resistance 是 population 在 exposure 下改变，不是单个 organism 努力适应。',
        intuition:'有效 drug 要击中 pathogen 依赖而 host 较少依赖的环节，或利用足够的 therapeutic window。治疗同时也是强 selection environment，会让已有或新出现的 resistant variant 增加。',
        mental:'画 drug exposure → target inhibition → replication/survival effect → population bottleneck → resistant subpopulation。旁边画 host toxicity 与 tissue concentration，避免只看 petri dish。',
        mechanism:'Antibacterial 可靶向 cell wall、ribosome、DNA replication 或 metabolism；antiviral 常靶向 entry、viral polymerase、protease、integrase 或 release。Resistance 可由 target alteration、drug inactivation、reduced uptake、efflux、pathway bypass 或 tolerant state 产生。MIC 是给定 assay 抑制 visible growth 的 concentration，MBC 测 killing threshold；tolerance/persistence 与遗传 resistance 不同。Combination therapy 可扩大 barrier，但 interaction 可能 synergistic、additive 或 antagonistic。',
        evidence:'Susceptibility testing、time-kill curve、sequencing、competition、target assay 与 clinical PK 连接 mechanism。In vitro resistance mutation 未必在 host 中有足够 fitness；反之 biofilm、sanctuary site 与 immune state 会让 susceptible isolate 临床清除失败。',
        project:'建 resistance predictor 时按 lineage/time/geography split，避免相近 isolate 泄漏。Label 要说明 genotype、phenotypic MIC 还是 treatment failure。报告 uncertain variant 与 no-call，不把 database absence 当 susceptibility。',
        pitfall:'停止使用一种 drug 不保证 resistance allele 立即消失；若 fitness cost 小、compensatory mutation 出现或 linked selection 存在，它可长期保留。',
        terms:[term('Minimum inhibitory concentration','给定条件下阻止 visible microbial growth 的最低 tested drug concentration。','cdcAntibioticResistance'),term('Antimicrobial resistance','microorganism 对原本可抑制或杀灭它的 drug response 降低。','cdcAntibioticResistance'),term('Persistence','少数 cell 在无稳定 resistance 的情况下暂时耐受 exposure 的 physiological state。','cdcAntibioticResistance'),term('Efflux pump','把 compound 从 cell 内运出的 transporter，可降低 intracellular drug level。','cdcAntibioticResistance'),term('Combination therapy','同时使用多个 treatment mechanism 的策略。','uiucMcb466')],
        check:['一个 isolate 带有已知 resistance gene，能否完全替代 phenotypic susceptibility test？','不能。Gene expression、allele integrity、background 与未覆盖 mechanism 都会影响 phenotype；两类 evidence 互补。'],
        sources:['cdcAntibioticResistance','uiucMcb438','uiucMcb466'], prereq:['j02','j03','e04'], core:'Evolution / 演化',
        flow:[['Drug','target vulnerability'],['Population effect','inhibit/kill'],['Selection','resistant fraction 上升'],['Outcome','exposure + host + pathogen']]
      }),
      chapter({
        id:'j07', title:'Infectious-disease evolution、spillover 与 biosecurity', subtitle:'传播是 host、pathogen、behavior 与 environment 的系统性质；R₀ 不是 pathogen 的固定身份证。',
        intuition:'一次 outbreak 像火在连接网络中传播：spark 的特性重要，房间布局、可燃物、通风和灭火行动同样决定结果。',
        mental:'画 susceptible → infected → recovered/removed 的最小模型，再把 contact network、vector、animal reservoir、season 与 intervention 加在 transition rate 上。',
        mechanism:'Basic reproduction number R₀ 是特定全 susceptible population 与条件下一个 case 平均造成的 secondary case 数；effective reproduction number 随 immunity 和 behavior 变化。Transmission bottleneck 决定多少 variant 进入新 host。Spillover 需要 reservoir exposure、entry compatibility、within-host replication 与 onward transmission 多道 barrier。Virulence evolution 受 transmission–damage trade-off、within-host competition 与 intervention 影响，没有必然“越来越温和”。One Health 把 human、animal 与 environment surveillance 联结。Biosecurity 同时考虑 accidental release、misuse risk、dual-use information 与 proportionate safeguard。',
        evidence:'Incidence、contact tracing、serology、genomic phylogeny 与 animal/environment sampling 提供不同视角。Genome similarity 能支持 transmission cluster，但 unsampled intermediary 与 within-host diversity 限制直接传播方向。Model output 依赖 under-reporting、generation interval 与 behavior assumption。',
        project:'Outbreak model 要报告 time-varying parameter、data delay、ascertainment 与 uncertainty，不把 forecast 当确定未来。Pathogen sequence release 与 experiment description 需兼顾 open science、privacy、biosafety 和 misuse risk；risk mitigation 应与具体 hazard 相称。',
        pitfall:'R₀ 大于 1 不是永恒属性；population density、behavior、immunity、vector 与 intervention 改变时 effective spread 会变化。',
        terms:[term('Basic reproduction number','全 susceptible 等假设条件下一个 infection 平均产生 secondary infection 的数目。','whoOneHealth'),term('Transmission bottleneck','pathogen 从一个 host 传到下一个 host 时通过的有限 founding population。','uiucMcb438'),term('Spillover','pathogen 从 reservoir host 跨到新 host population 的事件或过程。','whoOneHealth'),term('One Health','联合考虑 human、animal 与 environment health 的协作框架。','whoOneHealth'),term('Biosecurity','降低 biological material、technology 或 information 被误用造成 harm 的措施。','uiucAdvanced')],
        check:['两个 patient 的 viral genome 完全相同，能否证明 A 直接传给 B？','不能。可能存在未采样中间传播者或低多样性 outbreak；还需时间、接触与流行病学证据。'],
        sources:['whoOneHealth','uiucMcb438','uiucAdvanced'], prereq:['j03','e02','e03','r04'], core:'Systems / 系统',
        flow:[['Reservoir/exposure','跨越生态界面'],['Within host','复制与 bottleneck'],['Between hosts','contact network'],['Control','surveillance + intervention']]
      }),
      chapter({
        id:'j08', title:'Pharmacology：dose、exposure、target 与 therapeutic window', subtitle:'给了多少 drug、body 看到了多少、target 占了多少、产生多少 effect 是四个不同问题。',
        intuition:'Medication 像把讯息送到特定房间。Swallowed dose 只是寄出数量；absorption、distribution、metabolism 与 excretion 决定目标 tissue 实际收到多少。',
        mental:'画 dose → plasma concentration over time → tissue/free concentration → target occupancy → pathway effect → clinical outcome。把 adverse effect 作为并行输出。',
        mechanism:'Pharmacokinetics 描述 body 对 drug 的 absorption、distribution、metabolism 和 excretion；Cmax、AUC、half-life 与 clearance 总结 exposure。Pharmacodynamics 描述 concentration 与 biological effect；potency 是达到给定 effect 所需 concentration 尺度，efficacy 是可达到的 maximum effect。Agonist、antagonist、partial agonist 与 allosteric modulator 改变 receptor state 的方式不同。Therapeutic window 比较有效与有害 exposure；protein binding、active metabolite、tissue barrier、genetic variation 与 drug–drug interaction 会改变个体 response。',
        evidence:'Plasma measurement 是 exposure proxy，不一定等于 target tissue free concentration。Dose-escalation、biomarker、target engagement 与 clinical endpoint 分层建立链条。Randomized trial 估计 intervention effect，但 adherence、dropout、endpoint definition 与 subgroup multiplicity 影响解释。Preclinical cell EC50 不能直接当 human dose。',
        project:'药物数据要分 dose、concentration、time、adherence、co-medication 与 outcome。Dose–response model 避免把每个 time point 当独立 person；precision-medicine predictor 需外部 validation，并报告 calibration 和 treatment interaction，而不只是 prognostic accuracy。',
        pitfall:'Potent 不等于 better：低 concentration 就有效的 drug 仍可能 efficacy 小、selectivity 差、exposure 不足或 toxicity 高。',
        terms:[term('Pharmacokinetics','研究 body 如何改变 drug concentration over time 的框架。','uiucMcb466'),term('Pharmacodynamics','研究 drug exposure 与 biological effect 关系的框架。','uiucMcb466'),term('Potency','产生给定 effect 所需 concentration 或 dose 的相对尺度。','uiucMcb466'),term('Efficacy','在给定 system 中 treatment 可产生的最大 response。','uiucMcb466'),term('Therapeutic window','有效 exposure 与不可接受 toxicity exposure 之间的可用范围。','fdaDrugDevelopment')],
        check:['Drug A 的 EC50 更低，是否一定比 Drug B 更适合患者？','不一定。还要比较 maximum efficacy、selectivity、PK、tissue access、toxicity 与临床目标。'],
        sources:['uiucMcb466','fdaDrugDevelopment','uiucBiop401'], prereq:['z03','z04','w09','l01'], core:'Systems / 系统',
        flow:[['Dose','给药量'],['Exposure','PK over time'],['Target effect','occupancy + PD'],['Outcome','benefit + toxicity']]
      })
    ]
  });

  addCourse({
    code:'22',
    title:'Organismal Biology & Behavior',
    description:'补上 UIUC IB 202、IB 303、IB 329 等 non-plant organismal core：用 comparative anatomy、biomechanics、behavior 与 life history 把 molecule/cell 接回完整 animal。',
    chapters:[
      chapter({
        id:'y01', title:'Comparative anatomy：body plan、homology 与 functional constraint', subtitle:'比较结构不是背器官名单，而是问共同历史怎样被不同功能需求改造。',
        intuition:'Animal body 像从共同祖先留下的建筑框架不断翻修。新用途通常在旧结构上修改，因此“为什么这样长”同时需要 evolutionary history 与 current function。',
        mental:'选一个结构，画 position、material、connection 与 movement，再跨 species 对齐 origin。分别标 homology、analogy 与可能的 developmental constraint。',
        mechanism:'Body plan 由 symmetry、germ layer、body cavity、segmentation 与 appendage organization 等特征描述。Homologous structure 来自共同祖先，功能可高度分化；analogous structure 功能相似却独立演化。Serial homology 在同一 body 重复使用 developmental module。Tissue material、vascular/nerve supply 与 joint geometry 限制 function。Allometry 描述 body part 随 overall size 的非等比例变化。结构 adaptation 受现有 anatomy、development 与 trade-off 约束，不是从零设计。',
        evidence:'Dissection、histology、medical imaging、fossil、embryology 与 phylogeny 共同测试结构关系。只比较 adult appearance 容易把 convergence 当 homology；developmental origin 与 anatomical connection 提供额外证据。Form–function claim 应结合 biomechanics 或 performance measurement。',
        project:'跨物种 image/omics 分析先建立 anatomical ontology 与 homologous region mapping；同名器官未必直接一一对应。Train/test 需按 species/individual hierarchy，并控制 body size、sex、age 与 phylogenetic non-independence。',
        pitfall:'相似功能不自动表示共同来源；鸟翼与昆虫翼都飞行，但其结构与 evolutionary origin 不同。',
        terms:[term('Body plan','animal body 的基本 spatial organization 与 repeated structural pattern。','uiucIbCatalog'),term('Homology','因共同 ancestry 而对应的 structure 或 trait。','uiucIb303'),term('Analogy','因相似 function/selection 独立演化出的相似 feature。','uiucIb303'),term('Allometry','biological feature 随 body size 以非等比例方式变化的关系。','osAnimalForm'),term('Comparative anatomy','跨 organism 比较 structure、origin 与 function 的研究。','uiucIb303')],
        check:['两种动物都有“翅膀”，能否直接把 wing 当作 homologous structure？','不能。要看共同祖先、内部 anatomy 与 developmental origin；功能相同可来自 convergence。'],
        sources:['uiucIb303','uiucIbCatalog','osAnimalDiversity'], prereq:['e01','h01','v01'], core:'Evolution / 演化',
        flow:[['Body plan','共同 structural scaffold'],['Variation','lineage modification'],['Constraint','material + development'],['Function','performance in context']]
      }),
      chapter({
        id:'y02', title:'Biomechanics、scaling 与 locomotion', subtitle:'Force、material 与 body size 决定 movement；大动物不是小动物的等比例放大。',
        intuition:'把 animal 当成会主动发力的物理结构。Muscle 产生 force，skeleton/transmission 改变方向，environment 提供 resistance；size 改变后这些量不会同比例变化。',
        mental:'画 actuator → lever/joint → body/environment → motion/heat。再把 linear dimension 放大两倍，比较 length、area 和 volume 怎样 scaling。',
        mechanism:'Muscle force 近似与 physiological cross-sectional area 相关，而 body mass 与 volume scaling；因此大型 organism 需要改变 posture、bone proportion 与 gait。Lever arm 决定 force 与 speed/range trade-off。Elastic tissue 可储存和返还 energy，tendon 与 exoskeleton 的 material property 影响 performance。Walking、running、swimming 与 flying 面对 gravity、drag、buoyancy 与 inertia 的不同组合。Dimensionless number 可帮助跨 size 比较相似 dynamic regime。Movement 同时依赖 neural control、sensory feedback 与 metabolic supply。',
        evidence:'Force plate、motion capture、electromyography、respirometry 与 high-speed video 测不同层级。Kinematic correlation 不等于某 muscle 产生了 movement；需 force、activation timing 或 perturbation。Laboratory treadmill behavior 可能不同于 natural terrain。',
        project:'Trajectory data 先校准 pixel-to-distance、frame rate 与 coordinate；把 step 嵌套在 trial、individual 和 species。比较速度要考虑 body length 与 gait transition；深度学习 pose estimate 必须检查 occlusion、domain shift 与 anatomical landmark error。',
        pitfall:'把 length、area、volume 都乘同一比例会产生错误直觉；length ×2 时 area ×4、volume ×8。',
        terms:[term('Biomechanics','用 force、motion 与 material principle 研究 biological structure/function 的领域。','osMusculoskeletal'),term('Scaling','system property 随 size 改变的关系。','osAnimalForm'),term('Lever arm','force line 到 rotation axis 的 perpendicular distance。','osMusculoskeletal'),term('Elastic energy storage','material deformation 时暂存并随后释放 mechanical energy。','osMusculoskeletal'),term('Locomotion','organism 主动改变 body position 的 movement。','uiucIbCatalog')],
        check:['两种动物跑速相同，是否表示 locomotor performance 完全可比？','不一定。Body size、stride、terrain、energy cost 与 acceleration capacity 都可能不同。'],
        sources:['osMusculoskeletal','osAnimalForm','uiucIbCatalog'], prereq:['y01','h04','n03'], core:'Structure & Function / 结构与功能',
        flow:[['Force','muscle/elastic tissue'],['Transmission','lever + skeleton'],['Environment','gravity/drag'],['Movement','kinematics + energy cost']]
      }),
      chapter({
        id:'y03', title:'Animal behavior：proximate 与 ultimate explanation', subtitle:'同一行为既要问“此刻怎样产生”，也要问“为何在 evolutionary history 中存在”。',
        intuition:'鸟在特定时间迁徙，可以同时由 hormone、day length 和 neural circuit 触发，也可以因过去提高 survival/reproduction 而被保留；两类解释互补，不互相替代。',
        mental:'用 Tinbergen 四问组织任何 behavior：mechanism、development、function、phylogeny。把当前 cause 与 evolutionary explanation 分开写。',
        mechanism:'Proximate mechanism 包括 sensory input、neural/endocrine state、motor output 与 immediate environment；ontogeny 关注 gene、development 与 experience 如何形成 behavior。Ultimate explanation 包括 behavior 对 survival/reproduction 的 contribution 与它在 phylogeny 中怎样演化。Innate 与 learned 不是严格二分：genetic predisposition、sensitive period、social learning 和 reinforcement 可共同塑造表现。Internal state 如 hunger、stress 与 reproductive state 改变同一 stimulus 的 response。',
        evidence:'Controlled playback、choice test、cross-fostering、hormone/neural perturbation、field observation 与 comparative method 回答不同问题。Captive behavior 可能受 enclosure 与 habituation 影响；observer expectation 需要 blinding 与 explicit ethogram。一次行为事件不是个体固定 personality。',
        project:'先写 ethogram 与 event definition，再 annotation video。避免把 frame 当独立 replicate；用 bout、trial、individual 层级建模。Classifier accuracy 需按 individual/site split，并检查 rare behavior、annotation agreement 与 context shift。',
        pitfall:'Evolutionary function 不是动物有意识的目的；“为了繁殖”是对 past selection consequence 的 shorthand。',
        terms:[term('Proximate explanation','解释 behavior 当前由哪些 mechanism 与 development 产生。','uiucIb329'),term('Ultimate explanation','解释 behavior 的 evolutionary function 与 history。','uiucIb329'),term('Ethogram','一套可操作定义的 behavior category 与 observation rule。','uiucIb329'),term('Sensitive period','experience 对 development 有特别强影响的时间窗口。','uiucIb329'),term('Behavioral plasticity','同一 organism 随 context 或 experience 改变 behavior 的能力。','uiucIb329')],
        check:['发现某 hormone 在 aggression 前升高，能否完整解释这种行为为何存在？','不能。它提供 proximate mechanism 线索；evolutionary function/history 是另一层问题。'],
        sources:['uiucIb329','uiucIbCatalog','osPopulationEcology'], prereq:['n03','n05','e04'], core:'Systems / 系统',
        flow:[['Stimulus + state','当前输入'],['Mechanism','neural/endocrine'],['Behavior','可观察 action'],['Consequence/history','function + evolution']]
      }),
      chapter({
        id:'y04', title:'Behavioral ecology：decision、trade-off 与 strategy', subtitle:'Behavior 不是全局最优算法，而是在信息、energy、risk 与 evolutionary constraint 下的策略。',
        intuition:'Foraging animal 像资源有限、地图不完整的决策者：多找食物可增加 energy，也增加暴露时间；最合适选择取决于当下 state 与 competitors。',
        mental:'画 action A/B → benefit、cost、risk、future state；再加其他个体的 strategy，让 payoff 随 population frequency 改变。',
        mechanism:'Optimality model 明确 currency、choice 与 constraint，产生可检验 prediction，而不是声称 organism 完美。Marginal value、predation risk、handling time 与 information quality 影响 foraging。Game theory 中某 strategy payoff 取决于 others；evolutionarily stable strategy 在一定条件下不易被 rare alternative 入侵。Kin selection 与 inclusive fitness 解释帮助 relative 的 behavior 如何间接传递 shared allele，但 relatedness、benefit 与 cost 都重要。Sexual selection、parental investment 与 conflict 形成多样 mating/social strategy。',
        evidence:'Field manipulation、resource patch experiment、predator cue、longitudinal fitness 与 pedigree 测不同 link。Observed choice 接近 model prediction 不证明 animal 计算同一公式；model 是 functional approximation。Alternative currency 与 unmeasured constraint 需比较。',
        project:'行为模型先定义 decision unit 与 available option，避免用 observer 事后知道的信息当 animal 当时 input。Social network node 不独立，permutation/hierarchical model 要保留 group。Association 不等同 interaction，更不自动等于 cooperation。',
        pitfall:'“Optimal”只是在 model 定义的 currency 与 constraint 下，不表示最好、理性或没有历史限制。',
        terms:[term('Behavioral ecology','研究 behavior 如何在 ecological/evolutionary context 中影响 fitness 的领域。','uiucIb329'),term('Optimality model','在明确 currency 与 constraint 下预测 strategy 的 model。','uiucIb329'),term('Evolutionarily stable strategy','在特定 game 条件下不易被 rare alternative strategy 入侵的策略。','uiucIb329'),term('Inclusive fitness','包含自身繁殖与对 relative 繁殖影响的 evolutionary accounting。','uiucIb329'),term('Parental investment','提高 offspring success、同时限制 parent 其他投资机会的资源投入。','uiucIb329')],
        check:['某行为符合 optimal-foraging prediction，能否说动物在脑中求解了该数学公式？','不能。Model 描述 outcome-level prediction，不等于真实 cognitive algorithm。'],
        sources:['uiucIb329','osPopulationEcology','uiucIbCatalog'], prereq:['y03','e04','r04'], core:'Evolution / 演化',
        flow:[['State + information','decision context'],['Options','可选 behavior'],['Trade-offs','energy/risk/time'],['Fitness consequence','strategy frequency 改变']]
      }),
      chapter({
        id:'y05', title:'Communication、sensory ecology、navigation 与 learning', subtitle:'Signal 只有在 sender、medium、receiver 与 context 连成系统时才有意义。',
        intuition:'Communication 不是把信息直接倒进另一个脑中。Sender 改变声、光、化学或动作，signal 穿过有噪声的环境，receiver 依据感官能力和经验做 response。',
        mental:'画 sender → signal production → environment/filter → sensory receptor → neural interpretation → response → feedback，并在每个箭头标 noise 与 alternative cue。',
        mechanism:'Signal 在 evolution 中被 sender–receiver interaction 塑造，cue 则可被 receiver 利用却不必为 communication 而产生。Acoustic、visual、chemical、电与 tactile modality 受传播环境限制；sensory ecology 问 organism 能感到的世界。Honest signal 可由 production cost、constraint 或 shared interest 维持，deception 受 frequency 与 receiver counter-adaptation 限制。Navigation 可整合 landmark、sun/star compass、magnetic cue、odor 与 path integration。Habituation、conditioning、imprinting 与 social learning 改变 response，但 generalization 与 memory cost 有边界。',
        evidence:'Playback、signal manipulation、sensory blocking、displacement 与 tracking 检验 causal cue。Human-visible color/听觉范围不等于研究 species 的 sensory space；camera 和 microphone 也有 frequency/spectral bias。Learning 要与 fatigue、sensory adaptation 和 maturation 区分。',
        project:'Bioacoustics 或 tracking pipeline 保留 detector sensitivity、sampling rate、location uncertainty 与 missingness。训练 signal classifier 时按 recording/site/individual split；background habitat 可泄漏 species label。Automated detection threshold 影响 apparent activity pattern。',
        pitfall:'Receiver 对一个 stimulus 有反应，不足以称它为 communication signal；要说明 sender production、context 与 evolved function。',
        terms:[term('Biological signal','在 evolution 中因影响 receiver behavior 而被塑造的 sender trait/action。','uiucIb329'),term('Cue','receiver 可利用、但不一定因 communication function 而演化的信息来源。','uiucIb329'),term('Sensory ecology','研究 sensory system 与 organism environment/behavior 相互关系的领域。','uiucIb329'),term('Path integration','整合自身 movement 来估计相对起点位置的 navigation mechanism。','uiucIb329'),term('Social learning','通过观察或 interaction with others 获得 behavior/information 的过程。','uiucIb329')],
        check:['一段声音使 receiver 转头，是否已经证明它是 species-specific mating signal？','没有。需比较 context、sender、receiver group、alternative cue 与后续 mating-related response。'],
        sources:['uiucIb329','osSensory','ncbiNeuroscience'], prereq:['y03','n02','n05'], core:'Information Flow / 信息流',
        flow:[['Sender','产生 signal'],['Environment','传播 + noise'],['Receiver','sense + interpret'],['Response','behavior + feedback']]
      }),
      chapter({
        id:'y06', title:'Organism–environment integration：acclimation、adaptation 与 life history', subtitle:'短期 regulation、个体 acclimation、developmental change 与 population adaptation 发生在不同时间尺度。',
        intuition:'面对 temperature、food 或 oxygen 改变，organism 可立即调节 physiology、在数天内 acclimate、在发育中形成不同 phenotype，或让 population 跨世代 evolution；这些不能混成一个“适应”。',
        mental:'画秒–小时、天–周、lifetime、generation 四条时间轴，分别放 homeostatic response、acclimation、developmental plasticity 与 genetic adaptation。',
        mechanism:'Homeostasis 用 sensor、controller 与 effector 快速限制 internal variable 波动。Acclimation 是个体在新环境下可逆或持久的 physiological adjustment；developmental plasticity 让早期 environment 改变 later phenotype。Adaptation 是 natural selection 形成、提高特定环境 fitness 的 heritable trait。Life-history trait 包括 growth、maturation、offspring number/size 与 lifespan，energy allocation 产生 trade-off。Phenotypic plasticity 本身有 cost、limit 与 genetic variation；reaction norm 描述 genotype 在多个 environment 的 phenotype。',
        evidence:'Common-garden、reciprocal transplant、cross-fostering、reaction-norm experiment 与 multigeneration selection 分开 environment 与 inheritance。一次 field difference 不能说明 genetic adaptation，因为 maternal effect、age、diet 与 prior exposure 都可能造成。',
        project:'多环境 omics 要记录 exposure history、developmental stage 与 sampling time；acute stress signature 不等于 evolved adaptation。G×E model 需每个 genotype/environment 有足够 independent unit。做 climate/health prediction时区分 within-individual response 与 population turnover。',
        pitfall:'中文“适应”常同时指 acclimation 和 evolutionary adaptation；项目中必须用时间尺度与可遗传性明确区分。',
        terms:[term('Acclimation','individual 在新 environmental condition 下产生的 physiological/phenotypic adjustment。','uiucIbCatalog'),term('Evolutionary adaptation','由 natural selection 形成并在特定环境提高 fitness 的 heritable trait。','osEvolution'),term('Phenotypic plasticity','同一 genotype 在不同 environment 产生不同 phenotype 的能力。','uiucIbCatalog'),term('Reaction norm','一个 genotype 在一组 environment 下 phenotype 的函数关系。','uiucIbCatalog'),term('Life-history strategy','growth、reproduction 与 survival timing/allocation 的 trait 组合。','osPopulationEcology')],
        check:['鱼转入低氧水后一周提高某 protein expression，这是否证明 species 已 evolutionary adaptation？','不能。这更可能是 individual acclimation；adaptation 需要跨世代遗传与 fitness evidence。'],
        sources:['uiucIbCatalog','osEvolution','osPopulationEcology'], prereq:['h01','e04','y03'], core:'Systems / 系统',
        flow:[['Environment','temperature/food/oxygen'],['Timescale','seconds to generations'],['Response','regulation/plasticity/evolution'],['Performance','survival + reproduction']]
      })
    ]
  });
})();
