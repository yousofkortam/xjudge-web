import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserComponent } from './invite-user.component';

describe('InviteUserComponent', () => {
  let component: InviteUserComponent;
  let fixture: ComponentFixture<InviteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InviteUserComponent]
    });
    fixture = TestBed.createComponent(InviteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
