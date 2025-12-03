// 本地存储管理器
const StorageManager = {
    // 保存用户信息
    saveUserInfo: function(userInfo) {
        try {
            localStorage.setItem('library_user_info', JSON.stringify(userInfo));
            localStorage.setItem('library_is_logged_in', 'true');
            return true;
        } catch (error) {
            console.error('保存用户信息失败:', error);
            return false;
        }
    },

    // 获取用户信息
    getUserInfo: function() {
        try {
            const userInfo = localStorage.getItem('library_user_info');
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            return null;
        }
    },

    // 检查是否已登录
    isLoggedIn: function() {
        return localStorage.getItem('library_is_logged_in') === 'true';
    },

    // 退出登录
    logout: function() {
        try {
            localStorage.removeItem('library_is_logged_in');
            localStorage.removeItem('library_user_info');
            return true;
        } catch (error) {
            console.error('退出登录失败:', error);
            return false;
        }
    },

    // 保存借阅记录
    saveBorrowedBooks: function(books) {
        try {
            localStorage.setItem('library_borrowed_books', JSON.stringify(books));
            return true;
        } catch (error) {
            console.error('保存借阅记录失败:', error);
            return false;
        }
    },

    // 获取借阅记录
    getBorrowedBooks: function() {
        try {
            const books = localStorage.getItem('library_borrowed_books');
            return books ? JSON.parse(books) : [];
        } catch (error) {
            console.error('获取借阅记录失败:', error);
            return [];
        }
    },

    // 保存收藏记录
    saveFavoriteBooks: function(books) {
        try {
            localStorage.setItem('library_favorite_books', JSON.stringify(books));
            return true;
        } catch (error) {
            console.error('保存收藏记录失败:', error);
            return false;
        }
    },

    // 获取收藏记录
    getFavoriteBooks: function() {
        try {
            const books = localStorage.getItem('library_favorite_books');
            return books ? JSON.parse(books) : [];
        } catch (error) {
            console.error('获取收藏记录失败:', error);
            return [];
        }
    },

    // 保存预约记录
    saveReservations: function(reservations) {
        try {
            localStorage.setItem('library_reservations', JSON.stringify(reservations));
            return true;
        } catch (error) {
            console.error('保存预约记录失败:', error);
            return false;
        }
    },

    // 获取预约记录
    getReservations: function() {
        try {
            const reservations = localStorage.getItem('library_reservations');
            return reservations ? JSON.parse(reservations) : [];
        } catch (error) {
            console.error('获取预约记录失败:', error);
            return [];
        }
    },

    // 获取用户借阅限制
    getUserLimit: function() {
        const userInfo = this.getUserInfo();
        // 学生限制10本，教职工限制20本
        return userInfo && userInfo.userType === 'faculty' ? 20 : 10;
    },

    // 初始化默认用户（用于测试）
    initDefaultUser: function() {
        const defaultUser = {
            account: 'test123',
            password: 'test123',
            username: '测试用户',
            avatar: '',
            email: 'test@example.com',
            userType: 'faculty'  // 设置为教职工以测试20本书的限制
        };
        
        // 如果还没有用户信息，创建默认用户
        if (!this.getUserInfo()) {
            this.saveUserInfo(defaultUser);
        }
        
        // 为测试用户添加一些测试数据
        this.initTestData();
    },
    
    // 初始化测试数据
    initTestData: function() {
        const userInfo = this.getUserInfo();
        if (userInfo && userInfo.account === 'test123') {
            // 检查是否已经有测试数据
            const hasBorrowedBooks = this.getBorrowedBooks().length > 0;
            const hasReservations = this.getReservations().length > 0;
            const hasFavorites = this.getFavoriteBooks().length > 0;
            
            // 如果没有测试数据，则添加
            if (!hasBorrowedBooks && !hasReservations && !hasFavorites) {
                // 添加预约记录
                const reservations = [
                    {
                        bookId: '1',
                        bookTitle: 'JavaScript高级程序设计',
                        reserveDate: '2023-04-15',
                        completed: false
                    },
                    {
                        bookId: '2',
                        bookTitle: '深入理解计算机系统',
                        reserveDate: '2023-04-16',
                        completed: false
                    }
                ];
                this.saveReservations(reservations);
                
                // 添加借阅记录
                const today = new Date();
                const oneMonthLater = new Date();
                oneMonthLater.setMonth(today.getMonth() + 1);
                
                const twoMonthsLater = new Date();
                twoMonthsLater.setMonth(today.getMonth() + 2); // 续借后的应还日期
                
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(today.getMonth() - 1);
                
                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(today.getMonth() - 2);
                
                // 创建更多逾期书籍
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                
                const fourMonthsAgo = new Date();
                fourMonthsAgo.setMonth(today.getMonth() - 4);
                
                const borrowedBooks = [
                    {
                        bookId: '3',
                        bookTitle: '百年孤独',
                        borrowDate: this.formatDate(oneMonthAgo),
                        dueDate: this.formatDate(today), // 已逾期
                        returned: false,
                        renewalCount: 0 // 续借次数
                    },
                    {
                        bookId: '4',
                        bookTitle: '人类简史',
                        borrowDate: this.formatDate(oneMonthAgo),
                        dueDate: this.formatDate(oneMonthLater), // 未逾期，还可续借
                        returned: false,
                        renewalCount: 0 // 续借次数
                    },
                    {
                        bookId: '5',
                        bookTitle: '设计心理学',
                        borrowDate: this.formatDate(twoMonthsAgo),
                        dueDate: this.formatDate(oneMonthAgo),
                        returned: true,
                        returnDate: this.formatDate(oneMonthAgo),
                        renewalCount: 1 // 已续借过
                    },
                    {
                        bookId: '6',
                        bookTitle: '三体',
                        borrowDate: this.formatDate(today),
                        dueDate: this.formatDate(oneMonthLater), // 未逾期，还可续借
                        returned: false,
                        renewalCount: 0 // 续借次数
                    },
                    {
                        bookId: '7',
                        bookTitle: 'JavaScript权威指南',
                        borrowDate: this.formatDate(oneMonthAgo),
                        dueDate: this.formatDate(twoMonthsLater), // 已经续借过的书
                        returned: false,
                        renewalCount: 1 // 已续借过
                    },
                    {
                        bookId: '10',
                        bookTitle: '算法导论',
                        borrowDate: this.formatDate(threeMonthsAgo),
                        dueDate: this.formatDate(twoMonthsAgo), // 逾期2个月
                        returned: false,
                        renewalCount: 0
                    },
                    {
                        bookId: '11',
                        bookTitle: '活着',
                        borrowDate: this.formatDate(fourMonthsAgo),
                        dueDate: this.formatDate(threeMonthsAgo), // 逾期3个月
                        returned: false,
                        renewalCount: 1 // 已续借过
                    }
                ];
                this.saveBorrowedBooks(borrowedBooks);
                
                // 添加收藏记录
                const favorites = ['6', '7', '8'];
                this.saveFavoriteBooks(favorites);
            }
        }
    },
    
    // 格式化日期为 YYYY-MM-DD
    formatDate: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};

// 页面加载时初始化默认用户
document.addEventListener('DOMContentLoaded', function() {
    StorageManager.initDefaultUser();
});