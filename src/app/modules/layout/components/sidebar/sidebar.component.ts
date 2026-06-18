import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { NavUserComponent } from '../nav-user/nav-user.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [MenuComponent, NavUserComponent],
})
export class SidebarComponent {}
