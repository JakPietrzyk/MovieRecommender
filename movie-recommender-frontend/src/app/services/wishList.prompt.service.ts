import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthorizationService } from './authorization.service';
import {WishListService} from "./wishList.service";
import {WishlistPromptDialogComponent} from "../wishlist-prompt-dialog/wishlist-prompt-dialog.component";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class WishListPromptService {
  constructor(
    private authorizationService: AuthorizationService,
    private wishListService: WishListService,
    private dialog: MatDialog
  ) {}

  checkAndPromptWishlistIsEmpty(): Observable<boolean> {
    const currentUser = this.authorizationService.getCurrentUser() as User;
    if (!currentUser) {
      return new Observable(observer => observer.complete());
    }

    return this.wishListService.isWishListEmpty(currentUser).pipe(
      tap((isEmpty: boolean) => {
        if (isEmpty) {
          this.openWishlistPromptDialog();
        }
      })
    );
  }

  private openWishlistPromptDialog(): void {
    this.dialog.open(WishlistPromptDialogComponent);
  }
}
