import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';
import { effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public theme = signal<Theme>({ mode: 'dark' });

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setConfig();
    });
  }

  private loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.set(JSON.parse(theme));
    }
  }

  private setConfig() {
    this.setLocalStorage();
    this.setThemeClass();
  }

  public get isDark(): boolean {
    return this.theme().mode == 'dark';
  }

  public toggleTheme(): void {
    this.theme.update((t) => ({ ...t, mode: t.mode === 'dark' ? 'light' : 'dark' }));
  }

  private setThemeClass() {
    document.querySelector('html')!.className = this.theme().mode;
  }

  private setLocalStorage() {
    localStorage.setItem('theme', JSON.stringify(this.theme()));
  }
}
