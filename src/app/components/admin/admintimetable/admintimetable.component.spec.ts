import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmintimetableComponent } from './admintimetable.component';

describe('AdmintimetableComponent', () => {
  let component: AdmintimetableComponent;
  let fixture: ComponentFixture<AdmintimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmintimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmintimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
