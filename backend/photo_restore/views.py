from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import PhotoRestoreSerializer
from .models import PhotoRestore
import replicate
import os
import logging
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

# Create your views here.

class PhotoListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get list of restored photos",
        responses={
            200: PhotoRestoreSerializer(many=True),
            401: "Unauthorized"
        }
    )
    def get(self, request, *args, **kwargs):
        photos = PhotoRestore.objects.filter(user=request.user).order_by('-created_at')
        serializer = PhotoRestoreSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)

class PhotoDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get a specific restored photo",
        responses={
            200: PhotoRestoreSerializer(),
            401: "Unauthorized",
            404: "Not Found"
        }
    )
    def get(self, request, *args, **kwargs):
        photo = get_object_or_404(PhotoRestore, id=kwargs['id'], user=request.user)
        serializer = PhotoRestoreSerializer(photo, context={'request': request})
        return Response(serializer.data)

class PhotoRestoreAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Upload and restore a photo using AI",
        manual_parameters=[
            openapi.Parameter(
                'image',
                openapi.IN_FORM,
                description="Image file to restore (JPEG, PNG, etc.)",
                type=openapi.TYPE_FILE,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Photo restored successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'restored_image_url': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description="URL of the restored image"
                        ),
                    }
                )
            ),
            400: "Bad Request - Invalid input",
            500: "Internal Server Error - Processing failed"
        }
    )
    def post(self, request, *args, **kwargs):
        if not request.FILES.get('image'):
            return Response(
                {"error": "No image file provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if not settings.REPLICATE_API_TOKEN:
            logger.error("Replicate API token not configured")
            return Response(
                {"error": "Replicate API token not configured"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            # Save uploaded image temporarily
            temp_path = default_storage.save('uploads/' + request.FILES['image'].name, ContentFile(request.FILES['image'].read()))
            temp_image_path = os.path.join(settings.MEDIA_ROOT, temp_path)

            try:
                logger.info(f"Initializing Replicate client with token: {settings.REPLICATE_API_TOKEN[:5]}...")
                replicate_client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
                
                logger.info("Starting image restoration with flux-kontext-apps/restore-image model")
                # Use the flux-kontext-apps/restore-image model
                output = replicate_client.run(
                    "flux-kontext-apps/restore-image",
                    input={
                        "input_image": open(temp_image_path, "rb"),
                        "restore_faces": True,
                        "enhance_background": True,
                        "upscale_factor": 2
                    }
                )
                
                if not output:
                    raise Exception("No output received from Replicate API")
                
                output_url = output[0] if isinstance(output, list) else output
                logger.info(f"Successfully restored image. Output URL: {output_url}")

                # Save the restored photo to the database
                photo = PhotoRestore(
                    user=request.user,
                    original_image=request.FILES['image']
                )
                photo.save()  # Save first to get an ID

                # Download and save the restored image
                if not photo.save_restored_image(output_url):
                    raise Exception("Failed to save restored image")

                serializer = PhotoRestoreSerializer(photo)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Replicate API error: {str(e)}")
                return Response(
                    {"error": f"Failed to process image with AI: {str(e)}"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            finally:
                # Clean up the temporary file
                if os.path.exists(temp_image_path):
                    os.remove(temp_image_path)
                    logger.info(f"Cleaned up temporary file: {temp_image_path}")

        except Exception as e:
            logger.error(f"Unexpected error during photo restoration: {str(e)}")
            return Response(
                {"error": f"Failed to process image: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
