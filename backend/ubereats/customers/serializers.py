from rest_framework import serializers
from .models import Customer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id','name', 'email', 'password', 'profile_picture','date_of_birth','city','state','country','phone_number','delivery_address']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError({"name": "This field is required."})
        if not data.get('email'):
            raise serializers.ValidationError({"email": "This field is required."})
        customer = Customer.objects.filter(email=data.get('email')).first()
        # if not data.get('password'):
        #     raise serializers.ValidationError({"password": "This field is required."})
        return super().validate(data)

    def create(self, validated_data):
        try:
            user = User.objects.create_user(username=validated_data['email'], password=validated_data['password'])
        except Exception as e:
            user = User.objects.get(username=validated_data["email"])
        customer = Customer(
            user=user,
            name=validated_data['name'],
            email=validated_data['email'],
            password=make_password(validated_data['password'])  # Hash password here
        )
        customer.save()
        
        return customer
