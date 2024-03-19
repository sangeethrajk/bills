import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BillsService } from '../../services/bills.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export interface WorkDetail {
  nameOfWork: string;
  agreementNumber: string;
  agreementValue: number;
  agreementDate: Date;
  dateOfCommencement: Date;
  dateOfCompletion: Date;
}

@Component({
  selector: 'app-view-all-works',
  templateUrl: './view-all-works.component.html',
  styleUrl: './view-all-works.component.css'
})
export class ViewAllWorksComponent implements OnInit {

  division: any;

  displayedColumns: string[] = [
    'nameOfTheWork',
    'agreementNumber',
    'agreementValue',
    'agreementDate',
    'commencementDate',
    'completionDate',
    'assignedAE',
    'assignedAEE',
    'creationTime',
    'action'
  ];

  dataSource = new MatTableDataSource<WorkDetail>([]);

  constructor(
    private billsService: BillsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.division = sessionStorage.getItem('division');
    this.getAllWorks();
  }

  getAllWorks() {
    this.billsService.getAllWorks(this.division).subscribe(
      (response: any) => {
        console.log('All Works Data : ', response);
        this.dataSource.data = response;
      },
      (error: any) => {
        console.error('Error in fetching  all works : ', error);
      }
    );
  }

  deleteWork(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to delete the work?',
        confirmBackgroundColor: 'red',
        cancelBackgroundColor: 'white',
        confirmTextColor: 'white',
        cancelTextColor: 'black',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.billsService.deleteWorkById(id).subscribe(
          (response: any) => {
            this.getAllWorks();
          },
          (error: any) => {
            console.error('Error in deleting scheme data. Please try again later.', error);
          }
        );
      }
    });
  }


}
