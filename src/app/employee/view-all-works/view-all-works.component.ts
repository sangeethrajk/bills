import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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
  displayedColumns: string[] = [
    'nameOfWork',
    'agreementNumber',
    'agreementValue',
    'agreementDate',
    'dateOfCommencement',
    'dateOfCompletion'
  ];

  dataSource = new MatTableDataSource<WorkDetail>([]);

  ngOnInit() {
    // Fetch your work details data from a service or wherever it comes from
    // For example, you might have a service method like getWorkDetails() that returns an Observable
    // Here, for illustration, I'm assuming you have a hardcoded array of work details
    const hardcodedWorkDetails: WorkDetail[] = [
      // ... your work details here ...
    ];

    this.dataSource.data = hardcodedWorkDetails;
  }
}
