import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function SoftwareSupport() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">PakTeachers</span>
          </div>
          
          <div className={`nav-wrapper ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <nav className="nav">
              <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/school" className="nav-link" onClick={() => setMobileMenuOpen(false)}>School</Link>
              <Link to="/courses" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
              <Link to="/trial" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Trial Classes</Link>
              <Link to="/software-support" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Software Support</Link>
              <Link to="/lms" className="nav-link" onClick={() => setMobileMenuOpen(false)}>LMS</Link>
            </nav>
          </div>

          <button
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <section className="page-hero software-support-hero">
        <div className="container">
          <div className="software-support-hero-content">
            <div className="support-hero-text">
              <span className="hero-badge">💻 Technical Assistance</span>
              <h1 className="page-title">Software Support</h1>
              <p className="page-subtitle">
                Get help with software installation, troubleshooting, and technical guidance for all your learning platforms
              </p>
              <div className="support-types">
                <div className="support-type">
                  <span className="type-icon">🔧</span>
                  <div>
                    <span className="type-title">Setup Help</span>
                    <span className="type-desc">Installation & Config</span>
                  </div>
                </div>
                <div className="support-type">
                  <span className="type-icon">🐛</span>
                  <div>
                    <span className="type-title">Troubleshooting</span>
                    <span className="type-desc">Bug Fixes</span>
                  </div>
                </div>
                <div className="support-type">
                  <span className="type-icon">📖</span>
                  <div>
                    <span className="type-title">Guides</span>
                    <span className="type-desc">Tutorials & Docs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="support-hero-visual">
              <div className="support-cards">
                <div className="support-card zoom-support">
                  <span className="support-icon zoom">📹</span>
                  <span className="support-name">Zoom</span>
                  <span className="support-status online">● Online</span>
                </div>
                <div className="support-card meet-support">
                  <span className="support-icon meet">🎥</span>
                  <span className="support-name">Google Meet</span>
                  <span className="support-status online">● Online</span>
                </div>
                <div className="support-card lms-support">
                  <span className="support-icon lms">🖥️</span>
                  <span className="support-name">LMS Portal</span>
                  <span className="support-status online">● Online</span>
                </div>
              </div>
              <div className="support-badge">
                <span>⚡</span> Quick Response
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Coming Soon</h2>
            <p className="section-subtitle">
              We are working on bringing you comprehensive software support resources.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">📚</span>
                <span className="logo-text">PakTeachers</span>
              </div>
              <p className="footer-description">
                Empowering students across Pakistan with quality online education. Join our growing community of learners today.
              </p>
              <div className="footer-social">
                <a href="#facebook" className="social-link" aria-label="Facebook">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#twitter" className="social-link" aria-label="Twitter">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-link" aria-label="Instagram">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#youtube" className="social-link" aria-label="YouTube">
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/school">📖 School</Link></li>
                <li><Link to="/courses">🎓 Courses</Link></li>
                <li><a href="#quran">📿 Quran Teaching</a></li>
                <li><Link to="/trial">🎫 Trial Classes</Link></li>
                <li><Link to="/software-support">💻 Software Support</Link></li>
                <li><Link to="/lms">🖥️ LMS</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">❓ Help Center</a></li>
                <li><a href="#faq">💬 FAQ</a></li>
                <li><a href="#contact">📧 Contact Us</a></li>
                <li><a href="#privacy">🔒 Privacy Policy</a></li>
                <li><a href="#terms">📄 Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <ul className="contact-info">
                <li>
                  <span className="contact-icon">📧</span>
                  <span>info@pakteachers.com</span>
                </li>
                <li>
                  <span className="contact-icon">📞</span>
                  <span>+92 123 4567890</span>
                </li>
                <li>
                  <span className="contact-icon">📍</span>
                  <span>Lahore, Pakistan</span>
                </li>
                <li>
                  <span className="contact-icon">🕐</span>
                  <span>Mon - Sat: 9AM - 6PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 PakTeachers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SoftwareSupport
