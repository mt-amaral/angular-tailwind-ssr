import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switch',
  imports: [ButtonModule],
  template: `
    <p-button
      [icon]="themeService.theme().mode === 'dark' ? 'pi pi-moon' : 'pi pi-sun'"
      severity="secondary"
      [text]="true"
      [rounded]="true"
      ariaLabel="Trocar tema"
      (onClick)="themeService.toggleTheme()" />
  `,
})
export class ThemeSwitchComponent {
  protected readonly themeService = inject(ThemeService);
}
