# Photo Restore Clone

A web application that restores old and blurry photos using AI, built with Django and React.

## Features

- Photo restoration using Replicate AI
- Modern, responsive UI
- User authentication
- Image upload and processing
- Before/After comparison view

## Setup

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a .env file in the backend directory with:
```
REPLICATE_API_TOKEN=your_replicate_api_token
SECRET_KEY=your_django_secret_key
DEBUG=True
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

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
npm start
```

## Environment Variables

- `REPLICATE_API_TOKEN`: Your Replicate API token
- `SECRET_KEY`: Django secret key
- `DEBUG`: Set to True for development, False for production

## Technologies Used

- Backend: Django, Django REST Framework
- Frontend: React, Tailwind CSS
- AI: Replicate API
- Database: SQLite (development) / PostgreSQL (production) 