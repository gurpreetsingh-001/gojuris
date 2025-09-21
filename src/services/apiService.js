// src/services/apiService.js - COMPLETE FILE WITH ALL FUNCTIONALITY
class ApiService {
  constructor() {
    this.baseURL = 'http://216.172.100.173:8001';
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

    // Only redirect if we're not already on login/signup pages
    const currentPath = window.location.pathname;
    if (!['/login', '/password', '/signup', '/'].includes(currentPath)) {
      window.location.href = '/login';
    }
  }

  isAuthenticated() {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('expiresAt');

    if (!token || !expiresAt) {
      return false;
    }

    const now = new Date();
    const expiry = new Date(expiresAt);

    // Check if token is expired
    if (now >= expiry) {
      this.clearTokensAndRedirect();
      return false;
    }

    return true;
  }

  async logout() {
  try {
    // Optional: Call logout API endpoint if it exists
    // Uncomment if your backend has a logout endpoint
    /*
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (apiError) {
      console.warn('Logout API call failed:', apiError);
      // Continue with local cleanup even if API fails
    }
    */

    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    
    console.log('✅ Logout successful - all data cleared');
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Force clear even if there's an error
    localStorage.clear();
    throw error;
  }
}

// Update clearTokensAndRedirect to be more explicit
clearTokensAndRedirect() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userData');

  // Only redirect if we're not already on login/signup pages
  const currentPath = window.location.pathname;
  if (!['/login', '/password', '/signup', '/'].includes(currentPath)) {
    window.location.href = '/login';
  }
}

  // ================ CORE API METHODS ================
  async makeRequest(endpoint, options = {}) {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error('No access token found. Please login again.');
    }

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.defaultTimeout,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        ...options.headers,
      },
      ...options,
    };

    console.log(`🚀 Making ${config.method || 'GET'} request to:`, url);
    console.log('📋 Request config:', config);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`📡 Response status:`, response.status);

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.log('🔐 Authentication failed, redirecting to login');
          this.clearTokensAndRedirect();
          throw new Error('Session expired. Please login again.');
        }

        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('❌ Error Response JSON:', errorData);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
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
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
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
        if (data.userEmail || credentials.username) {
          localStorage.setItem('userEmail', data.userEmail || credentials.username);
        }
        console.log('✅ Login successful');
      }

      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
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
        throw new Error(errorData.message || errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      console.log('✅ Registration successful');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
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

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        this.setTokens(data.accessToken, data.refreshToken);
        if (data.expiresAt) {
          localStorage.setItem('expiresAt', data.expiresAt);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  }

  // Add this method to your existing ApiService class

// ================ USER PROFILE METHODS ================
async getUserInfo() {
  try {
    console.log('👤 Fetching user info');
    
    const response = await fetch(`${this.baseURL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`,
        'Accept': 'application/json'
      }
    });

    if (response.status === 401) {
      console.log('🔐 Authentication failed, redirecting to login');
      this.clearTokensAndRedirect();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.detail || 'Failed to fetch user info');
    }

    const data = await response.json();
    console.log('✅ User info retrieved successfully');
    return data;
  } catch (error) {
    console.error('❌ Get user info failed:', error);
    throw error;
  }
}

