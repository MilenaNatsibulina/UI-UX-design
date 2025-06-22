class CSVHandler {
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    // Парсинг CSV строки в массив объектов
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const users = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const user = {};
                headers.forEach((header, index) => {
                    user[header.trim()] = values[index]?.trim() || '';
                });
                users.push(user);
            }
        }
        return users;
    }

    // Загрузка пользователей из CSV или localStorage
    async loadUsers() {
        try {
            // Сначала пытаемся загрузить из localStorage
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                this.users = JSON.parse(savedUsers);
                console.log('Пользователи загружены из localStorage');
                return;
            }

            // Если в localStorage нет данных, загружаем из CSV
            const response = await fetch('./Data/users.csv');
            const csvText = await response.text();
            this.users = this.parseCSV(csvText);
            
            // Сохраняем в localStorage
            localStorage.setItem('users', JSON.stringify(this.users));
            console.log('Пользователи загружены из CSV и сохранены в localStorage');
        } catch (error) {
            console.error('Ошибка загрузки users.csv:', error);
            // Если ничего не получилось, создаем пустой массив
            this.users = [];
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    // Получение всех пользователей
    getUsers() {
        return this.users;
    }

    // Добавление нового пользователя
    addUser(email, name, password) {
        const newId = this.users.length > 0 ? 
            Math.max(...this.users.map(u => parseInt(u.id))) + 1 : 1;
        
        const newUser = {
            id: newId.toString(),
            email: email,
            name: name,
            password: password,
            created_date: new Date().toISOString().split('T')[0]
        };

        this.users.push(newUser);
        
        // ВАЖНО: Сохраняем обновленный список в localStorage
        localStorage.setItem('users', JSON.stringify(this.users));
        console.log('Новый пользователь добавлен:', newUser);
        
        return newUser;
    }

    // Поиск пользователя по email
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    // Метод для отладки - показать всех пользователей
    debugShowUsers() {
        console.log('Все пользователи:', this.users);
        return this.users;
    }
}



// Ключ в localStorage
// Пример содержимого:
[
  {
    id: "dessert1",
    name: "Круассан миндальный",
    price: 700,
    quantity: 2,
    image: "../Icons/Croissant.png"
  },
  {
    id: "master1",
    name: "Мастер-класс по эклерам",
    price: 1500,
    quantity: 1,
    image: "../Icons/MasterClass.png"
  }
]
