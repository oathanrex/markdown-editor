/**
 * js/export/export-manager.js
 * Responsibility: Centralized API for client-side file exports.
 */

export function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

export const exportManager = {
    markdown: (content, fileName = 'document.md') => {
        downloadFile(content, fileName, 'text/markdown');
    },

    html: (content, htmlContent, fileName = 'document.html', standalone = true) => {
        let finalHtml = htmlContent;
        if (standalone) {
            const styles = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                    } catch (e) {
                        return '';
                    }
                }).join('');
            finalHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${styles}</style></head><body><div class="markdown-body">${htmlContent}</div></body></html>`;
        }
        downloadFile(finalHtml, fileName, 'text/html');
    },

    pdf: async (element, fileName = 'document.pdf', options = {}) => {
        const { jsPDF } = window.jspdf || window;
        if (!jsPDF) throw new Error("jsPDF library not loaded");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e1e1e' : '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF(options.orientation || 'p', 'mm', options.format || 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    },

    docx: async (content, fileName = 'document.docx') => {
        const docxLib = window.docx;
        if (!docxLib) throw new Error("Docx library not loaded");

        const { Document, Packer, Paragraph, TextRun } = docxLib;
        const doc = new Document({
            sections: [{
                properties: {},
                children: content.split('\n').map(line => new Paragraph({
                    children: [new TextRun(line)]
                }))
            }]
        });

        const blob = await Packer.toBlob(doc);
        downloadFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    },

    latex: (content, fileName = 'document.tex') => {
        const template = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\title{Exported Document}
\\begin{document}
${content.replace(/#/g, '\\#')}
\\end{document}`;
        downloadFile(template, fileName, 'application/x-tex');
    }
};
