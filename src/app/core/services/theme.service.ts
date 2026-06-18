import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public theme = signal<Theme>({ mode: 'dark' });

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setConfig();
    });
  }

  private loadTheme() {
    if (!this.isBrowser) {
      return;
    }
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.set(JSON.parse(theme));
    }
  }

  private setConfig() {
    this.setThemeClass();
    if (this.isBrowser) {
      this.setLocalStorage();
    }
  }

  public get isDark(): boolean {
    return this.theme().mode == 'dark';
  }

  public toggleTheme(): void {
    this.theme.update((t) => ({ ...t, mode: t.mode === 'dark' ? 'light' : 'dark' }));
  }

  private setThemeClass() {
    this.document.documentElement.classList.toggle('dark', this.isDark);
  }

  private setLocalStorage() {
    localStorage.setItem('theme', JSON.stringify(this.theme()));
  }
}
