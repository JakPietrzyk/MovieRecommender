import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  registerForm: FormGroup = this.fb.group({
    login: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authorizationService: AuthorizationService
  ) {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { login, password } = this.registerForm.value;

      this.authorizationService.createNewUser(login, password)
        .subscribe({
          next: () => {
            this.router.navigate(['']);
          },
          error: (err) => {
            console.error('Error registering user', err);
            alert('Error registering user');
          }
      });
    }
  }
}
