'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth'
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>
      </div>
    )
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
          paddingLeft: '8px'
        }}>
          <Image src="/designatlas.svg" alt="Logo" width={32} height={32} />
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
            designatlas.io
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500
          }}>
            <span>🏠</span> Dashboard
          </Link>

          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '16px 16px 8px',
            marginTop: '8px'
          }}>Roadmap'ler</div>

          <Link href="/roadmap/ux" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
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
            color: 'var(--text-secondary)',
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
            color: 'var(--text-secondary)',
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

        {/* User */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-on-primary)',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{userName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '8px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Merhaba, {userName} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Öğrenme yolculuğunda bugün ne keşfedeceksin?
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { icon: '📚', value: '0', label: 'Tamamlanan Adım', color: 'rgba(222, 255, 55, 0.1)' },
            { icon: '🔥', value: '0 gün', label: 'Öğrenme Serisi', color: 'rgba(34, 197, 94, 0.1)' },
            { icon: '🔖', value: '0', label: 'Bookmark', color: 'rgba(245, 158, 11, 0.1)' },
            { icon: '📝', value: '0', label: 'Not', color: 'rgba(139, 92, 246, 0.1)' }
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: stat.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmaps */}
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Öğrenmeye Başla
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {[
            { icon: '🔬', title: 'UX Designer', desc: 'Kullanıcı deneyimi tasarımı', color: 'rgba(222, 255, 55, 0.1)', href: '/roadmap/ux' },
            { icon: '🎨', title: 'UI Designer', desc: 'Arayüz tasarımı', color: 'rgba(139, 92, 246, 0.1)', href: '/roadmap/ui' },
            { icon: '💡', title: 'Product Designer', desc: 'Ürün tasarımı', color: 'rgba(34, 197, 94, 0.1)', href: '/roadmap/product' }
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px',
              textDecoration: 'none',
              display: 'block'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: item.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                marginBottom: '16px'
              }}>{item.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</p>
              <div style={{ marginTop: '16px', color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}>
                Başla →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}