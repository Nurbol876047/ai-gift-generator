# 🚀 Настройка и запуск AI Gift Generator

## 📋 Предварительные требования

### Системные требования
- **Node.js** версии 16+ или 18+
- **npm** версии 8+ или 9+
- **Git** для клонирования репозитория
- **API ключ Hugging Face** (бесплатный)

### Проверка установки
```bash
node --version  # Должно быть v16+ или v18+
npm --version   # Должно быть 8+ или 9+
git --version   # Любая версия
```

## 🔧 Пошаговая настройка

### Шаг 1: Установка Node.js и npm

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nodejs npm
```

#### CentOS/RHEL/Fedora
```bash
sudo dnf install nodejs npm
# Или для CentOS/RHEL
sudo yum install nodejs npm
```

#### macOS
```bash
brew install node
```

#### Windows
1. Скачайте установщик с [nodejs.org](https://nodejs.org/)
2. Запустите установщик
3. Следуйте инструкциям

### Шаг 2: Получение API ключа Hugging Face

1. Зарегистрируйтесь на [Hugging Face](https://huggingface.co/join)
2. Перейдите в [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Нажмите "New token"
4. Выберите "Read" права
5. Скопируйте токен (начинается с `hf_`)

### Шаг 3: Настройка Backend

```bash
# Переход в папку backend
cd backend

# Установка зависимостей
npm install

# Создание файла окружения
cp env.example .env

# Редактирование .env файла
nano .env  # или любой текстовый редактор
```

**Содержимое .env файла:**
```env
HF_API_KEY=hf_your_actual_api_key_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
PORT=3001
CACHE_TTL_SECONDS=120
```

### Шаг 4: Запуск Backend

```bash
# В папке backend
npm start
```

**Ожидаемый вывод:**
```
AI Gift Generator Backend running on port 3001
Health check: http://localhost:3001/api/health
```

### Шаг 5: Настройка Frontend

```bash
# В новом терминале, из корневой папки проекта
cd frontend

# Установка зависимостей
npm install
```

### Шаг 6: Запуск Frontend

```bash
# В папке frontend
npm run dev
```

**Ожидаемый вывод:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🎯 Тестирование

### Проверка Backend
```bash
curl http://localhost:3001/api/health
```
**Ожидаемый ответ:** `{"status":"ok"}`

### Тестирование офлайн режима
```bash
curl "http://localhost:3001/api/offline?lang=ru"
```
**Ожидаемый ответ:** JSON с 5 случайными идеями подарков

### Тестирование AI генерации
```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "gender": "Female",
    "occasion": "Birthday",
    "budget": 15000,
    "interests": "музыка, спорт",
    "lang": "ru"
  }'
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🐛 Устранение проблем

### Проблема: "npm: command not found"
**Решение:**
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Перезапуск терминала
source ~/.bashrc
```

### Проблема: "Port 3001 already in use"
**Решение:**
```bash
# Поиск процесса
lsof -i :3001

# Остановка процесса
kill -9 <PID>

# Или изменение порта в .env
PORT=3002
```

### Проблема: "HF_API_KEY is not defined"
**Решение:**
1. Проверьте файл `.env` в папке backend
2. Убедитесь, что API ключ добавлен правильно
3. Перезапустите backend

### Проблема: "CORS error"
**Решение:**
1. Убедитесь, что backend запущен на порту 3001
2. Проверьте CORS настройки в `backend/index.js`
3. Очистите кеш браузера

### Проблема: "Module not found"
**Решение:**
```bash
# Удаление node_modules и переустановка
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Команды для разработки

### Backend
```bash
cd backend

# Запуск в режиме разработки (с автоперезагрузкой)
npm run dev

# Запуск в продакшн режиме
npm start

# Проверка кода
npm run lint
```

### Frontend
```bash
cd frontend

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка кода
npm run lint
```

## 📁 Структура файлов

```
ai-gift-generator/
├── backend/                 # Backend сервер
│   ├── index.js            # Основной сервер
│   ├── package.json        # Зависимости
│   ├── .env               # Переменные окружения
│   ├── .eslintrc.js       # ESLint конфигурация
│   └── offline/
│       └── ideas.json     # Офлайн идеи
├── frontend/               # Frontend приложение
│   ├── src/
│   │   ├── App.jsx        # Основной компонент
│   │   ├── main.jsx       # Точка входа
│   │   ├── i18n.js        # Интернационализация
│   │   └── index.css      # Стили
│   ├── package.json       # Зависимости
│   ├── vite.config.js     # Конфигурация Vite
│   └── tailwind.config.js # Конфигурация Tailwind
├── README.md              # Основная документация
├── QUICKSTART.md          # Быстрый старт
├── INSTALL.md             # Инструкции по установке
├── PROJECT_INFO.md        # Информация о проекте
└── .gitignore            # Исключения Git
```

## 🎉 Готово!

После выполнения всех шагов у вас будет работающее приложение AI Gift Generator с:

- ✅ Современным React фронтендом
- ✅ Node.js бэкендом с Express
- ✅ Интеграцией Hugging Face AI
- ✅ Офлайн режимом
- ✅ Двуязычным интерфейсом
- ✅ Темной и светлой темами
- ✅ Адаптивным дизайном

**Приятного использования! 🎁✨**
