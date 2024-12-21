import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router,
              private authorizationService: AuthorizationService
    ) {}


  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToRecommend(): void {
    this.router.navigate(['/recommend']);
  }

  navigateToWishList(): void {
    this.router.navigate(['/wishList']);
  }

  navigateToMovieBrowser(): void {
    this.router.navigate(['/moviesBrowser']);
  }

  isLoggedIn(): boolean {
    return this.authorizationService.isLoggedIn();
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  onRegisterClick()
  {
    this.router.navigate(['/register']);
  }
  onLogoutClick(): void {
    this.authorizationService.logout();
    this.router.navigate(['/']);
  }
}
