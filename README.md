PayAsYouGo/
├── backend/                        # Django backend project
│   ├── accounts/                   # Django app for user accounts
│   │   ├── migrations/             # Django migrations
│   │   ├── admin.py                # Admin configuration
│   │   ├── apps.py                 # App registration
│   │   ├── models.py               # Data models (User, Client, etc.)
│   │   ├── serializers.py          # DRF serializers
│   │   ├── tests.py                # Unit tests
│   │   ├── urls.py                 # App-specific routes
│   │   └── views.py                # API view logic
│   ├── payasyougo/                 # Django project settings
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py             # Project-level settings (e.g., DB, middleware)
│   │   ├── urls.py                 # Main URL router
│   │   └── wsgi.py
│   ├── manage.py                   # Django command-line utility
│   ├── .env                        # Environment variables (e.g., secret key, DB)
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # Backend-specific documentation (optional)

├── frontend/                       # React frontend project
│   ├── public/                     # Public assets (e.g., index.html, favicon)
│   ├── src/                        # React source code
│   │   ├── assets/                 # Images, icons, and static assets
│   │   ├── components/             # Reusable components (e.g., NavBar, InvoiceForm)
│   │   │   ├── Clients.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InvoiceForm.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── RequireAuth.jsx
│   │   ├── pages/                  # Page-level views
│   │   │   ├── ClientFormPage.jsx
│   │   │   ├── ClientsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExpenseFormPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── InvoiceFormPage.jsx
│   │   │   ├── InvoicesPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── TaxEstimationPage.jsx
│   │   │   ├── TimeEntriesPage.jsx
│   │   │   └── TimeEntryFormPage.jsx
│   │   ├── api.js                  # Axios API calls
│   │   ├── App.jsx                 # Root app component
│   │   ├── App.css                 # Global styles
│   │   ├── AuthContext.jsx         # Authentication context provider
│   │   ├── index.js                # React DOM render entry point
│   │   └── index.css               # Base styles
│   ├── package.json                # Frontend dependencies and scripts
│   └── README.md                   # Frontend-specific documentation (optional)

├── .gitignore                      # Git ignore rules
├── README.md                       # Project overview and setup instructions
└── LICENSE                         # License information


Project Overview
This project consists of three main components:

🖼️ Frontend — React
The frontend is a single-page application built with React, focusing on a mobile-first, user-friendly interface for freelancers.

Key Modules:

NavBar – Top navigation bar that conditionally shows routes based on authentication.

InvoiceForm – A reusable form component for creating and editing invoices.

AuthContext – Manages login state and provides protected route logic.

Pages (e.g., ClientsPage, ReportsPage) – Each route corresponds to a full page with data-fetching and layout logic.

🧠 Backend — Django + Django REST Framework
The backend is built with Django and provides RESTful APIs to serve data to the frontend. It handles authentication, business logic, and database interactions.

Key Modules:

accounts/ – Manages user accounts, login, registration, and authentication.

models.py – Defines core models such as User, Client, Invoice, Payment, TimeEntry, and Expense.

serializers.py – Converts models to JSON and validates incoming data.

views.py – Contains API logic for CRUD operations.

urls.py – API endpoints routing.

🗄️ Database — MySQL
MySQL is used to persist structured data. The schema is designed for freelancers to manage clients, invoices, and finances efficiently.

Core Tables:

users – Stores user credentials and profile info.

clients – Contains client contact and project data per user.

invoices – Records each invoice issued, including status and amounts.

payments – Tracks incoming payments tied to invoices.

expenses – Lets users manually track business-related spending.

time_entries – Optional: allows tracking of billable hours per client/project.

✅ Summary
This modular structure ensures the app is:

Easy to maintain and scale

Intuitive for freelancers and gig workers

Aligned with best practices for full-stack development