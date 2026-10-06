# 💝 Сюрприз для любимой

Романтическое веб-приложение с анимированным сердцем, которое раскрывается при клике и показывает ваше послание.

## 🚀 Деплой на GitHub Pages

### Шаг 1: Создай репозиторий на GitHub

1. Зайди на [github.com](https://github.com)
2. Нажми "New repository"
3. Назови репозиторий (например, `love-surprise`)
4. Сделай его **Public** (публичным)
5. НЕ ставь галочку "Add a README file"
6. Нажми "Create repository"

### Шаг 2: Загрузи код в репозиторий

Открой терминал в папке проекта и выполни:

```bash
# Инициализация git
git init

# Добавь все файлы
git add .

# Первый коммит
git commit -m "Initial commit 💝"

# Добавь удалённый репозиторий (замени USERNAME и REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Отправь код на GitHub
git branch -M main
git push -u origin main
```

### Шаг 3: Включи GitHub Pages

1. Зайди в свой репозиторий на GitHub
2. Перейди в **Settings** → **Pages**
3. В разделе "Source" выбери **GitHub Actions**
4. После первого push автоматически запустится деплой
5. Через 1-2 минуты сайт будет доступен по адресу:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

### Шаг 4: Обнови имя репозитория в конфиге

Открой файл `vite.config.js` и замени `/love-surprise/` на имя твоего репозитория:

```javascript
base: '/имя-твоего-репозитория/',
```

Затем запуш изменения:

```bash
git add .
git commit -m "Update base path"
git push
```

## 🖼️ Как заменить изображение

1. Подготовь свою фотографию (JPG или PNG, рекомендуется 800x600px)
2. Назови файл `love-photo.jpg`
3. Положи его в папку `public/images/`
4. Запуш изменения:

```bash
git add public/images/love-photo.jpg
git commit -m "Add our photo 💕"
git push
```

Готово! Изображение обновится автоматически через 1-2 минуты.

## ✏️ Как изменить текст

Открой файл `src/App.tsx` и найди эти строки:

```tsx
<h2 className="love-title shimmer-text">Моя любимая! 💕</h2>

<p className="love-message love-message-delay-1">
  Ты — самое прекрасное, что случилось в моей жизни ✨
</p>

<p className="love-message love-message-delay-2">
  Каждый день с тобой — это подарок 🎁
</p>

<p className="love-message-final">
  Люблю тебя бесконечно! ❤️
</p>
```

Замени текст на свой, затем:

```bash
git add .
git commit -m "Update messages 💌"
git push
```

## 🛠️ Локальная разработка

```bash
# Установи зависимости
npm install

# Запусти dev сервер
npm run dev

# Собери для продакшена
npm run build
```

## 📱 Возможности

- 💗 Анимированное пульсирующее сердце
- 💕 Летающие сердечки на фоне
- ✨ Мерцающие искорки
- 🎆 Взрыв конфетти при открытии
- 🖼️ Фотография в рамке с эффектом свечения
- 💌 Романтические послания с анимацией
- 🔄 Кнопка для повтора

---

Сделано с любовью ❤️
