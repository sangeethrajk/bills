import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BillsService } from '../../services/bills.service';

@Component({
  selector: 'app-reviewed-list',
  templateUrl: './reviewed-list.component.html',
  styleUrl: './reviewed-list.component.css'
})
export class ReviewedListComponent implements OnInit {
  displayedColumns: string[] = ['slNo', 'name', 'workid', 'applieddate', 'division', 'action'];
  dataSource = new MatTableDataSource<WorkItem>([]);

  constructor(private router: Router, private apiService: BillsService) { }

  role = sessionStorage.getItem('role')!

  ngOnInit(): void {
    // this.getReviewedApplicationList();
  }

  // getReviewedApplicationList() {
  //   console.log(this.role)
  //   this.apiService.getReviewedWith(this.role).subscribe(data => {
  //     console.log(data.data);
  //     if (Array.isArray(data.data)) {
  //       const transformedData: WorkItem[] = data.data.map((item: { nameOfContractor: any; workId: any; appliedDate: any; division: any; estimateNo: any; nid: any }, index: number) => ({
  //         slNo: index + 1,
  //         name: item.nameOfContractor,
  //         workid: item.workId,
  //         applieddate: item.appliedDate,
  //         division: item.division,
  //         estimateno: item.estimateNo,
  //         nid: item.nid
  //       }));
  //       this.dataSource.data = transformedData;
  //     } else {
  //       console.error("API response is not an array.");
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  goto(id: string) {
    this.router.navigate(['employee', 'reviewed-application', id])
  }


}

interface WorkItem {
  slNo: number;
  name: string;
  workid: string;
  applieddate: string;
  division: string;
  estimateno: string;
}