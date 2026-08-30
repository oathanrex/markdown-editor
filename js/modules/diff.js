/**
 * Diff Module
 * Client-side diff viewer for comparing document versions
 */

/**
 * Diff Engine
 * Implements a simple line-by-line diff algorithm
 */
export class Diff {
    constructor() {
        // Diff types
        this.EQUAL = 0;
        this.INSERT = 1;
        this.DELETE = -1;
    }

    /**
     * Compute diff between two texts
     * @param {string} oldText - Original text
     * @param {string} newText - New text
     * @returns {Array} - Array of diff operations
     */
    computeDiff(oldText, newText) {
        const oldLines = oldText.split('\n');
        const newLines = newText.split('\n');

        // Use Longest Common Subsequence (LCS) algorithm
        const lcs = this.computeLCS(oldLines, newLines);

        return this.buildDiffFromLCS(oldLines, newLines, lcs);
    }

    /**
     * Compute Longest Common Subsequence
     * @param {Array} a - First array
     * @param {Array} b - Second array
     * @returns {Array} - LCS matrix
     */
    computeLCS(a, b) {
        const m = a.length;
        const n = b.length;

        // Create matrix
        const matrix = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

        // Fill matrix
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1] + 1;
                } else {
                    matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
                }
            }
        }

        return matrix;
    }

    /**
     * Build diff operations from LCS matrix
     * @param {Array} oldLines - Original lines
     * @param {Array} newLines - New lines
     * @param {Array} lcs - LCS matrix
     * @returns {Array}
     */
    buildDiffFromLCS(oldLines, newLines, lcs) {
        const diff = [];
        let i = oldLines.length;
        let j = newLines.length;

        // Backtrack through the matrix
        const operations = [];
        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
                operations.unshift({ type: this.EQUAL, line: oldLines[i - 1], oldLine: i, newLine: j });
                i--;
                j--;
            } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
                operations.unshift({ type: this.INSERT, line: newLines[j - 1], newLine: j });
                j--;
            } else if (i > 0) {
                operations.unshift({ type: this.DELETE, line: oldLines[i - 1], oldLine: i });
                i--;
            }
        }

        return operations;
    }

    /**
     * Render diff as HTML
     * @param {Array} diff - Diff operations
     * @returns {string} - HTML string
     */
    renderDiff(diff) {
        let html = '';
        let oldLineNum = 0;
        let newLineNum = 0;

        diff.forEach(op => {
            const lineClass = op.type === this.INSERT ? 'added' :
                op.type === this.DELETE ? 'removed' : '';
            const prefix = op.type === this.INSERT ? '+' :
                op.type === this.DELETE ? '-' : ' ';

            if (op.type === this.DELETE) {
                oldLineNum++;
                html += `<div class="diff-line ${lineClass}">
                        <span class="diff-line-number">${oldLineNum}</span>
                        <span class="diff-line-number"></span>
                        <span class="diff-line-content">${prefix} ${this.escapeHtml(op.line)}</span>
                    </div>`;
            } else if (op.type === this.INSERT) {
                newLineNum++;
                html += `<div class="diff-line ${lineClass}">
                        <span class="diff-line-number"></span>
                        <span class="diff-line-number">${newLineNum}</span>
                        <span class="diff-line-content">${prefix} ${this.escapeHtml(op.line)}</span>
                    </div>`;
            } else {
                oldLineNum++;
                newLineNum++;
                html += `<div class="diff-line ${lineClass}">
                        <span class="diff-line-number">${oldLineNum}</span>
                        <span class="diff-line-number">${newLineNum}</span>
                        <span class="diff-line-content">${prefix} ${this.escapeHtml(op.line)}</span>
                    </div>`;
            }
        });

        return html;
    }

    /**
     * Get diff statistics
     * @param {Array} diff - Diff operations
     * @returns {Object}
     */
    getStats(diff) {
        let added = 0;
        let removed = 0;
        let unchanged = 0;

        diff.forEach(op => {
            if (op.type === this.INSERT) added++;
            else if (op.type === this.DELETE) removed++;
            else unchanged++;
        });

        return { added, removed, unchanged, total: diff.length };
    }

    /**
     * Compute inline word diff for a line
     * @param {string} oldLine - Original line
     * @param {string} newLine - New line
     * @returns {Object} - Object with highlighted old and new lines
     */
    inlineWordDiff(oldLine, newLine) {
        const oldWords = oldLine.split(/(\s+)/);
        const newWords = newLine.split(/(\s+)/);

        const lcs = this.computeLCS(oldWords, newWords);
        const operations = this.buildDiffFromLCS(oldWords, newWords, lcs);

        let oldHtml = '';
        let newHtml = '';

        operations.forEach(op => {
            const escaped = this.escapeHtml(op.line);
            if (op.type === this.EQUAL) {
                oldHtml += escaped;
                newHtml += escaped;
            } else if (op.type === this.DELETE) {
                oldHtml += `<span class="diff-word-removed">${escaped}</span>`;
            } else {
                newHtml += `<span class="diff-word-added">${escaped}</span>`;
            }
        });

        return { oldHtml, newHtml };
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Create unified diff format
     * @param {string} oldText - Original text
     * @param {string} newText - New text
     * @param {string} oldName - Original file name
     * @param {string} newName - New file name
     * @returns {string}
     */
    createUnifiedDiff(oldText, newText, oldName = 'original', newName = 'modified') {
        const diff = this.computeDiff(oldText, newText);
        let output = '';

        output += `--- ${oldName}\n`;
        output += `+++ ${newName}\n`;

        let oldLine = 1;
        let newLine = 1;
        let hunkOldStart = 1;
        let hunkNewStart = 1;
        let hunkOldCount = 0;
        let hunkNewCount = 0;
        let hunkContent = '';

        diff.forEach((op, index) => {
            if (op.type === this.EQUAL) {
                hunkContent += ` ${op.line}\n`;
                hunkOldCount++;
                hunkNewCount++;
                oldLine++;
                newLine++;
            } else if (op.type === this.DELETE) {
                hunkContent += `-${op.line}\n`;
                hunkOldCount++;
                oldLine++;
            } else {
                hunkContent += `+${op.line}\n`;
                hunkNewCount++;
                newLine++;
            }
        });

        if (hunkContent) {
            output += `@@ -${hunkOldStart},${hunkOldCount} +${hunkNewStart},${hunkNewCount} @@\n`;
            output += hunkContent;
        }

        return output;
    }
}

