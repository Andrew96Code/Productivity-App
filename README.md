# Productivity App

A modern web application for tracking daily habits, focus, and personal productivity with morning routines, afternoon check-ins, and evening reviews.

## Features

- User authentication and authorization
- Morning routine planning
- Afternoon check-ins
- Evening reviews
- Habit tracking across multiple categories
- Focus and productivity monitoring
- Modern, responsive UI with animations
- Admin dashboard for analytics

## Tech Stack

- Backend: Python/Flask
- Database: PostgreSQL
- Cache: Redis
- Frontend: HTML, CSS, JavaScript
- Testing: Pytest, Locust for performance testing
- CI/CD: GitHub Actions

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productivity-app.git
cd productivity-app
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

4. Set up environment variables:
Create a `.env` file with the following variables:
```
FLASK_APP=backend
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379
```

5. Initialize the database:
```bash
flask db upgrade
```

6. Run the development server:
```bash
flask run
```

## Testing

Run the test suite:
```bash
pytest
```

Run performance tests:
```bash
locust -f performance_tests/locustfile.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
