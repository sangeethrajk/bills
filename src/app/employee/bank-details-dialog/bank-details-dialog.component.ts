import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankDetails } from '../bank-accounts/bank-accounts.component';
import { BillsService } from '../../services/bills.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bank-details-dialog',
  templateUrl: './bank-details-dialog.component.html',
  styleUrl: './bank-details-dialog.component.css'
})
export class BankDetailsDialogComponent {
  bankDetailsForm: FormGroup;
  saveDisable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<BankDetailsDialogComponent>,
    private formBuilder: FormBuilder,
    private billsService: BillsService,
    private toastService: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: BankDetails
  ) {
    this.bankDetailsForm = this.formBuilder.group({
      bankAccNo: [data.bankAccNo || '', Validators.required], // Populate form with data if available
      bankAccHolder: [data.bankAccHolder || '', Validators.required],
      bankName: [data.bankName || '', Validators.required],
      branch: [data.branch || '', Validators.required],
      ifscCode: [data.ifscCode || '', Validators.required],
      id: [data.id || '']
    });
    console.log(this.bankDetailsForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveData() {
    if (this.bankDetailsForm.get('id')?.value == '') {
      this.onSave();
    } else {
      this.editAccount();
    }
  }

  onSave(): void {
    if (this.bankDetailsForm.valid) {
      this.saveDisable = true;
      const data = {
        "bankAccNo": this.bankDetailsForm.get('bankAccNo')?.value,
        "bankAccHolder": this.bankDetailsForm.get('bankAccHolder')?.value,
        "bankName": this.bankDetailsForm.get('bankName')?.value,
        "branch": this.bankDetailsForm.get('branch')?.value,
        "ifscCode": this.bankDetailsForm.get('ifscCode')?.value
      };
      this.billsService.saveBankAccount(data).subscribe(
        (response: any) => {
          console.log("Bank Account saved successfully: ", response);
          this.toastService.showToast('success', 'Bank Account saved successfully', '');
          this.dialogRef.close();
        },
        (error: any) => {
          console.error("Error while saving Bank Account: ", error);
          if (error.error.message == "Bank name already exists") {
            this.toastService.showToast('error', 'Bank name already exists', '');
          } else {
            this.toastService.showToast('error', 'Error while saving Bank Account', '');
          }

          this.saveDisable = false;
        }
      );
    } else {
      this.toastService.showToast('warning', 'Bank details form is not valid', '');
    }
  }

  editAccount(): void {
    if (this.bankDetailsForm.valid) {
      this.saveDisable = true;
      const data = {
        "bankAccNo": this.bankDetailsForm.get('bankAccNo')?.value,
        "bankAccHolder": this.bankDetailsForm.get('bankAccHolder')?.value,
        "bankName": this.bankDetailsForm.get('bankName')?.value,
        "branch": this.bankDetailsForm.get('branch')?.value,
        "ifscCode": this.bankDetailsForm.get('ifscCode')?.value
      };
      const id = this.bankDetailsForm.get('id')?.value;
      this.billsService.editBankAccount(data, id).subscribe(
        (response: any) => {
          console.log("Bank Account edited successfully: ", response);
          this.toastService.showToast('success', 'Bank Account edited successfully', '');
          this.dialogRef.close();
        },
        (error: any) => {
          console.error("Error while editing Bank Account: ", error);
          if (error.error.message == "Bank name already exists") {
            this.toastService.showToast('error', 'Bank name already exists', '');
          } else {
            this.toastService.showToast('error', 'Error while editing Bank Account', '');
          }

          this.saveDisable = false;
        }
      );
    } else {
      this.toastService.showToast('warning', 'Bank details form is not valid', '');
    }
  }
}
