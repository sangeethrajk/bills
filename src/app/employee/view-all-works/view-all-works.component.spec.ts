import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllWorksComponent } from './view-all-works.component';

describe('ViewAllWorksComponent', () => {
  let component: ViewAllWorksComponent;
  let fixture: ComponentFixture<ViewAllWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAllWorksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
