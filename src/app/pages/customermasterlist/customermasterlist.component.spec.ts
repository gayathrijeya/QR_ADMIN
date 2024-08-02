import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomermasterlistComponent } from './customermasterlist.component';

describe('CustomermasterlistComponent', () => {
  let component: CustomermasterlistComponent;
  let fixture: ComponentFixture<CustomermasterlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomermasterlistComponent]
    });
    fixture = TestBed.createComponent(CustomermasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
