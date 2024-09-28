# Back-End Dev Guide

`Note`: These commands were made on a Linux OS and might differ for a different OS  

### Setting Up Virtual Python Enviroment
#### Creating Virtual Enviroment
This is done in the root directory  
`Note`: If python3-venv is not installed follow the steps posted here https://stackoverflow.com/a/63716116  
```
python3 -m venv env
```

`Note`: All further commands should be done in the backend directory  

#### Virtual Enviroment
```
source env/bin/activate
```
### Downloading Required Dependencies  
```
pip install -r requirements.txt
```

### PostgreSQL Server
#### Reflecting any changes to the database scheme   
This is neccesary if any changes have been made to the backend/api/models.py file  
```
python manage.py makemigrations
python manage.py migrate
```

#### Running the server  
`Note`: First ensure that postgresql is installed and that a user is set
```
python manage.py runserver
```