#iske niche wala code hai
# customers/views.py
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Customer
from .serializers import CustomerSerializer

class RegisterCustomerView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid(raise_exception=False):
            serializer.save()
            return Response({'message': 'Customer registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginCustomerView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        if check_password(password, customer.password):
            if customer.user is None:
                user = None
                try:
                    user = User.objects.create_user(username=customer.email, password=password)
                except Exception as e:
                    user = User.objects.get(username=customer.email)
                customer.user = user
                customer.save()
            refresh = RefreshToken.for_user(customer.user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

class CustomerOwnProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            data = request.data.copy()
            if not data.get("password"):
                data["password"] = customer.password
            else:
                data["password"] = make_password(data["password"])
            serializer = CustomerSerializer(customer, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request):
        try:
            customer = Customer.objects.get(user=request.user)
            data = request.data.copy()
            if data.get("delivery_address"):
                customer.delivery_address = data.get("delivery_address")
                customer.save()
                serializer = CustomerSerializer(customer, partial=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"error":"delivery_address is required field"}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)


class CustomerProfileView(APIView):
    def get(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    #should remove this method customers should only able to edits its own profile details
    def put(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk)
            data = request.data.copy()
            if not data.get("password"):
                data["password"] = customer.password
            else:
                data["password"] = make_password(data["password"])
            serializer = CustomerSerializer(customer, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        


