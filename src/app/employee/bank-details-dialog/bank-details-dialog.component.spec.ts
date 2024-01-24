import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsDialogComponent } from './bank-details-dialog.component';

describe('BankDetailsDialogComponent', () => {
  let component: BankDetailsDialogComponent;
  let fixture: ComponentFixture<BankDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
