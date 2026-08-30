/**
 * Themes Module
 * Theme management and switching
 */

/**
 * Theme Manager
 */
export class Themes {
    constructor(options = {}) {
        this.storage = options.storage;
        this.onThemeChange = options.onThemeChange;

        this.currentTheme = 'dark';
        this.themes = ['dark', 'light', 'high-contrast'];

        this.init();
    }

    /**
     * Initialize themes
     */
    async init() {
        // Load saved theme
        await this.loadSavedTheme();

        // Setup theme toggle button
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.cycleTheme());
        }

        // Setup theme select in settings
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = this.currentTheme;
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.hasUserPreference) {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                }
            });
        }
    }

    /**
     * Load saved theme from storage
     */
    async loadSavedTheme() {
        if (this.storage) {
            const savedTheme = await this.storage.getSetting('theme');
            if (savedTheme && this.themes.includes(savedTheme)) {
                this.setTheme(savedTheme, false);
                this.hasUserPreference = true;
                return;
            }
        }

        // Check localStorage as fallback
        const localTheme = localStorage.getItem('md-editor-theme');
        if (localTheme && this.themes.includes(localTheme)) {
            this.setTheme(localTheme, false);
            this.hasUserPreference = true;
            return;
        }

        // Use system preference
        if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
            this.setTheme('light', false);
        }
    }

    /**
     * Set theme
     */
    async setTheme(theme, save = true) {
        if (!this.themes.includes(theme)) return;

        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // Update theme toggle button icons
        this.updateToggleButton();

        // Update theme select
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = theme;
        }

        // Save preference
        if (save) {
            this.hasUserPreference = true;
            localStorage.setItem('md-editor-theme', theme);
            if (this.storage) {
                await this.storage.saveSetting('theme', theme);
            }
        }

        // Callback
        if (this.onThemeChange) {
            this.onThemeChange(theme);
        }
    }

    /**
     * Cycle through themes
     */
    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    /**
     * Update theme toggle button
     */
    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const sunIcon = toggleBtn.querySelector('.sun-icon');
        const moonIcon = toggleBtn.querySelector('.moon-icon');

        if (sunIcon && moonIcon) {
            if (this.currentTheme === 'light') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark theme
     */
    isDark() {
        return this.currentTheme === 'dark' || this.currentTheme === 'high-contrast';
    }
}

