# from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # The fields contain all fields we want to serialize when accpeting or returning new user
        fields = ["id", "username", "password"]
        # Tells Django that a password should be accepted when a new user is created but we don't want to return password
        extra_kwargs = {"password": {"write_only": True}}
    
    # method called when we want to create new version of user
    # we accept validated data which has already passed the checks
    def create(self, validated_data):
        print(validated_data)
        # we assign the user var and we pass all data to the User object
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        # in this case author is read since the author is manually set off who creates it
        # we only want the author set by backend
        extra_kwargs = {"author": {"read_only": True}}