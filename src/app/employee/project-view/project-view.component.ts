import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BillsService } from '../../services/bills.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent {

  id!: number;
  projectForm!: FormGroup;
  vendorProjectId!: number;
  gstFileName: any;
  panFileName: any;
  tanFileName: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private billsService: BillsService,
    private dialog: MatDialog,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.projectForm = this.fb.group({
      division: ['', Validators.required],
      workName: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      agreementValue: ['', Validators.required],
      agreementDate: ['', Validators.required],
      commencementDate: ['', Validators.required],
      completionDate: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifscCode: ['', Validators.required],
      branchName: ['', Validators.required],
      contractorName: [''],
      gstNumber: [''],
      panNumber: [''],
      tanNumber: [''],
    });
    this.getVendorDetails();
  }

  getVendorDetails() {
    console.log(this.id);
    this.billsService.getPendingProjectById(this.id).subscribe(
      (response: any) => {
        console.log(response);
        this.projectForm.patchValue(response[0]);
        this.vendorProjectId = response[0].vendorProjectId;
        this.gstFileName = response[0].gstFileName;
        this.panFileName = response[0].panFileName;
        this.tanFileName = response[0].tanFileName;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  verifyProject(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to verify this project?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.billsService.verifyProjectById(id).subscribe(
          (response: any) => {
            this.toastService.showToast('success', 'Project verified successfully', '');
            setTimeout(() => {
              this.router.navigate(['/employee/work-list']);
            }, 3000);
          },
          (error: any) => {
            console.log(error);
            this.toastService.showToast('error', 'Failed to verify project', '');
          }
        );
      }
    });
  }

}
