import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankDetails } from '../bank-accounts/bank-accounts.component';

@Component({
  selector: 'app-bank-details-dialog',
  templateUrl: './bank-details-dialog.component.html',
  styleUrl: './bank-details-dialog.component.css'
})
export class BankDetailsDialogComponent {
  bankDetailsForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BankDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: BankDetails,
    private formBuilder: FormBuilder
  ) {
    this.bankDetailsForm = this.formBuilder.group({
      accountNumber: [dialogData.accountNumber || '', Validators.required],
      accountHolder: [dialogData.accountHolder || '', Validators.required],
      bankName: [dialogData.bankName || '', Validators.required],
      bankBranch: [dialogData.bankBranch || '', Validators.required],
      ifscCode: [dialogData.ifscCode || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bankDetailsForm.valid) {
      this.dialogRef.close(this.bankDetailsForm.value);
    }
  }
}
