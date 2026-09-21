(() => {
  'use strict';
  const host = document.querySelector('#segmentation-workspace');
  if (!host) return;

  const $ = selector => host.querySelector(selector);
  const modes = [
    {id:'nucleus', label:'只用核轮廓', rx:[28,26], ry:[28,26], shift:[[0,0],[0,0]], note:'细胞质中的 RNA 容易漏分；核 mask 不能自动代表整颗细胞。'},
    {id:'five', label:'5 µm 扩张', rx:[61,58], ry:[57,54], shift:[[0,0],[0,0]], note:'教学尺度接近当前 Xenium 文档中的默认核扩张距离；真实结果仍依赖染色、算法和组织。'},
    {id:'over', label:'过度扩张', rx:[145,135], ry:[115,118], shift:[[0,0],[0,0]], note:'轮廓过大时会把细胞外点纳入，也可能让相邻细胞的候选区域重叠。'},
    {id:'shift', label:'边界错位', rx:[110,110], ry:[75,75], shift:[[100,8],[100,10]], note:'核或图像整体配准偏移会改变归属；点位没有移动，cell ID 和矩阵却会改变。'}
  ];
  const cells = [
    {id:'A', cx:205, cy:176, rx:92, ry:78, nx:194, ny:174, color:'#2865af'},
    {id:'B', cx:446, cy:174, rx:84, ry:73, nx:448, ny:169, color:'#7554b8'}
  ];
  const spots = [
    {id:'t1',x:145,y:151,gene:'G1',truth:'A'}, {id:'t2',x:182,y:205,gene:'G2',truth:'A'},
    {id:'t3',x:226,y:178,gene:'G1',truth:'A'}, {id:'t4',x:271,y:161,gene:'G2',truth:'A'},
    {id:'t5',x:391,y:151,gene:'G1',truth:'B'}, {id:'t6',x:432,y:207,gene:'G2',truth:'B'},
    {id:'t7',x:479,y:176,gene:'G1',truth:'B'}, {id:'t8',x:516,y:190,gene:'G2',truth:'B'},
    {id:'t9',x:330,y:170,gene:'G1',truth:null}, {id:'t10',x:330,y:226,gene:'G2',truth:null}
  ];
  let active = 1, playing = false, timer = null;

  const svg = $('#segmentation-svg');
  svg.innerHTML = `<defs><filter id="seg-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect x="20" y="22" width="620" height="300" rx="18" fill="#f3f8ff" stroke="#d3e2f4"/>
    <text x="42" y="53" fill="#315d91" font-size="17" font-weight="700">固定的 RNA 点位与两个教学细胞</text>
    <g id="seg-truth-layer" opacity="0.45">${cells.map(cell=>`<ellipse cx="${cell.cx}" cy="${cell.cy}" rx="${cell.rx}" ry="${cell.ry}" fill="none" stroke="${cell.color}" stroke-width="2" stroke-dasharray="7 6"/>`).join('')}</g>
    ${cells.map((cell,index)=>`<ellipse id="seg-mask-${index}" cx="${cell.nx}" cy="${cell.ny}" rx="28" ry="28" fill="${cell.color}14" stroke="${cell.color}" stroke-width="4"/><circle cx="${cell.nx}" cy="${cell.ny}" r="24" fill="${cell.color}33" stroke="${cell.color}" stroke-width="2"/><text x="${cell.nx}" y="${cell.ny+5}" text-anchor="middle" fill="${cell.color}" font-size="18" font-weight="800">${cell.id}</text>`).join('')}
    ${spots.map(spot=>`<g id="seg-${spot.id}" class="seg-transcript"><circle cx="${spot.x}" cy="${spot.y}" r="8"/><text x="${spot.x+11}" y="${spot.y-8}" font-size="13" font-weight="700">${spot.gene}</text></g>`).join('')}
    <g transform="translate(43 292)"><circle r="6" fill="#168292"/><text x="12" y="5" font-size="13" fill="#526d8b">RNA detection</text><path d="M142 0h34" stroke="#2865af" stroke-width="3"/><text x="184" y="5" font-size="13" fill="#526d8b">estimated mask</text><path d="M310 0h34" stroke="#2865af" stroke-width="2" stroke-dasharray="6 5" opacity=".55"/><text x="352" y="5" font-size="13" fill="#526d8b">教学 true boundary</text></g>`;

  const inside = (spot, index, mode) => {
    const cell=cells[index], shift=mode.shift[index];
    const dx=(spot.x-(cell.nx+shift[0]))/mode.rx[index];
    const dy=(spot.y-(cell.ny+shift[1]))/mode.ry[index];
    return dx*dx+dy*dy<=1;
  };
  const assign = (spot, mode) => {
    const candidates=cells.map((_,i)=>i).filter(i=>inside(spot,i,mode));
    if (!candidates.length) return null;
    candidates.sort((a,b)=>{
      const ca=cells[a],cb=cells[b],sa=mode.shift[a],sb=mode.shift[b];
      return Math.hypot(spot.x-ca.nx-sa[0],spot.y-ca.ny-sa[1])-Math.hypot(spot.x-cb.nx-sb[0],spot.y-cb.ny-sb[1]);
    });
    return cells[candidates[0]].id;
  };

  function render(index, announce=true) {
    active=index; const mode=modes[index];
    const assigned=spots.map(spot=>({...spot,assigned:assign(spot,mode)}));
    const biological=assigned.filter(spot=>spot.truth);
    const correct=biological.filter(spot=>spot.assigned===spot.truth).length;
    const wrong=biological.filter(spot=>spot.assigned&&spot.assigned!==spot.truth).length;
    const missed=biological.filter(spot=>!spot.assigned).length;
    const falsePositive=assigned.filter(spot=>!spot.truth&&spot.assigned).length;
    cells.forEach((cell,i)=>{
      const mask=$(`#seg-mask-${i}`),shift=mode.shift[i];
      mask.setAttribute('cx',cell.nx+shift[0]); mask.setAttribute('cy',cell.ny+shift[1]);
      mask.setAttribute('rx',mode.rx[i]); mask.setAttribute('ry',mode.ry[i]);
    });
    assigned.forEach(spot=>{
      const group=$(`#seg-${spot.id}`), circle=group.querySelector('circle');
      const state=!spot.truth&&spot.assigned?'false-positive':!spot.assigned&&spot.truth?'missed':spot.assigned===spot.truth?'correct':spot.assigned?'wrong':'outside';
      group.dataset.state=state; group.dataset.assigned=spot.assigned||'none';
      circle.setAttribute('fill',spot.assigned==='A'?'#2865af':spot.assigned==='B'?'#7554b8':spot.truth?'#e1a32a':'#9aabc0');
    });
    $('#seg-truth-layer').style.opacity=$('#seg-show-truth').checked?'0.55':'0';
    const matrix={A:{G1:0,G2:0},B:{G1:0,G2:0}};
    assigned.forEach(spot=>{if(spot.assigned)matrix[spot.assigned][spot.gene]++;});
    $('#seg-matrix').innerHTML=`<tr><th>G1</th><td>${matrix.A.G1}</td><td>${matrix.B.G1}</td></tr><tr><th>G2</th><td>${matrix.A.G2}</td><td>${matrix.B.G2}</td></tr>`;
    $('#seg-correct').textContent=`${correct} / ${biological.length}`;
    $('#seg-wrong').textContent=String(wrong);
    $('#seg-missed').textContent=String(missed);
    $('#seg-false').textContent=String(falsePositive);
    $('#seg-mode-title').textContent=mode.label;
    $('#seg-mode-note').textContent=mode.note;
    $('#segmentation-status').textContent=`${mode.label}：正确归属 ${correct}/${biological.length}，错分 ${wrong}，漏分 ${missed}，误纳入细胞外点 ${falsePositive}。`;
    host.querySelectorAll('[data-seg-mode]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    if(announce) $('#segmentation-status').focus({preventScroll:true});
  }
  function paintPlay(){const button=$('#seg-play');button.textContent=playing?'Ⅱ 暂停扫描':active===modes.length-1?'↻ 重播边界变化':'▶ 播放边界变化';button.setAttribute('aria-pressed',String(playing));}
  function stop(){clearTimeout(timer);timer=null;playing=false;paintPlay();}
  function schedule(){clearTimeout(timer);if(!playing)return;timer=setTimeout(()=>{if(active<modes.length-1){render(active+1,false);schedule();}else stop();},1400);}
  host.querySelectorAll('[data-seg-mode]').forEach((button,index)=>button.addEventListener('click',()=>{stop();render(index);}));
  $('#seg-show-truth').addEventListener('change',()=>render(active,false));
  $('#seg-play').addEventListener('click',()=>{if(playing){stop();return;}if(active===modes.length-1)render(0,false);playing=true;paintPlay();schedule();});
  $('#seg-reset').addEventListener('click',()=>{stop();render(1);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();},{threshold:0}); observer.observe(host);
  render(1,false); paintPlay();
})();
