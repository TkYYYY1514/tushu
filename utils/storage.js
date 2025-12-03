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
    }
};

// 页面加载时初始化默认用户
document.addEventListener('DOMContentLoaded', function() {
    StorageManager.initDefaultUser();
});