import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestRankComponent } from './contest-rank.component';

describe('ContestRankComponent', () => {
  let component: ContestRankComponent;
  let fixture: ComponentFixture<ContestRankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContestRankComponent]
    });
    fixture = TestBed.createComponent(ContestRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
