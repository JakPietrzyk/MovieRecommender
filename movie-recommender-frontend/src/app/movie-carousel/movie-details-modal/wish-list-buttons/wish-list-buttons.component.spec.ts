import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListButtonsComponent } from './wish-list-buttons.component';

describe('WishListButtonsComponent', () => {
  let component: WishListButtonsComponent;
  let fixture: ComponentFixture<WishListButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishListButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
