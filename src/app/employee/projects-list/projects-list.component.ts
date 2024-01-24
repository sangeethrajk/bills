import { Component } from '@angular/core';

export interface PeriodicElement {
  sno: string;
  projectName: string;
  projectValue: string;
  projectLocation: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { sno: '1', projectName: '14 Shops at Anna Nagar', projectValue: '50 Cr', projectLocation: 'Anna Nagar' },
];

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {

  displayedColumns: string[] = ['sno', 'projectName', 'projectValue', 'projectLocation', 'projectStatus', 'action'];
  dataSource = ELEMENT_DATA;

}
