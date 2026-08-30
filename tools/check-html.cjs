// Quick static checks: duplicate IDs, broken internal anchors, missing files
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..'); // project root (this script lives in tools/)
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// 1. Duplicate element IDs
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const idCounts = {};
ids.forEach(id => { idCounts[id] = (idCounts[id] || 0) + 1; });
const dupIds = Object.entries(idCounts).filter(([, n]) => n > 1);
console.log(dupIds.length ? 'DUPLICATE_IDS: ' + dupIds.map(([id, n]) => `${id}(x${n})`).join(', ') : 'OK: no duplicate ids');

// 2. Internal href anchors that have no matching id
const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
const missing = [...new Set(hrefs.filter(h => h && !idCounts[h]))];
console.log(missing.length ? 'MISSING_ANCHOR_TARGETS: ' + missing.join(', ') : 'OK: all internal anchors resolve');

// 3. Local script/src references that point to missing files
const srcs = [...html.matchAll(/(?:src|href)="(?!https?:|data:|#)([^"]+)"/g)].map(m => m[1]);
const missingFiles = srcs.filter(s => !fs.existsSync(path.join(root, s.split('?')[0])));
console.log(missingFiles.length ? 'MISSING_FILES: ' + [...new Set(missingFiles)].join(', ') : 'OK: all local references exist');