/**
 * js/ui/modals.js
 * Responsibility: Manages modal lifecycle, accessibility, and form logic.
 */

import { state, updateSetting } from '../core/state.js';

export function initModals() {
    const overlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    function openModal(id) {
        overlay.classList.add('active');
        modals.forEach(m => m.style.display = 'none');
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            // Accessibility: Focus first input
            const firstInput = modal.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }
    }

    function closeModal() {
        overlay.classList.remove('active');
        modals.forEach(m => m.setAttribute('aria-hidden', 'true'));
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Handle ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    return { openModal, closeModal };
}

export function setupSettings(onUpdate) {
    const autosaveCheck = document.getElementById('setting-autosave');
    const lineNumbersCheck = document.getElementById('setting-linenumbers');
    const previewThemeSelect = document.getElementById('setting-preview-theme');

    const fontSizeInput = document.getElementById('setting-fontsize');
    const wordWrapCheck = document.getElementById('setting-wordwrap');
    const pdfSizeSelect = document.getElementById('setting-pdf-size');

    autosaveCheck.addEventListener('change', (e) => {
        updateSetting('autosave', e.target.checked);
    });

    lineNumbersCheck.addEventListener('change', (e) => {
        updateSetting('linenumbers', e.target.checked);
    });

    fontSizeInput.addEventListener('focus', (e) => e.target.select());

    fontSizeInput.addEventListener('change', (e) => {
        updateSetting('fontSize', parseInt(e.target.value));
    });

    wordWrapCheck.addEventListener('change', (e) => {
        updateSetting('wordWrap', e.target.checked);
    });

    previewThemeSelect.addEventListener('change', (e) => {
        updateSetting('previewTheme', e.target.value);
    });

    pdfSizeSelect.addEventListener('change', (e) => {
        updateSetting('pdfSize', e.target.value);
    });
}

export function populateEmojis(container, onSelect) {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😋', '😛', '😜', '🤪', '🤩', '🥳', '😎', '🤓', '🧐', '😕', '😟', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬'];
    container.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');
    container.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            onSelect(e.target.textContent);
        }
    });
}
