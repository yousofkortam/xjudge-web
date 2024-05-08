import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSelectorHashtagComponent } from './problem-selector-hashtag.component';

describe('ProblemSelectorHashtagComponent', () => {
  let component: ProblemSelectorHashtagComponent;
  let fixture: ComponentFixture<ProblemSelectorHashtagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemSelectorHashtagComponent]
    });
    fixture = TestBed.createComponent(ProblemSelectorHashtagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
