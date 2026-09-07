import React from 'react';
import { Store, LogIn, UserPlus, KeyRound, Sparkles, Coffee, ArrowRight, Award, Sun, Moon } from 'lucide-react';
import img1 from '../assets/img/1.jpg';
import img2 from '../assets/img/2.jpg';
import img3 from '../assets/img/3.jpg';
import img4 from '../assets/img/4.jpg';
import foodHero from '../assets/img/food1.jpg';

export default function LandingPageView({ onOpenLogin, onOpenSignup, onOpenForgotPassword, onEnterApp, user, theme, toggleTheme }) {
  const scrollToBestSellers = () => {
    const el = document.getElementById('best-sellers-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Sticky Public Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 14, 19, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-amber) 0%, #b45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 0 16px var(--accent-glow)'
            }}>
              <Store size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Cafe Management System
                <span className="badge badge-amber" style={{ fontSize: '10px', padding: '2px 6px' }}>V2.0</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enterprise REST & POS Platform</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} className="text-amber" />
                  <span className="hidden-mobile">Light</span>
                </>
              ) : (
                <>
                  <Moon size={15} style={{ color: 'var(--accent-amber)' }} />
                  <span className="hidden-mobile">Dark</span>
                </>
              )}
            </button>

            <button className="btn btn-ghost" onClick={scrollToBestSellers}>
              <Sparkles size={16} className="text-amber" />
              <span>Best Sellers</span>
            </button>

            {user ? (
              <button className="btn btn-primary" onClick={onEnterApp}>
                <span>Go to Workspace ({user.name})</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={onOpenForgotPassword} title="Recover account credentials">
                  <KeyRound size={16} />
                  <span className="hidden-mobile">Forgot Password</span>
                </button>
                <button className="btn btn-secondary" onClick={onOpenSignup}>
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
                <button className="btn btn-primary" onClick={onOpenLogin}>
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero Section */}
        <section
          className="landing-hero"
          style={{ backgroundImage: `url(${foodHero})` }}
        >
          <div className="landing-hero-content">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '20px'
            }}>
              <Coffee size={15} />
              <span>Full-Stack Cafe Management & Point of Sale</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.03em' }}>
              Artisanal Delights Meet <br />
              <span style={{
                background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Seamless Operations
              </span>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }}>
              From fast takeaway ordering and live kitchen displays to dynamic invoice generation, thermal receipt printing, and comprehensive catalog management.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={onEnterApp}>
                <span>Launch Cafe App</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={scrollToBestSellers}>
                <span>Explore Best Sellers</span>
              </button>
            </div>
          </div>
        </section>

        {/* Best Seller Section (Angular Component Equivalent) */}
        <section id="best-sellers-section" style={{ padding: '40px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--accent-amber)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}>
              <Award size={16} />
              <span>Customer Favorites</span>
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Best Seller
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--accent-amber)', margin: '12px auto 0', borderRadius: '2px' }} />
          </div>

          {/* Timeline */}
          <ul className="timeline">
            {/* 1. Pizza */}
            <li>
              <div className="timeline-image">
                <img src={img1} alt="Wood-fired Pizza" />
              </div>
              <div className="timeline-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge badge-amber">Italian Classic</span>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Pizza</h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Pizza is an Italian dish consisting of a usually round, flattened base of leavened wheat-based dough topped with tomatoes, cheese, and often various other ingredients, which is then baked at a high temperature, traditionally in a wood-fired oven. A small pizza is sometimes called a pizzetta.
                </p>
              </div>
            </li>

            {/* 2. Biryani */}
            <li className="timeline-inverted">
              <div className="timeline-image">
                <img src={img2} alt="Aromatic Biryani" />
              </div>
              <div className="timeline-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Biryani</h4>
                  <span className="badge badge-amber">Signature Rice</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Biryani is a mixed rice dish. It is made with Indian spices, rice, and meat usually that of chicken, fish, and sometimes, in addition, eggs or vegetables such as potatoes in certain regional varieties.
                </p>
              </div>
            </li>

            {/* 3. Pasta */}
            <li>
              <div className="timeline-image">
                <img src={img3} alt="Handcrafted Pasta" />
              </div>
              <div className="timeline-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginBottom: '8px' }}>
                  <span className="badge badge-amber">Handmade Dough</span>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Pasta</h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Pasta is a type of food typically made from an unleavened dough of wheat flour mixed with water or eggs, and formed into sheets or other shapes, then cooked by boiling or baking.
                </p>
              </div>
            </li>

            {/* 4. Molten Chocolate Cake */}
            <li className="timeline-inverted">
              <div className="timeline-image">
                <img src={img4} alt="Molten Chocolate Lava Cake" />
              </div>
              <div className="timeline-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Molten Chocolate Cake</h4>
                  <span className="badge badge-amber">Warm Lava Core</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  Molten chocolate cake is a popular dessert that combines the elements of a chocolate cake and a soufflé. Its name derives from the dessert's liquid chocolate center, and it is also known as chocolate moelleux, chocolate lava cake, or simply lava cake.
                </p>
              </div>
            </li>

            {/* 5. Badge */}
            <li className="timeline-inverted">
              <div className="timeline-image badge-circle">
                <div>
                  Be Part<br />Of Our<br />Cafe!
                </div>
              </div>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer (matching Angular footer) */}
      <footer style={{
        marginTop: '60px',
        padding: '32px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-amber)' }}>
          <Store size={20} />
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Cafe Management System</span>
        </div>
        <h2 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', margin: 0 }}>
          All right reserved @BTech Days
        </h2>
      </footer>
    </div>
  );
}
