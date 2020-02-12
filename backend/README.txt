Step 1: setup reqirements

cd backend
pip install -r requirements.txt

Step 2: migrations and a new user

python manage.py migrate
python manage.py createsuperuser
