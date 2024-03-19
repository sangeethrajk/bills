import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BankDetailsDialogComponent } from '../bank-details-dialog/bank-details-dialog.component';
import { BillsService } from '../../services/bills.service';

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
    private billsService: BillsService
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


  deleteBankDetails(bankDetail: BankDetails): void {
    const updatedData = this.dataSource.data.filter(item => item !== bankDetail);
    this.dataSource.data = updatedData;
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
