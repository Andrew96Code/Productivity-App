# Productivity App

A comprehensive productivity application with features for task management, reporting, analytics, and more.

## Features

- User Authentication (using Supabase)
- Reporting System
- Analytics Dashboard
- Task Management
- Goal Tracking
- Habit Formation
- Progress Visualization

## Tech Stack

- Backend:
  - Python 3.12
  - Flask 3.0.0
  - Supabase
  - PostgreSQL
  - pandas
  - matplotlib
  - seaborn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productivity-app.git
cd productivity-app
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Create a `.env` file in the backend directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
FLASK_ENV=development
FLASK_APP=main.py
```

5. Run the application:
```bash
cd backend
flask run
```

The API will be available at `http://127.0.0.1:5000`

## API Endpoints

### Authentication

- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login and get access token

### Reporting

- `GET /reporting/templates` - Get report templates
- `POST /reporting/templates` - Create a new report template
- `GET /reporting/schedules` - Get scheduled reports
- `POST /reporting/generate` - Generate a report
- `GET /reporting/exports/<export_id>/download` - Download a report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
