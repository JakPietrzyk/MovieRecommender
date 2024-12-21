import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { User } from '../models/user.model';
import {ApiResponse} from "../models/api.response";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['authorizeUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation errors when form fields are touched and invalid', () => {
    const loginControl = component.loginForm.get('login');
    const passwordControl = component.loginForm.get('password');

    loginControl?.markAsTouched();
    passwordControl?.markAsTouched();

    fixture.detectChanges();

    const loginError = fixture.debugElement.query(By.css('#login + .text-danger'));
    const passwordError = fixture.debugElement.query(By.css('#password + .text-danger'));

    expect(loginError).not.toBeNull();
    expect(loginError.nativeElement.textContent).toContain('Login is required');

    expect(passwordError).not.toBeNull();
    expect(passwordError.nativeElement.textContent).toContain('Password is required');
  });

  it('should authorizeUser when form is valid', () => {
    component.loginForm.setValue({ login: 'login', password: 'password' });

    const mockUser: User = {
      id: 1,
      login: 'login',
      password: 'password'
    };

    authorizationServiceMock.authorizeUser.and.returnValue(of(mockUser));

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(authorizationServiceMock.authorizeUser).toHaveBeenCalledWith('login', 'password');
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });

  it('should display error message when authorizeUser returns error', () => {
    component.loginForm.setValue({ login: 'login', password: 'password' });

    const mockErrorResponse: ApiResponse = {
      message: 'Invalid credentials'
    };

    authorizationServiceMock.authorizeUser.and.returnValue(throwError({
      error: mockErrorResponse
    }));

    spyOn(window, 'alert');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(authorizationServiceMock.authorizeUser).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });
});
