import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMasterlistComponent } from './project-masterlist.component';

describe('ProjectMasterlistComponent', () => {
  let component: ProjectMasterlistComponent;
  let fixture: ComponentFixture<ProjectMasterlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectMasterlistComponent]
    });
    fixture = TestBed.createComponent(ProjectMasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
