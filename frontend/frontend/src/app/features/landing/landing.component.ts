import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="lp">

    <!-- ══════════════════════════════════════════════
         NAVBAR
    ══════════════════════════════════════════════ -->
    <nav class="lp-nav">
      <div class="lp-nav-inner">
        <a routerLink="/home" class="nav-logo">
          <img src="assets/logo.png" alt="Hsys Solutions" class="logo-img"/>
                  </a>
        <ul class="nav-links"></ul>
        <div class="nav-actions">
          <a routerLink="/login"    class="nav-login">Se connecter</a>
          <a routerLink="/register" class="nav-signup">S'inscrire</a>
        </div>
      </div>
    </nav>

    <!-- ══════════════════════════════════════════════
         HERO  (Jadoo two-column layout)
    ══════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-left">

        <!-- Small category label (Jadoo pattern) -->
        <p class="hero-cat">
          <span class="hero-cat-dot"></span>
          PLATEFORME D'INTELLIGENCE ARTIFICIELLE
        </p>

        <!-- Large heading with SVG underline on accent word -->
        <h1 class="hero-h1">
          Évaluez la
          <span class="h1-deco">
            maturité
            <svg class="deco-underline" viewBox="0 0 190 10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M4,7 Q50,1 95,6 Q140,11 186,4" stroke="#F1A501" stroke-width="3.5"
                    fill="none" stroke-linecap="round"/>
            </svg>
          </span>
          digitale<br>de vos clients
        </h1>

        <p class="hero-desc">
          IA Benchmark génère automatiquement des questionnaires personnalisés, calcule
          un score de maturité et produit des recommandations stratégiques grâce à
          l'intelligence artificielle.
        </p>

        <!-- CTA row (Jadoo: primary button + play-circle ghost) -->
        <div class="hero-ctas">
          <a routerLink="/register" class="cta-primary">
            <i class="fas fa-rocket"></i> Démarrer l'évaluation
          </a>
          <a routerLink="/login" class="cta-ghost">
            <span class="play-circle"><i class="fas fa-play"></i></span>
            Se connecter
          </a>
        </div>

        <!-- Trust badges -->
        <div class="trust-row">
          <span class="trust-item"><i class="fas fa-shield-alt"></i> Données sécurisées</span>
          <span class="trust-sep">·</span>
          <span class="trust-item"><i class="fas fa-brain"></i> IA générative</span>
          <span class="trust-sep">·</span>
          <span class="trust-item"><i class="fas fa-globe"></i> 360° sectoriel</span>
        </div>

      </div><!-- /hero-left -->

      <!-- Right side: floating card mockup + decorations (Jadoo photo+deco) -->
      <div class="hero-right">

        <!-- Dot grid decorations -->
        <div class="dots-grid dots-tr" aria-hidden="true">
          <span *ngFor="let d of dots" class="dot"></span>
        </div>
        <div class="dots-grid dots-bl" aria-hidden="true">
          <span *ngFor="let d of dots" class="dot dot-blue"></span>
        </div>

        <!-- Hero image -->
        <div class="mockup-img-wrap">
          <img src="assets/benchmarking-empresas.jpg" alt="Benchmarking dashboard" class="hero-mockup-img"/>
        </div>

      </div><!-- /hero-right -->
    </section>

    <!-- ══════════════════════════════════════════════
         SECTORS BAR  (like Jadoo partner logos)
    ══════════════════════════════════════════════ -->
    <div class="sectors-bar">
      <p class="sbar-label">Secteurs évalués</p>
      <div class="sbar-logos">
        <span *ngFor="let s of sectorLogos" class="sbar-item">
          <i class="fas" [class]="s.icon"></i> {{ s.name }}
        </span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════
         SERVICES  (Jadoo "We Offer Best Services")
    ══════════════════════════════════════════════ -->
    <section id="services" class="services-section">
      <div class="sec-container">
        <div class="sec-head">
          <p class="sec-label">NOS SERVICES</p>
          <h2 class="sec-h2">Nous offrons les meilleurs<br>services d'évaluation</h2>
          <p class="sec-sub">Une plateforme complète pensée pour les consultants et leurs entreprises clientes.</p>
        </div>
        <div class="srv-grid">
          <div class="srv-card" *ngFor="let s of services">
            <div class="srv-icon-wrap" [style.background]="s.bg">
              <i class="fas" [class]="s.icon" [style.color]="s.color"></i>
            </div>
            <h3 class="srv-title">{{ s.title }}</h3>
            <p class="srv-desc">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         TOP SECTORS  (Jadoo "Top Destinations")
    ══════════════════════════════════════════════ -->
    <section id="sectors" class="top-sectors-section">
      <div class="sec-container">
        <div class="sec-head">
          <p class="sec-label">TOP SECTEURS</p>
          <h2 class="sec-h2">Secteurs disponibles<br>pour le benchmarking</h2>
        </div>
        <div class="sector-cards">
          <div class="sector-card" *ngFor="let s of topSectors">
            <!-- Image-like gradient area (Jadoo's photo top) -->
            <div class="sc-visual" [style.background]="s.gradient">
              <div class="sc-deco-ring"></div>
              <i class="fas sc-big-icon" [class]="s.icon"></i>
            </div>
            <!-- Info area (Jadoo's card bottom) -->
            <div class="sc-info">
              <div class="sc-meta">
                <div class="sc-companies">
                  <i class="fas fa-building"></i> {{ s.count }} entreprises
                </div>
                <div class="sc-duration">
                  <i class="fas fa-clock"></i> ~20 questions
                </div>
              </div>
              <h4 class="sc-name">{{ s.name }}</h4>
              <p class="sc-desc">{{ s.desc }}</p>
              <a routerLink="/register" class="sc-link">
                Évaluer ce secteur <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         STEPS  (Jadoo "Book in 3 Easy Steps")
    ══════════════════════════════════════════════ -->
    <section id="steps" class="steps-section">
      <div class="sec-container steps-inner">

        <!-- Left: steps list -->
        <div class="steps-left">
          <p class="sec-label">SIMPLE ET RAPIDE</p>
          <h2 class="sec-h2">Évaluez vos clients<br>en 4 étapes faciles</h2>

          <div class="step-list">
            <div class="step-item" *ngFor="let step of steps; let i = index"
                 [class.step-active]="i === 1">
              <div class="step-indicator" [style.background]="step.color"></div>
              <div class="step-body">
                <div class="step-num" [style.color]="step.color">{{ step.num }}</div>
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: floating result card (Jadoo's booking card) -->
        <div class="steps-right">
          <!-- Decorative dots -->
          <div class="dots-grid dots-steps-tr" aria-hidden="true">
            <span *ngFor="let d of dots" class="dot dot-orange"></span>
          </div>

          <!-- Result image -->
          <div class="result-img-wrap">
            <img src="assets/secondimage.png" alt="Résultat évaluation" class="steps-result-img"/>
          </div>

        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         STATS  (Jadoo-style clean numbers)
    ══════════════════════════════════════════════ -->
    <section class="stats-section">
      <div class="sec-container">
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let s of stats">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         CTA  (Jadoo subscribe section)
    ══════════════════════════════════════════════ -->
    <section class="cta-section">
      <div class="sec-container">
        <div class="cta-card">
          <div class="cta-glow"></div>
          <p class="cta-label">COMMENCEZ DÈS AUJOURD'HUI</p>
          <h2 class="cta-h2">Prêt à évaluer votre<br>premier client ?</h2>
          <p class="cta-sub">Inscrivez-vous en tant que consultant. L'IA fait le reste.</p>
          <div class="cta-actions">
            <a routerLink="/register" class="cta-btn-white">
              <i class="fas fa-user-plus"></i> Créer mon compte consultant
            </a>
            <a routerLink="/login" class="cta-btn-ghost">
              J'ai déjà un compte <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════
         FOOTER  (Jadoo multi-column)
    ══════════════════════════════════════════════ -->
    <footer class="lp-footer">
      <div class="sec-container footer-inner">

        <!-- Brand col -->
        <div class="footer-brand-col">
          <div class="footer-logo">
            <img src="assets/logo.png" alt="Hsys Solutions" class="footer-logo-img"/>
                      </div>
          <p class="footer-tagline">
            Plateforme d'évaluation de la maturité digitale, propulsée par l'intelligence artificielle.
          </p>
          <div class="footer-socials">
            <a href="#" class="social-btn"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-github"></i></a>
          </div>
        </div>


      </div>
      <div class="footer-bottom">
        <p>© 2026 IA Benchmark — Tous droits réservés</p>
      </div>
    </footer>

  </div><!-- /lp -->
  `,
  styles: [`
    /* ─── Google Font import ─── */
    @import url('https://fonts.googleapis.com/css2?family=Volkhov:wght@400;700&family=Poppins:wght@400;500;600;700;800;900&display=swap');

    /* ─── Base ─── */
    .lp {
      font-family: 'Poppins', 'Inter', 'Segoe UI', sans-serif;
      background: #fff;
      color: #5E6282;
      overflow-x: hidden;
    }
    .sec-container { max-width: 1160px; margin: 0 auto; padding: 0 32px; }

    /* ──────────────────────────────
       NAVBAR
    ────────────────────────────── */
    .lp-nav {
      position: sticky; top: 0; z-index: 200;
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid #f1f5f9;
    }
    .lp-nav-inner {
      max-width: 1160px; margin: 0 auto; padding: 18px 32px;
      display: flex; align-items: center; justify-content: space-between; gap: 24px;
    }
    .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .logo-img { height:48px; width:auto; flex-shrink:0; object-fit:contain; }
    .logo-text {
      font-size:22px; font-weight:400; color:#3d3d3d;
      font-family: 'Georgia', 'Times New Roman', serif;
      font-style: italic;
      letter-spacing: 0.5px;
    }

    .nav-links {
      display:flex; list-style:none; margin:0; padding:0; gap:36px;
    }
    .nav-links a {
      font-size:14px; font-weight:500; color:#5E6282;
      text-decoration:none; transition:color .2s;
    }
    .nav-links a:hover { color:#6366f1; }

    .nav-actions { display:flex; align-items:center; gap:14px; }
    .nav-login {
      font-size:14px; font-weight:600; color:#181E4B;
      text-decoration:none; transition:color .2s;
    }
    .nav-login:hover { color:#6366f1; }
    .nav-signup {
      font-size:14px; font-weight:700; padding:10px 22px; border-radius:8px;
      border: 1.5px solid #181E4B; color:#181E4B; text-decoration:none;
      transition:background .2s, color .2s, border-color .2s;
    }
    .nav-signup:hover { background:#181E4B; color:#fff; }

    /* ──────────────────────────────
       HERO
    ────────────────────────────── */
    .hero {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 64px;
      align-items: center;
      max-width: 1160px; margin: 0 auto;
      padding: 80px 32px 100px;
    }

    /* Left */
    .hero-cat {
      display:inline-flex; align-items:center; gap:10px;
      font-size:12px; font-weight:700; color:#6366f1;
      letter-spacing:1.2px; text-transform:uppercase;
      margin-bottom:22px;
    }
    .hero-cat-dot {
      width:10px; height:10px; border-radius:50%;
      background:#F1A501;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }

    .hero-h1 {
      font-family: 'Volkhov', 'Georgia', serif;
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      color: #181E4B;
      letter-spacing: -.5px;
      margin-bottom: 22px;
    }
    .h1-deco {
      position: relative;
      display: inline-block;
      color: #181E4B;
    }
    .deco-underline {
      position: absolute;
      bottom: -4px; left: 0;
      width: 100%; height: 10px;
      display: block;
    }

    .hero-desc {
      font-size: 16px; line-height: 1.8;
      color: #5E6282;
      max-width: 460px;
      margin-bottom: 36px;
    }

    .hero-ctas { display:flex; align-items:center; gap:20px; flex-wrap:wrap; margin-bottom:34px; }
    .cta-primary {
      display:inline-flex; align-items:center; gap:10px;
      padding:15px 28px; border-radius:10px; font-size:15px; font-weight:700;
      background: linear-gradient(135deg,#6366f1,#7c3aed);
      color:#fff; text-decoration:none;
      box-shadow: 0 8px 32px rgba(26,86,219,.32);
      transition: transform .15s, box-shadow .15s;
    }
    .cta-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(26,86,219,.42); color:#fff; }

    .cta-ghost {
      display:inline-flex; align-items:center; gap:14px;
      font-size:15px; font-weight:600; color:#5E6282;
      text-decoration:none; transition:color .2s;
    }
    .cta-ghost:hover { color:#6366f1; }
    .play-circle {
      width:50px; height:50px; border-radius:50%;
      background: #fff;
      box-shadow: 0 8px 28px rgba(26,86,219,.2);
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0;
    }
    .play-circle i { font-size:14px; color:#6366f1; margin-left:2px; }

    .trust-row { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
    .trust-item { display:flex; align-items:center; gap:6px; font-size:13px; color:#94a3b8; }
    .trust-item i { color:#6366f1; }
    .trust-sep { color:#e2e8f0; }

    /* Right */
    .hero-right {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Dot grids (Jadoo orange dots) */
    .dots-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 9px;
      position: absolute;
      z-index: 0;
      pointer-events: none;
    }
    .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #F1A501; opacity: .55;
    }
    .dot-blue  { background: #c7d2fe; opacity:.7; }
    .dot-orange { background: #F1A501; }
    .dots-tr { top: -20px; right: -24px; }
    .dots-bl { bottom: 16px; left: -24px; }
    .dots-steps-tr { top: -20px; right: -20px; }

    /* Hero image */
    .mockup-img-wrap {
      position: relative; z-index: 5;
      width: 100%; max-width: 440px;
    }
    .hero-mockup-img {
      width: 100%; height: auto;
      border-radius: 20px;
      box-shadow: 0 32px 100px rgba(99,102,241,.18), 0 0 0 1px #ede9fe;
      object-fit: cover;
      display: block;
    }

    /* ──────────────────────────────
       SECTORS BAR
    ────────────────────────────── */
    .sectors-bar {
      border-top: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
      padding: 24px 32px;
      display: flex; align-items: center; gap: 40px; flex-wrap: wrap;
      max-width: 1160px; margin: 0 auto;
    }
    .sbar-label { font-size:13px; color:#94a3b8; font-weight:600; white-space:nowrap; margin:0; }
    .sbar-logos { display:flex; align-items:center; gap:36px; flex-wrap:wrap; }
    .sbar-item {
      font-size:14px; font-weight:700; color:#B1B5C3;
      display:flex; align-items:center; gap:7px;
      transition:color .2s;
    }
    .sbar-item:hover { color:#6366f1; }
    .sbar-item i { font-size:16px; }

    /* ──────────────────────────────
       SERVICES SECTION
    ────────────────────────────── */
    .services-section { padding: 100px 0; background: #F7F8FC; }
    .sec-head { text-align:center; max-width:600px; margin:0 auto 64px; }
    .sec-label {
      font-size:12px; font-weight:700; letter-spacing:1.5px;
      color:#5E6282; text-transform:uppercase;
      margin-bottom:12px;
    }
    .sec-h2 {
      font-family:'Volkhov','Georgia',serif;
      font-size:2.2rem; font-weight:700;
      color:#181E4B; line-height:1.3;
      margin-bottom:14px;
    }
    .sec-sub { font-size:15px; color:#5E6282; line-height:1.7; margin:0; }

    .srv-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
    .srv-card {
      background:#fff; border-radius:18px; padding:30px 24px;
      box-shadow: 0 30px 60px rgba(0,0,0,.05);
      transition:transform .2s, box-shadow .2s;
    }
    .srv-card:hover { transform:translateY(-5px); box-shadow:0 40px 80px rgba(0,0,0,.1); }
    .srv-icon-wrap {
      width:52px; height:52px; border-radius:14px;
      display:flex; align-items:center; justify-content:center;
      font-size:22px; margin-bottom:20px;
    }
    .srv-title { font-size:15px; font-weight:700; color:#181E4B; margin-bottom:10px; }
    .srv-desc  { font-size:13px; color:#5E6282; line-height:1.65; margin:0; }

    /* ──────────────────────────────
       TOP SECTORS
    ────────────────────────────── */
    .top-sectors-section { padding: 100px 0; background: #fff; }
    .sector-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
    .sector-card {
      border-radius:20px; overflow:hidden;
      box-shadow: 0 60px 100px rgba(0,0,0,.07);
      transition: transform .2s, box-shadow .2s;
    }
    .sector-card:hover { transform:translateY(-6px); box-shadow:0 80px 120px rgba(0,0,0,.12); }

    /* Visual top area (like Jadoo destination photo) */
    .sc-visual {
      height: 200px;
      position: relative;
      display:flex; align-items:center; justify-content:center;
      overflow:hidden;
    }
    .sc-deco-ring {
      position:absolute;
      width:180px; height:180px; border-radius:50%;
      border:2px dashed rgba(255,255,255,.25);
      top:50%; left:50%; transform:translate(-50%,-50%);
    }
    .sc-big-icon {
      font-size: 56px; color:rgba(255,255,255,.85);
      position:relative; z-index:1;
      filter: drop-shadow(0 8px 20px rgba(0,0,0,.2));
    }

    /* Info bottom (like Jadoo card bottom) */
    .sc-info { padding:20px 22px; background:#fff; }
    .sc-meta { display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px; color:#94a3b8; }
    .sc-meta i { margin-right:4px; }
    .sc-name  { font-size:17px; font-weight:700; color:#181E4B; margin-bottom:6px; }
    .sc-desc  { font-size:13px; color:#5E6282; line-height:1.6; margin-bottom:12px; }
    .sc-link  {
      font-size:13px; font-weight:700; color:#6366f1;
      text-decoration:none; display:inline-flex; align-items:center; gap:6px;
      transition:gap .2s;
    }
    .sc-link:hover { gap:10px; }

    /* ──────────────────────────────
       STEPS SECTION
    ────────────────────────────── */
    .steps-section { padding:100px 0; background:#F7F8FC; }
    .steps-inner {
      display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center;
    }

    .step-list { display:flex; flex-direction:column; gap:0; margin-top:32px; }
    .step-item {
      display:flex; align-items:flex-start; gap:20px;
      padding:18px 20px; border-radius:14px;
      transition:background .2s;
    }
    .step-item:hover { background:rgba(255,255,255,.8); }
    .step-active { background:#fff; box-shadow:0 20px 60px rgba(0,0,0,.06); }
    .step-indicator {
      width:4px; min-height:70px; border-radius:4px; flex-shrink:0; margin-top:4px;
    }
    .step-body { flex:1; }
    .step-num  { font-size:11px; font-weight:800; letter-spacing:1px; margin-bottom:4px; }
    .step-title { font-size:15px; font-weight:700; color:#181E4B; margin-bottom:5px; }
    .step-desc  { font-size:13px; color:#5E6282; line-height:1.6; margin:0; }

    /* Right side result card */
    .steps-right { position:relative; display:flex; justify-content:center; }
    .result-img-wrap {
      position:relative; z-index:5;
      width:100%; max-width:420px;
    }
    .steps-result-img {
      width:100%; height:auto;
      border-radius:20px;
      box-shadow:0 40px 100px rgba(99,102,241,.15), 0 0 0 1px #ede9fe;
      object-fit:cover;
      display:block;
    }

    /* ──────────────────────────────
       STATS
    ────────────────────────────── */
    .stats-section { padding:80px 0; background:#181E4B; }
    .stats-grid {
      display:grid; grid-template-columns:repeat(4,1fr); gap:24px; text-align:center;
    }
    .stat-value { font-size:2.6rem; font-weight:900; color:#fff; letter-spacing:-1px; margin-bottom:6px; }
    .stat-label { font-size:13px; color:#94a3b8; }

    /* ──────────────────────────────
       CTA
    ────────────────────────────── */
    .cta-section { padding:80px 0; }
    .cta-card {
      background:linear-gradient(145deg,#0f172a 0%,#1e3a5f 50%,#6366f1 100%);
      border-radius:28px; padding:72px 56px;
      text-align:center; position:relative; overflow:hidden;
    }
    .cta-glow {
      position:absolute; width:500px; height:500px; border-radius:50%;
      background:rgba(124,58,237,.3); filter:blur(100px);
      top:-200px; right:-100px; pointer-events:none;
    }
    .cta-label {
      font-size:12px; font-weight:700; letter-spacing:2px;
      color:#F1A501; text-transform:uppercase; margin-bottom:14px; position:relative;
    }
    .cta-h2 {
      font-family:'Volkhov','Georgia',serif;
      font-size:2.5rem; font-weight:700; color:#fff;
      margin-bottom:14px; position:relative;
    }
    .cta-sub { font-size:16px; color:#94a3b8; margin-bottom:40px; position:relative; }
    .cta-actions { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; position:relative; }
    .cta-btn-white {
      display:inline-flex; align-items:center; gap:10px;
      padding:15px 30px; border-radius:12px; font-size:15px; font-weight:700;
      background:#fff; color:#6366f1; text-decoration:none;
      transition:transform .15s, box-shadow .15s;
    }
    .cta-btn-white:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,.2); color:#6366f1; }
    .cta-btn-ghost {
      display:inline-flex; align-items:center; gap:10px;
      padding:15px 30px; border-radius:12px; font-size:15px; font-weight:600;
      border:1.5px solid rgba(255,255,255,.25); color:#fff; text-decoration:none;
      transition:background .2s, border-color .2s;
    }
    .cta-btn-ghost:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.4); color:#fff; }

    /* ──────────────────────────────
       FOOTER
    ────────────────────────────── */
    .lp-footer { background:#fff; border-top:1px solid #f1f5f9; padding-top:64px; }
    .footer-inner {
      display:flex; justify-content:center;
      padding-bottom:56px;
    }
    .footer-logo { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
    .footer-logo-img { height:36px; width:auto; object-fit:contain; }
    .footer-tagline { font-size:14px; color:#5E6282; line-height:1.7; margin-bottom:20px; max-width:280px; }
    .footer-socials { display:flex; gap:10px; }
    .social-btn {
      width:36px; height:36px; border-radius:50%; background:#f1f5f9;
      display:flex; align-items:center; justify-content:center;
      color:#5E6282; text-decoration:none; font-size:14px;
      transition:background .2s, color .2s;
    }
    .social-btn:hover { background:#6366f1; color:#fff; }
    .footer-col-title { font-size:14px; font-weight:700; color:#181E4B; margin-bottom:20px; }
    .footer-links { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
    .footer-links a { font-size:14px; color:#5E6282; text-decoration:none; transition:color .2s; }
    .footer-links a:hover { color:#6366f1; }
    .footer-bottom {
      border-top:1px solid #f1f5f9; padding:20px 32px;
      max-width:1160px; margin:0 auto;
      display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;
    }
    .footer-bottom p { font-size:13px; color:#94a3b8; margin:0; }

    /* ──────────────────────────────
       RESPONSIVE
    ────────────────────────────── */
    @media (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; gap: 48px; padding: 64px 32px; }
      .hero-right { order: -1; }
      .hero-h1 { font-size:2.8rem; }
      .srv-grid { grid-template-columns: repeat(2,1fr); }
      .sector-cards { grid-template-columns: repeat(2,1fr); }
      .steps-inner { grid-template-columns:1fr; }
      .steps-right { display:none; }
      .stats-grid { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 768px) {
      .hero-h1 { font-size:2.1rem; }
      .srv-grid, .sector-cards { grid-template-columns:1fr; }
      .stats-grid { grid-template-columns:1fr 1fr; }
      .cta-card { padding:48px 28px; }
      .cta-h2 { font-size:1.9rem; }
.nav-links { display:none; }
      .lp-nav-inner { padding:16px 20px; }
      .hero { padding: 48px 20px; }
    }
    @media (max-width: 480px) { }
  `]
})
export class LandingComponent {
  dots = Array(16).fill(0);

  axes = [
    { name: 'Métier',    score: 78, color: '#6366f1' },
    { name: 'Processus', score: 65, color: '#7c3aed' },
    { name: 'SI',        score: 72, color: '#0891b2' },
  ];

  stats = [
    { value: '9 axes',  label: 'Métier · Processus · SI · Canaux · Marketing · RH · Offres' },
    { value: '20+',     label: 'Questions générées par évaluation' },
    { value: '100%',    label: 'Recommandations personnalisées par IA' },
    { value: '360°',    label: 'Benchmarking sectoriel international' },
  ];

  sectorLogos = [
    { icon: 'fa-landmark',        name: 'Banking' },
    { icon: 'fa-tower-broadcast', name: 'Telecom' },
    { icon: 'fa-graduation-cap',  name: 'Éducation' },
    { icon: 'fa-heart-pulse',     name: 'Santé' },
    { icon: 'fa-bag-shopping',    name: 'Business' },
    { icon: 'fa-bolt',            name: 'Énergie' },
  ];

  services = [
    {
      icon: 'fa-robot',
      title: 'Génération IA de questionnaires',
      desc: "L'IA génère automatiquement un questionnaire sur mesure adapté au secteur, à la taille et au pays de l'entreprise.",
      color: '#6366f1', bg: '#eff0fe'
    },
    {
      icon: 'fa-chart-bar',
      title: 'Score de maturité digitale',
      desc: 'Un score global calculé par axe (Métier, Processus, SI) à partir des réponses de l\'entreprise évaluée.',
      color: '#7c3aed', bg: '#f5f3ff'
    },
    {
      icon: 'fa-globe',
      title: 'Benchmarking sectoriel',
      desc: 'Positionnez chaque entreprise par rapport aux standards régionaux et internationaux de son secteur.',
      color: '#0891b2', bg: '#ecfeff'
    },
    {
      icon: 'fa-lightbulb',
      title: 'Recommandations stratégiques',
      desc: "Des recommandations générées par l'IA, validées par le consultant et envoyées automatiquement par email.",
      color: '#d97706', bg: '#fffbeb'
    },
  ];

  topSectors = [
    {
      name: 'Banque & Finance',
      desc: 'Évaluation de la maturité digitale des banques, assurances et institutions financières.',
      icon: 'fa-landmark',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #0891b2 100%)',
      count: '24',
    },
    {
      name: 'Télécommunications',
      desc: 'Benchmark des opérateurs télécom et prestataires technologiques de la région.',
      icon: 'fa-tower-broadcast',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      count: '18',
    },
    {
      name: 'Éducation & Santé',
      desc: 'Maturité digitale des établissements d\'enseignement supérieur et des structures de santé.',
      icon: 'fa-graduation-cap',
      gradient: 'linear-gradient(135deg, #059669 0%, #06b6d4 100%)',
      count: '31',
    },
  ];

  steps = [
    {
      num: '01', color: '#F1A501',
      title: 'Ajoutez votre client',
      desc: 'Créez le profil de l\'entreprise cliente (secteur, pays, taille, nombre d\'employés).',
    },
    {
      num: '02', color: '#6366f1',
      title: 'L\'IA génère le questionnaire',
      desc: 'Un questionnaire personnalisé est créé et validé par le consultant avant envoi.',
    },
    {
      num: '03', color: '#7c3aed',
      title: 'L\'entreprise répond en ligne',
      desc: 'L\'entreprise reçoit ses accès sécurisés et répond au questionnaire à son rythme.',
    },
    {
      num: '04', color: '#059669',
      title: 'Rapport & recommandations',
      desc: 'Le consultant valide les résultats IA et le rapport est envoyé automatiquement par email.',
    },
  ];
}
