// src/services/apiService.js
class ApiService {
  constructor() {
    this.baseURL = 'http://108.60.219.166:8001'; // Replace with your actual API URL
  }

  // Get access token from localStorage
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  // Get refresh token from localStorage
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Set tokens in localStorage
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Clear tokens and redirect to login
  clearTokensAndRedirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  // Generic API call method
  async makeRequest(endpoint, options = {}) {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token found. Please login again.');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle token expiry
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.getAccessToken()}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, config);
          return this.handleResponse(retryResponse);
        } else {
          this.clearTokensAndRedirect();
          return null;
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.accessToken, data.refreshToken);
        console.log('✅ Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
    }

    return false;
  }

  // AI Embedding API
  async generateEmbedding(message) {
    return this.makeRequest('/AI/Embedding', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // User Profile API
  async getUserProfile() {
    return this.makeRequest('/me');
  }

  // Judgement Search with AI
  async searchJudgementsWithAI(searchData) {
    return this.makeRequest('/Judgement/SearchWithAI', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  // Regular Judgement Search
  async searchJudgements(searchData) {
    return this.makeRequest('/Judgement/Search', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  // Get specific judgement
  async getJudgement(id, searchModel) {
    return this.makeRequest(`/Judgement/GetJudgement/${id}`, {
      method: 'POST',
      body: JSON.stringify(searchModel),
    });
  }
  // User Registration API
  async registerUser(userData) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || `Registration failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ User registration successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  }

  // Login API (update existing method)
  async loginUser(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        console.log('✅ Login successful');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

}

export default new ApiService();