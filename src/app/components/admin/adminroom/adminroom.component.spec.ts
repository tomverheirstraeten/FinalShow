import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminroomComponent } from './adminroom.component';

describe('AdminroomComponent', () => {
  let component: AdminroomComponent;
  let fixture: ComponentFixture<AdminroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
