import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BillsService } from '../../services/bills.service';
import { ToastService } from '../../services/toast.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrl: './pending-list.component.css'
})
export class PendingListComponent implements OnInit {

  division: any;
  role: any;
  username: any;
  activeTab: string = 'tab1';

  displayedColumns: string[] = ['slNo', 'nameOfTheWork', 'billTotal', 'billCreationDate', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();

  constructor(
    private router: Router,
    private apiService: BillsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.division = sessionStorage.getItem('division');
    this.role = sessionStorage.getItem('role');
    this.username = sessionStorage.getItem('username');
    if (this.role === 'AE' || this.role === 'AEE' || this.role === 'DA' || this.role === 'EE') {
      this.getAllBillsBasedOnDivision();
    } else if (this.role === 'SE' || this.role === 'SEHQ' || this.role === 'CE' || this.role === 'FA' || this.role === 'MD') {
      this.getAllBillsForUsername();
    } else if (this.role === 'DCAO') {
      this.getAllPendingBillsForDCAO();
      this.getBillsProcessedByMD();
    }

  }

  getAllBillsBasedOnDivision() {
    this.apiService.getAllBillsBasedOnDivision(this.division, this.role).subscribe(
      (response: any) => {
        console.log(response);
        if (this.role === "AE") {
          this.dataSource = response.filter((item: { firstOfficer: any; }) => this.username === item.firstOfficer);
        } else if (this.role === "AEE") {
          this.dataSource = response.filter((item: { secondOfficer: any; }) => this.username === item.secondOfficer);
        } else if (this.role === "DA") {
          this.dataSource = response.filter((item: { thirdOfficer: any; }) => this.username === item.thirdOfficer);
        } else if (this.role === "EE") {
          this.dataSource = response.filter((item: { fourthOfficer: any; }) => this.username === item.fourthOfficer);
        }
      },
      (error: any) => {
        console.error(error);
        this.toastService.showToast('error', 'Error while fetching data', '');
      }
    );
  }

  getAllBillsForUsername() {
    this.apiService.getAllBillsForUsername(this.username, this.role).subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource = response;
      },
      (error: any) => {
        console.error(error);
        this.toastService.showToast('error', 'Error while fetching data', '');
      }
    );
  }

  getAllPendingBillsForDCAO() {
    this.apiService.getAllBillsForUsername(this.username, this.role).subscribe(
      (response: any) => {
        console.log(response);
        // Assuming you have some logic to determine if a bill is pending for DCAO
        const pendingBillsForDCAO = response.filter((bill: any) => {
          return !bill.dateOfSubmissionMD; // Adjust this condition based on your logic
        });
        this.dataSource = pendingBillsForDCAO;
      },
      (error: any) => {
        console.error(error);
        this.toastService.showToast('error', 'Error while fetching data', '');
      }
    );
  }

  getBillsProcessedByMD() {
    this.apiService.getAllBillsProcessedByMD().subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource2 = response;
      },
      (error: any) => {
        console.error(error);
        this.toastService.showToast('error', 'Error while fetching data', '');
      }
    );
  }

  goto(id: string, value: string) {
    // Define your query parameters
    const queryParams = { mdprocessed: value };

    // Navigate to the target route with query parameters
    this.router.navigate(['employee', 'pending-application', id], { queryParams });
  }

}
