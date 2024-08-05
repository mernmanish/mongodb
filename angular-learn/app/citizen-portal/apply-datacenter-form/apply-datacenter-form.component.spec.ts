import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyDatacenterFormComponent } from './apply-datacenter-form.component';

describe('ApplyDatacenterFormComponent', () => {
  let component: ApplyDatacenterFormComponent;
  let fixture: ComponentFixture<ApplyDatacenterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyDatacenterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyDatacenterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
