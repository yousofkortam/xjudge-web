import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationComponent } from './invitation.component';

describe('InvitationComponent', () => {
  let component: InvitationComponent;
  let fixture: ComponentFixture<InvitationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationComponent]
    });
    fixture = TestBed.createComponent(InvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
