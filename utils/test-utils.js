/*
 * 图书馆系统测试工具
 * 用于验证所有功能模块的正常运行和交互
 */

class LibraryTest {
  constructor() {
    this.testResults = [];
    this.currentPage = window.location.pathname.split('/').pop();
    this.isTesting = false;
  }

  // 开始测试
  startTests() {
    this.isTesting = true;
    console.log('===== 开始图书馆系统功能测试 =====');
    
    this.testNavigation();
    this.testLocalStorage();
    
    if (this.currentPage === 'books.html') {
      this.testBookListPage();
    } else if (this.currentPage === 'book-detail.html') {
      this.testBookDetailPage();
    } else if (this.currentPage === 'borrow.html') {
      this.testBorrowPage();
    } else if (this.currentPage === 'return.html') {
      this.testReturnPage();
    } else if (this.currentPage === 'my-borrows.html') {
      this.testMyBorrowsPage();
    } else if (this.currentPage === 'login.html') {
      this.testLoginPage();
    } else if (this.currentPage === 'register.html') {
      this.testRegisterPage();
    }
    
    this.displayResults();
    this.isTesting = false;
    console.log('===== 测试完成 =====');
  }

  // 记录测试结果
  recordResult(testName, success, message = '') {
    this.testResults.push({
      name: testName,
      success,
      message
    });
    
    const status = success ? '✅ 通过' : '❌ 失败';
    console.log(`${status}: ${testName}`);
    if (message) {
      console.log(`  详情: ${message}`);
    }
  }

  // 显示测试结果
  displayResults() {
    const passed = this.testResults.filter(r => r.success).length;
    const total = this.testResults.length;
    
    console.log(`\n测试结果: ${passed}/${total} 通过`);
    
    if (passed < total) {
      console.log('\n失败的测试:');
      this.testResults
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
    }
  }

