import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
})
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private mainContent: HTMLElement | null = null;

  constructor() {
    afterNextRender(() => {
      this.mainContent = this.document.getElementById('main-content');
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.mainContent) {
          this.mainContent.scrollTop = 0;
        }
      }
    });
  }
}
