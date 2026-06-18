import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-nav-user',
  imports: [AvatarModule, MenuModule],
  templateUrl: './nav-user.component.html',
})
export class NavUserComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly name = computed(() => this.auth.user()?.name || 'Usuário');
  readonly email = computed(() => this.auth.user()?.email || '');
  readonly initials = computed(() => {
    const name = this.auth.user()?.name?.trim();
    if (!name) {
      return '?';
    }
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  });

  readonly items: MenuItem[] = [{ label: 'Sair', icon: 'pi pi-sign-out', command: () => this.logout() }];

  private logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/sign-in'));
  }
}
