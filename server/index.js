const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Добро пожаловать в API нового проекта!',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/items', (req, res) => {
  // Пример API endpoint
  const items = [
    { id: 1, name: 'Элемент 1', description: 'Описание элемента 1' },
    { id: 2, name: 'Элемент 2', description: 'Описание элемента 2' },
    { id: 3, name: 'Элемент 3', description: 'Описание элемента 3' }
  ];
  
  res.json({
    success: true,
    data: items,
    count: items.length
  });
});

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Имя и описание обязательны'
    });
  }
  
  const newItem = {
    id: Date.now(),
    name,
    description,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    data: newItem,
    message: 'Элемент успешно создан'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Что-то пошло не так!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📱 API доступен по адресу: http://localhost:${PORT}`);
  console.log(`🔍 Проверка здоровья: http://localhost:${PORT}/api/health`);
});

module.exports = app;
