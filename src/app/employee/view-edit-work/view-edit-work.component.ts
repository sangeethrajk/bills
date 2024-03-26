import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillsService } from '../../services/bills.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
  mode: any;
  updateDisable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private billsService: BillsService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
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
      thirdOfficer: ['', Validators.required],
      fourthOfficer: ['', Validators.required],
      fifthOfficer: ['', Validators.required],
      sixthOfficer: ['', Validators.required],
      seventhOfficer: ['', Validators.required],
      eightOfficer: ['', Validators.required],
      ninthOfficer: ['', Validators.required],
      tenthOfficer: ['', Validators.required],
      creationTime: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.workId = +params['id'];
      this.mode = params['mode'];
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
        response.data.forEach((officer: any) => {
          if (officer.role === 'AE') {
            this.aeUsernames.push(officer.username);
          } else if (officer.role === 'AEE') {
            this.aeeUsernames.push(officer.username);
          } else if (officer.role === 'DA') {
            this.thirdOfficer = officer.username;
          } else if (officer.role === 'EE') {
            this.fourthOfficer = officer.username;
            this.circle = officer.circle;
          }
        });
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  editWork() {
    if (this.workDetailsForm.valid) {
      this.updateDisable = true;
      const data = {
        id: this.workId,
        ...this.workDetailsForm.value
      }
      this.billsService.addWork(data).subscribe(
        (response: any) => {
          console.log(response);
          this.toastService.showToast('success', 'Successfully updated work details', '');
          setTimeout(() => {
            this.router.navigate(['/employee/work-list']);
          }, 3000);
        },
        (error: any) => {
          console.error(error);
          this.toastService.showToast('error', 'Error updating work details', '');
          this.updateDisable = false;
        }
      );
    } else {
      this.toastService.showToast('warning', 'Please fill all the details', '');
    }
  }
}
