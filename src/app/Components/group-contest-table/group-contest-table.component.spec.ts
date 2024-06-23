import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupContestTableComponent } from './group-contest-table.component';

describe('GroupContestTableComponent', () => {
  let component: GroupContestTableComponent;
  let fixture: ComponentFixture<GroupContestTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupContestTableComponent]
    });
    fixture = TestBed.createComponent(GroupContestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
