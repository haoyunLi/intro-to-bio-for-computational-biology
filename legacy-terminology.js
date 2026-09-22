/* Apply the shared English biological-term policy to legacy static pages. */
document.addEventListener('DOMContentLoaded', () => {
  const englishize = window.BIOCS_ENGLISHIZE_LEGACY || window.BIOCS_ENGLISHIZE;
  if (!englishize) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue.trim() || parent.closest('script,style,noscript,code,pre,textarea')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => { node.nodeValue = englishize(node.nodeValue); });
  document.querySelectorAll('[aria-label],[alt],[title],[placeholder]').forEach(element => {
    for (const attribute of ['aria-label','alt','title','placeholder']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, englishize(element.getAttribute(attribute)));
    }
  });
});
