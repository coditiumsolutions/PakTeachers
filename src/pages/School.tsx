import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

// Theme toggle hook
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(!isDark)
  return { isDark, toggleTheme }
}

interface LiveClass {
  id: number
  title: string
  teacher: string
  platform: 'Zoom' | 'Google Meet'
  schedule: string
  students: number
  image: string
}

interface ClassLevel {
  name: string
  grades: string
  ageRange: string
  subjects: string[]
}

function School() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const { isDark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const liveClasses: LiveClass[] = [
    {
      id: 1,
      title: 'Mathematics - Algebra Fundamentals',
      teacher: 'Mr. Ahmed Khan',
      platform: 'Zoom',
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      students: 24,
      image: '📐'
    },
    {
      id: 2,
      title: 'English Literature - Shakespeare',
      teacher: 'Ms. Fatima Ali',
      platform: 'Google Meet',
      schedule: 'Tue, Thu - 2:00 PM',
      students: 18,
      image: '📚'
    },
    {
      id: 3,
      title: 'Physics - Mechanics & Motion',
      teacher: 'Mr. Hassan Raza',
      platform: 'Zoom',
      schedule: 'Mon, Wed - 3:00 PM',
      students: 20,
      image: '⚛️'
    },
    {
      id: 4,
      title: 'Chemistry - Organic Compounds',
      teacher: 'Dr. Ayesha Malik',
      platform: 'Google Meet',
      schedule: 'Tue, Thu - 11:00 AM',
      students: 16,
      image: '🧪'
    },
    {
      id: 5,
      title: 'Computer Science - Python Programming',
      teacher: 'Mr. Usman Tariq',
      platform: 'Zoom',
      schedule: 'Sat, Sun - 1:00 PM',
      students: 30,
      image: '💻'
    },
    {
      id: 6,
      title: 'Biology - Human Anatomy',
      teacher: 'Dr. Zara Ahmed',
      platform: 'Google Meet',
      schedule: 'Mon, Wed - 4:00 PM',
      students: 22,
      image: '🧬'
    }
  ]

  const classLevels: ClassLevel[] = [
    {
      name: 'Primary',
      grades: 'Grades 1-5',
      ageRange: 'Ages 5-10',
      subjects: ['Mathematics', 'English', 'Science', 'Urdu', 'Islamic Studies']
    },
    {
      name: 'Middle',
      grades: 'Grades 6-8',
      ageRange: 'Ages 11-13',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science']
    },
    {
      name: 'Secondary',
      grades: 'Grades 9-10',
      ageRange: 'Ages 14-16',
      subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accounting']
    },
    {
      name: 'Higher Secondary',
      grades: 'Grades 11-12',
      ageRange: 'Ages 16-18',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business Studies']
    }
  ]

  const filteredLevels = selectedLevel === 'all' 
    ? classLevels 
    : classLevels.filter(level => level.name === selectedLevel)

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

            <div className="header-actions">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <span className="theme-icon">{isDark ? '☀️' : '🌙'}</span>
              </button>
            </div>
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
      <section className="page-hero school-hero">
        <div className="container">
          <div className="school-hero-content">
            <div className="school-hero-text">
              <span className="hero-badge">🎓 Live Interactive Classes</span>
              <h1 className="page-title">Online Schooling</h1>
              <p className="page-subtitle">
                Experience quality education from the comfort of your home with our live interactive classes conducted via Zoom and Google Meet
              </p>
              <div className="hero-features">
                <div className="hero-feature">
                  <span className="hero-feature-icon">📹</span>
                  <span>Live Classes</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">👨‍🏫</span>
                  <span>Expert Teachers</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">📊</span>
                  <span>Progress Tracking</span>
                </div>
              </div>
            </div>
            <div className="school-hero-visual">
              <div className="hero-visual-card">
                <div className="visual-card-header">
                  <span className="card-dot red"></span>
                  <span className="card-dot yellow"></span>
                  <span className="card-dot green"></span>
                </div>
                <div className="visual-card-body">
                  <div className="class-preview">
                    <span className="preview-icon">📐</span>
                    <div className="preview-content">
                      <span className="preview-title">Mathematics Live</span>
                      <span className="preview-status">● Live Now</span>
                    </div>
                  </div>
                  <div className="class-preview">
                    <span className="preview-icon">🔬</span>
                    <div className="preview-content">
                      <span className="preview-title">Science Lab</span>
                      <span className="preview-status">● Starting Soon</span>
                    </div>
                  </div>
                  <div className="class-preview">
                    <span className="preview-icon">📚</span>
                    <div className="preview-content">
                      <span className="preview-title">English Literature</span>
                      <span className="preview-status">● 2:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-badge badge-1">⭐ 4.9 Rating</div>
              <div className="floating-badge badge-2">👥 10K+ Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Classes Section */}
      <section className="section live-classes-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Live Classes</h2>
            <p className="section-subtitle">
              Join real-time interactive sessions with experienced teachers via Zoom or Google Meet
            </p>
          </div>

          {/* Platform Info Cards */}
          <div className="platform-info">
            <div className="platform-card zoom">
              <div className="platform-icon">📹</div>
              <h3>Zoom Classes</h3>
              <p>Interactive video sessions with screen sharing and breakout rooms</p>
            </div>
            <div className="platform-card google-meet">
              <div className="platform-icon">🎥</div>
              <h3>Google Meet</h3>
              <p>Seamless integration with Google Classroom and collaborative tools</p>
            </div>
          </div>

          {/* Class Filter */}
          <div className="class-filter">
            <button 
              className={`filter-btn ${selectedLevel === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedLevel('all')}
            >
              All Levels
            </button>
            {classLevels.map(level => (
              <button 
                key={level.name}
                className={`filter-btn ${selectedLevel === level.name ? 'active' : ''}`}
                onClick={() => setSelectedLevel(level.name)}
              >
                {level.name}
              </button>
            ))}
          </div>

          {/* Live Classes Grid */}
          <div className="live-classes-grid">
            {liveClasses.map(classItem => (
              <div key={classItem.id} className="live-class-card">
                <div className="class-image">
                  <span className="class-icon">{classItem.image}</span>
                  <span className={`platform-badge ${classItem.platform.toLowerCase().replace(' ', '-')}`}>
                    {classItem.platform === 'Zoom' ? '📹' : '🎥'} {classItem.platform}
                  </span>
                </div>
                <div className="class-content">
                  <h3 className="class-title">{classItem.title}</h3>
                  <p className="class-teacher">👨‍🏫 {classItem.teacher}</p>
                  <div className="class-details">
                    <div className="class-detail">
                      <span className="detail-icon">📅</span>
                      <span>{classItem.schedule}</span>
                    </div>
                    <div className="class-detail">
                      <span className="detail-icon">👥</span>
                      <span>{classItem.students} students enrolled</span>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-block">Join Class</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Levels Section */}
      <section className="section class-levels-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Class Levels</h2>
            <p className="section-subtitle">
              Comprehensive curriculum designed for every stage of your child's education
            </p>
          </div>

          <div className="levels-grid">
            {filteredLevels.map(level => (
              <div key={level.name} className="level-card">
                <div className="level-header">
                  <h3 className="level-name">{level.name}</h3>
                  <span className="level-grades">{level.grades}</span>
                </div>
                <p className="level-age">🎯 {level.ageRange}</p>
                <ul className="level-subjects">
                  {level.subjects.map(subject => (
                    <li key={subject}>
                      <span className="check-icon">✓</span>
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Getting started with online schooling is easy
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>Fill out the registration form and choose your preferred classes</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Payment</h3>
              <p>Complete the secure payment process for your selected courses</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Access LMS</h3>
              <p>Get instant access to our Learning Management System</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Start Learning</h3>
              <p>Join live classes and start your educational journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="section registration-cta-section">
        <div className="container">
          <div className="registration-content">
            <h2 className="registration-title">Ready to Start Learning?</h2>
            <p className="registration-subtitle">
              Enroll now and give your child the gift of quality education. 
              Limited seats available for each class to ensure personalized attention.
            </p>
            <div className="registration-form">
              <div className="form-row">
                <input type="text" placeholder="Student Name" className="form-input" />
                <input type="email" placeholder="Email Address" className="form-input" />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number" className="form-input" />
                <select className="form-input">
                  <option value="">Select Class Level</option>
                  <option value="primary">Primary (Grades 1-5)</option>
                  <option value="middle">Middle (Grades 6-8)</option>
                  <option value="secondary">Secondary (Grades 9-10)</option>
                  <option value="higher">Higher Secondary (Grades 11-12)</option>
                </select>
              </div>
              <button className="btn btn-primary btn-lg btn-block">Register Now</button>
            </div>
            <p className="form-note">
              📞 Or call us at +92 123 4567890 for assistance
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default School
