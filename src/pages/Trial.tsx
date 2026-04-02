import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

interface TrialClass {
  id: number
  title: string
  instructor: string
  subject: string
  platform: 'Zoom' | 'Google Meet'
  schedule: string
  duration: string
  price: number
  seatsAvailable: number
  image: string
  description: string
}

function Trial() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const trialClasses: TrialClass[] = [
    {
      id: 1,
      title: 'Introduction to Algebra',
      instructor: 'Mr. Ahmed Khan',
      subject: 'Mathematics',
      platform: 'Zoom',
      schedule: 'Mon, Jan 15 - 10:00 AM',
      duration: '45 minutes',
      price: 500,
      seatsAvailable: 15,
      image: '📐',
      description: 'Master the basics of algebraic expressions and equations in this interactive session.'
    },
    {
      id: 2,
      title: 'Shakespeare\'s Macbeth',
      instructor: 'Ms. Fatima Ali',
      subject: 'English',
      platform: 'Google Meet',
      schedule: 'Tue, Jan 16 - 2:00 PM',
      duration: '60 minutes',
      price: 600,
      seatsAvailable: 12,
      image: '📚',
      description: 'Explore the themes and characters of Shakespeare\'s tragic masterpiece.'
    },
    {
      id: 3,
      title: 'Newton\'s Laws of Motion',
      instructor: 'Mr. Hassan Raza',
      subject: 'Physics',
      platform: 'Zoom',
      schedule: 'Wed, Jan 17 - 3:00 PM',
      duration: '45 minutes',
      price: 500,
      seatsAvailable: 18,
      image: '⚛️',
      description: 'Understand the fundamental laws that govern motion in our universe.'
    },
    {
      id: 4,
      title: 'Organic Chemistry Basics',
      instructor: 'Dr. Ayesha Malik',
      subject: 'Chemistry',
      platform: 'Google Meet',
      schedule: 'Thu, Jan 18 - 11:00 AM',
      duration: '60 minutes',
      price: 600,
      seatsAvailable: 10,
      image: '🧪',
      description: 'Introduction to carbon compounds and their fascinating reactions.'
    },
    {
      id: 5,
      title: 'Python Programming 101',
      instructor: 'Mr. Usman Tariq',
      subject: 'Computer Science',
      platform: 'Zoom',
      schedule: 'Sat, Jan 20 - 1:00 PM',
      duration: '90 minutes',
      price: 800,
      seatsAvailable: 20,
      image: '💻',
      description: 'Write your first Python program and learn programming fundamentals.'
    },
    {
      id: 6,
      title: 'Human Circulatory System',
      instructor: 'Dr. Zara Ahmed',
      subject: 'Biology',
      platform: 'Google Meet',
      schedule: 'Sun, Jan 21 - 4:00 PM',
      duration: '45 minutes',
      price: 500,
      seatsAvailable: 14,
      image: '🧬',
      description: 'Journey through the heart and blood vessels of the human body.'
    },
    {
      id: 7,
      title: 'Quran Recitation Basics',
      instructor: 'Qari Muhammad Ibrahim',
      subject: 'Quran',
      platform: 'Zoom',
      schedule: 'Mon, Jan 15 - 5:00 PM',
      duration: '30 minutes',
      price: 400,
      seatsAvailable: 8,
      image: '📖',
      description: 'Learn proper Arabic pronunciation and basic Tajweed rules.'
    },
    {
      id: 8,
      title: 'Urdu Poetry Analysis',
      instructor: 'Ms. Khadija Siddiqui',
      subject: 'Urdu',
      platform: 'Google Meet',
      schedule: 'Fri, Jan 19 - 6:00 PM',
      duration: '60 minutes',
      price: 500,
      seatsAvailable: 16,
      image: '📕',
      description: 'Appreciate the beauty of classical Urdu poetry and its meanings.'
    }
  ]

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'English', name: 'English' },
    { id: 'Physics', name: 'Physics' },
    { id: 'Chemistry', name: 'Chemistry' },
    { id: 'Biology', name: 'Biology' },
    { id: 'Computer Science', name: 'Computer Science' },
    { id: 'Quran', name: 'Quran' },
    { id: 'Urdu', name: 'Urdu' }
  ]

  const filteredClasses = selectedSubject === 'all'
    ? trialClasses
    : trialClasses.filter(cls => cls.subject === selectedSubject)

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`
  }

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

      {/* Hero Section */}
      <section className="page-hero trial-hero">
        <div className="container">
          <div className="trial-hero-content">
            <div className="trial-hero-text">
              <span className="hero-badge">🎫 Try Before You Commit</span>
              <h1 className="page-title">Trial Classes</h1>
              <p className="page-subtitle">
                Experience our teaching quality with one-time access to live classes. Pay per class, no subscription required.
              </p>
              <div className="trial-benefits">
                <div className="trial-benefit">
                  <span className="benefit-icon">💰</span>
                  <div>
                    <span className="benefit-title">Affordable</span>
                    <span className="benefit-desc">From Rs. 400/class</span>
                  </div>
                </div>
                <div className="trial-benefit">
                  <span className="benefit-icon">⏱️</span>
                  <div>
                    <span className="benefit-title">Flexible</span>
                    <span className="benefit-desc">30-90 min sessions</span>
                  </div>
                </div>
                <div className="trial-benefit">
                  <span className="benefit-icon">🎯</span>
                  <div>
                    <span className="benefit-title">No Commitment</span>
                    <span className="benefit-desc">One-time access</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="trial-hero-visual">
              <div className="ticket-card">
                <div className="ticket-header">
                  <span className="ticket-type">Trial Pass</span>
                  <span className="ticket-price">Rs. 500</span>
                </div>
                <div className="ticket-body">
                  <div className="ticket-class">
                    <span className="class-icon">📐</span>
                    <span className="class-name">Mathematics</span>
                  </div>
                  <div className="ticket-details">
                    <span className="detail">📅 Jan 15</span>
                    <span className="detail">🕐 10:00 AM</span>
                  </div>
                  <div className="ticket-platform">
                    <span className="platform-icon">📹</span>
                    <span>Zoom Live Class</span>
                  </div>
                </div>
                <div className="ticket-footer">
                  <span className="ticket-valid">✓ Valid for one session</span>
                </div>
              </div>
              <div className="floating-tag tag-1">🔥 8 Classes Today</div>
              <div className="floating-tag tag-2">✨ Free Demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="section trial-info-section">
        <div className="container">
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>Register Per Class</h3>
              <p>Pay only for the classes you want to attend. No subscription required.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎫</div>
              <h3>One-Time Access</h3>
              <p>Single session access to experience our live interactive teaching.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📹</div>
              <h3>Live via Zoom/Meet</h3>
              <p>Join classes through your preferred platform - Zoom or Google Meet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Info */}
      <section className="section platform-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Platform</h2>
            <p className="section-subtitle">
              All trial classes are conducted live on your preferred platform
            </p>
          </div>
          <div className="platform-info">
            <div className="platform-card zoom">
              <div className="platform-icon">📹</div>
              <h3>Zoom</h3>
              <p>Interactive video sessions with screen sharing, chat, and breakout rooms for enhanced learning experience.</p>
            </div>
            <div className="platform-card google-meet">
              <div className="platform-icon">🎥</div>
              <h3>Google Meet</h3>
              <p>Seamless integration with Google services, easy access, and reliable video quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Classes Section */}
      <section className="section trial-classes-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Available Trial Classes</h2>
            <p className="section-subtitle">
              Select a class and register to attend live
            </p>
          </div>

          {/* Subject Filter */}
          <div className="subject-filter">
            <button 
              className={`filter-btn ${selectedSubject === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedSubject('all')}
            >
              All Subjects
            </button>
            {subjects.filter(s => s.id !== 'all').map(subject => (
              <button 
                key={subject.id}
                className={`filter-btn ${selectedSubject === subject.id ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.name}
              </button>
            ))}
          </div>

          {/* Classes Grid */}
          <div className="trial-classes-grid">
            {filteredClasses.map(classItem => (
              <div key={classItem.id} className="trial-class-card">
                <div className="trial-class-image">
                  <span className="trial-class-icon">{classItem.image}</span>
                  <span className={`platform-badge ${classItem.platform.toLowerCase().replace(' ', '-')}`}>
                    {classItem.platform === 'Zoom' ? '📹' : '🎥'} {classItem.platform}
                  </span>
                </div>
                <div className="trial-class-content">
                  <span className="subject-tag">{classItem.subject}</span>
                  <h3 className="trial-class-title">{classItem.title}</h3>
                  <p className="trial-class-instructor">👨‍🏫 {classItem.instructor}</p>
                  <p className="trial-class-description">{classItem.description}</p>
                  
                  <div className="trial-class-details">
                    <div className="trial-detail">
                      <span className="detail-icon">📅</span>
                      <span>{classItem.schedule}</span>
                    </div>
                    <div className="trial-detail">
                      <span className="detail-icon">⏱️</span>
                      <span>{classItem.duration}</span>
                    </div>
                    <div className="trial-detail">
                      <span className="detail-icon">👥</span>
                      <span>{classItem.seatsAvailable} seats left</span>
                    </div>
                  </div>

                  <div className="trial-class-pricing">
                    <span className="trial-price">{formatPrice(classItem.price)}</span>
                    <span className="trial-price-label">one-time access</span>
                  </div>

                  <button className="btn btn-primary btn-block">Register for Class</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section trial-how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How to Join a Trial Class</h2>
            <p className="section-subtitle">
              Simple 3-step process to attend your first class
            </p>
          </div>

          <div className="trial-steps-grid">
            <div className="trial-step-card">
              <div className="trial-step-number">1</div>
              <h3>Choose a Class</h3>
              <p>Browse available trial classes and select one that interests you</p>
            </div>
            <div className="trial-step-card">
              <div className="trial-step-number">2</div>
              <h3>Register & Pay</h3>
              <p>Complete the quick registration and secure payment process</p>
            </div>
            <div className="trial-step-card">
              <div className="trial-step-number">3</div>
              <h3>Join Live</h3>
              <p>Receive Zoom/Meet link and join the class at scheduled time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="section trial-cta-section">
        <div className="container">
          <div className="trial-cta-content">
            <h2 className="trial-cta-title">Ready to Experience Quality Teaching?</h2>
            <p className="trial-cta-subtitle">
              Book your trial class today and see the PakTeachers difference. 
              Affordable one-time access with no commitment required.
            </p>
            <div className="trial-cta-buttons">
              <Link to="/courses" className="btn btn-light btn-lg">Browse Full Courses</Link>
              <a href="#classes" className="btn btn-outline-light btn-lg">View All Classes</a>
            </div>
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

export default Trial
