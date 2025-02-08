# restaurants/forms.py
from django import forms
from django.contrib.auth.models import User
from restaurants.models import Restaurant

class RestaurantSignupForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User  # Assuming User model is used for authentication
        fields = ['username', 'email', 'password']