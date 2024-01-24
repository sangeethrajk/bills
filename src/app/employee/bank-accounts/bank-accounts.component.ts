import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BankDetailsDialogComponent } from '../bank-details-dialog/bank-details-dialog.component';

export interface BankDetails {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  ifscCode: string;
  bankBranch: string;
}

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.css'
})
export class BankAccountsComponent {
  dataSource = new MatTableDataSource<BankDetails>([]);

  displayedColumns: string[] = ['accountNumber', 'accountHolder', 'bankName', 'ifscCode', 'bankBranch', 'actions'];

  constructor(public dialog: MatDialog) { }

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
          item === bankDetail ? { ...bankDetail, ...result } : item
        );
        this.dataSource.data = updatedData;
      }
    });
  }

  deleteBankDetails(bankDetail: BankDetails): void {
    const updatedData = this.dataSource.data.filter(item => item !== bankDetail);
    this.dataSource.data = updatedData;
  }
}
