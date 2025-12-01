// 动态加载底部导航栏组件
function loadNavBar() {
    // 检查页面是否已经包含了导航栏
    if (document.querySelector('.nav-item')) {
        // 页面已经有导航栏，只需要设置激活状态
        autoSetActiveNav();
        return;
    }
    
    // 创建一个临时容器来加载导航栏内容
    const tempContainer = document.createElement('div');
    
    // 使用fetch加载导航栏组件
    fetch('components/nav-bar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // 将加载的HTML添加到临时容器
            tempContainer.innerHTML = html;
            
            // 获取导航栏元素
            const navBar = tempContainer.querySelector('.fixed');
            
            if (navBar) {
                // 将导航栏添加到body的末尾
                document.body.appendChild(navBar);
                
                // 执行导航栏中的脚本
                const script = tempContainer.querySelector('script');
                if (script) {
                    // 提取脚本内容并执行
                    const scriptContent = script.textContent;
                    const newScript = document.createElement('script');
                    newScript.textContent = scriptContent;
                    document.body.appendChild(newScript);
                }
                
                // 为body添加底部padding，避免内容被导航栏遮挡
                document.body.style.paddingBottom = '64px';
            }
        })
        .catch(error => {
            console.error('Error loading navigation bar:', error);
        });
}

// 导航栏激活状态设置函数
function setNavBarActive(targetPage) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const target = item.getAttribute('data-target');
        if (target === targetPage) {
            item.classList.add('text-primary');
            item.classList.remove('text-gray-500');
        } else {
            item.classList.remove('text-primary');
            item.classList.add('text-gray-500');
        }
    });
}

// 自动检测当前页面并设置激活状态
function autoSetActiveNav() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes('books.html')) {
        setNavBarActive('books');
    } else if (currentUrl.includes('borrow.html')) {
        setNavBarActive('borrow');
    } else if (currentUrl.includes('return.html')) {
        setNavBarActive('return');
    } else if (currentUrl.includes('my-borrows.html')) {
        setNavBarActive('my');
    }
}

// 在文档加载完成后加载导航栏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavBar);
} else {
    // 文档已经加载完成
    loadNavBar();
}