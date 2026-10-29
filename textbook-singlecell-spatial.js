/* Original single-cell and spatial extension. Numerical diagrams are synthetic teaching examples. */
(() => {
  'use strict';
  const sources = {
    scCellRanger: ['10x Genomics · Cell Ranger Gene Expression Algorithm', 'https://www.10xgenomics.com/support/software/cell-ranger/latest/algorithms-overview/cr-gex-algorithm'],
    scSeurat: ['Seurat · Guided Clustering Tutorial', 'https://satijalab.org/seurat/articles/pbmc3k_tutorial'],
    scSCT: ['Seurat · SCTransform v2 workflow', 'https://satijalab.org/seurat/articles/sctransform_vignette'],
    scIntegrate: ['Seurat · Integrative analysis and layers in v5', 'https://satijalab.org/seurat/articles/seurat5_integration'],
    scScanpy: ['Scanpy · Preprocessing and clustering', 'https://scanpy.readthedocs.io/en/stable/tutorials/basics/clustering.html'],
    scSoupX: ['Young & Behjati · SoupX ambient RNA correction', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7763177/'],
    scDoublet: ['scDblFinder · Official vignette and capture-aware settings', 'https://bioconductor.org/packages/release/bioc/vignettes/scDblFinder/inst/doc/scDblFinder.html'],
    scReplicate: ['Squair et al. · Confronting false discoveries in single-cell differential expression', 'https://www.nature.com/articles/s41467-021-25960-2'],
    scOSCA: ['Bioconductor OSCA · DE analyses between conditions', 'https://bioconductor.org/books/release/OSCA.multisample/multi-sample-comparisons.html'],
    scModuleScore: ['Seurat · AddModuleScore definition and controls', 'https://satijalab.org/seurat/reference/addmodulescore'],
    scEnrichment: ['Yu Lab · Enrichment foundations: ORA and GSEA', 'https://yulab-smu.top/biomedical-knowledge-mining-book/enrichment-foundations.html'],
    scUCell: ['Andreatta & Carmona · UCell gene signature scoring', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8271111/'],
    scSpaceRanger: ['10x Genomics · Space Ranger spatial outputs', 'https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs'],
    scXenium: ['10x Genomics · Understanding Xenium outputs', 'https://www.10xgenomics.com/support/software/xenium-onboard-analysis/latest/analysis/xoa-output-understanding-outputs'],
    scCoordinates: ['SpatialData · Transformations and coordinate systems', 'https://spatialdata.scverse.org/en/stable/tutorials/notebooks/notebooks/examples/transformations.html'],
    scRadius: ['Squidpy · Radius-based spatial graph', 'https://squidpy.readthedocs.io/en/stable/api/squidpy.gr.spatial_neighbors_radius.html'],
    scMoran: ['Squidpy · Spatial autocorrelation, weights and permutation options', 'https://squidpy.readthedocs.io/en/stable/api/squidpy.gr.spatial_autocorr.html'],
    scCellChat: ['Jin et al. · CellChat communication inference', 'https://www.nature.com/articles/s41467-021-21246-9'],
    scMapping: ['Cell2location · Reference signatures and spatial mapping tutorial', 'https://cell2location.readthedocs.io/en/latest/notebooks/cell2location_tutorial.html']
  };
  Object.assign(window.BIOCS_SOURCES, sources);
  const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const text = (x,y,s,size=17,color='#17385f',anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
  const line = (x1,y1,x2,y2,color='#315f91',width=2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
  const rect = (x,y,w,h,color='#e9f1fa') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="#8aacc8" rx="4"/>`;
  const box = (x,y,w,h,s,color) => rect(x,y,w,h,color)+text(x+w/2,y+h/2+6,s,17,'#17385f','middle');
  const circle = (x,y,r,color='#2c63a3') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
  const figure = (id,title,body,caption) => `<figure class="concept-figure"><div role="region" tabindex="0" aria-label="${title}（可横向滚动）" style="overflow-x:auto"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc" viewBox="0 0 640 330" style="display:block;width:100%;min-width:640px;font-family:system-ui,sans-serif"><title id="${id}-title">${title}</title><desc id="${id}-desc">${caption}</desc>${body}</svg></div><figcaption>原创 synthetic example · ${caption} 图中全部数值也在 worked example 中逐步解释。</figcaption></figure>`;
  const paragraph = s => `<p>${s}</p>`;
  const steps = ss => `<ol>${ss.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  const term = (label,definition,source,example,caution) => [label,definition,source,example,caution];
  const math = {
    normalized: (count,total,target=10000) => count/total*target,
    qcFraction: (mt,total) => mt/total,
    softAggregate: (counts,weights) => weights[0].map((_,j)=>counts.reduce((sum,c,i)=>sum+c*weights[i][j],0)),
    moran: (x,w) => {
      const n=x.length, mean=x.reduce((a,b)=>a+b,0)/n, z=x.map(v=>v-mean);
      const totalW=w.flat().reduce((a,b)=>a+b,0), denominator=z.reduce((a,b)=>a+b*b,0);
      if(!totalW || !denominator)return null;
      const numerator=w.reduce((sum,row,i)=>sum+row.reduce((v,a,j)=>v+a*z[i]*z[j],0),0);
      return n/totalW*numerator/denominator;
    }
  };
  window.BIOCS_SC_SPATIAL_MATH = math;
  const figs = {};
  figs.sc01 = figure('sc01','Read、UMI 与 cell barcode 回答不同问题',
    text(25,30,'Same gene G; idealized error-free barcode/UMI example')+
    text(35,68,'Reads')+text(240,68,'Cell barcode / UMI')+text(480,68,'Distinct molecules')+
    [['R1','A / U1'],['R2','A / U1'],['R3','A / U2'],['R4','B / U1'],['R5','B / U1']].map((r,i)=>text(40,105+i*34,r[0])+text(250,105+i*34,r[1])).join('')+
    box(455,105,145,56,'A: G = 2')+box(455,198,145,56,'B: G = 1')+line(355,145,450,133)+line(355,225,450,226)+text(25,307,'5 reads → 3 cell-specific molecules, not 5 RNA counts',17),
    '五条 reads 中，A 的 G 有两个不同 UMI，B 的 G 有一个；在无纠错/碰撞的简化例子中形成 gene×cell counts [2,1]。');
  const qcRows=[['C1',1000,50],['C2',1200,180],['C3',400,160],['C4',3000,90]];
  figs.sc02 = figure('sc02','一个 QC 阈值不能同时识别所有问题',
    text(25,30,'Mitochondrial fraction = mitochondrial counts / total counts')+
    qcRows.map((r,i)=>text(25,85+i*48,`${r[0]}: ${r[2]}/${r[1]}`)+rect(215,61+i*48,math.qcFraction(r[2],r[1])*700,28,i===2?'#f7d6b5':'#b6d0ee')+text(520,84+i*48,`${(math.qcFraction(r[2],r[1])*100).toFixed(0)}%`)).join('')+
    line(355,50,355,248,'#995822',2)+text(295,276,'Toy cutoff 20%',16)+text(25,311,'C4 has many counts but low mt%; doublet assessment is separate.',16),
    'C1=5%、C2=15%、C3=40%、C4=3%；示意20%阈值只标记C3。C4的高counts需要结合复杂度、类型和doublet evidence，不能只靠mt%。');
  figs.sc03 = figure('sc03','相同相对份额，经 library scaling 后相等',
    text(25,30,'Toy normalization: target = 10,000; natural log1p')+
    box(25,70,180,60,'A: 2 / 100')+box(25,175,180,60,'B: 20 / 1000')+
    line(205,100,255,100)+line(205,205,255,205)+box(255,70,160,60,'200')+box(255,175,160,60,'200')+
    line(415,100,465,100)+line(415,205,465,205)+box(465,70,150,60,'ln(201) = 5.303')+box(465,175,150,60,'ln(201) = 5.303')+
    text(25,285,'Counts: integer observations → data: transformed values',16)+text(25,312,'Equal normalized values do not prove equal RNA per cell.',16),
    '2/100与20/1000都占2%；乘10,000得到200，再取ln(1+200)≈5.303。未由此恢复absolute RNA或证明两种cells相同。');
  figs.sc04 = figure('sc04','k 改变的是邻居图，而不是已经知道的 cell types',
    text(25,30,'Toy 2-PC space; Euclidean distances from Q')+line(90,240,330,240)+line(90,240,90,60)+
    line(90,240,160,240,'#2c63a3',4)+line(90,240,90,100,'#167768',3)+line(90,240,300,240,'#b4c3d4',1)+
    circle(90,240,8)+circle(160,240,8)+circle(90,100,8,'#167768')+circle(300,240,8,'#8b6c42')+
    text(83,278,'Q (0,0)',15)+text(135,218,'A (1,0)',15)+text(108,103,'B (0,2)',15)+text(275,218,'C (3,0)',15)+
    text(350,75,'Distances: 1, 2, 3',18)+text(350,113,'k=1: A',18)+text(350,151,'k=2: A + B',18)+text(25,313,'Graph choices precede community detection; UMAP is a display.',16),
    'Q到A、B、C的距离为1、2、3。k从1变2会加入B；此图未声称这些点的真实cell types，也不等于真实PCA计算。');
  figs.sc05 = figure('sc05','Batch correction 能移去偏移，也可能移去真实差异',
    text(25,30,'Two types in two toy datasets: same offset, two explanations')+
    text(25,80,'Dataset A')+box(180,49,160,50,'Type X: 2')+box(395,49,170,50,'Type Y: 8')+
    text(25,159,'Dataset B')+box(180,128,160,50,'Type X: 12')+box(395,128,170,50,'Type Y: 18')+
    text(25,237,'Subtract 10:')+box(180,206,160,50,'Type X: 2')+box(395,206,170,50,'Type Y: 8')+
    text(25,298,'Was +10 technical batch or biology? The design must distinguish it.',16),
    'A中两类值2/8，B中12/18；减10能完全对齐，但只有这些数不能判定+10是technical effect还是真实condition effect。');
  figs.sc06 = figure('sc06','Pseudobulk 把每个 sample×cell type 变成一列',
    text(25,30,'One toy gene; equal total library sizes are assumed for ratios')+
    [['A / Control','2 + 3 = 5'],['A / Treatment','4 + 6 = 10'],['B / Control','7 + 3 = 10'],['B / Treatment','10 + 10 = 20']].map((r,i)=>text(25,87+i*52,r[0])+box(250,57+i*52,205,42,r[1])+text(485,87+i*52,i%2?'T=1':'T=0',16)).join('')+
    text(25,310,'2 donors × 2 conditions → 4 columns; not 8 independent cells.',16),
    '同type内按donor×condition求和得到5、10、10、20。若总library size相等，两个donors的descriptive fold change均为2；两位donor仍不足以支持稳健的一般化结论。');
  figs.sc07 = figure('sc07','Cell score 与 condition-level GSEA 回答不同问题',
    text(25,30,'Toy score = mean(signature) − mean(control); not UCell formula')+
    rect(25,64,270,70)+text(160,88,'Cell A',17,'#17385f','middle')+text(160,118,'(1+3)/2 − (2+2)/2 = 0',15,'#17385f','middle')+rect(345,64,270,70)+text(480,88,'Cell B',17,'#17385f','middle')+text(480,118,'(4+6)/2 − (2+2)/2 = 3',15,'#17385f','middle')+
    text(25,180,'Cell score: one number per cell, on chosen expression scale',17)+
    line(40,236,596,236,'#315f91',3)+[5,2,0,-1,-3].map((v,i)=>circle(65+i*127,236,6,i<2?'#167768':'#2c63a3')+text(65+i*127,267,String(v),17,'#17385f','middle')).join('')+
    text(25,310,'GSEA input: ranked donor-level gene statistics for a contrast',16),
    '自编mean-minus-control分数为0与3，展示signature score的单位。下方5、2、0、−1、−3是另一个contrast的gene statistics；两类输出不可互换。');
  figs.sc08 = figure('sc08','同一个位置，要先换到同一个 coordinate system',
    text(25,30,'Synthetic calibrated image coordinates: 0.5 µm / pixel')+
    box(25,70,240,60,'Image: (x,y) = (100,50) px')+line(265,100,350,100)+box(350,70,265,60,'Physical: (50,25) µm')+
    text(25,176,'Then translation (10,20) µm:')+box(350,151,265,60,'Registered: (60,45) µm')+
    rect(35,230,80,60,'#b6d0ee')+rect(115,230,80,60,'#e1efdd')+rect(195,230,80,60,'#f7d6b5')+text(340,254,'Spot / bin / segmented cell',18)+text(340,288,'are different observation units.',17),
    '先用校准0.5 µm/px把(100,50)px变为(50,25)µm，再加translation(10,20)µm得到(60,45)µm。示意矩形代表不同observation units，不代表某平台实际尺寸。');
  const agg=math.softAggregate([10,6],[[.8,.2],[.25,.75]]);
  figs.sc09 = figure('sc09','Assignment uncertainty 会进入 cell×gene 矩阵',
    box(25,63,150,55,'Bin 1: G=10')+box(25,210,150,55,'Bin 2: G=6')+
    line(175,90,450,90,'#2c63a3',5)+line(175,90,450,237,'#a7c2df',2)+line(175,237,450,90,'#a7c2df',2.5)+line(175,237,450,237,'#167768',4.5)+
    text(235,69,'0.80 × 10 = 8',16)+'<rect x="228" y="130" width="146" height="22" fill="#fff"/><rect x="228" y="169" width="151" height="22" fill="#fff"/>'+text(235,147,'0.20 × 10 = 2',16)+text(235,186,'0.25 × 6 = 1.5',16)+text(235,276,'0.75 × 6 = 4.5',16)+
    box(450,63,165,55,`Cell A: ${agg[0]}`)+box(450,210,165,55,`Cell B: ${agg[1]}`)+
    text(25,30,'Weights sum to one per bin in this toy two-cell system')+text(25,315,'9.5 + 6.5 = 16, but fractional expected counts are not observed integers.',16),
    'Bin counts为10与6，weights分别[0.8,0.2]和[0.25,0.75]；soft sums为9.5与6.5，总数保持16。保守总量不保证assignment正确，也不自动满足integer count模型输入。');
  const W=[[0,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,0]];
  figs.sc10 = figure('sc10','同样四个值，空间排列改变 Moran’s I',
    text(25,30,'Four-node chain; symmetric binary weights, no self edges')+
    [0,1,2].map(i=>line(90+i*150,105,240+i*150,105)).join('')+
    [1,1,3,3].map((v,i)=>circle(90+i*150,105,24,v===1?'#b6d0ee':'#2c63a3')+text(90+i*150,111,v,18,v===1?'#17385f':'#fff','middle')).join('')+
    text(25,160,`Mean=2; z=[−1,−1,+1,+1]; I=${math.moran([1,1,3,3],W).toFixed(3)}`,17)+
    [0,1,2].map(i=>line(90+i*150,222,240+i*150,222)).join('')+
    [1,3,1,3].map((v,i)=>circle(90+i*150,222,24,v===1?'#b6d0ee':'#2c63a3')+text(90+i*150,228,v,18,v===1?'#17385f':'#fff','middle')).join('')+
    text(25,281,`Alternating arrangement: I=${math.moran([1,3,1,3],W).toFixed(3)}`,17)+text(25,313,'Statistic changes with graph weights; significance needs a null model.',16),
    '固定chain graph、symmetric binary weights时，[1,1,3,3]给I=1/3，[1,3,1,3]给I=−1。未做row normalization；这些数不是显著性或一般取值边界。');
  figs.sc11 = figure('sc11','Niche 是定义好的邻域组成，不是因果作用',
    circle(170,165,30,'#8a6b46')+text(170,171,'S',20,'#fff','middle')+
    line(170,165,80,75)+line(170,165,280,80)+line(170,165,250,260)+
    circle(80,75,25,'#2c63a3')+text(80,81,'T',18,'#fff','middle')+circle(280,80,25,'#2c63a3')+text(280,86,'T',18,'#fff','middle')+circle(250,260,25,'#167768')+text(250,266,'B',18,'#fff','middle')+
    text(355,72,'Neighbors only; exclude S',18)+box(350,105,260,55,'T fraction = 2/3')+box(350,190,260,55,'B fraction = 1/3')+
    text(25,315,'Contact, RNA co-expression and functional signaling are separate evidence.',16),
    '中心S有三个定义好的邻居：两个T、一个B；不含中心的composition为2/3和1/3。改变radius、cell labels或是否包含中心，会改变niche定义。');
  figs.sc12 = figure('sc12','先按 donor 分开，再让所有下游步骤服从这个边界',
    text(25,30,'Synthetic hierarchy: 6 donors × 2 sections × 1000 cells')+
    [['A','B','C','D'],['E'],['F']].map((group,g)=>text(25,90+g*78,['Training','Validation','Test'][g])+group.map((id,i)=>box(160+i*110,59+g*78,98,48,`${id}: 2000`,g===0?'#e9f1fa':g===1?'#e0f1ed':'#fff0e4')).join('')).join('')+
    text(25,300,'12,000 cells; 6 donors. A single held-out donor illustrates the split;',15)+text(25,322,'it does not provide a robust population benchmark.',15),
    '每位donor的两个sections各1000cells，合计12,000cells。示意按A–D/E/F划分；同donor全部sections留在一侧。单个test donor不足以可靠估计人群泛化。');

  const chapters = [
    {
      id:'sc01',title:'scRNA-seq 与 snRNA-seq：一个 count 如何找到它的 cell',subtitle:'先读 barcode、UMI 和 assay，再解释 gene×cell 矩阵。',
      intuition:['把一次采样想成许多贴有地址的小袋子。Cell barcode帮助追踪袋子，UMI帮助区分被扩增的分子；两种标签解决不同问题。','Input是assay-specific reads与reference；Output是gene×barcode counts和QC报告。Barcode被判为cell，仍不保证里面只有一个真实cell。'],
      core:'Assay & counting',prereq:['d02','d04','d07'],goals:['逐步区分reads、UMIs和cells','比较scRNA与snRNA的测量偏倚','把assay和counting规则写入分析记录'],
      sections:[
        ['从分子标签到一列 counts',figs.sc01+paragraph('在UMI-based assay中，cDNA经历扩增后，一个原始分子可能对应多条reads。Pipeline先识别cell barcode、UMI和序列，再做alignment、gene assignment和UMI纠错/去重。真实流程要处理barcode errors、UMI collisions和multi-mapping；图故意暂时忽略这些因素以拆清单位。Cell barcode不是donor ID，后者要通过sample metadata或明确的multiplexing规则关联。'),['scCellRanger']],
        ['六步建立可信输入',steps(['记录organism、chemistry、scRNA/snRNA、3′/5′或full-length、reference genome及annotation版本。','检查read结构；不能把barcode/UMI reads当普通RNA reads随意trim。','运行匹配assay的counting workflow，保存filtered与unfiltered barcode matrices及web summary。','按barcode连接gene×cell矩阵和cell metadata，并验证顺序、唯一性与sample前缀。','检查每个capture的called barcodes、reads、UMI、genes、mapping与background，再决定后续QC。','保留original counts；把sample、donor、condition、batch和capture作为不同字段。']),['scCellRanger','scSeurat']],
        ['何时选scRNA或snRNA，怎样设置',paragraph('scRNA更接近捕获完整cell时的RNA组成；snRNA从nuclei出发，常用于难解离或冷冻材料，但nuclear/cytoplasmic coverage和intronic signal不同。具体适用性由组织、保存方式、assay和目标gene决定。比较两种assays时，先核对annotation、intronic counting和gene detection差异。不能把一种方案较低的mitochondrial fraction直接当质量更高，也不能用统一threshold证明两种assay可交换。'),['scCellRanger','scScanpy']],
        ['从Bulk转到single-cell时保留什么',paragraph('Bulk demo里的sample-ID对齐、design与contrast仍成立；变化是每位donor下多了cells这一层。Whole-transcriptome UMI assay可以估计许多gene的相对表达，targeted panel只覆盖设计的genes；full-length non-UMI counts又有不同重复处理。分析应先说明count的生成规则，再选normalization和模型。若零很多，先查assay coverage与depth；一个zero不等于该gene在生物学上绝不存在。'),['scCellRanger','scOSCA']]
      ],
      worked:['5条reads怎样变成3个cell-specific molecules？',['R1和R2都来自A、G、U1，在理想去重下合为1。','R3来自A、G、U2，使A的G count变2。','R4和R5来自B、G、U1，合为B的1；不同barcodes里的U1不是同一个分子。','矩阵G这一行为[A=2,B=1]；reads总数5、UMI总数3、barcodes数2分别回答不同问题。']],
      terms:[term('Cell barcode','标识assay中捕获分区的序列标签。','scCellRanger','同一gene的U1在barcode A与B内分别计数。','Barcode被叫作cell不保证它包含一个且仅一个cell。'),term('Unique molecular identifier','用于区分扩增前分子来源的短序列标签。','scCellRanger','同barcode、gene、UMI的两条理想reads合为一个计数。','UMI去重仍受errors、collisions和assignment规则影响。'),term('Single-nucleus RNA-seq','从分离nuclei获得RNA测量的assay。','scCellRanger','冷冻材料的nuclei与完整cells可有不同gene coverage。','snRNA与scRNA的counting和QC规则不能未经核查直接互换。')],
      check:['两条reads的UMI相同但barcode不同，是否应去重成一个分子？','不应只按UMI合并。去重需结合barcode、gene与pipeline规则；不同barcodes可能对应不同捕获分区。'],
      lens:['Assay-specific reads、barcode/UMI结构、raw/filtered矩阵和QC summary。','矩阵通常gene×barcode；reads、molecules、cells、donors是不同单位。','Calling与counting是模型和规则的输出，不能把每列自动当作独立生物重复。',['scCellRanger','scOSCA']]
    },
    {
      id:'sc02',title:'Single-cell QC：把低质量、ambient RNA 和 doublets 分开诊断',subtitle:'先按capture看多种证据，再作可追踪的过滤决定。',
      intuition:['一份袋中混入外面的碎屑，与两份样本被装在同一袋，是两种不同故障。过滤count太少只解决其中一部分。','Input是counts、capture metadata和background信息；Output是保留/排除标记、correction结果与敏感性记录。'],
      core:'Quality control',prereq:['sc01','d01'],goals:['手算QC比例并识别分母','区分ambient contamination和doublets','设计sample-aware thresholds与敏感性检查'],
      sections:[
        ['每个QC指标只看到问题的一面',figs.sc02+paragraph('nCount/total UMI反映被捕获总量，nFeature反映检测到的gene数，percent.mt是指定mitochondrial genes占总count的比例。较高mt%可能伴随受损细胞，但也受cell type、assay和物种注释影响。High-count barcode可能是真实large cell，也可能是doublet；同型doublets尤其不容易靠混合markers识别。图中20%只是教学阈值。'),['scSeurat','scDoublet']],
        ['逐步处理三种问题',steps(['按sample/capture画library size、detected genes、mt%及两两关系，保留过滤前数量。','检查空液滴或unfiltered矩阵能否支持background估计；ambient RNA可能让无关类型出现少量高丰度marker。','用适合输入的ambient方法估计污染，比较marker、总量与稀有群体在correction前后的变化。','按真实capture组织doublet detection，记录expected doublet rate、随机seed和score阈值。','联合QC与细胞生物学标记决定排除，保存每条rule与每个sample去除比例。','重复关键分析于合理阈值范围，检查是否选择性移除了某condition或cell type。']),['scSoupX','scDoublet','scScanpy']],
        ['参数如何选，何时需要修改',paragraph('Expected doublet rate应结合assay loading和capture设计，而非强迫每个sample删同一比例。scDblFinder的sample/capture划分与classifier模式应对应实际实验；文档里的示例数值不是跨组织默认答案。Ambient correction需要可识别background和合理细胞表达假设；若“去污染”后相关cell type的关键gene整体消失，应检查过度校正。先去明显empty droplets，再结合方法要求安排QC与doublet步骤。'),['scDoublet','scSoupX']],
        ['优点、局限与spatial迁移',paragraph('多证据QC能减少明确技术伪影，也允许解释为什么一个barcode被删除；代价是过滤本身会改变cell composition。Spatial的背景、漏分配、组织外bins、低质量decoded transcripts与segmentation错误需要专门QC，不能直接套droplet双细胞分类器。将“每sample保留多少objects、为什么去除、替换规则后结果如何”作为最终结果的一部分。'),['scDoublet','scXenium','scSpaceRanger']]
      ],
      worked:['哪个barcode会被示意20% mt阈值标记？',['C1：50/1000=5%；C2：180/1200=15%。','C3：160/400=40%；C4：90/3000=3%。','按“mt%>20%”只标记C3；不能由此宣布C1/C2/C4完全合格。','C4有较高总counts，要结合genes、markers与doublet score；若属于large-cell type，机械过滤可能误删生物信号。']],
      terms:[term('Ambient RNA','来自周围游离RNA等来源的背景污染信号。','scSoupX','高丰度secreted-gene reads可在不相关barcodes中出现。','少量marker不一定表示cell identity，correction也依赖假设。'),term('Doublet','同一捕获分区含两个细胞而形成混合profile。','scDoublet','两个不同类型的markers共现可提示heterotypic doublet。','共现不是充分证据，同型doublets可能难以检测。'),term('Mitochondrial fraction','指定mitochondrial features的counts占总counts比例。','scSeurat','160个mt counts除以400总counts等于40%。','比例依赖gene注释、assay和cell type；不能用固定值判断全部组织。')],
      check:['治疗组有30% cells被QC去除，对照只有5%；直接继续DE足够吗？','应先检查assay、capture、cell-type与损伤差异，报告排除原因并做敏感性分析。QC选择可能改变比较对象；更多保留cells不能自动消除偏倚。'],
      lens:['每capture的barcode QC、background信息、doublet scores与排除日志。','过滤单位是barcode/object，推广单位通常仍是donor或实验sample。','保留不等于真实singlet，correction与过滤会改变composition和结论范围。',['scDoublet','scSoupX']]
    },
    {
      id:'sc03',title:'Counts、log-normalized data 与 SCTransform residuals 不能混用',subtitle:'先给每个layer写清数值含义，再把它交给下一步。',
      intuition:['同一张照片可保存原图、亮度调整图和边缘图；它们来自同一对象，却不是同一种像素值。表达矩阵的layers也如此。','Input是raw counts；Output包括用于表示学习的normalized data或residuals，原counts应能回溯。'],
      core:'Representation & scale',prereq:['sc01','d04'],goals:['手算library scaling与log1p','解释sparse zero和dense residuals','选择与downstream方法匹配的layer'],
      sections:[
        ['算一次normalization，再给结果命名',figs.sc03+paragraph('Library-size scaling把一个cell的counts相对总量缩放；log1p压缩数值跨度。它便于观察相对表达，但不保证恢复每cell绝对RNA数量。Sparse matrix把大量zero高效保存，zero不是missing值的通用替身。Seurat v5的counts、data、scale.data或AnnData的X/layers都必须记录具体处理；字段名本身不能替你证明其中存的是raw counts。'),['scSeurat','scIntegrate']],
        ['逐步保留数据血缘',steps(['导入后验证counts非负且来源清楚，保存immutable原始副本或独立layer。','按方法选择library normalization+log1p，或SCTransform等明确的建模路线；不要把两套完整流程无理由叠加。','记录normalization target、log底数、HVG选择和regression covariates。','记录PCA用的是哪个matrix及哪些genes。','做donor pseudobulk时返回适用的observed integer counts并求和，不对log值求和。','导出包含layer说明、feature IDs、cell metadata及package versions的对象。']),['scSCT','scIntegrate','scOSCA']],
        ['SCTransform的机制与设置',paragraph('SCTransform用count模型估计与depth相关的技术部分，并构造variance-stabilized representation；它并不只等于“每列除以总数”。Seurat v5默认SCT v2，但分析应记录实际版本与vst.flavor。Pearson residuals可以为负：这是相对模型期望的偏差，不是负RNA。vars.to.regress需有科学理由；把与目标condition相关的biological变量回归掉，可能移除要研究的变化。'),['scSCT']],
        ['内存、误用和方法选择',paragraph('Log-normalization较直接、容易手算；model-based normalization可能更好处理depth–variance关系，但增加假设和计算。Sparse counts可很小，center/scale后的dense matrix可能很大：20,000 genes×100,000 cells×8 bytes仅数值就约16GB。避免随手as.matrix；只对所需features做dense操作，并留足对象复制开销。给NB count model输入negative residuals或把soft counts四舍五入，都不能恢复原始测量。'),['scSeurat','scSCT','scOSCA']]
      ],
      worked:['两个cell的raw counts相差10倍，为何normalized value相同？',['A的gene count=2、total=100；B为20、total=1000。','两者相对份额都为0.02；target=10,000后均为200。','自然对数log1p为ln(201)≈5.303；这不是200个实际分子。','若改target，数值尺度会改变；若要比较absolute RNA，需要额外assay校准与假设。']],
      terms:[term('Sparse matrix','只显式保存非零项以减少存储的矩阵表示。','scSeurat','一个gene×cell矩阵可有大量零而只有少量nonzero entries。','Sparse zero不是自动缺失；转换dense可能造成巨大内存开销。'),term('Log-normalization','在明确library scaling后进行对数变换的表示。','scSeurat','2/100×10,000=200，再log1p得到约5.303。','Log值不能当observed integer count交给要求raw counts的流程。'),term('Pearson residual','观测相对count模型期望、按模型方差标准化的偏差。','scSCT','Residual为负表示低于模型期望，不是负RNA。','Residual所含模型与covariates决定其意义，不能和raw count混称。')],
      check:['为了做Pseudobulk，把每个cell的log1p counts相加可以吗？','不能把这种和解释为raw-count Pseudobulk。Log后相加不等于先加counts再log；应按sample×type求和适用的原始counts，并在聚合后走对应normalization/model流程。'],
      lens:['原始counts及normalization、residual、PCA layers的处理记录。','每个layer保持同样feature/cell身份，但数值单位和允许操作不同。','可比较的表示不等于absolute abundance；必须满足下游模型的输入假设。',['scSCT','scOSCA']]
    },
    {
      id:'sc04',title:'HVG → PCA → neighbors → Leiden：每个设置改变哪一步？',subtitle:'Cluster不是输入标签，而是表示与图选择共同产生的结果。',
      intuition:['先挑哪些特征描述一个对象，再定义两个对象有多近，最后才把近邻聚成群。换量尺或邻居数，群也会改变。','Input是经过说明的expression representation；Output是PC scores、graph和cluster labels。UMAP主要帮助展示这些关系。'],
      core:'Graphs & clustering',prereq:['sc03'],goals:['区分HVG、PCs、neighbors和resolution','手算简单neighbor选择','用markers与stability审查clusters'],
      sections:[
        ['一条neighbor edge来自一个明确的距离',figs.sc04+paragraph('HVG selection挑选有信息的features；PCA把这些features的变异压到坐标轴；kNN用选定维度与metric找邻居；Leiden等community detection再划分图。UMAP会损失高维信息，图上空隙和cluster面积不能直接解释为生物距离或cell abundance。不同HVG flavor对raw/log输入有要求，先看当前API。'),['scScanpy','scSeurat']],
        ['一步一步运行并保存中间产物',steps(['固定QC后cells与可追溯的normalization layer。','选择HVG数与batch-aware策略，查看是否被mt、ribosomal、stress或assay artifacts主导。','运行PCA，检查PC loadings、variance、donor/batch关联，而非只看elbow图。','构建neighbors，记录n_pcs/dims、n_neighbors/k、metric与seed。','扫描一小组resolution，并检查每个cluster跨donor是否存在、markers是否一致。','用UMAP显示，保存graph与labels；对重要结论改变HVG、PCs和k作稳定性检查。']),['scScanpy','scSeurat']],
        ['怎样设置，怎样解释优点和代价',paragraph('较少PCs可能丢失稀有状态，过多PCs可能把noise引入距离；较大k倾向连接更广的局部范围，也可能跨越细小边界。Resolution控制community partition的粒度，但并非“值翻倍就让cell types翻倍”。合理范围依赖样本量、组织异质性和测量depth；示例教程中的20/30 PCs或某个resolution都不是标准答案。图方法灵活、可扩展，但结果依赖前处理。'),['scScanpy','scSeurat']],
        ['遇到只有一个donor的cluster时先查什么',paragraph('先检查sample-specific QC、capture、doublets、markers与coverage，再考虑它是否是稀有生物状态。Cluster标签本身不能证明cell type；FindAllMarkers等探索性结果仍可能受到用同一数据选cluster再检验的选择影响。需要预测新donors时，feature selection、PCA、integration等学习步骤应进入训练流程，而非先全数据处理后再宣称held-out评价。'),['scScanpy','scReplicate']]
      ],
      worked:['Q的最近两个邻居是谁？',['令Q=(0,0)，A=(1,0)，B=(0,2)，C=(3,0)。','Euclidean distances分别√1=1、√4=2、√9=3。','k=1仅连A；k=2再连B。真实graph可能经过symmetrization或其他weighting，需要记录。','这一步尚未定义cell identity；若把PC2缩放，距离与neighbor也可能改变。']],
      terms:[term('Highly variable genes','按明确均值–变异规则选择的候选informative features。','scScanpy','HVG选择可在多个samples中检查重复出现的变异features。','高变异可能来自技术伪影或stress，不保证等于生物身份gene。'),term('Neighbor graph','用选定表示和距离连接相近observations的图。','scScanpy','Q到A/B/C距离1/2/3，k=2连接A与B。','Expression neighbors不等于tissue physical neighbors。'),term('Clustering resolution','community detection中的粒度控制参数。','scScanpy','比较一组resolution并检查marker与donor稳定性。','参数值与真实cell-type数量没有固定一一对应。')],
      check:['两个UMAP islands离得远，是否足以说明它们发育距离远？','不足。UMAP投影失真、neighbor设置、batch与sampling都会影响位置。应回到高维表示、markers、trajectory假设及独立时间/lineage证据。'],
      lens:['HVG list、PC loadings/scores、neighbor graph、cluster labels与seeds。','每点cell；expression-space edge与physical-space edge须明确区分。','Clustering是分析结果；marker、replication和stability共同约束生物解释。',['scScanpy','scSeurat']]
    },
    {
      id:'sc05',title:'Integration 与 annotation：对齐相似细胞，同时保留要比较的差异',subtitle:'用于共同坐标的表示，不自动成为condition DE的输入。',
      intuition:['不同相机的色偏可以校正，但如果两个样本本来颜色不同，强行调成一样就会抹掉信息。Integration必须知道哪些差异可以被对齐。','Input是多sample的profiles与metadata；Output是aligned representation或映射标签、匹配分数和不确定性。'],
      core:'Integration & identity',prereq:['sc04','d01'],goals:['识别technical与biological不可分的设计','区分integrated reductions和原counts','用marker与reference coverage审查annotation'],
      sections:[
        ['漂亮混合不能证明integration正确',figs.sc05+paragraph('Integration可帮助跨batch寻找共享cell states，但目标不是让所有samples完全混合。若condition与batch完全重合，仅靠数据往往不能识别某段差异应被删除还是保留。Seurat v5可比较不同整合方法及不整合baseline；保留原counts和各layer，记录究竟对齐了embedding还是expression。'),['scIntegrate']],
        ['逐步建立可以解释的annotation',steps(['先在每sample中检查QC、主要markers和cell-type覆盖，再选择integration。','写清要保留的biological variation以及要控制的技术因素。','比较未整合与整合表示，检查shared types是否对齐、condition-specific states是否被压平。','用多个正/负markers、reference mapping和独立protein/image证据评估cell labels。','对低score、混合markers和reference缺失类型保留unknown或粗粒度标签，记录版本。','进行condition DE时回到合适原始count层并按replicate建模；不要把integration改写后的数值默认当NB counts。']),['scIntegrate','scOSCA','scSeurat']],
        ['何时用、如何选设置',paragraph('当多个batches存在可共享的types/states，integration有助于建立共同坐标；reference缺失关键病理状态时，强制mapping会给出误导性最近标签。检查HVG、integration features、dims、reference选择、batch字段、regularization与训练epochs等具体方法设置。优点是便于跨平台比较，代价是可能oversmooth、丢失稀有状态或依赖不匹配reference。以生物保留与技术去除两方面评估。'),['scIntegrate','scMapping']],
        ['标注与检验形成闭环',paragraph('Labels有层级：先确认immune/epithelial等宽类，再细化subtypes，并保留conflicting marker evidence。用同一marker完成annotation后再报告该marker能“验证”类别，是循环证据；可以将独立gene panels、protein或histology用于验证。空间deconvolution输出通常是location中各类型的估计丰度，而不是把每个spot变成一个已知cell。'),['scMapping','scIntegrate']]
      ],
      worked:['减去10后完美重叠，为什么还不能宣布成功？',['Dataset A的X/Y为2/8；Dataset B为12/18。','若+10完全来自technical offset，减10保留了X/Y之间的6单位差。','若+10恰是treatment真正改变了两类细胞，减10就移除了目标效应。','需要跨batch的condition覆盖、controls或外部证据判断；几何重叠自身不能作决定。']],
      terms:[term('Integration','在明确假设下对齐多个数据集的共享表示或状态。','scIntegrate','比较整合前后shared types与condition-specific states。','完美batch mixing不等于生物保留，更不能修复完全混杂。'),term('Label transfer','用reference中的已知标签为query提供预测annotation。','scIntegrate','低mapping score的query可保留unknown而非强制细分。','Reference没有的类型仍可能得到最近标签，必须检查coverage。'),term('Overcorrection','校正过程移除了需要研究的biological variation。','scIntegrate','把真实treatment引起的+10变化当batch全部扣除。','必须同时评估batch removal与biology preservation。')],
      check:['整合后的UMAP按condition完全混合，是否可以据此说treatment没有作用？','不能。Projection与integration可能掩盖真实变化；应使用预定contrast、replicate-aware原counts分析，并检查integration前后的生物信号保留。'],
      lens:['原始count layers、未整合/整合reductions、reference标签与mapping scores。','Label、embedding coordinate和observed count是不同类型的输出。','Reference coverage与confounding限制annotation/DE；未知状态应能保留未知。',['scIntegrate','scOSCA','scMapping']]
    },
    {
      id:'sc06',title:'从Single-cell回到Pseudobulk：contrast先于检验',subtitle:'沿用Bulk demo的count模型，同时重新定义一列代表谁。',
      intuition:['把同一位donor的某类cells汇总，是为了估计这个sample的表达；多个donors才提供“别人是否也如此”的信息。','Input为raw counts、cell type与sample/donor metadata；Output为gene×sample矩阵和预定contrast下的gene-level effects。'],
      core:'Replicate-aware inference',prereq:['sc02','sc05','r12'],goals:['构建sample×type聚合表','区分paired与unpaired design','分别估计within-type expression与composition变化'],
      sections:[
        ['先数独立单位，再数cells',figs.sc06+paragraph('若问题是某condition对一种cell type的平均表达影响，先在每个biological sample内sum适用的integer raw counts。Group key通常是sample×cell type；同donor多个conditions或sections需要额外design结构，不能随手全部合成donor一列。Cells增加可以改善同sample测量，但不能把两位donor变成八个独立replicates。'),['scOSCA','scReplicate']],
        ['把Bulk流程逐步迁移',steps(['建立sample×type表，列出donor、condition、batch、cell count和total counts，包括缺失组合。','按预先设定minimum cells/coverage规则判断哪些sample×type可分析，记录排除原因。','Sum raw counts并按sample ID重排metadata；验证grouping和计数总量。','在聚合矩阵上做gene filtering、normalization、sample QC和dispersion估计。','配对数据可用~donor+condition；独立组则按可识别的covariates建模，不为每个唯一donor机械加固定效应。','定义contrast方向，检查rank、outliers与replicate effects，输出effect、SE/CI、p-value和FDR。']),['scOSCA','scReplicate']],
        ['怎么设置，何时换模型',paragraph('Minimum cells不是统一常数：看type的稀有程度、coverage、donor数和aggregation稳定性，检查多个合理阈值。少donors却放很多covariates会消耗自由度。Mixed models可表达更复杂依赖，但并不创造replicates；不应因为它“用了所有cells”就默认更可信。缺失type的sample不是一列全zero表达：它可能没有这个群体或没有采到，应明确分析对象。'),['scOSCA','scReplicate']],
        ['Expression与abundance必须分开',paragraph('某type比例升高与该type每sample表达改变是不同estimands。先用sample×type counts研究composition，再用type内Pseudobulk研究expression；不要把二者混成“pathway被激活”。若spatial counts是soft assignment的fractional期望值，不能无说明round后套DESeq2。可比较hard assignment、独立region aggregates和uncertainty-aware策略，说明每个选择改变了什么。'),['scOSCA','scReplicate','scMapping']]
      ],
      worked:['为两位配对donors构建四列', ['A-Control：2+3=5；A-Treatment：4+6=10。','B-Control：7+3=10；B-Treatment：10+10=20。','列顺序AC/AT/BC/BT的design可为[Intercept,DonorB,Treatment]：[1,0,0],[1,0,1],[1,1,0],[1,1,1]。','只有在总library sizes等可比假设成立时，toy表达比均为2；正式模型仍估计normalization和dispersion，两donors只是算术练习。']],
      terms:[term('Pseudobulk aggregation','在biological sample和指定cell group内汇总原始counts。','scOSCA','两个cells的gene counts为2和3，sample×type列中该gene为5。','不能把同donor不同conditions无条件合并，也不能sum log值冒充counts。'),term('Paired contrast','利用同一实验单位在不同conditions下的配对关系定义比较。','scOSCA','AC/AT和BC/BT可用donor项控制baseline再估计Treatment。','只有存在实际配对，donor+condition才有相应含义；应检查design rank。'),term('Differential abundance','比较cell groups在sample层面的丰度或composition变化。','scReplicate','T-cell比例升高与T-cell内某gene表达升高是两种问题。','Relative proportion变化不能唯一推出absolute cell number变化。')],
      check:['每组只有一位donor但各有20,000 cells，能用cells当replicates推断condition吗？','不能据此得到donor层面的可推广condition效应。Condition与donor完全混杂；增加cells不修复独立replication。可描述这两个samples，并说明需要更多donors。'],
      lens:['Gene×sample Pseudobulk counts、sample×type coverage与design/contrast。','每列是明确的biological sample×type；donor与sample依赖关系另行建模。','Aggregation保护replicate层级，但稀有types、缺失组合与混杂仍限制推断。',['scOSCA','scReplicate']]
    },
    {
      id:'sc07',title:'Pathway score、ORA 与 GSEA：先确定你要给谁一个答案',subtitle:'一个cell的signature score，不等于一个condition contrast的enrichment检验。',
      intuition:['给每位学生算阅读兴趣分，与检验两班谁的某类题整体排名靠前，是两道题。它们可以互补，却不能交换p-values。','Input可以是cell-level expression、selected gene list或完整signed ranking；Output分别是score、ORA结果或GSEA结果。'],
      core:'Functional interpretation',prereq:['sc03','sc06','r03'],goals:['比较三种functional analysis的输入与null','理解score对gene coverage的依赖','将Pathway/Age推断放回donor层级'],
      sections:[
        ['先读score的定义与单位',figs.sc07+paragraph('图中的mean-minus-control是原创简化例子，不是UCell公式。真实UCell采用within-cell rank相关统计，其他module scores可减去匹配control genes。Score依赖gene set、表达层、missing genes、ranking上限或control selection。它通常不是pathway activation probability，也不是代谢flux。即使gene-set名字含“activity”，也要说明测的是RNA signature。'),['scUCell','scModuleScore']],
        ['一步一步选择分析路径',steps(['问题若是“哪些cells更富集一个预定signature”，选择明确的cell-level scoring方法并检查gene覆盖。','问题若是“选中的DE genes是否过多属于某set”，用ORA并固定tested-gene universe与阈值。','问题若是“condition effect的signed ranking是否在某set集中”，从donor-aware DE输出完整有限statistics后运行GSEA。','核对gene identifiers、物种、版本、duplicates和pathway大小过滤。','展示leading genes、expression及各donor结果；不要只展示一张dotplot。','把多个gene sets的检验family和FDR规则记录清楚；根据预设contrast解释方向。']),['scUCell','scEnrichment','scOSCA']],
        ['参数、优势和局限',paragraph('Rank-based score便于比较同一cell内的gene ordering，但稀疏、targeted panels和gene set缺失会影响可识别性；较短set容易由少数genes支配。ORA直观却依赖selection cutoff；GSEA避免先硬切DE名单，但仍受ranking、相关性和null model影响。不要对Up/Down拆分后的结果重新进行一套BH而称作原分析的FDR，也不要只对显著genes运行“全排名GSEA”。'),['scUCell','scEnrichment']],
        ['Pathway/Age与spatial怎样接起来',paragraph('可画每位donor、每cell type的score分布，再按研究设计比较donor summaries或合适hierarchical model。先检查年龄组是否有cell composition、batch或gene detection差异。Spatial score map显示位置上的RNA signature模式，不能自动证明局部通路因果作用；targeted panel未包含大部分set genes时，应报告coverage并限制比较范围。'),['scUCell','scReplicate','scXenium']]
      ],
      worked:['为什么cell score=3不能解释为三倍pathway活性？',['A的signature均值(1+3)/2=2，control均值(2+2)/2=2，所以toy score=0。','B的signature均值(4+6)/2=5，control均值2，toy score=3。','3是当前expression scale上的差值；它不是3倍、3%或p=0.03。','若要比较conditions，需跨independent donors建模；GSEA则使用gene-level contrast statistics的完整排序。']],
      terms:[term('Gene signature score','用预定gene set概括一个sample或cell表达模式的数值。','scUCell','Mean-minus-control toy score可为0或3，并依赖所选表达尺度。','Score一般不是activation概率，RNA signature也不是直接flux。'),term('Rank-based scoring','利用每个cell内gene排序而非仅绝对表达量构造score。','scUCell','UCell基于within-cell gene ranks计算signature分数。','Gene覆盖、ties和truncation仍影响解释，不能免除assay检查。'),term('Gene-set coverage','实际测到或可分析的set成员占定义gene set的覆盖情况。','scUCell','Targeted panel只含100-gene set里的8个genes，需明确报告。','少量成员的结果不能未经验证代表完整pathway。')],
      check:['某age组有更多高score的T cells，能直接说每个T cell的pathway都增强了吗？','不能。先分开cell composition、within-type distribution、donor结构和detection差异，再选择对应estimand与检验。总体更多高score cells不唯一决定每cell变化。'],
      lens:['预定gene sets、ID映射、cell scores或donor-aware完整gene rankings。','Cell score、selected-gene enrichment与condition-level ranking是不同单位。','RNA gene-set pattern支持有限功能假说，不直接证明protein activation或因果机制。',['scUCell','scOSCA','scXenium']]
    },
    {
      id:'sc08',title:'Spatial数据入口：spot、bin、transcript、cell 与坐标单位',subtitle:'分辨率、gene panel和物理位置一起决定可回答的问题。',
      intuition:['一张地图可以以街区、楼栋或房间统计人口；格子变细不会自动告诉你每个人住在哪间房。Spatial的spot/bin/cell也需要区分。','Input可能是counts+spot coordinates，也可能是decoded transcript points+segmentation；Output是有明确observation unit的空间数据对象。'],
      core:'Spatial measurement',prereq:['d07','sc01','d08'],goals:['比较capture与imaging-based spatial输出','转换pixel与physical坐标','验证每个matrix row/column与geometry的ID关系'],
      sections:[
        ['先统一坐标，再解释位置',figs.sc08+paragraph('Capture-based spatial用位置标签关联RNA测量，bin大小改变counts稀疏度与混合范围；imaging-based assays通过成像/解码形成transcript coordinates，常受targeted gene panel与解码quality约束。Segmentation是后续objects的定义之一。不同技术的“cell resolution”不保证所有RNA都被正确分配；相邻bin与真实cell边界也不是一回事。'),['scSpaceRanger','scXenium']],
        ['六步导入空间对象',steps(['读取assay与software版本、gene panel、reference、bin size及segmentation来源。','保存raw count matrix、barcodes、feature IDs、coordinate table、image、masks/polygons和scale factors。','按ID做一对一连接并检查丢失/重复；不要依赖文件恰好同一行序。','核对x/y、row/column、image origin、axis direction与px/µm单位。','将不同图层通过明确transformation置于同一coordinate system，叠加landmarks、组织边缘和内部结构检查。','按section显示tissue mask、counts/area、detected genes、background与assignment QC，并保留unassigned对象。']),['scCoordinates','scSpaceRanger','scXenium']],
        ['何时用哪种尺度，参数怎样设置',paragraph('大bin增加局部counts但混合更多cells；小bin更细但更稀疏，不能仅用“数字更小”判断更好。比较多个合理bin sizes以及研究目标的物理尺度。Radius等空间参数用µm时，先确认坐标真的已校准；使用降采样图像需同步scale。Panel-based数据做pathway或reference mapping前，应检查交集genes和negative controls，不能把未设计的gene当零表达。'),['scSpaceRanger','scXenium','scCoordinates']],
        ['从Bulk/Single-cell迁移时要新增的检查',paragraph('Sample-ID、counting单位、QC和replication都继续保留；新增geometry provenance与空间依赖。图像中的组织边界应与RNA坐标一致，section之间不得因为坐标数字接近就连neighbor edges。一个spot可包含多种cells，一个cell也可能跨多个bins。研究问题应分别表述为location-level pattern、cell-type abundance estimate或cell-level expression，而不是统称spatial表达。'),['scSpaceRanger','scCoordinates','scMapping']]
      ],
      worked:['100×50像素位置怎样变为registered physical坐标？',['使用已校准0.5 µm/px，得到x=100×0.5=50 µm，y=50×0.5=25 µm。','若之后translation为(10,20)µm，则得到(60,45)µm。','不能先把(10,20)当pixels相加再假装是同一种变换；单位与顺序会改变结果。','实际项目还须检查rotation、axis flips、nonrigid transforms和在held-out landmarks上的残差。']],
      terms:[term('Spatial observation unit','空间矩阵中一条观测代表的spot、bin或segmented object。','scSpaceRanger','同一组织可汇总为小bins、大bins或定义好的cell polygons。','更小bin不自动等于一个真实cell，也不自动提高assignment准确性。'),term('Coordinate system','给geometry定义axes、origin、units及变换关系的坐标体系。','scCoordinates','100px在0.5 µm/px校准下对应50µm。','Row/column、x/y和downsample scale混用会制造错误邻接。'),term('Targeted panel','实验预先选择并检测的gene集合。','scXenium','某gene未进入panel时，没有该gene的有效测量。','未设计的gene不能当作检测为零，也不能直接套全转录组背景。')],
      check:['image已缩到原来的0.2倍，但transcript坐标不变，会发生什么？','叠加位置会错位；需对相应坐标应用同一scale或使用显式transform。不能用“看起来大致对上”替代landmark和单位验证。'],
      lens:['Matrix、coordinates、images、masks、scale factors及assay/panel版本。','Spot/bin/cell/transcript是不同实体，px与µm及section IDs要保留。','空间分辨率和target coverage限制可辨识问题，geometry错误可传播到所有下游结果。',['scSpaceRanger','scXenium','scCoordinates']]
    },
    {
      id:'sc09',title:'Registration → Segmentation → Bin-to-cell：误差怎样进入表达矩阵',subtitle:'把assignment当成需要评估的推断，而不是数据整理中的已知真值。',
      intuition:['先把两张地图对齐，再画房间边界，最后分配每个点。前一步偏一点，后面的每个房间统计都可能改变。','Input是images、coordinates、count-bearing bins/transcripts和cell candidates；Output是assignment、unassigned类别、cell×gene汇总与uncertainty。'],
      core:'Spatial assignment',prereq:['sc08','r11','r12'],goals:['区分registration与segmentation误差','手算hard/soft assignment聚合','设计边界与uncertainty敏感性分析'],
      sections:[
        ['把assignment权重一路带到最终矩阵',figs.sc09+paragraph('Registration决定不同图层的位置对应，segmentation定义objects的边界，assignment再把bins/transcripts关联到objects。Hard assignment将每项交给一个对象，soft assignment保留多个可能归属；还应允许background/unassigned，不能强迫所有信号进入某个cell。图中的weights仅为预设toy数值，不是经过校准的posterior。'),['scCoordinates','scXenium']],
        ['逐步评价一个bin-to-cell流程',steps(['检查image–transcript配准，记录独立landmark residuals、units和transform版本。','检查nuclei/cell segmentation的split、merge、漏检与面积分布，按tissue region分层抽查。','定义候选cells、distance/shape/expression evidence与unassigned机制，说明哪些信息会被重复使用。','输出assignment表、confidence/entropy、candidate counts及unassigned rates，再汇总cell×gene。','对boundary expansion、registration perturbation、candidate radius与temperature等设置作敏感性分析。','用独立cell boundary/marker、人工审阅或明确synthetic ground truth评价；同时检查下游cell types和DE是否稳定。']),['scCoordinates','scXenium','scMapping']],
        ['何时用EM、RL或更简单的规则',paragraph('Nearest-boundary或固定核扩张可作可解释baseline。EM适用于把assignment设为latent variable并写出合理观测模型：E-step更新responsibilities，M-step更新参数；局部最优、初始化和model mismatch都要查。RL适用于明确的序列决策与reward，而不是因为“分配”就必然需要RL；reward若直接奖励下游marker purity，可能通过丢弃困难区域或循环使用expression获得虚高分。先比较同样数据/预算下的简单baseline。'),['scMapping','scCoordinates']],
        ['怎样解释不确定性和count model限制',paragraph('High confidence只代表当前模型倾向，可能是错设模型下的过度确定；应检查校准、候选遗漏和边界样本。Soft sums通常为fractional expected counts，既不是原始观察到的integer counts，也不因为总量守恒就可直接套任何NB流程。可报告hard/soft与unassigned敏感性、使用适合fractional输入的模型或保持独立region级分析；不要通过任意round制造“raw counts”。'),['scXenium','scOSCA','scMapping']]
      ],
      worked:['两bins分给两cells，为什么得到9.5与6.5？',['Bin1的G=10，weights A/B=0.8/0.2，贡献8和2。','Bin2的G=6，weights A/B=0.25/0.75，贡献1.5和4.5。','A=8+1.5=9.5；B=2+4.5=6.5，总和16与10+6相同。','若argmax hard assignment，则A=10、B=6；两种矩阵描述不同处理，不应隐去这种差别。']],
      terms:[term('Registration','用明确transform将不同图层放到对应位置的过程。','scCoordinates','配准后在独立landmarks上记录位置residual。','好看的overlay不保证边界处精度，也不能替代坐标单位核对。'),term('Segmentation','从图像等证据定义nucleus/cell等object边界。','scXenium','一个真实cell可能被split成两个polygons，或两cell被merge。','Nucleus边界不必等于完整cell边界，扩张是一个假设。'),term('Soft assignment','允许一个观测以不同weights分配给多个候选对象。','scMapping','10个counts按0.8/0.2贡献8和2；6按0.25/0.75贡献1.5和4.5。','Weights未必校准，fractional sums不等于observed integer raw counts。')],
      check:['调低temperature后每个bin都接近100% certainty，是否说明更准确？','不是。Temperature可让分布更尖而不增加证据；准确性需要独立truth或合理验证，且候选遗漏与model mismatch可能产生高置信错误。'],
      lens:['Transform、object masks、candidate/assignment表、unassigned与uncertainty。','同一bin/transcript的归属会改变cell×gene数值及后续cell identity。','Assignment是推断层；confidence、count类型和下游敏感性须一同报告。',['scCoordinates','scXenium','scMapping']]
    },
    {
      id:'sc10',title:'Spatial neighbors 与 Moran’s I：图的定义先于显著性',subtitle:'空间模式的强弱，取决于坐标、weights、null model与replication。',
      intuition:['一排房屋里相似颜色相邻，和同样颜色交错排列，是不同的空间模式。先说明哪些房屋算邻居，才能量化这种相似。','Input是位置、每点的gene/score和spatial graph；Output是autocorrelation statistic及在指定null下的检验结果。'],
      core:'Spatial statistics',prereq:['sc08','sc04','r03'],goals:['手算chain graph的Moran’s I','选择radius/kNN/grid并核对物理单位','区分pattern detection与跨donor condition推断'],
      sections:[
        ['权重矩阵决定你在问哪种邻近关系',figs.sc10+paragraph('Moran’s I=(n/S₀)Σᵢⱼwᵢⱼ(xᵢ−x̄)(xⱼ−x̄)/Σᵢ(xᵢ−x̄)²，其中S₀=Σw。它比较neighbor covariation与整体variation；constant values或没有edges时式子不可定义。图采用symmetric binary chain weights，未row-normalize。更换weights、self edges或normalization会改变数值；Moran’s I没有普遍固定在−1与1之间的保证。'),['scMoran']],
        ['从coordinates到可检查的test',steps(['在每个section内使用统一physical units，避免跨独立sections建立边。','选radius、kNN、grid或Delaunay；展示edge lengths、degree distribution与组织空洞附近的连接。','明确目标gene/score及expression layer，检查depth、composition和tissue density是否解释空间趋势。','按记录的weight normalization计算statistic，处理constant genes与孤立点。','定义permutation或模型null与multiple-testing family；保存seed和n_perms。','在独立sections/donors重复模式，再用replicate-aware设计比较conditions，避免把一个section的spots当多个donors。']),['scRadius','scMoran','scReplicate']],
        ['参数如何设置，软件版本怎样记录',paragraph('Radius用物理距离定义相互作用尺度，密集区域可有更多neighbors；kNN固定邻居数但边的物理长度可差异很大。对多个合理scales作预设敏感性分析，避免只挑最显著radius。Squidpy当前文档提供spatial_neighbors_radius等mode-specific函数；旧spatial_neighbors已标为deprecated，应按安装版本记录API。Spatial_autocorr的transformation、layer、n_perms和corr_method都影响解释。'),['scRadius','scMoran']],
        ['优点、局限与典型误读',paragraph('Autocorrelation可筛查structured genes/regions，帮助提出局部机制假说；它不能单独证明cell communication、diffusion或gene调控。Tissue compartments、cell density、library size或batch也可形成空间模式。打乱所有points的null并不适合所有有组织结构的问题；应保留需要控制的sample/region结构或选择适当模型。多张切片来自同一donor时，不能把所有局部p-values当独立生物复制。'),['scMoran','scRadius','scReplicate']]
      ],
      worked:['四点chain为什么得到I=1/3？',['x=[1,1,3,3]，mean=2，z=[−1,−1,+1,+1]，Σz²=4。','三条无向edge的z乘积为1、−1、1；symmetric W把每条计两次，numerator=2，S₀=6。','I=(4/6)×(2/4)=1/3。','换成[1,3,1,3]时三条edge乘积都−1，numerator=−6，I=−1。两者还没有计算p-value。']],
      terms:[term('Spatial weights matrix','编码哪些空间observations相邻及其权重的矩阵。','scRadius','四点chain有三条无向edges，对称矩阵总weight为6。','Normalization、distance units和是否跨section会改变问题。'),term('Moran’s I','比较空间neighbor covariation与整体variation的autocorrelation统计量。','scMoran','本章binary chain中的[1,1,3,3]得到1/3。','Statistic不是p-value，取值范围依赖weights而非一律−1到1。'),term('Spatial null model','指定在何种无关联假设下产生参考模式的规则。','scMoran','Within-section permutation与跨donor打乱不是同一个null。','错误null可把组织结构或依赖当成机制证据。')],
      check:['同一gene在一个section中Moran’s I显著，能说age改变了其空间模式吗？','不能。该检验回答指定null下的空间结构，不是age effect；需要多个独立donors、明确age比较和控制assay/region结构的设计。'],
      lens:['Coordinates、spatial graph、gene/score layer、weights和null设置。','点可为bin/spot/cell；neighbor数量与independent donor数不同。','Autocorrelation支持pattern而非机制；跨condition结论需要replicate层级证据。',['scRadius','scMoran','scReplicate']]
    },
    {
      id:'sc11',title:'Region、niche 与 ligand–receptor：把邻近证据放在正确位置',subtitle:'先定义空间对象，再逐级加强communication假说。',
      intuition:['两种人常在同一房间，不代表他们正在说话。知道谁在附近只是第一层，还需要信号、接收能力与功能反应。','Input为region/neighbor定义、cell labels、RNA/protein与数据库先验；Output是niche summaries与候选communication hypotheses。'],
      core:'Spatial context & communication',prereq:['sc05','sc09','sc10','r10'],goals:['手算邻域composition并说明分母','区分region effect与within-type response','给ligand–receptor结果设计独立验证'],
      sections:[
        ['Niche组成随邻域定义改变',figs.sc11+paragraph('Region可由histology、预设坐标或unsupervised spatial domains定义；niche常是某object周围的cell-type或state组成。定义是否包含中心、radius、边界处理和cell-type置信度后，比例才有明确意义。用expression定义region再检验同一expression特征，可能形成选择上的循环，应区分discovery与validation。'),['scRadius','scMapping']],
        ['逐步建立候选机制',steps(['预先说明region/niche定义的生物问题和物理尺度，保留histology或annotation来源。','计算每section每region的cell-type counts、area及neighbor composition，检查边界和sampling密度。','把候选sender/receiver放回空间位置，核查ligand、receptor subunits和cofactors的gene/panel coverage。','使用明确数据库版本与method估计候选scores，记录expression summary、threshold、permutation及distance条件。','在不同donors、regions与合理neighbor scales检查结果，显示支持和反例。','用protein/localization、receptor downstream response和perturbation/rescue等独立证据逐级验证。']),['scCellChat','scRadius','scXenium']],
        ['何时用、如何设置、有哪些代价',paragraph('这类方法适合从多类型组织提出可测试hypotheses，尤其适合有位置或配套protein evidence的研究。Database是否包含物种、complex subunits和已知cofactors，决定能测试哪些pairs。平均RNA、检测比例、低表达过滤、distance/radius与null设置会改变ranking。优点是整合先验与观察，局限是RNA不等于secreted protein或receptor activation，接触依赖与可扩散信号也需要不同空间假设。'),['scCellChat','scRadius']],
        ['比较conditions时要避免的捷径',paragraph('更大的network edge可能来自sender数量、receiver数量、library depth或annotation变化，不唯一表示每对cells通信更强。把cell-type composition变化与within-type ligand/receptor表达变化分开，再按donor比较；一个sample中几千pairs不等于几千独立生物重复。Targeted panel缺少必要subunit时应写不可评估，而不是把未测量当“不存在”。'),['scCellChat','scReplicate','scXenium']]
      ],
      worked:['中心S的niche如何得到2/3与1/3？',['先规定仅使用三条edges连接的neighbors，不把中心S计入分母。','Neighbors中T有2个、B有1个，所以T=2/3、B=1/3。','若把中心S也计入则分母变4，T=1/2、B=1/4、S=1/4；这已是不同定义。','两种定义都未证明T与S发生功能性signaling；需要独立分子与实验支持。']],
      terms:[term('Cellular niche','在明确定义邻域内对cell types/states及环境的概括。','scRadius','一个中心的三邻居为T/T/B，其neighbor composition为2/3与1/3。','Niche结果依赖radius、boundary与是否含中心，不是固定生物标签。'),term('Ligand–receptor inference','将表达与相互作用先验结合以提出communication候选的推断。','scCellChat','候选pair需检查sender ligand、receiver完整complex与空间相容性。','RNA共现和软件score不直接证明binding、secretion或功能反应。'),term('Receptor complex','由多个必要subunits共同组成的功能性受体结构。','scCellChat','若R1/R2都必需，仅有R1 RNA不能证明完整受体。','Panel缺少R2与R2真实不表达不是同一情况。')],
      check:['治疗组的T→Tumor edge score更大，是否代表每个T cell分泌更多ligand？','不一定。Cell composition、detection、平均表达与模型设置都可改变edge；应查看donor层面的类型丰度、ligand/protein及receiver response并做独立验证。'],
      lens:['Region/neighbor定义、cell labels、pair scores、database版本与独立信号证据。','Neighborhood、cell pair、region和donor代表不同统计层级。','邻近与表达相容性支持候选机制，不自动证明通信或因果。',['scCellChat','scRadius','scReplicate']]
    },
    {
      id:'sc12',title:'完整项目：Single-cell reference → Spatial mapping → Donor-level validation',subtitle:'让每一次处理都能追溯到研究问题、数据单位与验证边界。',
      intuition:['一条工作流不是把软件排成队，而是让每一步的输出真正回答下一步的问题。任何漂亮结果都要能追溯到它的测量与假设。','Input为replicated sc/snRNA reference、spatial assays与metadata；Output为有限的cell-type/region结论、uncertainty和可复现分析记录。'],
      core:'End-to-end study',prereq:['sc06','sc07','sc09','sc10','sc11'],goals:['设计可复用的joint workflow','把donor/section隔离贯穿训练与评价','用ablation与独立证据选择方法而非只看embedding'],
      sections:[
        ['先画数据层级，再决定能推广到哪里',figs.sc12+paragraph('若目标是对新donors泛化，split unit应是donor；同donor的sections、tiles、cells和重复assays必须留在同一侧。若只研究一个组织section内部的结构，结论就明确限制在该section，不把空间留块误称独立人群验证。六donor图只是展示层级，单个test donor不足以形成稳定的人群性能估计。'),['scReplicate','scOSCA']],
        ['十步搭起研究闭环',steps(['用一句话写estimand：within-type age effect、relative composition、region enrichment或assignment accuracy。','建立donor→sample→section/capture→object→file表，核查ID、missingness和纳排。','按目标预先划分donors与analysis roles，冻结独立验证数据。','分别完成single-cell和spatial assay QC，保留raw layers、geometry与versions。','在训练范围内定义reference types/features，保留unknown states并检查reference coverage。','先运行简单assignment/mapping baseline，再比较复杂模型；记录objective、hyperparameters与seed。','检查spatial mapping残差、posterior/assignment uncertainty、unassigned与region差异。','按sample/region/type构造适当aggregation和预定contrasts，分别分析expression、composition与spatial pattern。','用held-out donors、orthogonal markers/histology和预设扰动做validation与ablation。','导出figures、每步QC、完整结果、参数、环境与限制，复跑并确认从输入到结论的链条一致。']),['scMapping','scOSCA','scCoordinates']],
        ['如何比较模型并决定修改什么',paragraph('Spatial mapping若漏掉rare type，先检查reference/panel coverage，再调regularization或training；若边界错误多，先检查registration与candidate radius，再换更复杂classifier。Cell2location等模型输入与priors要按文档记录，例如unnormalized spatial counts和每location预期cell abundance的依据。比较methods时固定同样输入、splits和评价单位，同时报告accuracy、uncertainty、coverage、runtime与失败cases。'),['scMapping','scCoordinates']],
        ['最后一张图应该能支持什么结论',paragraph('Ablation可分别去掉image、expression、spatial prior或改变assignment规则，检查贡献是否符合机制预期；它不自动证明真实生物因果。若annotation用了某marker，尽量用未参与选择的证据验证。统计结果展示donor points与effect uncertainty，避免仅汇总成一张大UMAP。路径分析、neighbor enrichment、cell-type mapping与真实cell boundary分别回答不同问题，结论只跨到已有证据支持的那一层。'),['scMapping','scReplicate','scCellChat']]
      ],
      worked:['12,000 cells的项目到底有多少独立donors？',['6 donors×2 sections×1000 cells=12,000cells。','若donor是目标独立单位，n=6；sections和cells提供内部测量与异质性信息。','示意A–D训练、E验证、F测试时，各donor全部sections/cells跟随donor移动。','6 donors的泛化评价仍有很大不确定性；可设计donor-level交叉验证并尽可能增加独立外部验证，不把12,000当sample size。']],
      terms:[term('Donor-level split','按donor分配训练、验证与测试，保留内部依赖结构的划分。','scReplicate','同donor的两个sections各1000cells都留在同一partition。','仅在cell或tile层随机拆分会泄漏donor特征。'),term('Ablation study','在其余条件可比时移除或改变一个模块以评估其贡献。','scMapping','分别去掉spatial prior和image evidence观察assignment的变化。','贡献依赖baseline和设置；ablation不是生物因果干预。'),term('Orthogonal validation','用不同测量或独立证据检验主要结论。','scCoordinates','用未用于训练的boundary标注或protein imaging核查mapping。','循环使用同一marker选型再验证不能提供同等独立证据。')],
      check:['用全部donors挑HVG和调模型，再把一个donor留作“测试”，哪里有问题？','测试donor已经影响feature selection和模型选择。若声称inductive新donor泛化，相关学习步骤应限制在训练数据；若采用transductive设置，应明确声明并用独立策略验证相应目标。'],
      lens:['关联sample manifest、raw layers、geometry、splits、模型设置与完整结果。','Donor、sample、section、cell、bin、gene和pathway各有不同单位。','结论范围由replication、coverage与独立验证决定，细胞数量不能替代这些条件。',['scReplicate','scOSCA','scMapping']]
    }
  ];
  const course=window.BIOCS_BOOK.find(c=>c.code==='05');
  if(!course)throw new Error('Omics course 05 must load before single-cell/spatial extension.');
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
  window.BIOCS_SC_SPATIAL_CHAPTERS=chapters.map(({id,title})=>({id,title,course:'05',origin:'Original single-cell and spatial extension'}));
})();
