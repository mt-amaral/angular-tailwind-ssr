import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [ReactiveFormsModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule],
})
export class SignInComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  form!: FormGroup;
  submitted = false;
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  get f() {
    return this.form.controls;
  }

  loginWithGoogle(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password, rememberMe } = this.form.getRawValue();

    this.auth.login({ email, password, rememberMe }).subscribe((success) => {
      this.loading.set(false);
      if (success) {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage.set('Email ou senha inválidos');
      }
    });
  }
}
