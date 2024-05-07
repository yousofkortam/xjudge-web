import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGroupsComponent } from './my-groups.component';

describe('MyGroupsComponent', () => {
  let component: MyGroupsComponent;
  let fixture: ComponentFixture<MyGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyGroupsComponent]
    });
    fixture = TestBed.createComponent(MyGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
