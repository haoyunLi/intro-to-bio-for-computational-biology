(() => {
  const stages = [
    {
      id: 'foundation',
      short: 'FOUNDATION',
      year: 'YEAR 1',
      title: '共同生物基础',
      subtitle: 'MCB 150 + IB 150',
      official: ['MCB 150', 'IB 150'],
      description: '先建立分子、细胞、遗传、演化与生态尺度。本站保留 UIUC 共同基础所需的 organismal / evolutionary reasoning，但按你的要求不设置 Plant Biology。',
      courseCodes: ['00', '10', '17']
    },
    {
      id: 'genetics',
      short: 'GENETICS CORE',
      year: 'YEAR 2 · FALL',
      title: '分子遗传学与实验逻辑',
      subtitle: 'MCB 250 + MCB 251',
      official: ['MCB 250', 'MCB 251'],
      description: '从 DNA replication、mutation 和 repair 走到 transcription、enhancer、chromatin、splicing、inheritance 与实验验证；这是你的最重点阶段。',
      courseCodes: ['01', '01B', '02']
    },
    {
      id: 'cells',
      short: 'CELL & BIOCHEM CORE',
      year: 'YEAR 2–3',
      title: '细胞、组织、发育与生化机制',
      subtitle: 'MCB 252 + MCB 253 + MCB 354',
      official: ['MCB 252', 'MCB 253', 'MCB 354'],
      description: '理解 membrane、organelle、cell cycle、development、signal transduction、physiology，以及能量与分子相互作用怎样驱动细胞行为。',
      courseCodes: ['03', '13', '14', '12']
    },
    {
      id: 'advanced',
      short: 'ADVANCED MCB',
      year: 'YEAR 3–4',
      title: '高级方向选修',
      subtitle: '300 / 400-level MCB',
      official: ['MCB 300+', 'MCB 400+'],
      description: '按项目问题进入 cancer、microbiology、immunology、neurobiology 与 systems physiology；对应 UIUC 至少四门 advanced MCB、其中一门 lab 的选修结构。',
      courseCodes: ['04', '11', '15', '16']
    },
    {
      id: 'discovery',
      short: 'DATA & DISCOVERY',
      year: 'ALL YEARS · PROJECT',
      title: '计算、生物实验与研究证据',
      subtitle: 'MCB + Data Science / MCB 290 / MCB 432',
      official: ['MCB 290', 'MCB 432', 'MCB + DS'],
      description: '把 assay、sequencing、statistics、data structure 与 biological claim 连成证据链；用真实文件和交互实验把知识转化为项目判断。',
      courseCodes: ['05', '06', '07', '08', '09']
    }
  ];

  const advancedClusters = [
    {
      id: 'regulation',
      title: 'Genetics & Gene Regulation',
      courses: 'MCB 317 · MCB 406 · MCB 421',
      description: 'genome organization、gene expression、microbial genetics，以及调控因果实验。',
      chapters: ['x01', 'x04', 'x06', 'x07', 'x08', 'x10', 'x13', 'x16']
    },
    {
      id: 'disease',
      title: 'Disease & Cancer',
      courses: 'MCB 320 · MCB 400',
      description: '从 somatic evolution、cell cycle 和 microenvironment 理解疾病机制。',
      chapters: ['t01', 't02', 't03', 'x14', 'l03', 'l05']
    },
    {
      id: 'immunity',
      title: 'Microbes & Immunity',
      courses: 'MCB 300 · MCB 408 · MCB 426 · MCB 430',
      description: '微生物怎样生存、致病，免疫系统怎样识别并形成记忆。',
      chapters: ['u01', 'u03', 'u04', 'i01', 'i02', 'i03', 'i05']
    },
    {
      id: 'systems',
      title: 'Neuro & Physiology',
      courses: 'MCB 314 · MCB 401 · MCB 402 · MCB 413',
      description: '从膜电位与 receptor 走到神经、内分泌和器官稳态。',
      chapters: ['h01', 'h03', 'h06', 'l01', 'l02', 'n01', 'n02', 'n04']
    },
    {
      id: 'development',
      title: 'Development & Regeneration',
      courses: 'MCB 410',
      description: '同一套 genome 如何通过 spatial information 和 cell fate 产生不同组织。',
      chapters: ['v01', 'v02', 'v03', 'v04', 'v05']
    },
    {
      id: 'computing',
      title: 'Computing & Discovery',
      courses: 'MCB 432 · MCB 290 · MCB + DS',
      description: '让模型、数据管理和实验设计服务于可检验的 biological claim。',
      chapters: ['d01', 'd04', 'k01', 'k06', 'q04', 'r02', 'r03', 'r05']
    }
  ];

  const tracks = [
    {
      id: 'core',
      label: 'UIUC MCB Core',
      title: '按正式 core sequence 建立完整骨架',
      description: '适合系统补齐：共同基础 → molecular genetics → cells / development → biochemistry → advanced MCB。',
      chapters: ['b01', 'b03', 'b05', 'g01', 'g04', 'm01', 'm03', 'm05', 'c01', 'c04', 'v01', 'l01', 'h01', 'u01', 'i01']
    },
    {
      id: 'genetics',
      label: 'Deep Genetics',
      title: '围绕你最需要的调控遗传学深入',
      description: '重点连接 enhancer、chromatin、splicing、GWAS、somatic evolution 与 perturbation evidence。',
      chapters: ['g01', 'g04', 'x01', 'x02', 'x04', 'x06', 'x07', 'x08', 'x10', 'x11', 'x13', 'x14', 'x16']
    },
    {
      id: 'computational',
      label: 'MCB + Data Science',
      title: '为 computational biology 项目组织知识',
      description: '先掌握生物机制，再追踪样本、assay、matrix、normalization 与 inference boundary。',
      chapters: ['b01', 'x06', 'x08', 'l06', 'd01', 'd02', 'd04', 'k01', 'k06', 'q04', 'r02', 'r03', 'r05', 's01']
    }
  ];

  const supporting = [
    ['Chemistry', 'CHEM 102/103 · 104/105 · 232/233', '理解 bonding、thermodynamics、acid–base 与 organic functional groups。'],
    ['Quantitative', 'MATH 220/221 · STAT 212', '理解变化率、概率、sampling、uncertainty 与 statistical inference。'],
    ['Physics', 'PHYS 101/102 or 211–214', '理解 energy、diffusion、electric potential、optics 与 measurement。'],
    ['Data Science option', 'STAT 107/207 · CS 277/307 · IS 467/477', 'UIUC MCB + DS 的计算、建模、伦理、data management 与 reproducibility。']
  ];

  const stageByCourse = Object.fromEntries(stages.flatMap(stage => stage.courseCodes.map(code => [code, stage])));
  window.BIOCS_UIUC = {
    catalogYear: '2026–2027',
    verified: '2026-09-21',
    stages,
    tracks,
    advancedClusters,
    supporting,
    stageByCourse,
    sources: {
      mcb: 'https://catalog.illinois.edu/undergraduate/las/molecular-cellular-biology-bslas/',
      mcbds: 'https://catalog.illinois.edu/undergraduate/las/molecular-cellular-biology-data-science-bslas/',
      ib: 'https://catalog.illinois.edu/undergraduate/las/integrative-biology-bslas/',
      advanced: 'https://app.mcb.illinois.edu/courses/advanced',
      biology: 'https://biology.illinois.edu/choosing-your-major'
    }
  };
})();
