import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

interface EvalSummary {
  evaluationId: number; companyId: number; companyName: string;
  sector: string; country: string; companySize: string;
  globalScore: number; maturityLevel: string; status: string; createdAt: string;
}
interface PendingEval {
  evaluationId: number; companyId: number; companyName: string;
  globalScore: number; maturityLevel: string; status: string; createdAt: string;
}
interface DonutSegment {
  level: string; label: string; count: number; pct: number;
  dash: number; gap: number; rotDeg: number; color: string;
}

@Component({
  selector: 'app-consultant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

    /* Pending rows */
    .pending-row { display:flex; align-items:center; gap:12px; padding:12px 18px; border-radius:12px; margin-bottom:8px; transition:filter .15s; }
    .pending-row:hover { filter:brightness(.97); }

    /* Ranking rows */
    .rank-row { padding:10px 0; border-bottom:1px solid #f1f5f9; }
    .rank-row:last-child { border-bottom:none; }

    /* Quick links */
    .quick-link-row { display:flex; align-items:center; gap:14px; padding:14px 24px; text-decoration:none; color:inherit; border-top:1px solid #f1f5f9; transition:background .15s; }
    .quick-link-row:hover { background:#fafbff; }

    /* Filters */
    .filter-select { border:1px solid #e2e8f0; border-radius:50px; padding:6px 14px; font-size:12px; color:#374151; background:#fff; outline:none; cursor:pointer; transition:border-color .15s; }
    .filter-select:focus { border-color:#6366f1; }

    /* Buttons */
    .btn-indigo { background:#6366f1; color:#fff !important; border:none; border-radius:8px; padding:7px 16px; font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:opacity .15s; }
    .btn-indigo:hover { opacity:.88; }
    .btn-ghost { background:#f8fafc; color:#374151 !important; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; font-size:12px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:background .15s; cursor:pointer; }
    .btn-ghost:hover { background:#f1f5f9; }
    .btn-outline-pill { background:#fff; color:#374151 !important; border:1px solid #e2e8f0; border-radius:50px; padding:8px 20px; font-size:13px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:background .15s; cursor:pointer; }
    .btn-outline-pill:hover { background:#f8fafc; }

    /* Row link arrow */
    .row-arrow { width:28px; height:28px; border-radius:7px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#64748b; text-decoration:none; flex-shrink:0; transition:all .15s; }
    .row-arrow:hover { background:#eff0fe; border-color:#c7d2fe; color:#6366f1; }
    @keyframes spin { to { transform:rotate(360deg); } }
  `],
  template: `
<div class="dash-page">
<div class="dash-inner">

  <!-- ══════ Header ══════ -->
  <div class="d-flex align-items-start justify-content-between mb-5 flex-wrap gap-3">
    <div>
      <div class="section-overline" style="color:#6366f1;">Consultant</div>
      <h2 style="font-weight:900;color:#0f172a;letter-spacing:-.5px;margin-bottom:6px;font-size:1.75rem;">
        Tableau de Bord
      </h2>
      <p style="color:#64748b;margin:0;font-size:14px;">
        Bienvenue, <strong style="color:#0f172a;">{{ currentUser?.firstName || currentUser?.username }}</strong>
      </p>
    </div>
    <button class="btn-outline-pill" (click)="reload()" [disabled]="loading">
      <i class="fas fa-rotate-right" [class.fa-spin]="loading"></i>Actualiser
    </button>
  </div>

  <!-- Loading overlay -->
  <div *ngIf="loading" style="text-align:center;padding:80px 0;">
    <div style="width:48px;height:48px;border:3px solid #e2e8f0;border-top-color:#6366f1;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>
    <p style="color:#64748b;margin:0;font-size:14px;">Chargement des données…</p>
  </div>

  <ng-container *ngIf="!loading">

    <!-- ══════ KPI Row ══════ -->
    <div class="row g-3 mb-4">

      <div class="col-6 col-md-3">
        <div class="kpi-card">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-building" style="color:#fff;font-size:18px;"></i>
            </div>
            <span style="background:#eff0fe;color:#4338ca;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Total</span>
          </div>
          <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ totalCompanies }}</div>
          <div style="color:#64748b;font-size:13px;margin-top:5px;">Entreprises</div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="kpi-card">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-chart-simple" style="color:#fff;font-size:18px;"></i>
            </div>
            <span style="background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Filtré</span>
          </div>
          <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ avgScore | number:'1.0-1' }}</div>
          <div style="color:#64748b;font-size:13px;margin-top:5px;">Score moyen</div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="kpi-card">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-circle-check" style="color:#fff;font-size:18px;"></i>
            </div>
            <span style="background:#f0fdf4;color:#15803d;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">Validées</span>
          </div>
          <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ validatedCount }}</div>
          <div style="color:#64748b;font-size:13px;margin-top:5px;">Évaluations OK</div>
        </div>
      </div>

      <div class="col-6 col-md-3">
        <div class="kpi-card">
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#f97316,#ea580c);display:flex;align-items:center;justify-content:center;">
              <i class="fas fa-hourglass-half" style="color:#fff;font-size:18px;"></i>
            </div>
            <span *ngIf="pendingEvals.length > 0"
                  style="background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">
              {{ pendingEvals.length }}
            </span>
            <span *ngIf="pendingEvals.length === 0"
                  style="background:#f0fdf4;color:#15803d;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;">
              OK
            </span>
          </div>
          <div style="font-size:2rem;font-weight:900;color:#0f172a;line-height:1;">{{ pendingEvals.length }}</div>
          <div style="color:#64748b;font-size:13px;margin-top:5px;">En attente</div>
        </div>
      </div>

    </div>
    <!-- /KPI Row -->

    <!-- ══════ Overdue alert ══════ -->
    <div *ngIf="overdueAlerts.length > 0"
         style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:12px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:start;gap:14px;">
      <i class="fas fa-triangle-exclamation fa-lg flex-shrink-0 mt-1" style="color:#ef4444;"></i>
      <div style="flex:1;">
        <div style="font-weight:700;color:#991b1b;font-size:14px;margin-bottom:8px;">
          {{ overdueAlerts.length }} évaluation(s) en retard — plus de 7 jours sans validation
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <a *ngFor="let al of overdueAlerts"
             [routerLink]="['/consultant/evaluations', al.evaluationId, 'review']"
             style="background:#fee2e2;color:#991b1b;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-building" style="font-size:9px;"></i>
            {{ al.companyName }}
            <span style="opacity:.75;">({{ daysPending(al.createdAt) }}j)</span>
            <i class="fas fa-arrow-right" style="font-size:9px;"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- ══════ Main 2-column ══════ -->
    <div class="row g-4 align-items-start">

      <!-- ═══ LEFT col ═══ -->
      <div class="col-lg-7">

        <!-- Filters bar -->
        <div class="section-card mb-4">
          <div style="padding:14px 20px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <i class="fas fa-filter" style="color:#94a3b8;font-size:13px;flex-shrink:0;"></i>
            <select class="filter-select" [(ngModel)]="filterSector">
              <option value="">Tous les secteurs</option>
              <option *ngFor="let s of sectors" [value]="s">{{ s }}</option>
            </select>
            <select class="filter-select" [(ngModel)]="filterCountry">
              <option value="">Tous les pays</option>
              <option *ngFor="let c of countries" [value]="c">{{ c }}</option>
            </select>
            <select class="filter-select" [(ngModel)]="filterSize">
              <option value="">Toutes les tailles</option>
              <option *ngFor="let sz of sizes" [value]="sz">{{ sz }}</option>
            </select>
            <button *ngIf="filterSector || filterCountry || filterSize"
                    class="btn-ghost" (click)="resetFilters()">
              <i class="fas fa-xmark"></i>Réinitialiser
            </button>
            <span style="margin-left:auto;font-size:12px;color:#64748b;font-weight:600;">
              {{ filteredEvals.length }} entreprise(s)
            </span>
          </div>
        </div>

        <!-- Charts row: Donut + Ranking -->
        <div class="row g-4">

          <!-- Donut chart -->
          <div class="col-md-5">
            <div class="section-card p-4 h-100">
              <div class="section-overline mb-1">Répartition</div>
              <h6 class="section-title mb-4">Niveaux de maturité</h6>

              <div *ngIf="filteredEvals.length === 0"
                   style="text-align:center;padding:32px 0;color:#94a3b8;">
                <i class="fas fa-chart-pie" style="font-size:32px;opacity:.2;display:block;margin-bottom:10px;"></i>
                <p style="margin:0;font-size:13px;">Aucune donnée</p>
              </div>

              <div *ngIf="filteredEvals.length > 0">
                <!-- SVG Donut -->
                <div style="display:flex;justify-content:center;margin-bottom:20px;position:relative;">
                  <svg viewBox="0 0 160 160" width="148" height="148">
                    <circle cx="80" cy="80" r="54" fill="none" stroke="#f1f5f9" stroke-width="22"/>
                    <circle *ngFor="let s of maturityDonut"
                            cx="80" cy="80" r="54" fill="none"
                            [attr.stroke]="s.color" stroke-width="22"
                            [attr.stroke-dasharray]="s.dash + ' ' + s.gap"
                            [attr.transform]="'rotate(' + s.rotDeg + ', 80, 80)'"/>
                    <text x="80" y="74" text-anchor="middle" font-size="22" font-weight="900" fill="#0f172a">
                      {{ filteredEvals.length }}
                    </text>
                    <text x="80" y="92" text-anchor="middle" font-size="9" fill="#94a3b8" font-weight="600">entreprises</text>
                  </svg>
                </div>

                <!-- Legend -->
                <div style="display:flex;flex-direction:column;gap:8px;">
                  <div *ngFor="let s of maturityDonut"
                       style="display:flex;align-items:center;gap:8px;">
                    <span style="width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;"
                          [style.background]="s.color"></span>
                    <span style="font-size:12px;flex:1;color:#374151;">{{ s.label }}</span>
                    <span style="font-weight:700;font-size:13px;color:#0f172a;">{{ s.count }}</span>
                    <span style="font-size:11px;color:#94a3b8;">({{ s.pct * 100 | number:'1.0-0' }}%)</span>
                  </div>
                  <div *ngFor="let lv of emptyLevels"
                       style="display:flex;align-items:center;gap:8px;opacity:.35;">
                    <span style="width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;"
                          [style.background]="lv.color"></span>
                    <span style="font-size:12px;flex:1;color:#94a3b8;">{{ lv.label }}</span>
                    <span style="font-size:12px;color:#94a3b8;">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ranking -->
          <div class="col-md-7">
            <div class="section-card p-4 h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <div class="section-overline mb-1">Performance</div>
                  <h6 class="section-title">Classement par score</h6>
                </div>
                <span style="background:#fefce8;color:#a16207;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">
                  Top {{ ranking.length }}
                </span>
              </div>

              <div *ngIf="ranking.length === 0"
                   style="text-align:center;padding:32px 0;color:#94a3b8;">
                <i class="fas fa-trophy" style="font-size:32px;opacity:.2;display:block;margin-bottom:10px;"></i>
                <p style="margin:0;font-size:13px;">Aucune évaluation</p>
              </div>

              <div *ngFor="let ev of ranking; let i = index" class="rank-row">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                  <!-- Rank number -->
                  <span style="width:22px;text-align:right;font-size:12px;font-weight:700;color:#94a3b8;flex-shrink:0;">
                    {{ i + 1 }}
                  </span>
                  <!-- Company name -->
                  <span style="font-size:13px;font-weight:600;color:#0f172a;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">
                    {{ ev.companyName }}
                  </span>
                  <!-- Maturity badge -->
                  <span style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:20px;flex-shrink:0;"
                        [style.background]="maturityBg(ev.maturityLevel)"
                        [style.color]="maturityColor(ev.maturityLevel)">
                    {{ maturityLabel(ev.maturityLevel) }}
                  </span>
                  <!-- Score -->
                  <span style="font-size:14px;font-weight:800;width:32px;text-align:right;flex-shrink:0;"
                        [style.color]="scoreColor(ev.globalScore)">
                    {{ ev.globalScore | number:'1.0-0' }}
                  </span>
                  <!-- Link -->
                  <a [routerLink]="['/consultant/evaluations', ev.evaluationId, 'review']"
                     class="row-arrow">
                    <i class="fas fa-arrow-right" style="font-size:10px;"></i>
                  </a>
                </div>
                <!-- Progress bar -->
                <div style="margin-left:32px;">
                  <div style="height:5px;background:#f1f5f9;border-radius:99px;overflow:hidden;">
                    <div style="height:100%;border-radius:99px;transition:width .6s ease;"
                         [style.width]="ev.globalScore + '%'"
                         [style.background]="scoreColor(ev.globalScore)">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <!-- /charts row -->

      </div>
      <!-- /LEFT -->

      <!-- ═══ RIGHT col ═══ -->
      <div class="col-lg-5">

        <!-- Pending evaluations card -->
        <div class="section-card mb-4">
          <div class="section-head">
            <div>
              <div class="section-overline">File de travail</div>
              <h6 class="section-title">Évaluations à valider</h6>
            </div>
            <span style="font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;"
                  [style.background]="pendingEvals.length > 0 ? '#fff7ed' : '#f0fdf4'"
                  [style.color]="pendingEvals.length > 0 ? '#c2410c' : '#15803d'">
              {{ pendingEvals.length }}
            </span>
          </div>

          <div style="padding:12px 12px 4px;">

            <!-- Empty state -->
            <div *ngIf="pendingEvals.length === 0"
                 style="text-align:center;padding:32px 12px;color:#94a3b8;">
              <i class="fas fa-check-circle"
                 style="font-size:30px;color:#22c55e;opacity:.5;display:block;margin-bottom:10px;"></i>
              <p style="margin:0;font-size:13px;">Toutes les évaluations sont traitées</p>
            </div>

            <!-- Pending rows -->
            <div *ngFor="let ev of pendingEvals" class="pending-row"
                 [style.background]="isOverdue(ev.createdAt) ? '#fef2f2' : '#f8fafc'"
                 [style.border]="isOverdue(ev.createdAt) ? '1px solid #fecaca' : '1px solid #f1f5f9'">

              <!-- Avatar -->
              <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:14px;"
                   [style.background]="isOverdue(ev.createdAt)
                     ? 'linear-gradient(135deg,#fca5a5,#ef4444)'
                     : 'linear-gradient(135deg,#fdba74,#f97316)'">
                {{ ev.companyName.charAt(0).toUpperCase() }}
              </div>

              <!-- Info -->
              <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:13px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px;">
                  {{ ev.companyName }}
                  <span *ngIf="isOverdue(ev.createdAt)"
                        style="background:#fee2e2;color:#991b1b;font-size:10px;font-weight:600;padding:1px 7px;border-radius:20px;flex-shrink:0;">
                    <i class="fas fa-clock" style="font-size:8px;margin-right:3px;"></i>{{ daysPending(ev.createdAt) }}j
                  </span>
                </div>
                <div style="font-size:11px;color:#64748b;margin-top:2px;">
                  <strong style="color:#0f172a;">{{ ev.globalScore | number:'1.0-1' }}/100</strong>
                  · {{ maturityLabel(ev.maturityLevel) }}
                  · {{ ev.createdAt | date:'dd/MM/yy' }}
                </div>
              </div>

              <!-- Validate button -->
              <a [routerLink]="['/consultant/evaluations', ev.evaluationId, 'review']"
                 [ngStyle]="{
                   'font-size':'11px','font-weight':'600','padding':'6px 14px',
                   'border-radius':'20px','text-decoration':'none','white-space':'nowrap',
                   'flex-shrink':'0','color':'#fff',
                   'background': isOverdue(ev.createdAt) ? '#ef4444' : '#f97316'
                 }">
                <i class="fas fa-magnifying-glass me-1"></i>Valider
              </a>
            </div>

          </div>
        </div>
        <!-- /pending card -->

        <!-- Quick navigation card -->
        <div class="section-card">
          <div class="section-head">
            <div>
              <div class="section-overline">Navigation</div>
              <h6 class="section-title">Accès rapide</h6>
            </div>
          </div>

          <a routerLink="/consultant/analysis" class="quick-link-row">
            <div style="width:40px;height:40px;border-radius:10px;background:#dcfce7;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-chart-line" style="color:#16a34a;font-size:15px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;color:#0f172a;">Résultats & Analyses</div>
              <div style="font-size:11px;color:#64748b;">Vue complète par entreprise</div>
            </div>
            <i class="fas fa-chevron-right" style="color:#cbd5e1;font-size:11px;flex-shrink:0;"></i>
          </a>

          <div class="quick-link-row" style="cursor:default;">
            <div style="width:40px;height:40px;border-radius:10px;background:#eff0fe;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-building" style="color:#6366f1;font-size:15px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;color:#0f172a;margin-bottom:6px;">Gestion des entreprises</div>
              <div style="display:flex;gap:8px;">
                <a routerLink="/companies"
                   style="background:#6366f1;color:#fff !important;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px;">
                  <i class="fas fa-list" style="font-size:10px;"></i>Liste
                </a>
                <a routerLink="/companies/new"
                   style="background:#f8fafc;color:#374151 !important;border:1px solid #e2e8f0;border-radius:8px;padding:5px 12px;font-size:11px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px;">
                  <i class="fas fa-plus" style="font-size:10px;"></i>Nouvelle
                </a>
              </div>
            </div>
          </div>

          <a routerLink="/consultant/frameworks" class="quick-link-row">
            <div style="width:40px;height:40px;border-radius:10px;background:#f5f3ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i class="fas fa-brain" style="color:#7c3aed;font-size:15px;"></i>
            </div>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;color:#0f172a;">Référentiels IA</div>
              <div style="font-size:11px;color:#64748b;">Frameworks de la base de connaissance</div>
            </div>
            <i class="fas fa-chevron-right" style="color:#cbd5e1;font-size:11px;flex-shrink:0;"></i>
          </a>

        </div>
        <!-- /quick nav -->

      </div>
      <!-- /RIGHT -->

    </div>
    <!-- /2-col layout -->

  </ng-container>

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
export class ConsultantDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  allEvals: EvalSummary[] = [];
  pendingEvals: PendingEval[] = [];
  companiesCount = 0;
  loading = true;

  filterSector  = '';
  filterCountry = '';
  filterSize    = '';

  powerBiUrl: SafeResourceUrl;

  private readonly LEVELS = [
    { level: 'INITIAL',       label: 'Initial',        color: '#ef4444' },
    { level: 'BASIQUE',       label: 'Basique',         color: '#f97316' },
    { level: 'INTERMEDIAIRE', label: 'Intermédiaire',   color: '#eab308' },
    { level: 'AVANCE',        label: 'Avancé',          color: '#3b82f6' },
    { level: 'OPTIMISE',      label: 'Optimisé',        color: '#22c55e' },
  ];

  private routerSub!: Subscription;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.powerBiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMmVlMWMxNjctZDdiYS00MTI0LWE2ZmEtNjQ3MjU3MzA3ZTQwIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9'
    );
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.load();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter(e => (e as NavigationEnd).urlAfterRedirects === '/consultant/dashboard')
    ).subscribe(() => { this.loading = true; this.load(); });
  }

  ngOnDestroy() { this.routerSub?.unsubscribe(); }

  reload() { this.loading = true; this.load(); }

  private load() {
    forkJoin({
      dashboard:  this.http.get<EvalSummary[]>(`${environment.apiUrl}/evaluations/dashboard`),
      pending:    this.http.get<PendingEval[]>(`${environment.apiUrl}/evaluations/pending-review`),
      companies:  this.http.get<any[]>(`${environment.apiUrl}/companies`)
    }).subscribe({
      next: ({ dashboard, pending, companies }) => {
        this.allEvals       = dashboard  || [];
        this.pendingEvals   = pending    || [];
        this.companiesCount = (companies || []).length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  resetFilters() { this.filterSector = ''; this.filterCountry = ''; this.filterSize = ''; }

  get latestByCompany(): EvalSummary[] {
    const seen = new Set<number>();
    return this.allEvals.filter(e => {
      if (seen.has(e.companyId)) return false;
      seen.add(e.companyId);
      return true;
    });
  }

  get filteredEvals(): EvalSummary[] {
    return this.latestByCompany.filter(e =>
      (!this.filterSector  || e.sector      === this.filterSector)  &&
      (!this.filterCountry || e.country     === this.filterCountry) &&
      (!this.filterSize    || e.companySize === this.filterSize)
    );
  }

  get sectors():   string[] { return [...new Set(this.latestByCompany.map(e => e.sector).filter(Boolean))].sort(); }
  get sizes():     string[] { return [...new Set(this.latestByCompany.map(e => e.companySize).filter(Boolean))].sort(); }

  private readonly COUNTRY_LIST = [
    'Algérie', 'Égypte', 'Libye', 'Maroc', 'Mauritanie', 'Soudan', 'Tunisie',
    'Afrique du Sud', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi',
    'Cameroun', 'Cap-Vert', 'Comores', 'Congo', "Côte d'Ivoire", 'Djibouti',
    'Érythrée', 'Éthiopie', 'Gabon', 'Gambie', 'Ghana', 'Guinée',
    'Guinée-Bissau', 'Guinée équatoriale', 'Kenya', 'Lesotho', 'Liberia',
    'Madagascar', 'Malawi', 'Mali', 'Mozambique', 'Namibie', 'Niger',
    'Nigeria', 'Ouganda', 'RD Congo', 'Rwanda', 'São Tomé-et-Príncipe',
    'Sénégal', 'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan du Sud',
    'Swaziland', 'Tanzanie', 'Tchad', 'Togo', 'Zambie', 'Zimbabwe',
    'Arabie saoudite', 'Bahreïn', 'Émirats arabes unis', 'Irak', 'Iran',
    'Israël', 'Jordanie', 'Koweït', 'Liban', 'Oman', 'Palestine',
    'Qatar', 'Syrie', 'Turquie', 'Yémen',
    'Allemagne', 'Andorre', 'Autriche', 'Belgique', 'Chypre', 'Danemark',
    'Espagne', 'Finlande', 'France', 'Grèce', 'Irlande', 'Islande',
    'Italie', 'Liechtenstein', 'Luxembourg', 'Malte', 'Monaco',
    'Norvège', 'Pays-Bas', 'Portugal', 'Royaume-Uni', 'Suède', 'Suisse',
    'Albanie', 'Biélorussie', 'Bosnie-Herzégovine', 'Bulgarie', 'Croatie',
    'Estonie', 'Hongrie', 'Kosovo', 'Lettonie', 'Lituanie', 'Macédoine du Nord',
    'Moldavie', 'Monténégro', 'Pologne', 'République tchèque', 'Roumanie',
    'Russie', 'Serbie', 'Slovaquie', 'Slovénie', 'Ukraine',
    'Argentine', 'Bolivie', 'Brésil', 'Canada', 'Chili', 'Colombie',
    'Costa Rica', 'Cuba', 'Équateur', 'États-Unis', 'Guatemala', 'Haïti',
    'Honduras', 'Jamaïque', 'Mexique', 'Nicaragua', 'Panama', 'Paraguay',
    'Pérou', 'République dominicaine', 'Salvador', 'Uruguay', 'Venezuela',
    'Afghanistan', 'Azerbaïdjan', 'Bangladesh', 'Cambodge', 'Chine',
    'Corée du Sud', 'Géorgie', 'Inde', 'Indonésie', 'Japon', 'Kazakhstan',
    'Kirghizistan', 'Laos', 'Malaisie', 'Maldives', 'Mongolie', 'Myanmar',
    'Népal', 'Ouzbékistan', 'Pakistan', 'Philippines', 'Singapour',
    'Sri Lanka', 'Tadjikistan', 'Thaïlande', 'Turkménistan', 'Viêt Nam',
    'Australie', 'Nouvelle-Zélande', 'Papouasie-Nouvelle-Guinée'
  ];

  get countries(): string[] {
    const fromData = this.latestByCompany.map(e => e.country).filter(Boolean) as string[];
    return [...new Set([...this.COUNTRY_LIST, ...fromData])].sort((a, b) =>
      a.localeCompare(b, 'fr', { sensitivity: 'base' })
    );
  }

  get totalCompanies(): number { return this.companiesCount; }

  get avgScore(): number {
    const evals = this.filteredEvals.filter(e => e.globalScore > 0);
    if (!evals.length) return 0;
    return evals.reduce((s, e) => s + e.globalScore, 0) / evals.length;
  }

  get validatedCount(): number {
    return this.latestByCompany.filter(e => e.status === 'VALIDATED').length;
  }

  get overdueAlerts(): PendingEval[] {
    return this.pendingEvals.filter(e => this.daysPending(e.createdAt) > 7);
  }

  isOverdue(createdAt: string): boolean { return this.daysPending(createdAt) > 7; }

  daysPending(createdAt: string): number {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
  }

  get ranking(): EvalSummary[] {
    return [...this.filteredEvals]
      .filter(e => e.globalScore > 0)
      .sort((a, b) => b.globalScore - a.globalScore)
      .slice(0, 10);
  }

  get maturityDonut(): DonutSegment[] {
    const total = this.filteredEvals.length;
    if (!total) return [];
    const C = 2 * Math.PI * 54;
    let cumDeg = -90;
    return this.LEVELS
      .map(lv => {
        const count = this.filteredEvals.filter(e => e.maturityLevel === lv.level).length;
        const pct   = count / total;
        const rotDeg = cumDeg;
        cumDeg += pct * 360;
        return { ...lv, count, pct, dash: pct * C, gap: (1 - pct) * C, rotDeg };
      })
      .filter(s => s.count > 0);
  }

  get emptyLevels() {
    const present = new Set(this.maturityDonut.map(s => s.level));
    return this.LEVELS.filter(lv => !present.has(lv.level));
  }

  scoreColor(score: number): string {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  }

  maturityLabel(level: string): string {
    return ({ INITIAL: 'Initial', BASIQUE: 'Basique', INTERMEDIAIRE: 'Intermédiaire',
              AVANCE: 'Avancé', OPTIMISE: 'Optimisé' } as Record<string,string>)[level] ?? level;
  }

  maturityColor(level: string): string {
    return ({ INITIAL: '#ef4444', BASIQUE: '#f97316', INTERMEDIAIRE: '#ca8a04',
              AVANCE: '#3b82f6', OPTIMISE: '#16a34a' } as Record<string,string>)[level] ?? '#6c757d';
  }

  maturityBg(level: string): string {
    return ({ INITIAL: '#fef2f2', BASIQUE: '#fff7ed', INTERMEDIAIRE: '#fefce8',
              AVANCE: '#eff6ff', OPTIMISE: '#f0fdf4' } as Record<string,string>)[level] ?? '#f1f5f9';
  }
}
