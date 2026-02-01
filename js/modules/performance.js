/**
 * Performance Module
 * Debouncing, throttling, and optimization utilities
 */

/**
 * Performance utilities
 */
export class Performance {
    constructor() {
        this.workers = new Map();
        this.idleCallbacks = new Map();
    }

    /**
     * Debounce function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Request idle callback with fallback
     */
    requestIdleCallback(callback, options = {}) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(callback, options);
        } else {
            return setTimeout(() => {
                callback({
                    didTimeout: false,
                    timeRemaining: () => 50
                });
            }, 1);
        }
    }

    /**
     * Cancel idle callback
     */
    cancelIdleCallback(id) {
        if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(id);
        } else {
            clearTimeout(id);
        }
    }

    /**
     * Create or get a Web Worker
     */
    getWorker(name, scriptUrl) {
        if (this.workers.has(name)) {
            return this.workers.get(name);
        }

        try {
            const worker = new Worker(scriptUrl);
            this.workers.set(name, worker);
            return worker;
        } catch (e) {
            console.error('Failed to create worker:', e);
            return null;
        }
    }

    /**
     * Terminate a worker
     */
    terminateWorker(name) {
        const worker = this.workers.get(name);
        if (worker) {
            worker.terminate();
            this.workers.delete(name);
        }
    }

    /**
     * Terminate all workers
     */
    terminateAllWorkers() {
        this.workers.forEach((worker, name) => {
            worker.terminate();
        });
        this.workers.clear();
    }

    /**
     * Measure execution time
     */
    measure(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Async measure
     */
    async measureAsync(name, func) {
        const start = performance.now();
        const result = await func();
        const end = performance.now();
        console.log(`${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    }

    /**
     * Batch DOM updates
     */
    batchUpdate(updates) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                updates.forEach(update => update());
                resolve();
            });
        });
    }

    /**
     * Virtual list renderer for large content
     */
    createVirtualList(options) {
        const {
            container,
            items,
            itemHeight,
            renderItem,
            overscan = 5
        } = options;

        const containerHeight = container.clientHeight;
        const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;

        let scrollTop = 0;
        let startIndex = 0;

        const render = () => {
            startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
            const endIndex = Math.min(items.length, startIndex + visibleCount);

            const fragment = document.createDocumentFragment();
            const spacerTop = document.createElement('div');
            spacerTop.style.height = `${startIndex * itemHeight}px`;
            fragment.appendChild(spacerTop);

            for (let i = startIndex; i < endIndex; i++) {
                const itemEl = renderItem(items[i], i);
                fragment.appendChild(itemEl);
            }

            const spacerBottom = document.createElement('div');
            spacerBottom.style.height = `${(items.length - endIndex) * itemHeight}px`;
            fragment.appendChild(spacerBottom);

            container.innerHTML = '';
            container.appendChild(fragment);
        };

        const handleScroll = this.throttle(() => {
            scrollTop = container.scrollTop;
            render();
        }, 16);

        container.addEventListener('scroll', handleScroll);
        render();

        return {
            update: (newItems) => {
                items.length = 0;
                items.push(...newItems);
                render();
            },
            destroy: () => {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }

    /**
     * Incremental string diff for large texts
     */
    incrementalDiff(oldText, newText) {
        // Find common prefix
        let prefixLen = 0;
        const minLen = Math.min(oldText.length, newText.length);
        while (prefixLen < minLen && oldText[prefixLen] === newText[prefixLen]) {
            prefixLen++;
        }

        // Find common suffix
        let suffixLen = 0;
        while (
            suffixLen < minLen - prefixLen &&
            oldText[oldText.length - 1 - suffixLen] === newText[newText.length - 1 - suffixLen]
        ) {
            suffixLen++;
        }

        return {
            start: prefixLen,
            oldEnd: oldText.length - suffixLen,
            newEnd: newText.length - suffixLen,
            added: newText.substring(prefixLen, newText.length - suffixLen),
            removed: oldText.substring(prefixLen, oldText.length - suffixLen)
        };
    }

    /**
     * Check if we should use Web Workers (based on content size)
     */
    shouldUseWorker(contentLength) {
        // Use worker for content > 50KB
        return contentLength > 50000 && typeof Worker !== 'undefined';
    }

    /**
     * Memory usage estimate
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
}

