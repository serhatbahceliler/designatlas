'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

interface QuizResult {
  recommended_roadmap: string
}

interface UserRoadmap {
  roadmap_slug: string
  is_primary: boolean
  started_at: string
}

interface Progress {
  roadmap_slug: string
  step_id: string
  step_title: string
  progress_percentage: number
  completed: boolean
  last_accessed_at: string
}

interface Streak {
  current_streak: number
  longest_streak: number
  last_activity_date: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [showWhyRecommended, setShowWhyRecommended] = useState(false)
  const [showChangeInterest, setShowChangeInterest] = useState(false)

  // Data states
  const [recommendedRoadmap, setRecommendedRoadmap] = useState<string>('ux')
  const [currentProgress, setCurrentProgress] = useState<Progress[]>([])
  const [userStreak, setUserStreak] = useState<Streak | null>(null)
  const [userRoadmaps, setUserRoadmaps] = useState<UserRoadmap[]>([])

  const roadmapData: any = {
    ux: {
      id: 'ux',
      title: 'UX Designer',
      icon: '🔬',
      description: 'Kullanıcıyı anlama, doğru problemi tanımlama ve anlamlı çözümler üretme üzerine kurulu bir yolculuk.',
      href: '/roadmap/ux',
      color: 'rgba(222,255,55,0.1)',
      borderColor: 'rgba(222,255,55,0.2)',
      firstStep: {
        title: 'UX Nedir?',
        duration: '7 dakika',
        description: 'UX\'in sadece arayüz değil, bir problem çözme yaklaşımı olduğunu kavrayacaksın.'
      },
      nextStep: {
        title: 'Problem Tanımı',
        duration: '8 dakika',
        description: 'Doğru problemi tanımlamayı ve doğru soruları sormayı öğreneceksin.'
      }
    },
    ui: {
      id: 'ui',
      title: 'UI Designer',
      icon: '🎨',
      description: 'Görsel tasarım prensipleri, tipografi, renk teorisi ve modern arayüz tasarımı.',
      href: '/roadmap/ui',
      color: 'rgba(139,92,246,0.1)',
      borderColor: 'rgba(139,92,246,0.2)',
      firstStep: {
        title: 'UI Temelleri',
        duration: '8 dakika',
        description: 'Temel tasarım prensiplerini ve görsel hiyerarşiyi öğreneceksin.'
      },
      nextStep: {
        title: 'Renk Teorisi',
        duration: '10 dakika',
        description: 'Renklerin psikolojisini ve etkili kullanımını keşfedeceksin.'
      }
    },
    product: {
      id: 'product',
      title: 'Product Designer',
      icon: '💡',
      description: 'Ürün stratejisi, kullanıcı araştırması ve tasarım sistemlerini bir araya getiren yolculuk.',
      href: '/roadmap/product',
      color: 'rgba(34,197,94,0.1)',
      borderColor: 'rgba(34,197,94,0.2)',
      firstStep: {
        title: 'Product Design Nedir?',
        duration: '9 dakika',
        description: 'Ürün tasarımının kapsamını ve süreçlerini anlayacaksın.'
      },
      nextStep: {
        title: 'User Research',
        duration: '12 dakika',
        description: 'Kullanıcı araştırması metodlarını öğreneceksin.'
      }
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          window.location.href = '/auth'
          return
        }
        setUser(user)

        // Fetch quiz results to get recommended roadmap
        const { data: quizData } = await supabase
          .from('user_quiz_results')
          .select('recommended_roadmap')
          .eq('user_id', user.id)
          .single()

        if (quizData) {
          setRecommendedRoadmap(quizData.recommended_roadmap)
        }

        // Fetch user's progress - KRİTİK: Herhangi bir progress kaydı varsa segment 2'ye geç
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false })

        if (progressData && progressData.length > 0) {
          setCurrentProgress(progressData)
          setHasStarted(true) // Segment 2: 1%+ kullanıcı
        } else {
          setHasStarted(false) // Segment 1: 0% kullanıcı
        }

        // Fetch user's roadmaps
        const { data: roadmapsData } = await supabase
          .from('user_roadmaps')
          .select('*')
          .eq('user_id', user.id)

        if (roadmapsData) {
          setUserRoadmaps(roadmapsData)
        }

        // Fetch streak data
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (streakData) {
          setUserStreak(streakData)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }

    fetchUserData()

    // Auto-refresh when page becomes visible (roadmap'ten döndüğünde)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUserData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Yükleniyor...</p>
      </div>
    )
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'
  const primaryRoadmap = roadmapData[recommendedRoadmap] || roadmapData.ux

  // Calculate overall progress for primary roadmap
  const primaryProgress = currentProgress.filter(p => p.roadmap_slug === recommendedRoadmap)
  const totalSteps = 18 // Her roadmap için toplam adım sayısı
  const completedSteps = primaryProgress.filter(p => p.completed).length
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  // Get current step
  const currentStep = primaryProgress.find(p => !p.completed && p.progress_percentage > 0) || primaryProgress[0]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', position: 'relative', display: 'flex' }}>
      {/* Sidebar - HER ZAMAN GÖRÜNÜR */}
      <aside style={{
        width: '280px',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: 'auto'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px', textDecoration: 'none' }}>
          <Image src="/designatlas.svg" alt="Logo" width={36} height={36} />
          <span style={{ fontWeight: 700, fontSize: '17px', color: '#ffffff' }}>designatlas.io</span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span>🏠</span> Dashboard
          </Link>
        </nav>

        {/* Roadmaps Section */}
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '16px 16px 8px',
          marginBottom: '8px'
        }}>Roadmap'ler</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/roadmap/ux" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'rgba(222, 255, 55, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>🔬</span>
            UX Designer
          </Link>

          <Link href="/roadmap/ui" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>🎨</span>
            UI Designer
          </Link>

          <Link href="/roadmap/product" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>💡</span>
            Product Designer
          </Link>
        </nav>

        {/* User Section */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '12px', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #DEFF37 0%, #c8e632 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{userName}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s ease' }}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '280px', padding: '48px', maxWidth: '1200px', flex: 1 }}>
        {!hasStarted ? (
          /* ========== SEGMENT 1: 0% KULLANICI (Quiz bitmiş ama hiç başlamamış) ========== */
          <>
            <div style={{ marginBottom: '56px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
                Hoş geldin 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px' }}>
                Mini quiz sonuçlarına göre <span style={{ color: '#DEFF37', fontWeight: 600 }}>{primaryRoadmap.title}</span> yolculuğu senin için en uygun başlangıç.
              </p>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>
                Senin için önerilen yol
              </h2>

              <div style={{ background: `linear-gradient(135deg, ${primaryRoadmap.color} 0%, ${primaryRoadmap.color.replace('0.1', '0.05')} 100%)`, border: `1px solid ${primaryRoadmap.borderColor}`, borderRadius: '24px', padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '64px', height: '64px', background: primaryRoadmap.color.replace('0.1', '0.3'), borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', border: `2px solid ${primaryRoadmap.borderColor}` }}>
                    {primaryRoadmap.icon}
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>
                    {primaryRoadmap.title} Roadmap
                  </h3>
                </div>

                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                  {primaryRoadmap.description}
                </p>

                <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    💡 Bu yolculuk, sıfırdan başlayanlar ve kendini geliştirmek isteyenler için uygundur.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href={primaryRoadmap.href} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #DEFF37 0%, #c8e632 100%)', borderRadius: '12px', color: '#0a0a0a', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Bu yolculukla başla
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  <button onClick={() => setShowWhyRecommended(!showWhyRecommended)} style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Neden bunu önerdik?
                  </button>
                </div>

                {showWhyRecommended && (
                  <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                      Mini quiz'te verdiğin cevaplara göre kullanıcı odaklı düşünmeye yakınsın. Problem çözme ve araştırma tarafına ilgi duyuyorsun. Bu yüzden {primaryRoadmap.title} senin için en doğru başlangıç.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>İlk adım</h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  {primaryRoadmap.firstStep.title}
                </h3>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                  ⏱ {primaryRoadmap.firstStep.duration} • Mini pratik + küratörlü kaynak
                </div>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                  {primaryRoadmap.firstStep.description}
                </p>
                <Link href={primaryRoadmap.href} style={{ padding: '14px 28px', background: primaryRoadmap.color, border: `1px solid ${primaryRoadmap.borderColor}`, borderRadius: '12px', color: primaryRoadmap.id === 'ux' ? '#DEFF37' : primaryRoadmap.id === 'ui' ? '#A78BFA' : '#4ADE80', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  İlk adımı başlat →
                </Link>
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>
                Bu yolculukta seni neler bekliyor?
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { icon: '🎯', text: 'Gerçek problemler üzerinden düşünme' },
                    { icon: '⚡', text: 'Kısa mini pratiklerle öğrenme' },
                    { icon: '📚', text: 'Video ve makalelerden oluşan küratörlü kaynaklar' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', background: primaryRoadmap.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '20px' }}>
                İlerleme durumu
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 24px' }}>
                  📊
                </div>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                  Henüz bir adımı tamamlamadın.
                </p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
                  En önemli adım, ilk adımdır.
                </p>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>0%</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{primaryRoadmap.title} Roadmap</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>0 gün</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Öğrenme serisi</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Bu öneri sana uymuyor mu?</p>
                <button onClick={() => setShowChangeInterest(!showChangeInterest)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  İlgi alanımı değiştir
                </button>
              </div>

              {showChangeInterest && (
                <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Hangi roadmap'i keşfetmek istersin?</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {Object.values(roadmapData).filter((r: any) => r.id !== recommendedRoadmap).map((roadmap: any) => (
                      <Link key={roadmap.id} href={roadmap.href} style={{ padding: '12px 20px', background: roadmap.color, border: `1px solid ${roadmap.borderColor}`, borderRadius: '10px', color: roadmap.id === 'ux' ? '#DEFF37' : roadmap.id === 'ui' ? '#A78BFA' : '#4ADE80', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                        {roadmap.icon} {roadmap.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ========== SEGMENT 2: 1%+ KULLANICI (Herhangi bir ilerleme kaydı var) ========== */
          <>
            {/* HERO - Full Width */}
            <div style={{ marginBottom: '40px', padding: '40px', background: `linear-gradient(135deg, ${primaryRoadmap.color.replace('0.1', '0.08')} 0%, ${primaryRoadmap.color.replace('0.1', '0.02')} 100%)`, border: `1px solid ${primaryRoadmap.borderColor}`, borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px' }}>👋</span>
                <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Kaldığın yerden devam edelim
                </h1>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', marginBottom: '24px' }}>
                {primaryRoadmap.title} yolculuğunda ilerliyorsun. Güzel gidiyor.
              </p>
              <Link href={primaryRoadmap.href} style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #DEFF37 0%, #c8e632 100%)', borderRadius: '12px', color: '#0a0a0a', textDecoration: 'none', fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 30px rgba(222,255,55,0.3)' }}>
                Kaldığın yerden devam et
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* GRID ROW 1 - 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* KART 1: Kaldığın Yer */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px' }}>📘</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Kaldığın yer</h2>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>{primaryRoadmap.title} Roadmap</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Adım: {currentStep?.step_title || primaryRoadmap.firstStep.title}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{currentStep?.progress_percentage || 0}% tamamlandı</span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>⏱ Kalan süre: ~{Math.max(5 - Math.round((currentStep?.progress_percentage || 0) / 20), 1)} dk</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${currentStep?.progress_percentage || 0}%`, background: 'linear-gradient(90deg, #DEFF37 0%, #c8e632 100%)', borderRadius: '100px', boxShadow: '0 0 15px rgba(222,255,55,0.4)' }} />
                  </div>
                </div>

                <Link href={primaryRoadmap.href} style={{ padding: '14px 28px', background: 'rgba(222,255,55,0.15)', border: '1px solid rgba(222,255,55,0.3)', borderRadius: '12px', color: '#DEFF37', textDecoration: 'none', fontWeight: 600, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Devam et →
                </Link>
              </div>

              {/* KART 2: Streak & Progress */}
              <div style={{ background: 'linear-gradient(135deg, rgba(255,100,50,0.08) 0%, rgba(255,100,50,0.02) 100%)', border: '1px solid rgba(255,100,50,0.15)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', margin: '8px 0 0 0' }}>Öğrenme Serisi</h2>
                </div>

                <div style={{ fontSize: '48px', fontWeight: 800, color: '#ffffff', margin: '16px 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '40px' }}>🔥</span> {userStreak?.current_streak || 0} Gün
                </div>

                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                  {userStreak?.current_streak ? 'Aralıksız öğreniyorsun' : 'Öğrenmeye başla'}
                </p>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    <span>📊</span>
                    <span>{primaryRoadmap.title} · {progressPercentage}% tamamlandı</span>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: 0 }}>
                  İstikrar, yetenekten daha hızlı geliştirir.
                </p>
              </div>
            </div>

            {/* GRID ROW 2 - 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* KART 3: Sıradaki Adım */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '22px' }}>⏭️</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Sıradaki adım</h2>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  {primaryRoadmap.nextStep.title}
                </h3>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
                  ⏱ {primaryRoadmap.nextStep.duration}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {primaryRoadmap.nextStep.description}
                </p>
                <Link href={primaryRoadmap.href} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 600, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Bu adıma göz at →
                </Link>
              </div>

              {/* KART 4: Bugünkü Mini Pratik */}
              <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '22px' }}>✍️</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: 0 }}>Bugünkü mini pratik</h2>
                </div>

                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Son kullandığın bir uygulamada bir UX problemi tespit et.
                </p>

                <button style={{ padding: '12px 24px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '10px', color: '#4ADE80', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>
                  3 dakikada yap
                </button>

                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                  Bugün için tek mini pratik gösterilir.
                </p>
              </div>
            </div>

            {/* KART 5: Roadmap Overview - Full Width */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🗺️</span>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    {primaryRoadmap.title} Roadmap · {completedSteps} / {totalSteps} adım tamamlandı
                  </p>
                </div>
                <Link href={primaryRoadmap.href} style={{ color: '#DEFF37', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                  Tüm roadmap'i gör →
                </Link>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercentage}%`, background: 'linear-gradient(90deg, #DEFF37 0%, #c8e632 100%)', borderRadius: '100px' }} />
              </div>
            </div>

            {/* KART 6: Diğer Roadmap'ler */}
            {userRoadmaps.length > 1 && (
              <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', marginBottom: '16px' }}>Takip ettiğin diğer roadmap'ler</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {userRoadmaps.filter(r => r.roadmap_slug !== recommendedRoadmap).map(roadmap => {
                    const data = roadmapData[roadmap.roadmap_slug]
                    return (
                      <Link key={roadmap.roadmap_slug} href={data.href} style={{ padding: '12px 20px', background: data.color, border: `1px solid ${data.borderColor}`, borderRadius: '10px', color: data.id === 'ux' ? '#DEFF37' : data.id === 'ui' ? '#A78BFA' : '#4ADE80', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                        {data.icon} {data.title}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* KART 7: Yolculuk Değiştir - Low Emphasis */}
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Başka bir roadmap'e göz atmak ister misin?</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Object.values(roadmapData).filter((r: any) => !userRoadmaps.find(ur => ur.roadmap_slug === r.id)).map((roadmap: any) => (
                  <Link key={roadmap.id} href={roadmap.href} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>
                    {roadmap.icon} {roadmap.title}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
