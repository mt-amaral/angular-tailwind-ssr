import { Injectable } from '@angular/core';
import { NavItem } from '../models/nav-item.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  readonly items: NavItem[] = [
    { name: 'Home', icon: 'pi pi-home', routerLink: '/' },
  ];
}
