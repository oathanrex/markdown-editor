import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Parser } from '../js/modules/parser.js';

test('GitHub alerts render with type and content', () => {
    const parser = new Parser();
    const html = parser.parse('> [!NOTE]\n> Useful information.\n\n> [!WARNING]\n> Be careful!');
    assert.match(html, /gfm-alert gfm-alert-note/);
    assert.match(html, /Useful information\./);
    assert.match(html, /gfm-alert-warning/);
    assert.match(html, /Be careful!/);
});

test('Footnotes render references, section, and backrefs', () => {
    const parser = new Parser();
    const html = parser.parse('Text with footnote[^1] and another[^two].\n\n[^1]: First note\n[^two]: Second note');
    assert.match(html, /footnote-ref/);
    assert.match(html, /href="#fn-1"/);
    assert.match(html, /href="#fn-two"/);
    assert.match(html, /<section class="footnotes"/);
    assert.match(html, /First note/);
    assert.match(html, /Second note/);
    assert.match(html, /footnote-backref/);
});

test('Footnote definitions inside code blocks are not extracted', () => {
    const parser = new Parser();
    const html = parser.parse('```\n[^1]: not a definition\n```\n');
    assert.ok(!html.includes('class="footnotes"'));
    assert.match(html, /\[\^1\]: not a definition/);
});

test('Bare URLs, emails and mentions autolink like GitHub', () => {
    const parser = new Parser();
    const html = parser.parse('Visit https://example.com/docs or www.example.org. Mail me@site.io. Ping @octocat and #42.');
    assert.match(html, /href="https:\/\/example\.com\/docs"/);
    assert.match(html, /href="https:\/\/www\.example\.org"/);
    assert.match(html, /href="mailto:me@site\.io"/);
    assert.match(html, /href="https:\/\/github\.com\/octocat"/);
    assert.match(html, /\/issues\/42"/);
});

test('Inline code protects content from formatting, autolinks and emoji', () => {
    const parser = new Parser();
    const html = parser.parse('Use `**not bold** https://x.com :smile:` now');
    assert.ok(html.includes('<code>**not bold** https://x.com :smile:</code>'));
    assert.ok(!html.includes('<strong>'));
    assert.ok(!html.includes('<a href="https://x.com"'));
});

test('Duplicate headings get GitHub-style slugs', () => {
    const parser = new Parser();
    const html = parser.parse('## Setup\n\ntext\n\n## Setup');
    assert.match(html, /id="setup"/);
    assert.match(html, /id="setup-1"/);
});

test('Details/summary collapsible sections render', () => {
    const parser = new Parser();
    const html = parser.parse('<details>\n<summary>Click me</summary>\n\nHidden **content**\n\n</details>');
    assert.match(html, /<details class="gfm-details">/);
    assert.match(html, /<summary>Click me<\/summary>/);
    assert.match(html, /<strong>content<\/strong>/);
});

test('Setext headings render (Title followed by === or ---)', () => {
    const parser = new Parser();
    const html = parser.parse('Big Title\n===\n\nSub Title\n---');
    assert.match(html, /<h1 id="big-title"/);
    assert.match(html, /<h2 id="sub-title"/);
});

test('Headings inside code blocks are not counted in TOC extraction', () => {
    const parser = new Parser();
    const headings = parser.extractHeadings('# Real\n\n```\n# not a heading\n```\n\n## Another');
    assert.equal(headings.length, 2);
    assert.equal(headings[0].id, 'real');
    assert.equal(headings[1].id, 'another');
});

test('Existing GFM features still work (tables, tasks, strikethrough, emoji)', () => {
    const parser = new Parser();
    const table = parser.parse('| a | b |\n|---|---|\n| 1 | 2 |');
    assert.match(table, /<thead><tr><th>a<\/th><th>b<\/th><\/tr><\/thead>/);
    assert.match(table, /<tbody><tr><td/);
    assert.ok(!table.includes('<tr><tr>'), 'table must not emit nested <tr> tags');

    const tasks = parser.parse('- [x] done\n- [ ] todo');
    assert.match(tasks, /task-list-item/);
    assert.match(tasks, / checked/);

    const strike = parser.parse('~~gone~~');
    assert.match(strike, /<del>gone<\/del>/);

    const emoji = parser.parse(':tada: :thinking: :shipit:');
    assert.match(emoji, /🎉/);
    assert.match(emoji, /🤔/);
    assert.match(emoji, /🐿️/);
});

test('Code blocks render GitHub-style header with language and copy button', () => {
    const parser = new Parser();
    const html = parser.parse('```html\n<div>hi</div>\n```');
    assert.match(html, /code-block-header/);
    assert.match(html, /<span class="code-language">html<\/span>/);
    assert.match(html, /copy-code-btn/);
    assert.match(html, /<code class="language-html">/);
    assert.match(html, /&lt;div&gt;hi&lt;\/div&gt;/);
});

test('Code block info string supports filename labels', () => {
    const parser = new Parser();
    const html = parser.parse('```html title="index.html"\n<body>\n```');
    assert.match(html, /<span class="code-language">index\.html<\/span>/);
    assert.match(html, /language-html/);

    const bare = parser.parse('```css styles.css\nbody{}\n```');
    assert.match(bare, /<span class="code-language">styles\.css<\/span>/);
});

test('Explicit links and images keep working alongside bare autolinks', () => {
    const parser = new Parser();
    const html = parser.parse('[GitHub](https://github.com) and ![alt](https://img.example/x.png)');
    assert.match(html, /<a href="https:\/\/github\.com"[^>]*>GitHub<\/a>/);
    assert.match(html, /<img src="https:\/\/img\.example\/x\.png" alt="alt">/);
});