import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
}}>
  <Image 
    src="/designatlas.svg" 
    alt="DesignAtlas" 
    width={45} 
    height={45}
    priority
  />
  <span style={{
    fontFamily: 'Inter, sans-serif',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)'
  }}>
    designatlas.io
  </span>
</div>
        <Link href="/auth" style={{
          padding: '12px 28px',
          backgroundColor: 'var(--primary)',
          color: 'var(--text-on-primary)',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px'
        }}>
          Giriş Yap
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          backgroundColor: 'rgba(222, 255, 55, 0.1)',
          border: '1px solid rgba(222, 255, 55, 0.3)',
          borderRadius: '100px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--primary)',
          marginBottom: '32px'
        }}>
          🚀 Türkiye'nin ilk interaktif tasarım öğrenme platformu
        </div>
        
        <h1 style={{
          fontSize: '56px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.15,
          marginBottom: '24px'
        }}>
          Tasarım kariyerine<br />
          <span style={{ color: 'var(--primary)' }}>doğru adımla</span> başla
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '550px',
          margin: '0 auto 48px',
          lineHeight: 1.7
        }}>
          UX, UI ve Product Design alanlarında kendini geliştir. 
          Kendi hızında ilerle, notlar al, pratik yap.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/auth" style={{
            padding: '16px 36px',
            backgroundColor: 'var(--primary)',
            color: 'var(--text-on-primary)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Ücretsiz Başla →
          </Link>
          <Link href="#roadmaps" style={{
            padding: '16px 36px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            border: '1px solid var(--border-color)'
          }}>
            Roadmap'leri Gör
          </Link>
        </div>
      </section>

      {/* Roadmaps Section */}
      <section id="roadmaps" style={{
        padding: '100px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          Sana uygun yolu seç
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '56px',
          fontSize: '17px'
        }}>
          Her roadmap, sıfırdan ileri seviyeye götüren adım adım bir rehber.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* UX Designer Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(222, 255, 55, 0.1)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '24px'
            }}>🔬</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>UX Designer</h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              fontSize: '15px',
              lineHeight: 1.7
            }}>
              Kullanıcı araştırmasından wireframe'e, 
              test'ten iterasyona. Deneyim tasarımının temellerini öğren.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              {['Research', 'Wireframing', 'Testing'].map(tag => (
                <span key={tag} style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>{tag}</span>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>21 adım</span>
              <Link href="/auth" style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px'
              }}>Başla →</Link>
            </div>
          </div>

          {/* UI Designer Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '24px'
            }}>🎨</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>UI Designer</h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              fontSize: '15px',
              lineHeight: 1.7
            }}>
              Tipografi, renk teorisi, görsel hiyerarşi. 
              Göze hitap eden, kullanılabilir arayüzler tasarla.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              {['Typography', 'Color', 'Components'].map(tag => (
                <span key={tag} style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>{tag}</span>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>18 adım</span>
              <Link href="/auth" style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px'
              }}>Başla →</Link>
            </div>
          </div>

          {/* Product Designer Card */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid var(--border-color)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '24px'
            }}>💡</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>Product Designer</h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              fontSize: '15px',
              lineHeight: 1.7
            }}>
              UX + UI + Business. Strateji ve tasarımı birleştir, 
              end-to-end ürün geliştirmeyi öğren.
            </p>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '24px'
            }}>
              {['Strategy', 'Metrics', 'Delivery'].map(tag => (
                <span key={tag} style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>{tag}</span>
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>24 adım</span>
              <Link href="/auth" style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px'
              }}>Başla →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '48px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        marginTop: '80px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          © 2025 DesignAtlas. Türkiye'de 💚 ile yapıldı.
        </p>
      </footer>
    </div>
  )
}