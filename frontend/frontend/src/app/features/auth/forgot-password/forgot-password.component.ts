import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-bg">
      <div class="auth-card">

        <!-- ══ LEFT — FORM ══ -->
        <div class="card-left">
          <!-- Step 1 — Email -->
          <ng-container *ngIf="step === 1">
            <div class="form-header">
              <a routerLink="/login" class="back-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Retour à la connexion
              </a>
              <h2 class="form-title">Mot de passe oublié ?</h2>
              <p class="form-sub">Entrez votre email et nous vous enverrons un code de vérification.</p>
            </div>

            <form (ngSubmit)="requestCode()" #emailForm="ngForm" class="form-body">
              <div class="field-group">
                <label class="field-label">Adresse email</label>
                <div class="field-wrap" [class.is-error]="emailField.invalid && emailField.touched">
                  <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8"/>
                  </svg>
                  <input type="email" class="field-input"
                    [(ngModel)]="email" name="email"
                    required email #emailField="ngModel"
                    placeholder="vous@exemple.com"/>
                </div>
                <span class="field-error" *ngIf="emailField.invalid && emailField.touched">Email invalide</span>
              </div>

              <div class="error-banner" *ngIf="errorMsg">{{ errorMsg }}</div>

              <button type="submit" class="btn-primary" [disabled]="emailForm.invalid || isLoading">
                <span *ngIf="!isLoading">Envoyer le code</span>
                <span *ngIf="isLoading" class="loading-row"><span class="spinner"></span>Envoi…</span>
              </button>
            </form>
          </ng-container>

          <!-- Step 2 — Code + new password -->
          <ng-container *ngIf="step === 2">
            <div class="form-header">
              <button type="button" class="back-link" (click)="step = 1; errorMsg = ''">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Modifier l'email
              </button>
              <h2 class="form-title">Vérification</h2>
              <p class="form-sub">Code envoyé à <strong>{{ email }}</strong>. Saisissez-le avec votre nouveau mot de passe.</p>
            </div>

            <form (ngSubmit)="resetPassword()" #resetForm="ngForm" class="form-body">
              <div class="field-group">
                <label class="field-label">Code de vérification</label>
                <div class="field-wrap" [class.is-error]="codeField.invalid && codeField.touched">
                  <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                  <input type="text" class="field-input code-input"
                    [(ngModel)]="code" name="code"
                    required minlength="6" maxlength="6" pattern="[0-9]{6}"
                    #codeField="ngModel" placeholder="_ _ _ _ _ _"
                    autocomplete="one-time-code"/>
                </div>
                <span class="field-error" *ngIf="codeField.invalid && codeField.touched">Le code doit contenir 6 chiffres</span>
              </div>

              <div class="field-group">
                <label class="field-label">Nouveau mot de passe</label>
                <div class="field-wrap" [class.is-error]="pwField.invalid && pwField.touched">
                  <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8"/></svg>
                  <input [type]="showPassword ? 'text' : 'password'" class="field-input"
                    [(ngModel)]="newPassword" name="newPassword"
                    required minlength="6" #pwField="ngModel"
                    placeholder="Au moins 6 caractères"/>
                  <button type="button" class="eye-btn" (click)="showPassword=!showPassword" tabindex="-1">
                    <svg *ngIf="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
                    <svg *ngIf="showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"/></svg>
                  </button>
                </div>
                <span class="field-error" *ngIf="pwField.invalid && pwField.touched">Minimum 6 caractères</span>
              </div>

              <div class="field-group">
                <label class="field-label">Confirmer le mot de passe</label>
                <div class="field-wrap" [class.is-error]="confirmField.touched && newPassword !== confirmPassword">
                  <svg class="field-ico" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8"/></svg>
                  <input [type]="showPassword ? 'text' : 'password'" class="field-input"
                    [(ngModel)]="confirmPassword" name="confirmPassword"
                    required #confirmField="ngModel"
                    placeholder="Répétez le mot de passe"/>
                </div>
                <span class="field-error" *ngIf="confirmField.touched && newPassword !== confirmPassword">Les mots de passe ne correspondent pas</span>
              </div>

              <div class="error-banner" *ngIf="errorMsg">{{ errorMsg }}</div>

              <button type="submit" class="btn-primary"
                [disabled]="resetForm.invalid || newPassword !== confirmPassword || isLoading">
                <span *ngIf="!isLoading">Réinitialiser le mot de passe</span>
                <span *ngIf="isLoading" class="loading-row"><span class="spinner"></span>Mise à jour…</span>
              </button>

              <p class="resend-txt">
                Vous n'avez pas reçu le code ?
                <button type="button" class="btn-link" (click)="requestCode()" [disabled]="isLoading">Renvoyer</button>
              </p>
            </form>
          </ng-container>

          <!-- Step 3 — Success -->
          <ng-container *ngIf="step === 3">
            <div class="success-box">
              <div class="success-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <h2 class="form-title" style="margin-top:20px;">Mot de passe mis à jour !</h2>
              <p class="form-sub" style="margin-bottom:24px;">Votre mot de passe a été réinitialisé avec succès.</p>
              <a routerLink="/login" class="btn-primary" style="text-decoration:none;display:flex;align-items:center;justify-content:center;">
                Se connecter
              </a>
            </div>
          </ng-container>
        </div>

        <!-- ══ RIGHT — VISUAL ══ -->
        <div class="card-right">
          <div class="visual-inner">

            <!-- Security visual -->
            <div class="security-card">
              <div class="sec-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6366f1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div class="sec-title">Sécurité de votre compte</div>
              <div class="sec-sub">Récupération en 3 étapes simples</div>
            </div>

            <!-- Progress steps -->
            <div class="progress-steps">
              <div class="prog-step" [class.prog-active]="step >= 1" [class.prog-done]="step > 1">
                <div class="prog-circle">
                  <svg *ngIf="step > 1" width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  <span *ngIf="step <= 1">1</span>
                </div>
                <div class="prog-text">
                  <div class="prog-label">Email</div>
                  <div class="prog-sub">Entrez votre adresse email</div>
                </div>
              </div>
              <div class="prog-line" [class.prog-line-done]="step > 1"></div>

              <div class="prog-step" [class.prog-active]="step >= 2" [class.prog-done]="step > 2">
                <div class="prog-circle">
                  <svg *ngIf="step > 2" width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  <span *ngIf="step <= 2">2</span>
                </div>
                <div class="prog-text">
                  <div class="prog-label">Vérification</div>
                  <div class="prog-sub">Code à 6 chiffres · 15 min</div>
                </div>
              </div>
              <div class="prog-line" [class.prog-line-done]="step > 2"></div>

              <div class="prog-step" [class.prog-active]="step >= 3">
                <div class="prog-circle">
                  <svg *ngIf="step >= 3" width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  <span *ngIf="step < 3">3</span>
                </div>
                <div class="prog-text">
                  <div class="prog-label">Nouveau mot de passe</div>
                  <div class="prog-sub">Définissez un mot de passe sécurisé</div>
                </div>
              </div>
            </div>

            <p class="visual-note">© 2026 Hsys Solutions — Confidentiel</p>
          </div>
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
      display: flex; width: 100%; max-width: 880px;
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,.3);
      min-height: 520px;
    }

    /* ══ LEFT ══ */
    .card-left {
      flex: 0 0 52%;
      background: #fff;
      padding: 44px 44px;
      display: flex; flex-direction: column;
      justify-content: center;
    }

    .form-header { margin-bottom: 24px; }
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12.5px; color: #64748b; text-decoration: none;
      background: none; border: none; padding: 0; cursor: pointer;
      margin-bottom: 14px; transition: color .15s;
    }
    .back-link:hover { color: #6366f1; }
    .form-title { font-size: 1.7rem; font-weight: 800; color: #0f172a; letter-spacing: -.5px; margin-bottom: 6px; }
    .form-sub { font-size: 13.5px; color: #64748b; line-height: 1.55; }

    .form-body { display: flex; flex-direction: column; gap: 16px; }

    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; font-weight: 600; color: #374151; }
    .field-wrap {
      display: flex; align-items: center;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 10px; padding: 0 14px;
      transition: border-color .15s, box-shadow .15s;
    }
    .field-wrap:focus-within { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
    .field-wrap.is-error { border-color: #ef4444; }
    .field-ico { color: #94a3b8; flex-shrink: 0; margin-right: 10px; }
    .field-input { flex: 1; border: none; outline: none; background: transparent; padding: 13px 0; font-size: 14.5px; color: #0f172a; font-family: inherit; }
    .field-input::placeholder { color: #cbd5e1; }
    .code-input { letter-spacing: 6px; font-size: 20px; font-weight: 700; text-align: center; }
    .eye-btn { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0; margin-left: 8px; display: flex; align-items: center; }
    .eye-btn:hover { color: #6366f1; }
    .field-error { font-size: 12px; color: #ef4444; }

    .error-banner {
      background: #fef2f2; border: 1px solid #fecaca;
      color: #dc2626; border-radius: 8px; padding: 11px 14px; font-size: 13px;
    }

    .btn-primary {
      width: 100%; background: #6366f1; color: #fff; border: none; border-radius: 10px;
      padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: background .15s, transform .1s, box-shadow .15s;
      box-shadow: 0 4px 15px rgba(99,102,241,.35);
    }
    .btn-primary:hover:not(:disabled) { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }
    .loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .resend-txt { font-size: 13px; color: #64748b; text-align: center; margin-top: 8px; }
    .btn-link { background: none; border: none; padding: 0; font-size: 13px; color: #6366f1; font-weight: 600; cursor: pointer; }
    .btn-link:hover { text-decoration: underline; }
    .btn-link:disabled { opacity: .5; cursor: not-allowed; }

    .success-box { text-align: center; }
    .success-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: #dcfce7;
      display: inline-flex; align-items: center; justify-content: center;
    }

    /* ══ RIGHT ══ */
    .card-right {
      flex: 1;
      background: linear-gradient(160deg, #eef2ff 0%, #f5f3ff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 40px 28px;
    }
    @media (max-width: 768px) { .card-right { display: none; } .card-left { flex: 0 0 100%; } }

    .visual-inner { width: 100%; max-width: 260px; }

    .security-card {
      background: #fff; border-radius: 16px; padding: 24px; text-align: center;
      margin-bottom: 20px; box-shadow: 0 4px 20px rgba(99,102,241,.1);
    }
    .sec-icon { width: 64px; height: 64px; background: #eff0fe; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
    .sec-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .sec-sub { font-size: 12px; color: #64748b; }

    .progress-steps { background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 20px rgba(99,102,241,.1); display: flex; flex-direction: column; }
    .prog-step { display: flex; align-items: flex-start; gap: 12px; }
    .prog-circle {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #f1f5f9; color: #94a3b8;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700;
      transition: background .3s, color .3s;
    }
    .prog-step.prog-active .prog-circle { background: #6366f1; color: #fff; }
    .prog-step.prog-done .prog-circle { background: #10b981; color: #fff; }
    .prog-label { font-size: 12px; font-weight: 600; color: #374151; }
    .prog-sub { font-size: 10.5px; color: #94a3b8; margin-top: 2px; }
    .prog-step.prog-active .prog-label { color: #6366f1; }
    .prog-line { width: 1px; height: 16px; background: #e2e8f0; margin: 4px 0 4px 13px; transition: background .3s; }
    .prog-line-done { background: #10b981; }

    .visual-note { font-size: 11px; color: #94a3b8; text-align: center; }
  `]
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  isLoading = false;
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  requestCode() {
    this.isLoading = true;
    this.errorMsg = '';
    this.authService.forgotPassword(this.email).subscribe({
      next: () => { this.isLoading = false; this.step = 2; },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Aucun compte trouvé avec cet email.';
      }
    });
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) return;
    this.isLoading = true;
    this.errorMsg = '';
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => { this.isLoading = false; this.step = 3; },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Code incorrect ou expiré. Vérifiez votre email.';
      }
    });
  }
}
