# AI Gift Generator 🎁

Полноценное веб-приложение для генерации идей подарков с использованием искусственного интеллекта. Интегрировано с Hugging Face Inference API (модель Mistral-7B-Instruct-v0.2) с офлайн-режимом в качестве резервного варианта.

## ✨ Особенности

- 🤖 **AI-генерация**: Интеграция с Hugging Face API для создания персонализированных идей подарков
- 🌐 **Двуязычность**: Поддержка русского и английского языков
- 🌙 **Темная тема**: Переключение между светлой и темной темами
- 📱 **Адаптивный дизайн**: Красивый интерфейс для всех устройств
- ⚡ **Офлайн режим**: Резервные идеи при недоступности AI
- 🎨 **Современный UI**: Tailwind CSS + Framer Motion анимации
- 🔒 **Безопасность**: Rate limiting и валидация данных
- 📊 **Кеширование**: Оптимизация запросов к API

## 🛠 Технологии

### Frontend
- **React 18** - Основной фреймворк
- **Vite** - Быстрый сборщик
- **Tailwind CSS** - Стилизация
- **Framer Motion** - Анимации
- **jsPDF** - Генерация PDF

### Backend
- **Node.js** - Серверная среда
- **Express** - Веб-фреймворк
- **Hugging Face API** - AI модель
- **CORS** - Междоменные запросы
- **Rate Limiting** - Защита от спама

## 📸 Скриншоты

### Главная страница
![Главная страница](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=AI+Gift+Generator+Interface)

### Результаты генерации
![Результаты](https://via.placeholder.com/800x400/10b981/ffffff?text=Generated+Gift+Ideas)

### Темная тема
![Темная тема](https://via.placeholder.com/800x400/6366f1/ffffff?text=Dark+Theme+Interface)

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 16+ 
- npm или yarn
- API ключ Hugging Face

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd ai-gift-generator
```

### 2. Настройка Backend

```bash
# Переход в папку backend
cd backend

# Установка зависимостей
npm install

# Копирование файла окружения
cp env.example .env

# Редактирование .env файла
# Добавьте ваш HF_API_KEY
```

**Важно**: Получите API ключ на [Hugging Face](https://huggingface.co/settings/tokens) и добавьте его в `.env` файл:

```env
HF_API_KEY=your_huggingface_key_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
PORT=3001
CACHE_TTL_SECONDS=120
```

### 3. Запуск Backend

```bash
# Запуск в режиме разработки
npm run dev

# Или в продакшн режиме
npm start
```

Backend будет доступен на `http://localhost:3001`

### 4. Настройка Frontend

```bash
# Переход в папку frontend
cd ../frontend

# Установка зависимостей
npm install
```

### 5. Запуск Frontend

```bash
# Запуск в режиме разработки
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

## 📁 Структура проекта

```
ai-gift-generator/
├── backend/
│   ├── index.js              # Основной сервер
│   ├── package.json          # Зависимости backend
│   ├── .env                  # Переменные окружения
│   ├── .eslintrc.js          # ESLint конфигурация
│   └── offline/
│       └── ideas.json        # Офлайн идеи подарков
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Основной компонент
│   │   ├── main.jsx          # Точка входа
│   │   ├── i18n.js           # Интернационализация
│   │   └── index.css         # Стили
│   ├── package.json          # Зависимости frontend
│   ├── vite.config.js        # Конфигурация Vite
│   ├── tailwind.config.js    # Конфигурация Tailwind
│   └── .eslintrc.cjs         # ESLint конфигурация
└── README.md                 # Документация
```

## 🔧 API Endpoints

### Backend API (порт 3001)

- `GET /api/health` - Проверка состояния сервера
- `POST /api/generate` - Генерация идей через AI
- `GET /api/offline` - Получение офлайн идей

### Пример запроса к API

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

## 🎯 Как это работает

### 1. Генерация идей
- Пользователь заполняет форму с параметрами
- Запрос отправляется на Hugging Face API
- AI модель генерирует персонализированные идеи
- Результаты кешируются для оптимизации

### 2. Офлайн режим
- При недоступности AI или ошибках
- Система автоматически переключается на офлайн режим
- Используются предустановленные идеи из `ideas.json`
- Пользователь получает мгновенный результат

### 3. Интернационализация
- Поддержка русского и английского языков
- Автоматическое переключение интерфейса
- Локализованные промпты для AI

## 🔒 Безопасность

- **Rate Limiting**: Ограничение 1 запрос в 5 секунд
- **Валидация данных**: Проверка всех входных параметров
- **CORS**: Настроен только для localhost
- **Переменные окружения**: API ключи не коммитятся в репозиторий

## 🎨 Кастомизация

### Добавление новых языков
1. Добавьте переводы в `frontend/src/i18n.js`
2. Обновите логику переключения в `App.jsx`

### Изменение AI модели
1. Обновите `HF_MODEL` в `.env`
2. При необходимости измените промпт в `backend/index.js`

### Добавление офлайн идей
1. Отредактируйте `backend/offline/ideas.json`
2. Добавьте новые идеи в соответствующие языковые секции

## 🐛 Устранение неполадок

### Backend не запускается
```bash
# Проверьте порт 3001
lsof -i :3001

# Проверьте переменные окружения
cat backend/.env
```

### Frontend не подключается к Backend
```bash
# Проверьте CORS настройки
# Убедитесь что backend запущен на порту 3001
```

### AI не генерирует идеи
```bash
# Проверьте API ключ Hugging Face
# Проверьте логи backend
# Попробуйте офлайн режим
```

## 📝 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🙏 Благодарности

- [Hugging Face](https://huggingface.co/) за предоставление AI моделей
- [Mistral AI](https://mistral.ai/) за модель Mistral-7B-Instruct-v0.2
- [Tailwind CSS](https://tailwindcss.com/) за прекрасную систему стилей
- [Framer Motion](https://www.framer.com/motion/) за анимации

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы:
- Создайте Issue в репозитории
- Опишите проблему подробно
- Приложите логи ошибок

---

**AI Gift Generator** - находите идеальные подарки с помощью искусственного интеллекта! 🎁✨
