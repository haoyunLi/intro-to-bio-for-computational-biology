// Original teaching expansions based on the supplied course topic inventory.
(() => {
  const course = window.BIOCS_BOOK.find(c => c.code === '06');
  if (!course) throw new Error('CB_592 expansion requires course 06');
  Object.assign(window.BIOCS_SOURCES, {
    cbrIntro:['R Core Team · An Introduction to R','https://cran.r-project.org/doc/manuals/r-release/R-intro.html'],
    cbrArray:['R · Arrays and dimension attributes','https://stat.ethz.ch/R-manual/R-release/library/base/html/array.html'],
    cbrExtract:['R · Extract or replace parts of an object','https://stat.ethz.ch/R-manual/R-release/library/base/html/Extract.html'],
    cbrRead:['R · Data input','https://stat.ethz.ch/R-manual/R-release/library/utils/html/read.table.html'],
    cbrSerialize:['R · Single-object serialization','https://stat.ethz.ch/R-manual/R-release/library/base/html/readRDS.html'],
    cbrApply:['R · Apply a function over array margins','https://stat.ethz.ch/R-manual/R-release/library/base/html/apply.html'],
    cbrLapply:['R · Apply a function over a list or vector','https://stat.ethz.ch/R-manual/R-release/library/base/html/lapply.html'],
    cbGgplot:['ggplot2 · Official reference','https://ggplot2.tidyverse.org/reference/index.html'],
    cbGit:['Git · Recording changes to the repository','https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository'],
    cbQuarto:['Quarto · Using R','https://quarto.org/docs/computations/r.html'],
    cbNistCI:['NIST · Confidence limits for the mean','https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm'],
    cbRTests:['R · t.test','https://stat.ethz.ch/R-manual/R-release/library/stats/html/t.test.html'],
    cbRanks:['R · Wilcoxon rank-sum and signed-rank tests','https://stat.ethz.ch/R-manual/R-release/library/stats/html/wilcox.test.html'],
    cbPermutation:['Phipson & Smyth · Permutation P-values should never be zero','https://pubmed.ncbi.nlm.nih.gov/21044043/'],
    cbAdjust:['R · Multiple-comparison p-value adjustment','https://stat.ethz.ch/R-manual/R-release/library/stats/html/p.adjust.html'],
    cbCorrelation:['R · Correlation and covariance','https://stat.ethz.ch/R-manual/R-release/library/stats/html/cor.html'],
    cbLM:['R · Fitting linear models','https://stat.ethz.ch/R-manual/R-release/library/stats/html/lm.html'],
    cbPCA:['R · Principal components analysis','https://stat.ethz.ch/R-manual/R-release/library/stats/html/prcomp.html'],
    cbGlmnet:['glmnet · Regularization and cross-validation','https://glmnet.stanford.edu/articles/glmnet.html'],
    cbCV:['Roberts et al. · Cross-validation strategies for structured data','https://doi.org/10.1111/ecog.02881'],
    cbSTAR:['STAR · Official manual and parameter definitions','https://github.com/alexdobin/STAR/blob/master/doc/STARmanual.pdf'],
    cbRSEM:['Li & Dewey · RSEM transcript quantification','https://pmc.ncbi.nlm.nih.gov/articles/PMC3163565/'],
    cbKallisto:['Bray et al. · Near-optimal probabilistic RNA-seq quantification','https://doi.org/10.1038/nbt.3519'],
    cbSAM:['SAM/BAM · Official format specification','https://samtools.github.io/hts-specs/SAMv1.pdf'],
    cbRMATS:['rMATS-turbo · Event counts, effective lengths and output','https://github.com/Xinglab/rmats-turbo'],
    cbSUPPA:['Trincado et al. · SUPPA2 differential splicing','https://doi.org/10.1186/s13059-018-1417-1'],
    cbPower:['R · Power calculations for t tests','https://stat.ethz.ch/R-manual/R-release/library/stats/html/power.t.test.html']
  });
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const text = (x,y,s,size=17,color='#17385f',anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
  const line = (x1,y1,x2,y2,color='#8296b0',width=2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
  const box = (x,y,w,h,label,fill='#e9f1fa') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="#b9cadd"/>`+text(x+w/2,y+h/2+6,label,17,'#17385f','middle');
  function figure(id,title,body,caption) {
    return `<figure class="cb592-figure"><div role="region" tabindex="0" aria-label="${esc(title)}（可横向滚动）" style="overflow-x:auto"><svg role="img" aria-labelledby="${id}-fig-title ${id}-fig-desc" viewBox="0 0 640 320" style="display:block;min-width:640px;width:100%;height:auto;font-family:system-ui,sans-serif;background:#f8fbff"><title id="${id}-fig-title">${esc(title)}</title><desc id="${id}-fig-desc">${esc(caption)}</desc>${body}</svg></div><figcaption>原创 synthetic example · ${caption} 图内可横向滑动，完整计算在 worked example。</figcaption></figure>`;
  }
  const examples=[];
  function code(id,source,language='r') { examples.push({id,language,code:source}); return `<pre><code class="language-${language}">${esc(source)}</code></pre>`; }
  const section=(title,body,...sources)=>[title,body,sources];
  const term=(name,definition,source,example,caution)=>[name,definition,source,example,caution];
  const chapter=(id,title,subtitle,intuition,prereq,goals,sections,worked,terms,check,lens)=>({id,title,subtitle,intuition,prereq,goals,sections,worked,terms,check,lens,core:'CB_592 · mechanism to analysis',intro:''});
  const figures={
    cb01:figure('cb01','从矩阵坐标读出一条 gene 的两个 sample',text(25,30,'Rows = genes; columns = samples')+['S1','S2','S3'].map((s,i)=>text(200+i*130,70,s,18,'#17385f','middle')).join('')+['G1','G2'].map((s,i)=>text(50,125+i*70,s)).join('')+[[2,4,6],[3,6,9]].map((row,i)=>row.map((v,j)=>box(155+j*130,90+i*70,90,48,String(v),i===0&&j<2?'#d5e8fc':'#fff')).join('')).join('')+text(35,275,'X["G1", c("S1", "S2")] = 2, 4; dim(X) = 2 × 3'), '蓝色两个格为 G1 在 S1、S2 的值 2 和 4；行均值为4。向量不是矩阵，保留二维子集时使用drop=FALSE。'),
    cb02:figure('cb02','相同 ID 不同顺序，不能按行号拼接',text(25,30,'Count columns: S1 → S2 → S3')+box(25,65,170,55,'Metadata: S3')+box(235,65,170,55,'Metadata: S1')+box(445,65,170,55,'Metadata: S2')+text(320,165,'match(c("S1","S2","S3"), metadata$id)',17,'#17385f','middle')+box(25,205,170,55,'Index 2 → S1','#d5e8fc')+box(235,205,170,55,'Index 3 → S2','#d5e8fc')+box(445,205,170,55,'Index 1 → S3','#d5e8fc')+text(25,300,'Reorder first; then require identical IDs and unique keys.'),'Metadata顺序 S3,S1,S2 对应 index 2,3,1 才能与counts的S1,S2,S3对齐；仅检查行数相等不够。'),
    cb03:figure('cb03','同一个函数分别作用于每个 vector',box(25,40,175,55,'A: 1, 2, 3')+box(25,120,175,55,'B: 4, 6')+text(245,80,'mean()',22)+text(245,160,'mean()',22)+box(410,40,200,55,'A: 2','#d5e8fc')+box(410,120,200,55,'B: 5','#d5e8fc')+line(205,65,230,65)+line(335,65,400,65)+line(205,145,230,145)+line(335,145,400,145)+text(25,245,'lapply → list(A=2, B=5)')+text(25,280,'vapply(..., numeric(1)) → numeric vector 2, 5'),'lapply保留list；vapply额外检查每次返回一个numeric。合并原始值后求mean=(1+2+3+4+6)/5=3.2，不等于两个组均值平均3.5。'),
    cb04:figure('cb04','保留 donor 配对，图形才保留问题',line(70,250,570,250)+line(70,250,70,50)+[0,5,10,15].map(v=>text(55,255-v*12,String(v),14,'#47617f','end')).join('')+[[4,7],[8,9],[12,14]].map((r,i)=>line(180,250-r[0]*12,440,250-r[1]*12,['#245fbd','#08766e','#855897'][i],3)+`<circle cx="180" cy="${250-r[0]*12}" r="5" fill="#245fbd"/><circle cx="440" cy="${250-r[1]*12}" r="5" fill="#245fbd"/>`).join('')+text(180,285,'Control',18,'#17385f','middle')+text(440,285,'Treatment',18,'#17385f','middle')+text(80,25,'Synthetic expression; one line = one donor'),'三个donor的变化为+3、+1、+2；只画两根均值柱会隐藏配对与异质性。连线表示配对身份，不是实际连续时间曲线。'),
    cb05:figure('cb05','SD 描述观测分散，SE 描述均值精度',text(25,30,'Observations: 2, 4, 6, 8; mean = 5')+line(75,110,575,110)+[2,4,6,8].map(v=>`<circle cx="${75+v*50}" cy="110" r="8" fill="#245fbd"/>`+text(75+v*50,145,String(v),18,'#17385f','middle')).join('')+box(25,190,180,60,'SD = 2.582')+box(230,190,180,60,'SE = 1.291')+box(435,190,180,60,'n = 4')+text(25,295,'95% t CI: mean ± t × SE ≈ [0.891, 9.109]'),'平方偏差9+1+1+9=20；sample variance=20/3，SD=√(20/3)，SE=SD/√4。独立正态样本的t区间使用df=3。'),
    cb06:figure('cb06','完整枚举与随机抽样的 p-value 分母不同',text(25,30,'Pooled values: 1, 2, 3, 4; choose 2 for Treatment')+[-2,-1,0,0,1,2].map((v,i)=>box(25+i*100,100,90,65,String(v),Math.abs(v)===2?'#d5e8fc':'#fff')).join('')+text(25,210,'All 6 possible mean differences under label exchange')+text(25,255,'Observed difference = 2; two-sided extreme = 2 of 6')+text(25,292,'Exact p = 2/6 = 0.333; no claim of statistical evidence'),'Treatment=[3,4]、Control=[1,2]时difference=2。六种分组的difference为−2,−1,0,0,1,2；双侧p=2/6。必须先有label exchangeability。'),
    cb07:figure('cb07','BH 从最大 rank 往回取最小值',text(25,28,'Sorted p: 0.01, 0.03, 0.04, 0.20; m = 4')+['rank 1','rank 2','rank 3','rank 4'].map((s,i)=>text(90+i*150,72,s,16,'#17385f','middle')).join('')+[.04,.06,4*.04/3,.2].map((v,i)=>box(25+i*150,100,130,50,v.toFixed(3))).join('')+text(25,187,'Reverse cumulative minimum; then cap at 1')+[.04,4*.04/3,4*.04/3,.2].map((v,i)=>box(25+i*150,215,130,50,v.toFixed(3),'#d5e8fc')).join('')+text(25,305,'At q=0.05: only the first hypothesis is rejected.'),'未校正p经m/rank缩放得.040,.060,.053,.200；从右往左累计最小值得BH=.040,.053,.053,.200，不能只做逐项乘除后停止。'),
    cb08:figure('cb08','Interaction 表示一组的 slope 与另一组不同',line(70,260,570,260)+line(70,260,70,45)+line(70,220,570,120,'#245fbd',4)+line(70,220,570,20,'#08766e',4)+text(90,48,'Y = 2 + X + X·Treatment',18)+text(410,165,'Control: slope 1',17,'#245fbd')+text(95,85,'Treatment: slope 2',17,'#08766e')+text(75,290,'0')+text(555,290,'5')+text(310,310,'X (centered measurement)',16,'#17385f','middle')+text(15,38,'Y',16),'Control在X=2时Y=4，Treatment在X=2时Y=6；Treatment-control=βT+βXT·X=0+1·X。组间差不是处处固定2。'),
    cb09:figure('cb09','PCA 将每个样本投影到 variance 最大的方向',line(95,250,545,250)+line(95,250,95,30)+line(95,250,495,50,'#08766e',3)+[[1,1],[2,2],[3,3]].map(([x,y])=>`<circle cx="${95+x*120}" cy="${250-y*60}" r="7" fill="#245fbd"/>`).join('')+text(290,45,'PC1 direction: (1, 1)',19,'#08766e')+text(205,290,'Feature 1',17)+text(100,22,'Feature 2',17)+text(315,230,'Center: (2, 2)',17)+text(25,315,'Scores: −√2, 0, +√2; PC1 explains 100% in this toy.','16'),'三个点为(1,1),(2,2),(3,3)，中心化后是(−1,−1),(0,0),(1,1)。loading=(1,1)/√2；投影值−√2,0,√2。图的两轴绘图比例不同，计算仍使用原始feature单位。'),
    cb10:figure('cb10','先隔离 test donors，再在训练集内选择 λ',box(25,50,160,65,'Donors A–F')+box(245,50,370,65,'Outer holdout: E/F','#d5e8fc')+box(245,155,170,65,'Inner train A/B')+box(445,155,170,65,'Inner valid C/D')+line(185,82,235,82)+line(330,120,330,145)+text(25,265,'Each donor stays whole; preprocessing is refit inside folds.')+text(25,303,'After choosing λ: refit A–D, evaluate E/F once.'),'示意只演示一个outer fold和一个inner split。真实grouped nested CV需要多个合适fold，并确保每个训练fold有需要的类别与足够独立donors。'),
    cb11:figure('cb11','一个 ambiguous read 的 fractional assignment 保留 uncertainty',box(25,50,180,55,'Read r: A or B')+box(425,30,190,55,'Transcript A: 0.8','#d5e8fc')+box(425,125,190,55,'Transcript B: 0.2')+line(210,77,420,57,'#245fbd',5)+line(210,77,420,152,'#08766e',2)+text(25,220,'Other evidence favors A; posterior weights sum to 1.')+text(25,267,'10 identical ambiguous reads → expected A=8, B=2')+text(25,303,'Expected counts need not be integers; choices depend on model.'),'示意responsibility为A=.8,B=.2，10条模糊reads贡献expected counts 8和2。真实RSEM/Kallisto还涉及fragment compatibility、length与bias；此图不是其完整实现。'),
    cb12:figure('cb12','Inclusion 与 skipping 必须先定义同一个 event',box(25,60,90,45,'E1')+box(265,60,90,45,'E2','#d5e8fc')+box(505,60,90,45,'E3')+line(115,82,265,82,'#245fbd',4)+line(355,82,505,82,'#245fbd',4)+`<path d="M115 85 Q310 210 505 85" fill="none" stroke="#08766e" stroke-width="4"/>`+text(130,40,'Inclusion: I=30, Lᵢ=100',18,'#245fbd')+text(150,220,'Skipping: S=10, Lₛ=50',18,'#08766e')+text(25,270,'PSI = (30/100) / [(30/100)+(10/50)] = 0.60')+text(25,307,'Raw read fraction 30/40=0.75 answers a different calculation.'),'本例length-corrected inclusion evidence=.3、skipping=.2，所以PSI=.6；具体effective length由event、read length和计数策略决定，不能把exon总长度随意代入。'),
    cb13:figure('cb13','多测 cells 与增加独立 donors 改变不同的信息',box(25,40,270,65,'Design A: 2 donors')+box(345,40,270,65,'Design B: 6 donors','#d5e8fc')+[0,1].map(i=>box(60+i*110,140,95,45,'500 cells')).join('')+[0,1,2,3,4,5].map(i=>`<circle cx="${375+(i%3)*90}" cy="${150+Math.floor(i/3)*65}" r="22" fill="#d5e8fc"/>`+text(375+(i%3)*90,156+Math.floor(i/3)*65,String(i+1),17,'#17385f','middle')).join('')+text(25,275,'A: 1,000 measurements ≠ 1,000 independent replicates')+text(25,310,'Randomization unit and target population define replication.'),'同donor的cells共享遗传、处理和环境。示意比较两个独立donors与六个独立donors，不意味着任何项目六个就一定有足够power。')
  };
  const chapters=[
    chapter('cb01','R objects：把 biological data 放进正确的维度','从一个值、一个向量到 gene × sample，而不是先记函数名。', ['把矩阵想成有行列标签的实验记录。行列顺序改变，数值本身不会自动知道该跟谁对应。','Input是数值、ID与measurement定义；Output是可检查的vector/matrix/array/data.frame/list。结构正确只是分析的起点。'],['k01','r02'],['区分atomic vector、matrix、array、data.frame与list','按名字提取并保持需要的维度','检查NA、类型转换和数据长度'],[
      section('先让每一行每一列有生物含义',figures.cb01+'<p>一个atomic vector保存同一基础类型；numeric与character混合时常被coerce为character。Matrix是二维同质数组；array可再加condition维；data.frame每列可有不同类型；list可以同时装counts、metadata与parameters。把sample ID存成character或明确的factor，把raw counts与连续normalized expression分开。R中34通常是double，34L才是integer；class显示的类型不等同于它是否代表计数。</p>','cbrIntro','cbrArray'),
      section('一步一步：构造、命名、提取、检查',code('cb01',`# Build a consistent gene-by-sample matrix.
x <- matrix(c(2, 4, 6, 3, 6, 9), nrow = 2, byrow = TRUE)
dimnames(x) <- list(c("G1", "G2"), c("S1", "S2", "S3"))
stopifnot(identical(dim(x), c(2L, 3L)))
x["G1", c("S1", "S2"), drop = FALSE]
rowMeans(x)
# Validate an array before creating it.
values <- seq_len(16)
shape <- c(4, 2, 2)
stopifnot(length(values) == prod(shape))
a <- array(values, dim = shape)
a[1, , , drop = FALSE]`),'cbrArray','cbrExtract'),
      section('何时用哪一种结构','<p>Bulk count用gene×sample matrix，metadata用data.frame；一个Seurat/SingleCellExperiment对象将assays和metadata关联，但仍要核对ID。Arrays适合维度真正规则且定义一致的张量，不能把不平衡重复硬凑成同样长度。<code>x[i,j]</code>先行后列；单行默认可能降成vector，接口要求matrix时设<code>drop=FALSE</code>。<code>x$name</code>适于固定字段，<code>x[[name]]</code>适于程序化字段；list的<code>[ ]</code>返回子list。</p>','cbrExtract','cbrIntro'),
      section('排错：维度、缺失与回收规则','<p>先运行dim、str、head、rownames与colnames，再计算。要求<code>length(values)==prod(shape)</code>，避免array截断或recycle。逻辑筛选含NA时先写明是否保留；<code>na.rm=TRUE</code>会改变每组有效样本数，并非修复缺失机制。不要把count=0改成NA，也不要因为一个值异常就删除它。Gene expression、methylation比例与log值的合法范围不同，要按measurement定义检查。</p>','cbrArray','cbrExtract')
    ],['算清矩阵与array的大小',['X有2行×3列=6个值；G1的行均值=(2+4+6)/3=4。','提取G1的S1/S2得2、4；drop=FALSE保留1×2矩阵。','4×2×2的array需要16个值；48个值不能原样塞入并声称全部保留。','三维array的第一个index变化最快；用小序列检查，而不是靠肉眼猜装填顺序。']], [term('Atomic vector','同一基础类型的一维有序集合。','cbrIntro','c(2,4,6)保存一条gene在三个samples的值。','把数字和字符合并会发生coercion，不代表保留了两种独立列类型。'),term('Array','带有dim属性的多维数据结构。','cbrArray','4 genes×2 tissues×2 conditions需要16个元素。','维度名称正确不保证输入长度与装填次序正确。'),term('Dimension dropping','提取时长度为1的维度可能被自动移除。','cbrExtract','x[1,,drop=FALSE]保留一个gene的matrix。','下游方法要求二维输入时，vector与1行matrix不能任意互换。')],['一个matrix有1000行gene和20列sample，apply(x,1,mean)输出多长？','输出1000个gene均值；MARGIN=1保留行标签并对列计算。若想每sample平均，应使用colMeans或MARGIN=2。'],['数值来源是明确assay或simulation；结构本身不解释measurement。','行gene、列sample；array额外维度必须明确并与长度匹配。','对象可合法创建但生物ID、类型或missingness仍可能错误。',['cbrArray','cbrExtract']]),
    chapter('cb02','File I/O 与 ID alignment：读进来之前先定义数据契约','文件能打开，不代表sample标签已经跟数值对上。',['把metadata按行号贴到矩阵上像把检验结果按座位发给病人；需要匹配的是ID。','Input是CSV/TSV、RDS/RData及其schema；Output是经过类型、唯一性、维度和ID检查的分析对象。'],['cb01','k02'],['区分CSV、RDS和RData保存的内容','按sample ID重排并验证唯一性','保留原始文件与可重跑的relative paths'],[
      section('三个文件格式回答三个需求',figures.cb02+'<p>CSV/TSV是易交换的文本表；row names、factor levels和复杂对象通常不能完整保留。RDS保存一个R对象，readRDS返回值由你赋名；RData可保存多个命名对象，load会把对象放进指定environment。项目脚本采用相对路径，记录delimiter、header、NA编码和ID列。文件扩展名不能代替格式检查；大小写在不同系统上也可能改变路径含义。</p>','cbrRead','cbrSerialize'),
      section('最小可运行的读写与对齐',code('cb02',`# Synthetic example; write only to a temporary directory.
counts <- matrix(1:6, nrow = 2, dimnames = list(c("G1", "G2"), c("S1", "S2", "S3")))
metadata <- data.frame(sample_id = c("S3", "S1", "S2"), group = c("T", "C", "T"))
stopifnot(!anyDuplicated(metadata$sample_id))
index <- match(colnames(counts), metadata$sample_id)
stopifnot(!anyNA(index))
metadata <- metadata[index, , drop = FALSE]
stopifnot(identical(colnames(counts), metadata$sample_id))
path <- tempfile(fileext = ".csv")
write.csv(metadata, path, row.names = FALSE)
read.csv(path, colClasses = "character")
rds_path <- tempfile(fileext = ".rds")
saveRDS(list(counts = counts, metadata = metadata), rds_path)
restored <- readRDS(rds_path)
stopifnot(identical(restored$counts, counts))`),'cbrRead','cbrSerialize'),
      section('从长表到矩阵，先检查key的基数','<p>一个gene×sample长表的主键通常是二者组合；同组合出现两次要解释是technical replicate、transcript层级还是重复导入。sample表应一行一个sample，gene annotation表应说明one-to-many映射。先验证key，再join，再比较行数和未匹配ID。不要用inner join把缺失样本静默删掉；不要用盲目的去重把一对多生物映射任意缩成一条。</p>','cbrRead'),
      section('运行前后该记录什么','<p>保留input checksum、列schema、软件版本、运行命令和output目录。原始raw文件不原地覆盖，转换后另存文件。不要把桌面绝对路径写进共享脚本；project root与relative path更便于重跑。<code>list.files(pattern="\\.csv$")</code>匹配CSV，regex与注释要一致。模拟continuous expression不应因文件名含expression就当作integer RNA-seq counts；normalization与DE方法必须接着核对其单位。</p>','cbrRead','cbQuarto')
    ],['Metadata顺序不等于count顺序',['Count columns为S1,S2,S3；metadata rows为S3,S1,S2。','match得到2,3,1，按这个index重排metadata。','重排后逐一检查identical；若任何ID不存在，先停下解释缺失。','1000genes×20samples的完整long table应有20000个gene/sample组合；检查组合唯一性而不只看行数。']], [term('Schema','文件列名、类型、单位、key与允许缺失的约定。','cbrRead','sample_id为character，condition为有限类别，count为非负计数。','列名相同但单位或feature层级不同的文件不能直接拼接。'),term('Serialization','把对象状态写入文件并在以后恢复。','cbrSerialize','saveRDS保存counts与metadata组成的一个list。','RDS可保留R结构，但不能替代来源记录或跨软件通用格式。'),term('ID alignment','按唯一身份匹配并重排不同数据表。','cbrRead','使用match把S3,S1,S2重排成S1,S2,S3。','样本数相等并不保证每个标签对应正确数值。')],['metadata有两个S1，直接match为什么危险？','match只返回一个匹配位置，无法替你决定哪条S1记录正确。先检查重复来源和join基数，再建立唯一且可追溯的sample key。'],['CSV/RDS记录由原始实验流程导出的值和metadata。','主键可能是gene×sample或cell barcode×library，不能只靠行号。','数据契约能排除结构错误，不能证明实验设计无混杂。',['cbrRead','cbrSerialize']]),
    chapter('cb03','Functions、control flow 与 apply：每次计算都应有明确输入输出','把一个正确的小操作，可靠地重复到所有genes或samples。',['同样的计算反复复制，修改一次就容易漏另一处。Function把输入条件和输出承诺放在一起。','Input是带类型/长度约束的对象；Output应有固定含义与可检查的shape。先在一个小例子上手算，再遍历。'],['cb01','cb02'],['选择for、ifelse与apply家族','区分group summaries与pooled summaries','对长度、finite值和分母做验证'],[
      section('同一mean，输入集合不同就回答不同问题',figures.cb03+'<p>Function的参数传入值，body按规则计算并return结果。for适合逐步状态、保存中间量或复杂副作用；while适合终止条件未知但可验证的循环。break结束循环，next跳过当前迭代。向量逻辑<code>&amp;</code>/<code>|</code>逐元素；<code>&amp;&amp;</code>/<code>||</code>用于单一逻辑判断。if要求一个非NA条件；ifelse是逐元素选择，不能把它当任意复杂流程的替代。</p>','cbrIntro','cbrApply'),
      section('apply家族选型与可运行检查',code('cb03',`# Return one finite numeric value per group.
values <- list(A = c(1, 2, 3), B = c(4, 6))
lapply(values, mean)
vapply(values, mean, numeric(1))
x <- matrix(1:6, nrow = 2)
apply(x, 1, sum)
tapply(c(2, 4, 8, 10), c("A", "A", "B", "B"), mean)
mapply(function(a, b) a + b, 1:3, 4:6)
percent_change <- function(before, after) {
  stopifnot(is.numeric(before), is.numeric(after), length(before) == 1L,
            length(after) == 1L, is.finite(before), is.finite(after), before != 0)
  100 * (after - before) / before
}
percent_change(20, 25)`),'cbrLapply','cbrApply'),
      section('返回shape与grouping比函数简短更重要','<p>lapply总返回list；sapply尝试简化，输入变化时shape可能变化；vapply要求指定返回类型/长度，适合稳定pipeline。apply的MARGIN=1逐行、2逐列；data.frame含character时转matrix可能把整表coerce成字符串，不能盲目apply。tapply按group分割一个向量；mapply逐位置配对多个输入。group_by之后summarise应说明每行代表donor、sample还是cell，检查是否意外保留分组。</p>','cbrApply','cbrLapply'),
      section('排错与真实项目迁移','<p>先检查参数长度再用if；检查finite和NA；百分比变化以前值为分母，前值0时须另定义问题；real even root要求输入非负，odd root需保留符号。预先分配输出vector，循环索引用seq_along或seq_len以处理空输入。每步打印小型shape/summary即可，不要把整个人类数据对象dump到日志。Function的结果在cells上重复不产生新的independent donors。</p>','cbrIntro','cbrLapply')
    ],['为什么两个mean不相等？',['A有1,2,3，mean=2；B有4,6，mean=5。','对group means求mean得(2+5)/2=3.5，两个groups同权。','对全部五个observations求mean得16/5=3.2，每个observation同权。','权重取决于研究问题；不要让list长度或cell数量偷偷决定donor权重。']], [term('Vectorization','一次对整个向量按元素规则运算。','cbrIntro','c(2,4,6)*2一次得到4,8,12。','Vectorization不保证统计单位正确，也不自动避免recycling。'),term('Apply family','对对象的元素、边界或分组重复调用函数的方法。','cbrApply','apply(x,1,sum)为每个matrix row生成一个sum。','Data frame混合类型转matrix后可能无法执行numeric计算。'),term('Input validation','在计算前检查输入是否符合函数的契约。','cbrLapply','percent change要求before是一个finite且非零数。','函数成功返回一个值不代表其单位和生物学含义正确。')],['两个donors分别测了10和1000个cells，直接合并求平均意味着什么？','意味着cell多的donor占更大权重。若目标是donor平均状态，应先定义donor-level summary再比较，并保留其不确定性。'],['可复用函数处理assay矩阵或metadata，不创造新的实验信息。','必须声明函数每次输入与每个输出的观测单位。','计算重复次数不能替代独立biological replication。',['cbrApply','cbrLapply']]),
    chapter('cb04','ggplot、Git 与 reports：让图形和代码一起回答问题','选择点、线、分面和误差条之前，先说清每个mark代表谁。',['同一组数画成bar、boxplot或paired points，会暴露不同的信息。图形是一种数据摘要，必须保留你要比较的结构。','Input是tidy table与设计信息；Output是有轴单位、group定义和可追溯代码的图与报告。'],['cb01','cb02','d01'],['解释data/aes/geom/stat/facet/scale的分工','用paired points与分面保留donor结构','用Git和Quarto记录可重跑分析'],[
      section('图形首先表达实验单位',figures.cb04+'<p>data是记录，aes把变量映射到x/y/color/group，geom决定点线等几何标记，stat可能把raw observations变成summary。facet将同一图形规则用于多个子集；scale定义变量到视觉编码的映射，theme只管外观。连接同donor需要group=donor，按condition分组画平滑线则回答另一问题。没有独立重复时，添加一个error bar不会产生可推断性。</p>','cbGgplot'),
      section('最小图与文件输出',code('cb04',`# Requires ggplot2; all data below are synthetic.
if (requireNamespace("ggplot2", quietly = TRUE)) {
  d <- data.frame(donor = rep(c("A", "B", "C"), 2),
                  condition = factor(rep(c("Control", "Treatment"), each = 3),
                                     levels = c("Control", "Treatment")),
                  value = c(4, 8, 12, 7, 9, 14))
  p <- ggplot2::ggplot(d, ggplot2::aes(condition, value, group = donor)) +
    ggplot2::geom_line(color = "steelblue") + ggplot2::geom_point(size = 2) +
    ggplot2::labs(x = "Condition", y = "Synthetic expression") + ggplot2::theme_classic()
  print(p)
  ggplot2::ggsave(tempfile(fileext = ".pdf"), p, width = 5, height = 4)
}`),'cbGgplot'),
      section('何时分面，何时调整坐标','<p>要比较各cell type的age趋势，可按cell type分面并显示donor点；共同y轴利于绝对量比较，free scales利于各自变化但弱化跨panel比较。log轴必须说明base、zero处理与单位；color之外保留label或line type。Boxplot中的箱体与whisker不是CI，plot的平滑带也要核对是均值CI还是prediction interval。统计星号需定义检验family和adjustment；chromosome中许多gene×sample行并不天然是独立donors。</p>','cbGgplot','cbAdjust'),
      section('复现是input到output的链条','<p>Git记录文本版本：先status/diff确认改了什么，按一个可解释的逻辑单元commit；GitHub托管repository并支持协作。大文件、受限原始数据、凭据和R session缓存不应混进教学仓库。Quarto/R Markdown把代码、图和解释连接；报告中写input版本、seed、package versions和运行顺序。Fresh session能从输入生成输出，比“我的Environment里存在一个对象”更有可迁移性。</p>','cbGit','cbQuarto')
    ],['从配对点读出effect',['Control=(4,8,12)，Treatment=(7,9,14)。','每donor的difference为3、1、2，mean difference=2。','两组mean分别8与10；数值difference相同，但配对信息决定variance如何估计。','图注说明一条线一个donor；同时提供样本量、单位与统计方法，不让图形代替设计。']], [term('Aesthetic mapping','把数据变量连接到位置、颜色或分组等图形属性。','cbGgplot','aes(group=donor)让同donor的paired points连线。','color=condition与group=donor承担不同作用，不能互相替代。'),term('Faceting','按变量水平重复同一图形规则并列显示子集。','cbGgplot','每个cell type一个panel比较其donor-level age趋势。','不同panel使用free scales时不能直接比较视觉高度。'),term('Reproducible report','由明确输入、代码和环境生成的可复查文档。','cbQuarto','Fresh R session渲染Quarto时重新计算表格与图。','有一份HTML并不自动证明隐藏input和全部预处理可复现。')],['一个boxplot上写n=10000 cells，还缺什么才能解释condition差异？','还需donor数、每donor分布、randomization与batch信息；图中的cells不是自动独立实验单位。'],['每个图形mark对应raw observation或明确的summary。','一条线一个donor，横轴condition，纵轴有定义的expression单位。','视觉分离与统计星号都不能替代独立样本和预先定义的比较。',['cbGgplot','cbQuarto']]),
    chapter('cb05','Distribution、SD、SE 与 CI：误差条到底在表达什么','从四个数手算variation，再解释估计的不确定性。',['一篮苹果的大小差异，与多次抽样算出的平均大小差异，是两种不同的variation。','Input是独立观测及其测量尺度；Output是descriptive summaries或带假设的parameter interval。先画分布，再选择summary。'],['cb01','r03'],['手算sample variance、SD与SE','区分population、sample与sampling distribution','知道t CI与1.96近似各自的条件'],[
      section('不要把三种error bar混为一谈',figures.cb05+'<p>Mean对极端值敏感，median描述中间位置；histogram显示shape，boxplot强调quartiles与离群规则。Sample variance用平方偏差之和除以n−1；SD回到原始单位。SE衡量某个estimator在重复采样下的波动，独立同分布样本均值的SE估计为SD/√n。数据右偏或bounded时，mean、median与对称区间可能描述不同方面；先明确要估计什么。</p>','cbNistCI','cbRTests'),
      section('一步一步算四个独立数',code('cb05',`# Independent synthetic normal observations for this illustration.
x <- c(2, 4, 6, 8)
n <- length(x)
mean_x <- mean(x)
sd_x <- sd(x)
se_x <- sd_x / sqrt(n)
critical <- qt(0.975, df = n - 1)
ci <- mean_x + c(-1, 1) * critical * se_x
c(mean = mean_x, SD = sd_x, SE = se_x, lower = ci[1], upper = ci[2])
stopifnot(abs(sd_x^2 - 20/3) < 1e-10)`),'cbRTests','cbNistCI'),
      section('何时用t，何时用别的方法','<p>独立正态observations且variance未知时，mean的t interval采用df=n−1。1.96×SE是大样本normal近似，不是所有n的通用公式。95% coverage描述在条件成立时重复构造区间的长期表现，不是数据固定后给未知参数一个95% frequentist概率。Proportion、count、paired difference与hierarchical数据各有相应估计方法；不是把任何表格塞进mean±1.96SE就合理。</p>','cbNistCI','cbRTests'),
      section('Outliers与biological replication怎样处理','<p>离群点可能是记录错误、assay失败，也可能是真实heterogeneity。先追溯样本与QC，保留处理规则和包含/排除的sensitivity analysis。两个donors各测500cells，n不能未经说明就写1000来缩小SE；需donor级summary或适当hierarchical model。对counts，Poisson与Negative Binomial的mean–variance结构不同；variance模型要跟数据生成过程一致。条件改变或选择性缺失也会影响CI能推广到谁。</p>','cbNistCI','cbRTests')
    ],['从x=(2,4,6,8)到95% t CI',['Mean=20/4=5；平方偏差=(−3)²+(−1)²+1²+3²=20。','Sample variance=20/3≈6.667，SD≈2.582。','SE=2.582/√4≈1.291；df=3的t critical≈3.182。','CI≈5±4.109≈[0.891,9.109]；这个toy满足的方法条件须单独说明，区间不是observations的范围。']], [term('Standard deviation','观测值围绕mean的分散尺度。','cbNistCI','2,4,6,8的sample SD约2.582。','SD不是均值的CI，也不随重复复制同一条记录提供新信息。'),term('Standard error','在给定sampling model下estimator的波动尺度。','cbNistCI','四个独立数的mean SE=SD/2≈1.291。','使用SD/√n要求n对应合适的独立信息，而非任意行数。'),term('Confidence interval','按特定程序和假设构造、具有长期coverage解释的区间。','cbRTests','四个正态独立数的mean可用t interval估计。','一个95% frequentist CI不表示参数有95%概率落在当前固定区间。')],['图A画SD，图B画SE，B更窄能说明实验更稳定吗？','不能。它们表达不同对象；SE由估计目标和样本量决定，SD描述观测分散。要比较实验稳定性，先统一误差条定义、独立单位与样本构成。'],['Distribution来自gene、sample或donor层的测量与variation。','SD与mean共享测量单位；variance单位平方；SE属于某个estimator。','CI coverage依赖sampling model、选择机制与独立性。',['cbNistCI','cbRTests']]),
    chapter('cb06','Hypothesis testing：比较的不是两根柱，而是effect与null variation','用完整枚举理解p-value，再决定t、Wilcoxon或permutation。',['差异大不大，要相对于在null下本来会有多大波动。p-value是对这个比较的校准，不是effect大小。','Input是观测、分组、pairing与一个预先定义的null；Output是effect estimate、interval和符合设计的test结果。'],['cb05','d01'],['分清paired与independent比较','从六种分组手算双侧permutation p','区分mean、rank、distribution与causal claim'],[
      section('先定null与可交换单位',figures.cb06+'<p>以T=mean(Treatment)−mean(Control)为统计量。Label permutation要求null下允许交换这些实验单位的标签；有matched pairs时可交换pair内标签，不能把所有cells任意打散。Independent t-test常比较均值，Welch版本不强制两组variance相等；paired t-test作用于pair differences。p-value是在指定null与模型下出现当前或更极端统计量的概率，不是null为真的概率。</p>','cbRTests','cbPermutation'),
      section('从完整枚举到Monte Carlo',code('cb06',`# Enumerate every assignment of two of four observations.
x <- c(1, 2, 3, 4)
assignments <- combn(seq_along(x), 2)
null_difference <- apply(assignments, 2, function(index) {
  mean(x[index]) - mean(x[-index])
})
observed <- mean(x[3:4]) - mean(x[1:2])
p_exact <- mean(abs(null_difference) >= abs(observed) - 1e-12)
stopifnot(abs(p_exact - 1/3) < 1e-10)
# Randomly sampled permutations need a nonzero Monte Carlo estimate.
set.seed(42)
B <- 999
random_difference <- replicate(B, {
  index <- sample(seq_along(x), 2)
  mean(x[index]) - mean(x[-index])
})
p_monte_carlo <- (1 + sum(abs(random_difference) >= abs(observed) - 1e-12)) / (B + 1)
c(exact = p_exact, monte_carlo = p_monte_carlo)`),'cbPermutation'),
      section('何时用t，何时用Wilcoxon','<p>均值差是目标且误差模型合适时考虑t/model-based inference；paired资料必须把pair IDs对齐。Wilcoxon rank-sum适用于independent groups的rank比较，signed-rank用于有适当对称差值假设的paired资料。Wilcoxon一般不能简写成“只检验median相等”；不同shape也影响解释。Ties、小样本和软件版本决定exact/approximate处理，应记录method而不是只抄p。单侧alternative应由研究问题预先决定，不能看完正负方向再选择。</p>','cbRanks','cbRTests'),
      section('结果如何报告，哪里不能外推','<p>同时给effect、units、uncertainty、independent n与null定义。显著不等于生物学重要，未显著不等于无效应。Monte Carlo permutation的b次极端结果用(b+1)/(B+1)，最低分辨率为1/(B+1)；完整枚举的exact比例与此不同。大规模genewise分析还需多重检验，低power与混杂也不能靠更换test自动修复。细胞级t/Wilcoxon不自动构成donor级condition证据。</p>','cbPermutation','cbRanks','cbRTests')
    ],['四个数为什么仍给p=1/3？',['有4 choose 2=6种合法分组，Treatment的mean minus Control依次为−2,−1,0,0,1,2。','观察到T=2，双侧比较|T|≥2，符合的是−2与2两个分组。','Exact p=2/6=1/3；效果看似整齐，但n很小，null分布离散。','随机只抽B次时应报告Monte Carlo估计与分辨率；绝不能把未抽到extreme解释成p=0。']], [term('Exchangeability','在指定null与实验设计下，交换标签不改变联合分布的条件。','cbPermutation','随机处理的独立samples可在合适null下重排group label。','同donor多个cells通常不能像独立donors那样任意交换。'),term('Paired test','利用一一对应实验单位的difference进行比较。','cbRTests','同donor处理前后先计算每人的变化再检验。','两组长度相同并不表示存在配对关系。'),term('Permutation p-value','由允许的标签重排构造null reference并计算极端程度。','cbPermutation','完整六种分组中两种一样极端，exact p=2/6。','Permutation不能消除confounding；random sampled permutations还需有限抽样处理。')],['1000次随机permutations没有一次更极端，可以写p=0吗？','不可以。常用Monte Carlo修正给(0+1)/(1000+1)≈0.001，并说明tails、statistic和合法permutation单位；零次命中不代表null概率严格为零。'],['统计量来自预先定义的condition difference或rank comparison。','Independent sample、pair或block才是合法重排/误差估计单位。','小p不自动证明因果、生物学重要性或跨donor可推广。',['cbRTests','cbRanks','cbPermutation']]),
    chapter('cb07','Multiple testing：Bonferroni、BH 与一个明确的test family','两万个genes一起筛选时，错误率必须跟整组决策一起解释。',['单个抽奖很难中奖，抽两万次就容易出现偶然极端值。多重检验控制的是一组选择规则的错误行为。','Input是一组定义好的有效p-values；Output是adjusted p-values或拒绝集合，不能替代原始effect与设计。'],['cb06'],['手算Bonferroni与BH','区分FWER与FDR','明确genewise、cell-type-wise和pathway-wise的family'],[
      section('先区分调整p与调整threshold',figures.cb07+'<p>m次比较的Bonferroni adjusted p是<code>min(1,m×p)</code>；等价判定是raw p≤α/m。不能把adjusted p写成p/m。FWER关注至少一次false rejection的概率；FDR关注被reject集合中false proportion的期望。FDR≤0.05不等于每个hit有5%错误概率，也不保证当前一次实验恰好5%的hits是false。</p>','cbAdjust'),
      section('BH为什么需要从后往前',code('cb07',`# Keep the whole predeclared hypothesis family.
p <- c(G1 = 0.01, G2 = 0.03, G3 = 0.04, G4 = 0.20)
p.adjust(p, method = "bonferroni")
p.adjust(p, method = "BH")
order_p <- order(p)
scaled <- length(p) * p[order_p] / seq_along(p)
adjusted_sorted <- pmin(1, rev(cummin(rev(scaled))))
adjusted <- numeric(length(p))
adjusted[order_p] <- adjusted_sorted
stopifnot(isTRUE(all.equal(unname(p.adjust(p, "BH")), adjusted)))`),'cbAdjust'),
      section('何时选择哪一种控制','<p>少量confirmatory hypotheses且任何一次false positive都很重要时，可考虑FWER方法，如Holm。探索性genome-wide screening常使用FDR，随后以独立证据验证候选。BH的经典保证需要独立或适当正依赖条件；任意依赖下可考虑更保守的BY等方法。方法选择与结论强度要一致，不能因为某方法得到更多hits就临时更换。</p>','cbAdjust'),
      section('设置与排错：family不能事后缩水','<p>对所有被有效测试的genes计算adjustment，再标记阈值；只把raw p&lt;0.05的行拿去p.adjust会改变family并低估选择成本。Up/Down方向若源于同一次全ranking分析，分表展示不应重新调小BH family。多个cell types、contrasts或pathway databases需要预先说明各自family或更高层检验策略。低表达filter要基于合理独立规则，保留NA来源与未测试记录；不要把NA补成0。</p>','cbAdjust')
    ],['四个p的完整BH计算',['排序p=(.01,.03,.04,.20)，rank=(1,2,3,4)，m=4。','m·p/rank=(.04,.06,.053333,.20)。','从右向左取累计最小值，得到(.04,.053333,.053333,.20)。','q=.05时只reject第一条；Bonferroni则为(.04,.12,.16,.80)。']], [term('Family-wise error rate','一个test family中至少一次false rejection的概率。','cbAdjust','四项confirmatory tests作为一个family进行Holm/Bonferroni控制。','控制FWER不表示每个effect estimate都准确或设计无bias。'),term('False discovery rate','被拒绝集合中false discovery proportion的期望。','cbAdjust','genewise screening在声明的family上使用BH adjusted p。','FDR不是每个gene的posterior false probability。'),term('Test family','为共同错误率控制而预先定义的一组hypotheses。','cbAdjust','同一contrast的所有有效genewise tests可构成一个family。','筛完显著genes再定义更小family会破坏原来的错误控制。')],['先选raw p<.05的100条，再BH，与对全部20000条BH一样吗？','不一样。前者忽略了选择过程与原始family；应对适当定义的全部有效tests调整，再筛选与展示。'],['Genewise或termwisep-values必须先来自有效模型。','m是声明family内hypotheses数，不是cells或总reads数。','错误率保证依赖p-values有效性、依赖结构与完整selection procedure。',['cbAdjust']]),
    chapter('cb08','Correlation、Regression 与 Interaction：你想比较哪一个effect？','从相关到条件模型，变化的是问题与假设。',['两个量一起变，可能是直接联系，也可能同受age、batch或cell composition影响。模型需要把这些可能性明确写出来。','Input是独立samples及predictors；Output是定义在measurement scale与covariates条件下的association/effect estimate。'],['cb05','cb06'],['区分Pearson、Spearman与conditional regression','解释design matrix、reference level和interaction','通过residual与confounding检查模型'],[
      section('Interaction让effect随context改变',figures.cb08+'<p>Pearson量化linear association，Spearman先转rank再描述monotonic association；两者都不自动证明因果。线性模型写<code>Y=β0+βX X+βT T+βXT XT+ε</code>，T是0/1的Treatment indicator。βT只表示X=0时的组差；X每增1，Treatment中的slope多βXT。把age中心化到有意义的值，可让intercept和主效应更容易解释，但不会消除混杂。</p>','cbCorrelation','cbLM'),
      section('按设计创建一个可估计模型',code('cb08',`# A deterministic example for algebra, not inference.
d <- expand.grid(x = 0:4, treatment = c(0, 1))
d$y <- 2 + d$x + d$x * d$treatment
d$treatment <- factor(d$treatment, levels = c(0, 1))
fit <- lm(y ~ x * treatment, data = d)
coef(fit)
design <- model.matrix(fit)
stopifnot(qr(design)$rank == ncol(design))
# Real-data inference also requires residual and independence checks.
cor(c(1, 2, 3, 4), c(1, 4, 9, 16), method = "spearman")`),'cbLM','cbCorrelation'),
      section('何时用、如何设置','<p>简单探索先画scatterplot与donor颜色，检查outlier、非线性与groups。连续结果可用linear model；count、binary与survival outcomes需要适合其分布/链接的模型。Factor reference决定coefficient的解释；<code>x*treatment</code>展开主效应和interaction，<code>x:treatment</code>单独指定交互。先查看model.matrix列名与rank；condition和batch完全一致时，不能靠增加covariates辨认二者独立效应。</p>','cbLM'),
      section('排错：系数不是机制证明','<p>检查residual vs fitted、variance随mean变化、极端influential samples和数据依赖。若同donor重复测量，普通lm误差独立假设可能不合适；可在明确配对设计中用donor fixed effects或合理mixed model。不能随意调整处理之后产生的mediator而仍宣称估计total effect。Methylation Age与Pathway Age模型中，cell composition、sample type与batch的处理应与研究问题一致。</p>','cbLM','cbCorrelation')
    ],['在X=2与X=4时Treatment effect相同吗？',['给定Y=2+X+X·T，T=0时Y=2+X。','T=1时Y=2+2X，βXT=1。','X=2时两组是4与6，difference=2；X=4时是6与10，difference=4。','Interaction告诉你组差随X改变；没有context范围时，一个单独Treatment coefficient不完整。']], [term('Interaction','一个predictor的effect随另一个predictor取值而变化。','cbLM','age×condition项允许两组age slopes不同。','Interaction coefficient依赖编码和scale，不能脱离主效应解释。'),term('Reference level','Factor编码中用作比较基准的水平。','cbLM','Control为reference时condition coefficient通常表示Treatment相对Control。','改变reference会改系数表达，通常不会改变同一可估计对比。'),term('Confounding','目标比较与其他影响结果的因素在设计中混合。','cbLM','所有treated都在batch2，所有control都在batch1。','完全混杂时同时放入两个变量并不能凭空恢复可识别性。')],['Spearman很高但Pearson较低，是否说明数据错误？','未必。可能存在monotonic但非linear关系或outlier影响。应查看scatterplot、测量尺度与实验单位，再决定关联和推断方法。'],['Regression用明确定义的outcome与sample metadata。','每行是独立sample或有明确依赖结构的重复测量。','系数是条件模型结果；confounding与measurement bias仍可能存在。',['cbLM','cbCorrelation']]),
    chapter('cb09','PCA：把高维变化投影到少数方向','先理解centering、loadings与scores，再读漂亮的二维散点。',['把一团点从某个方向投影，能保留的差异有多大取决于观看方向。PCA选择variance最大的正交方向。','Input是sample×feature矩阵；Output是loadings、sample scores与explained variance。坐标轴描述数据variation，不自动对应某个cell type或生物通路。'],['cb01','cb05'],['手算二维PCA投影','区分loading、score与explained variance','判断scale、normalization与batch怎样影响PCA'],[
      section('先对齐矩阵方向，再做projection',figures.cb09+'<p>若gene×sample矩阵要展示samples，先转置。每个feature减去训练样本mean是centering；是否再除SD由feature units与目的决定。PCA在centered matrix上做SVD，loading给出feature方向，score是样本投影。第一PC最大化variance，后续PC与前面正交。Loading整体正负翻转不会改变同一条轴的含义，也不是算法发生错误。</p>','cbPCA'),
      section('用三个点验证loading和score',code('cb09',`# Rows are samples; columns are measured features.
x <- cbind(feature1 = 1:3, feature2 = 1:3)
fit <- prcomp(x, center = TRUE, scale. = FALSE)
fit$rotation
fit$x
fit$sdev^2 / sum(fit$sdev^2)
# Loading signs are arbitrary; squared scores are invariant.
stopifnot(max(abs(fit$x[, 1]^2 - c(2, 0, 2))) < 1e-10)
stopifnot(abs(sum(fit$sdev^2) - 2) < 1e-10)`),'cbPCA'),
      section('哪些设置会改变你的图','<p>在counts上直接做PCA可能主要看见library size；应使用符合目标的normalized/transformed representation，保留raw counts供计数模型。所有features量纲不同可考虑scaling，但低variance噪声gene也可能被放大；零variance列不能直接除SD。选highly variable genes、是否回归covariates、使用多少PC都要记录。分类器前的PCA应在training fold内fit，held-out samples仅用其center/loading变换。</p>','cbPCA','cbCV'),
      section('如何解释与验证','<p>先把PC scatter按batch、donor、library size、condition等着色，查看top loadings与outliers。Condition分离可能是biology，也可能是batch与composition；不要把largest variance等同most relevant variation。UMAP/t-SNE是不同的nonlinear embedding目标，局部邻近和二维距离不能当作完整的全局定量结构。PC数可通过variance、stability与任务验证选择；不要只挑最能分组的两个PC后再当独立证据。</p>','cbPCA','cbCV')
    ],['二维点怎样变成一个score？',['原始点(1,1),(2,2),(3,3)的column means都是2。','中心化得(−1,−1),(0,0),(1,1)，sample covariance=[[1,1],[1,1]]。','最大eigenvalue=2，单位loading=(1,1)/√2，另一eigenvalue=0。','Dot product给scores=−√2,0,√2；100% variance是这个完美toy的结果，不是实际RNA数据的目标。']], [term('Loading','定义一个principal-component方向的feature weights。','cbPCA','两个完全同步features的PC1 loading可为(1,1)/√2。','Loading符号可整体翻转，绝对符号本身不是biological direction。'),term('PCA score','一个样本在给定principal-component方向上的投影。','cbPCA','中心化点(1,1)在PC1方向的score为√2。','不同预处理或不同fit的PCA坐标通常不能直接混用。'),term('Explained variance','某PC保留的variance占全部保留feature variance的比例。','cbPCA','本例eigenvalues为2和0，PC1比例为100%。','最大variance可能来自batch或测序深度，并不自动最有生物意义。')],['把所有samples先做PCA再划train/test，是否总是无泄漏？','不是。若PCA用到了held-out samples的distribution，评估流程已利用test信息。预测pipeline中需在训练fold内fit，再对验证/test做相同变换。'],['PCA的feature来源必须是明确尺度与处理后的assay值。','样本在行、features在列；scores与loadings承担不同单位角色。','二维分离是描述性结果，不能单独证明cell identity或causal mechanism。',['cbPCA','cbCV']]),
    chapter('cb10','Lasso、Ridge 与 grouped CV：怎样证明模型能用于新donor','优化训练误差、选择hyperparameter和评估泛化是三件事。',['背熟某个人的重复样本很容易，预测一个从未见过的人更难。你的test split应该模拟真正使用模型的场景。','Input是sample×feature、outcome和donor/group；Output是完整预测pipeline及对新独立单位的验证结果。'],['cb08','cb09','k10'],['解释L1/L2 penalty与λ','分清inner tuning与outer evaluation','让preprocessing、selection与donor分组留在正确fold'],[
      section('λ改变fit与complexity的取舍',figures.cb10+'<p>在相同loss尺度下，Ridge惩罚Σβ²，通常连续收缩；Lasso惩罚Σ|β|，可将部分coefficient压到0。glmnet的alpha=1是Lasso，alpha=0是Ridge；lambda控制penalty大小，不等同于学习率。Elastic Net混合两种penalty。Correlated features可能被Lasso替换选择，selected gene不自动成为causal biomarker。Intercept通常不按同样方式惩罚。</p>','cbGlmnet'),
      section('一个可运行的grouped tuning例子',code('cb10',`# Requires glmnet; this illustrates inner tuning only.
if (requireNamespace("glmnet", quietly = TRUE)) {
  set.seed(12)
  donor <- rep(seq_len(12), each = 2)
  x <- matrix(rnorm(24 * 8), nrow = 24)
  y <- 2 * x[, 1] + rep(rnorm(12), each = 2) + rnorm(24)
  donor_fold <- rep(1:3, length.out = 12)
  foldid <- donor_fold[donor]
  cv <- glmnet::cv.glmnet(x, y, alpha = 1, foldid = foldid, standardize = TRUE)
  c(lambda_min = cv$lambda.min, lambda_1se = cv$lambda.1se)
  # An untouched outer donor set is still needed for a generalization claim.
}`),'cbGlmnet','cbCV'),
      section('从tuning到真正evaluation，一步一步','<p>先写deployment场景：新donor、新site、新slide还是同donor新cell。按对应group或time划outer test，训练部分内再做inner CV选择lambda与其他设置。Imputation、scaling、feature selection、PCA与batch处理都在inner training fit，再应用于validation。选完设置后对outer training重fit，最后只在outer test报告性能。多次outer folds可估计稳定性；最后保留外部cohort更接近真实迁移。</p>','cbCV','cbGlmnet'),
      section('如何设置与解释优缺点','<p>lambda.min追求CV误差最低；lambda.1se在一个SE范围内选择更强regularization，通常更简单但不保证更好外部表现。alpha若也要调，必须用同一套inner folds比较，不能用outer test挑。Age prediction报告MAE/RMSE、calibration、年龄范围及donor分布；分类报告class balance、threshold与calibration。训练完在training data上画y=ŷ的相关图不能替代held-out prediction。Small-n/high-p时方差大，重复拆分不能创造更多独立人。</p>','cbGlmnet','cbCV')
    ],['为什么每个donor必须整组留在一个fold？',['6个donors各有2个samples，共12rows。','随机按rows切分可能让同donor的一条在train、一条在test。','按donor分组后，E/F的4rows都进入outer test，其余8rows内tuneλ。','Test评估的是新donor；若换成新site目标，还需按site组织更严格的外层验证。']], [term('Regularization','通过惩罚complexity或限制参数减少不稳定拟合。','cbGlmnet','增大lambda可将Lasso的更多coefficients压向0。','Penalty影响预测与bias/variance，不证明被选features具有因果作用。'),term('Grouped cross-validation','将同一依赖group的所有记录分配到同一fold。','cbCV','同donor全部cells或重复samples保留在一个fold。','Group定义必须对应deployment；仅按cell分组不能模拟新donor。'),term('Nested cross-validation','在outer evaluation内部再设置inner hyperparameter tuning。','cbCV','Inner选择lambda，outer评估从未用于选择的donors。','反复查看outer test再修改pipeline会使其失去独立评估作用。')],['把全体genes先按与age的相关性筛选，再做CV有什么问题？','Feature selection看到了验证数据的age，产生泄漏。每个training fold应独立选择features，并在其validation上仅应用已拟合规则。'],['预测模型使用明确assay features与目标age/condition。','独立评估单位是新donor、site或time，不能仅按matrix row默认。','高CV性能依赖完整pipeline的无泄漏设计，无法单独保证跨cohort迁移。',['cbGlmnet','cbCV']]),
    chapter('cb11','FASTQ → alignment → quantification：每个参数怎样改变count','Genome mapping、transcript compatibility与gene counting是不同步骤。',['一段read像一句被剪下来的短语，可能符合多个gene或isoform。找到位置之后，还要决定怎样归属与计数。','Input是FASTQ、匹配版本的reference/annotation和library协议；Output是alignment/QC、gene counts或transcript abundance及其模型信息。'],['q01','q03','q04','cb02'],['区分FASTA、FASTQ、BAM与quantification table','说明STAR关键参数和output文件','理解multimapping与expected counts的限制'],[
      section('Read不总能唯一认领一个transcript',figures.cb11+'<p>Genome alignment可保留splice-junction与位置证据，再用featureCounts/HTSeq等按annotation计数。Transcript quantification依据fragment与transcripts的兼容关系分配模糊证据；RSEM使用概率模型，Kallisto以pseudoalignment/equivalence信息支持abundance估计。二者都不应概括成“只输出TPM”：还可提供estimated counts与其他量。Gene-level counting与isoform-level推断的输入、uncertainty与下游模型不是完全相同。</p>','cbRSEM','cbKallisto','cbSTAR'),
      section('从文件到参数的逐步检查','<ol><li>确认library是single/paired-end、strandedness、read length、UMI与adapter结构；FASTQ有sequence和quality，FASTA没有base quality。</li><li>记录reference genome build、FASTA/GTF版本与contig名称；gene annotation和genome必须匹配。</li><li>构建STAR index时按预期read长度选择sjdbOverhang（通常read length−1），而不是永远固定149。</li><li>映射时记录threads、compressed-read reader、multimap/mismatch过滤、two-pass策略与输出类型。</li><li>先读Log.final.out的unique/multimap/unmapped分类，再看BAM、splice junction与coverage，最后才接受counts。</li><li>GeneCounts需确认stranded输出列；transcript估计进入gene-level DE通常通过tximport等合适接口处理length/offset，而非随意round TPM。</li></ol>','cbSTAR','cbSAM','cbRSEM'),
      section('可读的STAR命令模板与设置含义',code('cb11',`# Template only: supply matching references and real FASTQ files.
STAR --runMode genomeGenerate \\
  --genomeDir star_index \\
  --genomeFastaFiles genome.fa \\
  --sjdbGTFfile annotation.gtf \\
  --sjdbOverhang 149
# Here 149 assumes 150-base reads; change it for the actual library.
STAR --genomeDir star_index \\
  --readFilesIn sample_R1.fastq.gz sample_R2.fastq.gz \\
  --readFilesCommand zcat \\
  --runThreadN 8 \\
  --outSAMtype BAM SortedByCoordinate \\
  --quantMode GeneCounts \\
  --outFileNamePrefix results/sample.`,'bash')+'<p>这是需要真实reference与数据的command template，不在网页运行。threads影响资源与速度；multimap上限和mismatch阈值改变保留证据，不能只为提升mapping percentage而调。Genome build不匹配、strandedness错误、barcode read被当cDNA，都可能造成“成功运行但错误结果”。</p>','cbSTAR'),
      section('读output，连接到biology','<p>Coordinate-sorted BAM回答read在哪里对齐；SJ.out.tab记录junction证据；Log.final.out总结比对结果；ReadsPerGene.out.tab在启用GeneCounts时给不同stranded规则的列。Mapping rate高不保证样本身份正确或细胞组成一致。RSEM/Kallisto等输出中的expected count可非整数，要保留方法与版本；ambiguous assignment依赖模型与reference，不能把fractional weight当作独立验证。Microarray依赖探针hybridization，long-read与short-read的error/coverage/isoform辨识也不同，选型需回到目标measurement。</p>','cbSTAR','cbRSEM','cbKallisto')
    ],['十条ambiguous reads怎样分配？',['假设在当前模型与其余证据下，每条read的responsibility为A=.8、B=.2。','十条read对A的expected contribution为8，对B为2，总和仍为10。','这些weights会随其他reads与reference改变；不是独立观测到8条确属A。','若一个downstream模型要求integer count，应使用该模型认可的导入方法，不能把TPM或任意fractional矩阵直接当raw counts。']], [term('Multimapping','同一read或fragment与多个reference位置/目标兼容。','cbSTAR','一个short read同时匹配gene family中的A和B。','丢弃、随机分配和概率分配产生不同偏差，应说明策略。'),term('Expected count','在assignment模型下汇总的分数计数期望。','cbRSEM','十条各有0.8权重的reads给transcript A贡献8。','非整数estimated counts不是TPM，也不等于已唯一确认的分子数。'),term('Pseudoalignment','确定read与候选transcripts兼容关系的快速定量策略。','cbKallisto','一个fragment与transcripts A/B共同兼容形成候选集合。','快速quantification输出不能替代所有需要基因组定位或splice-junction证据的分析。')],['STAR有sorted BAM，能直接说gene expression定量完成了吗？','不能。还需确认annotation、strandedness、read/fragment counting规则、multi-overlap与multimap处理，并检查QC与gene-count输出或后续quantification步骤。'],['Sequence、quality、alignment与annotation共同决定分配给feature的证据。','Reads、fragments、UMIs、gene counts和transcript expected counts须区分。','Mapping成功不自动证明quantification无偏、sample身份正确或isoform可识别。',['cbSTAR','cbRSEM','cbKallisto']]),
    chapter('cb12','Alternative splicing 与 PSI：总expression不变，isoform也能改变','把exon inclusion、junction reads与effective length逐项对应。',['一家工厂总共生产100件产品，A型号从20件变80件，总产量仍可不变。Gene-level DE会漏掉这种isoform选择。','Input是特定splicing event的junction/count证据或transcript abundance；Output是定义明确的PSI、ΔPSI和uncertainty。'],['m04','x08','s07','cb11'],['区分SE/A5SS/A3SS/MXE/RI等event','手算length-normalized inclusion PSI','检查ΔPSI方向、coverage与统计设计'],[
      section('先定义inclusion相对于哪个event',figures.cb12+'<p>Exon skipping、alternative donor/acceptor、mutually exclusive exons和intron retention对应不同的兼容reads与event结构。Exon-inclusion PSI通常表达inclusion占inclusion+skipping的比例；如果改用skipping做numerator，就是另一orientation，不能仍不加说明地沿用inclusion解释。Gene total counts不变时PSI可变化；反过来gene expression变化也不保证PSI变化。事件定义、strand、coordinate build必须连同结果保存。</p>','cbRMATS','cbSUPPA'),
      section('手算effective-length correction',code('cb12',`# Synthetic evidence for one defined exon-inclusion event.
I <- 30
S <- 10
L_inclusion <- 100
L_skipping <- 50
stopifnot(I >= 0, S >= 0, L_inclusion > 0, L_skipping > 0)
a <- I / L_inclusion
b <- S / L_skipping
psi <- if (a + b > 0) a / (a + b) else NA_real_
c(raw_fraction = I/(I+S), length_corrected_PSI = psi)
# Define the contrast direction explicitly.
psi_control <- 0.60
psi_treatment <- 0.40
psi_treatment - psi_control`),'cbRMATS'),
      section('何时用rMATS，何时用SUPPA2','<p>rMATS以定义的events及replicate read evidence进行splicing比较；JC与JCEC等选项决定只用junction还是结合exon计数，不能把两套output混成同一测量。SUPPA2从transcript abundance和event定义得到PSI并建模差异的uncertainty。Short-read isoform ambiguity、annotation缺失、低coverage与effective-length设置都会影响结果；3′ targeted assays通常不能支持像full-length数据那样广泛的splicing inference。</p>','cbRMATS','cbSUPPA'),
      section('一步一步检查结果与生物机制','<p>先选事件类型与annotation，确认每组independent replicates；检查每sample inclusion/skipping evidence，再过滤预先规定的低信息events；明确ΔPSI=Treatment−Control及工具输出的原生方向；报告effect与FDR而非只看一个显著event。可用junction tracks、isoform-specific RT-PCR、long reads或protein功能验证。若I=S=0，PSI未定义而不是0；高PSI但只有一条read也不能与深coverage的同PSI等同。</p>','cbRMATS','cbSUPPA')
    ],['为什么30与10不一定意味着PSI=.75？',['Raw evidence I=30、S=10，直接比例=30/40=.75。','按本toy effective lengths Li=100、Ls=50校正，I/Li=.3、S/Ls=.2。','Inclusion PSI=.3/(.3+.2)=.6。','Treatment PSI=.4时，按Treatment−Control定义ΔPSI=−.2；这表示inclusion减少20个百分点，不等于gene total expression下降20%。']], [term('Percent spliced in','在明确定义event与orientation下的inclusion比例。','cbRMATS','Length-corrected inclusion/skipping evidence为.3/.2时PSI=.6。','PSI的numerator、effective lengths和feature定义必须一致，缺乏coverage时可能未定义。'),term('Effective length','计数或定量模型中决定某类兼容证据可产生机会的长度量。','cbRMATS','同样30个inclusion与10个skipping reads在不同effective lengths下给不同PSI。','它不总等于exon总长，也不能脱离read length和event模型随意设定。'),term('Delta PSI','两条件PSI的有方向差，通常以比例或百分点报告。','cbSUPPA','Treatment=.4减Control=.6得到ΔPSI=−.2。','工具原生输出可能用相反组序，必须核对方向再解释。')],['一个gene的raw count翻倍，但inclusion和skipping比例保持不变，能说发生differential splicing吗？','不能只凭gene-level DE判断。需比较定义一致的PSI及其uncertainty；总量变化与isoform usage变化是两个不同问题。'],['Splicing来自junction/isoform兼容证据，而非gene total counts一列。','一个event×sample的PSI是定义好的比例；ΔPSI有明确组序。','低coverage、annotation与multimapping使漂亮比例仍可能不可靠。',['cbRMATS','cbSUPPA']]),
    chapter('cb13','Experimental design 与 power：先定义独立单位，再写研究计划','从CB_592的问题出发，把Bulk、single-cell和spatial放到同一条证据链。',['多拍一千张同一片组织，不等于多得到一千位donors。设计决定你最终能把结论推广给谁。','Input是研究问题、randomization、样本层级、assay与资源；Output是可识别的contrast、replication方案、power评估及预先定义的analysis plan。'],['d01','cb05','cb06','cb08'],['区分measurement unit、randomization unit与independent replicate','理解power依赖effect、variance、n和alpha','把五类课程研究问题转成可检查的design'],[
      section('实验单位先于统计模型',figures.cb13+'<p>Biological replicate是按目标总体和实验设计提供独立信息的单位；technical replicate帮助估计或减少测量误差。Matched design比较同单位在两条件下的变化；unpaired design比较不同独立单位。随机化、平衡batch、blind assessment与预先定义exclusion降低可避免bias。Condition与batch完全混杂时，即使测了很多genes/cells也不能区分两种来源。</p>','cbRTests','cbLM'),
      section('Power是一组设计假设下的概率',code('cb13',`# Planning illustration for an independent two-sample normal model.
plan <- power.t.test(delta = 1, sd = 1, sig.level = 0.05,
                     power = 0.8, type = "two.sample", alternative = "two.sided")
ceiling(plan$n)
# Two donors per group cannot be replaced by many cells per donor.
design <- expand.grid(donor = 1:4, condition = c("Control", "Treatment"))
design$donor <- factor(design$donor)
design$condition <- factor(design$condition, levels = c("Control", "Treatment"))
x <- model.matrix(~ donor + condition, data = design)
stopifnot(qr(x)$rank == ncol(x))
colnames(x)`),'cbPower','cbLM'),
      section('怎样设置power，而不是寻找一个万能n','<p>先定义最小有意义effect、variance/dispersion、检测规则与独立sample数。Power=1−β，在这些假设下拒绝false null的概率；alpha控制相应false-positive行为。RNA-seq需考虑表达分布、dispersion、过滤、多重检验与library depth；single-cell/spatial还需donor、cell type abundance与空间相关。可用pilot或文献范围做simulation/sensitivity grid，报告乐观/保守scenario。简单t-test的n结果只适用于该模型，不是所有omics的sample-size建议。</p>','cbPower','cbRTests'),
      section('五类课程问题怎样落地','<ul><li><b>Immunotherapy：</b>分开cell abundance与within-cell state；donor是比较单位，bulk与scRNA分别提供混合信号和分层信息，链接<a href="textbook.html#r11">Composition</a>与<a href="textbook.html#r12">Pseudobulk</a>。</li><li><b>Metastatic origin/site：</b>同时记录原发来源、转移部位、normal reference与batch，避免组织来源和技术平台混淆。</li><li><b>Age by cell type：</b>每个donor贡献每类cell的summary/counts；比较age×cell-type相关趋势时说明多重检验与横断面局限。</li><li><b>Spatial T-cell exhaustion：</b>先定义邻域、距离与tissue mask，区分邻近association、密度效应与真正的细胞间作用。</li><li><b>Treatment reversal：</b>优先配对before/after，区分state转变、clone selection与cell composition；回到<a href="textbook.html#t03">tumor microenvironment</a>的机制证据。</li></ul>','cbLM','cbCV'),
      section('一页proposal的最小检查表','<p>用一两句写target population、contrast与outcome；接着写biology motivation、assay measurement、data source、预计independent n、batch/配对结构、analysis strategy和下一项验证。公开数据已有不等于设计能回答你的问题；先检查sample metadata和accessibility。Mini-proposal中的数字若只是计划必须明确标记，不能当作已收集或足够power。最后用反事实检查：即使模型完美输出，这个结果能否回答原问题？若只能回答association，就按association写结论。</p>','cbPower','cbLM')
    ],['为什么1000cells不等于1000replicates？',['假设2位donors各贡献500cells，总measurement rows=1000。','Cells共享donor特性与处理背景；目标是新donor时独立unit仍主要由donor设计决定。','若处理是在donor层分配，cell-level permutations违反randomization结构。','规划时分别讨论增加donors、每donor cells和测序深度各自减少哪种uncertainty；不能用一个总行数替代所有n。']], [term('Statistical power','在指定alternative和设计假设下拒绝null的概率。','cbPower','给定effect、SD和alpha，可规划独立two-sample t-test的每组n。','Power值依赖模型与effect假设，不能从当前不显著结果推出效应不存在。'),term('Randomization unit','实验处理中独立分配condition的单位。','cbRTests','若按donor分配drug，donor而非其每个cell是处理分配单位。','错误地按更细层级重排或检验会产生伪重复。'),term('Estimand','研究明确想估计的总体量或对比。','cbLM','估计新donor中某cell type的Treatment−Control平均变化。','调整mediator、改变cell筛选或换denominator都可能改变estimand。')],['所有control来自一个batch、所有treatment来自另一个batch，~batch+condition能救回来吗？','不能凭回归公式分离完全混杂的effects。需要设计中的独立变化或额外数据；模型rank检查可暴露不可估计的contrast。'],['实验设计把biological question连接到可测assay与contrast。','Donor、culture、sample、cell和ROI承担不同的独立或依赖角色。','增加测量精度不能替代识别性、独立replication和合适目标总体。',['cbPower','cbLM','cbRTests']])
  ];
  for (const ch of chapters) {
    window.BIOCS_DATA_LENS[ch.id] = ch.lens;
    delete ch.lens;
    course.chapters.push(ch);
  }
  window.BIOCS_CB592_CHAPTERS = chapters;
  window.BIOCS_CB592_EXAMPLES = examples;
})();
