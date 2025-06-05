from rest_framework import serializers
from .models import PhotoRestore
from django.conf import settings

class PhotoRestoreSerializer(serializers.ModelSerializer):
    original_image = serializers.SerializerMethodField()
    restored_image = serializers.SerializerMethodField()

    class Meta:
        model = PhotoRestore
        fields = ['id', 'original_image', 'restored_image', 'restored_image_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'restored_image', 'restored_image_url', 'created_at', 'updated_at']

    def get_original_image(self, obj):
        if obj.original_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.original_image.url)
            return f"{settings.MEDIA_URL}{obj.original_image}"
        return None

    def get_restored_image(self, obj):
        if obj.restored_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.restored_image.url)
            return f"{settings.MEDIA_URL}{obj.restored_image}"
        return None

    def validate_original_image(self, value):
        if not value:
            raise serializers.ValidationError("No image file provided")
        if value.size > 10 * 1024 * 1024:  # 10MB limit
            raise serializers.ValidationError("Image size must be less than 10MB")
        return value 