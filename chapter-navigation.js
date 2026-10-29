/* Keep the continuous core, the regulation topic, and the course catalogue distinct. */
(() => {
  'use strict';
  const regulationIds = Object.freeze(['rb01','rb02','rb03','rb04','rb05','rb06','rb07','rb08']);
  function resolve(chapterId, coreIds, catalogueIds) {
    const inCore = coreIds.includes(chapterId);
    const inRegulation = !inCore && regulationIds.includes(chapterId) && catalogueIds.includes(chapterId);
    const kind = inCore ? 'core' : inRegulation ? 'regulation' : 'catalogue';
    const ids = inCore ? coreIds : inRegulation ? regulationIds.filter(id => catalogueIds.includes(id)) : catalogueIds;
    const index = ids.indexOf(chapterId);
    return { kind, ids, index, previousId: index > 0 ? ids[index - 1] : undefined,
      nextId: index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined };
  }
  function omitRepeatedOpening(html, repeatedText) {
    if (typeof html !== 'string' || typeof repeatedText !== 'string' || !repeatedText) return html;
    const opening = html.match(/^\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i);
    if (!opening || opening[1] !== repeatedText) return html;
    const remainder = html.slice(opening[0].length);
    const remainingWords = remainder.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '').trim();
    if (!remainingWords) return html;
    return remainder;
  }
  window.BIOCS_CHAPTER_NAV = Object.freeze({ regulationIds, resolve, omitRepeatedOpening });
})();
