import { Component } from '@angular/core';
import { BillsService } from '../../services/bills.service';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  sno: string;
  projectName: string;
  projectValue: string;
  projectLocation: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { sno: '1', projectName: '14 Shops at Anna Nagar', projectValue: '50 Cr', projectLocation: 'Anna Nagar' },
// ];

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {

  division: any;

  displayedColumns: string[] = ['sno', 'workName', 'agreementValue', 'projectStatus', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(private billsService: BillsService) { }

  ngOnInit() {
    this.division = sessionStorage.getItem('division');
    this.getPendingProjectsByDivision();
  }

  getPendingProjectsByDivision() {
    this.billsService.getPendingProjectsByDivision(this.division).subscribe(
      (response: any) => {
        console.log("Response of getting pending projects by division : ", response);
        this.dataSource = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

}
