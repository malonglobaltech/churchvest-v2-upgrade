import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashedDepartmentsComponent } from './trashed-departments.component';

describe('TrashedDepartmentsComponent', () => {
  let component: TrashedDepartmentsComponent;
  let fixture: ComponentFixture<TrashedDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashedDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashedDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
