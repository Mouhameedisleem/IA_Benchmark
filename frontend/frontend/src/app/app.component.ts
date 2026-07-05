import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { filter } from 'rxjs/operators';

const PUBLIC_ROUTES = ['/home', '/login', '/register', '/forgot-password'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <ng-container *ngIf="showNavbar; else publicLayout">
      <app-navbar></app-navbar>
      <div class="main-content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </ng-container>
    <ng-template #publicLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
export class AppComponent {
  showNavbar = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url: string = e.urlAfterRedirects || e.url;
        this.showNavbar = !PUBLIC_ROUTES.some(p => url === p || url.startsWith(p + '?'));
      });
  }
}