# Быстрый старт AI Gift Generator

## 🚀 Запуск за 5 минут

### 1. Установите Node.js и npm
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nodejs npm

# Проверьте установку
node --version && npm --version
```

### 2. Настройте Backend
```bash
cd backend

# Установите зависимости
npm install

# Создайте файл окружения
cp env.example .env

# Отредактируйте .env (добавьте ваш HF_API_KEY)
nano .env
```

**Содержимое .env:**
```env
HF_API_KEY=your_huggingface_key_here
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.2
PORT=3001
CACHE_TTL_SECONDS=120
```

### 3. Запустите Backend
```bash
# В папке backend
npm start
```

### 4. Настройте Frontend
```bash
# В новом терминале
cd frontend

# Установите зависимости
npm install
```

### 5. Запустите Frontend
```bash
# В папке frontend
npm run dev
```

### 6. Откройте приложение
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔑 Получение API ключа Hugging Face

1. Зарегистрируйтесь на [Hugging Face](https://huggingface.co/join)
2. Перейдите в [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Создайте новый токен с правами "Read"
4. Скопируйте токен в файл `.env`

## 🎯 Тестирование

### Проверка Backend
```bash
curl http://localhost:3001/api/health
# Должен вернуть: {"status":"ok"}
```

### Тестирование офлайн режима
```bash
curl "http://localhost:3001/api/offline?lang=ru"
# Должен вернуть 5 случайных идей подарков
```

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

## 🐛 Частые проблемы

### "npm: command not found"
- Установите Node.js и npm (см. INSTALL.md)
- Перезапустите терминал

### "Port 3001 already in use"
```bash
# Найдите процесс
lsof -i :3001

# Остановите процесс
kill -9 <PID>
```

### "HF_API_KEY is not defined"
- Проверьте файл `.env` в папке backend
- Убедитесь, что API ключ добавлен

### Frontend не подключается к Backend
- Убедитесь, что backend запущен на порту 3001
- Проверьте CORS настройки в backend/index.js

## 📱 Использование

1. Откройте http://localhost:5173
2. Заполните форму:
   - Возраст (1-120)
   - Пол (Женский/Мужской/Другой)
   - Повод (День рождения/Годовщина/Новый год/Выпускной/Другой)
   - Бюджет (в тенге)
   - Интересы
3. Нажмите "Сгенерировать"
4. Получите 5 персонализированных идей подарков

## 🌐 Переключение языков

- Нажмите кнопку "RU/EN" в правом верхнем углу
- Интерфейс переключится на выбранный язык
- AI будет генерировать идеи на соответствующем языке

## 🌙 Темная тема

- Нажмите кнопку "Светлая/Темная" в правом верхнем углу
- Тема сохранится в localStorage

## ⚡ Офлайн режим

- Если AI недоступен, нажмите "Офлайн режим"
- Получите мгновенные идеи из предустановленной базы
- Работает без интернета и API ключа
