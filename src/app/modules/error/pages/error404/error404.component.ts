import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error404',
  imports: [ButtonModule],
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css',
})
export class Error404Component {
  constructor(private router: Router) {}

  goToHomePage() {
    this.router.navigate(['/']);
  }
}
