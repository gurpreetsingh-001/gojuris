// src/pages/AIChat_Redesigned.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ApiService from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import { MoreVertical, Menu, Plus, X, Send, Mic, Upload, Settings, User, Home, BookmarkIcon, ChevronDown, Copy, Printer, MessageSquare, FileText, Bot, Receipt } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

var isGJ = false;

const AIChat_Redesigned = () => {
  // All state variables (same as original)
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

  // All the same functions from original (keeping them identical)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.redesigned-sidebar');
        const hamburger = document.querySelector('.hamburger-menu-btn');
        if (sidebar && !sidebar.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
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
        setShowAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      } else {
        setUserProfile(JSON.parse(storedUserData));
      }
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
      recognitionInstance.onstart = () => setIsListening(true);
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
      recognitionInstance.onend = () => setIsListening(false);
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
      const text = q.innerText;
      setCurrentQuery("");
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
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
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
    } else {
      setUserMessage(userMessage + message + ", ");
    }
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
      } else {
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
    } else {
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

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
  };

  const copyMessage = async (htmlText, index) => {
    const temp = document.createElement("div");
    temp.innerHTML = htmlText;
    const plainText = temp.innerText;
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
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
        if (m.type != "ai") {
          return `<div style="text-align: right; color: blue; margin: 6px 0;">${m.text}</div>`;
        }
        return `<div style="margin: 6px 0;">${m.text}</div>`;
      })
      .join("<br/><br/>");
    const temp = document.createElement("div");
    temp.innerHTML = allHtml;
    const plainText = temp.innerText;
    setCopiedAllIndex(index);
    setTimeout(() => setCopiedAllIndex(null), 1500);
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
        if (m.type != "ai") {
          return `<div style="text-align: right; color: blue; margin: 6px 0;">${m.text}</div>`;
        }
        return `<div style="margin: 6px 0;">${m.text}</div>`;
      })
      .join("<br/><br/>");
    const logoUrl = window.location.origin + (isGJ ? "/logo.png" : "/logoLe.png");
    const pnew = `<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        @media print {
          footer {
                text-align: center !important;
                width: 100% !important;
                display: block !important;
                margin: 0 auto !important;
            }
          @page {
                margin-top:10px; margin-bottom:10px;
                @bottom-right {
                  content: "Page " counter(page);
                  font-size: 9pt;
                  margin-top: -7mm;
                }
          }
            tfoot td {
                text-align: center !important;
            }
        }
    </style>
</head>
<body>
        <table>
            <thead>
                <tr>
                    <td style="width: 400px;">
                        <a href="index.aspx" class="navbar-brand active">
                            <img id="imglogo" alt="Legal Egale Elite"   crossorigin="anonymous" style="margin-top: -5px; height: 50px;" src="${logoUrl}" /></a>
                    </td>
                    <td style="text-align: right; vertical-align: central; font-family: Cambria; font-size: 8pt;">This Application is licensed to : ${getDisplayName()}</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div style="border: 1px solid;"></div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">
                        <p style="page-break-inside: avoid;">
                            <div id="myDiv" style="text-align: justify; margin-right: 20px; margin-left: 20px;">
                            ${allHtml}
                            </div>
                        </p>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2">
                        <div style="border: 1px solid;"></div>
                        <br />
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center; border: 0px;">
                        <footer style="text-align: center;border-bottom: none;font-family: Cambria;font-size: 9pt;">
                           © 2025-2026 | All Rights Reserved with Capital Law Infotech, Delhi (India)
                        </footer>
                    </td>
                </tr>
            </tfoot>
        </table>
</body>
</html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pnew);
    printWindow.document.close();
    if (window.innerWidth <= 768) {
      printWindow.print();
    } else {
      printWindow.onload = () => {
        printWindow.print();
      }
    }
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  const handleSignOut = () => {
    setShowAccountDropdown(false);
    ApiService.clearTokensAndRedirect();
  };

  return (
    <div className="redesigned-layout">
      <Sidebar />

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="redesigned-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Chat Sidebar */}
      <div className={`redesigned-sidebar ${isSidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="sidebar-header-new">
          <button className="new-chat-button" onClick={() => {
            setChatHistory([]);
            setChatsessionId(null);
            setCurrentQuery("");
            setUserMessage("");
            if (window.innerWidth <= 768) {
              setIsSidebarOpen(false);
            }
          }}>
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="sidebar-history-section">
          <div className="history-header">
            <h3>History</h3>
            <button className="delete-all-button" onClick={() => {
              if (window.confirm("Are you sure you want to delete all chat history?")) {
                deleteAllChat();
              }
            }}>
              Delete All
            </button>
          </div>

          <div className="history-list">
            {chatsessionsList?.length > 0 ? (
              chatsessionsList.map((result) => (
                <div key={result.id} className="history-item">
                  <div className="history-item-content" onClick={() => loadChatdata(result.sessionId, result.id, result.type)}>
                    <div className="history-icon">
                      {result.isPined ? '📌' : result.type === 'AISearch' ? <MessageSquare size={18} /> : result.type === 'Draft' ? <FileText size={18} /> : result.type === 'AIHelp' ? <Bot size={18} /> : <Receipt size={18} />}
                    </div>
                    <div className="history-text">
                      <div className="history-title">{result.subject}</div>
                      <div className="history-date">{formatDate(result?.updatedAt)}</div>
                    </div>
                    <div className="history-menu" onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(result.sessionId);
                    }}>
                      <MoreVertical size={18} />
                    </div>
                  </div>

                  {openMenuId === result.sessionId && (
                    <div
                      className="history-dropdown"
                      ref={(el) => (menuRefs.current[result.sessionId] = el)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="dropdown-item" onClick={() => {
                        if (window.confirm("Are you sure you want to delete this chat?")) {
                          handleDelete(result.sessionId);
                        }
                      }}>
                        🗑️ Delete
                      </div>
                      <div className="dropdown-item" onClick={() => handlePrint(result.sessionId, !result.isPined)}>
                        📌 {result.isPined ? 'UnPin' : 'Pin'}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="history-empty">
                <div className="empty-icon">💬</div>
                <p>No previous chats</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="redesigned-main">
        {/* Top Navigation */}
        <header className="redesigned-header">
          <div className="header-left">
            <button className="hamburger-menu-btn" onClick={toggleSidebar}>
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/dashboard" className="header-logo">
              <img src={isGJ ? "/logo.png" : "/logoLe.png"} alt="Logo" />
            </Link>
          </div>

          <div className="header-center">
            <span className="welcome-text">Welcome, {getDisplayName()}</span>
          </div>

          <div className="header-right">
            <button className="icon-button" onClick={() => navigate('/dashboard')} title="Dashboard">
              <Home size={20} />
            </button>
            <button className="icon-button" onClick={() => navigate('/Latest-Law')} title="Latest Law">
              <FileText size={20} />
            </button>
            <button className="icon-button" onClick={() => navigate('/SaveBookmarks')} title="Bookmarks">
              <BookmarkIcon size={20} />
            </button>
            <button className="icon-button" onClick={() => setShowSettingsModal(true)} title="Settings">
              <Settings size={20} />
            </button>

            <div className="user-dropdown-container" ref={dropdownRef}>
              <button className="user-button" onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
                <div className="user-avatar">{getUserInitials()}</div>
                <ChevronDown size={16} />
              </button>

              {showAccountDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">{getUserInitials()}</div>
                    <div className="dropdown-info">
                      <div className="dropdown-name">{userProfile?.displayName || userProfile?.name || 'Legal User'}</div>
                      <div className="dropdown-email">{userProfile?.email || 'user@gojuris.com'}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-link">
                    <User size={16} />
                    View Profile
                  </button>
                  <button className="dropdown-link">
                    <FileText size={16} />
                    Billing & Plans
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-link danger" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Content */}
        <div className="redesigned-content">
          <div className="chat-title-section">
            <h1 className="chat-main-title">{CurrentQuery}</h1>
          </div>

          {/* Chat Messages */}
          <div className="messages-container">
            {chatHistory.length === 0 ? (
              <div className="welcome-screen">
                <div className="mode-selector">
                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('AISearch');
                    }}
                    className={`mode-card ${chatType === 'AISearch' ? 'active' : ''}`}
                  >
                    <MessageSquare size={24} />
                    <div className="mode-text">
                      <h3>Ask for Case Law</h3>
                      <p>Get instant case laws and legal answers</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('AIHelp');
                    }}
                    className={`mode-card ${chatType === 'AIHelp' ? 'active' : ''}`}
                  >
                    <Bot size={24} />
                    <div className="mode-text">
                      <h3>General Legal Query</h3>
                      <p>Ask any law-related question</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setChatHistory([]);
                      setChatsessionId(null);
                      setCurrentQuery("");
                      setUserMessage("");
                      setChatType('Draft');
                    }}
                    className={`mode-card ${chatType === 'Draft' ? 'active' : ''}`}
                  >
                    <FileText size={24} />
                    <div className="mode-text">
                      <h3>Generate a Draft</h3>
                      <p>Create ready-to-file legal drafts</p>
                    </div>
                  </button>

                  <label htmlFor="fileUploadNew" className="mode-card upload-card">
                    <Receipt size={24} />
                    <div className="mode-text">
                      <h3>Summarize/Analyze Case</h3>
                      {isUploading ? (
                        <p>⏳ Uploading...</p>
                      ) : (
                        <p>Upload and get instant analysis</p>
                      )}
                    </div>
                  </label>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={onUploadFile}
                    id="fileUploadNew"
                    accept=".pdf,.txt,.docx,.doc"
                  />
                </div>

                <div className="examples-section">
                  <h3>Examples</h3>
                  <div className="examples-list">
                    {(chatType === 'AISearch' ? quickQuestions : chatType === 'AIHelp' ? helpExample : draftExample).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        disabled={isLoading}
                        className="example-item"
                      >
                        <span className="example-number">{index + 1}.</span>
                        <span className="example-text">{question}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="messages-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message-bubble ${msg.type} ${msg.isError ? 'error' : ''}`}>
                    <div className="message-avatar-new">
                      {msg.type === 'user' ? (
                        <div className="avatar-circle user-avatar-circle">{getUserInitials()}</div>
                      ) : (
                        <div className="avatar-circle ai-avatar-circle">
                          <Bot size={20} />
                        </div>
                      )}
                    </div>
                    <div className="message-body">
                      {msg.type === 'ai' && (msg.metadata?.isApiResponse || msg.isStreaming) ? (
                        <div
                          className="message-text-html"
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                          onClick={handleClick}
                        />
                      ) : (
                        <div className="message-text-plain">{msg.text}</div>
                      )}

                      {msg.isStreaming && msg.type === 'ai' && (
                        <div className="typing-animation">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      )}

                      {!isLoading && msg.type === 'ai' && (
                        <div className="message-actions">
                          <button className="action-btn" onClick={() => copyMessage(msg.text, index)}>
                            <Copy size={16} />
                            <span>{copiedIndex === index ? "Copied!" : "Copy"}</span>
                          </button>
                          {index === (chatHistory.length - 1) && (
                            <>
                              <button className="action-btn" onClick={() => copyAllMessage(index)}>
                                <Copy size={16} />
                                <span>{copiedAllIndex === index ? "Copied!" : "Copy All"}</span>
                              </button>
                              <button className="action-btn" onClick={() => printAllMessage(index)}>
                                <Printer size={16} />
                                <span>Print</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError('')}>×</button>
            </div>
          )}
        </div>

        {/* Input Section */}
        {chatType !== 'Summarizer' && (
          <div className="redesigned-input-section">
            {chatType === 'AISearch' && (
              <div className="input-controls">
                <div className="control-group">
                  <label className="control-label">Mode:</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="ChatMode"
                        value="Long"
                        checked={searchMode === 'Long'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                        disabled={isLoading}
                      />
                      <span>Detailed</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="ChatMode"
                        value="Short"
                        checked={searchMode === 'Short'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                        disabled={isLoading}
                      />
                      <span>Quick</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="ChatMode"
                        value="Deep"
                        checked={searchMode === 'Deep'}
                        onChange={(e) => handleInputChange("ChatMode", e.target.value)}
                        disabled={isLoading}
                      />
                      <span>Deep</span>
                    </label>
                  </div>
                </div>

                <select
                  className="court-selector"
                  value={selectedCourt}
                  disabled={isLoading}
                  onChange={(e) => {
                    setSelectedCourt(e.target.value);
                    setResearch(e.target.value);
                  }}
                >
                  {courts.map((court) => (
                    <option key={court.key} value={court.key}>
                      {court.value}
                    </option>
                  ))}
                </select>

                {chatHistory.length > 0 && (
                  <button
                    className="load-more-btn"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    Load More Results
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="input-form">
              <div className="input-wrapper">
                <textarea
                  className="message-input"
                  placeholder={chatType === 'AISearch' ? "Ask your legal question here..." : chatType === 'AIHelp' ? 'Ask any law-related question.' : "Describe your issue to generate a legal draft instantly"}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  rows="2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <div className="input-actions">
                  <button
                    type="button"
                    className={`action-btn-input ${isListening ? 'listening' : ''}`}
                    onClick={toggleVoiceRecognition}
                    disabled={isLoading}
                  >
                    <Mic size={20} />
                  </button>
                  <button
                    type="submit"
                    className="send-button"
                    disabled={isLoading || !message.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Settings</h2>
              <button onClick={() => setShowSettingsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="coming-soon-content">
                <Settings size={64} className="coming-soon-icon" />
                <h3>Coming Soon</h3>
                <p>Advanced settings will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showComingSoonModal && (
        <div className="modal-overlay" onClick={() => setShowComingSoonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Coming Soon</h2>
              <button onClick={() => setShowComingSoonModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="coming-soon-content">
                <div className="coming-soon-icon">⏰</div>
                <h3>Feature Under Development</h3>
                <p>This feature is currently under development and will be available soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ============================================
           ROOT & LAYOUT
           ============================================ */
        .redesigned-layout {
          display: flex;
          height: 100vh;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* ============================================
           SIDEBAR OVERLAY
           ============================================ */
        .redesigned-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(2px);
        }

        /* ============================================
           SIDEBAR
           ============================================ */
        .redesigned-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 70px;
          top: 0;
          bottom: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-header-new {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .new-chat-button {
          width: 100%;
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
        }

        .new-chat-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.35);
        }

        .sidebar-history-section {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .history-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .delete-all-button {
          padding: 6px 12px;
          background: transparent;
          color: #ef4444;
          border: 1px solid #ef4444;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-all-button:hover {
          background: #fef2f2;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .history-item {
          position: relative;
        }

        .history-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
        }

        .history-item-content:hover {
          background: #f3f4f6;
        }

        .history-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          font-size: 18px;
        }

        .history-text {
          flex: 1;
          min-width: 0;
        }

        .history-title {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .history-date {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .history-menu {
          flex-shrink: 0;
          color: #9ca3af;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .history-menu:hover {
          background: white;
          color: #374151;
        }

        .history-dropdown {
          position: absolute;
          top: 100%;
          right: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 10;
          margin-top: 4px;
          min-width: 140px;
        }

        .dropdown-item {
          padding: 10px 14px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item:first-child {
          border-radius: 8px 8px 0 0;
        }

        .dropdown-item:last-child {
          border-radius: 0 0 8px 8px;
        }

        .history-empty {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .history-empty p {
          font-size: 14px;
          margin: 0;
        }

        /* ============================================
           MAIN CONTENT AREA
           ============================================ */
        .redesigned-main {
          flex: 1;
          margin-left: 350px;
          display: flex;
          flex-direction: column;
          background: white;
          position: relative;
        }

        /* ============================================
           HEADER
           ============================================ */
        .redesigned-header {
          height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .hamburger-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: #374151;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .hamburger-menu-btn:hover {
          background: #f3f4f6;
        }

        .header-logo img {
          height: 45px;
          width: auto;
        }

        .header-center {
          flex: 1;
          text-align: center;
        }

        .welcome-text {
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .user-dropdown-container {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-button:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 240px;
          z-index: 1000;
        }

        .dropdown-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .dropdown-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .dropdown-info {
          flex: 1;
          min-width: 0;
        }

        .dropdown-name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-email {
          font-size: 13px;
          color: #6b7280;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        .dropdown-link {
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dropdown-link:hover {
          background: #f9fafb;
        }

        .dropdown-link.danger {
          color: #ef4444;
        }

        .dropdown-link.danger:hover {
          background: #fef2f2;
        }

        /* ============================================
           CHAT CONTENT
           ============================================ */
        .redesigned-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .chat-title-section {
          padding: 24px 32px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .chat-main-title {
          font-size: 28px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.3;
        }

        .messages-container {
          flex: 1;
          padding: 24px 32px;
          padding-bottom: 160px;
        }

        /* Welcome Screen */
        .welcome-screen {
          max-width: 900px;
          margin: 0 auto;
        }

        .mode-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .mode-card {
          padding: 20px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }

        .mode-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .mode-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        }

        .mode-card svg {
          color: #667eea;
        }

        .mode-text h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .mode-text p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .examples-section {
          background: #f9fafb;
          padding: 24px;
          border-radius: 16px;
        }

        .examples-section h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
        }

        .examples-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .example-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .example-item:hover:not(:disabled) {
          border-color: #667eea;
          background: #f9fafb;
        }

        .example-item:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .example-number {
          color: #667eea;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .example-text {
          color: #374151;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Messages List */
        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .message-bubble {
          display: flex;
          gap: 16px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-avatar-new {
          flex-shrink: 0;
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .user-avatar-circle {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .ai-avatar-circle {
          background: #f3f4f6;
          color: #667eea;
        }

        .message-body {
          flex: 1;
          min-width: 0;
        }

        .message-text-html {
          font-size: 15px;
          line-height: 1.7;
          color: #1f2937;
        }

        .message-text-html p {
          margin: 0 0 12px 0;
        }

        .message-text-html a {
          color: #667eea;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }

        .message-text-html a:hover {
          border-bottom-color: #667eea;
        }

        .message-text-plain {
          font-size: 15px;
          line-height: 1.7;
          color: #1f2937;
          font-weight: 500;
        }

        .message-bubble.user .message-text-plain {
          color: #667eea;
        }

        .typing-animation {
          display: flex;
          gap: 4px;
          align-items: center;
          margin-top: 12px;
        }

        .typing-animation span {
          width: 8px;
          height: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-animation span:nth-child(1) { animation-delay: -0.32s; }
        .typing-animation span:nth-child(2) { animation-delay: -0.16s; }
        .typing-animation span:nth-child(3) { animation-delay: 0s; }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .message-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .action-btn {
          padding: 6px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-btn:hover {
          background: white;
          border-color: #d1d5db;
          color: #374151;
        }

        .question-item {
          display: inline-block;
          color: #667eea;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .question-item:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 14px 16px;
          margin: 0 32px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #dc2626;
          font-size: 14px;
        }

        .error-banner button {
          background: transparent;
          border: none;
          color: #dc2626;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        /* ============================================
           INPUT SECTION
           ============================================ */
        .redesigned-input-section {
          position: fixed;
          bottom: 0;
          left: 350px;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          padding: 16px 32px;
          z-index: 50;
        }

        .input-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .radio-group {
          display: flex;
          gap: 12px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
          user-select: none;
        }

        .radio-option input[type="radio"] {
          width: 16px;
          height: 16px;
          accent-color: #667eea;
          cursor: pointer;
        }

        .court-selector {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .court-selector:focus {
          outline: none;
          border-color: #667eea;
        }

        .load-more-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .load-more-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .load-more-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-form {
          width: 100%;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          padding: 14px 16px;
          padding-right: 100px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          resize: none;
          transition: all 0.2s ease;
          min-height: 52px;
          max-height: 120px;
        }

        .message-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .input-actions {
          position: absolute;
          right: 8px;
          bottom: 8px;
          display: flex;
          gap: 6px;
        }

        .action-btn-input {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn-input:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn-input.listening {
          color: #ef4444;
          background: #fef2f2;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .send-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ============================================
           MODALS
           ============================================ */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .modal-header button {
          background: transparent;
          border: none;
          font-size: 28px;
          color: #9ca3af;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .modal-header button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-body {
          padding: 32px 24px;
        }

        .coming-soon-content {
          text-align: center;
        }

        .coming-soon-icon {
          color: #667eea;
          margin-bottom: 16px;
        }

        .coming-soon-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .coming-soon-content p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        /* ============================================
           RESPONSIVE DESIGN
           ============================================ */
        
        /* Tablet Portrait (768px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
          .redesigned-sidebar {
            left: 0;
          }

          .redesigned-main {
            margin-left: 280px;
          }

          .redesigned-input-section {
            left: 280px;
          }

          .hamburger-menu-btn {
            display: none;
          }
        }

        /* Tablet Landscape (768px - 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) and (orientation: landscape) {
          .redesigned-sidebar {
            left: 0;
          }

          .redesigned-main {
            margin-left: 280px;
          }

          .redesigned-input-section {
            left: 280px;
          }

          .chat-main-title {
            font-size: 24px;
          }

          .messages-container {
            padding: 20px 24px;
            padding-bottom: 140px;
          }
        }

        /* Mobile (max-width: 768px) */
        @media (max-width: 768px) {
          .redesigned-sidebar {
            left: 0;
            transform: translateX(-100%);
            width: 280px;
          }

          .redesigned-sidebar.sidebar-active {
            transform: translateX(0);
          }

          .redesigned-main {
            margin-left: 0;
          }

          .redesigned-input-section {
            left: 0;
          }

          .hamburger-menu-btn {
            display: flex;
          }

          .header-center {
            display: none;
          }

          .chat-main-title {
            font-size: 20px;
          }

          .messages-container {
            padding: 16px;
            padding-bottom: 180px;
          }

          .mode-selector {
            grid-template-columns: 1fr;
          }

          .input-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .control-group {
            flex-direction: column;
            align-items: flex-start;
          }

          .court-selector {
            width: 100%;
          }

          .redesigned-header {
            padding: 0 16px;
          }

          .header-right {
            gap: 4px;
          }

          .icon-button {
            width: 36px;
            height: 36px;
          }
        }

        /* Small Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          .chat-main-title {
            font-size: 18px;
          }

          .welcome-text {
            font-size: 13px;
          }

          .mode-card {
            padding: 16px;
          }

          .mode-text h3 {
            font-size: 14px;
          }

          .mode-text p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AIChat_Redesigned;