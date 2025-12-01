/*
 * 图书馆系统动画效果工具
 * 提供丰富的页面过渡和用户交互动画
 */

class AnimationUtils {
  constructor() {
    this.animations = new Map();
    this.supportedFeatures = this.checkSupportedFeatures();
    this.defaultDuration = 300; // 默认动画持续时间（毫秒）
  }

  // 检查浏览器支持的动画特性
  checkSupportedFeatures() {
    const features = {};
    
    // 检查CSS动画支持
    features.cssAnimations = 'animation' in document.createElement('div').style;
    
    // 检查CSS过渡支持
    features.cssTransitions = 'transition' in document.createElement('div').style;
    
    // 检查requestAnimationFrame支持
    features.requestAnimationFrame = typeof window.requestAnimationFrame === 'function';
    
    // 检查Intersection Observer支持
    features.intersectionObserver = 'IntersectionObserver' in window;
    
    return features;
  }

  // 执行CSS类动画
  animateWithClass(element, animationClass, duration = this.defaultDuration) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 防止重复动画
      if (element.classList.contains(animationClass)) {
        element.classList.remove(animationClass);
        // 强制重排，确保动画可以重新触发
        void element.offsetWidth;
      }

      // 添加动画类
      element.classList.add(animationClass);

      // 存储动画引用
      const animationKey = `${element.id || 'anonymous'}_${animationClass}`;
      this.animations.set(animationKey, true);

