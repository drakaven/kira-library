import django_filters
from rest_framework import viewsets, filters
from .serializers import BookSerializer, ReservationSerializer
from .models import Book, Reservation


class BookViewSet(viewsets.ModelViewSet):
    """
    Viewset to handle search, filtering, order and pagination.
    For time sake no User is attached to a reservation so the filter merely
    returns if the book has any reservations at all.
    """

    queryset = Book.objects.all().distinct().order_by('title')
    filter_backends = [
        django_filters.rest_framework.DjangoFilterBackend,
        filters.SearchFilter,
    ]
    filter_fields = {'reservations': ['isnull']}
    search_fields = ['title']
    serializer_class = BookSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
