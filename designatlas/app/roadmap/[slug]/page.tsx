'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

// Roadmap verileri
const roadmapData: any = {
  ux: {
    title: 'UX Designer',
    icon: '🔬',
    color: 'rgba(222, 255, 55, 0.1)',
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

export default function RoadmapPage() {
  const params = useParams()
  const slug = params.slug as string
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<any>({})
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<string[]>([])

  const roadmap = roadmapData[slug]

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth'
        return
      }
      setUser(user)
      
      // İlerleme verilerini çek
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('roadmap_id', slug)
      
      if (data) {
        const progressMap: any = {}
        data.forEach((item: any) => {
          progressMap[item.step_id] = item.status
        })
        setProgress(progressMap)
      }
    }
    getUser()
    
    // İlk section'ı aç
    if (roadmap?.sections?.length > 0) {
      setOpenSections([roadmap.sections[0].id])
    }
  }, [slug, roadmap])

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleStepStatus = async (stepId: string) => {
    if (!user) return
    
    const currentStatus = progress[stepId]
    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    
    setProgress((prev: any) => ({ ...prev, [stepId]: newStatus }))
    
    // Supabase'e kaydet
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        roadmap_id: slug,
        step_id: stepId,
        status: newStatus,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,roadmap_id,step_id'
      })
    
    if (error) console.error('Progress update error:', error)
  }

  if (!roadmap) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Roadmap bulunamadı</p>
      </div>
    )
  }

  // İlerleme hesapla
  const totalSteps = roadmap.sections.reduce((acc: number, section: any) => acc + section.steps.length, 0)
  const completedSteps = Object.values(progress).filter((status: any) => status === 'done').length
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Mini Sidebar */}
      <aside style={{
        width: '72px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0
      }}>
        <Link href="/" style={{ marginBottom: '24px' }}>
          <Image src="/designatlas.svg" alt="Logo" width={36} height={36} />
        </Link>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/dashboard" style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'var(--text-muted)',
            textDecoration: 'none'
          }}>🏠</Link>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)'
          }}>🗺️</div>
          <Link href="#" style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'var(--text-muted)',
            textDecoration: 'none'
          }}>🔖</Link>
        </nav>
      </aside>

      {/* Roadmap Navigation */}
      <nav style={{
        width: '300px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        marginLeft: '72px',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        top: 0
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: roadmap.color,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>{roadmap.icon}</div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{roadmap.title}</h1>
          </div>
          
          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              flex: 1,
              height: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{progressPercent}%</span>
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding: '16px 12px' }}>
          {roadmap.sections.map((section: any) => (
            <div key={section.id} style={{ marginBottom: '8px' }}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <span style={{ fontSize: '16px' }}>{section.icon}</span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {section.title}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '8px' }}>
                  {section.steps.filter((s: any) => progress[s.id] === 'done').length}/{section.steps.length}
                </span>
                <span style={{
                  color: 'var(--text-muted)',
                  transform: openSections.includes(section.id) ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}>›</span>
              </button>

              {/* Steps */}
              {openSections.includes(section.id) && (
                <div style={{ marginTop: '4px', marginLeft: '20px', borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
                  {section.steps.map((step: any) => (
                    <div
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: activeStep === step.id ? 'var(--bg-secondary)' : 'transparent',
                        marginBottom: '2px'
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStepStatus(step.id)
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: progress[step.id] === 'done' ? 'none' : '2px solid var(--border-color)',
                          backgroundColor: progress[step.id] === 'done' ? 'var(--primary)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-on-primary)',
                          fontSize: '12px'
                        }}
                      >
                        {progress[step.id] === 'done' && '✓'}
                      </button>
                      <span style={{
                        flex: 1,
                        fontSize: '13px',
                        color: activeStep === step.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}>{step.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        marginLeft: '372px',
        flex: 1,
        padding: '32px 40px',
        maxWidth: '800px'
      }}>
        {activeStep ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <Link href="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px' }}>
                Dashboard
              </Link>
              <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>›</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{roadmap.title}</span>
              <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>›</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {roadmap.sections.flatMap((s: any) => s.steps).find((s: any) => s.id === activeStep)?.title}
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '32px' }}>
              {roadmap.sections.flatMap((s: any) => s.steps).find((s: any) => s.id === activeStep)?.title}
            </h1>

            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                💡 Bu Neden Önemli?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7 }}>
                Bu konu, tasarım kariyerinin temel yapı taşlarından biridir. 
                Öğrendiğin kavramları gerçek projelerde uygulayarak deneyim kazanacaksın.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                📝 Notlarım
              </h2>
              <textarea
                placeholder="Bu adımla ilgili notlarını buraya yaz..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{roadmap.icon}</div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {roadmap.title} Roadmap
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              Soldaki menüden bir adım seçerek öğrenmeye başla
            </p>
          </div>
        )}
      </main>
    </div>
  )
}