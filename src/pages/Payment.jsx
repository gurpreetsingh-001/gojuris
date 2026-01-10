import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Payment = () => {
  const navigate = useNavigate();

  const handleCashfreePayment = () => {
    // Add your Cashfree payment integration here
    console.log('Initiating Cashfree payment...');
    window.open('YOUR_CASHFREE_PAYMENT_LINK', '_blank');
  };

  const handleRazorpayPayment = () => {
    // Add your Razorpay payment integration here
    console.log('Initiating Razorpay payment...');
    window.open('YOUR_RAZORPAY_PAYMENT_LINK', '_blank');
  };

  return (
    <div className="payment-page">
      <Header />
      
      {/* Hero Section */}
      <section className="payment-hero py-5" style={{ 
        background: 'var(--gj-gradient-primary)',
        minHeight: '30vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-white mb-3">
                Payment Page
              </h1>
              <p className="lead text-white opacity-90">
                Choose your preferred payment method
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Cards Section */}
      <section className="payment-cards-section py-5" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {/* Left Card - ICICI Bank QR */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card qr-card">
                <div className="qr-header">
                  <div className="bank-logos">
                    <img src="/Images/icici-logo.png" alt="ICICI Bank" className="bank-logo" />
                    <img src="/Images/eazypay-logo.png" alt="Eazypay" className="bank-logo" />
                  </div>
                </div>

                <div className="qr-content">
                  <div className="merchant-info">
                    <p className="merchant-label">Merchant Name -</p>
                    <h3 className="merchant-name">Capital Law Infotech</h3>
                  </div>

                  <div className="upi-info">
                    <p className="upi-label">UPI ID -</p>
                    <p className="upi-id">capitallawinfotech@icici</p>
                  </div>

                  <div className="qr-code-wrapper">
                    <img src="/Images/icici-qr.png" alt="ICICI QR Code" className="qr-image" />
                  </div>

                  <div className="mobile-pay-section">
                    <div className="mobile-pay-text">
                      <span>Pay here with</span>
                      <img src="/Images/imobile-logo.png" alt="iMobile Pay" className="imobile-logo" />
                    </div>
                    <p className="mobile-pay-description">
                      Now link any bank account with iMobile Pay to make UPI payments
                    </p>
                  </div>

                  <div className="payment-apps">
                    <img src="/Images/bhim-logo.png" alt="BHIM" className="app-logo" />
                    <img src="/Images/upi-logo.png" alt="UPI" className="app-logo" />
                    <img src="/Images/paytm-logo.png" alt="Paytm" className="app-logo" />
                    <img src="/Images/gpay-logo.png" alt="Google Pay" className="app-logo" />
                    <img src="/Images/phonepe-logo.png" alt="PhonePe" className="app-logo" />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Card - Online Payment Options */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card online-payment-card">
                <h2 className="online-payment-title">Pay Online</h2>

                {/* Cashfree Payment */}
                <div className="payment-option">
                  <button className="pay-now-btn cashfree-btn" onClick={handleCashfreePayment}>
                    Pay Now
                  </button>
                  <p className="powered-by">Powered by :</p>
                  <div className="payment-logo-wrapper">
                    <img src="/Images/cashfree-logo.png" alt="Cashfree Payments" className="payment-gateway-logo" />
                  </div>
                </div>

                <div className="payment-divider">
                  <span>OR</span>
                </div>

                {/* Razorpay Payment */}
                <div className="payment-option">
                  <button className="pay-now-btn razorpay-btn" onClick={handleRazorpayPayment}>
                    Pay Now
                  </button>
                  <p className="powered-by">Powered by :</p>
                  <div className="payment-logo-wrapper">
                    <img src="/Images/razorpay-logo.png" alt="Razorpay" className="payment-gateway-logo" />
                  </div>
                </div>

                <div className="payment-features">
                  <div className="feature-item">
                    <i className="bx bx-shield-quarter"></i>
                    <span>Secure Payment</span>
                  </div>
                  <div className="feature-item">
                    <i className="bx bx-credit-card"></i>
                    <span>Multiple Payment Options</span>
                  </div>
                  <div className="feature-item">
                    <i className="bx bx-check-circle"></i>
                    <span>Instant Activation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Union Bank QR */}
            <div className="col-lg-4 col-md-6">
              <div className="payment-card qr-card union-card">
                <div className="union-header">
                  <img src="/Images/union-bank-logo.png" alt="Union Bank" className="union-logo" />
                  <div className="bharat-logos">
                    <img src="/Images/bharat-bhim-logo.png" alt="Bharat BHIM" className="bharat-logo" />
                    <img src="/Images/bharat-qr-logo.png" alt="Bharat QR" className="bharat-logo" />
                  </div>
                </div>

                <div className="union-qr-wrapper">
                  <img src="/Images/union-qr.png" alt="Union Bank QR Code" className="union-qr-image" />
                </div>

                <div className="union-details">
                  <h3 className="union-merchant">CAPITAL LAW INFOTECH</h3>
                  <p className="union-upi">9810489101@uboi</p>
                </div>

                <div className="scan-instruction">
                  <i className="bx bx-qr-scan"></i>
                  <p>Scan QR code with any UPI app</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="row g-4 justify-content-center mt-4">
            <div className="col-lg-4 col-md-6">
              <div className="info-card">
                <i className="bx bx-info-circle"></i>
                <div className="info-content">
                  <h4>How to Pay?</h4>
                  <p>Scan the QR code using any UPI app or click on Pay Now buttons for online payment</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="info-card">
                <i className="bx bx-time"></i>
                <div className="info-content">
                  <h4>Instant Activation</h4>
                  <p>Your account will be activated immediately after successful payment</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="info-card">
                <i className="bx bx-support"></i>
                <div className="info-content">
                  <h4>Need Help?</h4>
                  <p>Contact our support team for any payment related queries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          background: #ffffff;
        }

        /* Payment Cards Section */
        .payment-cards-section {
          background: #f8fafc;
        }

        /* Payment Card Base */
        .payment-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
        }

        .payment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        /* QR Card Styles */
        .qr-card {
          border: 3px solid #f97316;
        }

        .qr-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          margin: -2rem -2rem 1.5rem;
          padding: 1.5rem 2rem;
          border-radius: 17px 17px 0 0;
        }

        .bank-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .bank-logo {
          height: 40px;
          object-fit: contain;
          background: white;
          padding: 0.5rem;
          border-radius: 8px;
        }

        .qr-content {
          text-align: center;
        }

        .merchant-info, .upi-info {
          margin-bottom: 1rem;
        }

        .merchant-label, .upi-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .merchant-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .upi-id {
          font-size: 1.125rem;
          font-weight: 600;
          color: #8b5cf6;
          margin: 0;
        }

        .qr-code-wrapper {
          margin: 2rem 0;
          display: flex;
          justify-content: center;
        }

        .qr-image {
          width: 200px;
          height: 200px;
          border: 3px solid #e5e7eb;
          border-radius: 12px;
          padding: 0.5rem;
        }

        .mobile-pay-section {
          background: #fef3c7;
          padding: 1rem;
          border-radius: 12px;
          margin: 1.5rem 0;
        }

        .mobile-pay-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .imobile-logo {
          height: 24px;
        }

        .mobile-pay-description {
          font-size: 0.875rem;
          color: #78350f;
          margin: 0;
        }

        .payment-apps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .app-logo {
          height: 32px;
          object-fit: contain;
        }

        /* Online Payment Card */
        .online-payment-card {
          border: 3px solid #8b5cf6;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .online-payment-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .payment-option {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .pay-now-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .cashfree-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .cashfree-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: scale(1.02);
        }

        .razorpay-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .razorpay-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: scale(1.02);
        }

        .powered-by {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .payment-logo-wrapper {
          display: flex;
          justify-content: center;
        }

        .payment-gateway-logo {
          height: 40px;
          object-fit: contain;
        }

        .payment-divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
        }

        .payment-divider::before,
        .payment-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: #e5e7eb;
        }

        .payment-divider::before {
          left: 0;
        }

        .payment-divider::after {
          right: 0;
        }

        .payment-divider span {
          background: white;
          padding: 0 1rem;
          color: #6b7280;
          font-weight: 600;
        }

        .payment-features {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .feature-item i {
          font-size: 1.5rem;
          color: #8b5cf6;
        }

        .feature-item span {
          font-size: 0.875rem;
          color: #4b5563;
          font-weight: 500;
        }

        /* Union Bank Card */
        .union-card {
          border: 3px solid #003d82;
        }

        .union-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .union-logo {
          height: 60px;
          object-fit: contain;
        }

        .bharat-logos {
          display: flex;
          gap: 0.5rem;
        }

        .bharat-logo {
          height: 35px;
          object-fit: contain;
        }

        .union-qr-wrapper {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }

        .union-qr-image {
          width: 280px;
          height: 280px;
          object-fit: contain;
        }

        .union-details {
          text-align: center;
          margin: 1.5rem 0;
        }

        .union-merchant {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .union-upi {
          font-size: 1.25rem;
          font-weight: 600;
          color: #003d82;
          margin: 0;
        }

        .scan-instruction {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #eff6ff;
          border-radius: 12px;
          margin-top: 1.5rem;
        }

        .scan-instruction i {
          font-size: 1.5rem;
          color: #003d82;
        }

        .scan-instruction p {
          margin: 0;
          color: #1e40af;
          font-weight: 500;
        }

        /* Information Cards */
        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 1rem;
          height: 100%;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .info-card i {
          font-size: 2rem;
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .info-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .info-content p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .payment-card {
            padding: 1.5rem;
          }

          .qr-header {
            margin: -1.5rem -1.5rem 1rem;
            padding: 1rem 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .payment-hero h1 {
            font-size: 2rem;
          }

          .online-payment-title {
            font-size: 1.5rem;
          }

          .union-qr-image {
            width: 220px;
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
};

export default Payment;