'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

// Roadmap verileri - merkezi veri kaynağı
const roadmapData: Record<string, {
  title: string
  icon: string
  color: string
  borderColor: string
  description: string
  sections: Array<{
    id: string
    title: string
    icon: string
    steps: Array<{ id: string; title: string; duration: string }>
  }>
}> = {
  ux: {
    title: 'UX Designer',
    icon: '🔬',
    color: 'rgba(222, 255, 55, 0.1)',
    borderColor: 'rgba(222, 255, 55, 0.2)',
    description: 'Kullanıcıyı anlama, doğru problemi tanımlama ve anlamlı çözümler üretme üzerine kurulu bir yolculuk.',
    sections: [
      {
        id: 'foundation',
        title: 'Foundation',
        icon: '📚',
        steps: [
          { id: 'ux-nedir', title: 'UX Tasarım Nedir?', duration: '30 dk' },
          { id: 'design-thinking', title: 'Design Thinking', duration: '45 dk' },
          { id: 'ux-ui-farki', title: 'UX vs UI Farkı', duration: '20 dk' },
          { id: 'ux-rolleri', title: 'UX Tasarımcı Rolleri', duration: '25 dk' }
        ]
      },
      {
        id: 'user-research',
        title: 'User Research',
        icon: '🔬',
        steps: [
          { id: 'arastirma-temelleri', title: 'Araştırma Temelleri', duration: '40 dk' },
          { id: 'kullanici-gorusmeleri', title: 'Kullanıcı Görüşmeleri', duration: '45 dk' },
          { id: 'anket-tasarimi', title: 'Anket Tasarımı', duration: '35 dk' },
          { id: 'persona-olusturma', title: 'Persona Oluşturma', duration: '40 dk' },
          { id: 'user-journey', title: 'User Journey Mapping', duration: '45 dk' }
        ]
      },
      {
        id: 'ia',
        title: 'Information Architecture',
        icon: '🏗️',
        steps: [
          { id: 'ia-temelleri', title: 'IA Temelleri', duration: '35 dk' },
          { id: 'site-haritasi', title: 'Site Haritası', duration: '30 dk' },
          { id: 'card-sorting', title: 'Card Sorting', duration: '40 dk' },
          { id: 'navigation', title: 'Navigation Patterns', duration: '35 dk' }
        ]
      },
      {
        id: 'wireframing',
        title: 'Wireframing',
        icon: '✏️',
        steps: [
          { id: 'wireframe-nedir', title: 'Wireframe Nedir?', duration: '25 dk' },
          { id: 'low-high-fi', title: 'Low-Fi vs High-Fi', duration: '30 dk' },
          { id: 'wireframe-araclari', title: 'Wireframe Araçları', duration: '35 dk' },
          { id: 'wireframe-pratik', title: 'Wireframe Best Practices', duration: '40 dk' }
        ]
      },
      {
        id: 'usability',
        title: 'Usability Testing',
        icon: '🧪',
        steps: [
          { id: 'test-turleri', title: 'Test Türleri', duration: '35 dk' },
          { id: 'test-plani', title: 'Test Planı Hazırlama', duration: '40 dk' },
          { id: 'moderated-unmoderated', title: 'Moderated vs Unmoderated', duration: '30 dk' },
          { id: 'analiz', title: 'Sonuçları Analiz Etme', duration: '45 dk' }
        ]
      }
    ]
  },
  ui: {
    title: 'UI Designer',
    icon: '🎨',
    color: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    description: 'Görsel tasarım prensipleri, renk teorisi ve modern arayüz bileşenleri üzerine uzmanlaşma.',
    sections: [
      {
        id: 'visual-foundation',
        title: 'Visual Foundation',
        icon: '🎨',
        steps: [
          { id: 'ui-nedir', title: 'UI Tasarım Nedir?', duration: '30 dk' },
          { id: 'renk-teorisi', title: 'Renk Teorisi', duration: '45 dk' },
          { id: 'tipografi', title: 'Tipografi', duration: '40 dk' },
          { id: 'gorsel-hiyerarsi', title: 'Görsel Hiyerarşi', duration: '35 dk' }
        ]
      },
      {
        id: 'components',
        title: 'UI Components',
        icon: '🧩',
        steps: [
          { id: 'butonlar', title: 'Butonlar', duration: '25 dk' },
          { id: 'formlar', title: 'Form Elemanları', duration: '35 dk' },
          { id: 'kartlar', title: 'Kartlar & Listeler', duration: '30 dk' },
          { id: 'navigation-ui', title: 'Navigation Components', duration: '35 dk' }
        ]
      },
      {
        id: 'design-systems',
        title: 'Design Systems',
        icon: '📐',
        steps: [
          { id: 'ds-nedir', title: 'Design System Nedir?', duration: '35 dk' },
          { id: 'tokens', title: 'Design Tokens', duration: '40 dk' },
          { id: 'component-library', title: 'Component Library', duration: '45 dk' },
          { id: 'documentation', title: 'Documentation', duration: '30 dk' }
        ]
      }
    ]
  },
  product: {
    title: 'Product Designer',
    icon: '💡',
    color: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    description: 'İş hedefleri ve kullanıcı ihtiyaçlarını birleştiren stratejik ürün tasarımı.',
    sections: [
      {
        id: 'product-foundation',
        title: 'Product Foundation',
        icon: '💡',
        steps: [
          { id: 'product-design-nedir', title: 'Product Design Nedir?', duration: '35 dk' },
          { id: 'product-thinking', title: 'Product Thinking', duration: '45 dk' },
          { id: 'business-design', title: 'Business & Design', duration: '40 dk' }
        ]
      },
      {
        id: 'strategy',
        title: 'Product Strategy',
        icon: '🎯',
        steps: [
          { id: 'problem-framing', title: 'Problem Framing', duration: '40 dk' },
          { id: 'okr-metrics', title: 'OKR & Metrics', duration: '45 dk' },
          { id: 'prioritization', title: 'Prioritization', duration: '35 dk' },
          { id: 'roadmapping', title: 'Product Roadmapping', duration: '40 dk' }
        ]
      },
      {
        id: 'collaboration',
        title: 'Cross-functional Collaboration',
        icon: '🤝',
        steps: [
          { id: 'pm-collaboration', title: 'PM ile Çalışmak', duration: '30 dk' },
          { id: 'dev-handoff', title: 'Developer Handoff', duration: '40 dk' },
          { id: 'stakeholder', title: 'Stakeholder Management', duration: '35 dk' }
        ]
      }
    ]
  }
}

