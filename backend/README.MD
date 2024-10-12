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
`Note`: If you get the warning 
```
Role: "user" does not exist
```
Try  
```
sudo -u postgres createuser brlcx
```  

Once the migrations have been made the server can be started  
`Note`: First ensure that postgresql is installed and that a user is set
```
python manage.py runserver
```

### Making Models

### Making Serializers
Serialization is typically used for outgoing data. It converts data such as model instances into a format which can be rendered into JSON or other content types. As an example if you were to retrieve data from your database such as a list of transactions you serialize it into JSON format so it can be sent as an API response to the client.  

Deserialization converts incoming data (typically in JSON format) into a Python data structure and validates the data to ensure it adheres to the model’s constraints. For example when a user sends a POST or PUT request to create or update a transaction, the data is deserialized, validated, and if valid, used to create or update a model instance   

### Making Views
Views are often composed of mixins which offer reusable functionality for common HTTP methods like GET, POST, PUT, and DELETE  

Concrete view classes are provided which combine the functionality of multiple mixins. These views are meant to handle common use cases without requiring the developer to manually compose a view

### Testing routes
Once the server is started go to http://127.0.0.1:8000/  
The routes which are listed out can be found in either the backend/urls.py or backend/api/urls.py  
To test a route go to the extension of the route  
Ex: to go to admin/ type in http://127.0.0.1:8000/admin/  

### Creating a super user for admin/
```
python manage.py createsuperuser
```

### Resources I used
Initial project setup tutorial  
https://www.youtube.com/watch?v=c-QsfbznSXI  
Corresponding Repo  
https://github.com/techwithtim/Django-React-Full-Stack-App  
Creation of custom user  
https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model. html#abstractbaseuser  
Adding more fields to registration  
https://stackoverflow.com/questions/53969386/  how-to-save-extra-fields-on-registration-using-custom-user-model-in-drf-django  
Serializing many to many  
https://stackoverflow.com/questions/33182092/django-rest-framework-serializing-many-to-many-field  
Views  
https://www.django-rest-framework.org/api-guide/generic-views/  