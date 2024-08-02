import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationmasterComponent } from './applicationmaster.component';

describe('ApplicationmasterComponent', () => {
  let component: ApplicationmasterComponent;
  let fixture: ComponentFixture<ApplicationmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationmasterComponent]
    });
    fixture = TestBed.createComponent(ApplicationmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
