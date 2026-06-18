import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, REQUEST, signal } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly serverRequest = inject(REQUEST, { optional: true });

  public theme = signal<Theme>({ mode: 'dark' });

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setConfig();
    });
  }

  private loadTheme() {
    const stored = this.isBrowser ? localStorage.getItem('theme') : this.readServerCookie('theme');
    if (stored) {
      try {
        this.theme.set(JSON.parse(stored));
      } catch {
        this.theme.set({ mode: 'dark' });
      }
    }
  }

  private setConfig() {
    this.setThemeClass();
    if (this.isBrowser) {
      this.persist();
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

  private persist() {
    const value = JSON.stringify(this.theme());
    localStorage.setItem('theme', value);
    this.document.cookie = `theme=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  }

  private readServerCookie(name: string): string | null {
    const cookies = this.serverRequest?.headers.get('cookie');
    if (!cookies) {
      return null;
    }
    for (const part of cookies.split(';')) {
      const [key, ...rest] = part.trim().split('=');
      if (key === name) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return null;
  }
}