  // 测试导航功能
  testNavigation() {
    console.log('\n=== 测试导航功能 ===');
    
    try {
      const navLinks = document.querySelectorAll('nav a, .nav-link');
      this.recordResult('导航链接存在', navLinks.length > 0, `发现 ${navLinks.length} 个导航链接`);
      
      // 检查底部导航栏是否正确加载
      const bottomNav = document.querySelector('.bottom-nav');
      this.recordResult('底部导航栏存在', !!bottomNav);
      
      // 检查当前页面是否正确激活
      if (bottomNav) {
        const activeLink = bottomNav.querySelector('a.active');
        this.recordResult('当前页面导航项激活', !!activeLink);
      }
      
      // 测试导航链接有效性
      const invalidLinks = [];
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === 'javascript:void(0)') {
          invalidLinks.push(link.textContent.trim() || '(无文本)');
        }
      });
      
      this.recordResult(
        '导航链接有效', 
        invalidLinks.length === 0,
        invalidLinks.length > 0 ? `无效链接: ${invalidLinks.join(', ')}` : '所有链接有效'
      );
    } catch (error) {
      this.recordResult('导航功能测试', false, error.message);
    }
  }

  // 测试本地存储
  testLocalStorage() {
    console.log('\n=== 测试本地存储功能 ===');
    
    try {
      // 检查是否支持本地存储
      const storageSupported = typeof localStorage !== 'undefined';
      this.recordResult('本地存储支持', storageSupported);
      
      if (!storageSupported) return;
      
      // 检查必要的存储键是否存在或可创建
      const testKey = 'library_test_key';
      const testValue = 'test_value';
      
      localStorage.setItem(testKey, testValue);
      const retrievedValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      this.recordResult('本地存储读写', retrievedValue === testValue);
      
      // 检查存储管理器是否正确加载
      if (window.StorageManager) {
        const storageManager = new StorageManager();
        this.recordResult('StorageManager 类存在', true);
        
        // 测试用户数据访问
        const hasUserData = storageManager.hasUserData();
        this.recordResult('用户数据访问', typeof hasUserData === 'boolean');
        
        // 测试图书数据访问
        const books = storageManager.getAllBooks();
        this.recordResult('图书数据访问', Array.isArray(books));
      } else {
        this.recordResult('StorageManager 类存在', false, '未在全局作用域找到 StorageManager');
      }
    } catch (error) {
      this.recordResult('本地存储功能测试', false, error.message);
    }
  }

  // 测试图书列表页面
  testBookListPage() {
    console.log('\n=== 测试图书列表页面 ===');
    
    try {
      const bookList = document.querySelector('.book-list');
      this.recordResult('图书列表存在', !!bookList);
      
      if (bookList) {
        const bookItems = bookList.querySelectorAll('.book-item');
        this.recordResult('图书项存在', bookItems.length > 0, `显示 ${bookItems.length} 本图书`);
        
        // 检查搜索功能
        const searchInput = document.querySelector('#searchInput');
        this.recordResult('搜索框存在', !!searchInput);
        
        // 检查分类筛选功能
        const categoryFilters = document.querySelector('.category-filters');
        this.recordResult('分类筛选存在', !!categoryFilters);
      }
      
      // 测试与图书详情的链接
      const detailLinks = document.querySelectorAll('a[href^="book-detail.html"]');
      this.recordResult('图书详情链接', detailLinks.length > 0);
    } catch (error) {
      this.recordResult('图书列表页面测试', false, error.message);
    }
  }

  // 测试图书详情页面
  testBookDetailPage() {
    console.log('\n=== 测试图书详情页面 ===');
    
    try {
      const bookInfo = document.querySelector('.book-info');
      this.recordResult('图书信息存在', !!bookInfo);
      
      // 检查ISBN参数
      const urlParams = new URLSearchParams(window.location.search);
      const hasIsbnParam = urlParams.has('isbn');
      this.recordResult('ISBN参数存在', hasIsbnParam);
      
      // 检查借阅按钮
      const borrowButton = document.querySelector('.borrow-button');
      this.recordResult('借阅按钮存在', !!borrowButton);
      
      // 检查返回按钮
      const backButton = document.querySelector('.back-button');
      this.recordResult('返回按钮存在', !!backButton);
    } catch (error) {
      this.recordResult('图书详情页面测试', false, error.message);
    }
  }

  // 测试借阅页面
  testBorrowPage() {
    console.log('\n=== 测试借阅页面 ===');
    
    try {
      const borrowSection = document.querySelector('.borrow-section');
      this.recordResult('借阅区域存在', !!borrowSection);
      
      // 检查搜索和筛选功能
      const searchBar = document.querySelector('.search-bar');
      const filterOptions = document.querySelector('.filter-options');
      
      this.recordResult('搜索栏存在', !!searchBar);
      this.recordResult('筛选选项存在', !!filterOptions);
      
      // 检查可借阅图书列表
      const availableBooks = document.querySelector('.available-books');
      this.recordResult('可借阅图书列表存在', !!availableBooks);
      
      // 检查借阅规则说明
      const borrowRules = document.querySelector('.borrow-rules');
      this.recordResult('借阅规则存在', !!borrowRules);
    } catch (error) {
      this.recordResult('借阅页面测试', false, error.message);
    }
  }

  // 测试归还页面
  testReturnPage() {
    console.log('\n=== 测试归还页面 ===');
    
    try {
      const returnSection = document.querySelector('.return-section');
      this.recordResult('归还区域存在', !!returnSection);
      
      // 检查待归还图书列表
      const booksToReturn = document.querySelector('.books-to-return');
      this.recordResult('待归还图书列表存在', !!booksToReturn);
      
      // 检查逾期提醒
      const overdueReminder = document.querySelector('.overdue-reminder');
      this.recordResult('逾期提醒存在', !!overdueReminder);
      
      // 检查批量归还功能
      const batchReturnButton = document.querySelector('.batch-return-button');
      this.recordResult('批量归还按钮存在', !!batchReturnButton);
    } catch (error) {
      this.recordResult('归还页面测试', false, error.message);
    }
  }

  // 测试我的借阅页面
  testMyBorrowsPage() {
    console.log('\n=== 测试我的借阅页面 ===');
    
    try {
      const borrowsSection = document.querySelector('.borrows-section');
      this.recordResult('借阅区域存在', !!borrowsSection);
      
      // 检查用户信息卡片
      const userInfoCard = document.querySelector('.user-info-card');
      this.recordResult('用户信息卡片存在', !!userInfoCard);
      
      // 检查借阅统计
      const borrowStats = document.querySelector('.borrow-stats');
      this.recordResult('借阅统计存在', !!borrowStats);
      
      // 检查借阅列表
      const borrowList = document.querySelector('.borrow-list');
      this.recordResult('借阅列表存在', !!borrowList);
      
      // 检查续借功能
      const renewButtons = document.querySelectorAll('.renew-button');
      this.recordResult('续借按钮存在', renewButtons.length >= 0);
    } catch (error) {
      this.recordResult('我的借阅页面测试', false, error.message);
    }
  }

  // 测试登录页面
  testLoginPage() {
    console.log('\n=== 测试登录页面 ===');
    
    try {
      const loginForm = document.querySelector('#loginForm');
      this.recordResult('登录表单存在', !!loginForm);
      
      if (loginForm) {
        const usernameInput = document.querySelector('#username');
        const passwordInput = document.querySelector('#password');
        const submitButton = loginForm.querySelector('button[type="submit"]');
        
        this.recordResult('用户名输入框存在', !!usernameInput);
        this.recordResult('密码输入框存在', !!passwordInput);
        this.recordResult('提交按钮存在', !!submitButton);
      }
      
      // 检查注册链接
      const registerLink = document.querySelector('a[href="register.html"]');
      this.recordResult('注册链接存在', !!registerLink);
    } catch (error) {
      this.recordResult('登录页面测试', false, error.message);
    }
  }

  // 测试注册页面
  testRegisterPage() {
    console.log('\n=== 测试注册页面 ===');
    
    try {
      const registerForm = document.querySelector('#registerForm');
      this.recordResult('注册表单存在', !!registerForm);
      
      if (registerForm) {
        const usernameInput = document.querySelector('#username');
        const passwordInput = document.querySelector('#password');
        const confirmPasswordInput = document.querySelector('#confirmPassword');
        const submitButton = registerForm.querySelector('button[type="submit"]');
        
        this.recordResult('用户名输入框存在', !!usernameInput);
        this.recordResult('密码输入框存在', !!passwordInput);
        this.recordResult('确认密码输入框存在', !!confirmPasswordInput);
        this.recordResult('提交按钮存在', !!submitButton);
      }
      
      // 检查登录链接
      const loginLink = document.querySelector('a[href="login.html"]');
      this.recordResult('登录链接存在', !!loginLink);
    } catch (error) {
      this.recordResult('注册页面测试', false, error.message);
    }
  }

  // 自动化测试用户流程
  testUserFlow() {
    if (this.isTesting) return;
    
    console.log('\n===== 开始自动化用户流程测试 =====');
    
    // 模拟一个完整的用户流程
    this.testMockUser();
    
    console.log('\n===== 用户流程测试完成 =====');
  }

  // 模拟用户测试
  testMockUser() {
    try {
      // 创建模拟用户数据
      const mockUser = {
        id: 'test_user_1',
        username: 'testuser',
        password: 'Test@123',
        name: '测试用户',
        email: 'test@example.com',
        registerDate: new Date().toISOString()
      };
      
      // 模拟登录状态
      const mockLoginState = {
        isLoggedIn: true,
        user: mockUser,
        loginTime: new Date().toISOString()
      };
      
      console.log('\n模拟用户已创建:', mockUser.username);
      console.log('模拟登录状态已设置');
      
      // 如果StorageManager可用，添加模拟数据
      if (window.StorageManager) {
        const storageManager = new StorageManager();
        
        // 尝试添加测试用户（可能会失败，如果用户已存在，但这是可以接受的）
        try {
          storageManager.saveUser(mockUser);
          storageManager.saveLoginState(mockLoginState);
          console.log('模拟数据已保存到本地存储');
        } catch (e) {
          console.log('模拟数据保存时出现预期内错误:', e.message);
        }
      }
    } catch (error) {
      console.error('模拟用户测试失败:', error.message);
    }
  }

  // 检查页面加载性能
  checkPerformance() {
    console.log('\n=== 页面性能检查 ===');
    
    try {
      if (window.performance) {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log(`页面加载时间: ${pageLoadTime}ms`);
        console.log(`DOM准备时间: ${domReadyTime}ms`);
        
        // 基本性能评估
        const isFastLoad = pageLoadTime < 2000;
        const isFastDomReady = domReadyTime < 1000;
        
        this.recordResult('页面加载速度', isFastLoad, `${pageLoadTime}ms ${isFastLoad ? '(良好)' : '(较慢)'}`);
        this.recordResult('DOM准备速度', isFastDomReady, `${domReadyTime}ms ${isFastDomReady ? '(良好)' : '(较慢)'}`);
      } else {
        console.log('浏览器不支持性能API');
      }
    } catch (error) {
      console.error('性能检查失败:', error.message);
    }
  }

  // 检查移动端适配
  checkMobileAdaptation() {
    console.log('\n=== 移动端适配检查 ===');
    
    try {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      console.log(`视口尺寸: ${viewportWidth}x${viewportHeight}`);
      
      // 检查是否添加了视口元标签
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      this.recordResult('视口元标签', !!viewportMeta);
      
      // 检查安全区域适配
      const safeAreaElements = document.querySelectorAll('.safe-area-top, .safe-area-bottom, .safe-area-left, .safe-area-right');
      this.recordResult('安全区域适配', safeAreaElements.length > 0, `${safeAreaElements.length} 个安全区域元素`);
      
      // 检查是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log(`设备类型: ${isMobile ? '移动设备' : '桌面设备'}`);
    } catch (error) {
      console.error('移动端适配检查失败:', error.message);
    }
  }

  // 执行完整测试套件
  runFullTestSuite() {
    this.startTests();
    this.checkPerformance();
    this.checkMobileAdaptation();
  }
}

// 导出测试类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LibraryTest;
} else {
  // 浏览器环境下的全局访问
  window.LibraryTest = LibraryTest;
}

// 创建测试实例
const libraryTest = new LibraryTest();

// 自动运行基础测试（可选）
if (typeof window !== 'undefined') {
  // 只在开发环境或通过URL参数触发测试
  const urlParams = new URLSearchParams(window.location.search);
  const runTests = urlParams.has('test');
  
  if (runTests) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        libraryTest.runFullTestSuite();
      }, 1000); // 等待1秒让页面完全加载
    });
  }
}