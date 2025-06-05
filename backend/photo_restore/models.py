from django.db import models
from django.conf import settings
import requests
from django.core.files.base import ContentFile
import os

# Create your models here.

class PhotoRestore(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restored_photos')
    original_image = models.ImageField(upload_to='originals/')
    restored_image = models.ImageField(upload_to='restored/', null=True, blank=True)
    restored_image_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Restored Photo {self.id} by {self.user.username}"

    def save_restored_image(self, image_url):
        """Download and save the restored image from URL"""
        try:
            response = requests.get(image_url)
            if response.status_code == 200:
                # Get the file extension from the URL
                ext = os.path.splitext(image_url)[1] or '.jpg'
                # Create a filename for the restored image
                filename = f"restored_{self.id}{ext}"
                # Save the image
                self.restored_image.save(filename, ContentFile(response.content), save=False)
                self.restored_image_url = image_url
                self.save()
                return True
        except Exception as e:
            print(f"Error saving restored image: {str(e)}")
            return False
