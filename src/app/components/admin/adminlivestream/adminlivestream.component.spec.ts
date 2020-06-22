import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlivestreamComponent } from './adminlivestream.component';

describe('AdminlivestreamComponent', () => {
  let component: AdminlivestreamComponent;
  let fixture: ComponentFixture<AdminlivestreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminlivestreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminlivestreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
