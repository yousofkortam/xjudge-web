import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailsComponent } from './contest-details.component';

describe('ContestDetailsComponent', () => {
  let component: ContestDetailsComponent;
  let fixture: ComponentFixture<ContestDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContestDetailsComponent]
    });
    fixture = TestBed.createComponent(ContestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
