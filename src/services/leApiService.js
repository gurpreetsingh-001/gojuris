// src/services/apiService.js - COMPLETE FILE WITH ALL FUNCTIONALITY
class LeApiService {
  constructor() {
    //this.baseURL = 'http://localhost:8001';
    this.baseURL = 'https://legaleagleweb.com/api';
    this.defaultTimeout = 30000;
  }

  // ================ TOKEN MANAGEMENT ================
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Utility: remove null/empty values
  cleanObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );
  }

   async getCAActList()  {
    try {
      const response = await fetch(`${this.baseURL}/GetAICA`, {
       method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'failed');
      }
      const data = await response.json();
      console.log('✅ Added successful');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  async getStateActList(st)  {
    try {
      const response = await fetch(`${this.baseURL}/GetAILA/${st}/1`, {
       method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'failed');
      }
      const data = await response.json();
      console.log('✅ Added successful');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  async getReportList(st)  {
    try {
      const response = await fetch(`${this.baseURL}/${ st === 'DAC' ? 'GetAICAD' : 'GetAILCR'}/1`, {
       method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'failed');
      }
      const data = await response.json();
      console.log('✅ Added successful');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };
}

// Create singleton instance
const leApiServiceInstance = new LeApiService();

// Export both the class and the singleton instance
export { LeApiService };
export default leApiServiceInstance;