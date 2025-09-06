// src/pages/Judgement.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';

const Judgement = () => {
  const { id } = useParams();

  useEffect(() => {
    // Remove medical site body padding
    document.body.style.paddingTop = '0';
    
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const judgementData = {
    title: "Central Excise Act -- Price as Sole Consideration",
    breadcrumb: ["Search", "Database", "Prosecution Page", "Prosecution Favour Cases"],
    showingText: "Showing 1 - 25 of 57801 Cases Found",
    caseInfo: {
      legalEagle: "2023 Legal Eagle (SC) 1033 : 2023 Gojuris (SC) 1033",
      court: "IN THE SUPREME COURT OF INDIA",
      equivalentCitations: "2023 AIR(SC) 5610 : 2024 (1) SCC 24 : 2023 (6) MLJ 181 : 2023 (14) SCR 492",
      before: "Aniruddha Bose, Vikram Nath",
      petitioner: "Tottempudi Salalith",
      respondent: "State Bank of India & Ors.",
      caseNumber: "Civil Appeal No.2348 of 2021",
      date: "18-10-2023"
    },
    content: `Banking Regulation Act, 1949 — Section 35AA — Constitution of India, 1950 — Article 142 — Contract Act, 1872 — Section 25(3) — Debts Recovery Act, 1993 — Sections 19(22), 22A — Limitation Act — Article 137 — Limitation Act, 1963 — Section 18 — Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 — Section 13(2) — Civil Appeal — Debt Recovery — Whether debts in connection with recovery certificate issued in year 2015 could form subject matter of an application under Section 7 of IBC — Court can otherwise not satisfied with argument about maintainability of application out of which this appeal arises on ground of application being barred under limitation — The application with respect to two recovery certificates issued in year 2017 is maintainable — CIRP could not lie so far as recovery certificate of 2015 is concerned, as decree would be still alive to claim based on said recovery certificate could be segregated from composite claim and Committee of Creditors shall, in that event, treat sum reflected in said recovery certificate as part of the claims made in pursuance of public announcement — This direction we are issuing in exercise of our jurisdiction under Article 142 of the Constitution of India — Appeal is dismissed. (Para 15)`,
    additionalSections: [
      "Advocates",
      "Acts Referred",
      "Cases Cited", 
      "Original Court Copy",
      "AI Abridgment"
    ]
  };

  return (
    <div className="judgement-layout">
      <Sidebar />
      
      <div className="judgement-main">
        {/* Header */}
        <div className="judgement-header">
          <div className="header-top">
            <div className="gojuris-logo-section">
              <div className="logo-icon">
                <i className="bx bx-certification"></i>
              </div>
              <h1 className="gojuris-title">GOJURIS</h1>
            </div>
            
            <div className="header-actions">
              <button className="search-history-btn">Search History</button>
              <button className="translate-btn">
                <i className="bx bx-globe"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb-section">
          <div className="breadcrumb-left">
            <span className="searches-label">Searches</span>
            <nav className="breadcrumb">
              {judgementData.breadcrumb.map((item, index) => (
                <span key={index}>
                  {index > 0 && <i className="bx bx-chevron-right"></i>}
                  <a href="#" className="breadcrumb-link">{item}</a>
                </span>
              ))}
            </nav>
          </div>
          
          <div className="breadcrumb-right">
            <span className="showing-text">{judgementData.showingText}</span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="user-profile-section">
          <div className="user-avatar">
            <i className="bx bx-user"></i>
          </div>
          <span className="user-label">User Profile</span>
        </div>

        {/* Case Title */}
        <div className="case-title-section">
          <h1 className="case-title">{judgementData.title}</h1>
        </div>

        {/* Case Information */}
        <div className="case-info-section">
          <div className="case-header">
            <div className="legal-eagle-info">
              <strong>{judgementData.caseInfo.legalEagle}</strong>
              <br />
              <strong>{judgementData.caseInfo.court}</strong>
            </div>
            
            <div className="equivalent-citations">
              Equivalent Citations : {judgementData.caseInfo.equivalentCitations}
            </div>
            
            <div className="before-info">
              [Before : <strong>{judgementData.caseInfo.before}</strong>]
            </div>
            
            <div className="case-parties">
              <div className="petitioner">
                <span className="party-label">Tottempudi Salalith</span>
                <br />
                <span className="vs">vs.</span>
                <br />
                <span className="respondent">State Bank of India & Ors.</span>
              </div>
            </div>
            
            <div className="case-details">
              <strong>Case No. :</strong> {judgementData.caseInfo.caseNumber}
            </div>
            
            <div className="decision-date">
              <h2>Date of Decision : {judgementData.caseInfo.date}</h2>
            </div>
          </div>
        </div>

        {/* Case Content */}
        <div className="case-content-section">
          <p className="case-content">{judgementData.content}</p>
          
          <div className="additional-sections">
            <ul>
              {judgementData.additionalSections.map((section, index) => (
                <li key={index}>• {section}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default Judgement;