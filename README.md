# NExus Weather report 
# 🌦️ Weather Detection & Climate Prediction System

A modern Laravel MVC-based Weather Detection and Climate Prediction web application designed to monitor weather conditions, manage climate data, and provide intelligent forecasting through a responsive dashboard.

---

# 📌 Project Overview

The Weather Detection & Climate Prediction System is a web-based application developed using Laravel Framework following the MVC (Model-View-Controller) architecture.

The system is capable of:

* Managing weather and climate data
* Predicting weather conditions
* Displaying climate information through a responsive UI
* Handling secure authentication and request processing
* Providing scalable backend architecture

---

# 🚀 Features

## 🌤️ Weather Monitoring

* Temperature tracking
* Humidity monitoring
* Climate condition display
* Forecast visualization

## 🔐 Authentication System

* Secure login system
* Session handling
* CSRF protection
* Middleware-based request filtering

## 📊 Climate Prediction

* Prediction engine service
* Weather trend analysis
* Scalable prediction architecture

## 🎨 Modern UI

* Responsive frontend
* Tailwind CSS integration
* Dynamic Blade templates

## ⚡ Performance Optimization

* Weather caching system
* Optimized request handling
* Lightweight SQLite database

---

# 🏗️ MVC Architecture

This project follows Laravel MVC architecture:

| Layer      | Purpose                     |
| ---------- | --------------------------- |
| Model      | Handles database operations |
| View       | Manages frontend UI         |
| Controller | Handles request logic       |

### Flow

User → Route → Controller → Model → Database → View

---

# 🛠️ Tech Stack

| Technology   | Usage                    |
| ------------ | ------------------------ |
| PHP          | Backend Development      |
| Laravel      | MVC Framework            |
| SQLite       | Database                 |
| Blade        | Templating Engine        |
| Tailwind CSS | UI Styling               |
| JavaScript   | Frontend Interactivity   |
| Vite         | Asset Bundler            |
| Composer     | Dependency Management    |
| NPM          | Frontend Package Manager |

---

# 📂 Project Structure

```bash
MVC/
│
├── app/
│   ├── Models/
│   ├── Services/
│   ├── Http/
│
├── bootstrap/
├── config/
├── database/
│   ├── migrations/
│   ├── seeders/
│
├── public/
├── resources/
│   ├── views/
│   ├── css/
│   ├── js/
│
├── routes/
├── storage/
├── tests/
├── vendor/
└── node_modules/
```

---

# 📁 Important Files

| File                              | Purpose                 |
| --------------------------------- | ----------------------- |
| routes/web.php                    | Application routes      |
| app/Services/PredictionEngine.php | Prediction logic        |
| app/Models/WeatherData.php        | Weather database model  |
| resources/views/index.blade.php   | Main dashboard UI       |
| database/database.sqlite          | SQLite database         |
| bootstrap/app.php                 | Middleware registration |

---

# 🔒 Middleware Used

## Built-in Middleware

* Authenticate
* VerifyCsrfToken
* TrimStrings
* ConvertEmptyStringsToNull

## Custom Middleware

### LogUserActivity Middleware

Tracks and logs user requests and activities.

---

# ✅ Validation

Validation is implemented inside:

```bash
app/Http/Controllers/AuthController.php
```

Used for:

* Login validation
* Empty input checking
* Secure authentication handling

---

# 🗄️ Database

The project uses SQLite database for lightweight and fast deployment.

## Migration Tables

* users
* cache
* jobs
* weather-related tables

### Run Migration

```bash
php artisan migrate
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
```

---

## 2️⃣ Open Project

```bash
cd MVC
```

---

## 3️⃣ Install PHP Dependencies

```bash
composer install
```

---

## 4️⃣ Install Frontend Dependencies

```bash
npm install
```

---

## 5️⃣ Configure Environment

Copy `.env.example`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

---

## 6️⃣ Configure Database

Update `.env`:

```env
DB_CONNECTION=sqlite
```

---

## 7️⃣ Run Migrations

```bash
php artisan migrate
```

---

## 8️⃣ Start Development Server

```bash
php artisan serve
```

---

## 9️⃣ Start Vite Server

```bash
npm run dev
```

---

# 🌐 Application URL

```bash
http://127.0.0.1:8000
```

---

# 🔐 Security Features

* CSRF Protection
* Authentication Middleware
* Session Security
* Request Validation
* Secure Routing
* Input Sanitization

---

# 📈 Future Improvements

* Real-time Weather API Integration
* AI/ML-based Forecasting
* Advanced Analytics Dashboard
* Graphical Climate Reports
* Cloud Deployment
* Notification System
* Admin Analytics Panel

---

# 🧪 Testing

Run tests using:

```bash
php artisan test
```

---

# 📚 Learning Outcomes

Through this project:

* Laravel MVC architecture was implemented
* Middleware and authentication were explored
* Database migrations and seeders were used
* Frontend and backend integration was achieved
* Climate prediction services were designed

---

# 👨‍💻 Author

Developed as a Weather Detection & Climate Prediction academic project using Laravel Framework.

---

# 📄 License

This project is developed for educational and learning purposes.
