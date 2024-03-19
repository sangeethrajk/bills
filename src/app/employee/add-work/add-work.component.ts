import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BillsService } from '../../services/bills.service';

interface Officer {
  roles: { name: string }[]; // Define roles as an array of objects with a name property
  username: string;
  circle: string;
}

@Component({
  selector: 'app-add-work',
  templateUrl: './add-work.component.html',
  styleUrl: './add-work.component.css'
})
export class AddWorkComponent implements OnInit {
  workDetailsForm!: FormGroup;
  division: any;
  aeUsernames: string[] = [];
  aeeUsernames: string[] = [];
  thirdOfficer: any;
  fourthOfficer: any;
  circle: any;

  constructor(
    private formBuilder: FormBuilder,
    private billsService: BillsService
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
      division: [this.division, Validators.required],
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
    this.getAllOfficersByDivision();
  }

  onAddWork() {
    console.log(this.workDetailsForm.value);

    if (this.workDetailsForm.valid) {
      const currentTimeStamp = new Date().toISOString();

      this.workDetailsForm.patchValue({
        thirdOfficer: this.thirdOfficer,
        fourthOfficer: this.fourthOfficer,
        fifthOfficer: this.getFifthOfficer(),
        sixthOfficer: "SE_HQ",
        eightOfficer: "DCAO",
        ninthOfficer: "FA",
        tenthOfficer: "MD",
        creationTime: currentTimeStamp
      });

      console.log(this.workDetailsForm.value);

      this.billsService.addWork(this.workDetailsForm.value).subscribe(
        (response: any) => {
          console.log("Successfully added work details", response);
        },
        (error: any) => {
          console.error("Error adding work details", error);
        }
      );
    } else {
      window.alert("Please fill out all the required fields.");
    }
  }

  getAllOfficersByDivision() {
    this.aeUsernames = [];
    this.aeeUsernames = [];
    console.log(this.division);
    this.billsService.getOfficersBydivision(this.division).subscribe(
      (response: any) => {
        response.forEach((officer: any) => { // Change Officer type to any
          const role = officer.role; // Access the role property from the officer object
          if (role === 'AE') {
            this.aeUsernames.push(officer.username);
          } else if (role === 'AEE') {
            this.aeeUsernames.push(officer.username);
          } else if (role === 'DA') {
            this.thirdOfficer = officer.username;
          } else if (role === 'EE') {
            this.fourthOfficer = officer.username;
            this.circle = officer.circle;
          }
        });
        console.log("thirdOfficer: ", this.thirdOfficer);
        console.log("fourthOfficer: ", this.fourthOfficer);
        console.log("circle: ", this.circle);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  getFifthOfficer() {
    if (this.circle === 'Chennai Circle - I') {
      return 'Chennai_Circle_I_SE';
    } else if (this.circle === 'Chennai Circle - II') {
      return 'Chennai_Circle_II_SE';
    } else if (this.circle === 'Madurai') {
      return 'Madurai_SE';
    } else if (this.circle === 'Project Circle (City)') {
      return 'Project_Circle_City_SE';
    } else if (this.circle === 'Project Circle (Rural)') {
      return 'Project_Circle_Rural_SE';
    } else if (this.circle === 'Salem') {
      return 'Salem_SE';
    } return undefined;
  }



}
