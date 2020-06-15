import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomnavComponent } from './roomnav.component';

describe('RoomnavComponent', () => {
  let component: RoomnavComponent;
  let fixture: ComponentFixture<RoomnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
