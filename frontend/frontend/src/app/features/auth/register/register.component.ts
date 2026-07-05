import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-bg">
      <div class="auth-card">

        <!-- ══ LEFT — FORM ══ -->
        <div class="card-left">
          <div class="form-logo">
            <img src="assets/logo.png" alt="Hsys Solutions" class="logo-img"/>
          </div>

          <div class="form-header">
            <h2 class="form-title">Créer un compte</h2>
            <p class="form-sub">Renseignez vos informations pour accéder à la plateforme</p>
          </div>

          <form (ngSubmit)="onSubmit()" #regForm="ngForm" class="form-body">

            <!-- Name row -->
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Prénom <span class="req">*</span></label>
                <div class="field-wrap" [class.is-error]="fn.invalid && fn.touched" [class.is-focus]="fnFocused">
                  <input type="text" class="field-input"
                    [(ngModel)]="consultant.firstName" name="firstName"
                    required #fn="ngModel"
                    (focus)="fnFocused=true" (blur)="fnFocused=false"
                    placeholder="Rania"/>
                </div>
                <span class="field-error" *ngIf="fn.invalid && fn.touched">Requis</span>
              </div>
              <div class="field-group">
                <label class="field-label">Nom <span class="req">*</span></label>
                <div class="field-wrap" [class.is-error]="ln.invalid && ln.touched" [class.is-focus]="lnFocused">
                  <input type="text" class="field-input"
                    [(ngModel)]="consultant.lastName" name="lastName"
                    required #ln="ngModel"
                    (focus)="lnFocused=true" (blur)="lnFocused=false"
                    placeholder="Benabdallah"/>
                </div>
                <span class="field-error" *ngIf="ln.invalid && ln.touched">Requis</span>
              </div>
            </div>

            <!-- Email -->
            <div class="field-group">
              <label class="field-label">Email professionnel <span class="req">*</span></label>
              <div class="field-wrap" [class.is-error]="em.invalid && em.touched" [class.is-focus]="emFocused">
                <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <input type="email" class="field-input"
                  [(ngModel)]="consultant.email" name="email"
                  required email #em="ngModel"
                  (focus)="emFocused=true" (blur)="emFocused=false"
                  placeholder="rania.benabdallah@cabinet.com"/>
              </div>
              <span class="field-error" *ngIf="em.invalid && em.touched">Email valide requis</span>
            </div>

            <!-- Phone -->
            <div class="field-group">
              <label class="field-label">Téléphone <span class="optional">(optionnel)</span></label>
              <div class="field-wrap" [class.is-focus]="phFocused">
                <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.57a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <input type="tel" class="field-input"
                  [(ngModel)]="consultant.phone" name="phone"
                  (focus)="phFocused=true" (blur)="phFocused=false"
                  placeholder="+216 60 000 000"/>
              </div>
            </div>

            <!-- Password -->
            <div class="field-group">
              <label class="field-label">Mot de passe <span class="req">*</span></label>
              <div class="field-wrap" [class.is-error]="pwd.invalid && pwd.touched" [class.is-focus]="pwdFocused">
                <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <input [type]="showPwd ? 'text' : 'password'" class="field-input"
                  [(ngModel)]="consultant.password" name="password"
                  required minlength="6" #pwd="ngModel"
                  (focus)="pwdFocused=true" (blur)="pwdFocused=false"
                  (ngModelChange)="updateStrength($event)"
                  placeholder="Minimum 6 caractères"/>
                <button type="button" class="eye-btn" (click)="showPwd=!showPwd" tabindex="-1">
                  <svg *ngIf="!showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
                  <svg *ngIf="showPwd" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"/></svg>
                </button>
              </div>
              <div class="strength-bar" *ngIf="consultant.password">
                <div class="strength-track"><div class="strength-fill" [style.width.%]="pwdStrength * 33.3" [class]="'s'+pwdStrength"></div></div>
                <span class="strength-label" [class]="'s'+pwdStrength">{{ pwdStrengthLabel }}</span>
              </div>
              <span class="field-error" *ngIf="pwd.invalid && pwd.touched">Mot de passe (6 car. min) requis</span>
            </div>

            <!-- Error -->
            <div class="error-banner" *ngIf="errorMessage">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#dc2626" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="#dc2626" stroke-width="1.8"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#dc2626" stroke-width="2.5"/></svg>
              {{ errorMessage }}
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary" [disabled]="regForm.invalid || isLoading">
              <span *ngIf="!isLoading">Créer mon compte</span>
              <span *ngIf="isLoading" class="loading-row">
                <span class="spinner"></span>Création…
              </span>
            </button>
          </form>

          <p class="login-link">
            Déjà inscrit ?
            <a routerLink="/login">Se connecter</a>
          </p>
        </div>

        <!-- ══ RIGHT — VISUAL ══ -->
        <!-- ══ RIGHT — IMAGE ══ -->
        <div class="card-right">
          <img src="assets/register.jpg" alt="IA Benchmark" class="side-img"/>
        </div>

      </div>
    </div>
  `,
  styles: [`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .page-bg {
      min-height: 100vh;
      background: linear-gradient(145deg, #e2e8f0 0%, #ede9fe 55%, #e0e7ff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 24px 16px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .auth-card {
      display: flex; width: 100%; max-width: 920px;
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,.3);
    }

    /* ══ LEFT ══ */
    .card-left {
      flex: 0 0 52%;
      background: #fff;
      padding: 40px 44px;
      display: flex; flex-direction: column;
      overflow-y: auto; max-height: 100vh;
    }

    .form-logo { margin-bottom: 22px; }
    .logo-img { height: 42px; width: auto; object-fit: contain; }

    .form-header { margin-bottom: 22px; }
    .form-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -.5px; margin-bottom: 5px; }
    .form-sub { font-size: 13px; color: #64748b; }

    .form-body { display: flex; flex-direction: column; gap: 14px; }

    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field-group { display: flex; flex-direction: column; gap: 5px; }
    .field-label { font-size: 12.5px; font-weight: 600; color: #374151; }
    .req { color: #ef4444; }
    .optional { color: #94a3b8; font-weight: 400; font-size: 11px; }

    .field-wrap {
      display: flex; align-items: center;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 10px; padding: 0 12px;
      transition: border-color .15s, box-shadow .15s, background .15s;
    }
    .field-wrap.is-focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
    .field-wrap.is-error { border-color: #ef4444; }
    .field-ico { color: #94a3b8; flex-shrink: 0; margin-right: 10px; }
    .field-input {
      flex: 1; border: none; outline: none; background: transparent;
      padding: 11px 0; font-size: 14px; color: #0f172a; font-family: inherit;
    }
    .field-input::placeholder { color: #cbd5e1; }
    .eye-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; margin-left: 6px; display: flex; align-items: center; }
    .eye-btn:hover { color: #6366f1; }
    .field-error { font-size: 11px; color: #ef4444; }

    .strength-bar { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .strength-track { flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 2px; transition: width .3s; }
    .strength-fill.s1 { background: #ef4444; }
    .strength-fill.s2 { background: #f59e0b; }
    .strength-fill.s3 { background: #10b981; }
    .strength-label { font-size: 11px; font-weight: 600; }
    .strength-label.s1 { color: #ef4444; }
    .strength-label.s2 { color: #f59e0b; }
    .strength-label.s3 { color: #10b981; }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #fef2f2; border: 1px solid #fecaca;
      color: #dc2626; border-radius: 8px; padding: 10px 14px; font-size: 13px;
    }

    .btn-primary {
      width: 100%; background: #6366f1; color: #fff; border: none; border-radius: 10px;
      padding: 13px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: background .15s, transform .1s, box-shadow .15s;
      box-shadow: 0 4px 15px rgba(99,102,241,.35);
    }
    .btn-primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }
    .loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .login-link { font-size: 13px; color: #64748b; text-align: center; margin-top: 18px; }
    .login-link a { color: #6366f1; font-weight: 600; text-decoration: none; }
    .login-link a:hover { text-decoration: underline; }

    /* ══ RIGHT — IMAGE ══ */
    .card-right {
      flex: 1;
      background: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 32px;
      overflow: hidden;
    }
    .side-img {
      width: 100%; max-width: 300px; height: auto;
      object-fit: contain;
      display: block;
    }
    @media (max-width: 768px) { .card-right { display: none; } .card-left { flex: 0 0 100%; } }
  `]
})
export class RegisterComponent {
  consultant = { firstName: '', lastName: '', email: '', password: '', phone: '' };
  isLoading = false;
  errorMessage = '';
  showPwd = false;
  pwdStrength = 0;
  pwdStrengthLabel = '';

  fnFocused = false; lnFocused = false;
  emFocused = false; phFocused = false; pwdFocused = false;

  constructor(private authService: AuthService, private router: Router) {}

  updateStrength(value: string) {
    if (!value) { this.pwdStrength = 0; return; }
    let s = 0;
    if (value.length >= 6) s++;
    if (value.length >= 10) s++;
    if (/[A-Z]/.test(value) && /[0-9!@#$%^&*]/.test(value)) s++;
    this.pwdStrength = Math.max(1, s);
    this.pwdStrengthLabel = ['', 'Faible', 'Moyen', 'Fort'][this.pwdStrength];
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.registerConsultant(this.consultant).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/consultant/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erreur lors de l\'inscription. Vérifiez vos informations.';
      }
    });
  }
}
