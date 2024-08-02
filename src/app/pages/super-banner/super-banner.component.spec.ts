import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperBannerComponent } from './super-banner.component';

describe('SuperBannerComponent', () => {
  let component: SuperBannerComponent;
  let fixture: ComponentFixture<SuperBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperBannerComponent]
    });
    fixture = TestBed.createComponent(SuperBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
