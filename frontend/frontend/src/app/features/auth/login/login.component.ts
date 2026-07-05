import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
            <h2 class="form-title">Connexion</h2>
            <p class="form-sub">Connectez-vous à votre espace</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="form-body">

            <!-- Email -->
            <div class="field-group">
              <label class="field-label">Adresse email</label>
              <div class="field-wrap" [class.is-error]="email.invalid && email.touched" [class.is-focus]="emailFocused">
                <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <input type="email" class="field-input"
                  [(ngModel)]="credentials.email" name="email"
                  required #email="ngModel"
                  (focus)="emailFocused=true" (blur)="emailFocused=false"
                  placeholder="vous@exemple.com"/>
              </div>
              <span class="field-error" *ngIf="email.invalid && email.touched">Email requis</span>
            </div>

            <!-- Password -->
            <div class="field-group">
              <div class="field-label-row">
                <label class="field-label">Mot de passe</label>
                <a routerLink="/forgot-password" class="forgot-link">Mot de passe oublié ?</a>
              </div>
              <div class="field-wrap" [class.is-error]="password.invalid && password.touched" [class.is-focus]="pwdFocused">
                <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <input [type]="showPassword ? 'text' : 'password'" class="field-input"
                  [(ngModel)]="credentials.password" name="password"
                  required #password="ngModel"
                  (focus)="pwdFocused=true" (blur)="pwdFocused=false"
                  placeholder="••••••••"/>
                <button type="button" class="eye-btn" (click)="showPassword=!showPassword" tabindex="-1">
                  <svg *ngIf="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
                  <svg *ngIf="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"/></svg>
                </button>
              </div>
              <span class="field-error" *ngIf="password.invalid && password.touched">Mot de passe requis</span>
            </div>

            <!-- Remember me -->
            <label class="remember-row">
              <input type="checkbox" [(ngModel)]="rememberMe" name="remember" class="cb-input"/>
              <span class="cb-box"></span>
              <span class="cb-label">Se souvenir de moi</span>
            </label>

            <!-- Error -->
            <div class="error-banner" *ngIf="errorMessage">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#dc2626" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="#dc2626" stroke-width="1.8"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#dc2626" stroke-width="2.5"/></svg>
              {{ errorMessage }}
            </div>

            <!-- Submit -->
            <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="!isLoading">Se connecter</span>
              <span *ngIf="isLoading" class="loading-row">
                <span class="spinner"></span>Connexion…
              </span>
            </button>
          </form>

          <p class="signup-link">
            Pas encore de compte ?
            <a routerLink="/register">S'inscrire</a>
          </p>
        </div>

        <!-- ══ RIGHT — IMAGE ══ -->
        <div class="card-right">
          <img src="assets/login.png" alt="IA Benchmark" class="side-img"/>
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
      display: flex;
      width: 100%; max-width: 920px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,.3);
      min-height: 560px;
    }

    /* ══ LEFT — FORM ══ */
    .card-left {
      flex: 0 0 50%;
      background: #fff;
      padding: 48px 44px;
      display: flex; flex-direction: column;
      justify-content: center;
    }

    .form-logo { margin-bottom: 28px; }
    .logo-img { height: 44px; width: auto; object-fit: contain; }

    .form-header { margin-bottom: 28px; }
    .form-title { font-size: 1.9rem; font-weight: 800; color: #0f172a; letter-spacing: -.5px; margin-bottom: 6px; }
    .form-sub { font-size: 14px; color: #64748b; }

    .form-body { display: flex; flex-direction: column; gap: 18px; }

    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; font-weight: 600; color: #374151; }
    .field-label-row { display: flex; justify-content: space-between; align-items: center; }
    .forgot-link { font-size: 12px; color: #6366f1; text-decoration: none; font-weight: 500; }
    .forgot-link:hover { text-decoration: underline; }

    .field-wrap {
      display: flex; align-items: center;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 10px; padding: 0 14px;
      transition: border-color .15s, box-shadow .15s, background .15s;
    }
    .field-wrap.is-focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
    .field-wrap.is-error { border-color: #ef4444; }
    .field-ico { color: #94a3b8; flex-shrink: 0; margin-right: 10px; }
    .field-input {
      flex: 1; border: none; outline: none; background: transparent;
      padding: 12px 0; font-size: 14.5px; color: #0f172a; font-family: inherit;
    }
    .field-input::placeholder { color: #cbd5e1; }
    .eye-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; margin-left: 8px; display: flex; align-items: center; }
    .eye-btn:hover { color: #6366f1; }
    .field-error { font-size: 12px; color: #ef4444; }

    .remember-row { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
    .cb-input { display: none; }
    .cb-box { width: 16px; height: 16px; border: 1.5px solid #d1d5db; border-radius: 4px; background: #fff; flex-shrink: 0; transition: all .15s; }
    .cb-input:checked ~ .cb-box { background: #6366f1; border-color: #6366f1; }
    .cb-label { font-size: 13px; color: #4b5563; }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #fef2f2; border: 1px solid #fecaca;
      color: #dc2626; border-radius: 8px; padding: 11px 14px; font-size: 13px;
    }

    .btn-primary {
      width: 100%;
      background: #6366f1; color: #fff; border: none; border-radius: 10px;
      padding: 14px; font-size: 15px; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: background .15s, transform .1s, box-shadow .15s;
      box-shadow: 0 4px 15px rgba(99,102,241,.35);
    }
    .btn-primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }
    .loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .signup-link { font-size: 13px; color: #64748b; text-align: center; margin-top: 20px; }
    .signup-link a { color: #6366f1; font-weight: 600; text-decoration: none; }
    .signup-link a:hover { text-decoration: underline; }

    /* ══ RIGHT — IMAGE ══ */
    .card-right {
      flex: 1;
      background: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 32px;
      overflow: hidden;
    }
    .side-img {
      width: 100%; max-width: 340px; height: auto;
      object-fit: contain;
      display: block;
    }
    @media (max-width: 768px) { .card-right { display: none; } .card-left { flex: 0 0 100%; border-radius: 20px; } }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  emailFocused = false;
  pwdFocused = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: () => {
        this.isLoading = false;
        const user = this.authService.getCurrentUser();
        if (user?.role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
        else if (user?.role === 'CONSULTANT') this.router.navigate(['/consultant/dashboard']);
        else this.router.navigate(['/client/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
      }
    });
  }
}