// Get user profile (alias method for backward compatibility)
async getUserProfile() {
  return this.getUserInfo();
}

  // ================ SEARCH APIs ================
  async performSearch(searchData) {
    try {
      console.log('🔍 Performing search with:', searchData);

      return await this.makeRequest('/search', {
        method: 'POST',
        body: JSON.stringify(searchData)
      });
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }

  async performAdvancedSearch(searchData) {
    try {
      console.log('🔍 Performing advanced search with:', searchData);

      return await this.makeRequest('/advanced-search', {
        method: 'POST',
        body: JSON.stringify(searchData)
      });
    } catch (error) {
      console.error('❌ Advanced search failed:', error);
      throw error;
    }
  }

  async performCitationSearch(citationData) {
    try {
      console.log('📚 Performing citation search with:', citationData);

      return await this.makeRequest('/citation-search', {
        method: 'POST',
        body: JSON.stringify(citationData)
      });
    } catch (error) {
      console.error('❌ Citation search failed:', error);
      throw error;
    }
  }

  async performAISearch(searchQuery) {
    try {
      console.log('🤖 Performing AI search with:', searchQuery);

      return await this.makeRequest('/ai-search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery })
      });
    } catch (error) {
      console.error('❌ AI search failed:', error);
      throw error;
    }
  }

  // ================ JUDGMENT APIs ================
  async getJudgment(judgmentId) {
    try {
      console.log('⚖️ Fetching judgment:', judgmentId);

      return await this.makeRequest(`/judgment/${judgmentId}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get judgment failed:', error);
      throw error;
    }
  }

  async getJudgmentMetadata(judgmentId) {
    try {
      console.log('📋 Fetching judgment metadata:', judgmentId);

      return await this.makeRequest(`/judgment/${judgmentId}/metadata`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get judgment metadata failed:', error);
      throw error;
    }
  }

  // ================ AI CHAT APIs ================
  async sendChatMessage(message, conversationId = null) {
    try {
      console.log('💬 Sending chat message:', message);

      const payload = {
        message: message,
        ...(conversationId && { conversationId })
      };

      return await this.makeRequest('/chat', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('❌ Send chat message failed:', error);
      throw error;
    }
  }

  async getChatHistory(conversationId) {
    try {
      console.log('📜 Fetching chat history:', conversationId);

      return await this.makeRequest(`/chat/${conversationId}/history`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get chat history failed:', error);
      throw error;
    }
  }

  async createNewConversation() {
    try {
      console.log('🆕 Creating new conversation');

      return await this.makeRequest('/chat/new', {
        method: 'POST',
        body: JSON.stringify({})
      });
    } catch (error) {
      console.error('❌ Create new conversation failed:', error);
      throw error;
    }
  }

  async deleteConversation(conversationId) {
    try {
      console.log('🗑️ Deleting conversation:', conversationId);

      return await this.makeRequest(`/chat/${conversationId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('❌ Delete conversation failed:', error);
      throw error;
    }
  }

  // ================ USER PROFILE APIs ================
  async updateUserProfile(profileData) {
    try {
      console.log('👤 Updating user profile:', profileData);

      return await this.makeRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('❌ Update user profile failed:', error);
      throw error;
    }
  }

  async changePassword(passwordData) {
    try {
      console.log('🔐 Changing password');

      return await this.makeRequest('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      });
    } catch (error) {
      console.error('❌ Change password failed:', error);
      throw error;
    }
  }

  // ================ HISTORY & BOOKMARKS APIs ================
  async getSearchHistory(page = 1, limit = 20) {
    try {
      console.log('📚 Fetching search history');

      return await this.makeRequest(`/history/search?page=${page}&limit=${limit}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get search history failed:', error);
      throw error;
    }
  }

  async deleteSearchHistory(historyId) {
    try {
      console.log('🗑️ Deleting search history:', historyId);

      return await this.makeRequest(`/history/search/${historyId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('❌ Delete search history failed:', error);
      throw error;
    }
  }

  async getBookmarks(page = 1, limit = 20) {
    try {
      console.log('🔖 Fetching bookmarks');

      return await this.makeRequest(`/bookmarks?page=${page}&limit=${limit}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get bookmarks failed:', error);
      throw error;
    }
  }

  async addBookmark(bookmarkData) {
    try {
      console.log('🔖 Adding bookmark:', bookmarkData);

      return await this.makeRequest('/bookmarks', {
        method: 'POST',
        body: JSON.stringify(bookmarkData)
      });
    } catch (error) {
      console.error('❌ Add bookmark failed:', error);
      throw error;
    }
  }

  async removeBookmark(bookmarkId) {
    try {
      console.log('🗑️ Removing bookmark:', bookmarkId);

      return await this.makeRequest(`/bookmarks/${bookmarkId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('❌ Remove bookmark failed:', error);
      throw error;
    }
  }

  // ================ DOWNLOADS APIs ================
  async getDownloads(page = 1, limit = 20) {
    try {
      console.log('📥 Fetching downloads');

      return await this.makeRequest(`/downloads?page=${page}&limit=${limit}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get downloads failed:', error);
      throw error;
    }
  }

  async downloadDocument(documentId, format = 'pdf') {
    try {
      console.log('📄 Downloading document:', documentId);

      return await this.makeRequest(`/download/${documentId}?format=${format}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });
    } catch (error) {
      console.error('❌ Download document failed:', error);
      throw error;
    }
  }

  // ================ BILLING & SUBSCRIPTION APIs ================
  async getSubscriptionInfo() {
    try {
      console.log('💳 Fetching subscription info');

      return await this.makeRequest('/billing/subscription', {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get subscription info failed:', error);
      throw error;
    }
  }

  async getBillingHistory(page = 1, limit = 20) {
    try {
      console.log('💰 Fetching billing history');

      return await this.makeRequest(`/billing/history?page=${page}&limit=${limit}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get billing history failed:', error);
      throw error;
    }
  }

  async updatePaymentMethod(paymentData) {
    try {
      console.log('💳 Updating payment method');

      return await this.makeRequest('/billing/payment-method', {
        method: 'PUT',
        body: JSON.stringify(paymentData)
      });
    } catch (error) {
      console.error('❌ Update payment method failed:', error);
      throw error;
    }
  }

  // ================ DATABASE APIs ================
  async getDatabaseList() {
    try {
      console.log('🗄️ Fetching database list');

      return await this.makeRequest('/database/list', {
        method: 'GET'
      });
    } catch (error) {
      console.error('❌ Get database list failed:', error);
      throw error;
    }
  }

  async searchDatabase(databaseId, searchQuery) {
    try {
      console.log('🔍 Searching database:', databaseId);

      return await this.makeRequest(`/database/${databaseId}/search`, {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery })
      });
    } catch (error) {
      console.error('❌ Search database failed:', error);
      throw error;
    }
  }

  // ================ UTILITY METHODS ================
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return false;
    }
  }

  // Get user email from localStorage
  getUserEmail() {
    return localStorage.getItem('userEmail');
  }

  // Check if user has premium subscription
  isPremiumUser() {
    const subscriptionType = localStorage.getItem('subscriptionType');
    return subscriptionType === 'premium' || subscriptionType === 'pro';
  }

  // Format error messages for display
  formatErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  // ================ FILE UPLOAD METHODS ================
  async uploadFile(file, type = 'document') {
    try {
      console.log('📎 Uploading file:', file.name);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const token = this.getAccessToken();
      if (!token) {
        throw new Error('No access token found. Please login again.');
      }

      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('✅ File uploaded successfully');
      return data;
    } catch (error) {
      console.error('❌ File upload failed:', error);
      throw error;
    }
  }


  // Add these methods to your existing ApiService class

  // ================ AI SEARCH METHODS ================

  // Generate AI Embedding
  async generateEmbedding(message) {
    try {
      console.log('🤖 Generating AI embedding for:', message);

      const response = await fetch(`${this.baseURL}/AI/Embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (response.status === 401) {
        this.clearTokensAndRedirect();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'AI Embedding generation failed');
      }

      const data = await response.json();
      console.log('✅ AI Embedding generated successfully');
      return data;
    } catch (error) {
      console.error('❌ AI Embedding generation failed:', error);
      throw error;
    }
  }

  // AI Search using /Judgement/Search with queryVector (as per developer note)
 // Add this method to your existing ApiService class

// 🔍 SIMPLIFIED AI SEARCH - For AI Search page (minimal payload)
async searchJudgementsWithAI_ForSearch(userQuery, embeddingVector, options = {}) {
  console.log('🔍 AI Search - Simplified Payload (like AI Chat)');
  console.log('Query:', userQuery);
  console.log('Vector Length:', embeddingVector?.length);

  // Use the same simplified payload structure as AI Chat
  const payload = {
    requests: [
      {
        query: userQuery,
        queryVector: embeddingVector
      }
    ],
    sortBy: options.sortBy || "relevance",
    sortOrder: options.sortOrder || "desc", 
    page: options.page || 1,  // AI Search uses 0-based pagination
    pageSize: options.pageSize || 25,
    inst: options.inst || "",
    prompt: options.prompt || "Find relevant legal cases using AI search"
  };

  console.log('🚀 AI Search Simplified Payload:', JSON.stringify(payload, null, 2));

  try {
    // Use /Judgement/Search endpoint as per developer note
    const response = await fetch(`${this.baseURL}/Judgement/Search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `AI Search Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ AI Search Simplified Response:', result);
    return result;

  } catch (error) {
    console.error('❌ AI Search Simplified Error:', error);
    throw new Error(`AI Search failed: ${error.message}`);
  }
}

// Add this method to your existing ApiService class

// ================ JUDGMENT API ================
async getJudgementDetails(keycode, searchPayload = {}) {
  try {
    console.log('⚖️ Fetching judgment details for keycode:', keycode);
    console.log('📋 Search payload:', searchPayload);

    // Use the same payload structure as search API
    const payload = {
      requests: [
        {
          keycode: searchPayload.keycode || 0,
          query: searchPayload.query || "",
          subject: searchPayload.subject || "",
          fulltext: searchPayload.fulltext || "",
          headnote: searchPayload.headnote || "",
          judgement: searchPayload.judgement || "",
          headnoteAll: searchPayload.headnoteAll || "",
          judges: searchPayload.judges || "",
          appellant: searchPayload.appellant || "",
          respondent: searchPayload.respondent || "",
          caseNo: searchPayload.caseNo || "",
          citation: searchPayload.citation || "",
          advocate: searchPayload.advocate || "",
          issueForConsideration: searchPayload.issueForConsideration || "",
          lawPoint: searchPayload.lawPoint || "",
          held: searchPayload.held || "",
          backgroundFacts: searchPayload.backgroundFacts || "",
          partiesContentions: searchPayload.partiesContentions || "",
          disposition: searchPayload.disposition || "",
          favour: searchPayload.favour || "",
          yearFrom: searchPayload.yearFrom || 0,
          yearTo: searchPayload.yearTo || 0,
          result: searchPayload.result || "",
          casesReferred: searchPayload.casesReferred || "",
          isState: searchPayload.isState !== undefined ? searchPayload.isState : true,
          acts: searchPayload.acts || [],
          sections: searchPayload.sections || [],
          mainkeys: searchPayload.mainkeys || [],
          years: searchPayload.years || [],
          queryVector: searchPayload.queryVector || [],
          isAi: searchPayload.isAi || false
        }
      ],
      sortBy: searchPayload.sortBy || "relevance",
      sortOrder: searchPayload.sortOrder || "desc",
      page: searchPayload.page || 0,
      pageSize: searchPayload.pageSize || 1,
      inst: searchPayload.inst || "",
      prompt: searchPayload.prompt || ""
    };

    const response = await fetch(`${this.baseURL}/Judgement/GetJudgement/${keycode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch judgment: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Judgment details retrieved successfully');
    return result;

  } catch (error) {
    console.error('❌ Get judgment failed:', error);
    throw error;
  }
}
// Add this method to your ApiService class in apiService.js

// ================ AI CHAT SEARCH - MAIN METHOD ================
async searchJudgementsWithAI(userQuery, embeddingVector, options = {}) {
  const searchType = options.searchType || 'chat';
  
  if (searchType === 'chat') {
    return this.searchWithAI_Chat(userQuery, embeddingVector, options);
  } else {
    return this.searchWithAI_Advanced(userQuery, embeddingVector, options);
  }
}

// Make sure you also have the searchWithAI_Chat method:
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
    page: options.page || 1,  // Use 0-based pagination for SearchWithAI
    pageSize: options.pageSize || 5,
    inst: options.inst || "",
    prompt: options.prompt || "Find relevant legal cases"
  };

  console.log('🚀 AI Chat Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${this.baseURL}/Judgement/SearchWithAI`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `AI Chat Search Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ AI Chat Search Response:', result);
    return result;

  } catch (error) {
    console.error('❌ AI Chat Search Error:', error);
    throw new Error(`AI Chat Search failed: ${error.message}`);
  }
}

  // ================ DYNAMIC PAYLOAD SYSTEM ================
  createSearchPayload(searchType, formData) {
    const basePayload = {
      timestamp: new Date().toISOString(),
      searchType: searchType
    };

    switch (searchType) {
      case 'basic':
        return {
          ...basePayload,
          query: formData.query,
          filters: {
            dateRange: formData.dateRange,
            jurisdiction: formData.jurisdiction,
            courtType: formData.courtType
          }
        };

      case 'advanced':
        return {
          ...basePayload,
          allWords: formData.allWords,
          exactPhrase: formData.exactPhrase,
          anyWords: formData.anyWords,
          noneWords: formData.noneWords,
          filters: {
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            jurisdiction: formData.jurisdiction,
            courtType: formData.courtType,
            judgeNames: formData.judgeNames,
            caseType: formData.caseType
          }
        };

      case 'citation':
        return {
          ...basePayload,
          citationType: formData.citationType,
          year: formData.year,
          volume: formData.volume,
          page: formData.page,
          partyNames: formData.partyNames,
          neutralCitation: formData.neutralCitation
        };

      case 'ai':
        return {
          ...basePayload,
          naturalQuery: formData.query,
          context: formData.context,
          responseType: formData.responseType || 'comprehensive'
        };

      default:
        return {
          ...basePayload,
          query: formData.query || formData
        };
    }
  }
// Add this method to apiService.js

// ================ CITATION SEARCH API (NO EMBEDDINGS) ================
// Add this method to your ApiService class in apiService.js

// ================ CITATION SEARCH API (NO EMBEDDINGS) ================
// ================ CITATION SEARCH API (NO EMBEDDINGS) ================
async searchCitations(citationData) {
  console.log('📖 Citation Search - Passing Individual Fields');
  console.log('Citation Data:', citationData);

  // Create payload with individual citation fields as separate parameters
  const payload = {
    requests: [
      {
        // Basic search query (can be empty for citation search)
        query: "",
        
        // CITATION-SPECIFIC FIELDS - Pass as individual parameters
        journal: citationData.journal || "",           // [Journal name]
        year: citationData.year || "",                 // [Year] 
        volume: citationData.volume || "",             // [Volume]
        page: citationData.page || "",                 // [Page number]
        court: citationData.court || "",               // [Court]
        
        // Citation field (can also include formatted citation)
        citation: citationData.citation || `${citationData.journal || ''} ${citationData.year || ''} ${citationData.volume || ''} ${citationData.page || ''}`.trim(),
        
        // Standard fields (empty for citation search)
        keycode: 0,
        subject: "",
        fulltext: "",
        headnote: "",
        judgement: "",
        headnoteAll: "",
        judges: "",
        appellant: "",
        respondent: "",
        caseNo: "",
        advocate: "",
        issueForConsideration: "",
        lawPoint: "",
        held: "",
        backgroundFacts: "",
        partiesContentions: "",
        disposition: "",
        favour: "",
        yearFrom: citationData.year ? parseInt(citationData.year) : 0,
        yearTo: citationData.year ? parseInt(citationData.year) : 0,
        result: "",
        casesReferred: "",
        isState: false,
        acts: [],
        sections: [],
        mainkeys: [],
        years: citationData.year ? [citationData.year] : [],
        
        // NO queryVector for citation search (no embeddings)
        queryVector: [],
        isAi: false
      }
    ],
    sortBy: "relevance",
    sortOrder: "desc", 
    page: 1,
    pageSize: 25,
    inst: "",
    prompt: "Citation search by journal, year, volume, and page"
  };

  console.log('🚀 Citation Search Payload with Individual Fields:');
  console.log('📋 Journal:', citationData.journal);
  console.log('📋 Year:', citationData.year);
  console.log('📋 Volume:', citationData.volume);
  console.log('📋 Page:', citationData.page);
  console.log('📋 Court:', citationData.court);
  console.log('📋 Full Payload:', JSON.stringify(payload, null, 2));

  try {
    // Use /Judgement/Search endpoint for citation search
    const response = await fetch(`${this.baseURL}/Judgement/Search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAccessToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Citation Search Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Citation Search Response:', result);
    return result;

  } catch (error) {
    console.error('❌ Citation Search Error:', error);
    throw new Error(`Citation search failed: ${error.message}`);
  }
}
}

// Create singleton instance
const apiServiceInstance = new ApiService();

// Export both the class and the singleton instance
export { ApiService };
export default apiServiceInstance;