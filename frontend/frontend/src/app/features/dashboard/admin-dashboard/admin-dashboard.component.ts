import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyService } from '../../../core/services/company.service';
import { UserService } from '../../../core/services/user.service';
import { EvaluationService, EvaluationSummary } from '../../../core/services/evaluation.service';
import { Company } from '../../../core/models/company.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    .dash-page { background:#f8fafc; min-height:100vh; padding:32px 28px; }
    .dash-inner { max-width:1280px; margin:auto; }

    /* KPI */
    .kpi-card { background:#fff; border-radius:16px; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04); height:100%; }

    /* Section cards */
    .section-card { background:#fff; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,.05),0 4px 20px rgba(0,0,0,.04); overflow:hidden; }
    .section-head { padding:20px 24px; border-bottom:1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
    .section-overline { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#94a3b8; margin-bottom:2px; }
    .section-title { font-weight:700; color:#0f172a; font-size:15px; margin:0; }

    /* Rows */
    .company-row { display:flex; align-items:center; gap:16px; padding:13px 24px; border-bottom:1px solid #f8fafc; transition:background .15s; }
    .company-row:hover { background:#fafbff; }
    .company-row:last-child { border-bottom:none; }
    .quick-link-row { display:flex; align-items:center; gap:14px; padding:14px 24px; text-decoration:none; color:inherit; border-top:1px solid #f1f5f9; transition:background .15s; }
    .quick-link-row:hover { background:#fafbff; }
    .pending-row { display:flex; align-items:center; gap:12px; padding:12px 24px; border-top:1px solid #f1f5f9; }

    /* Buttons */
    .btn-indigo { background:#6366f1; color:#fff !important; border:none; border-radius:8px; padding:7px 16px; font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:opacity .15s; }
    .btn-indigo:hover { opacity:.88; }
    .btn-ghost { background:#f8fafc; color:#374151 !important; border:1px solid #e2e8f0; border-radius:8px; padding:7px 16px; font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:background .15s; }
    .btn-ghost:hover { background:#f1f5f9; }
    .btn-primary-pill { background:#6366f1; color:#fff !important; border:none; border-radius:50px; padding:10px 24px; font-size:13px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(99,102,241,.3); transition:opacity .15s; }
    .btn-primary-pill:hover { opacity:.88; }
    .btn-outline-pill { background:#fff; color:#374151 !important; border:1px solid #e2e8f0; border-radius:50px; padding:10px 24px; font-size:13px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:background .15s; }
    .btn-outline-pill:hover { background:#f8fafc; }

    /* Row link arrow */
    .row-arrow { width:32px; height:32px; border-radius:8px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#64748b; text-decoration:none; flex-shrink:0; transition:all .15s; }
    .row-arrow:hover { background:#eff0fe; border-color:#c7d2fe; color:#6366f1; }
  `],
  template: `
<div class="dash-page">
<div class="dash-inner">

  <!-- ══════ Header ══════ -->
  <div class="d-flex align-items-start justify-content-between mb-5 flex-wrap gap-3">
    <div>
      <div class="section-overline" style="color:#6366f1;">Administration</div>
      <h2 style="font-weight:900;color:#0f172a;letter-spacing:-.5px;margin-bottom:6px;font-size:1.75rem;">
        Tableau de Bord
      </h2>
      <p style="color:#64748b;margin:0;font-size:14px;">
        Bonjour, <strong style="color:#0f172a;">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</strong>
      </p>
    </div>
    <div class="d-flex gap-2 flex-wrap">
      <a routerLink="/users/new" class="btn-outline-pill">
        <i class="fas fa-user-plus"></i>Nouvel utilisateur
      </a>
      <a routerLink="/companies/new" class="btn-primary-pill">
        <i class="fas fa-plus"></i>Nouvelle entreprise
      </a>
    </div>
  </div>

  <!-- ══════ KPI Row ══════ -->
  <div class="row g-3 mb-4">

    <div class="col-6 col-md-4 col-xl">
      <div class="kpi-card">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-building" style="color:#fff;font-size:18px;"></i>
          </div>
          <span style="background:#eff0fe;color:#4338ca;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Total</span>
        </div>
        <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ companies.length }}</div>
        <div style="color:#64748b;font-size:13px;margin-top:5px;">Entreprises</div>
      </div>
    </div>

    <div class="col-6 col-md-4 col-xl">
      <div class="kpi-card">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-user-tie" style="color:#fff;font-size:18px;"></i>
          </div>
          <span style="background:#f0fdf4;color:#15803d;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Actifs</span>
        </div>
        <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ consultantCount }}</div>
        <div style="color:#64748b;font-size:13px;margin-top:5px;">Consultants</div>
      </div>
    </div>

    <div class="col-6 col-md-4 col-xl">
      <div class="kpi-card">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-chart-bar" style="color:#fff;font-size:18px;"></i>
          </div>
          <span style="background:#fefce8;color:#a16207;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Terminées</span>
        </div>
        <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ evaluatedCount }}</div>
        <div style="color:#64748b;font-size:13px;margin-top:5px;">Évaluées</div>
      </div>
    </div>

    <div class="col-6 col-md-4 col-xl">
      <div class="kpi-card">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#ef4444,#dc2626);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-hourglass-half" style="color:#fff;font-size:18px;"></i>
          </div>
          <span style="background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Urgent</span>
        </div>
        <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ pendingCount }}</div>
        <div style="color:#64748b;font-size:13px;margin-top:5px;">En attente</div>
      </div>
    </div>

    <div class="col-6 col-md-4 col-xl">
      <div class="kpi-card">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-users" style="color:#fff;font-size:18px;"></i>
          </div>
          <span style="background:#f5f3ff;color:#5b21b6;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Total</span>
        </div>
        <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ totalUsers }}</div>
        <div style="color:#64748b;font-size:13px;margin-top:5px;">Utilisateurs</div>
      </div>
    </div>

  </div>
  <!-- /KPI Row -->

  <!-- ══════ 2-column layout ══════ -->
  <div class="row g-4">

    <!-- LEFT: Companies list -->
    <div class="col-lg-8">
      <div class="section-card">

        <div class="section-head">
          <div>
            <div class="section-overline">Gestion</div>
            <h6 class="section-title">Entreprises enregistrées</h6>
          </div>
          <div class="d-flex gap-2">
            <a routerLink="/companies" class="btn-ghost"><i class="fas fa-list"></i>Voir tout</a>
            <a routerLink="/companies/new" class="btn-indigo"><i class="fas fa-plus"></i>Ajouter</a>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="companies.length === 0"
             style="text-align:center;padding:60px 24px;color:#94a3b8;">
          <i class="fas fa-building" style="font-size:36px;opacity:.2;display:block;margin-bottom:12px;"></i>
          <p style="margin:0;font-size:14px;">Aucune entreprise enregistrée</p>
          <a routerLink="/companies/new" class="btn-indigo d-inline-flex mt-3">
            <i class="fas fa-plus"></i>Créer la première entreprise
          </a>
        </div>

        <!-- Company rows -->
        <div *ngFor="let c of companies.slice(0, 9)" class="company-row">

          <!-- Avatar initiale -->
          <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:15px;">
            {{ c.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Nom + méta -->
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:14px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ c.name }}
            </div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span><i class="fas fa-globe" style="font-size:9px;margin-right:3px;"></i>{{ c.country }}</span>
              <span style="color:#cbd5e1;">·</span>
              <span><i class="fas fa-industry" style="font-size:9px;margin-right:3px;"></i>{{ c.sector }}</span>
              <span style="background:#f1f5f9;color:#64748b;padding:1px 6px;border-radius:6px;font-size:10px;font-weight:600;">{{ c.size }}</span>
            </div>
          </div>

          <!-- Score -->
          <div *ngIf="getScore(c.id!)" style="text-align:right;flex-shrink:0;min-width:54px;">
            <div style="font-size:1.25rem;font-weight:800;line-height:1;"
                 [style.color]="scoreColor(getScore(c.id!)!.globalScore)">
              {{ getScore(c.id!)!.globalScore | number:'1.0-0' }}
            </div>
            <div style="font-size:10px;color:#94a3b8;">/ 100</div>
          </div>

          <!-- Maturity badge -->
          <span *ngIf="getScore(c.id!)"
                style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;"
                [style.background]="maturityBg(getScore(c.id!)!.maturityLevel)"
                [style.color]="maturityColor(getScore(c.id!)!.maturityLevel)">
            {{ levelLabel(getScore(c.id!)!.maturityLevel) }}
          </span>
          <span *ngIf="!getScore(c.id!)"
                style="font-size:11px;font-weight:500;padding:4px 10px;border-radius:20px;background:#f1f5f9;color:#94a3b8;white-space:nowrap;flex-shrink:0;">
            Non évaluée
          </span>

          <!-- Arrow link -->
          <a [routerLink]="['/companies', c.id]" class="row-arrow">
            <i class="fas fa-arrow-right" style="font-size:11px;"></i>
          </a>
        </div>

        <!-- Footer: more link -->
        <div *ngIf="companies.length > 9"
             style="padding:14px 24px;text-align:center;border-top:1px solid #f1f5f9;">
          <a routerLink="/companies"
             style="font-size:13px;color:#6366f1;font-weight:600;text-decoration:none;">
            Voir {{ companies.length - 9 }} autre(s) entreprise(s) →
          </a>
        </div>

      </div>
    </div>
    <!-- /LEFT -->

    <!-- RIGHT column -->
    <div class="col-lg-4">

      <!-- Quick actions card -->
      <div class="section-card mb-4">
        <div class="section-head">
          <div>
            <div class="section-overline">Navigation</div>
            <h6 class="section-title">Accès rapide</h6>
          </div>
        </div>

        <a routerLink="/companies" class="quick-link-row">
          <div style="width:40px;height:40px;border-radius:10px;background:#eff0fe;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-building" style="color:#6366f1;font-size:15px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:13px;color:#0f172a;">Entreprises</div>
            <div style="font-size:11px;color:#64748b;">{{ companies.length }} enregistrée(s)</div>
          </div>
          <i class="fas fa-chevron-right" style="color:#cbd5e1;font-size:11px;flex-shrink:0;"></i>
        </a>

        <a routerLink="/users" class="quick-link-row">
          <div style="width:40px;height:40px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-users" style="color:#16a34a;font-size:15px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:13px;color:#0f172a;">Utilisateurs</div>
            <div style="font-size:11px;color:#64748b;">{{ consultantCount }} consultant(s) · {{ totalUsers }} total</div>
          </div>
          <i class="fas fa-chevron-right" style="color:#cbd5e1;font-size:11px;flex-shrink:0;"></i>
        </a>

        <a routerLink="/companies" class="quick-link-row">
          <div style="width:40px;height:40px;border-radius:10px;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-chart-bar" style="color:#d97706;font-size:15px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:13px;color:#0f172a;">Résultats & Évaluations</div>
            <div style="font-size:11px;color:#64748b;">{{ evaluatedCount }} évaluée(s) · {{ pendingCount }} en attente</div>
          </div>
          <i class="fas fa-chevron-right" style="color:#cbd5e1;font-size:11px;flex-shrink:0;"></i>
        </a>

        <div style="padding:16px 24px;display:flex;gap:8px;border-top:1px solid #f1f5f9;">
          <a routerLink="/companies/new" class="btn-indigo" style="flex:1;justify-content:center;">
            <i class="fas fa-plus"></i>Entreprise
          </a>
          <a routerLink="/users/new" class="btn-ghost" style="flex:1;justify-content:center;">
            <i class="fas fa-user-plus"></i>Utilisateur
          </a>
        </div>
      </div>

      <!-- Pending reviews card -->
      <div class="section-card">
        <div class="section-head">
          <div>
            <div class="section-overline">Validations</div>
            <h6 class="section-title">Évaluations en attente</h6>
          </div>
          <span *ngIf="pendingCount > 0"
                style="background:#fef2f2;color:#b91c1c;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">
            {{ pendingCount }}
          </span>
        </div>

        <!-- Empty state -->
        <div *ngIf="pendingReviews.length === 0"
             style="text-align:center;padding:36px 24px;color:#94a3b8;">
          <i class="fas fa-check-circle"
             style="font-size:30px;color:#22c55e;opacity:.5;display:block;margin-bottom:10px;"></i>
          <p style="margin:0;font-size:13px;">Toutes les évaluations sont traitées</p>
        </div>

        <!-- Pending rows -->
        <div *ngFor="let r of pendingReviews.slice(0, 5)" class="pending-row">
          <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#fca5a5,#ef4444);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:13px;">
            {{ r.companyName.charAt(0).toUpperCase() }}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:600;font-size:13px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              {{ r.companyName }}
            </div>
            <div style="font-size:11px;color:#64748b;margin-top:1px;">
              Score : <strong style="color:#0f172a;">{{ r.globalScore | number:'1.0-0' }}/100</strong>
            </div>
          </div>
          <span style="background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap;flex-shrink:0;">
            En attente
          </span>
        </div>

        <div *ngIf="pendingReviews.length > 5"
             style="padding:12px 24px;text-align:center;border-top:1px solid #f1f5f9;">
          <span style="font-size:12px;color:#64748b;">
            + {{ pendingReviews.length - 5 }} autre(s) évaluation(s)
          </span>
        </div>
      </div>

    </div>
    <!-- /RIGHT -->

  </div>
  <!-- /2-col layout -->

  <!-- ══════ Power BI Dashboard ══════ -->
  <div class="section-card mt-4">
    <div class="section-head">
      <div>
        <div class="section-overline" style="color:#f2c811;">Power BI</div>
        <h6 class="section-title">Tableau de Bord Analytique</h6>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="width:10px;height:10px;border-radius:50%;background:#22c55e;"></div>
        <span style="font-size:12px;color:#64748b;font-weight:500;">En direct</span>
      </div>
    </div>
    <div style="padding:24px;background:#f8fafc;">
      <div style="border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
        <iframe
          title="PFE-RANIA"
          [src]="powerBiUrl"
          style="width:100%;height:500px;border:none;display:block;"
          allowfullscreen="true">
        </iframe>
      </div>
    </div>
  </div>
  <!-- /Power BI -->

</div>
</div>
  `
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  companies: Company[] = [];
  pendingReviews: EvaluationSummary[] = [];
  evaluationMap = new Map<number, EvaluationSummary>();

  consultantCount = 0;
  totalUsers = 0;

  powerBiUrl: SafeResourceUrl;

  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private userService: UserService,
    private evaluationService: EvaluationService,
    private sanitizer: DomSanitizer
  ) {
    this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMmVlMWMxNjctZDdiYS00MTI0LWE2ZmEtNjQ3MjU3MzA3ZTQwIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9'
    );
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.companyService.getCompanies().subscribe(data => this.companies = data);

    this.userService.getUsers().subscribe(users => {
      this.totalUsers = users.length;
      this.consultantCount = users.filter(u => u.role === 'CONSULTANT').length;
    });

    this.evaluationService.getAllEvaluations().subscribe(evals => {
      evals.forEach(ev => {
        const existing = this.evaluationMap.get(ev.companyId);
        if (!existing || new Date(ev.createdAt) > new Date(existing.createdAt)) {
          this.evaluationMap.set(ev.companyId, ev);
        }
      });
    });

    this.evaluationService.getPendingReviews().subscribe(data => this.pendingReviews = data);
  }

  get evaluatedCount(): number { return this.evaluationMap.size; }
  get pendingCount(): number { return this.pendingReviews.length; }

  getScore(companyId: number): EvaluationSummary | undefined {
    return this.evaluationMap.get(companyId);
  }

  deleteCompany(id: number) {
    if (confirm('Supprimer cette entreprise ?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => { this.companies = this.companies.filter(c => c.id !== id); this.evaluationMap.delete(id); },
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }

  scoreColor(score: number): string { return this.evaluationService.getScoreColor(score); }
  levelLabel(level: string): string { return this.evaluationService.getMaturityLabel(level); }
  maturityColor(level: string): string { return this.evaluationService.getMaturityColor(level); }

  maturityBg(level: string): string {
    const map: Record<string, string> = {
      INITIAL: '#fef2f2', BASIQUE: '#fff7ed',
      INTERMEDIAIRE: '#fefce8', AVANCE: '#eff6ff', OPTIMISE: '#f0fdf4'
    };
    return map[level] ?? '#f1f5f9';
  }
}
