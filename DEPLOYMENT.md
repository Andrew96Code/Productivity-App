# Production Deployment Guide

## Prerequisites

- Python 3.9+
- PostgreSQL
- Redis (for rate limiting)
- NGINX (for reverse proxy)
- SSL Certificate

## Environment Setup

1. Create a new Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```bash
FLASK_ENV=production
FLASK_APP=backend.app
SECRET_KEY=<your-secure-secret-key>
DATABASE_URL=postgresql://user:password@localhost/dbname
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=https://yourdomain.com
```

## Database Setup

1. Create PostgreSQL database:
```bash
createdb dbname
```

2. Initialize and migrate database:
```bash
flask db upgrade
```

## Production Server Setup

1. Install and configure NGINX:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. Start Gunicorn:
```bash
gunicorn -w 4 -b 127.0.0.1:8000 "backend.app:app"
```

## Security Checklist

- [ ] Generate strong SECRET_KEY
- [ ] Enable SSL/TLS
- [ ] Set up database backups
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Enable logging
- [ ] Update security headers

## Monitoring and Maintenance

1. Set up logging:
```bash
mkdir logs
chmod 755 logs
```

2. Monitor application logs:
```bash
tail -f logs/app.log
```

3. Regular maintenance tasks:
- Monitor server resources
- Check error logs
- Update dependencies
- Backup database
- Rotate logs

## Backup Strategy

1. Database backups:
```bash
pg_dump dbname > backup.sql
```

2. Automated daily backups:
```bash
0 0 * * * pg_dump dbname > /path/to/backups/backup-$(date +%Y%m%d).sql
```

## Scaling Considerations

- Use multiple Gunicorn workers
- Set up load balancing
- Implement caching with Redis
- Monitor performance metrics
- Consider containerization

## Troubleshooting

Common issues and solutions:

1. Database connection errors:
   - Check PostgreSQL service
   - Verify connection string
   - Check firewall rules

2. Application errors:
   - Check app logs
   - Verify environment variables
   - Check permissions

3. Performance issues:
   - Monitor resource usage
   - Check database queries
   - Analyze application logs

## Contact

For support or questions, contact:
- Email: support@yourdomain.com
- Emergency: emergency@yourdomain.com 

## Testing

### Running Tests

1. Set up test environment:
```bash
export FLASK_ENV=testing
export FLASK_APP=backend.app
```

2. Run all tests with coverage:
```bash
pytest
```

3. Run specific test files:
```bash
pytest backend/tests/test_auth.py
pytest backend/tests/test_models.py
```

4. Run tests with detailed output:
```bash
pytest -v
```

### Test Coverage

View coverage report:
```bash
pytest --cov=backend --cov-report=html
```
This will generate a detailed HTML coverage report in the `htmlcov` directory.

### Continuous Integration

1. Set up GitHub Actions workflow:
```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    
    - name: Run tests
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      run: |
        pytest --cov=backend --cov-report=xml
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v2
```

### Pre-deployment Testing

Before deploying to production:

1. Run the full test suite:
```bash
pytest
```

2. Check test coverage (should be >80%):
```bash
pytest --cov=backend
```

3. Run security checks:
```bash
bandit -r backend/
```

4. Run linting:
```bash
flake8 backend/
```

### Test Data Management

1. Create test fixtures:
```bash
flask test-data create
```

2. Clean test data:
```bash
flask test-data clean
```

### Performance Testing

1. Install locust:
```bash
pip install locust
```

2. Run performance tests:
```bash
locust -f performance_tests/locustfile.py
```

Visit http://localhost:8089 to start the performance test. 