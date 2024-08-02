import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportprojwiseComponent } from './reportprojwise.component';

describe('ReportprojwiseComponent', () => {
  let component: ReportprojwiseComponent;
  let fixture: ComponentFixture<ReportprojwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportprojwiseComponent]
    });
    fixture = TestBed.createComponent(ReportprojwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
