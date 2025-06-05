import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AutoAwesome,
  CloudUpload,
  Restore,
  PhotoLibrary,
  Login,
  Speed,
  Security
} from '@mui/icons-material';

const features = [
  {
    icon: <AutoAwesome sx={{ fontSize: 40 }} />,
    title: 'AI-Powered Restoration',
    description: 'Our advanced AI technology can restore old, damaged, or faded photos to their original glory.'
  },
  {
    icon: <Speed sx={{ fontSize: 40 }} />,
    title: 'Fast Processing',
    description: 'Get your restored photos in minutes, not hours. Our efficient system ensures quick turnaround.'
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Secure & Private',
    description: 'Your photos are processed securely and privately. We never share or store your images permanently.'
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6B8DD6 0%, #4A90E2 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Restore Your Memories
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Bring your old photos back to life with our AI-powered restoration service
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4
            }}
          >
            {user ? (
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                <Button
                  component={Link}
                  to="/restore"
                  variant="contained"
                  size="large"
                  startIcon={<Restore />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 100%)',
                    boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF8A8E 0%, #FAC0B4 100%)',
                      boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
                    }
                  }}
                >
                  Restore Photos
                </Button>
                <Button
                  component={Link}
                  to="/gallery"
                  variant="contained"
                  size="large"
                  startIcon={<PhotoLibrary />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #A1C4FD 0%, #C2E9FB 100%)',
                    boxShadow: '0 4px 15px rgba(161, 196, 253, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #91B4FD 0%, #B2D9FB 100%)',
                      boxShadow: '0 6px 20px rgba(161, 196, 253, 0.4)',
                    }
                  }}
                >
                  View Gallery
                </Button>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<Login />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 100%)',
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8A8E 0%, #FAC0B4 100%)',
                    boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
                  }
                }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            mb: 6,
            background: 'linear-gradient(45deg, #6B8DD6 0%, #4A90E2 100%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Why Choose Us
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
            justifyContent: 'center'
          }}
        >
          {features.map((feature, index) => (
            <Box key={index} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  minHeight: 280,
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F2F5 100%)'
                  }
                }}
              >
                <Box sx={{ 
                  color: 'primary.main',
                  mb: 3,
                  mt: 2,
                  background: 'linear-gradient(45deg, #6B8DD6 0%, #4A90E2 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#4A90E2'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #F6F9FC 0%, #EDF2F7 100%)',
          py: 8,
          mt: 4,
          display: 'flex',
          alignItems: 'center',
          minHeight: '40vh'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #6B8DD6 0%, #4A90E2 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Ready to Restore Your Photos?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Join thousands of satisfied customers who have brought their memories back to life
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {user ? (
              <Button
                component={Link}
                to="/restore"
                variant="contained"
                size="large"
                startIcon={<Restore />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 100%)',
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8A8E 0%, #FAC0B4 100%)',
                    boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
                  }
                }}
              >
                Restore More Photos
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                startIcon={<Login />}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 100%)',
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8A8E 0%, #FAC0B4 100%)',
                    boxShadow: '0 6px 20px rgba(255, 154, 158, 0.4)',
                  }
                }}
              >
                Get Started Now
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 