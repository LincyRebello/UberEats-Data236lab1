# ubereats/views.py

from django.shortcuts import render

def home(request):
    return render(request, 'home.html')  # Ensure you have a home.html template


