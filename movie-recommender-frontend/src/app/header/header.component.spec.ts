import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthorizationService } from "../services/authorization.service";
import { By } from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authorizationServiceMock: jasmine.SpyObj<AuthorizationService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authorizationServiceMock = jasmine.createSpyObj('AuthorizationService', ['isLoggedIn', 'logout']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthorizationService, useValue: authorizationServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show buttons when not logged in', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const recommendButton = fixture.debugElement.query(By.css('.recommend-btn'))
    const wishListButton = fixture.debugElement.query(By.css('.wishList-btn'))

    expect(recommendButton).toBeNull()
    expect(wishListButton).toBeNull()
  });

  it('should not show buttons when not logged in', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('.register-btn'));
    const loginButton = fixture.debugElement.query(By.css('.login-btn'));

    expect(registerButton).not.toBeNull();
    expect(loginButton).not.toBeNull();
  });

  it('should show buttons when logged in', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('.register-btn'));
    const loginButton = fixture.debugElement.query(By.css('.login-btn'));

    expect(registerButton).toBeNull();
    expect(loginButton).toBeNull();
  });

  it('should not show buttons when logged in', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('.logout-btn'));
    const recommendButton = fixture.debugElement.query(By.css('.recommend-btn'))
    const wishListButton = fixture.debugElement.query(By.css('.wishList-btn'))

    expect(logoutButton).not.toBeNull();
    expect(recommendButton).not.toBeNull();
    expect(wishListButton).not.toBeNull();
  });

  it('should navigate to /login when login button is clicked', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('.login-btn'));
    loginButton.triggerEventHandler('click', null);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /register when register button is clicked', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('.register-btn'));
    registerButton.triggerEventHandler('click', null);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should logout and navigate to / when logout button is clicked', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('.logout-btn'));
    logoutButton.triggerEventHandler('click', null);

    expect(authorizationServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to /recommend when recommend button is clicked', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const recommendButton = fixture.debugElement.query(By.css('.recommend-btn'));
    recommendButton.triggerEventHandler('click', null);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/recommend']);
  });

  it('should navigate to /wishList when wish list button is clicked', () => {
    authorizationServiceMock.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const wishListButton = fixture.debugElement.query(By.css('.wishList-btn'));
    wishListButton.triggerEventHandler('click', null);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/wishList']);
  });
});
