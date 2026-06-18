import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { MenuComponent } from '../menu/menu.component';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [ButtonModule, DrawerModule, MenuComponent, ThemeSwitchComponent],
})
export class NavbarComponent {
  mobileVisible = false;
}
