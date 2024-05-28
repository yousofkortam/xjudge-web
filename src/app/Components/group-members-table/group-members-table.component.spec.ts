import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMembersTableComponent } from './group-members-table.component';

describe('GroupMembersTableComponent', () => {
  let component: GroupMembersTableComponent;
  let fixture: ComponentFixture<GroupMembersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupMembersTableComponent]
    });
    fixture = TestBed.createComponent(GroupMembersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
