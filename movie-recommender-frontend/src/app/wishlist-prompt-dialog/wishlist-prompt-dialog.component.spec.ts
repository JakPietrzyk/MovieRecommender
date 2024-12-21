import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistPromptDialogComponent } from './wishlist-prompt-dialog.component';

describe('WishlistPromptDialogComponent', () => {
  let component: WishlistPromptDialogComponent;
  let fixture: ComponentFixture<WishlistPromptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPromptDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistPromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
