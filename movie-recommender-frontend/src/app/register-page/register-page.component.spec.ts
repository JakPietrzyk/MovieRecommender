import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPageComponent } from './register-page.component';
import { AuthorizationService } from '../services/authorization.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['createNewUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterPageComponent],
      providers: [
        FormBuilder,
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.registerForm.get('login')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should validate login and password fields as required', () => {
    const loginControl = component.registerForm.get('login');
    const passwordControl = component.registerForm.get('password');

    loginControl?.setValue('');
    passwordControl?.setValue('');

    expect(loginControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should display validation errors when form fields are touched and invalid', () => {
    const loginControl = component.registerForm.get('login');
    const passwordControl = component.registerForm.get('password');

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

  it('should submit the form successfully and navigate to home when valid', () => {
    authorizationServiceMock.createNewUser.and.returnValue(of("mockUser"));

    component.registerForm.setValue({ login: 'login', password: 'password' });

    component.onSubmit();

    expect(authorizationServiceMock.createNewUser).toHaveBeenCalledWith('login', 'password');
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });

  it('should show error message if registration fails', () => {
    spyOn(window, 'alert');
    authorizationServiceMock.createNewUser.and.returnValue(throwError('Error registering user'));

    component.registerForm.setValue({ login: 'login', password: 'password' });
    component.onSubmit();

    expect(authorizationServiceMock.createNewUser).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error registering user');
  });

  it('should disable submit button if form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    component.registerForm.setValue({ login: '', password: '' });
    fixture.detectChanges();

    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button if form is valid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    component.registerForm.setValue({ login: 'login', password: 'password' });
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();
  });
});
