import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyBpoFormComponent } from './apply-bpo-form.component';

describe('ApplyBpoFormComponent', () => {
  let component: ApplyBpoFormComponent;
  let fixture: ComponentFixture<ApplyBpoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyBpoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyBpoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