      // 监听动画结束事件
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        element.classList.remove(animationClass);
        this.animations.delete(animationKey);
        resolve(true);
      };

      // 设置动画结束监听
      element.addEventListener('animationend', handleAnimationEnd, { once: true });

      // 添加安全超时，防止动画卡住
      setTimeout(() => {
        if (this.animations.has(animationKey)) {
          element.removeEventListener('animationend', handleAnimationEnd);
          element.classList.remove(animationClass);
          this.animations.delete(animationKey);
          resolve(false); // 动画超时
        }
      }, duration + 100);
    });
  }

  // 淡入效果
  fadeIn(element, duration = this.defaultDuration) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 初始状态
      element.style.opacity = '0';
      element.style.display = 'block';
      element.style.transition = `opacity ${duration}ms ease-out`;

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.opacity = '1';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        // 清除过渡样式，避免影响其他动画
        element.style.transition = '';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.opacity = '1';
        resolve(true);
      }, duration + 50);
    });
  }

  // 淡出效果
  fadeOut(element, duration = this.defaultDuration, hideDisplay = true) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 初始状态
      element.style.opacity = '1';
      element.style.transition = `opacity ${duration}ms ease-out`;

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.opacity = '0';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        
        if (hideDisplay) {
          element.style.display = 'none';
        }
        
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.opacity = '0';
        
        if (hideDisplay) {
          element.style.display = 'none';
        }
        
        resolve(true);
      }, duration + 50);
    });
  }

  // 滑动动画 - 从右侧滑入
  slideInRight(element, duration = this.defaultDuration) {
    return this.slideIn(element, 'right', duration);
  }

  // 滑动动画 - 从左侧滑入
  slideInLeft(element, duration = this.defaultDuration) {
    return this.slideIn(element, 'left', duration);
  }

  // 滑动动画 - 从顶部滑入
  slideInTop(element, duration = this.defaultDuration) {
    return this.slideIn(element, 'top', duration);
  }

  // 滑动动画 - 从底部滑入
  slideInBottom(element, duration = this.defaultDuration) {
    return this.slideIn(element, 'bottom', duration);
  }

  // 通用滑动动画
  slideIn(element, direction, duration = this.defaultDuration) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 设置初始位置
      const initialPositions = {
        right: 'translateX(100%)',
        left: 'translateX(-100%)',
        top: 'translateY(-100%)',
        bottom: 'translateY(100%)'
      };

      const initialPosition = initialPositions[direction] || 'translateX(100%)';

      // 初始样式
      element.style.transform = initialPosition;
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      element.style.display = 'block';
      element.style.position = element.style.position || 'relative';

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.transform = 'translate(0, 0)';
      element.style.opacity = '1';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.transform = 'translate(0, 0)';
        element.style.opacity = '1';
        resolve(true);
      }, duration + 50);
    });
  }

  // 缩放动画
  scaleIn(element, fromScale = 0.8, duration = this.defaultDuration) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 初始样式
      element.style.transform = `scale(${fromScale})`;
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      element.style.display = 'block';
      element.style.position = element.style.position || 'relative';

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
        resolve(true);
      }, duration + 50);
    });
  }

  // 弹性缩放动画
  bounceIn(element, duration = 600) {
    return this.animateWithClass(element, 'bounce-in-animation', duration);
  }

  // 心跳动画
  heartbeat(element, iterations = 1, duration = 1000) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 创建动画
      const animate = () => {
        element.style.transform = 'scale(1)';
        element.style.transition = `transform ${duration / 4}ms ease-out`;

        setTimeout(() => {
          element.style.transform = 'scale(1.2)';
          element.style.transition = `transform ${duration / 4}ms ease-in`;

          setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.transition = `transform ${duration / 2}ms ease-out`;
          }, duration / 4);
        }, duration / 4);
      };

      // 执行动画
      animate();

      // 多次重复
      if (iterations > 1) {
        let count = 1;
        const interval = setInterval(() => {
          count++;
          animate();
          
          if (count >= iterations) {
            clearInterval(interval);
            setTimeout(() => {
              element.style.transition = '';
              element.style.transform = 'scale(1)';
              resolve(true);
            }, duration);
          }
        }, duration);
      } else {
        // 单次动画结束
        setTimeout(() => {
          element.style.transition = '';
          element.style.transform = 'scale(1)';
          resolve(true);
        }, duration);
      }
    });
  }

  // 脉冲动画
  pulse(element, duration = 2000, iterations = 'infinite') {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 保存原始样式，以便稍后恢复
      const originalTransition = element.style.transition;
      const originalOpacity = element.style.opacity;

      // 设置脉冲动画
      element.style.transition = `opacity ${duration / 2}ms ease-in-out`;
      
      if (iterations === 'infinite') {
        // 无限脉冲
        const pulse = () => {
          element.style.opacity = '1';
          
          setTimeout(() => {
            element.style.opacity = '0.6';
            
            setTimeout(() => {
              if (element.style.opacity !== null) { // 检查元素是否仍然存在
                pulse();
              }
            }, duration / 2);
          }, duration / 2);
        };
        
        pulse();
        resolve(true);
      } else {
        // 有限次数脉冲
        let count = 0;
        
        const pulse = () => {
          element.style.opacity = '1';
          
          setTimeout(() => {
            element.style.opacity = '0.6';
            
            count++;
            
            if (count < iterations) {
              setTimeout(pulse, duration / 2);
            } else {
              // 恢复原始样式
              setTimeout(() => {
                element.style.transition = originalTransition;
                element.style.opacity = originalOpacity;
                resolve(true);
              }, duration / 2);
            }
          }, duration / 2);
        };
        
        pulse();
      }
    });
  }

  // 旋转动画
  rotate(element, degrees = 360, duration = this.defaultDuration) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 初始样式
      element.style.transform = 'rotate(0deg)';
      element.style.transition = `transform ${duration}ms ease-out`;

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.transform = `rotate(${degrees}deg)`;

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.transform = `rotate(${degrees}deg)`;
        resolve(true);
      }, duration + 50);
    });
  }

  // 页面过渡动画 - 进入新页面
  pageTransitionIn(element, duration = 400) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 设置页面容器样式
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '100%';
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.transition = `left ${duration}ms ease-out`;
      element.style.zIndex = '100';

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.left = '0';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        element.style.position = 'relative';
        element.style.left = '0';
        element.style.zIndex = '1';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.position = 'relative';
        element.style.left = '0';
        element.style.zIndex = '1';
        resolve(true);
      }, duration + 50);
    });
  }

  // 页面过渡动画 - 离开页面
  pageTransitionOut(element, duration = 400) {
    return new Promise((resolve) => {
      if (!element) {
        resolve(false);
        return;
      }

      // 设置页面容器样式
      element.style.position = 'fixed';
      element.style.top = '0';
      element.style.left = '0';
      element.style.width = '100%';
      element.style.height = '100%';
      element.style.transition = `left ${duration}ms ease-out`;
      element.style.zIndex = '100';

      // 强制重排
      void element.offsetWidth;

      // 执行动画
      element.style.left = '-100%';

      // 监听过渡结束
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = '';
        element.style.position = 'relative';
        element.style.left = '0';
        element.style.zIndex = '0';
        resolve(true);
      };

      element.addEventListener('transitionend', handleTransitionEnd, { once: true });

      // 安全超时
      setTimeout(() => {
        element.style.transition = '';
        element.style.position = 'relative';
        element.style.left = '0';
        element.style.zIndex = '0';
        resolve(true);
      }, duration + 50);
    });
  }

  // 添加元素进入视图时的动画
  animateOnScroll(elements, animationType = 'fadeIn', threshold = 0.1, once = true) {
    if (!this.supportedFeatures.intersectionObserver || !elements || !elements.length) {
      console.warn('Intersection Observer不支持或未提供有效元素');
      return;
    }

    // 创建观察器
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 执行动画
          const element = entry.target;
          
          switch (animationType) {
            case 'fadeIn':
              this.fadeIn(element);
              break;
            case 'slideInUp':
              this.slideInBottom(element);
              break;
            case 'slideInLeft':
              this.slideInLeft(element);
              break;
            case 'slideInRight':
              this.slideInRight(element);
              break;
            case 'scaleIn':
              this.scaleIn(element);
              break;
            default:
              this.fadeIn(element);
          }

          // 如果只观察一次，取消观察
          if (once) {
            observer.unobserve(element);
          }
        }
      });
    }, { threshold });

    // 观察所有元素
    elements.forEach(element => {
      // 设置初始状态
      element.style.opacity = '0';
      observer.observe(element);
    });

    return observer;
  }

  // 添加触摸反馈动画
  addTouchFeedback(element, scale = 0.95, duration = 200) {
    if (!element) return;

    // 触摸开始
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      element.style.transform = `scale(${scale})`;
      element.style.transition = `transform ${duration}ms ease-out`;
    }, { passive: false });

    // 触摸结束
    element.addEventListener('touchend', () => {
      element.style.transform = 'scale(1)';
      element.style.transition = `transform ${duration}ms ease-in`;
    });

    // 触摸取消
    element.addEventListener('touchcancel', () => {
      element.style.transform = 'scale(1)';
      element.style.transition = `transform ${duration}ms ease-in`;
    });
  }

  // 批量添加触摸反馈
  addTouchFeedbackToElements(selector, scale = 0.95) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.addTouchFeedback(element, scale);
    });
  }

  // 添加点击波纹效果
  addRippleEffect(element) {
    if (!element) return;

    element.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      // 设置波纹样式
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 600ms ease-out';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';

      // 确保父元素有相对定位
      if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }

      // 添加波纹到元素
      element.appendChild(ripple);

      // 动画结束后移除波纹
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  // 创建动画样式（如果不存在）
  createAnimationStyles() {
    // 检查是否已经添加了样式
    if (document.getElementById('animations-styles')) return;

    // 创建样式表
    const style = document.createElement('style');
    style.id = 'animations-styles';
    style.textContent = `
      @keyframes bounce-in-animation {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      /* 预定义的动画类 */
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .animate-fade-out {
        animation: fadeOut 0.5s ease-out forwards;
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.5s ease-out forwards;
      }
      
      .animate-slide-in-left {
        animation: slideInLeft 0.5s ease-out forwards;
      }
      
      .animate-slide-in-top {
        animation: slideInTop 0.5s ease-out forwards;
      }
      
      .animate-slide-in-bottom {
        animation: slideInBottom 0.5s ease-out forwards;
      }
      
      .animate-scale-in {
        animation: scaleIn 0.5s ease-out forwards;
      }
      
      .animate-bounce-in {
        animation: bounce-in-animation 0.6s ease-out forwards;
      }
      
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      @keyframes slideInRight {
        from { 
          transform: translateX(100%);
          opacity: 0;
        }
        to { 
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInLeft {
        from { 
          transform: translateX(-100%);
          opacity: 0;
        }
        to { 
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInTop {
        from { 
          transform: translateY(-100%);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideInBottom {
        from { 
          transform: translateY(100%);
          opacity: 0;
        }
        to { 
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        from { 
          transform: scale(0.8);
          opacity: 0;
        }
        to { 
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `;

    // 添加到文档头部
    document.head.appendChild(style);
  }

  // 初始化动画系统
  init() {
    // 创建必要的动画样式
    this.createAnimationStyles();
    
    // 自动给所有按钮添加触摸反馈
    setTimeout(() => {
      this.addTouchFeedbackToElements('button, .btn, .nav-link, a[href]');
      
      // 给主要按钮添加波纹效果
      document.querySelectorAll('button.primary, .btn-primary').forEach(button => {
        this.addRippleEffect(button);
      });
    }, 100);

    console.log('动画系统初始化完成');
  }
}

// 导出动画工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationUtils;
} else {
  // 浏览器环境下的全局访问
  window.AnimationUtils = AnimationUtils;
}

// 创建全局动画实例
const animations = new AnimationUtils();

// 自动初始化
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    animations.init();
  });
}