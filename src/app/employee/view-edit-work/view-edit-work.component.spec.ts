import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditWorkComponent } from './view-edit-work.component';

describe('ViewEditWorkComponent', () => {
  let component: ViewEditWorkComponent;
  let fixture: ComponentFixture<ViewEditWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEditWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEditWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
