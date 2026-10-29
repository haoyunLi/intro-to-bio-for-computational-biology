/* Original methods extension: source-checked explanations with synthetic arithmetic. */
(() => {
  'use strict';
  const sources = {
    smEmpty: ['DropletUtils · EmptyDrops and barcode-rank workflow', 'https://bioconductor.org/packages/release/bioc/vignettes/DropletUtils/inst/doc/DropletUtils.html'],
    smSoup: ['SoupX · Method, inputs and contamination estimation', 'https://github.com/constantAmateur/SoupX'],
    smBender: ['CellBender · Background-removal workflow and QC', 'https://cellbender.readthedocs.io/en/latest/usage/index.html'],
    smDoublet: ['scDblFinder · Capture-aware detection, classifier and expected rate', 'https://bioconductor.org/packages/release/bioc/vignettes/scDblFinder/inst/doc/scDblFinder.html'],
    smHVG: ['Scanpy · HVG flavors and input-scale requirements', 'https://scanpy.readthedocs.io/en/stable/generated/scanpy.pp.highly_variable_genes.html'],
    smNeighbors: ['Scanpy · Neighbor graph parameters and representations', 'https://scanpy.readthedocs.io/en/stable/api/generated/scanpy.pp.neighbors.html'],
    smHarmony: ['Harmony · Correction and diversity parameters', 'https://portals.broadinstitute.org/harmony/reference/RunHarmony.html'],
    smIntegrate: ['Seurat v5 · Comparing integration methods and unintegrated analysis', 'https://satijalab.org/seurat/articles/seurat5_integration'],
    smSCVI: ['scvi-tools · Count data registration, training and latent representation', 'https://docs.scvi-tools.org/en/stable/tutorials/notebooks/quick_start/api_overview.html'],
    smMap: ['Seurat · Mapping and annotating query datasets', 'https://satijalab.org/seurat/articles/integration_mapping'],
    smSCANVI: ['scvi-tools · scANVI semi-supervised model', 'https://docs.scvi-tools.org/en/stable/user_guide/models/scanvi.html'],
    smMilo: ['miloR · Differential abundance with overlapping neighborhoods', 'https://marionilab.github.io/miloR/articles/milo_demo.html'],
    smCODA: ['scCODA · Compositional analysis and model documentation', 'https://sccoda.readthedocs.io/en/latest/'],
    smSlingshot: ['Slingshot · Cluster lineages, principal curves and pseudotime', 'https://www.bioconductor.org/packages/release/bioc/vignettes/slingshot/inst/doc/vignette.html'],
    smWNN: ['Seurat · Weighted Nearest Neighbor analysis for multimodal data', 'https://satijalab.org/seurat/articles/weighted_nearest_neighbor_analysis'],
    smATAC: ['Signac · scATAC-seq QC, TF-IDF and LSI workflow', 'https://stuartlab.org/signac/articles/pbmc_vignette'],
    smTFIDF: ['Signac · Four TF-IDF definitions', 'https://stuartlab.org/signac/reference/runtfidf']
  };
  Object.assign(window.BIOCS_SOURCES, sources);
  const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const p = s => `<p>${s}</p>`;
  const ol = items => `<ol>${items.map(v=>`<li>${v}</li>`).join('')}</ol>`;
  const code = s => `<pre><code>${esc(s)}</code></pre>`;
  const text = (x,y,s,size=17,color='#17385f',anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
  const line = (x1,y1,x2,y2,color='#315f91',width=2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
  const rect = (x,y,w,h,color='#dce9f8') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${color}" stroke="#91adc8"/>`;
  const circle = (x,y,r,color='#235b98') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
  const fig = (id,title,body,description) => `<figure class="concept-figure"><div role="region" tabindex="0" aria-label="${esc(title)}（可横向滚动）" style="overflow-x:auto"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc" viewBox="0 0 640 330" style="display:block;width:100%;min-width:640px;font-family:system-ui,sans-serif"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(description)}</desc>${body}</svg></div><figcaption>原创 synthetic example · ${description} 图内可横向滑动，手算过程见 worked example。</figcaption></figure>`;
  const term = (a,b,c,d,e) => [a,b,c,d,e];
  const math = {
    ambient:(total,rho,profile)=>profile.map(q=>total*rho*q),
    heterotypic:fractions=>1-fractions.reduce((s,f)=>s+f*f,0),
    jaccard:(a,b)=>{const x=new Set(a),y=new Set(b);const union=new Set([...x,...y]);return union.size?[...x].filter(v=>y.has(v)).length/union.size:1;},
    ridgeShift:(observedShift,lambda)=>observedShift/(1+lambda),
    mappingScores:distances=>{const min=Math.min(...distances),w=distances.map(d=>Math.exp(-(d-min)));const total=w.reduce((a,b)=>a+b,0);return w.map(v=>v/total);},
    neighborhoodCounts:(sets,samples,levels)=>sets.map(set=>levels.map(level=>set.filter(id=>samples[id]===level).length)),
    pathTime:(positions,reverse=false)=>{const lo=Math.min(...positions),hi=Math.max(...positions);return hi===lo?positions.map(()=>0):positions.map(x=>reverse?(hi-x)/(hi-lo):(x-lo)/(hi-lo));},
    affinity:(rna,protein,w)=>rna.map((v,i)=>w*v+(1-w)*protein[i])
  };
  window.BIOCS_SINGLECELL_METHODS_MATH=math;
  const figures={};
  figures.sc13=fig('sc13','Ambient mixture 要从总 count 和 background profile 一起算',
    text(25,30,'Known toy mixture: total = 1000; contamination fraction = 0.10')+
    text(30,76,'Gene')+text(150,76,'Observed')+text(310,76,'Ambient expected')+text(510,76,'Residual')+
    [['G1',120,60,60],['G2',80,30,50],['G3',800,10,790]].map((r,i)=>text(30,123+i*54,r[0])+text(170,123+i*54,r[1])+text(355,123+i*54,r[2])+text(535,123+i*54,r[3])).join('')+
    line(25,259,610,259)+text(25,290,'1000 − 100 = 900; expected subtraction is not a fitted correction.',16)+text(25,315,'Background profile = [0.6, 0.3, 0.1], sums to 1.',16),
    '在已知toy contamination fraction 0.10下，1000×0.10×[.6,.3,.1]=[60,30,10]；从[120,80,800]减去得到[60,50,790]，总量900。真实方法必须估计这些量。');
  figures.sc14=fig('sc14','总 doublets 与可由不同类型混合识别的部分不同',
    text(25,30,'1000 called barcodes; hypothetical total doublet fraction = 0.06')+
    text(25,72,'Two types: 80% / 20%; random independent pairing')+
    rect(40,118,179.2,60,'#8eb7e3')+rect(219.2,118,380.8,60,'#e2e7ed')+
    text(129.6,154,'19.2',21,'#17385f','middle')+text(409.6,154,'40.8',21,'#17385f','middle')+
    text(40,214,'Heterotypic: 2 × 0.8 × 0.2 = 0.32',17)+text(40,248,'Homotypic: 0.8² + 0.2² = 0.68',17)+
    text(25,301,'60 expected doublets ≠ 60 easily separable mixed profiles.',17),
    '假设doublets完全随机配对，heterotypic比例为.32，60个expected doublets中约19.2个heterotypic、40.8个homotypic。这是期望值，不是barcode数可以为小数或检测器准确率。');
  figures.sc15=fig('sc15','用 neighbor overlap 检查参数改变了多少局部结构',
    text(25,30,'Same query Q, same k=4, two representations')+
    text(25,88,'Run A')+['a','b','c','d'].map((s,i)=>rect(145+i*110,57,90,48,i<2?'#c3ddf0':'#efdfcb')+text(190+i*110,88,s,20,'#17385f','middle')).join('')+
    text(25,164,'Run B')+['a','b','e','f'].map((s,i)=>rect(145+i*110,133,90,48,i<2?'#c3ddf0':'#d5eade')+text(190+i*110,164,s,20,'#17385f','middle')).join('')+
    text(25,228,'Intersection = {a,b}: 2; union = {a,b,c,d,e,f}: 6',17)+text(25,272,'Jaccard = 2 / 6 = 0.333',23)+text(25,312,'Stability compares runs; it does not establish biological truth.',16),
    '同一query在两套representation中各有4个neighbors；共同2个、总共6个，Jaccard=1/3。这个低overlap提示局部结论敏感，不能靠更好看的UMAP决定哪次正确。');
  figures.sc16=fig('sc16','Regularization 改变 correction strength',
    text(25,30,'Toy ridge loss: (shift − 10)² + λ × shift²')+
    text(25,77,'λ')+text(150,77,'Estimated shift')+text(390,77,'Remaining offset')+
    [0,1,9].map((v,i)=>{const shift=math.ridgeShift(10,v);return text(25,127+i*61,String(v))+text(182,127+i*61,shift.toFixed(1))+rect(390,101+i*61,(10-shift)*20,32)+text(585,126+i*61,(10-shift).toFixed(1));}).join('')+
    text(25,312,'A one-parameter teaching model, not the full Harmony algorithm.',16),
    '对loss求导得到shift=10/(1+λ)；λ=0、1、9分别校正10、5、1，剩余offset为0、5、9。这里没有生物标签，因此不能把最大校正自动称作最好。');
  figures.sc17=fig('sc17','相同的 top score，可以来自近邻，也可以来自很远的对象',
    text(25,30,'Toy score: exp(−distance), normalized across two known labels')+
    text(25,82,'Query')+text(180,82,'Distances to A / B')+text(440,82,'Top score')+
    text(25,138,'Q-near')+text(205,138,'0.1 / 1.1')+text(477,138,'0.731')+
    text(25,201,'Q-far')+text(205,201,'10 / 11')+text(477,201,'0.731')+
    line(25,233,610,233)+text(25,270,'Distance gap = 1 in both; absolute distance is discarded.',17)+text(25,311,'A classifier restricted to A/B cannot invent a missing class C.',16),
    '两组distances的差均为1，归一化exp(−distance)都给A约.731。Q-far离两类都远；仅凭top score无法保证reference覆盖或新类型可识别。不是Seurat或scANVI的精确打分公式。');
  figures.sc18=fig('sc18','重叠 neighborhoods 产生重复 memberships，不会增加 donors',
    text(25,30,'Four observed cells: a,b from S1; c,d from S2')+
    ['a','b','c','d'].map((s,i)=>circle(140+i*120,94,20,i<2?'#2c63a3':'#167768')+text(140+i*120,100,s,18,'#fff','middle')+text(140+i*120,138,i<2?'S1':'S2',16,'#17385f','middle')).join('')+
    text(25,192,'N1 = {a,b,c}')+text(300,192,'Counts: S1=2, S2=1')+
    text(25,237,'N2 = {b,c,d}')+text(300,237,'Counts: S1=1, S2=2')+
    text(25,292,'6 memberships; 4 cells; 2 samples.',22)+text(25,318,'This illustrates counting only; two samples do not fit reliable DA.',15),
    'N1与N2共享b和c；sample×neighborhood counts为N1=[2,1]、N2=[1,2]。六次成员归属不是六个独立cells，更不是六个donors。正式检验需要复制、design和overlap-aware multiplicity。');
  figures.sc19=fig('sc19','改变 root 可以反转 pseudotime，不能反转真实钟表时间',
    text(25,30,'Toy line: positions = [0,1,3,6]; arc-length normalization')+
    line(70,112,570,112)+[0,1,3,6].map((x,i)=>circle(70+x*500/6,112,7)+text(70+x*500/6,85,String(x),18,'#17385f','middle')).join('')+
    text(25,178,'Root at 0:')+text(210,178,'0, 0.167, 0.500, 1.000',20)+
    text(25,226,'Root at 6:')+text(210,226,'1.000, 0.833, 0.500, 0',20)+
    text(25,283,'Direction needs external evidence; spacing is not hours.',18)+text(25,315,'A trajectory orders sampled states; it is not a recorded lineage.',16),
    '先把各位置减去0并除6；root改成6后用(6−x)/6。排序方向由root决定，同一expression geometry可支持两种方向。此图是直线手算，不是Slingshot完整拟合。');
  figures.sc20=fig('sc20','每个 modality 先有自己的尺度，再组合邻域证据',
    text(25,30,'Toy combined affinity = w × RNA + (1−w) × ADT')+
    text(25,78,'Candidate A: RNA=.9, ADT=.1; B: RNA=.2, ADT=.8',17)+
    [[.8,.74,.32],[.2,.26,.68]].map((r,i)=>text(25,143+i*88,`w=${r[0]}`)+rect(145,117+i*88,r[1]*400,24,'#a4c5e8')+text(455,137+i*88,`A=${r[1]}`,16)+rect(145,150+i*88,r[2]*400,24,'#afd8ca')+text(455,170+i*88,`B=${r[2]}`,16)).join('')+
    text(25,315,'A weighted-affinity illustration, not WNN’s learned-weight formula.',16),
    'RNA weight为.8时A=.74、B=.32；变.2时A=.26、B=.68，邻居偏好翻转。真实WNN从数据学习cell-specific modality weights，不能把这里的手选w当输出。');

  const chapters = [
    {
      id:'sc13',title:'EmptyDrops、SoupX 与 CellBender：先区分没有 cell 和 cell 里混入 RNA',subtitle:'Barcode calling 与 background correction 是两次不同的判断。',
      intuition:['一杯水可能根本没有茶叶，也可能有茶叶但混入别人的茶。判定杯中是否有cell，与估计某个gene的污染量，不是同一个问题。','Input需要capture对应的raw barcode counts与QC；Output分别是called barcodes、background estimates和有明确来源的corrected counts。'],
      core:'Droplet calling & contamination',prereq:['sc01','sc02'],goals:['区分calling与correction的null和输出','手算ambient mixture并检查守恒','按background证据选方法及检查过度校正'],
      sections:[
        ['先手算一个已知 mixture',figures.sc13+p('本图故意把contamination fraction ρ和ambient profile b当已知。某gene的ambient expected count为N×ρ×b_g；N是该barcode总count，b各gene份额加起来为1。真实数据只观察总counts，不能直接知道每个molecule来自哪里。逐项减期望是理解模型的算术，不是推荐手写的去污染pipeline；估计误差可能导致负值、过度删除或不合理的小数。'),['smSoup','smBender']],
        ['三个方法分别在问什么',p('EmptyDrops比较barcode的expression profile是否与ambient pool相容，让一些低总量但composition独特的cells有机会保留；它不是只按UMI cutoff划线，也不直接给每gene去污染。SoupX利用raw droplets、called cells及合理的nonexpressing markers/cluster信息估计污染。CellBender用生成模型分离background与cell-associated信号，提供模型诊断；需要合理的raw droplets输入与更多计算。三者的任务有交集，但不应把三个输出依次盲目叠加并认为越处理越干净。'),['smEmpty','smSoup','smBender']],
        ['从输入到可审查结果的六步',ol(['保留每capture的raw与filtered矩阵；raw中的低count barcodes是background信息，不能先丢完再假装仍有完整输入。','画barcode-rank曲线，检查空液滴区和knee/inflection；确认low-count区域是否被真实low-RNA cells污染。','先声明calling与background-removal分别由哪个工具负责，避免把另一工具的filtered矩阵误当raw。','拟合后同时保存原始counts、corrected layer、cell calls、contamination估计、随机seed和versions。','比较每capture和cell type的总量移除比例，检查known negative markers与应保留的positive markers。','以未校正及合理设置变化为sensitivity baseline；若主要结果只在极强校正后出现，回看模型假设与实验质量。']),['smEmpty','smSoup','smBender']],
        ['参数怎样开始，什么时候调整',p('EmptyDrops的low-count pool范围应由该capture的rank曲线和组织背景决定；FDR是calling family内的控制量，不能解释为每个barcode是cell的概率。Monte Carlo受迭代数限制时查看Limited等诊断，再增加模拟次数而非把分辨率下限当精确p。SoupX的ρ需要检查估计依据，marker不特异或类型太单一时自动估计可能不足。CellBender先检查自动推断的cells/empty droplets数量和训练报告，再对expected-cells或noise-removal FPR（更激进时可能错删signal）设置做有记录的敏感性比较；不是照搬另一个组织的数值。'),['smEmpty','smSoup','smBender']],
        ['什么时候值得用，代价与停止条件',p('有明确ambient plateau、跨无关类型出现少量高丰度组织markers时，background模型值得审查。若只有filtered cells、背景来源异质或没有可靠negative marker，识别污染更困难；不要把真实稀有状态全部解释为污染。损坏严重且无法分辨cell/background时，软件不能替代更好的样本制备。优点是降低污染造成的假marker与错误annotation；代价是模型依赖、计算以及可能抹去弱而真实信号。下游分析应声明使用哪个输出layer及其生成方法。')+code('# Known synthetic mixture; not an ambient-removal algorithm.\nobserved <- c(120, 80, 800)\nbackground <- c(0.6, 0.3, 0.1)\nrho <- 0.10\nexpected_ambient <- sum(observed) * rho * background\nresidual <- observed - expected_ambient\nstopifnot(sum(residual) == 900, all(residual >= 0))\nprint(rbind(observed, expected_ambient, residual))'),['smBender','smSoup']]
      ],
      worked:['从1000个observed counts里减去哪100个期望量？',['ρ=.10表示toy mixture里10%属于ambient，expected ambient total=1000×.10=100。','按b=[.6,.3,.1]分给各gene，得到60、30、10。','从observed=[120,80,800]减去，residual=[60,50,790]，总和900。','G1移去50%，G3只移去1.25%；同一ρ不等于每gene都删10%。','ρ和b若估错，所有这些数都会变；真实方法的推断与输出整数规则不由这个手算例子替代。']],
      terms:[term('Empty droplet','未包含完整目标cell但可能含ambient RNA的捕获分区。','smEmpty','总count很低的barcode仍可能有来自组织的RNA。','低count不自动等于empty，calling还依赖composition与assay。'),term('Contamination fraction','模型中一个barcode的RNA由背景贡献的份额参数。','smSoup','N=1000、ρ=.10对应100个expected ambient counts。','不是每个gene都删同样百分比，也不是直接观察到的真值。'),term('Ambient profile','background RNA在genes之间的相对组成向量。','smBender','b=[.6,.3,.1]把100个背景量分成60、30、10。','背景pool可能有偏或异质，需要核对来源与capture。')],
      check:['某barcode的UMI数低但profile明显不同于ambient pool，是否应只因低count删除？','不应只凭总量。先检查EmptyDrops等calling证据及QC，区分低RNA真实cell与异常profile；即使保留，也仍需ambient和doublet审查。'],
      lens:['Raw/filtered barcode matrices、calling evidence、background estimates与correction报告。','一个barcode是捕获分区；expected ambient counts不是逐molecule的已知来源。','Calling不保证singlet；去污染的改善必须由保留真实signal和sensitivity共同评价。',['smEmpty','smSoup','smBender']]
    },
    {
      id:'sc14',title:'Doublet detection：为什么 expected rate、capture 和 cell-type composition 必须一起看',subtitle:'模拟混合profile可以帮助排序，但不能提供全知的双细胞标签。',
      intuition:['把两个声音叠在一起，差别很大时容易听出混合，声音相似时则很难。不同cell types形成的doublet与同型doublet也有类似可识别性差别。','Input是去除明显empty droplets后的counts与capture信息；Output是doublet score、阈值决定和需要追溯的QC记录。'],
      core:'Doublet detection',prereq:['sc02','sc13'],goals:['拆解artificial doublet和classifier流程','手算heterotypic可识别性随composition变化','按capture设置rate并审查过滤偏差'],
      sections:[
        ['先区分总doublets与可分离的mixed profiles',figures.sc14+p('本例假设两个cells随机、独立按类型比例配对，所以P(homotypic)=Σf_t²，P(heterotypic)=1−Σf_t²。真实捕获可能违反随机配对，分类能力也不等于这个概率；这个式子只解释为什么同样loading下，不同组织的可见doublet signal可能不同。Expected 19.2是重复实验的均值，实际一次检测只能输出整数个barcodes。'),['smDoublet']],
        ['scDblFinder 的计算链怎样走',ol(['按物理capture处理：能在同一droplet相遇的cells属于同一个doublet生成环境。','从真实profiles构造artificial doublets，通常考虑不同cell类型混合；数据有清晰群体时可使用cluster-aware模式。','将real和artificial profiles放进合适的低维表示，比较neighbor组成及相关特征。','迭代训练分类器，把疑似real doublets逐步从singlet训练集合排除，减少污染训练目标。','结合分类损失与expected doublet rate等信息选择threshold，保留连续score及最终class。','查看sample/type分布、mixed markers和独立hash/genotype信息；对不稳定边界做sensitivity。']),['smDoublet']],
        ['Capture 不是 donor：multiplexing 怎样设置',p('不同donors若混在同一次capture里，可以形成cross-donor doublets；这时不能因为donor label不同就分开模拟。不同capture的cells通常不可能彼此成为原始droplet doublet。Hashing或genotype demultiplexing可发现一部分cross-donor mixtures，但同donor doublets仍可能遗漏。scDblFinder的samples字段应表达实际capture设计；先画实验装载图，再决定按哪个metadata字段拆分。'),['smDoublet']],
        ['参数、优点和局限怎样报告',p('Expected rate优先用chemistry/loading与回收cells的证据；对标准10x可查看工具自动估计，其他设计须核对相应rate参数。将其作为prior信息而非强制删除固定比例。可比较有依据的low/central/high rate三组，检查被删类型是否集中在rare、activated或高RNA cells。Clear clusters可试cluster-aware模式，连续状态可比较random模式；保持seed与输入QC相同。优点是无需额外assay；局限是homotypic难识别、模拟分布与真实doublets不一定匹配，score也不是跨capture通用的calibrated probability。'),['smDoublet']],
        ['怎样识别过度过滤',p('若某个真实transition群几乎全被删，先查它是否仅因跨群marker共现而被误判；若一个capture的rate异常高，先查empty droplets、异常cells和scale输入。不要为了得到整齐cluster而提高doublet threshold aggressiveness。报告每capture过滤前后数量、各type移除率与关键结论的变化；同时保留unfiltered对象，使决定可复查。')+code('# Random pairing thought experiment, not detector performance.\nfractions <- c(0.8, 0.2)\nexpected_total <- 1000 * 0.06\nheterotypic_fraction <- 1 - sum(fractions^2)\nexpected_heterotypic <- expected_total * heterotypic_fraction\nstopifnot(abs(expected_heterotypic - 19.2) < 1e-10)\nprint(c(total = expected_total, heterotypic = expected_heterotypic))'),['smDoublet']]
      ],
      worked:['为什么60个expected doublets里只有19.2个heterotypic期望量？',['类型份额f=[.8,.2]，两种同型配对概率为.64和.04。','Homotypic合计.68，因此heterotypic=.32，也等于2×.8×.2。','1000×.06=60个expected total doublets。','60×.32=19.2，剩余40.8是homotypic期望量。','换成.5/.5时heterotypic变.5；这不是说检测器必然检出50%，而是混合类型构成改变。']],
      terms:[term('Artificial doublet','从已有profiles合成的混合训练示例。','smDoublet','把两个不同类型的counts组合形成候选混合profile。','模拟组合与真实capture过程可能不同，不能当全部doublet真值。'),term('Homotypic doublet','由相同或相近cell types形成的doublet。','smDoublet','两种表达很接近的T cells混合可能靠RNA不易区分。','低doublet score不能排除这种难识别混合。'),term('Capture-aware analysis','按实际droplet捕获环境组织检测与expected rate。','smDoublet','同capture混入两位donors时仍应考虑跨donor混合。','Donor、sample与capture不总相同，需要实验metadata。')],
      check:['同一次capture混入四位donors，应把每位donor独立当成一个capture检测吗？','不能默认这样做。Cross-donor cells能共同进入droplet；按物理capture组织模拟并结合hash/genotype证据，仍要考虑同donor doublets。'],
      lens:['Counts、capture IDs、continuous scores、calls与过滤审计。','一个score对应一个barcode；expected rate由实际捕获环境定义。','低score不证明singlet，mixed markers也不能单独证明doublet。',['smDoublet']]
    },
    {
      id:'sc15',title:'HVG、PCs 与 k 的 sensitivity：怎样判断 cluster 不是参数偶然',subtitle:'把“看起来差不多”变成邻居、marker 和 donor 层面的稳定性检查。',
      intuition:['给同一组人换不同的相似度标准，最近的朋友可能改变。HVG和PCs先定义“相似”，k再决定要听多少位邻居的意见。','Input是有明确scale的expression与候选feature/representation设置；Output是可比较的graphs、clusters和稳定性证据。'],
      core:'Representation sensitivity',prereq:['sc03','sc04','cb09'],goals:['解释HVG flavor与输入尺度的依赖','手算neighbor Jaccard并识别其局限','用少量预设对照排查不稳的subclusters'],
      sections:[
        ['先量化邻居换了多少',figures.sc15+p('本图固定同一query和k=4，只换representation。Jaccard用intersection/union，把两个邻居集合的重合压成0–1的描述量。它不需要cluster labels；label编号换了而成员没变不应算生物变化。比较不同k时集合大小本来就变，Jaccard会受影响，应同时报告k、recall of small set等解释量，不能用单一值排所有参数。'),['smNeighbors']],
        ['每个参数改变的对象',p('HVG决定允许哪些genes定义主要变化，不等于筛选DE genes；PCA维数决定保留哪些线性方向；distance metric与neighbor k定义局部连接；Leiden resolution才进一步改变community划分。UMAP min_dist主要调展示，不应替代上游graph选择。Scanpy的seurat/cell_ranger HVG flavor通常接收log数据，而seurat_v3系列需要counts；batch_key可改变跨batch选feature的规则。先保证scale匹配，再解释结果差异。'),['smHVG','smNeighbors']],
        ['一个有边界的 sensitivity 设计',ol(['固定QC、原始cells、annotation版本与seed，保存未整合baseline。','先以HVG=2000或3000、PC=20或30、k=15或30构成小型教学候选网格；这些是起点而非跨组织最优值。','分次只改一个因素，保存representation/neighbor graph独立名称，避免覆盖导致无法对照。','看neighbor overlap、cluster membership稳定性及关键markers是否仍在原始表达上成立。','逐donor查看group覆盖，排除一个cluster仅由单capture、mt%、depth或cell cycle驱动。','需要新donor泛化时，在training donors上定features/设置；held-out donor只用于预设验证，不能反复挑最好看的test结果。']),['smHVG','smNeighbors']],
        ['什么时候增加或减少 PCs / k',p('更多PCs可能保留稀有或弱signal，也可能放大technical noise；查看PC loading、variance及与QC covariates的关系，而非只用elbow一个标准。较小k强调局部细节但容易碎裂，较大k平滑局部并可能连接相近稀有群。若rare type只在一个窄参数点存在，先检查supporting markers、每sample数量与独立证据。不要把resolution升高得到更多clusters等同于发现更多cell types。优点是可诊断稳健程度；代价是计算与多次探索带来的选择偏差。'),['smNeighbors','smHVG']],
        ['把比较记录成可复现的小表',code('# Same query and same k: compare two neighbor sets.\na <- c("a", "b", "c", "d")\nb <- c("a", "b", "e", "f")\njaccard <- length(intersect(a, b)) / length(union(a, b))\nstopifnot(abs(jaccard - 1/3) < 1e-12)\nprint(data.frame(query = "Q", k = 4, neighbor_jaccard = jaccard))')+p('正式表至少记录HVG flavor/input layer、n_top_genes、PCs、metric、k、clustering algorithm/resolution、seed、software versions及sample-level验证。Graph稳定但marker和assay evidence不支持时，稳定地重现technical artifact仍然是错误结论；反过来，不稳定的细分也可提示连续state而不是离散type。'),['smHVG','smNeighbors']]
      ],
      worked:['两个k=4的neighbors为何只得到1/3重合？',['A={a,b,c,d}，B={a,b,e,f}。','Intersection为{a,b}，size=2。','Union为{a,b,c,d,e,f}，size=6。','Jaccard=2/6=1/3，而不是2/4；2/4是从A看的neighbor retention。','对多个queries和donors重复描述，保留分布；一个query的值不能代表全数据。']],
      terms:[term('Highly variable gene','相对于指定mean–variance或相关模型更具变异的feature。','smHVG','选2000或3000个features会改变用于PCA的gene集合。','HVG不是condition DE名单，flavor也有输入尺度要求。'),term('Neighbor Jaccard','两个neighbor sets的intersection大小除union大小。','smNeighbors','两套四邻居集合共同两个，总共六个，值为1/3。','受k和representation影响，稳定不等于生物正确。'),term('Resolution parameter','控制graph community划分粒度的算法参数。','smNeighbors','提高参数常能得到更细的communities以供审查。','不同算法或数据上的同一数值不保证相同生物粒度。')],
      check:['把UMAP min_dist调小后点团更紧，能否说cell types更准确？','不能。先看用于clustering的representation和graph、markers以及donor稳定性；显示更紧不是独立accuracy证据。'],
      lens:['HVG list、PCA loadings/coordinates、neighbor graph与参数比较表。','距离定义在明确representation中；cluster是图划分，不是直接测量type。','稳定性是必要诊断之一，仍需独立生物证据与donor层级验证。',['smHVG','smNeighbors']]
    },
    {
      id:'sc16',title:'Harmony、Anchors 与 scVI：Integration 该修正什么，怎样避免修掉 biology',subtitle:'比较模型的输入、假设和输出，而不是只比较混合后的UMAP。',
      intuition:['校准来自不同仪器的尺子，需要知道它们至少测过某些相同对象。如果每种仪器只测一种处理组，尺子偏移与真实差异可能根本分不开。','Input是counts或预处理representation、batch与study design；Output可能是corrected embedding、mapping或模型量，不能都叫同一种corrected expression。'],
      core:'Integration model choice',prereq:['sc05','sc15','d01'],goals:['比较Harmony、anchor-based与scVI输入输出','通过ridge手算理解correction strength','建立batch removal和biology preservation双重评价'],
      sections:[
        ['Regularization 怎样改变一项 correction',figures.sc16+p('设观测到跨batch偏移10，教学loss=(δ−10)²+λδ²。导数为2(δ−10)+2λδ，令其为0得δ=10/(1+λ)。增加penalty会把估计shift缩向0。这个简单例子只解释shrinkage，不包含Harmony的soft clustering、diversity或cell-specific correction，也没有证明偏移10全部是技术误差。'),['smHarmony']],
        ['三条路线的选择差异',p('Harmony在PCA等低维空间迭代soft clustering与batch correction，适合想保留原始counts并建立共同embedding的工作流。Anchor-based方法先寻找跨数据集对应的cell states，再用这些对应关系传递或校正；共享群体不足时要审查false anchors。scVI用count likelihood和latent-variable模型描述细胞与batch，可输出latent representation；需要正确注册raw counts、batch covariates及训练诊断。样本规模、compute、输入scale和下游问题不同，决定哪条路线更合适，而不是“deep model必然更好”。'),['smHarmony','smIntegrate','smSCVI']],
        ['逐步比较：先设 baseline 和不可删除的 signal',ol(['画condition×batch×donor覆盖表，标出完全混杂；这种设计不能靠integration保证识别生物效应。','保存不整合的QC、PCA、markers和raw counts；明确想消除的technical variable，而非把condition顺手当batch。','为每个方法使用匹配input：Harmony接reduction，anchor流程按其normalization方案，scVI注册原始count layer。','固定数据split，先跑最少的合理baseline，记录embedding名称、参数、seed和训练日志。','同时评价同type跨batch可比较性与不同types/states的分离、marker/trajectory保留及rare群体覆盖。','将最终condition inference放回正确sample-level counts/design；若使用模型特有DE，需单独说明其假设，不把embedding坐标当gene counts。']),['smIntegrate','smSCVI']],
        ['参数怎么调，优缺点怎么看',p('Harmony的theta控制鼓励cluster跨batch多样性的力度；更强混合可能牺牲独有states。Ridge penalty与sigma改变correction/soft assignment，当前wrapper的名称与默认值先查本地help，不把旧版调用当永久API。Anchor流程要审查features、dims和anchor覆盖，弱共享时可选较保守路线并保留unmapped群体。scVI可先比较latent dimensions 10/20/30等预设起点，检查training/validation目标是否收敛、是否受seed影响，再用biological conservation验证；较好ELBO本身不证明整合正确。'),['smHarmony','smIntegrate','smSCVI']],
        ['哪些现象提示过度 correction',p('只有Treatment存在的稀有状态被强行塞进Control、真实marker差异消失、未共享types异常混合，均应触发回看。相反，残留batch也可能来自真实不同composition，而非一定要继续增强correction。优势是促进共享状态的比较；局限是identifiability、unbalanced sampling与representation依赖。不能把“所有donors都混得很均匀”作为唯一成功标准；保留未整合版本和关键结论对设置的敏感性。')+code('# One-dimensional ridge correction, not Harmony implementation.\nlambda <- c(0, 1, 9)\nshift <- 10 / (1 + lambda)\nremaining <- 10 - shift\nstopifnot(identical(shift, c(10, 5, 1)))\nprint(data.frame(lambda, shift, remaining))'),['smIntegrate','smHarmony']]
      ],
      worked:['λ怎样让偏移10只被校正一部分？',['教学目标为(δ−10)²+λδ²。','求导并令0：δ(1+λ)=10，因此δ=10/(1+λ)。','λ=0时δ=10，remaining offset=0；λ=1时δ=5，remaining=5。','λ=9时δ=1，remaining=9，说明更强penalty更少修改。','这个式子只计算强度，没有判断shift是技术还是biology；该判断还需要设计与验证。']],
      terms:[term('Anchor','不同数据集中被方法判为可对应cell states的连接。','smIntegrate','共享cell type可能提供跨batch的对应参照。','对应关系可错，reference缺失的state不能被强制正确匹配。'),term('Batch covariate','模型显式考虑的技术或设计分组变量。','smSCVI','不同capture chemistry可作为记录清楚的covariate。','若与condition完全混杂，调整不能自动恢复真实condition effect。'),term('Biological conservation','整合后仍保留研究相关types、states与差异的程度。','smIntegrate','检查rare状态、markers与独立donor上的结构是否保留。','只看batch混合不能衡量该目标，也不能以一张UMAP替代评价。')],
      check:['所有Control在batch A、Treatment在batch B，Harmony把两组完全混合，证明没有Treatment effect吗？','不能。Batch与condition不可识别；完全混合可能删除真实差异。需要交叉batch设计、外部证据或限制结论，不能从漂亮embedding推断零效应。'],
      lens:['原始counts、batch/design表、多个独立命名的integrated reductions和评价结果。','Embedding是模型坐标，不是gene-wise raw measurement。','Batch removal与biology preservation必须同时检查；混杂设计限制仍然存在。',['smIntegrate','smHarmony','smSCVI']]
    },
    {
      id:'sc17',title:'Reference mapping 与 Open-set annotation：什么时候应该说 Unknown',subtitle:'Top label、confidence 和 reference coverage 是三件不同的事。',
      intuition:['一本只收录猫和狗的字典，看到狐狸也可能很自信地选一个最像的词。给未知细胞强行选已知标签，会把数据库的缺口藏成生物发现。','Input是query profiles、reference features/labels与mapping模型；Output是候选identity、supporting scores、coverage检查及可保留的Unknown。'],
      core:'Reference mapping & abstention',prereq:['sc05','sc16'],goals:['手算归一化score为何丢失absolute distance','区分label transfer与新state识别','设计donor-held-out calibration和abstain规则'],
      sections:[
        ['相同 top score 不代表相同覆盖',figures.sc17+p('对两个类别使用自编score exp(−d)，再除总和；给全部distances加同一个常数会被归一化消掉。Q-near与Q-far的距离差相同，所以都得.731。真实Seurat/scANVI不使用本图的完整简化公式，但closed-set输出同样需要额外coverage审查。一个数值在0–1之间，并不自动具备“正确概率”的校准意义。'),['smMap','smSCANVI']],
        ['Label transfer 与 semi-supervised model 的区别',p('Seurat mapping可利用reference-query anchors传递labels并把query投到reference空间，不要求把query原始counts改写成reference。scANVI使用部分有标签的cells和unlabeled cells建立semi-supervised latent模型，标签质量与coverage仍然影响结果。两者都应保留原始expression做marker核查；mapping主要回答“与reference哪类相容”，不自动回答“是否出现了reference以外的新类型”。'),['smMap','smSCANVI']],
        ['六步设计可拒绝的 annotation',ol(['对齐species、gene IDs、assay和normalization；统计共有features与关键markers的覆盖，而非只看总gene数。','按donor或study分开reference训练、calibration和独立测试，避免同donor泄漏进两边。','从broad lineage开始，再逐级细分；检查reference是否实际包含目标组织、病理状态和稀有群体。','同时保留top score、runner-up margin、局部距离/密度、marker一致性等适用于该方法的证据。','用held-out有标签数据选择abstain规则，报告coverage与accepted predictions的error trade-off；可故意留出某type模拟unknown。','Unknown仍保留在对象与composition表里，记录是否来自low quality、assay mismatch或潜在novel state，再人工审查。']),['smMap','smSCANVI']],
        ['设置阈值时不要把演示数当 universal default',p('Top-score threshold=.7或margin=.2可以用作教学开关，但正式值应从独立calibration确定，且按type的错误代价检查。Reference里少数类型的score可能系统性较低；一个全局threshold会选择性排除rare types。距离阈值也依赖representation、尺度和training分布，不可跨模型直接复制。优点是快速复用atlas与统一命名；代价是reference bias、closed-set限制和label传播错误。Abstain会降低覆盖率，但让不确定性可见。'),['smMap','smSCANVI']],
        ['从细胞图到下游结论要保留 Unknown',p('若所有Unknown都在某condition出现，直接删除会同时改变composition与within-type比较。先报告每donor Unknown比例和QC特征，再决定是否细分、重新建reference或限制结论。Novel state需要多markers、独立donors及额外assay支持；“无法映射”也可能只是poor-quality cell。检查词汇层级与ontology，避免把activation state当新的cell lineage。')+code('# Scores demonstrate invariance to a common distance offset.\nscore <- function(d) {\n  w <- exp(-(d - min(d)))\n  w / sum(w)\n}\nnear <- score(c(0.1, 1.1))\nfar <- score(c(10, 11))\nstopifnot(isTRUE(all.equal(near, far)))\nprint(rbind(near, far))'),['smMap','smSCANVI']]
      ],
      worked:['Q-near与Q-far为何都得到0.731？',['Q-near distances=[.1,1.1]，两类weight比为exp(1):1。','A score=exp(1)/(exp(1)+1)≈.731。','Q-far distances=[10,11]也相差1，归一化之后仍是.731。','Nearest distance却从.1变10；这条信息未被top score保留。','实际abstain规则需用独立数据定标；图只证明归一化score无法独自确认coverage。']],
      terms:[term('Open-set annotation','允许query不属于reference已知labels的注释设定。','smMap','只含两类reference时，第三种真实类型应可保留Unknown。','Unknown也可能由低质量或assay差异造成，不能自动叫novel type。'),term('Abstention','证据不足时暂不强制给出具体预测的策略。','smSCANVI','Top score通过但距离异常的query可进入人工审查。','降低error同时会降低coverage，阈值需要独立定标。'),term('Calibration','检查预测score与实际正确率关系并确定决策规则的过程。','smMap','在held-out donors中统计score区间的实际误标率。','同训练数据上调阈值可能乐观，score本身不保证概率解释。')],
      check:['Query全部远离reference，但top score很高，能否直接接受最细的label？','不应仅凭top score。检查features/assay与局部coverage，比较broad labels及markers，并使用独立calibration后的Unknown规则。'],
      lens:['Query/reference feature overlap、mapped coordinates、scores、labels与Unknown原因。','Label是reference条件下的推断；score尺度由具体模型决定。','高score不保证reference覆盖，新state也不能只靠mapping失败确认。',['smMap','smSCANVI']]
    },
    {
      id:'sc18',title:'Milo 与 cluster-level Differential abundance：从重叠邻域到 sample-level contrast',subtitle:'研究连续state的比例变化时，先明确一条检验对应哪个区域。',
      intuition:['把城市划成互相重叠的生活圈，能看到行政区边界内被平均掉的变化。但同一个居民出现在两个圈里，不会变成两个独立居民。','Input是可信的cell-state graph、sample IDs及design；Output是neighborhood或cell-type层面的relative abundance effects与相应error控制。'],
      core:'Differential abundance',prereq:['r11','sc06','sc15'],goals:['手算overlapping neighborhood的sample counts','按连续state或离散type选DA方法','区分overlap、replication和multiple-testing控制'],
      sections:[
        ['从四个cells算出两行 counts',figures.sc18+p('图里a、b来自S1，c、d来自S2；N1含a/b/c，N2含b/c/d，得到N1=[2,1]、N2=[1,2]。b和c各被计入两次，所以矩阵总和6大于unique cells=4。这是允许的neighborhood membership表示，不应再把6当作新样本量，也不能把重叠neighborhoods看作独立重复。两samples只用于算数，不足以拟合可靠condition effect。'),['smMilo']],
        ['Milo 的步骤与需要选择的参数',ol(['在QC、normalization和适当integration之后建cell-state kNN graph，确认真实biological continuum没有被过度整合。','用k与PC dimensions定义locality，采样代表性的index cells，并按算法refinement形成部分重叠neighborhoods。','按biological sample统计每个neighborhood内cells，建立neighborhood×sample count matrix。','连接完整sample metadata，检查design rank、condition覆盖与replication，按模型处理sample总量差异。','逐neighborhood估计condition contrast，再用适合overlap结构的weighted FDR程序控制多重比较。','把结果映回graph并报告effect、sample支持、uncertainty和parameter sensitivity；合并展示不能重新虚构独立tests。']),['smMilo']],
        ['什么时候用 Milo，什么时候用 scCODA',p('若已有可信、相对稳定的离散cell-type定义，sample×type表与composition-aware方法如scCODA通常更直接，效应相对reference解释；细胞状态连续且cluster边界任意时，Milo可以寻找局部丰度变化而不先强迫所有细胞进入固定类别。Milo更依赖graph质量、k和neighborhood覆盖；scCODA更依赖type定义、reference/稀疏效应假设及sampling。两者都研究relative composition，不能凭捕获细胞数恢复组织绝对细胞量。'),['smMilo','smCODA']],
        ['设置、优缺点与排错',p('Milo可先用与上游graph一致的PCs及合理k作baseline，再比较较小/较大k；教学网格如k=15/30/50并非文档统一默认，也未必适合很小数据。Sampling proportion影响覆盖与compute，查看有多少cells/neighborhoods得到代表。Neighborhood太小会产生很多sample zeros，太大会稀释局部变化。注意每组是否由多个独立donors支持；同donor不同sections不是额外独立人。优势是发现连续局部state变化，代价是依赖graph及多个重叠tests，不适合只有一个donor/condition却要推广到人群的设计。'),['smMilo','smCODA']],
        ['把统计答案与生物问题重新接上',p('某neighborhood相对增加可能来自组织组成、capture/QC选择或annotation变化；它不自动说明细胞增殖，也不等于这些cells内某gene上调。并行检查donor-level composition、within-state expression、空间位置与外部计数。对age分析保留连续age与covariates，别只为画图随意二分；样本不足时复杂design会损失可估计性。')+code('# Count memberships by sample; overlap is intentional.\nsample_id <- c(a = "S1", b = "S1", c = "S2", d = "S2")\nnhoods <- list(N1 = c("a", "b", "c"), N2 = c("b", "c", "d"))\ncounts <- t(vapply(nhoods, function(ids) {\n  as.numeric(table(factor(sample_id[ids], levels = c("S1", "S2"))))\n}, numeric(2)))\ncolnames(counts) <- c("S1", "S2")\nstopifnot(sum(counts) == 6, length(sample_id) == 4)\nprint(counts)'),['smMilo','smCODA']]
      ],
      worked:['为什么neighborhood count matrix总和6而原始只有4个cells？',['N1={a,b,c}，S1有a/b两个，S2有c一个，counts=[2,1]。','N2={b,c,d}，S1有b一个，S2有c/d两个，counts=[1,2]。','b、c各贡献两次membership，a、d各一次，共6。','Unique cells仍为4，biological samples仍为2；重复归属改变test依赖，不增加replication。','正式DA还需各condition的replicated samples、有效design与weighted FDR；本图没有给出p-value。']],
      terms:[term('Differential abundance','在预设contrast下比较群体或局部state相对丰度的分析。','smMilo','某graph邻域在Treatment samples中占比增加。','与该邻域内gene的differential expression是不同问题。'),term('Overlapping neighborhood','可与其他邻域共享成员的局部cell集合。','smMilo','N1和N2同时包含b与c，因此各自产生相关counts。','共享成员不是重复测得更多独立cells或donors。'),term('Weighted FDR','在明确定义的权重和检验程序下进行的多重比较控制。','smMilo','Milo的neighborhood tests考虑图中重叠结构。','不是把普通p-value任意乘权重，也不能修复无replicate的design。')],
      check:['Milo输出1000个neighborhood tests，是否等于拥有1000个independent biological replicates？','不等于。它们是重叠的局部检验对象；replication来自独立samples/donors，必须保留在count matrix列与design里。'],
      lens:['Neighborhood membership、neighborhood×sample counts、sample metadata及contrast results。','Rows是重叠检验对象，columns是biological samples，membership总数可超过cells数。','DA通常是相对丰度证据；不能直接推断绝对增殖或因果状态转换。',['smMilo','smCODA']]
    },
    {
      id:'sc19',title:'Slingshot 与 Pseudotime：root、branch 和 sampling 怎样改变故事',subtitle:'从静态状态排序走向发育解释，需要额外的方向证据。',
      intuition:['沿着山路量到的距离告诉你位于哪一段，却不告诉你几时出发、走了多久，也不证明每个人真的从另一端走来。','Input是reduced representation和cluster结构；Output是lineage curves、每个cell在lineage上的pseudotime与membership，而非直接测得的历史。'],
      core:'Trajectory inference',prereq:['sc04','sc15','r07'],goals:['手算root改变如何反转pseudotime','拆解MST与principal-curve步骤','用sampling和独立证据审查trajectory方向'],
      sections:[
        ['先看一个方向可反转的直线',figures.sc19+p('Pseudotime通常是沿模型路径的进展坐标，而不是hours。图中用arc length normalization，把0、1、3、6变成0、1/6、1/2、1；换root就变成1减原值。更复杂branch也会受到起点、图拓扑与lineage拟合影响。两个端点的expression差异本身不能决定谁先谁后，更不能证明某个cell真实变成了另一个cell。'),['smSlingshot']],
        ['Slingshot 怎样从群体连接到曲线',ol(['从合适normalization和features得到低维表示，并提供可信cluster labels；避免只因UMAP视觉上弯曲就直接解释轨迹。','在clusters之间建立global lineage结构，Slingshot使用minimum spanning tree等步骤连接群体。','结合外部生物知识指定root，必要时约束terminal states；先说明约束来自何种evidence。','对候选lineages拟合同时principal curves，将cells投影到曲线并计算lineage-specific pseudotime和weights。','检查branch前后markers、每donor覆盖、curve对outliers和clustering的敏感性。','再分析沿pseudotime变化的genes，保留branch、sample结构与model selection的不确定性。']),['smSlingshot']],
        ['什么时候用，什么时候不适合',p('有合理连续transition、足够中间状态和多donor支持时，trajectory可组织候选时序与branch相关genes。几个完全分离终末types之间缺少中间cells时，算法仍可能画连线，但连线可能只是数学连接而非生物过程。疾病、stress或cell cycle可形成相似连续轴；不应自动叫development。优势是不用每个cell的真实时间也能探索状态结构；局限是静态snapshot、不均匀采样和拓扑假设。'),['smSlingshot']],
        ['参数和验证怎样设置',p('Root优先由已知起始群、采样时间或独立lineage证据支持；至少展示替代root或branch约束下的变化。检查不同PC数、cluster粒度和适度downsampling后的连线是否稳定。细分过度可能使MST易受噪声影响，过粗可能掩盖branch。每个condition/donor是否覆盖整条轨迹很关键：若早期全来自A、晚期全来自B，沿pseudotime的gene trend可能是donor effect。终点少或离群cells吸引曲线时，回看QC而不是只改平滑参数。'),['smSlingshot']],
        ['与 RNA velocity、lineage tracing 各提供哪层证据',p('Pseudotime利用expression geometry排序；RNA velocity用不同RNA pools及动力学假设估计局部变化方向，已有R07拆解其限制；lineage tracing记录继承标记，可给状态关系补历史证据。三者可以互相核对，但不能把任何一张箭头图当真实细胞录像。沿pseudotime相关的gene是候选趋势，不能直接叫驱动gene；需要perturbation或其他独立验证。')+code('# A straight-line illustration, not a Slingshot fit.\nposition <- c(0, 1, 3, 6)\nt_from_left <- (position - min(position)) / diff(range(position))\nt_from_right <- (max(position) - position) / diff(range(position))\nstopifnot(all(abs(t_from_left + t_from_right - 1) < 1e-12))\nprint(rbind(t_from_left, t_from_right))'),['smSlingshot']]
      ],
      worked:['同一条线怎样得到两个相反方向？',['Toy positions=[0,1,3,6]，全长6。','选左端root：t=(x−0)/6=[0,.167,.5,1]。','选右端root：t=(6−x)/6=[1,.833,.5,0]。','每个位置的两种t相加为1；geometry完全不变，但方向解释反转。','外部时间、lineage或机制证据应支持root；仅靠归一化t不能获得小时数或转换速度。']],
      terms:[term('Pseudotime','沿推断trajectory定义的状态进展坐标。','smSlingshot','直线位置3在长度6的路径上给normalized pseudotime=.5。','不等于采样时间、细胞年龄或从起点经历的小时。'),term('Minimum spanning tree','在给定节点与距离下连接所有节点且总边长最小的树。','smSlingshot','Cluster centers可通过MST组织候选global lineage。','数学上必须连接不代表缺少中间状态的生物群体真的相互转化。'),term('Lineage weight','模型中一个cell对某条候选lineage的归属或参与程度。','smSlingshot','Branch前的cells可与多个lineages关联。','模型weight不是通过实验直接追踪的祖先关系概率。')],
      check:['同一数据换root后早晚趋势反转，是不是RNA测量变了？','测量没变，排序方向的模型设定改变。先说明root证据及敏感性，再对gene趋势作有边界解释；不能只挑符合预想故事的方向。'],
      lens:['Low-dimensional coordinates、clusters、lineage curves、root与pseudotime/weight表。','Pseudotime单位由模型和尺度定义，并非clock time。','静态排序不能独自确认真实lineage、因果driver或转换速率。',['smSlingshot']]
    },
    {
      id:'sc20',title:'CITE-seq、WNN 与 scATAC LSI：多一种 modality，不等于多一份相同数据',subtitle:'RNA、protein 与 accessibility 各自有测量尺度和噪声，先分开理解再组合。',
      intuition:['判断一个人是谁，可以看他说的话、穿的制服和能进入的房间。三种线索互补，但不能把它们的原始数字直接相加。','Input是同cell配对的多modal measurements及各自QC；Output是modality-specific representations和joint graph，仍需回到原assay解释。'],
      core:'Multimodal representation',prereq:['sc03','sc04','sc15','d05'],goals:['手算modality weight怎样改变邻居偏好','解释WNN与TF-IDF/LSI的不同角色','按assay选择QC、normalization和可支持结论'],
      sections:[
        ['先看weight如何改变一个局部决定',figures.sc20+p('本图用已在可比范围内的两种affinities做手选加权，以隔离weight的作用；这不是把RNA counts与ADT counts直接相加，也不是Seurat WNN的完整公式。真实WNN先分别preprocess每个modality，利用modality内外的预测信息学习cell-specific weights，再形成联合neighbors。Weight表达当前表示中的相对有用信息，不等于该modality在生物学上更重要。'),['smWNN']],
        ['CITE-seq / WNN 的使用顺序',ol(['确认RNA与ADT来自相同cell barcodes，并核对丢失、重复、panel和antibody标记。','RNA按匹配方案normalize并做PCA；ADT检查background、isotype/negative controls及panel覆盖，再使用适当变换与独立reduction。','为两个reductions显式命名并分别检查PCs与QC；不要把第二次PCA覆盖第一次。','调用WNN时指定每个reduction和相应维数，检查cell-specific modality weights分布及异常cells。','对joint graph进行clustering和可视化，同时对照RNA-only与ADT-only结果。','回到原始/适当normalized各assay核对markers；protein与RNA不一致可能有生物原因，也可能是assay噪声。']),['smWNN']],
        ['scATAC 为什么常走 TF-IDF → LSI',p('Peak×cell counts描述开放染色质区域而非gene表达。TF类缩放减小cell总量差异，IDF类权重降低极普遍features的相对贡献，再用SVD构建LSI。不同TF-IDF实现对log位置、scale factor和IDF定义不同，Signac明确列出四种，不能混用公式。随后检查LSI dimensions与depth的相关性；第一维可能深度相关，但应诊断后决定是否排除，不是永远机械删除dimension1。'),['smATAC','smTFIDF']],
        ['QC 与参数要按 modality 分开',p('scATAC检查fragments、TSS enrichment、nucleosome signal、fraction in peaks、blacklist或相应assay-specific指标；阈值依赖组织、reference、peak calling和chemistry。WNN的RNA dims=1:30、ADT dims取可支持的范围只是常见教学起点；小panel的有效维度受features数量限制。Joint RNA+ATAC可分别用PCA/LSI并核对depth-driven axes。若没有same-cell pairing，不能直接声称标准WNN已经解决所有unpaired integration；需要匹配相应缺失模态模型与验证。'),['smWNN','smATAC']],
        ['什么时候更有用，代价是什么',p('RNA难区分但surface proteins清晰的群体，或希望连接gene expression与regulatory accessibility时，多modal测量值得考虑。优势是互补证据，代价是更多实验/compute、assay-specific background和alignment要求。Joint graph可以改善cell-state划分，但peak accessible不等于gene已表达，protein detected不等于receptor active。Targeted ADT panel也限制能解释的机制，不能把缺少antibody信号当所有protein缺失。'),['smWNN','smATAC']],
        ['亲手改变 toy weight，再检查答案',code('# Weighted affinities on a shared toy scale, not WNN implementation.\nrna <- c(A = 0.9, B = 0.2)\nadt <- c(A = 0.1, B = 0.8)\ncombine <- function(w) w * rna + (1 - w) * adt\nanswer <- rbind(RNA_weight_0.8 = combine(0.8), RNA_weight_0.2 = combine(0.2))\nstopifnot(which.max(answer[1, ]) == 1, which.max(answer[2, ]) == 2)\nprint(answer)')+p('正式分析记录features、normalization、reduction names、dims与joint-neighbor参数；另外保存single-modality baselines。若某些cells几乎只依赖一个modality，先区分真实信息差异与另一assay低质量。给结果命名为“joint graph支持的state”并说明markers在哪个assay被观测，避免把多种单位揉成一个无来源的score。'),['smWNN','smTFIDF']]
      ],
      worked:['为什么RNA weight改变会让最近候选从A换成B？',['Toy RNA affinities A=.9、B=.2；ADT affinities A=.1、B=.8。','w=.8时A=.8×.9+.2×.1=.74，B=.8×.2+.2×.8=.32。','w=.2时A=.2×.9+.8×.1=.26，B=.2×.2+.8×.8=.68。','Winner从A变B，说明modality weighting会改变local graph。','真实WNN学习cell-specific权重；这里手算仅说明组合逻辑，并未运行该算法。']],
      terms:[term('Antibody-derived tag','通过序列标签读取antibody结合信号的测量。','smWNN','CITE-seq的ADT assay与同barcode的RNA assay相互配对。','标签counts受background和antibody性能影响，不是直接的绝对protein分子数。'),term('Weighted Nearest Neighbor','学习cell-specific modality贡献并构造joint graph的方法。','smWNN','RNA与ADT可在不同cells中提供不同程度的信息。','联合邻域不把原始测量变成同一种单位，也不自动解决unpaired数据。'),term('Latent semantic indexing','通常对TF-IDF表示做SVD得到低维坐标的路线。','smATAC','scATAC可把peak×cell矩阵映射成LSI coordinates。','LSI维度可能反映depth；accessible peak不能直接称为gene表达。')],
      check:['RNA+ADT joint UMAP更清晰，能否说明所有joint clusters都有更强机制证据？','不能。还要按assay检查markers、background、donor覆盖与single-modality baselines；joint geometry提供state组织，不自动证明受体活性或因果通路。'],
      lens:['配对barcodes的RNA/ADT或RNA/ATAC layers、独立QC、reductions与joint graph。','不同modality测量不同对象，joint坐标不是物理量的直接相加。','多modal支持可互补但仍受panel、depth、background及模型假设限制。',['smWNN','smATAC','smTFIDF']]
    }
  ];
  const course=window.BIOCS_BOOK.find(c=>c.code==='05');
  if(!course)throw new Error('Load Omics course before single-cell methods extension.');
  window.BIOCS_INTUITION ||= {};
  window.BIOCS_DATA_LENS ||= {};
  for(const chapter of chapters){
    window.BIOCS_INTUITION[chapter.id]=chapter.intuition;
    window.BIOCS_DATA_LENS[chapter.id]=chapter.lens;
    delete chapter.lens;
    chapter.intro='';
    chapter.more=[...new Set(chapter.sections.flatMap(s=>s[2]))];
    course.chapters.push(chapter);
  }
  window.BIOCS_SINGLECELL_METHODS_CHAPTERS=chapters.map(({id,title})=>({id,title,course:'05',origin:'Original detailed single-cell methods extension'}));
})();
