/**
 * Accessibility Module
 * ARIA support and keyboard navigation
 */

/**
 * Accessibility Manager
 */
export class Accessibility {
    constructor() {
        this.focusTrap = null;
        this.focusTrapElement = null; // Store element for cleanup
        this.lastFocusedElement = null;

        this.init();
    }

    /**
     * Initialize accessibility features
     */
    init() {
        this.setupModalAccessibility();
        this.setupLiveRegions();
        this.setupFocusIndicators();
        this.setupReducedMotion();
    }

    /**
     * Setup modal accessibility
     */
    setupModalAccessibility() {
        // Handle all modals
        document.querySelectorAll('.modal').forEach(modal => {
            // Close button
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }

            // Backdrop click
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }

            // Escape key
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(modal);
                }
            });
        });

        // Observe modal visibility changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'hidden') {
                    const modal = mutation.target;
                    if (!modal.hidden) {
                        this.openModal(modal);
                    }
                }
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            observer.observe(modal, { attributes: true });
        });
    }

    /**
     * Open modal with accessibility support
     */
    openModal(modal) {
        // Save last focused element
        this.lastFocusedElement = document.activeElement;

        // Setup focus trap
        this.trapFocus(modal);

        // Focus first focusable element
        const focusable = this.getFocusableElements(modal);
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        // Announce to screen readers
        this.announce(`${modal.getAttribute('aria-labelledby') || 'Dialog'} opened`);
    }

    /**
     * Close modal with accessibility support
     */
    closeModal(modal) {
        modal.hidden = true;

        // Release focus trap
        this.releaseFocusTrap();

        // Restore focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }

    /**
     * Trap focus within element
     */
    trapFocus(element) {
        const focusable = this.getFocusableElements(element);
        if (focusable.length === 0) return;

        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        this.focusTrap = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        element.addEventListener('keydown', this.focusTrap);
        this.focusTrapElement = element; // Store for proper cleanup
    }

    /**
     * Release focus trap
     */
    releaseFocusTrap() {
        if (this.focusTrap && this.focusTrapElement) {
            this.focusTrapElement.removeEventListener('keydown', this.focusTrap);
            this.focusTrap = null;
            this.focusTrapElement = null;
        }
    }

    /**
     * Get focusable elements within container
     */
    getFocusableElements(container) {
        const selector = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])'
        ].join(',');

        return Array.from(container.querySelectorAll(selector))
            .filter(el => el.offsetParent !== null);
    }

    /**
     * Setup live regions for announcements
     */
    setupLiveRegions() {
        // Ensure toast container has proper ARIA
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
            toastContainer.setAttribute('aria-live', 'polite');
            toastContainer.setAttribute('aria-atomic', 'true');
            toastContainer.setAttribute('role', 'status');
        }

        // Create hidden live region for announcements
        let liveRegion = document.getElementById('a11y-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'a11y-announcer';
            liveRegion.className = 'visually-hidden';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.setAttribute('role', 'status');
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Announce message to screen readers
     */
    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('a11y-announcer');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = '';
            // Use setTimeout to ensure the change is detected
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        }
    }

    /**
     * Setup focus indicators
     */
    setupFocusIndicators() {
        // Add class when using keyboard navigation
        let usingKeyboard = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                usingKeyboard = true;
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            usingKeyboard = false;
            document.body.classList.remove('using-keyboard');
        });
    }

    /**
     * Setup reduced motion support
     */
    setupReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleMotionPreference = (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        };

        handleMotionPreference(mediaQuery);
        mediaQuery.addEventListener('change', handleMotionPreference);
    }

    /**
     * Update editor status for screen readers
     */
    updateEditorStatus(line, column, wordCount, charCount) {
        const statusEl = document.querySelector('.editor-status-bar');
        if (statusEl) {
            statusEl.setAttribute('aria-label',
                `Line ${line}, Column ${column}. ${wordCount} words, ${charCount} characters.`);
        }
    }
}

