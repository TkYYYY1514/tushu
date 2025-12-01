/**
 * 移动端适配工具类
 * 提供移动端常见功能和优化方案
 */
const MobileUtils = {
    /**
     * 初始化移动端适配
     * 设置视口、处理iOS状态栏等
     */
    init() {
        this.setupViewport();
        this.fixIosStatusBar();
        this.setupTouchEvents();
        this.setupDeviceOrientation();
        this.preventDefaultTouchMove();
    },

    /**
     * 设置视口元信息
     */
    setupViewport() {
        // 检查是否已存在viewport元标签
        const existingViewport = document.querySelector('meta[name="viewport"]');
        if (!existingViewport) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(viewport);
        }
    },

    /**
     * 修复iOS状态栏问题
     */
    fixIosStatusBar() {
        // 为iOS设备添加安全区域padding
        if (this.isIOS()) {
            document.documentElement.classList.add('ios-device');
            
            // 添加顶部安全区域
            const statusBarHeight = this.getStatusBarHeight();
            if (statusBarHeight > 20) { // 说明是刘海屏设备
                document.documentElement.style.setProperty('--safe-area-inset-top', `${statusBarHeight}px`);
                document.documentElement.style.setProperty('--safe-area-inset-bottom', '34px');
            }
        }
    },

    /**
     * 设置触摸事件优化
     * 解决点击延迟和触摸反馈
     */
    setupTouchEvents() {
        // 为可点击元素添加触摸反馈
        document.addEventListener('DOMContentLoaded', () => {
            const clickableElements = document.querySelectorAll('button, a, [role="button"], .btn-hover');
            clickableElements.forEach(el => {
                if (!el.hasAttribute('data-no-touch-feedback')) {
                    el.addEventListener('touchstart', () => {
                        el.classList.add('touch-active');
                    }, { passive: true });
                    
                    el.addEventListener('touchend', () => {
                        setTimeout(() => {
                            el.classList.remove('touch-active');
                        }, 200);
                    }, { passive: true });
                    
                    el.addEventListener('touchmove', () => {
                        el.classList.remove('touch-active');
                    }, { passive: true });
                }
            });
        });
    },

    /**
     * 设置设备方向监听
     */
    setupDeviceOrientation() {
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });
    },

    /**
     * 处理设备方向变化
     */
    handleOrientationChange() {
        // 延迟执行，等待系统完成方向切换
        setTimeout(() => {
            // 通知页面内容更新布局
            const event = new CustomEvent('orientationChanged', {
                detail: {
                    orientation: window.orientation,
                    isPortrait: window.innerHeight > window.innerWidth
                }
            });
            window.dispatchEvent(event);
        }, 300);
    },

    /**
     * 阻止默认的触摸滚动行为（在需要自定义滚动的地方使用）
     */
    preventDefaultTouchMove() {
        // 不全局阻止，而是提供方法让具体页面在需要时调用
        this.preventDefaultTouchMoveForElement = function(element) {
            element.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
        };
    },

    /**
     * 检测是否为iOS设备
     * @returns {boolean}
     */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },

    /**
     * 检测是否为Android设备
     * @returns {boolean}
     */
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    },

    /**
     * 获取状态栏高度
     * @returns {number}
     */
    getStatusBarHeight() {
        // 获取状态栏高度的多种方式
        let height = 20; // 默认值
        
        // 方式1: 通过API获取
        if (typeof window.screen !== 'undefined' && typeof window.screen.top !== 'undefined') {
            height = window.screen.top || height;
        }
        
        // 方式2: 通过创建一个元素并获取其尺寸
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '-9999px';
        div.style.width = '100%';
        div.style.height = 'env(safe-area-inset-top)';
        document.body.appendChild(div);
        
        const computedHeight = Math.max(
            parseInt(getComputedStyle(div).height),
            height
        );
        
        document.body.removeChild(div);
        
        return computedHeight;
    },

    /**
     * 计算响应式字体大小
     * @param {number} baseSize - 基准字体大小（px）
     * @param {number} scaleFactor - 缩放因子
     * @returns {string} - 计算后的字体大小（rem）
     */
    calculateResponsiveFontSize(baseSize, scaleFactor = 1) {
        const viewportWidth = Math.min(window.innerWidth, 768); // 最大宽度限制
        const responsiveSize = baseSize * (viewportWidth / 375) * scaleFactor;
        return `${responsiveSize}px`;
    },

    /**
     * 设置响应式字体大小
     */
    setResponsiveFontSize() {
        // 设置根元素字体大小作为rem基准
        const baseFontSize = 16;
        const viewportWidth = Math.min(window.innerWidth, 768);
        const rootFontSize = (viewportWidth / 375) * baseFontSize;
        document.documentElement.style.fontSize = `${rootFontSize}px`;
    },

    /**
     * 检测是否支持触摸
     * @returns {boolean}
     */
    supportsTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * 检测网络状态
     * @returns {string} - 网络状态
     */
    getNetworkStatus() {
        if (!navigator.onLine) {
            return 'offline';
        }
        
        // 检查网络类型
        if (navigator.connection) {
            const connection = navigator.connection;
            return {
                type: connection.effectiveType || connection.type,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        
        return 'online';
    },

    /**
     * 添加网络状态监听
     * @param {Function} callback - 状态变化回调
     */
    addNetworkListener(callback) {
        window.addEventListener('online', () => callback('online'));
        window.addEventListener('offline', () => callback('offline'));
        
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => {
                callback(this.getNetworkStatus());
            });
        }
    },

    /**
     * 处理下拉刷新（简单实现）
     * @param {HTMLElement} container - 容器元素
     * @param {Function} onRefresh - 刷新回调
     */
    enablePullToRefresh(container, onRefresh) {
        let startY = 0;
        let pullDistance = 0;
        let isRefreshing = false;
        const threshold = 80; // 触发刷新的阈值
        
        // 创建刷新提示元素
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'pull-refresh-indicator';
        refreshIndicator.style.cssText = `
            position: absolute;
            top: -60px;
            left: 0;
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
            transition: transform 0.3s;
        `;
        refreshIndicator.innerHTML = '<i class="fas fa-arrow-down mr-2"></i>下拉刷新';
        container.parentNode.insertBefore(refreshIndicator, container);
        
        container.addEventListener('touchstart', (e) => {
            if (isRefreshing) return;
            
            // 只有当滚动到顶部时才允许下拉刷新
            if (container.scrollTop === 0) {
                startY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (isRefreshing || startY === 0) return;
            
            const currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            // 只允许下拉
            if (pullDistance > 0 && container.scrollTop === 0) {
                // 限制最大下拉距离
                const limitedDistance = Math.min(pullDistance * 0.5, threshold * 1.5);
                container.style.transform = `translateY(${limitedDistance}px)`;
                refreshIndicator.style.transform = `translateY(${limitedDistance}px)`;
                
                // 更新提示文本
                if (limitedDistance > threshold) {
                    refreshIndicator.innerHTML = '<i class="fas fa-arrow-up mr-2"></i>释放刷新';
                } else {
                    refreshIndicator.innerHTML = '<i class="fas fa-arrow-down mr-2"></i>下拉刷新';
                }
                
                // 阻止默认滚动
                e.preventDefault();
            }
        }, { passive: false });
        
        container.addEventListener('touchend', () => {
            if (isRefreshing || startY === 0) {
                startY = 0;
                pullDistance = 0;
                return;
            }
            
            // 判断是否触发刷新
            if (pullDistance * 0.5 > threshold) {
                isRefreshing = true;
                refreshIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>刷新中...';
                
                // 执行刷新回调
                if (typeof onRefresh === 'function') {
                    onRefresh(() => {
                        // 刷新完成后的回调
                        setTimeout(() => {
                            isRefreshing = false;
                            container.style.transform = '';
                            refreshIndicator.style.transform = '';
                            refreshIndicator.innerHTML = '<i class="fas fa-check mr-2"></i>刷新成功';
                            
                            setTimeout(() => {
                                refreshIndicator.innerHTML = '<i class="fas fa-arrow-down mr-2"></i>下拉刷新';
                            }, 1000);
                        }, 300);
                    });
                }
            } else {
                // 恢复原位
                container.style.transform = '';
                refreshIndicator.style.transform = '';
            }
            
            startY = 0;
            pullDistance = 0;
        }, { passive: true });
    },

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise}
     */
    copyToClipboard(text) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard) {
                // 使用现代API
                navigator.clipboard.writeText(text)
                    .then(() => resolve())
                    .catch(() => reject());
            } else {
                // 使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    successful ? resolve() : reject();
                } catch (error) {
                    reject(error);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        });
    },

    /**
     * 显示Toast消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 ('success', 'error', 'info')
     * @param {number} duration - 显示时长
     */
    showToast(message, type = 'success', duration = 2000) {
        // 避免重复创建多个Toast
        const existingToast = document.querySelector('.mobile-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `mobile-toast fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-lg text-white z-50 transition-all duration-300 ease-out opacity-0 scale-90`;
        
        // 设置背景色
        let bgColor = '#34D399'; // 默认绿色
        if (type === 'error') {
            bgColor = '#EF4444'; // 红色
        } else if (type === 'info') {
            bgColor = '#3B82F6'; // 蓝色
        }
        
        toast.style.backgroundColor = bgColor;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.classList.remove('opacity-0', 'scale-90');
            toast.classList.add('opacity-100', 'scale-100');
        }, 10);
        
        // 隐藏动画
        setTimeout(() => {
            toast.classList.remove('opacity-100', 'scale-100');
            toast.classList.add('opacity-0', 'scale-90');
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    },

    /**
     * 获取元素的绝对位置
     * @param {HTMLElement} element - 目标元素
     * @returns {Object} - 包含top, left, width, height的位置信息
     */
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * 滚动到指定元素
     * @param {HTMLElement} element - 目标元素
     * @param {Object} options - 滚动选项
     */
    scrollToElement(element, options = {}) {
        const {
            offset = 0,
            behavior = 'smooth',
            alignToTop = true
        } = options;
        
        if (element) {
            const elementPosition = this.getElementPosition(element);
            const scrollPosition = alignToTop 
                ? elementPosition.top - offset 
                : elementPosition.bottom - window.innerHeight + offset;
            
            window.scrollTo({
                top: scrollPosition,
                behavior
            });
        }
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间
     * @returns {Function} - 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 时间限制
     * @returns {Function} - 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 自动初始化
if (typeof window !== 'undefined') {
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MobileUtils.init());
    } else {
        MobileUtils.init();
    }
    
    // 窗口大小变化时重新计算响应式字体
    window.addEventListener('resize', MobileUtils.debounce(() => {
        MobileUtils.setResponsiveFontSize();
    }, 100));
}

// 导出工具类
try {
    module.exports = MobileUtils;
} catch (e) {
    // 浏览器环境不支持module.exports
    window.MobileUtils = MobileUtils;
}