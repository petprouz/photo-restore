from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import health_check
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.views.generic import RedirectView

# Define API URL patterns
api_urlpatterns = [
    path('', include('photo_restore.urls')),
    path('', include('users.urls')),
]

schema_view = get_schema_view(
    openapi.Info(
        title="Photo Restore API",
        default_version='v1',
        description="API for photo restoration service",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=api_urlpatterns,
)

urlpatterns = [
    # Redirect root to Swagger UI
    path('', RedirectView.as_view(url='/swagger/', permanent=False), name='index'),
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/', include(api_urlpatterns)),
    # Swagger URLs
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 