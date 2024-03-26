import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcFormatContentComponent } from './lc-format-content.component';

describe('LcFormatContentComponent', () => {
  let component: LcFormatContentComponent;
  let fixture: ComponentFixture<LcFormatContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LcFormatContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LcFormatContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
