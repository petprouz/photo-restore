import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { photoService } from '../services/api';
import { PhotoRestore } from '../types';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Compare as CompareIcon,
  Download as DownloadIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PhotoRestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoRestore | null>(null);
  const [showOriginal, setShowOriginal] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Add a state to track failed images
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await photoService.getPhotos();
        console.log('API Response:', response);
        setPhotos(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Failed to load photos');
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const getImageUrl = (url: string | null) => {
    console.log('Processing URL:', url);
    if (!url) {
      console.log('URL is null or undefined');
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }

    // If the URL is already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('Using full URL:', url);
      return url;
    }

    // If the URL is relative, prepend the API base URL
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    // Remove any duplicate slashes
    const cleanUrl = url.replace(/^\/+/, '');
    const fullUrl = `${baseUrl}/${cleanUrl}`;
    console.log('Constructed full URL:', fullUrl);
    return fullUrl;
  };

  const handleImageError = (imageUrl: string) => {
    console.error('Error loading image:', imageUrl);
    setFailedImages(prev => new Set([...Array.from(prev), imageUrl]));
  };

  const handleDownload = async (url: string | null, filename: string) => {
    console.log('Download attempt:', { url, filename });
    if (!url) {
      console.error('No image URL provided for download');
      return;
    }

    try {
      const imageUrl = getImageUrl(url);
      console.log('Fetching from URL:', imageUrl);
      
      // First check if the image exists
      const checkResponse = await fetch(imageUrl, { method: 'HEAD' });
      if (!checkResponse.ok) {
        throw new Error(`Image not found: ${checkResponse.statusText}`);
      }

      // Then download the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Blob created:', blob);
      
      // Create a temporary link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Show error to user
      alert('Failed to download image. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            width: '100%'
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Your Restored Photos
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            View and compare your AI-restored photos
          </Typography>
        </Box>

        {photos.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: 'center',
              maxWidth: 600,
              mx: 'auto',
              bgcolor: 'background.paper'
            }}
          >
            <RestoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Photos Yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Start restoring your photos to see them here
            </Typography>
            <Button
              component={Link}
              to="/restore"
              variant="contained"
              size="large"
              startIcon={<RestoreIcon />}
            >
              Restore Your First Photo
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 4
            }}
          >
            {photos.map((photo) => {
              console.log('Rendering photo:', photo);
              const imageUrl = getImageUrl(showOriginal ? photo.original_image : photo.restored_image);
              console.log('Image URL for display:', imageUrl);
              
              // Skip rendering if the image has failed to load
              if (failedImages.has(imageUrl)) {
                return null;
              }

              return (
                <Box key={photo.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={imageUrl}
                        alt={showOriginal ? 'Original' : 'Restored'}
                        sx={{ objectFit: 'cover' }}
                        onError={() => handleImageError(imageUrl)}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          gap: 1
                        }}
                      >
                        <Chip
                          label={showOriginal ? 'Original' : 'Restored'}
                          color={showOriginal ? 'default' : 'primary'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {new Date(photo.created_at).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<CompareIcon />}
                          onClick={() => setShowOriginal(!showOriginal)}
                          variant="outlined"
                          fullWidth
                        >
                          Compare
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(
                            photo.restored_image,
                            `restored_${photo.id}.jpg`
                          )}
                          variant="outlined"
                          fullWidth
                        >
                          Download
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}

        <Dialog
          open={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          maxWidth="lg"
          fullWidth
        >
          {selectedPhoto && (
            <>
              <DialogContent sx={{ p: 0, position: 'relative' }}>
                <IconButton
                  onClick={() => setSelectedPhoto(null)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                  <Box sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Original
                    </Typography>
                    <img
                      src={getImageUrl(selectedPhoto.original_image)}
                      alt="Original"
                      style={{ width: '100%', height: 'auto' }}
                      onError={(e) => {
                        console.error('Error loading image:', e);
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Restored
                    </Typography>
                    <img
                      src={getImageUrl(selectedPhoto.restored_image)}
                      alt="Restored"
                      style={{ width: '100%', height: 'auto' }}
                      onError={(e) => {
                        console.error('Error loading image:', e);
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </Box>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Gallery; 