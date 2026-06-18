import { enableProdMode, importProvidersFrom } from '@angular/core';

import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLoadingBarInterceptor } from '@ngx-loading-bar/http-client';
import { provideLoadingBarRouter } from '@ngx-loading-bar/router';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { apiInterceptor } from './app/core/interceptor/api.interceptor';
import { environment } from './environments/environment';
import { provideZonelessChangeDetection } from '@angular/core';

const AppPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
      dark: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.500}',
          activeColor: '{primary.400}',
        },
      },
    },
  },
});

if (environment.production) {
  enableProdMode();
  //show this warning only on prod mode
  if (window) {
    selfXSSWarning();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([apiInterceptor]), withInterceptorsFromDi()),
    provideLoadingBarRouter(),
    provideLoadingBarInterceptor(),
    provideTanStackQuery(new QueryClient()),
    MessageService,
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, utilities',
          },
        },
      },
    }),
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information sing an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}
