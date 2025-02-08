from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth.hashers import make_password
from .models import Restaurant, Dish
from .serializers import RestaurantSerializer, DishSerializer, RestaurantLoginSerializer, DishCreateSerializer
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
import logging
from rest_framework_simplejwt.authentication import JWTAuthentication

# Get an instance of a logger
logger = logging.getLogger(__name__)


class RegisterRestaurantView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            # Create the user object, the password will be automatically hashed
            user = User.objects.create_user(username=request.data['email'], password=request.data['password'])
            # Save the restaurant with the created user
            restaurant = serializer.save(user=user)
            return Response({'message': 'Restaurant registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RestaurantProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, restaurant_id):
        logger.debug(f"Fetching profile for restaurant_id: {restaurant_id} with user: {request.user}")
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant with id {restaurant_id} not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, restaurant_id):
        try:
            logger.debug(f"Updating profile for restaurant_id: {restaurant_id} with user: {request.user}")
            restaurant = Restaurant.objects.get(id=restaurant_id) 
            #extra security user should only update its own restaurant
            if restaurant.user.id==request.user.id:
                serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    logger.debug("Profile updated successfully")
                    return Response(serializer.data)
                logger.debug(f"Validation errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Access not allowed to update this Restaurant'}, status=status.HTTP_401_UNAUTHORIZED)
        except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant with id {restaurant_id} not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        
# View to list all restaurants
class RestaurantListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    

    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


#Get request don't required authentication
#POST(create) request required authentication
class DishListCreateView(APIView):
    serializer_class = DishSerializer

    def get(self,request, restaurant_id):
        dishes = Dish.objects.filter(restaurant_id=restaurant_id)
        serializer = DishSerializer(dishes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    def post(self, request, restaurant_id):
        if request.user.is_authenticated:
            logger.debug(f"Creating dish for restaurant_id: {restaurant_id} with user: {request.user}")
            try:
                data = request.data
                restaurant = Restaurant.objects.get(id=restaurant_id)
                #extra security user should only create dish for its own restaurant
                if restaurant.user.id==request.user.id:
                    data["restaurant"] = restaurant_id
                    serializer = DishCreateSerializer(data=data)
                    if serializer.is_valid():
                        serializer.save()
                        logger.debug("Dish Created successfully")
                        return Response(serializer.data)
                    logger.debug(f"Validation errors: {serializer.errors}", status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'error': 'Access not allowed to create dish for this Restaurant'}, status=status.HTTP_401_UNAUTHORIZED)
            except Restaurant.DoesNotExist:
                logger.debug(f"Restaurant with id {restaurant_id} not found")
                return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "detail": "Authentication credentials were not provided."
        }, status=status.HTTP_401_UNAUTHORIZED)


class DishRetrieveUpdateDestroyView(APIView):
    serializer_class = DishSerializer
    permission_classes = [AllowAny]
    def get(self, request,dish_id):
        logger.debug(f"Fetching dish for dish_id: {dish_id} with user: {request.user}")
        try:
            dish = Dish.objects.get(id=dish_id)
            serializer = self.serializer_class(dish)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Dish.DoesNotExist:
            logger.error(f"Dish with id {dish_id} not found")
            return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request,dish_id):
        if request.user.is_authenticated:
            logger.debug(f"Updating dish for dish_id: {dish_id} with user: {request.user}")
            try:
                dish = Dish.objects.get(id=dish_id)
                if dish.restaurant.user.id==request.user.id:
                    data = request.data
                    data["restaurant"] = dish.restaurant.id
                    serializer = DishCreateSerializer(dish, data=data)
                    if serializer.is_valid():
                        serializer.save()
                        logger.debug("Dish updated successfully")
                        return Response(serializer.data, status=status.HTTP_200_OK)
                    else:
                        logger.error(f"Validation errors: {serializer.errors}")
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                return Response({'error': 'Access not allowed to update dish for this Restaurant'}, status=status.HTTP_401_UNAUTHORIZED)
            except Dish.DoesNotExist:
                logger.error(f"Dish with id {dish_id} not found")
                return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "detail": "Authentication credentials were not provided."
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    def delete(self, request,dish_id):
        if request.user.is_authenticated:
            logger.debug(f"Deleting dish for dish_id: {dish_id} with user: {request.user}")
            try:
                dish = Dish.objects.get(id=dish_id)
                if dish.restaurant.user.id==request.user.id:
                    dish.delete()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response({'error': 'Access not allowed to delete dish for this Restaurant'}, status=status.HTTP_401_UNAUTHORIZED)
            except Dish.DoesNotExist:
                logger.error(f"Dish with id {dish_id} not found")
                return Response({'error': 'Dish not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "detail": "Authentication credentials were not provided."
        }, status=status.HTTP_401_UNAUTHORIZED)

class LoginRestaurantView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RestaurantLoginSerializer(data=request.data)
        if serializer.is_valid():
            restaurant = serializer.validated_data["restaurant"]
            
            # Check the password using Django's built-in check_password
            if restaurant.user.check_password(request.data['password']):
                refresh = RefreshToken.for_user(restaurant.user)
                return Response({
                    "message": "Login successful",
                    "restaurant_id": restaurant.id,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




#Extra apis 
    # get restaurant profile by user
    # get dished by user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getRestaurantProfileView(request):
    try:
        restaurant = Restaurant.objects.get(user=request.user)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getDishesView(request):
    try:
        restaurant = Restaurant.objects.get(user=request.user)
        dishes = Dish.objects.filter(restaurant=restaurant)
        serializer = DishSerializer(dishes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    except Restaurant.DoesNotExist:
            logger.debug(f"Restaurant not found")
            return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)