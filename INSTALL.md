# Инструкции по установке

## Установка Node.js и npm

### Ubuntu/Debian
```bash
# Обновление пакетов
sudo apt update

# Установка Node.js и npm
sudo apt install nodejs npm

# Проверка версий
node --version
npm --version
```

### CentOS/RHEL/Fedora
```bash
# Установка Node.js и npm
sudo dnf install nodejs npm

# Или для CentOS/RHEL
sudo yum install nodejs npm
```

### macOS
```bash
# Через Homebrew
brew install node

# Или скачать с официального сайта
# https://nodejs.org/
```

### Windows
1. Скачайте установщик с [nodejs.org](https://nodejs.org/)
2. Запустите установщик и следуйте инструкциям
3. npm будет установлен автоматически

## Альтернативные пакетные менеджеры

### Yarn
```bash
# Установка Yarn
npm install -g yarn

# Использование вместо npm
yarn install
yarn start
```

### pnpm
```bash
# Установка pnpm
npm install -g pnpm

# Использование вместо npm
pnpm install
pnpm start
```

## Проверка установки

После установки Node.js и npm выполните:

```bash
# Проверка версий
node --version  # Должно быть v16+ или v18+
npm --version   # Должно быть 8+ или 9+

# Проверка PATH
which node
which npm
```

## Устранение проблем

### npm не найден после установки
```bash
# Перезапуск терминала
source ~/.bashrc

# Или добавление в PATH
export PATH=$PATH:/usr/local/bin
```

### Проблемы с правами доступа
```bash
# Изменение владельца npm директории
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Очистка кеша npm
```bash
npm cache clean --force
```
