# Karthik Electrical - Shop Management System

A full-stack internal record management system for Karthik Electrical.

## Tech Stack
- **Backend:** Django + Django REST Framework
- **Database:** SQLite
- **Frontend:** React (Vite + JavaScript)
- **Icons:** Lucide-React
- **API:** Axios

---

## Getting Started

### Using Docker (Recommended)
You can run the entire application (frontend, backend, database) seamlessly using Docker Compose.

1. Ensure you have Docker and Docker Compose installed.
2. From the root directory of the project, run:
   ```bash
   docker-compose up -d --build
   ```
3. The application will be up and running at:
   - **Frontend:** http://localhost:80
   - **Backend API:** http://localhost:8000

To stop the application:
```bash
docker-compose down
```

---

### Local Development Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Project Structure
- `backend/`: Django project with apps for customers, products, services, sales, and bookings.
- `frontend/`: React application with dashboard and management pages.
