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

    // 初始化默认用户（用于测试）
    initDefaultUser: function() {
        const defaultUser = {
            account: 'test123',
            password: 'test123',
            username: '测试用户',
            avatar: '',
            email: 'test@example.com'
        };
        
        // 如果还没有用户信息，创建默认用户
        if (!this.getUserInfo()) {
            this.saveUserInfo(defaultUser);
        }
        
        // 初始化一些默认的借阅记录用于演示逾期功能
        const borrowedBooks = this.getBorrowedBooks();
        if (borrowedBooks.length === 0) {
            // 添加一些测试数据，包括逾期的记录
            const testData = [
                {
                    bookId: '1',
                    bookTitle: 'JavaScript高级程序设计',
                    borrowDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 40天前
                    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10天前到期
                    returned: false
                },
                {
                    bookId: '2',
                    bookTitle: '深入理解计算机系统',
                    borrowDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15天前
                    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15天后到期
                    returned: false
                },
                {
                    bookId: '3',
                    bookTitle: '百年孤独',
                    borrowDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25天前
                    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5天前到期
                    returned: false
                },
                {
                    bookId: '4',
                    bookTitle: '人类简史',
                    borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 20天前
                    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2天前到期
                    returned: true // 已归还
                }
            ];
            
            this.saveBorrowedBooks(testData);
        }
    }
};

// 页面加载时初始化默认用户
document.addEventListener('DOMContentLoaded', function() {
    StorageManager.initDefaultUser();
});