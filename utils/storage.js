/**
 * 本地存储管理模块
 * 用于处理用户信息、借阅数据等本地存储操作
 */

const StorageManager = {
    // 存储键名常量
    KEYS: {
        USER_INFO: 'library_user_info',
        BORROW_RECORDS: 'library_borrow_records',
        BOOK_CACHE: 'library_book_cache',
        USER_TYPE: 'library_user_type',
        LOGIN_STATUS: 'library_login_status'
    },

    /**
     * 检查本地存储是否可用
     * @returns {boolean} 本地存储是否可用
     */
    isStorageAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('本地存储不可用:', e);
            return false;
        }
    },

    /**
     * 保存用户信息
     * @param {Object} userInfo - 用户信息对象
     * @returns {boolean} 保存是否成功
     */
    saveUserInfo(userInfo) {
        if (!this.isStorageAvailable()) return false;
        
        try {
            localStorage.setItem(this.KEYS.USER_INFO, JSON.stringify(userInfo));
            localStorage.setItem(this.KEYS.LOGIN_STATUS, 'true');
            return true;
        } catch (e) {
            console.error('保存用户信息失败:', e);
            return false;
        }
    },

    /**
     * 获取用户信息
     * @returns {Object|null} 用户信息对象或null
     */
    getUserInfo() {
        if (!this.isStorageAvailable()) return null;
        
        try {
            const userInfoStr = localStorage.getItem(this.KEYS.USER_INFO);
            return userInfoStr ? JSON.parse(userInfoStr) : null;
        } catch (e) {
            console.error('获取用户信息失败:', e);
            return null;
        }
    },

    /**
     * 设置用户类型
     * @param {string} userType - 用户类型 ('student' 或 'teacher')
     * @returns {boolean} 设置是否成功
     */
    setUserType(userType) {
        if (!this.isStorageAvailable()) return false;
        
        try {
            localStorage.setItem(this.KEYS.USER_TYPE, userType);
            return true;
        } catch (e) {
            console.error('设置用户类型失败:', e);
            return false;
        }
    },

    /**
     * 获取用户类型
     * @returns {string|null} 用户类型或null
     */
    getUserType() {
        if (!this.isStorageAvailable()) return null;
        
        try {
            return localStorage.getItem(this.KEYS.USER_TYPE);
        } catch (e) {
            console.error('获取用户类型失败:', e);
            return null;
        }
    },

    /**
     * 检查用户是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn() {
        if (!this.isStorageAvailable()) return false;
        
        try {
            return localStorage.getItem(this.KEYS.LOGIN_STATUS) === 'true';
        } catch (e) {
            console.error('检查登录状态失败:', e);
            return false;
        }
    },

    /**
     * 用户登出
     * @returns {boolean} 登出是否成功
     */
    logout() {
        if (!this.isStorageAvailable()) return false;
        
        try {
            localStorage.removeItem(this.KEYS.USER_INFO);
            localStorage.removeItem(this.KEYS.LOGIN_STATUS);
            return true;
        } catch (e) {
            console.error('用户登出失败:', e);
            return false;
        }
    },

    /**
     * 获取所有借阅记录
     * @returns {Array} 借阅记录数组
     */
    getBorrowRecords() {
        if (!this.isStorageAvailable()) return [];
        
        try {
            const recordsStr = localStorage.getItem(this.KEYS.BORROW_RECORDS);
            return recordsStr ? JSON.parse(recordsStr) : [];
        } catch (e) {
            console.error('获取借阅记录失败:', e);
            return [];
        }
    },

    /**
     * 添加借阅记录
     * @param {Object} bookInfo - 图书信息
     * @returns {boolean} 添加是否成功
     */
    addBorrowRecord(bookInfo) {
        if (!this.isStorageAvailable()) return false;
        
        try {
            const records = this.getBorrowRecords();
            const userInfo = this.getUserInfo();
            
            if (!userInfo) {
                console.error('用户未登录，无法添加借阅记录');
                return false;
            }
            
            // 创建借阅记录
            const borrowRecord = {
                id: Date.now(), // 使用时间戳作为唯一ID
                bookId: bookInfo.id,
                bookTitle: bookInfo.title,
                bookAuthor: bookInfo.author,
                bookCover: bookInfo.cover,
                borrowerId: userInfo.account,
                borrowerName: userInfo.name,
                borrowDate: new Date().toISOString(),
                dueDate: this.calculateDueDate(),
                status: 'borrowed', // borrowed, returned, overdue
                returnDate: null
            };
            
            records.push(borrowRecord);
            localStorage.setItem(this.KEYS.BORROW_RECORDS, JSON.stringify(records));
            return true;
        } catch (e) {
            console.error('添加借阅记录失败:', e);
            return false;
        }
    },

    /**
     * 归还图书
     * @param {number} recordId - 借阅记录ID
     * @returns {boolean} 归还是否成功
     */
    returnBook(recordId) {
        if (!this.isStorageAvailable()) return false;
        
        try {
            const records = this.getBorrowRecords();
            const recordIndex = records.findIndex(record => record.id === recordId);
            
            if (recordIndex === -1) {
                console.error('未找到借阅记录');
                return false;
            }
            
            // 更新借阅记录
            records[recordIndex].status = 'returned';
            records[recordIndex].returnDate = new Date().toISOString();
            
            localStorage.setItem(this.KEYS.BORROW_RECORDS, JSON.stringify(records));
            return true;
        } catch (e) {
            console.error('归还图书失败:', e);
            return false;
        }
    },

    /**
     * 获取用户当前借阅的图书
     * @returns {Array} 当前借阅的图书数组
     */
    getCurrentBorrowedBooks() {
        const records = this.getBorrowRecords();
        const userInfo = this.getUserInfo();
        
        if (!userInfo) return [];
        
        return records.filter(record => 
            record.borrowerId === userInfo.account && 
            record.status === 'borrowed'
        );
    },

    /**
     * 缓存图书数据
     * @param {Array} books - 图书数据数组
     * @returns {boolean} 缓存是否成功
     */
    cacheBooks(books) {
        if (!this.isStorageAvailable()) return false;
        
        try {
            const cacheData = {
                books: books,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(this.KEYS.BOOK_CACHE, JSON.stringify(cacheData));
            return true;
        } catch (e) {
            console.error('缓存图书数据失败:', e);
            return false;
        }
    },

    /**
     * 获取缓存的图书数据
     * @param {number} maxAgeInMinutes - 最大缓存时间（分钟），默认30分钟
     * @returns {Array|null} 图书数据数组或null
     */
    getCachedBooks(maxAgeInMinutes = 30) {
        if (!this.isStorageAvailable()) return null;
        
        try {
            const cacheStr = localStorage.getItem(this.KEYS.BOOK_CACHE);
            if (!cacheStr) return null;
            
            const cacheData = JSON.parse(cacheStr);
            const cacheTime = new Date(cacheData.timestamp);
            const now = new Date();
            const ageInMinutes = (now - cacheTime) / (1000 * 60);
            
            // 检查缓存是否过期
            if (ageInMinutes > maxAgeInMinutes) {
                return null;
            }
            
            return cacheData.books;
        } catch (e) {
            console.error('获取缓存图书数据失败:', e);
            return null;
        }
    },

    /**
     * 清除图书缓存
     * @returns {boolean} 清除是否成功
     */
    clearBookCache() {
        if (!this.isStorageAvailable()) return false;
        
        try {
            localStorage.removeItem(this.KEYS.BOOK_CACHE);
            return true;
        } catch (e) {
            console.error('清除图书缓存失败:', e);
            return false;
        }
    },

    /**
     * 计算归还日期（默认30天后）
     * @returns {string} ISO格式的归还日期
     */
    calculateDueDate() {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // 默认借阅30天
        return dueDate.toISOString();
    },

    /**
     * 获取剩余借阅天数
     * @param {string} dueDateStr - ISO格式的归还日期字符串
     * @returns {number} 剩余天数（负数表示已逾期）
     */
    getRemainingDays(dueDateStr) {
        const dueDate = new Date(dueDateStr);
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    /**
     * 检查图书是否已被当前用户借阅
     * @param {number} bookId - 图书ID
     * @returns {boolean} 是否已借阅
     */
    isBookBorrowedByUser(bookId) {
        const records = this.getCurrentBorrowedBooks();
        return records.some(record => record.bookId === bookId);
    },

    /**
     * 获取用户借阅历史
     * @returns {Array} 借阅历史数组
     */
    getUserBorrowHistory() {
        const records = this.getBorrowRecords();
        const userInfo = this.getUserInfo();
        
        if (!userInfo) return [];
        
        return records.filter(record => record.borrowerId === userInfo.account);
    },

    /**
     * 初始化模拟数据（仅在开发环境使用）
     */
    initMockData() {
        // 检查是否已有数据
        if (this.isLoggedIn() || this.getBorrowRecords().length > 0) {
            return;
        }
        
        // 模拟一些借阅记录
        const mockRecords = [
            {
                id: 1001,
                bookId: 1,
                bookTitle: '活着',
                bookAuthor: '余华',
                bookCover: 'https://picsum.photos/id/24/300/450',
                borrowerId: '20220001',
                borrowerName: '张三',
                borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'borrowed',
                returnDate: null
            },
            {
                id: 1002,
                bookId: 2,
                bookTitle: '三体',
                bookAuthor: '刘慈欣',
                bookCover: 'https://picsum.photos/id/20/300/450',
                borrowerId: '20220001',
                borrowerName: '张三',
                borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'borrowed',
                returnDate: null
            },
            {
                id: 1003,
                bookId: 3,
                bookTitle: '解忧杂货店',
                bookAuthor: '东野圭吾',
                bookCover: 'https://picsum.photos/id/22/300/450',
                borrowerId: '20220001',
                borrowerName: '张三',
                borrowDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'returned',
                returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        try {
            localStorage.setItem(this.KEYS.BORROW_RECORDS, JSON.stringify(mockRecords));
            console.log('模拟借阅数据初始化完成');
        } catch (e) {
            console.error('初始化模拟数据失败:', e);
        }
    }
};

// 导出存储管理器
if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
    // 初始化模拟数据
    StorageManager.initMockData();
}