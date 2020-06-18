import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminroomsComponent } from './adminrooms.component';

describe('AdminroomsComponent', () => {
  let component: AdminroomsComponent;
  let fixture: ComponentFixture<AdminroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
