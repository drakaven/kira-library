from django.db import models
from django.core.exceptions import ValidationError


APP_LABEL = 'library'


class Book(models.Model):
    title = models.CharField(max_length=250)
    author = models.CharField(max_length=250)
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = APP_LABEL

    @property
    def quantity_available(self):
        # Helper property to calculate how many copies are still available.
        return self.quantity - self.reservations.count()


class Reservation(models.Model):
    """
    About as simple a reservation as you could have holds an FK to a book.
    Reservation has model validation that prevents saving if the related book
    has no more available_quantity.
    """

    book = models.ForeignKey(
        Book,
        related_name='reservations',
        on_delete=models.CASCADE,
    )

    def clean(self):
        # If we don't have any available, don't create the reservation.
        if self.book.quantity_available == 0:
            raise ValidationError(
                {"book__available_quantity": "Book is currently unavailable"}
            )
        super().clean()

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
