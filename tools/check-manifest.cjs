// Validates manifest.json structure and required PWA fields
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

const required = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
const missing = required.filter(k => !manifest[k]);
if (missing.length) {
    console.error('MANIFEST_MISSING_FIELDS:', missing.join(', '));
    process.exit(1);
}

for (const icon of manifest.icons) {
    const iconPath = path.join(root, icon.src);
    if (!fs.existsSync(iconPath)) {
        console.error('MANIFEST_ICON_MISSING:', icon.src);
        process.exit(1);
    }
}

console.log('MANIFEST_OK | icons:', manifest.icons.map(i => `${i.src} (${i.purpose})`).join(', '));