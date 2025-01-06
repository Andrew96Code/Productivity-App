from setuptools import setup, find_packages

setup(
    name='backend',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'flask',
        'flask-sqlalchemy',
        'flask-migrate',
        'flask-cors',
        'flask-limiter',
        'flask-login',
        'flask-wtf',
        'python-dotenv',
        'gunicorn',
        'redis',
        'python-dateutil',
        'requests',
        'email-validator',
    ],
) 