# 🎓 Education-System (Learning Hub)

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://education-system11.netlify.app/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-blue?style=flat)](https://deepmind.google/technologies/gemini/)

**Education-System** — це інтерактивна вебплатформа для дистанційного навчання, обміну знаннями та створення освітніх курсів. Проєкт розроблено в рамках проєктно-технологічної практики командою "The Magnificent Seven-1".

🌐 **Live Demo:** [education-system11.netlify.app](https://education-system11.netlify.app/)  
*(⚠️ **Увага:** Серверна частина розміщена на безкоштовному тарифі Render. При першому відкритті бази даних та серверу може знадобитися 2-3 хвилини для "пробудження").*

---

## ✨ Головні можливості (Features)

*   👥 **Рольова модель доступу (RBAC):** Гість (перегляд), Користувач/Автор (створення контенту, проходження тестів), Модератор (адміністрування та перевірка курсів).
*   📝 **Потужний редактор курсів:** Вбудований WYSIWYG-редактор (ReactQuill) з можливістю завантаження медіафайлів безпосередньо у хмару (Cloudinary).
*   🤖 **ШІ-Конструктор тестів:** Автоматична генерація тестових завдань на основі матеріалу курсу за допомогою **Google Gemini AI**.
*   🎓 **Інтерактивне тестування та Сертифікати:** Проходження тестів з таймером, динамічним прогрес-баром та **автоматичною генерацією PDF-сертифіката** при успішному складанні.
*   🛡️ **Модерація контенту:** Окрема панель для модераторів з можливістю схвалення або відхилення курсів із зазначенням причини.
*   🔐 **Безпечна авторизація:** Класична реєстрація (JWT/Sessions) та швидкий вхід через **Google OAuth 2.0**.
*   📊 **Особистий кабінет та Аналітика:** Збереження улюблених курсів ("Моя бібліотека"), відстеження історії пройдених тестів, статистика автора (перегляди, рейтинги).

---

## 🛠 Технологічний стек

**Frontend:**
*   React.js, React Router
*   CSS3 (Custom UI System, CSS Variables)
*   React Quill (WYSIWYG)
*   Google OAuth Provider

**Backend:**
*   Node.js, Express.js
*   Mongoose (ODM)
*   Multer & Cloudinary (для роботи з файлами)
*   Google Generative AI SDK (Gemini)

**Database:**
*   MongoDB Atlas (NoSQL)

---

## 📸 Скріншоти


| :---: | :---: |
| <img src="Education-System\client\src\pages\assets\1.PNG" width="400"/> | <img src="Education-System\client\src\pages\assets\2.PNG" width="400"/> |

| :---: | :---: |
| <img src="Education-System\client\src\pages\assets\3.PNG" width="400"/> | <img src="Education-System\client\src\pages\assets\4.PNG" width="400"/> |

---

## 🚀 Інструкція з локального розгортання

Щоб запустити проєкт локально на вашому комп'ютері, виконайте наступні кроки:

### 1. Клонування репозиторію
```bash
git clone https://github.com/KiraStepanuk/Education-System.git
cd Education-System
```

### 2. Налаштування Backend-частини
1. Перейдіть у папку сервера.
2. Встановіть залежності:
   ```bash
   npm install
   ```
3. Створіть файл `.env` у кореневій папці бекенду та додайте наступні змінні:
   ```env
   PORT=5000
   MONGODB_URI=ваш_url_бази_mongodb_atlas
   CLOUDINARY_CLOUD_NAME=ім'я_хмари_cloudinary
   CLOUDINARY_API_KEY=ваш_ключ_cloudinary
   CLOUDINARY_API_SECRET=ваш_секрет_cloudinary
   GEMINI_API_KEY=ваш_ключ_google_gemini
   ```
4. Ініціалізуйте базу даних:
   ```bash
   node init-db.js
   ```
5. Запустіть сервер:
   ```bash
   npm start
   # або node server.js
   ```

### 3. Налаштування Frontend-частини
1. Перейдіть у папку клієнта.
2. Встановіть залежності:
   ```bash
   npm install
   ```
3. Створіть файл `.env` у корені клієнтської частини:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_CLIENT_ID=ваш_google_oauth_client_id
   ```
4. Запустіть React-додаток:
   ```bash
   npm start
   ```
Додаток буде доступний за адресою `http://localhost:3000`.

---

## 🏗 Архітектура Бази Даних

Система використовує 5 основних Mongoose-моделей:
*   **User** — користувачі, їх ролі та зв'язки з улюбленими курсами.
*   **Course** — навчальні курси, їх контент, рейтинг, статус модерації.
*   **Review** — відгуки та оцінки до курсів.
*   **Quiz** — структура тестів, ліміт часу, прохідний бал.
*   **QuizResult** — історія проходжень тестів студентами.

---

## 👨‍💻 Команда розробників (The Magnificent Seven-1)

*   **Степанюк Кіра** — Team Lead, System Architect, UI/UX Designer. Координація процесів, дизайн у Figma, базова архітектура React/Express, Code Review.
*   **Изюмов Олексій** — Backend Developer. Архітектура БД (MongoDB), REST API, Docker, інтеграція Cloudinary.
*   **Бриткова Вікторія** — Frontend Developer. Адаптивна верстка, кабінет автора, логіка WYSIWYG-редактора, UI тестів.
*   **Товалюк Олександр** — Full-stack Developer. Інтеграція Google OAuth 2.0, профілі користувачів.
*   **Бондар Дмитро** — Full-stack Developer. Синхронізація клієнтських станів з БД, рефакторинг UI-компонентів.
*   **Варнавцев Максим** — Допомога у розробці модулю ШІ-генерації тестів.

---
*Проєкт створено в рамках навчальної проєктно-технологічної практики ОНМУ. 2026 рік.*
```
