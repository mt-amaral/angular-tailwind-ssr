import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuItemComponent],
  template: `
    <ol class="layout-menu">
      @for (item of menuService.items; track item.name) {
        <li app-menu-item [item]="item" [root]="true"></li>
      }
    </ol>
  `,
  styles: [
    `
      .layout-menu {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }
    `,
  ],
})
export class MenuComponent {
  constructor(public menuService: MenuService) {}
}
