# Back-End Dev Guide

`Note`: These commands were made on a Linux OS and might differ for a different OS

### Setting Up Virtual Python Environment
The first step is to create the Python virtual environment  
This is done in the root directory  
`Note`: If python3-venv is not installed follow the steps posted here https://stackoverflow.com/a/63716116
```
python3 -m venv env
```

The virtual environment then needs to be activated  
```
source env/bin/activate
```  

`Note`: All further commands should be done in the backend directory  

### Downloading Required Dependencies  
```
pip install -r requirements.txt
```

### PostgreSQL Server
The changes to the database need to be reflected before the server is run  
This is necessary if any changes have been made to the backend/api/models.py file  
```
python manage.py makemigrations
python manage.py migrate
```

Once the migrations have been made the server can be started  
`Note`: First ensure that postgresql is installed and that a user is set
```
python manage.py runserver
```

### Resources I used
Initial project setup  
https://www.youtube.com/watch?v=c-QsfbznSXI  
Creation of custom user  
https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#abstractbaseuser  
Adding more fields to registration  
https://stackoverflow.com/questions/53969386/how-to-save-extra-fields-on-registration-using-custom-user-model-in-drf-django  