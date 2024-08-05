import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyInnerComponent } from './policy-inner.component';

describe('PolicyInnerComponent', () => {
  let component: PolicyInnerComponent;
  let fixture: ComponentFixture<PolicyInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyInnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
