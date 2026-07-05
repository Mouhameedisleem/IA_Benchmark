import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, distinctUntilChanged, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentDate = new Date();
  breadcrumbs: { label: string; url: string }[] = [];
  questionnaireCompleted = false;

  /* Sidebar state */
  isSidebarOpen = false;
  openSections: { [key: string]: boolean } = {};

  /* Topbar panel state */
  isUserOpen  = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.generateBreadcrumbs();
        this.updateOpenSections();
        this.closeSidebar();
        this.closeAllPanels();
      }
    });
  }

  ngOnInit(): void {
    this.generateBreadcrumbs();
    this.updateOpenSections();

    this.authService.currentUser$.pipe(
      distinctUntilChanged((a, b) => a?.id === b?.id && a?.role === b?.role)
    ).subscribe(user => {
      if (user?.role === 'CLIENT' && user?.companyId) {
        this.http.get<any>(`${environment.apiUrl}/evaluations/latest?companyId=${user.companyId}`)
          .pipe(catchError(() => of(null)))
          .subscribe(ev => { this.questionnaireCompleted = !!ev?.evaluationId; });
      } else {
        this.questionnaireCompleted = false;
      }
    });
  }

  ngOnDestroy(): void {}

  /* ── Close all panels on outside click ── */
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeAllPanels();
  }

  /* ── Sidebar ── */
  toggleSidebar(): void { this.isSidebarOpen = !this.isSidebarOpen; }
  closeSidebar(): void  { this.isSidebarOpen = false; }

  toggleSection(key: string): void {
    this.openSections[key] = !this.openSections[key];
  }

  private updateOpenSections(): void {
    const url = this.router.url;
    if (url.includes('/companies')) this.openSections['enterprises'] = true;
    if (url.includes('/users'))     this.openSections['users']       = true;
  }

  /* ── User panel ── */
  toggleUserPanel(event: Event): void {
    event.stopPropagation();
    this.isUserOpen  = !this.isUserOpen;
  }
  closeUserPanel(): void { this.isUserOpen = false; }

  private closeAllPanels(): void {
    this.isUserOpen  = false;
  }

  /* ── Auth helpers ── */
  isAuthenticated(): boolean { return this.authService.isAuthenticated(); }
  hasRole(role: string | string[]): boolean { return this.authService.hasRole(role); }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }

  /* ── User info ── */
  getRoleLabel(): string {
    if (!this.currentUser) return '';
    const map: Record<string, string> = {
      ADMIN: 'Administrateur', CONSULTANT: 'Consultant', CLIENT: 'Client'
    };
    return map[this.currentUser.role] || this.currentUser.role;
  }

  getRoleBadgeClass(): string {
    if (!this.currentUser) return '';
    const map: Record<string, string> = {
      ADMIN: 'bg-danger', CONSULTANT: 'bg-primary', CLIENT: 'bg-success'
    };
    return map[this.currentUser.role] || 'bg-secondary';
  }

  hasCompany(): boolean    { return !!(this.currentUser?.companyId); }
  getCompanyId(): number | null { return this.currentUser?.companyId || null; }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last  = this.currentUser.lastName?.charAt(0)  || '';
    if (first && last) return (first + last).toUpperCase();
    return this.currentUser.username?.charAt(0).toUpperCase() || 'U';
  }

  getFullName(): string {
    if (!this.currentUser) return 'Utilisateur';
    if (this.currentUser.firstName && this.currentUser.lastName)
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    return this.currentUser.username || 'Utilisateur';
  }

  /* ── Routing ── */
  getHomeRoute(): string {
    if (!this.currentUser) return '/';
    switch (this.currentUser.role) {
      case 'ADMIN':      return '/admin/dashboard';
      case 'CONSULTANT': return '/consultant/dashboard';
      case 'CLIENT':     return '/client/dashboard';
      default:           return '/';
    }
  }

  isLinkActive(url: string): boolean { return this.router.url.includes(url); }

  /* ── Breadcrumb ── */
  private generateBreadcrumbs(): void {
    const urlParts = this.router.url.split('/').filter(p => p && p !== '');
    this.breadcrumbs = [{ label: 'Accueil', url: this.getHomeRoute() }];

    let currentUrl = '';
    const labelMap: Record<string, string> = {
      admin: 'Administration', consultant: 'Consultant', client: 'Client',
      dashboard: 'Dashboard', companies: 'Entreprises', users: 'Utilisateurs',
      reports: 'Rapports', powerbi: 'Power BI', new: 'Nouveau', edit: 'Modifier',
      questions: 'Questions', analysis: 'Analyses', frameworks: 'Référentiels IA',
      rapport: 'Rapport', questionnaire: 'Questionnaire', review: 'Révision'
    };

    urlParts.forEach(part => {
      currentUrl += `/${part}`;
      if (part.match(/^\d+$/)) return;
      const label = labelMap[part] ||
        part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      this.breadcrumbs.push({ label, url: currentUrl });
    });
  }
}
