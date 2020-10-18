from rest_framework import serializers

from .models import Book, Reservation


class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = [
            'id',
            'url',
            'title',
            'author',
            'quantity',
            'quantity_available',
            'reservations',
        ]


class ReservationSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())

    class Meta:
        model = Reservation
        fields = ['id', 'book']
