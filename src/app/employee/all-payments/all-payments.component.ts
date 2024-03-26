import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BillsService } from '../../services/bills.service';
import { CanaraBankService } from '../../services/canara-bank.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LcFormatContentComponent } from '../lc-format-content/lc-format-content.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-all-payments',
  templateUrl: './all-payments.component.html',
  styleUrl: './all-payments.component.css'
})
export class AllPaymentsComponent {

  activeTab: string = 'tab1';

  displayedColumns: string[] = ['sno', 'nameOfTheWork', 'billTotal', 'billPayFor', 'billCreationDate', 'billStatus', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private billsService: BillsService,
    private canaraBankService: CanaraBankService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAllProcessedBills();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
  }

  getAllProcessedBills() {
    this.billsService.getAllProcessedBills().subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource = response.data.map((item: { bill: { billCreationDate: any; billTotal: any; billPayFor: any; billStatus: any; userRefNumber: any; utrNumber: any; tnhbBankName: any; id: any; }; workList: { nameOfTheWork: any; }; }) => {
          return {
            billCreationDate: item.bill.billCreationDate,
            billTotal: item.bill.billTotal,
            billPayFor: item.bill.billPayFor,
            billStatus: item.bill.billStatus,
            userRefNumber: item.bill.userRefNumber,
            utrNumber: item.bill.utrNumber,
            tnhbBankName: item.bill.tnhbBankName,
            id: item.bill.id,
            nameOfTheWork: item.workList.nameOfTheWork
          };
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  checkStatus(billData: any) {
    console.log(billData);
    if (billData.tnhbBankName === 'Canara Bank') {
      const data = {
        UTR: "",
        UserRefno: billData.userRefNumber
      };
      this.canaraBankService.checkStatus(data).subscribe(
        (response: any) => {
          const responseData = JSON.parse(response.data);
          const encryptedData = responseData.Response.body.encryptData
          if (encryptedData) {
            this.canaraBankService.decryptData(encryptedData).subscribe(
              (response: any) => {
                console.log(response);
                const decryptedData = response;
                if (decryptedData.PaymentStatusInquiryDTO.TxnDesc === " In Progress") {
                  this.generateLC(billData.id);
                }
              },
              (error: any) => {
                console.error(error);
              }
            );
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
    }

  }

  generateLC(id: any) {
    if (id) {
      this.billsService.getSingleBillBasedOnId(id).subscribe(
        (response: any) => {
          console.log(response);
          const dialogRef = this.dialog.open(LcFormatContentComponent, {
            width: '50vw', // Width of A4 paper in landscape mode
            height: '90vh', // Height of A4 paper in landscape mode
            data: response
          });
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }


}


