import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopLandingComponent } from './desktoplanding.component';

describe('LandingComponent', () => {
  let component: DesktopLandingComponent;
  let fixture: ComponentFixture<DesktopLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DesktopLandingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
