import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ToastModule } from 'primeng/toast';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, ToastModule, LoadingBarModule],
})
export class AppComponent {
  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService) {}
}
