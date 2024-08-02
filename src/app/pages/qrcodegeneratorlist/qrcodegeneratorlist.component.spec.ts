import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodegeneratorlistComponent } from './qrcodegeneratorlist.component';

describe('QrcodegeneratorlistComponent', () => {
  let component: QrcodegeneratorlistComponent;
  let fixture: ComponentFixture<QrcodegeneratorlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrcodegeneratorlistComponent]
    });
    fixture = TestBed.createComponent(QrcodegeneratorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
