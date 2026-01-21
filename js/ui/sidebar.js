/**
 * js/ui/sidebar.js
 * Responsibility: Generates and manages the document outline/TOC.
 */

export function generateOutline(content, container, onJump) {
    const lines = content.split('\n');
    const headings = [];

    lines.forEach((line, index) => {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            headings.push({
                level: match[1].length,
                text: match[2].trim(),
                line: index
            });
        }
    });

    container.innerHTML = '';

    if (headings.length === 0) {
        container.innerHTML = '<p class="empty-outline">No headings found</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'outline-list';

    headings.forEach(h => {
        const item = document.createElement('li');
        item.className = `outline-item level-${h.level}`;
        item.textContent = h.text;
        item.style.paddingLeft = `${(h.level - 1) * 12 + 16}px`;
        item.addEventListener('click', () => onJump(h.line));
        list.appendChild(item);
    });

    container.appendChild(list);
}
