/* Search spelling bridges; displayed scientific names remain unchanged. */
(function (root) {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase().replace(/[\s\-–—_/]+/g, '');
  const aliases = {
    tf: ['transcription factor', 'TF activity'],
    lr: ['ligand receptor', 'Ligand–Receptor'],
    grn: ['gene regulatory network', 'regulon'],
    invivo: ['in vivo'],
    invitro: ['in vitro'],
    exvivo: ['ex vivo'],
    insilico: ['in silico'],
    enhanse: ['enhancer'],
    enhance: ['enhancer']
  };
  function matches(text, query) {
    const needle = normalize(query);
    if (!needle) return true;
    const haystack = normalize(text);
    const alternatives = aliases[needle];
    if (alternatives?.some(value => haystack.includes(normalize(value)))) return true;
    if (needle.length <= 3 && /^[a-z]+$/.test(needle))
      return new RegExp(`(^|[^a-z0-9])${needle}([^a-z0-9]|$)`, 'i').test(String(text));
    return haystack.includes(needle);
  }
  root.BIOCS_SEARCH = { matches, normalize };
})(typeof window !== 'undefined' ? window : globalThis);