// Mini pratikler
const dailyPractices = [
  { text: 'Son kullandığın bir uygulamada bir UX problemi tespit et.', duration: '3 dk' },
  { text: 'Bir rakip uygulamanın onboarding akışını analiz et.', duration: '5 dk' },
  { text: 'Bugün karşılaştığın bir arayüzün görsel hiyerarşisini değerlendir.', duration: '3 dk' },
  { text: 'Favori bir uygulamanın color palette\'ini incele.', duration: '4 dk' },
  { text: 'Bir e-ticaret sitesinin checkout akışını test et.', duration: '5 dk' }
]

interface UserProgress {
  step_id: string
  status: string
  roadmap_id: string
  updated_at: string
}

interface UserPreferences {
  selected_roadmap?: string
  streak_count?: number
  last_active_date?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({})
  const [activeRoadmap, setActiveRoadmap] = useState<string>('ux')

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth'
        return
      }
      setUser(user)

      // Kullanıcı tercihlerini çek
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (prefsData) {
        setPreferences(prefsData)
        if (prefsData.selected_roadmap) {
          setActiveRoadmap(prefsData.selected_roadmap)
        }
      }

      // Tüm ilerleme verilerini çek
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      if (progressData) {
        setProgress(progressData)
        // Eğer tercih yoksa ama ilerleme varsa, en çok ilerleme olan roadmap'i seç
        if (!prefsData?.selected_roadmap && progressData.length > 0) {
          const roadmapCounts = progressData.reduce((acc: Record<string, number>, item) => {
            acc[item.roadmap_id] = (acc[item.roadmap_id] || 0) + 1
            return acc
          }, {})
          const mostUsedRoadmap = Object.entries(roadmapCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
          if (mostUsedRoadmap) {
            setActiveRoadmap(mostUsedRoadmap)
          }
        }
      }

      setLoading(false)
    }
    initDashboard()
  }, [])

  // Aktif roadmap için istatistikler
  const activeRoadmapStats = useMemo(() => {
    const roadmap = roadmapData[activeRoadmap]
    if (!roadmap) return { totalSteps: 0, completedSteps: 0, percentage: 0, currentStep: null, nextStep: null }

    const allSteps = roadmap.sections.flatMap(s => s.steps)
    const totalSteps = allSteps.length
    const roadmapProgress = progress.filter(p => p.roadmap_id === activeRoadmap && p.status === 'done')
    const completedSteps = roadmapProgress.length
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    // Mevcut ve sonraki adımı bul
    let currentStep = null
    let nextStep = null

    for (const section of roadmap.sections) {
      for (let i = 0; i < section.steps.length; i++) {
        const step = section.steps[i]
        const isCompleted = roadmapProgress.some(p => p.step_id === step.id)

        if (!isCompleted && !currentStep) {
          currentStep = { ...step, sectionTitle: section.title }
          // Sonraki adım
          if (i + 1 < section.steps.length) {
            nextStep = { ...section.steps[i + 1], sectionTitle: section.title }
          } else {
            // Sonraki section'ın ilk adımı
            const currentSectionIndex = roadmap.sections.indexOf(section)
            if (currentSectionIndex + 1 < roadmap.sections.length) {
              const nextSection = roadmap.sections[currentSectionIndex + 1]
              if (nextSection.steps.length > 0) {
                nextStep = { ...nextSection.steps[0], sectionTitle: nextSection.title }
              }
            }
          }
          break
        }
      }
      if (currentStep) break
    }

    // Eğer tüm adımlar tamamlanmışsa
    if (!currentStep && completedSteps === totalSteps && totalSteps > 0) {
      currentStep = { ...allSteps[allSteps.length - 1], sectionTitle: roadmap.sections[roadmap.sections.length - 1].title, isCompleted: true }
    }

    return { totalSteps, completedSteps, percentage, currentStep, nextStep }
  }, [activeRoadmap, progress])

  // Genel istatistikler
  const generalStats = useMemo(() => {
    const totalCompleted = progress.filter(p => p.status === 'done').length
    const streak = preferences.streak_count || 0
    const bookmarks = 0 // TODO: Bookmark sistemi eklenince
    const notes = 0 // TODO: Not sistemi eklenince

    return { totalCompleted, streak, bookmarks, notes }
  }, [progress, preferences])

  // Günlük pratik
  const dailyPractice = useMemo(() => {
    const today = new Date().toDateString()
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % dailyPractices.length
    return dailyPractices[index]
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Yükleniyor...</p>
        <style jsx>{`
          .dashboard-loading {
            min-height: 100vh;
            background-color: var(--bg-primary);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }
          .dashboard-loading p {
            color: var(--text-muted);
            font-size: 14px;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--border-color);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'
  const currentRoadmap = roadmapData[activeRoadmap] || roadmapData['ux']
  const hasStarted = progress.length > 0

  if (!currentRoadmap) {
    return (
      <div className="dashboard-loading">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="logo">
          <Image src="/designatlas.svg" alt="Logo" width={32} height={32} />
          <span>designatlas.io</span>
        </Link>

        <nav className="nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="nav-icon">🏠</span>
            Dashboard
          </Link>

          <div className="nav-section-title">Roadmap'ler</div>

          {Object.entries(roadmapData).map(([key, roadmap]) => {
            const roadmapProgress = progress.filter(p => p.roadmap_id === key && p.status === 'done').length
            const totalSteps = roadmap.sections.reduce((acc, s) => acc + s.steps.length, 0)
            const isActive = activeRoadmap === key

            return (
              <button
                key={key}
                onClick={() => setActiveRoadmap(key)}
                className={`nav-item roadmap-item ${isActive ? 'selected' : ''}`}
              >
                <span className="roadmap-icon" style={{ backgroundColor: roadmap.color }}>
                  {roadmap.icon}
                </span>
                <span className="roadmap-info">
                  <span className="roadmap-title">{roadmap.title}</span>
                  {roadmapProgress > 0 && (
                    <span className="roadmap-progress">{roadmapProgress}/{totalSteps}</span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {!hasStarted ? (
          /* İlk Kullanıcı Deneyimi */
          <div className="welcome-section">
            <h1 className="welcome-title">Hoş geldin, {userName}</h1>
            <p className="welcome-subtitle">
              Tasarım yolculuğuna başlamak için bir yol seç.
            </p>

            <div className="recommended-roadmap">
              <div className="recommended-badge">Senin için önerilen</div>
              <div className="recommended-header">
                <div className="recommended-icon" style={{ backgroundColor: currentRoadmap.color }}>
                  {currentRoadmap.icon}
                </div>
                <div>
                  <h2 className="recommended-title">{currentRoadmap.title} Roadmap</h2>
                  <p className="recommended-desc">{currentRoadmap.description}</p>
                </div>
              </div>
              <Link href={`/roadmap/${activeRoadmap}`} className="start-btn primary">
                Bu yolculukla başla
                <span>→</span>
              </Link>
            </div>

            <div className="other-roadmaps">
              <h3 className="section-title">Diğer yolculuklar</h3>
              <div className="roadmap-grid">
                {Object.entries(roadmapData)
                  .filter(([key]) => key !== activeRoadmap)
                  .map(([key, roadmap]) => (
                    <button
                      key={key}
                      onClick={() => setActiveRoadmap(key)}
                      className="roadmap-card"
                    >
                      <div className="roadmap-card-icon" style={{ backgroundColor: roadmap.color }}>
                        {roadmap.icon}
                      </div>
                      <div className="roadmap-card-content">
                        <h4>{roadmap.title}</h4>
                        <p>{roadmap.sections.reduce((acc, s) => acc + s.steps.length, 0)} adım</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          /* Devam Eden Kullanıcı Deneyimi */
          <div className="continue-section">
            {/* Hero CTA */}
            <div className="hero-cta" style={{
              background: `linear-gradient(135deg, ${currentRoadmap.color} 0%, transparent 100%)`,
              borderColor: currentRoadmap.borderColor
            }}>
              <div className="hero-content">
                <h1 className="hero-title">Kaldığın yerden devam edelim</h1>
                <p className="hero-subtitle">
                  {currentRoadmap.title} yolculuğunda <strong>{activeRoadmapStats.percentage}%</strong> tamamladın.
                </p>
              </div>
              <Link href={`/roadmap/${activeRoadmap}`} className="start-btn primary glow">
                Devam et
                <span>→</span>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(222, 255, 55, 0.1)' }}>📚</div>
                <div className="stat-info">
                  <div className="stat-value">{generalStats.totalCompleted}</div>
                  <div className="stat-label">Tamamlanan Adım</div>
                </div>
              </div>
              <div className="stat-card streak">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 100, 50, 0.1)' }}>🔥</div>
                <div className="stat-info">
                  <div className="stat-value">{generalStats.streak} gün</div>
                  <div className="stat-label">Öğrenme Serisi</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>🔖</div>
                <div className="stat-info">
                  <div className="stat-value">{generalStats.bookmarks}</div>
                  <div className="stat-label">Bookmark</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>📝</div>
                <div className="stat-info">
                  <div className="stat-value">{generalStats.notes}</div>
                  <div className="stat-label">Not</div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              {/* Kaldığın Yer */}
              <div className="card current-step-card">
                <div className="card-header">
                  <span className="card-icon">📘</span>
                  <h3>Kaldığın yer</h3>
                </div>
                <div className="current-roadmap">
                  <div className="current-roadmap-icon" style={{ backgroundColor: currentRoadmap.color }}>
                    {currentRoadmap.icon}
                  </div>
                  <div>
                    <p className="current-roadmap-title">{currentRoadmap.title} Roadmap</p>
                    {activeRoadmapStats.currentStep && (
                      <p className="current-step-name">
                        {activeRoadmapStats.currentStep.sectionTitle} → {activeRoadmapStats.currentStep.title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="progress-section">
                  <div className="progress-info">
                    <span>{activeRoadmapStats.percentage}% tamamlandı</span>
                    <span>{activeRoadmapStats.completedSteps}/{activeRoadmapStats.totalSteps} adım</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeRoadmapStats.percentage}%` }}
                    />
                  </div>
                </div>
                <Link href={`/roadmap/${activeRoadmap}`} className="card-action">
                  Devam et
                </Link>
              </div>

              {/* Sıradaki Adım */}
              <div className="card next-step-card">
                <div className="card-header">
                  <span className="card-icon">⏭️</span>
                  <h3>Sıradaki adım</h3>
                </div>
                {activeRoadmapStats.nextStep ? (
                  <>
                    <h4 className="next-step-title">{activeRoadmapStats.nextStep.title}</h4>
                    <p className="next-step-duration">{activeRoadmapStats.nextStep.duration}</p>
                    <p className="next-step-section">{activeRoadmapStats.nextStep.sectionTitle}</p>
                  </>
                ) : activeRoadmapStats.currentStep ? (
                  <>
                    <h4 className="next-step-title">{activeRoadmapStats.currentStep.title}</h4>
                    <p className="next-step-duration">{activeRoadmapStats.currentStep.duration}</p>
                    <p className="next-step-section">{activeRoadmapStats.currentStep.sectionTitle}</p>
                  </>
                ) : (
                  <p className="no-next-step">Tüm adımlar tamamlandı!</p>
                )}
                <Link href={`/roadmap/${activeRoadmap}`} className="card-action secondary">
                  Bu adıma göz at
                </Link>
              </div>

              {/* Mini Pratik */}
              <div className="card practice-card">
                <div className="card-header">
                  <span className="card-icon">✍️</span>
                  <h3>Bugünkü mini pratik</h3>
                </div>
                <p className="practice-text">{dailyPractice.text}</p>
                <button className="practice-btn">
                  {dailyPractice.duration}da yap
                </button>
              </div>
            </div>

            {/* Roadmap Overview */}
            <div className="roadmap-overview">
              <div className="overview-header">
                <div className="overview-info">
                  <span className="overview-icon">🗺️</span>
                  <p>{currentRoadmap.title} Roadmap - {activeRoadmapStats.completedSteps} / {activeRoadmapStats.totalSteps} adım tamamlandı</p>
                </div>
                <Link href={`/roadmap/${activeRoadmap}`} className="overview-link">
                  Tüm roadmap'i gör
                </Link>
              </div>
              <div className="overview-progress">
                <div
                  className="overview-progress-fill"
                  style={{ width: `${activeRoadmapStats.percentage}%` }}
                />
              </div>
            </div>

            {/* Diğer Roadmaplar */}
            <div className="other-section">
              <h3 className="section-title">Diğer öğrenme yolları</h3>
              <div className="other-roadmaps-grid">
                {Object.entries(roadmapData)
                  .filter(([key]) => key !== activeRoadmap)
                  .map(([key, roadmap]) => {
                    const roadmapProgress = progress.filter(p => p.roadmap_id === key && p.status === 'done').length
                    const totalSteps = roadmap.sections.reduce((acc, s) => acc + s.steps.length, 0)

                    return (
                      <Link
                        key={key}
                        href={`/roadmap/${key}`}
                        className="other-roadmap-card"
                      >
                        <div className="other-roadmap-icon" style={{ backgroundColor: roadmap.color }}>
                          {roadmap.icon}
                        </div>
                        <div className="other-roadmap-content">
                          <h4>{roadmap.title}</h4>
                          <p>{roadmap.description}</p>
                          {roadmapProgress > 0 && (
                            <span className="other-roadmap-progress">
                              {roadmapProgress}/{totalSteps} adım
                            </span>
                          )}
                        </div>
                        <span className="other-roadmap-arrow">→</span>
                      </Link>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background-color: var(--bg-surface);
          border-right: 1px solid var(--border-color);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 100;
          overflow-y: auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          padding-left: 8px;
          text-decoration: none;
        }

        .logo span {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-primary);
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background-color: var(--bg-secondary);
        }

        .nav-item.active {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-section-title {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 16px 16px 8px;
          margin-top: 8px;
        }

        .roadmap-item {
          justify-content: flex-start;
        }

        .roadmap-item.selected {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }

        .roadmap-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .roadmap-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .roadmap-title {
          font-size: 14px;
        }

        .roadmap-progress {
          font-size: 11px;
          color: var(--text-muted);
        }

        .user-section {
          margin-top: auto;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background-color: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-on-primary);
          font-weight: 600;
          font-size: 14px;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 12px;
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          width: 100%;
          padding: 10px;
          margin-top: 8px;
          background-color: transparent;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background-color: var(--bg-secondary);
          border-color: var(--border-hover);
        }

        /* Main Content */
        .main-content {
          margin-left: 260px;
          flex: 1;
          padding: 40px;
          max-width: 1000px;
        }

        /* Welcome Section */
        .welcome-section {
          padding-top: 20px;
        }

        .welcome-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .welcome-subtitle {
          color: var(--text-secondary);
          font-size: 16px;
          margin-bottom: 40px;
        }

        .recommended-roadmap {
          background: linear-gradient(135deg, rgba(222, 255, 55, 0.08) 0%, rgba(222, 255, 55, 0.02) 100%);
          border: 1px solid rgba(222, 255, 55, 0.15);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 40px;
        }

        .recommended-badge {
          display: inline-block;
          padding: 6px 12px;
          background-color: rgba(222, 255, 55, 0.15);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 20px;
        }

        .recommended-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .recommended-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }

        .recommended-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .recommended-desc {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.5;
        }

        .start-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .start-btn.primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: var(--text-on-primary);
        }

        .start-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(222, 255, 55, 0.25);
        }

        .start-btn.glow {
          box-shadow: 0 0 30px rgba(222, 255, 55, 0.3);
        }

        .other-roadmaps {
          margin-top: 40px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 16px;
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .roadmap-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: all 0.2s;
        }

        .roadmap-card:hover {
          border-color: var(--border-hover);
          background-color: var(--bg-secondary);
        }

        .roadmap-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .roadmap-card-content h4 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .roadmap-card-content p {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Continue Section */
        .continue-section {
          padding-top: 20px;
        }

        .hero-cta {
          border: 1px solid;
          border-radius: 20px;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 32px;
        }

        .hero-content {
          flex: 1;
        }

        .hero-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .hero-subtitle {
          color: var(--text-secondary);
          font-size: 15px;
        }

        .hero-subtitle strong {
          color: var(--primary);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 14px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 20px;
        }

        .card-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .current-step-card {
          grid-row: span 2;
        }

        .current-roadmap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .current-roadmap-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .current-roadmap-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .current-step-name {
          font-size: 13px;
          color: var(--text-muted);
        }

        .progress-section {
          margin-bottom: 20px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .progress-info span:first-child {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .progress-info span:last-child {
          color: var(--text-muted);
        }

        .progress-bar {
          height: 8px;
          background-color: var(--bg-tertiary);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: 100px;
          transition: width 0.3s ease;
        }

        .card-action {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          background-color: rgba(222, 255, 55, 0.1);
          border: 1px solid rgba(222, 255, 55, 0.2);
          color: var(--primary);
        }

        .card-action:hover {
          background-color: rgba(222, 255, 55, 0.15);
        }

        .card-action.secondary {
          background-color: var(--bg-secondary);
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        .card-action.secondary:hover {
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .next-step-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .next-step-duration {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .next-step-section {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .no-next-step {
          color: var(--accent-success);
          font-size: 14px;
        }

        .practice-card {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%);
          border-color: rgba(34, 197, 94, 0.15);
        }

        .practice-text {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .practice-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          background-color: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          color: var(--accent-success);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .practice-btn:hover {
          background-color: rgba(34, 197, 94, 0.2);
        }

        /* Roadmap Overview */
        .roadmap-overview {
          padding: 20px 24px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          margin-bottom: 32px;
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .overview-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .overview-icon {
          font-size: 18px;
        }

        .overview-info p {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .overview-link {
          color: var(--primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .overview-link:hover {
          text-decoration: underline;
        }

        .overview-progress {
          height: 4px;
          background-color: var(--bg-tertiary);
          border-radius: 100px;
          overflow: hidden;
        }

        .overview-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: 100px;
          transition: width 0.3s ease;
        }

        /* Other Section */
        .other-section {
          margin-top: 32px;
        }

        .other-roadmaps-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .other-roadmap-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .other-roadmap-card:hover {
          border-color: var(--border-hover);
          background-color: var(--bg-secondary);
        }

        .other-roadmap-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .other-roadmap-content {
          flex: 1;
        }

        .other-roadmap-content h4 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .other-roadmap-content p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .other-roadmap-progress {
          display: inline-block;
          margin-top: 6px;
          font-size: 12px;
          color: var(--primary);
          font-weight: 500;
        }

        .other-roadmap-arrow {
          color: var(--text-muted);
          font-size: 18px;
          transition: transform 0.2s;
        }

        .other-roadmap-card:hover .other-roadmap-arrow {
          transform: translateX(4px);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 72px;
            padding: 16px 8px;
          }

          .logo span,
          .nav-item span:not(.nav-icon):not(.roadmap-icon),
          .nav-section-title,
          .roadmap-info,
          .user-details,
          .logout-btn {
            display: none;
          }

          .nav-item {
            justify-content: center;
            padding: 12px;
          }

          .roadmap-item {
            justify-content: center;
          }

          .user-info {
            justify-content: center;
          }

          .main-content {
            margin-left: 72px;
            padding: 24px;
          }

          .hero-cta {
            flex-direction: column;
            text-align: center;
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .current-step-card {
            grid-row: auto;
          }

          .roadmap-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 24px;
          }

          .welcome-title {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  )
}
