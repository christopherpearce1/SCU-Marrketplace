from django.test import TestCase
from django.contrib.auth.models import User
from .models import Item

class ItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.item = Item.objects.create(
            user=self.user,
            title='Test Item',
            description='Test Description',
            price=10.00
        )

    def test_item_creation(self):
        self.assertEqual(self.item.title, 'Test Item')
        self.assertFalse(self.item.sold)
        self.assertEqual(str(self.item), 'Test Item')