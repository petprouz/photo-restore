from django.urls import path
from .views import PhotoRestoreAPIView, PhotoListAPIView, PhotoDetailAPIView

urlpatterns = [
    path('restore/', PhotoRestoreAPIView.as_view(), name='photo-restore'),
    path('photos/', PhotoListAPIView.as_view(), name='photo-list'),
    path('photos/<int:id>/', PhotoDetailAPIView.as_view(), name='photo-detail'),
] 