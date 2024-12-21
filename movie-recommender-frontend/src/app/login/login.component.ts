import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
import {User} from "../models/user.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    login: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });
  loggedInUser?: User;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authorizationService: AuthorizationService
  ) {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;

      this.authorizationService.authorizeUser(login, password).subscribe({
        next: data => {
          if ('message' in data) {
            alert(data.message);
          } else {
            this.loggedInUser = data;
            this.router.navigate(['']);
          }
        },
        error: err => {
          console.error('Error logging user', err);
          const errorMessage = err.error?.message || 'An error occurred while logging in. Please try again.';
          alert(errorMessage);
        }
      });
    }
  }
}
