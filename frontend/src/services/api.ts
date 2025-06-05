import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com/api'  // Replace with your actual backend URL after deployment
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/users/login/', { 
        username: username,
        password: password 
      });
      
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        // Also store user data if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  // googleLogin: async (token: string) => {
  //   const response = await api.post('/users/google-auth/', { token });
  //   return response.data;
  // },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register/', { 
      username: username,
      email: email,
      password: password,
      password2: password 
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/user/');
    return response.data;
  }
};

export const photoService = {
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/photo_restore/restore/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Please login to restore photos');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  },

  getPhotos: async () => {
    try {
      console.log('Fetching photos from API...'); // Debug log
      const response = await api.get('/photo_restore/photos/');
      console.log('Photos API response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Error fetching photos:', error); // Debug log
      if (error.response?.status === 401) {
        throw new Error('Please login to view photos');
      }
      throw error;
    }
  },

  getPhoto: async (id: string) => {
    try {
      const response = await api.get(`/photo_restore/photos/${id}/`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Please login to view photo');
      }
      throw error;
    }
  },
};

export default api; 