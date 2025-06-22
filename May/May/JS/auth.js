class AuthSystem {
    constructor() {
        this.csvHandler = new CSVHandler();
        this.currentUser = null;
        this.checkAuthStatus();
    }

    // Проверка статуса авторизации при загрузке
    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // Регистрация нового пользователя (БЕЗ автоматического входа)
    async register(email, name, password, confirmPassword) {
        // Валидация данных
        if (!email || !name || !password || !confirmPassword) {
            throw new Error('Все поля должны быть заполнены');
        }

        if (password !== confirmPassword) {
            throw new Error('Пароли не совпадают');
        }

        if (password.length < 6) {
            throw new Error('Пароль должен содержать минимум 6 символов');
        }

        // Простая валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Введите корректный email адрес');
        }

        // Загружаем актуальных пользователей
        await this.csvHandler.loadUsers();
        
        // Проверка на существование пользователя
        const existingUser = this.csvHandler.findUserByEmail(email);
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Создание нового пользователя
        const newUser = this.csvHandler.addUser(email, name, password);
        
        console.log('Пользователь успешно зарегистрирован:', newUser);
        
        // НЕ делаем автоматический вход!
        return newUser;
    }

    // Вход в систему
    async login(email, password) {
        if (!email || !password) {
            throw new Error('Email и пароль обязательны');
        }

        await this.csvHandler.loadUsers();
        const user = this.csvHandler.findUserByEmail(email);
        
        if (!user || user.password !== password) {
            throw new Error('Неверный email или пароль');
        }

        // Сохранение текущего пользователя
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Установка cookie с токеном (простая реализация)
        this.setCookie('authToken', user.id, 7); // 7 дней
        
        console.log('Пользователь вошел в систему:', user);
        return user;
    }

    // Выход из системы
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.deleteCookie('authToken');
        window.location.href = 'LoginPage.html';
    }

    // Проверка авторизации
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Установка cookie
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Удаление cookie
    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }

    // Метод для отладки
    debugShowAllUsers() {
        return this.csvHandler.debugShowUsers();
    }
}
