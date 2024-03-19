import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillsService } from '../../services/bills.service';
import { ActivatedRoute } from '@angular/router';

interface Officer {
  roles: { name: string }[]; // Define roles as an array of objects with a name property
  username: string;
  circle: string;
}

@Component({
  selector: 'app-view-edit-work',
  templateUrl: './view-edit-work.component.html',
  styleUrl: './view-edit-work.component.css'
})
export class ViewEditWorkComponent {

  workDetailsForm!: FormGroup;
  division: any;
  workId: any;
  aeUsernames: string[] = [];
  aeeUsernames: string[] = [];
  thirdOfficer: any;
  fourthOfficer: any;
  circle: any;

  constructor(
    private formBuilder: FormBuilder,
    private billsService: BillsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.division = sessionStorage.getItem('division');
    this.workDetailsForm = this.formBuilder.group({
      nameOfTheWork: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      agreementValue: ['', Validators.required],
      agreementDate: ['', Validators.required],
      commencementDate: ['', Validators.required],
      completionDate: ['', Validators.required],
      division: ['', Validators.required],
      firstOfficer: ['', Validators.required],
      secondOfficer: ['', Validators.required],
      thirdOfficer: [''],
      fourthOfficer: [''],
      fifthOfficer: [''],
      sixthOfficer: [''],
      seventhOfficer: ['', Validators.required],
      eightOfficer: [''],
      ninthOfficer: [''],
      tenthOfficer: [''],
      creationTime: ['']
    });

    this.route.params.subscribe(params => {
      this.workId = +params['id'];
      this.getAllOfficersByDivision();
      this.loadWorkDetails(this.workId);
    });
  }

  loadWorkDetails(id: any) {
    this.billsService.getWorkById(id).subscribe(
      (response: any) => {
        console.log(response);
        this.workDetailsForm.patchValue({
          nameOfTheWork: response.nameOfTheWork,
          agreementNumber: response.agreementNumber,
          agreementValue: response.agreementValue,
          agreementDate: response.agreementDate,
          commencementDate: response.commencementDate,
          completionDate: response.completionDate,
          division: response.division,
          firstOfficer: response.firstOfficer,
          secondOfficer: response.secondOfficer,
          thirdOfficer: response.thirdOfficer,
          fourthOfficer: response.fourthOfficer,
          fifthOfficer: response.fifthOfficer,
          sixthOfficer: response.sixthOfficer,
          seventhOfficer: response.seventhOfficer,
          eightOfficer: response.eightOfficer,
          ninthOfficer: response.ninthOfficer,
          tenthOfficer: response.tenthOfficer,
          creationTime: response.creationTime
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getAllOfficersByDivision() {
    this.aeUsernames = [];
    this.aeeUsernames = [];
    this.billsService.getOfficersBydivision(this.division).subscribe(
      (response: any) => {
        console.log(response);
        response.forEach((officer: Officer) => {
          officer.roles.forEach((role: { name: string }) => {
            if (role.name === 'AE') {
              this.aeUsernames.push(officer.username);
            } else if (role.name === 'AEE') {
              this.aeeUsernames.push(officer.username);
            } else if (role.name === 'DA') {
              this.thirdOfficer = officer.username;
            } else if (role.name === 'EE') {
              this.fourthOfficer = officer.username;
              this.circle = officer.circle;
            }
          });
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  editWork() {
    const data = {
      id: this.workId,
      ...this.workDetailsForm.value
    }
    this.billsService.addWork(data).subscribe(
      (response: any) => {
        console.log(response);

      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
