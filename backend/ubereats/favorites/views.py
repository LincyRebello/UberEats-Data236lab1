from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import Customer, Favorites, Restaurant
from .serializers import FavoritesSerializer
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getAllFaorites(request):
    try:
        customer = Customer.objects.get(user=request.user)
        favorites = Favorites.objects.filter(customer=customer)
        serializer = FavoritesSerializer(favorites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
            logger.debug(f"Customer not found")
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

class FavoritesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, restaurant_id):
        try:
            customer = Customer.objects.get(user=request.user)
            restaurant = Restaurant.objects.get(id=restaurant_id)
            favorite = Favorites.objects.filter(customer=customer,restaurant=restaurant).first()
            if favorite:
                favorite.delete()
                return Response({"message":"Removed from favorites"}, status=status.HTTP_200_OK)
            else:
                favorite = Favorites(customer=customer,restaurant=restaurant)
                favorite.save()
                serializer = FavoritesSerializer(favorite)
                return Response({"message":"Added to favorites", "favorite":serializer.data}, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
                logger.debug(f"Customer not found")
                return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Restaurant.DoesNotExist:
                logger.debug(f"Restaurant not found")
                return Response({'error': 'Restaurant not found'}, status=status.HTTP_404_NOT_FOUND)