import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BankDetailsDialogComponent } from '../bank-details-dialog/bank-details-dialog.component';
import { BillsService } from '../../services/bills.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface BankDetails {
  bankAccNo: string;
  bankAccHolder: string;
  bankName: string;
  ifscCode: string;
  branch: string;
  id: any;
}

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.css'
})
export class BankAccountsComponent {
  dataSource = new MatTableDataSource<BankDetails>([]);

  displayedColumns: string[] = ['bankAccNo', 'bankAccHolder', 'bankName', 'ifscCode', 'branch', 'actions'];

  constructor(
    public dialog: MatDialog,
    private billsService: BillsService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.getAllBankAccounts();
  }

  openBankDetailsDialog(): void {
    const dialogRef = this.dialog.open(BankDetailsDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: BankDetails) => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  editBankDetails(bankDetail: BankDetails): void {
    const dialogRef = this.dialog.open(BankDetailsDialogComponent, {
      width: '400px',
      data: { ...bankDetail }
    });

    dialogRef.afterClosed().subscribe((result: BankDetails) => {
      if (result) {
        const updatedData = this.dataSource.data.map(item =>
          item === bankDetail ? { ...item, ...result } : item
        );
        this.dataSource.data = updatedData;
      }
    });
  }


  deleteBankDetails(id: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to delete this bank account?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // If confirmed
        this.billsService.deleteBankAccount(id).subscribe(
          (response: any) => {
            this.toastService.showToast('success', 'Bank Account deleted successfully', '');
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          (error: any) => {
            this.toastService.showToast('error', 'Error while deleting Bank Account', '');
          }
        );
      }
    });
  }


  getAllBankAccounts() {
    this.billsService.getAllBankAccounts().subscribe(
      (response: any) => {
        console.log("All bank accounts: ", response);
        this.dataSource = response.data;
      },
      (error: any) => {
        console.error("Error in fetching all bank accounts", error);
      }
    );
  }
}
