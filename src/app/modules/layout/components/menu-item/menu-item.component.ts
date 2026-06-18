import { booleanAttribute, Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavItem } from '../../models/nav-item.model';

@Component({
  selector: 'li[app-menu-item]',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  host: {
    '[class.is-root]': 'root',
    '[class.is-child]': '!root',
  },
})
export class MenuItemComponent implements OnInit {
  @Input() item!: NavItem;
  @Input({ transform: booleanAttribute }) root = true;

  expanded = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.item.children) {
      this.expanded = this.item.children.some((c) => !!c.routerLink && this.router.url.startsWith(c.routerLink));
    }
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
