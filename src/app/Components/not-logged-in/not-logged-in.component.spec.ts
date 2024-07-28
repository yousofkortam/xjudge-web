import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedInComponent } from './not-logged-in.component';

describe('NotLoggedInComponent', () => {
  let component: NotLoggedInComponent;
  let fixture: ComponentFixture<NotLoggedInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotLoggedInComponent]
    });
    fixture = TestBed.createComponent(NotLoggedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
