from rest_framework import serializers
from .models import User, Group, Transaction, Invite
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password

# serializer checks to make sure all data is correct before being sent to model
# Note: fields = '__all__' can be used if all fields need to be serialized

class UserSerializer(serializers.ModelSerializer):    
    class Meta:
        model = User
        # The fields var contains all fields we want to serialize when accepting or returning new user
        fields = ["id", "email", "password", "display_name"]
        # ensures that password will be accepted when a new user is created but that we won't return the password
        extra_kwargs = {
                "password": {"write_only": True},
                "email": {"required": True},
                "display_name": {"required": True}
            }

    def update(self, instance, validated_data):
            # Update email if provided
            if 'email' in validated_data:
                instance.email = validated_data.pop('email')

            # Update display name if provided
            if 'display_name' in validated_data:
                instance.display_name = validated_data.pop('display_name')

            # Update password if provided
            if 'password' in validated_data:
                password = validated_data.pop('password')
                validate_password(password, user=instance)  # Validate password
                instance.password = make_password(password)

            # Update any other fields (if necessary)
            return super().update(instance, validated_data)

    # ensures that the password passes the checks within the settings.py
    # TODO add second password for verification
    def validate(self, data):
        password = data.get('password')
        if password:  # Only validate if password is provided
            validate_password(password)
        return data
    
    # method called when we want to create new version of user
    # we accept validated data which has already passed the checks in the serializer
    def create(self, validated_data):
        # we assign the user var and we pass all data to the User object
        user = User.objects.create_user(**validated_data)
        return user
    
class GroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )    
    owner_name = serializers.CharField(source='group_owner_id.display_name', read_only=True)
    owner_email = serializers.CharField(source='group_owner_id.email', read_only=True)

    class Meta:
        model = Group
        fields = ["group_id", "group_name", "description", "group_owner_id", "members", "owner_name", "owner_email"]
        extra_kwargs = {"group_owner_id": {"read_only": True}}

    def create(self, validated_data):
        members_data = validated_data.pop('members', [])
        group = Group.objects.create(**validated_data)
        group.members.set(members_data)
        return group
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['members'] = UserSerializer(instance.members, many=True).data
        return ret

    # It might be better and more efficient to take in a list of users to add to lower GET requests
    def update(self, instance, validated_data):
        if 'members' in validated_data:
            instance.members.set(validated_data['members'])
        return super().update(instance, validated_data)

class TransactionSerializer(serializers.ModelSerializer):
    # allows for the group name of a transaction to be included
    group_name = serializers.CharField(source='group_id.group_name', read_only=True)

    class Meta:
        model = Transaction
        fields = ["transaction_id", "category", "amount", "description", "start_date", "end_date", "is_recurrent", "frequency", "group_id", "group_name"]
        extra_kwargs = {"group_id": {"read_only": True}}
 
class InviteSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Invite  # Use your Invite model
        fields = ['message', 'group_id', 'received_invites']  # Add other necessary fields from your Invite model

    def validate_message(self, value):
        # Optional: Add custom validation logic for the message if needed
        if len(value) > 1000:
            raise serializers.ValidationError("Message is too long. Maximum length is 500 characters.")
        return value

class LLMRequestSerializer(serializers.Serializer):
    question = serializers.CharField()

class LLMCharResponseSerializer(serializers.Serializer):
    answer = serializers.CharField()

class LLMCategoryResponseSerializer(serializers.Serializer):
    situations = serializers.ListField(child=serializers.CharField())
    subject = serializers.CharField()

# differs from transaction serializer because we don't need all the information that we do for normal transactions here
class LLMTransactionResponseSerializer(serializers.Serializer):
    category = serializers.CharField()
    amount = serializers.FloatField()
    description = serializers.CharField()
    date = serializers.DateField()