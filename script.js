(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', '打开导航');
  }));

  const filterInputs = [...document.querySelectorAll('#dataset-filters input[type="checkbox"]')];
  const datasets = [...document.querySelectorAll('.dataset-item')];
  const status = document.querySelector('#filter-status');
  const updateFilters = () => {
    const selected = filterInputs.filter(input => input.checked).map(input => input.value);
    let shown = 0;
    datasets.forEach(item => {
      const tags = item.dataset.tags?.split(' ') ?? [];
      const visible = selected.length === 0 || selected.some(tag => tags.includes(tag));
      item.hidden = !visible;
      if (visible) shown++;
    });
    if (status) status.textContent = selected.length === 0 ? `显示全部 ${shown} 个资源` : `已选 ${selected.length} 个方向，显示 ${shown} 个资源`;
  };
  filterInputs.forEach(input => input.addEventListener('change', updateFilters));
  document.querySelector('#reset-filters')?.addEventListener('click', () => {
    filterInputs.forEach(input => { input.checked = false; });
    updateFilters();
  });
  updateFilters();
})();
