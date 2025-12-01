// src/pages/AIChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ApiService from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Menu, Plus, X } from "lucide-react";// Added Menu and X
import { marked } from "marked";
import DOMPurify from "dompurify";
import mammoth from "mammoth";

// PDF.js (Vite-friendly)
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

var isGJ = false;
const AIChat = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState('Deep');
  const [searchType, setSearchType] = useState('Continue');
  const [chatHistory, setChatHistory] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);

  // NEW: Sidebar toggle state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [recognition, setRecognition] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("ALL");
  const [chatsessionId, setChatsessionId] = useState(null);
  const [chatsessionsList, setChatsessionsList] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [openShareMenuId, setopenShareMenuId] = useState(false);
  const menuRefs = useRef({});
  const [CurrentQuery, setCurrentQuery] = useState("Which legal task can we help you accelerate?");
  const [pageSearch, setPageSearch] = useState(1);
  const [pageSizeSearch, setPageSizeSearch] = useState(15);
  const [chatType, setChatType] = useState('AISearch');
  const [research, setResearch] = useState(null);
  const dropdownRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAllIndex, setCopiedAllIndex] = useState(null);
  const [textOutput, setTextOutput] = useState("");

  // NEW: Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const deleteAllChat = async () => {
    await ApiService.deleteAllChatSessions();
    await loadChatHistory();
    setChatType('AISearch');
    setUserMessage('');
    setChatHistory([]);
    setChatsessionId(null);
    setCurrentQuery("");
  };

  useEffect(() => {
    if (research && userMessage) {
      setMessage(userMessage.trim().replace(/,$/, ""));
      setUserMessage('');
      setCurrentQuery('');
    }
  }, [research]);

  // NEW: Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.ai-chat-sidebar');
        const hamburger = document.querySelector('.hamburger-btn');

        if (sidebar && !sidebar.contains(event.target) &&
          hamburger && !hamburger.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false); // Close dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const onUploadFile = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const file = files[0];
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    setChatHistory([{
      type: 'user',
      text: file.name,
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    }]);
    try {
      let text = "";

      if (ext === "txt") {
        text = await file.text();
      } else if (ext === "pdf") {
        text = await extractPdfText(file);
      } else if (ext === "docx" || ext === "doc") {
        text = await extractDocxText(file);
      } else {
        alert("Unsupported file type!");
        return;
      }

      setTextOutput(text);

      setChatsessionId(null);
      setCurrentQuery("");
      setCurrentQuery(file.name);
      setChatType('Summarizer');
      setMessage('Summarize this case');
      handleSendAIMessage("Summarize this case", text, file.name, 'Summarizer');

    } catch (err) {
      console.error("File processing error:", err);
      alert("Failed to read file.");
    } finally {
      setIsUploading(false);
    }
  };

  const extractPdfText = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = async function () {
        const data = new Uint8Array(this.result);
        const pdf = await getDocument({ data }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((x) => x.str).join(" ") + "\n";
        }

        resolve(text);
      };

      reader.readAsArrayBuffer(file);
    });

  const extractDocxText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (evt) => {
        const arrayBuffer = evt.target.result;

        mammoth
          .extractRawText({ arrayBuffer })
          .then((result) => resolve(result.value))
          .catch((err) => reject(err));
      };

      reader.readAsArrayBuffer(file);
    });

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const toggleShareMenu = () => {
    setopenShareMenuId(true);
  };

  const handleDelete = async (id) => {
    await ApiService.deleteChatHistoryBySessionId(id);
    await loadChatHistory();
    setOpenMenuId(null);
  };

  const handleShare = async (id) => {
    alert(`chat ${id}`);
    setopenShareMenuId(false);
  };

  const handlePrint = async (id, isPined) => {
    await ApiService.updatePinedChatSessions(id, isPined);
    await loadChatHistory();
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId != null) {
        const ref = menuRefs.current[openMenuId];
        if (ref && !ref.contains(e.target)) {
          setOpenMenuId(null);
        }
      }
      setopenShareMenuId(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    const domain = window.location.hostname;

    if (domain.includes("gojuris.ai")) {
      isGJ = true;
    }
    document.body.style.paddingTop = '0';
    loadUserProfile();
    loadChatHistory();
    const data = localStorage.getItem('userp')
    if (data) {
      setCourts(JSON.parse(data)?.courts);
    }
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const loadUserProfile = async () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        const profile = await ApiService.getUserProfile();
        setUserProfile(JSON.parse(profile));
      }
      else
        setUserProfile(JSON.parse(storedUserData));
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const list = await ApiService.getChatHistorySessions();
      setChatsessionsList(list.data);
    } catch (error) {
      console.error('❌ Failed to load user profile:', error);
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking again.');
        } else {
          setError('Speech recognition error. Please try again.');
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser. Please try Chrome, Safari, or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setError('');
      recognition.start();
    }
  };

  const quickQuestions = [
    "Whether Right to travel abroad is a fundamental right?",
    "Whether anticipatory bail is maintainable in ndps cases?",
    "Cases on CPC, Order 9 Rule 7"
  ];

  const draftExample = [
    "Draft a legal notice under Section 138 NI Act for cheque dishonour",
    "Draft a divorce petition under Section 13 HMA based on cruelty",
    "Draft a plaint for declaration and cancellation of sale deed"
  ];
  const helpExample = [
    "What is the difference between bailable and non-bailable offences under CrPC?",
    "At what stage can an accused apply for anticipatory bail?",
    "What are the ingredients of Section 420 IPC?"
  ];

  function handleClick(e) {
    const q = e.target.closest(".question-item");
    if (q) {
      const text = q.innerText
      // Call your React function
      setCurrentQuery("");
      //setMessage(text.replaceAll('\n', ''));
      setUserMessage(text.replaceAll('\n', ''));
      setResearch(text);
    }
  }

  const handleInputChange = (field, value) => {
    if (field == "ChatMode")
      setSearchMode(value);
    else if (field == "SearchType")
      setSearchType(value);
    setResearch(value);
  };

  const getUserInitials = () => {
    if (!userProfile) return 'U';

    const displayName = userProfile.displayName || userProfile.name || userProfile.username;
    if (displayName && displayName.length > 0) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }

    return userProfile.email ? userProfile.email[0].toUpperCase() : 'U';
  };

  const loadChatdata = async (sessionId, id, type) => {
    const list = await ApiService.getChatHistoryBySessionId(sessionId);
    setChatsessionId({ id: id, sessionId: sessionId });
    setChatHistory([]);
    setChatType(type);
    const resultsData = {
      results: [],
      totalCount: 1,
      query: list.data.messages[0].content,
      searchType: 'AI Search',
      timestamp: new Date().toISOString(),
      courtsList: [],
      yearList: [],
      searchData: {
        query: list.data.messages[0].content
      }
    };
    localStorage.setItem('searchResults', JSON.stringify(resultsData));

    list.data.messages.forEach((item, index) => {
      setChatHistory(prev => [
        ...prev,
        {
          type: item.role,
          metadata: {
            isApiResponse: true
          },
          text: item.role == 'ai' ? marked.parse(item.content, { breaks: true }).replaceAll("<a ", "<a target='_blank' ").replaceAll(':::question', "<span class='question-item'>")
            .replaceAll(':::', '</span>') : item.content,
          timestamp: item.timestamp
        }
      ]);
    });

    // NEW: Close sidebar on mobile after loading chat
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (e) => {

    if (e)
      e.preventDefault();

    let newPageSearch = pageSearch;
    let newPageSize = pageSizeSearch;
    if (e && e?.type === "click") {
      setUserMessage(userMessage);
      newPageSearch = pageSearch === 1 ? 4 : pageSearch + 1;
      newPageSize = 5;
    } else {
      newPageSearch = 1;
      newPageSize = 15;
    }

    setPageSearch(newPageSearch);
    setPageSizeSearch(newPageSize);

    if (e && newPageSearch == 1 && (!message.trim() || isLoading)) return;
    if (chatType != "AISearch")
      setUserMessage('');
    else if (userMessage == "" || searchType == "New") {
      if (e)
        setUserMessage(message + ", ");
    }
    else
      setUserMessage(userMessage + message + ", ");
    setCurrentQuery(message);
    setMessage('');
    setIsLoading(true);
    setError('');

    setChatHistory(prev => [...prev, {
      type: 'user',
      text: e ? message : userMessage.replace(", ,", ''),
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    }]);

    const aiMessageIndex = Date.now();
    setChatHistory(prev => [...prev, {
      type: 'ai',
      text: '',
      isStreaming: true,
      id: aiMessageIndex,
      timestamp: new Date().toLocaleTimeString()
    }]);

    try {
      console.log('🧠 Generating AI embedding for:', userMessage);
      const finalQuery = searchType == "New" ? message : userMessage + message;
      var sessionIdchat;
      if (!chatsessionId) {
        const sessionData = await ApiService.craeteNewSession(message, chatType);
        setChatsessionId(sessionData?.data);
        sessionIdchat = sessionData?.data?.id;
      }
      else {
        sessionIdchat = chatsessionId?.id;
      }

      const embeddingData = chatType === "AISearch" ? await ApiService.generateEmbedding(finalQuery) : [];

      if (!embeddingData) {
        throw new Error('Failed to generate embedding');
      }

      const embeddingVector = embeddingData.embedding || embeddingData.vector || embeddingData.data || [];

      if (!Array.isArray(embeddingVector)) {
        throw new Error('Invalid embedding format received');
      }

      console.log(`✅ Embedding generated: ${embeddingVector.length} dimensions`);

      let streamedText = '';
      let hasError = false;
      let accumulatedText = "";
      const resultsData = {
        results: [],
        totalCount: 1,
        query: finalQuery,
        searchType: 'AI Search',
        timestamp: new Date().toISOString(),
        courtsList: [],
        yearList: [],
        searchData: {
          query: finalQuery
        }
      };

      console.log('💾 Storing results with API data:', resultsData);
      localStorage.setItem('searchResults', JSON.stringify(resultsData));

      await ApiService.streamAIChat(
        userMessage + message,
        [selectedCourt],
        embeddingVector,
        {
          searchType: 'chat',
          pageSize: newPageSize,
          page: newPageSearch,
          sortBy: "relevance",
          sortOrder: "desc",
          prompt: searchMode,
          inst: e ? message : userMessage.replace(", ,", ''),
          sessionId: sessionIdchat
        },
        chatType,
        '',
        (chunkText) => {
          if (!chunkText) return;
          if (accumulatedText.length > 0) {
            const lastChar = accumulatedText.slice(-1);
            const firstChar = chunkText.charAt(0);
            if (!lastChar.match(/\s/) && !firstChar.match(/[\s\.,;<>1234567890?/\\#*!?\n\r]/)) {
            }
          }
          accumulatedText += chunkText;

          const rawHtml = marked.parse(accumulatedText, { breaks: true });
          const cleanHtml = DOMPurify.sanitize(rawHtml);

          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: cleanHtml.replaceAll("<a ", "<a target='_blank' ")
                  .replaceAll(':::question', "<span class='question-item'>")
                  .replaceAll(':::', '</span>'),
                isStreaming: true
              }
              : msg
          ));
        },
        (error) => {
          console.error('❌ Stream error:', error);
          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: accumulatedText || 'Sorry, an error occurred while processing your request.',
                isStreaming: false,
                isError: true
              }
              : msg
          ));
        },
        () => {
          const finalHtml = DOMPurify.sanitize(
            marked.parse(accumulatedText || 'No response received.', { breaks: true })
          );

          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: finalHtml.replaceAll("<a ", "<a target='_blank' ")
                  .replaceAll(':::question', "<span class='question-item'>")
                  .replaceAll(':::', '</span>'),
                isStreaming: false,
                metadata: {
                  embeddingGenerated: true,
                  vectorLength: embeddingVector?.length || 0,
                  isApiResponse: true,
                  searchType: 'AI Chat (Streaming)',
                  searchQuery: userMessage
                }
              }
              : msg
          ));
        }
      );

      loadChatHistory();

    } catch (generalError) {
      console.error('❌ General Error:', generalError);

      setChatHistory(prev => prev.map(msg =>
        msg.id === aiMessageIndex
          ? {
            ...msg,
            text: `I encountered an error: ${generalError.message}. Please try again.`,
            isStreaming: false,
            isError: true
          }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = () => {
    if (!userProfile) return 'Loading...';

    return userProfile.displayName ||
      userProfile.name ||
      userProfile.username ||
      (userProfile.email ? userProfile.email.split('@')[0] : 'Legal User');
  };

  const handleSendAIMessage = async (Umessage, text, fileName, type) => {
    if ((!Umessage.trim() || isLoading)) return;
    if (chatType != "AISearch")
      setUserMessage('');

    setUserMessage(Umessage + ", ");
    setCurrentQuery(Umessage);
    setMessage('');
    setIsLoading(true);
    setError('');

    setChatHistory(prev => [...prev, {
      type: 'user',
      text: Umessage,
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString()
    }]);

    let accumulatedText = "";
    const aiMessageIndex = Date.now();
    setChatHistory(prev => [...prev, {
      type: 'ai',
      text: '',
      isStreaming: true,
      id: aiMessageIndex,
      timestamp: new Date().toLocaleTimeString()
    }]);

    var sessionIdchat;
    if (!chatsessionId) {
      const sessionData = await ApiService.craeteNewSession(fileName, type);
      setChatsessionId(sessionData?.data);
      sessionIdchat = sessionData?.data?.id;
    }
    else {
      sessionIdchat = chatsessionId?.id;
    }

    try {
      await ApiService.streamAIChat(
        Umessage,
        [selectedCourt],
        [],
        {
          sessionId: sessionIdchat
        },
        type,
        text,
        (chunkText) => {
          if (!chunkText) return;
          if (accumulatedText.length > 0) {
            const lastChar = accumulatedText.slice(-1);
            const firstChar = chunkText.charAt(0);
            if (!lastChar.match(/\s/) && !firstChar.match(/[\s\.,;<>1234567890?/\\#*!?\n\r]/)) {
            }
          }
          accumulatedText += chunkText;

          const rawHtml = marked.parse(accumulatedText, { breaks: true });
          const cleanHtml = DOMPurify.sanitize(rawHtml);

          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: cleanHtml.replaceAll("<a ", "<a target='_blank' ")
                  .replaceAll(':::question', "<span class='question-item'>")
                  .replaceAll(':::', '</span>'),
                isStreaming: true
              }
              : msg
          ));
        },
        (error) => {
          console.error('❌ Stream error:', error);
          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: accumulatedText || 'Sorry, an error occurred while processing your request.',
                isStreaming: false,
                isError: true
              }
              : msg
          ));
        },
        () => {
          const finalHtml = DOMPurify.sanitize(
            marked.parse(accumulatedText || 'No response received.', { breaks: true })
          );

          setChatHistory(prev => prev.map(msg =>
            msg.id === aiMessageIndex
              ? {
                ...msg,
                text: finalHtml.replaceAll("<a ", "<a target='_blank' "),
                isStreaming: false,
                metadata: {
                  embeddingGenerated: true,
                  vectorLength: 0,
                  isApiResponse: true,
                  searchType: 'AI Chat (Streaming)',
                  searchQuery: Umessage
                }
              }
              : msg
          ));
        }
      );
      loadChatHistory();
    } catch (generalError) {
      console.error('❌ General Error:', generalError);

      setChatHistory(prev => prev.map(msg =>
        msg.id === aiMessageIndex
          ? {
            ...msg,
            text: `I encountered an error: ${generalError.message}. Please try again.`,
            isStreaming: false,
            isError: true
          }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const processSearchResults = (searchResults, userMessage) => {
    if (!searchResults) {
      return 'No response received from the legal database.';
    }

    if (searchResults.response && typeof searchResults.response === 'string') {
      return searchResults.response;
    }

    if (searchResults.message && typeof searchResults.message === 'string') {
      return searchResults.message;
    }

    if (searchResults.summary && typeof searchResults.summary === 'string') {
      return searchResults.summary;
    }

    if (searchResults.results && Array.isArray(searchResults.results)) {
      const results = searchResults.results;
      if (results.length > 0) {
        return formatSearchResults(results, userMessage);
      } else {
        return `I searched for "${userMessage}" but couldn't find specific matching legal cases. Could you try with more specific legal terms or case names?`;
      }
    }

    return `I received a response but couldn't parse it properly. Please try rephrasing your question.\n\nDebug info: ${JSON.stringify(searchResults, null, 2).substring(0, 500)}...`;
  };

  const formatSearchResults = (results, query) => {
    if (!Array.isArray(results) || results.length === 0) {
      return 'No legal cases found for your query.';
    }

    let formatted = `Found ${results.length} legal cases for "${query}":\n\n`;

    results.slice(0, 5).forEach((result, index) => {
      formatted += `${index + 1}. `;

      if (result.title || result.caseName || result.judgementTitle) {
        formatted += `${result.title || result.caseName || result.judgementTitle}\n`;
      }

      if (result.court) {
        formatted += `   Court: ${result.court}\n`;
      }

      if (result.date || result.year) {
        formatted += `   Date: ${result.date || result.year}\n`;
      }

      if (result.summary || result.content || result.headnote) {
        const summary = result.summary || result.content || result.headnote;
        formatted += `   Summary: ${summary.substring(0, 200)}...\n`;
      }

      formatted += '\n';
    });

    if (results.length > 5) {
      formatted += `... and ${results.length - 5} more cases found.\n`;
    }

    return formatted;
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };
  const copyMessage = async (htmlText, index) => {
    const temp = document.createElement("div");
    temp.innerHTML = htmlText;
    const plainText = temp.innerText;
    setCopiedIndex(index); // show "Copied!"
    setTimeout(() => setCopiedIndex(null), 1500); // back to "Copy"
    //navigator.clipboard.writeText(plainText);

    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([htmlText], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      })
    ]);
  };
  const copyAllMessage = async (index) => {
    const allHtml = chatHistory
      .map((m) => {
        // If AI message → style it
        if (m.type != "ai") {
          return `
          <div style="
            text-align: right;
            color: blue;
            margin: 6px 0;
          ">
            ${m.text}
          </div>
        `;
        }

        // Normal message
        return `
        <div style="margin: 6px 0;">
          ${m.text}
        </div>
      `;
      })
      .join("<br/><br/>");   // optional spacing

    const temp = document.createElement("div");
    temp.innerHTML = allHtml;
    const plainText = temp.innerText;

    setCopiedAllIndex(index); // show "Copied!"
    setTimeout(() => setCopiedAllIndex(null), 1500); // back to "Copy"
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([allHtml], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }),
      })
    ]);
  };
  const printAllMessage = async (index) => {
    const allHtml = chatHistory
      .map((m) => {
        // If AI message → style it
        if (m.type != "ai") {
          return `
          <div style="
            text-align: right;
            color: blue;
            margin: 6px 0;
          ">
            ${m.text}
          </div>
        `;
        }

        // Normal message
        return `
        <div style="margin: 6px 0;">
          ${m.text}
        </div>
      `;
      })
      .join("<br/><br/>");   // optional spacing

    const printContent = `
            <html>
              <head>
                <title></title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h1 { color: #8b5cf6; }
                  .meta { color: #666; margin: 10px 0; }
                </style>
              </head>
              <body>
                ${allHtml}
                </div>
              </body>
            </html>
          `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onafterprint = () => {
      printWindow.close();
    };

    printWindow.print();
  };
  const handleSignOut = () => {
    setShowAccountDropdown(false);
    ApiService.clearTokensAndRedirect();
  };

  return (
    <div className="ai-chat-layout-with-nav">
      <Sidebar />

      {/* NEW: Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat Sidebar - NEW: Added dynamic class */}
      <div className={`ai-chat-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-section">
            <button className="new-chat-btn" onClick={() => {
              setChatHistory([]);
              setChatsessionId(null);
              setCurrentQuery("");
              setUserMessage("");
              // NEW: Close sidebar on mobile when starting new chat
              if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
              }
            }}>
              <i className="bx bx-plus"></i>
              New Chat
            </button>
          </div>

          <div className="sidebar-section">
            <div className="section-title">History
              <button
                className="deleteAll-btn"
                onClick={() => {

                  if (window.confirm("Are you sure you want to delete all chat history?")) {
                    deleteAllChat();
                  }
                }}

              >
                Delete All
              </button>
            </div>

            {chatsessionsList?.length > 0 ? (
              chatsessionsList.map((result) => (
                <div key={result.id} className="chat-item">
                  <span
                    className="chat-title"
                    title={result.subject}
                    onClick={() => loadChatdata(result.sessionId, result.id, result.type)}
                  >
                    {result.subject}
                  </span>

                  <div
                    className="menu-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(result.sessionId);
                    }}
                  >
                    <MoreVertical size={18} />
                  </div>

                  {openMenuId === result.sessionId && (
                    <ul
                      className="dropdown-menu dropdown-menu-end show position-absolute bg-white border shadow"
                      style={{
                        minWidth: '100px',
                        top: '100%',
                        right: '50',
                        zIndex: 9999,
                        pointerEvents: 'auto'
                      }}
                      ref={(el) => (menuRefs.current[result.sessionId] = el)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <li onClick={() => {
                        if (window.confirm("Are you sure you want to delete this chat?")) {
                          handleDelete(result.sessionId);
                        }
                      }}>🗑️ Delete</li>
                      <li onClick={() => handlePrint(result.sessionId, !result.isPined)}>📌 {result.isPined ? 'UnPin' : 'Pin'}</li>
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="history-placeholder">
                <i className="bx bx-history"></i>
                <span>No previous chats</span>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-item">
            <i className="bx bx-cog"></i>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="ai-chat-main">
        <div className="chat-header">
          {/* NEW: Hamburger Menu Button */}
          <button
            className="hamburger-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Plus size={24} />}
          </button>
          <div className="sidebar-header">
            <Link to="/dashboard" className="gojuris-logo">
              <img
                src={isGJ ? "/logo.png" : "/logoLe.png"}
                alt="GoJuris Logo"
                style={{ height: '60px', width: 'auto' }}
              />
            </Link>
          </div>
          <label style={{ fontSize: "15px" }}>
            Welcome : {getDisplayName()}
          </label>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-link p-0"
              type="button"
              onClick={() => navigate('/Latest-Law')}
              style={{ border: 'none', background: 'transparent' }}
              title="Latest Law"
            >
              <img
                src="/Images/Latest-Law.png"
                alt="Latest Law"
                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
              />
            </button>
            <button
              className="btn btn-link p-0"
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{ border: 'none', background: 'transparent' }}
              title="Dashboard"
            >
              <img
                src="/Images/home.png"
                alt="Dashboard"
                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
              />
            </button>

            <button
              className="btn btn-link p-0"
              type="button"
              onClick={() => setShowBookmarksModal(true)}
              style={{ border: 'none', background: 'transparent' }}
              title="Bookmarks"
            >
              <img
                src="/bookmark.png"
                alt="Bookmarks"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            </button>

            <button
              className="btn btn-outline-secondary btn-sm rounded-circle p-2"
              type="button"
              onClick={() => setShowSettingsModal(true)}
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bx bx-cog"></i>
            </button>

            <div className="dropdown">
              <button
                className="btn btn-primary d-flex align-items-center gap-2 px-3"
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                <i className="bx bx-user"></i>
                <span>My Account</span>
                <i className="bx bx-chevron-down"></i>
              </button>

              {showAccountDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" ref={dropdownRef} style={{ minWidth: '220px' }}>
                  <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold flex-shrink-0"
                        style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {getUserInitials()}
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {userProfile?.displayName || userProfile?.name || 'Legal User'}
                        </div>
                        <small className="text-muted">
                          {userProfile?.email || 'user@gojuris.com'}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>

                  <a className="dropdown-item" href="#">
                    <i className="bx bx-user-circle me-2"></i>View Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-credit-card me-2"></i>Billing & Plans
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-history me-2"></i>Search History
                  </a>
                  <div className="dropdown-divider" ></div>

                  <button className="dropdown-item text-danger" onClick={() => handleSignOut()}>
                    <i className="bx bx-log-out me-2"></i>Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="chat-content">
          <div className="chat-tagline-container">
            <h2 className="chat-tagline">{CurrentQuery}</h2>
          </div>
          <div className="chat-messages">
            {chatHistory.length === 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "16px",
                    justifyContent: "flex-start",
                    flexWrap: "nowrap",
                    overflowX: "auto"
                  }}
                >
                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('AISearch');
                    }}
                    className={chatType === 'AISearch' ? 'active-button' : 'unactive-button'}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#8B5CF6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                    }}
                    title='Ask anything—get instant case laws, sections, and legal answers.'
                  >
                    <i className="bx bx-chat" style={{ fontSize: "20px" }}></i>
                    <span>Ask for Case Law</span>
                  </button>

                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('Draft');
                    }}
                    className={chatType === 'Draft' ? 'active-button' : 'unactive-button'}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#8B5CF6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                    }}
                    title='Create ready-to-file legal drafts from a single command.'
                  >
                    <i className="bx bx-envelope" style={{ fontSize: "20px" }}></i>
                    <span>Generate a Draft</span>
                  </button>

                  <label htmlFor="fileUpload"
                    style={{
                      padding: "12px 20px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "transparent",
                      color: "#6b7280",
                      border: "1px solid #d1d5db",
                      fontWeight: "400",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#8B5CF6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                    }}
                    title='Upload a case file and get instant AI-generated summary, issues, ratio, and headnotes.'
                  >
                    <i className="bx bx-receipt" style={{ fontSize: "20px" }}></i>
                    {isUploading ? (
                      <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                        ⏳ Uploading...
                      </div>
                    ) : (<span>Summarize/Analyze a Case</span>)}
                  </label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={onUploadFile}
                    id="fileUpload"
                    accept=".pdf,.txt,.docx,.doc"
                  />

                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('AIHelp');
                    }}
                    className={chatType === 'AIHelp' ? 'active-button' : 'unactive-button'}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#8B5CF6";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#d1d5db";
                    }}
                    title='Ask anything—get instant case laws, sections, and legal answers.'
                  >
                    <i className="bx bx-chat" style={{ fontSize: "20px" }}></i>
                    <span>Ask for Legal Help</span>
                  </button>
                </div>

                {showComingSoonModal && (
                  <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={() => setShowComingSoonModal(false)}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="modal-content" style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                      }}>
                        <div className="modal-header border-0">
                          <h5 className="modal-title" style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#1a1a1a'
                          }}>
                            Coming Soon
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowComingSoonModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body text-center py-4">
                          <div style={{
                            fontSize: '48px',
                            color: '#7C3AED',
                            marginBottom: '16px'
                          }}>
                            <i className="bx bx-time-five"></i>
                          </div>
                          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '0' }}>
                            This feature is currently under development and will be available soon!
                          </p>
                        </div>
                        <div className="modal-footer border-0">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => setShowComingSoonModal(false)}
                            style={{
                              borderRadius: '8px',
                              background: '#7C3AED',
                              border: 'none',
                              padding: '10px'
                            }}
                          >
                            Got it!
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="message-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message ${msg.type} ${msg.isError ? 'error' : ''}`}>
                    <div className="message-avatar">
                      <i className={`bx ${msg.type === 'user' ? 'bx-user' : 'bx-bot'}`}></i>
                    </div>
                    <div className="message-content">
                      {msg.type === 'ai' && (msg.metadata?.isApiResponse || msg.isStreaming) ? (
                        <div
                          className="api-response-content"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            fontSize: '17px',
                            lineHeight: '1.6',
                            color: '#000'
                          }}
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                          onClick={handleClick}
                        />
                      ) : (
                        <pre style={{
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          fontFamily: 'inherit',
                          margin: 0,
                          lineHeight: '1.6',
                          color: '#8B5CF6',
                          fontWeight: 'bold'
                        }}>
                          {msg.text}
                        </pre>
                      )}

                      {msg.isStreaming && msg.type === 'ai' && (
                        <div className="typing-indicator" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginTop: '8px',
                          color: '#8B5CF6'
                        }}>
                          Loading <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      )}
                      {!isLoading && msg.type === 'ai' && (
                        <div className="message-action">
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              right: "10px",
                              top: "10px",
                              fontSize: "12px",
                              alignItems: "center"
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#6c757d"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent"
                            }}
                            onClick={() => copyMessage(msg.text, index)}
                          >
                            <i className="bx bx-copy" style={{ fontSize: "20px" }}></i> {copiedIndex === index ? "Copied!" : "Copy"}
                          </button>
                          {index === (chatHistory.length - 1) && (
                            <>
                              <button
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  right: "10px",
                                  top: "10px",
                                  fontSize: "12px",
                                  alignItems: "center"
                                }}

                                onClick={() => copyAllMessage(index)}
                              >
                                <i className="bx bx-copy" style={{ fontSize: "20px" }}></i> {copiedAllIndex === index ? "Copied!" : "Copy All"}
                              </button>

                              <button
                                style={{
                                  border: "none",
                                  background: "transparent",
                                  right: "10px",
                                  top: "10px",
                                  fontSize: "12px",
                                  alignItems: "center"
                                }}

                                onClick={() => printAllMessage(index)}
                              >
                                <i className="bx bx-print" style={{ fontSize: "20px" }}></i> Print
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="message ai"></div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {chatHistory.length === 0 && (
            <div className='exampleschat'>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "0px",
                textAlign: "left"
              }}>
                Examples
              </h3>

              <div className='examplesquestions' style={{
                display: "flex",
                flexDirection: "column",
                gap: "0px"
              }}>
                {(chatType === 'AISearch' ? quickQuestions : chatType === 'AIHelp' ? helpExample : draftExample).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: "0px 0",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#6b7280",
                      transition: "color 0.2s ease",
                      fontWeight: "400",
                      display: "flex",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#7C3AED";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6b7280";
                    }}
                  >
                    <span style={{ minWidth: "20px" }}>{index + 1}.</span>
                    <span>{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mx-3" role="alert">
              <i className="bx bx-error-circle me-2"></i>
              <strong>API Error:</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}
        </div>

        {chatType != 'Summarizer' ? (
          <div className="chat-input-section" >
            {chatType === 'AISearch' ? (
              <div style={{ borderColor: "#8b5cf6" }}>
                <div>
                  <div className="radio-options">
                    <label className='radlabel'
                      style={{
                        color: "#8b5cf6",
                        fontWeight: 'bold',
                        marginBottom: '5px',

                        alignSelf: "center"
                      }}>Answer Mode :</label>
                    <label className="radio-label">
                      <input
                        disabled={isLoading}
                        type="radio"
                        name="ChatMode"
                        value="Long"
                        checked={searchMode === 'Long'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                      />
                      <span className="radio-mark"></span>
                      Detailed
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="ChatMode"
                        value="Short"
                        disabled={isLoading}
                        checked={searchMode === 'Short'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                      />
                      <span className="radio-mark"></span>
                      Quick
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="ChatMode"
                        value="Deep"
                        disabled={isLoading}
                        checked={searchMode === 'Deep'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                      />
                      <span className="radio-mark"></span>
                      Deep
                    </label>
                    <select id="lstC" className="court-select"
                      value={selectedCourt}
                      disabled={isLoading}
                      onChange={(e) => {
                        setSelectedCourt(e.target.value);
                        setResearch(e.target.value);
                      }}>
                      {courts.map((court) => (
                        <option key={court.key} value={court.key}>
                          {court.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{

                  }} className="d-flex loadmore">
                    {openShareMenuId === true && (
                      <ul
                        className="dropdown-menu dropdown-menu-end show position-absolute bg-white border shadow"
                        style={{
                          minWidth: '100px',
                          top: '0%',
                          right: '100px',
                          zIndex: 9999,
                          pointerEvents: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li onClick={() => handleShare("Share")}>🔗 Share</li>
                        <li onClick={() => handleShare("Print")}>🖨️ Print</li>
                        <li onClick={() => handleShare("PDF")}>📄 PDF</li>
                      </ul>
                    )}
                    <button
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "var(--gj-primary)",
                        color: "white",
                        border: "none",
                        fontWeight: "500",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                        marginBottom: "5px",
                        marginLeft: "10px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#6D28D9";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#7C3AED";
                      }}
                      onClick={handleSendMessage}
                      disabled={isLoading || chatHistory.length < 1}
                    >
                      <i className="bx bx-chat" style={{ fontSize: "20px" }}></i>
                      <span>Load More Results</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (<></>)}

            <form onSubmit={handleSendMessage} className="chat-form">
              <div className="chat-input-wrapper">
                <textarea
                  rows="2"
                  className="chat-input"
                  width={"100vw"}
                  placeholder={chatType === 'AISearch' ? "Ask your legal question here..." : chatType === 'AIHelp' ? 'Ask any law-related question.' : "Describe your issue to generate a legal draft instantly"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                />

                <div className="input-buttons">
                  <button
                    type="button"
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    onClick={toggleVoiceRecognition}
                    disabled={isLoading}
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? (
                      <svg width="50" height="50" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      </svg>
                    ) : (
                      <svg width="50" height="50" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={isLoading || !message.trim()}
                  >
                    <i className="bx bx-send"></i>
                  </button>
                </div>
              </div>
            </form>

            {chatHistory.length > 0 && 1 == 2 && (
              <div className="radio-options">
                <label style={{
                  color: "#8b5cf6",
                  fontWeight: 'bold',
                  alignSelf: "center"
                }}>Search Options :</label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="SearchType"
                    value="Continue"
                    checked={searchType === 'Continue'}
                    onChange={(e) => handleInputChange("SearchType", e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  Proceed with Current Output
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="SearchType"
                    value="New"
                    checked={searchType === 'New'}
                    onChange={(e) => handleInputChange("SearchType", e.target.value)}
                  />
                  <span className="radio-mark"></span>
                  Search Entire Database
                </label>
              </div>
            )}
          </div>
        ) : (<></>)}

        <div className='paddingBottomDiv'></div>
      </div>

      {showSettingsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h4 className="modal-title mb-0">Settings</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSettingsModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-5">
                <i className="bx bx-time-five text-muted" style={{ fontSize: '4rem' }}></i>
                <h3 className="text-muted mb-3">Coming Soon</h3>
                <p className="text-muted">Advanced settings will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookmarksModal && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowBookmarksModal(false)}
          ></div>
          <div className="modal fade show d-block" style={{ zIndex: 9999 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '40px', height: '40px' }}>
                      <img
                        src="/bookmark.png"
                        alt="Bookmarks"
                        style={{ width: '20px', height: '20px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
                    <h4 className="modal-title mb-0">Bookmarks</h4>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowBookmarksModal(false)}
                  ></button>
                </div>
                <div className="modal-body text-center py-5">
                  <i className="bx bx-bookmark text-muted" style={{ fontSize: '4rem' }}></i>
                  <h3 className="text-muted mb-3">No Bookmarks Yet</h3>
                  <p className="text-muted">Save important cases and documents here for quick access later.</p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={() => setShowBookmarksModal(false)}
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .sidebar-section {
          padding-top: 10px;
          font-family: "Segoe UI", sans-serif;
        }
        .paddingBottomDiv {
        padding: 4px 30px;
        
        }

        .section-title {
          font-weight: 600;
          margin-bottom: 8px;
          margin-top: 8px;
          color: #444;
        }
        .unactive-button {
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          font-weight: 400;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .active-button {
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--gj-primary);
          color: white;
          border: none;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-bottom: 5px;
          margin-left: 10px;
        }

        .chat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 1px;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          transition: background-color 0.2s ease;
        }

        .chat-item:hover {
          background-color: #f3f4f6;
        }

          /* FIX: Dropdown z-index issue */
  .ai-chat-layout-with-nav .chat-header {
    position: relative;
    z-index: 1000;
  }

  .ai-chat-layout-with-nav .chat-header .dropdown {
    position: relative;
    z-index: 1001;
  }

  .ai-chat-layout-with-nav .chat-header .dropdown-menu {
    position: absolute;
    z-index: 1002 !important;
    top: 100%;
    right: 0;
    margin-top: 8px;
  }

  /* Ensure dropdown appears above everything */
  .dropdown-menu.show {
    z-index: 9999 !important;
  }

  /* Make sure the backdrop/overlay appears correctly */
  .position-fixed.top-0.start-0.w-100.h-100 {
    z-index: 9998 !important;
  }

        .chat-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #333;
          z-index: 1;
          transition: color 0.2s;
        }

        .chat-title:hover {
          color: #000;
        }

        .menu-icon {
          flex-shrink: 0;
          margin-left: 8px;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .menu-icon:hover {
          color: #000;
        }
        .deleteAll-btn
        {
          display: flex;
          align-items: center;
          gap: 0.375rem; /* Reduced from 0.5rem */
          padding: 0.625rem 1.5rem; /* Reduced from 0.875rem 2rem */
          border: none;
          border-radius: 6px; /* Reduced from 8px */
          font-size: 0.9rem; /* Reduced from 0.875rem */
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dropdown-menu {
          position: absolute;
          top: 32px;
          right: 0;
          width: 140px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          z-index: 100;
          padding: 4px 0;
          opacity: 0;
          transform: translateY(-5px);
          animation: fadeInMenu 0.15s ease-out forwards;
        }

        .dropdown-menu li {
          list-style: none;
          padding: 8px 12px;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .dropdown-menu li:hover {
          background-color: #f3f4f6;
        }

        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .history-placeholder {
          text-align: center;
          color: #888;
          padding: 16px 0;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        h3 {
          font-size: 1.4rem;
        }

        strong {
          font-size: 19px;
        }

        .truncate-text11 {
          display: inline-block;
          width: 85%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          padding-top: 7px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #8B5CF6;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .message.error .message-content {
          background-color: #fee2e2;
          border-left: 3px solid #ef4444;
          color: #b91c1c;
        }

        .quick-questions-single-line {
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .quick-questions-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .quick-questions-scroll::-webkit-scrollbar {
          display: none;
        }

        .chat-input-section1 {
          border-top: 1px solid #6c53ef;
        }

        .quick-question-btn-inline {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 20px;
          padding: 8px 16px;
          white-space: nowrap;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .quick-question-btn-inline:hover:not(:disabled) {
          border-color: #8B5CF6;
          color: #8B5CF6;
          background: #F8FAFC;
        }

        .quick-question-btn-inline:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }.chat-input-wrapper {
          position: relative;
          display: flex;
          align-items: top;
        }

        .chat-input {
          flex: 1;
          border: 2px solid #8b5cf6;
          border-radius: 25px;
          padding: 5px 5px 5px 5px;
          padding-right: 80px;
          font-size: 14px;
          outline: none;
        }

        .chat-input:focus {
          border-color: #8B5CF6;
        }

        .input-buttons {
          position: absolute;
          right: 8px;
          bottom:12px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

       .question-item {
        display: inline-block;
        color: #8B5CF6;               /* blue-600 */
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease, box-shadow 0.2s ease;
        font-weight: 500;
      }
      .question-item:hover {
        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
      }

        .checkbox-label,
        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: rgb(139, 92, 246);
          user-select: none;
          font-weight: 700;
        }

        .voice-btn, .send-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .voice-btn {
          color: #6B7280;
        }

        .voice-btn:hover:not(:disabled) {
          background-color: #F3F4F6;
          color: #8B5CF6;
        }

        .voice-btn.listening {
          color: #EF4444;
          animation: pulse 1.5s infinite;
        }

        .send-btn {
          background: #8B5CF6;
          color: white;
        }

        .send-btn:hover:not(:disabled) {
          background: #7C3AED;
        }

        .send-btn:disabled, .voice-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .alert .btn-close {
          padding: 0.25rem;
          font-size: 0.875rem;
        }

        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          margin: 0;
          text-align:right;
          font-size: 17px;
        }
    
        .court-select {
          padding: 6px 30px 6px 12px;
          border: 1px solid rgb(139, 92, 246);
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          color: rgb(139, 92, 246);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
        }

        .api-response-content p:first-child {
          margin-top: 0;
        }

        .api-response-content p:last-child {
          margin-bottom: 0;
        }

        .api-response-content a:hover {
          border-bottom: 1px solid #3498db;
        }

        .api-response-content ul ul {
          margin: 0.3em 0;
          padding-left: 1.2em;
        }

        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
  
        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #8B5CF6;
          animation: typing 1.4s infinite ease-in-out;
          animation-fill-mode: both;
        }
  
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        .typing-dot:nth-child(3) { animation-delay: 0s; }
  
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .voice-btn.listening {
          color: #EF4444 !important;
          background-color: rgba(239, 68, 68, 0.1) !important;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          70% { 
            transform: scale(1.05); 
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        .voice-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-btn.listening::after {
          content: '';
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #EF4444;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .chat-tagline-container {
          text-align: left;
          padding: .5rem 0.5rem .5rem 0.5rem;
        }

        .chat-tagline {
          font-size: 1.75rem;
          font-weight: 300;
          color: var(--gj-dark);
          margin: 0;
          margin-top: 5px;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }

        @media (max-width: 768px) {
          .chat-tagline {
            font-size: 1.4rem;
          }
          
          .chat-tagline-container {
            padding: .5rem 1rem 0.5rem;
          }
            .ai-chat-layout-with-nav .chat-header {
      z-index: 1050;
    }

    .ai-chat-layout-with-nav .chat-header .dropdown-menu {
      position: fixed;
      top: 60px;
      right: 10px;
      left: auto;
      min-width: 200px;
    }
        }

        @media (max-width: 480px) {
          .chat-tagline {
            font-size: 0.90rem;
          }
            .paddingBottomDiv {
            padding: 20px 30px;
        
          }
        }
      `}</style>
    </div>
  );
};

export default AIChat;