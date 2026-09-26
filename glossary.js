(() => {
  const glossary = window.BIOCS_GLOSSARY;
  const sources = window.BIOCS_SOURCES;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const all = [...glossary.entries.values()];
  const categories = ['基础对象','遗传信息','能量与代谢','细胞与疾病','免疫','肿瘤遗传','实验与数据'];
  const params = new URLSearchParams(location.search);
  $('#glossary-search').value = params.get('q') || '';
  let browseAll = false;
  let limit = 60;

  const item = entry => {
    const source = sources[entry.sourceKey];
    return `<details class="glossary-entry"><summary><b>${escape(entry.label)}</b><span>${entry.example ? '解释 · 例子 · 误区' : '简明释义'}</span></summary><div class="glossary-definition"><p>${escape(entry.simple)}</p>${entry.example ? `<p><strong>例如</strong> ${escape(entry.example)}</p>` : ''}${entry.caution ? `<p><strong>别误会</strong> ${escape(entry.caution)}</p>` : ''}<div><a href="textbook.html#${escape(entry.chapterId)}">去相关章节学习 →</a>${source ? `<a href="${escape(source[1])}" target="_blank" rel="noopener noreferrer">${escape(source[0])} ↗</a>` : ''}</div></div></details>`;
  };
  function render() {
    const query = $('#glossary-search').value.trim().toLocaleLowerCase();
    const selected = query ? all.filter(entry => [entry.label,entry.simple,entry.example,entry.caution].join(' ').toLocaleLowerCase().includes(query)).sort((a,b) => Number(b.label.toLocaleLowerCase().startsWith(query)) - Number(a.label.toLocaleLowerCase().startsWith(query)) || a.label.localeCompare(b.label,'en')) : browseAll ? all.slice().sort((a,b)=>a.label.localeCompare(b.label,'en')) : glossary.essentials.map(name => glossary.get(name));
    const visible = selected.slice(0, limit);
    const grouped = new Map();
    for (const entry of visible) {
      const category = query || browseAll ? '搜索结果' : entry.category;
      if (!grouped.has(category)) grouped.set(category, []);
      grouped.get(category).push(entry);
    }
    $('#glossary-list').innerHTML = selected.length ? [...grouped].sort((a,b)=>categories.indexOf(a[0])-categories.indexOf(b[0])).map(([category, entries])=>`<section class="glossary-group"><h3>${escape(category)}</h3><div>${entries.map(item).join('')}</div></section>`).join('') : '<p class="glossary-empty">没有找到这个术语。试试英文全称、缩写，或中文描述；也可以在教材目录搜索章节。</p>';
    $('#glossary-status').textContent = query ? `找到 ${selected.length} 条；显示 ${visible.length} 条。` : browseAll ? `全部 ${all.length} 条；显示 ${visible.length} 条。` : `${all.length} 个可搜索术语；先展示 ${visible.length} 个核心概念。`;
    $('#glossary-results-title').textContent = query ? `“${$('#glossary-search').value.trim()}”的搜索结果` : browseAll ? '全部术语' : '先认识这些核心概念';
    $('#glossary-more').hidden = visible.length >= selected.length;
    $('#glossary-browse-all').hidden = Boolean(query) || browseAll;
    const nextUrl = new URL(location.href);
    if (query) nextUrl.searchParams.set('q', $('#glossary-search').value.trim()); else nextUrl.searchParams.delete('q');
    history.replaceState(null, '', nextUrl);
  }
  $('#glossary-form').addEventListener('submit', event => event.preventDefault());
  $('#glossary-search').addEventListener('input', () => {limit = 60; render();});
  $('#glossary-browse-all').addEventListener('click', () => {browseAll = true; limit = 60; render();});
  $('#glossary-more').addEventListener('click', () => {limit += 60; render();});
  render();
})();
