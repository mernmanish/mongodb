import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToApplyComponent } from './how-to-apply.component';

describe('HowToApplyComponent', () => {
  let component: HowToApplyComponent;
  let fixture: ComponentFixture<HowToApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowToApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
