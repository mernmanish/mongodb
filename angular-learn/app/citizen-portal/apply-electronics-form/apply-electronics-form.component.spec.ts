import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyElectronicsFormComponent } from './apply-electronics-form.component';

describe('ApplyElectronicsFormComponent', () => {
  let component: ApplyElectronicsFormComponent;
  let fixture: ComponentFixture<ApplyElectronicsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyElectronicsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyElectronicsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
