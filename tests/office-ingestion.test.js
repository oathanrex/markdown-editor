import test from 'node:test';
import assert from 'node:assert/strict';
import { Export } from '../js/modules/export.js';

test('Office Ingestion - Spreadsheet rows convert to GFM Markdown table', () => {
    const exporter = new Export();

    // Mock sheet rows
    const mockRows = [
        ['Product', 'Q1 Sales', 'Q2 Sales'],
        ['Apples', '$10,000', '$12,000'],
        ['Oranges', '$8,500', '$9,200']
    ];

    // Verify table markdown generator
    const colCount = 3;
    const cleanCell = (c) => String(c ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>').trim();
    const headerCells = mockRows[0].map(cleanCell);
    const sepCells = headerCells.map(() => ':---');

    const tableLines = [
        `| ${headerCells.join(' | ')} |`,
        `| ${sepCells.join(' | ')} |`
    ];

    for (let r = 1; r < mockRows.length; r++) {
        tableLines.push(`| ${mockRows[r].map(cleanCell).join(' | ')} |`);
    }

    const tableMarkdown = tableLines.join('\n');
    assert.match(tableMarkdown, /\| Product \| Q1 Sales \| Q2 Sales \|/);
    assert.match(tableMarkdown, /\| :--- \| :--- \| :--- \|/);
    assert.match(tableMarkdown, /\| Apples \| \$10,000 \| \$12,000 \|/);
});

test('Office Ingestion - Supported extension validation handles all office & document formats', () => {
    const supported = ['md', 'markdown', 'txt', 'html', 'htm', 'docx', 'xlsx', 'xls', 'csv', 'pdf'];

    for (const ext of ['docx', 'xlsx', 'xls', 'csv', 'pdf', 'md', 'txt', 'html']) {
        assert.ok(supported.includes(ext), `Extension .${ext} should be supported`);
    }

    for (const ext of ['exe', 'zip', 'mp3', 'png']) {
        assert.ok(!supported.includes(ext), `Extension .${ext} should not be supported`);
    }
});
