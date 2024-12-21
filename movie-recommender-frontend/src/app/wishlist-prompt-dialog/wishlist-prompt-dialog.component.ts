import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-wishlist-prompt-dialog',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './wishlist-prompt-dialog.component.html',
  styleUrl: './wishlist-prompt-dialog.component.scss'
})
export class WishlistPromptDialogComponent {
  constructor(private router: Router,
              private dialogRef: MatDialogRef<WishlistPromptDialogComponent>
  ) {}

  redirectToMoviesBrowser() {
    this.dialogRef.close();
    this.router.navigate(['/moviesBrowser']);
  }
}
