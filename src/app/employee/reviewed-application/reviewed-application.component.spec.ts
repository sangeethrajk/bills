import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedApplicationComponent } from './reviewed-application.component';

describe('ReviewedApplicationComponent', () => {
  let component: ReviewedApplicationComponent;
  let fixture: ComponentFixture<ReviewedApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewedApplicationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
