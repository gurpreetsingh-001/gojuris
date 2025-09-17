// src/services/apiService.js - COMPLETE FILE WITH DYNAMIC PAYLOAD SYSTEM
class ApiService {
  constructor() {
    this.baseURL = 'http://108.60.219.166:8001';
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

  clearTokensAndRedirect() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('expiresAt');
    
    if (!token || !expiresAt) {
      return false;
    }

    const now = new Date();
    const expiry = new Date(expiresAt);
    
    return now < expiry;
  }

  logout() {
    this.clearTokensAndRedirect();
  }

  // ================ CORE API METHODS ================
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

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          config.headers.Authorization = `Bearer ${this.getAccessToken()}`;
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...config,
            signal: controller.signal
          });
          return this.handleResponse(retryResponse);
        } else {
          this.clearTokensAndRedirect();
          return null;
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - server may be processing large data');
      }
      
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async handleResponse(response) {
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      
      try {
        const errorData = await response.json();
        console.error('❌ Error Response Body:', errorData);
        
        errorMessage = errorData.message || 
                      errorData.detail || 
                      errorData.error || 
                      errorMessage;
      } catch (e) {
        try {
          const errorText = await response.text();
          console.error('❌ Error Response Text:', errorText);
          errorMessage = errorText || errorMessage;
        } catch (e2) {
          console.error('❌ Could not read error response');
        }
      }
      
      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      console.log('✅ Success Response:', data);
      return data;
    } catch (e) {
      console.error('❌ Could not parse JSON response');
      const text = await response.text();
      console.log('📄 Response as text:', text);
      return { message: text };
    }
  }

  // ================ AUTHENTICATION APIs ================
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
      
      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        if (data.expiresAt) {
          localStorage.setItem('expiresAt', data.expiresAt);
        }
        console.log('✅ Login successful');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

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
        if (data.expiresAt) {
          localStorage.setItem('expiresAt', data.expiresAt);
        }
        console.log('✅ Token refreshed successfully');
        return true;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
    }

    return false;
  }

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

  async getUserProfile() {
    return this.makeRequest('/me');
  }

  // ================ AI EMBEDDING API ================
  async generateEmbedding(message) {
    console.log('🧠 Generating embedding for:', message);
    
    try {
      const result = await this.makeRequest('/AI/Embedding', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      
      console.log('✅ Embedding API Response:', result);
      return result;
    } catch (error) {
      console.error('❌ Embedding API Error:', error);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }

  // ================ AI SEARCH APIs - SIMPLIFIED FOR CHAT ================
  
  // 🚀 SIMPLIFIED AI CHAT SEARCH - Only query and queryVector
  async searchWithAI_Chat(userQuery, embeddingVector, options = {}) {
    console.log('💬 AI Chat Search - Simplified Payload');
    console.log('Query:', userQuery);
    console.log('Vector Length:', embeddingVector?.length);

    const payload = {
      requests: [
        {
          query: userQuery,
          queryVector: embeddingVector
        }
      ],
      sortBy: options.sortBy || "relevance",
      sortOrder: options.sortOrder || "desc", 
      page: options.page || 1,
      pageSize: options.pageSize || 5,
      inst: options.inst || "",
      prompt: options.prompt || "Find relevant legal cases"
    };

    console.log('🚀 AI Chat Payload:', JSON.stringify(payload, null, 2));

    // Use longer timeout for AI search (60 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${this.baseURL}/Judgement/SearchWithAI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `AI Chat Search Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ AI Chat Search Response:', result);
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('AI Search is taking longer than expected. Please try with a simpler question.');
      }
      
      console.error('❌ AI Chat Search Error:', error);
      throw new Error(`AI Chat Search failed: ${error.message}`);
    }
  }

  // 🔍 ADVANCED AI SEARCH - All fields for search page
  async searchWithAI_Advanced(userQuery, embeddingVector, filters = {}) {
    console.log('🔍 AI Advanced Search - Full Payload');
    
    const payload = {
      requests: [
        {
          keycode: filters.keycode || 0,
          query: userQuery,
          subject: filters.subject || "",
          fulltext: filters.fulltext || "",
          headnote: filters.headnote || "",
          judgement: filters.judgement || "",
          headnoteAll: filters.headnoteAll || "",
          judges: filters.judges || "",
          appellant: filters.appellant || "",
          respondent: filters.respondent || "",
          caseNo: filters.caseNo || "",
          citation: filters.citation || "",
          advocate: filters.advocate || "",
          issueForConsideration: filters.issueForConsideration || "",
          lawPoint: filters.lawPoint || "",
          held: filters.held || "",
          backgroundFacts: filters.backgroundFacts || "",
          partiesContentions: filters.partiesContentions || "",
          disposition: filters.disposition || "",
          favour: filters.favour || "",
          yearFrom: filters.yearFrom || 0,
          yearTo: filters.yearTo || 0,
          result: filters.result || "",
          casesReferred: filters.casesReferred || "",
          isState: filters.isState !== undefined ? filters.isState : true,
          acts: filters.acts || [],
          sections: filters.sections || [],
          mainkeys: filters.mainkeys || [],
          years: filters.years || [],
          queryVector: embeddingVector,
          isAi: true
        }
      ],
      sortBy: filters.sortBy || "relevance",
      sortOrder: filters.sortOrder || "desc",
      page: filters.page || 0,
      pageSize: filters.pageSize || 10,
      inst: filters.inst || "",
      prompt: filters.prompt || "Find relevant legal cases"
    };

    try {
      const result = await this.makeRequest('/Judgement/SearchWithAI', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      return result;
    } catch (error) {
      throw new Error(`AI Advanced Search failed: ${error.message}`);
    }
  }

  // 🎯 DYNAMIC AI SEARCH - Auto-detects context
  async searchJudgementsWithAI(userQuery, embeddingVector, options = {}) {
    const searchType = options.searchType || 'chat';
    
    if (searchType === 'chat') {
      return this.searchWithAI_Chat(userQuery, embeddingVector, options);
    } else if (searchType === 'advanced') {
      return this.searchWithAI_Advanced(userQuery, embeddingVector, options);
    } else {
      return this.searchWithAI_Chat(userQuery, embeddingVector, options);
    }
  }

  // ================ REGULAR SEARCH APIs ================
  
 // ✅ SIMPLIFIED REGULAR SEARCH - Fixed page numbering
  async searchJudgements_Chat(userQuery, options = {}) {
    const payload = {
      requests: [
        {
          query: userQuery,
          queryVector: []
        }
      ],
      sortBy: options.sortBy || "relevance",
      sortOrder: options.sortOrder || "desc",
      page: options.page || 1,  // ✅ FIXED: Changed from 0 to 1
      pageSize: options.pageSize || 10,
      inst: options.inst || "",
      prompt: options.prompt || ""
    };

    return this.makeRequest('/Judgement/Search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ✅ FULL REGULAR SEARCH - Fixed page numbering
  async searchJudgements(userQuery, filters = {}) {
    const payload = {
      requests: [
        {
          keycode: filters.keycode || 0,
          query: userQuery,
          subject: filters.subject || "",
          fulltext: filters.fulltext || "",
          headnote: filters.headnote || "",
          judgement: filters.judgement || "",
          headnoteAll: filters.headnoteAll || "",
          judges: filters.judges || "",
          appellant: filters.appellant || "",
          respondent: filters.respondent || "",
          caseNo: filters.caseNo || "",
          citation: filters.citation || "",
          advocate: filters.advocate || "",
          issueForConsideration: filters.issueForConsideration || "",
          lawPoint: filters.lawPoint || "",
          held: filters.held || "",
          backgroundFacts: filters.backgroundFacts || "",
          partiesContentions: filters.partiesContentions || "",
          disposition: filters.disposition || "",
          favour: filters.favour || "",
          yearFrom: filters.yearFrom || 0,
          yearTo: filters.yearTo || 0,
          result: filters.result || "",
          casesReferred: filters.casesReferred || "",
          isState: filters.isState !== undefined ? filters.isState : true,
          acts: filters.acts || [],
          sections: filters.sections || [],
          mainkeys: filters.mainkeys || [],
          years: filters.years || [],
          queryVector: [],
          isAi: false
        }
      ],
      sortBy: filters.sortBy || "relevance",
      sortOrder: filters.sortOrder || "desc",
      page: filters.page || 1,  // ✅ FIXED: Changed from 0 to 1
      pageSize: filters.pageSize || 20,
      inst: filters.inst || "",
      prompt: filters.prompt || ""
    };

    return this.makeRequest('/Judgement/Search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }


  // ================ JUDGEMENT DETAIL API ================
  async getJudgement(id, searchModel) {
    return this.makeRequest(`/Judgement/GetJudgement/${id}`, {
      method: 'POST',
      body: JSON.stringify(searchModel),
    });
  }

  // ================ HELPER METHODS ================
  
  // For AI Search Page
  async performAISearch(searchQuery, embeddingVector, filters = {}) {
    return this.searchJudgementsWithAI(searchQuery, embeddingVector, {
      searchType: 'advanced',
      ...filters
    });
  }

  // For Regular Search Page  
  async performRegularSearch(searchQuery, filters = {}) {
    return this.searchJudgements(searchQuery, filters);
  }
}

export default new ApiService();