from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):    
   # display_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # The fields var contains all fields we want to serialize when accepting or returning new user
        fields = ["id", "email", "password", "display_name"]
        # ensures that password will be accepted when a new user is created but that we won't return the password
        extra_kwargs = {"password": {"write_only": True}}
    
    # method called when we want to create new version of user
    # we accept validated data which has already passed the checks in the serializer
    def create(self, validated_data):
        # we assign the user var and we pass all data to the User object
        user = User.objects.create_user(**validated_data)
        return user
    
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         # in this case "author" is read since the author is manually set based off who creates it
#         # we only want the author set by backend which is why writing is restricted
#         extra_kwargs = {"author": {"read_only": True}}