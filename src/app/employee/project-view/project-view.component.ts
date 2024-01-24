import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css'
})
export class ProjectViewComponent {

  projectForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      division: ['', Validators.required],
      workName: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      agreementValue: ['', Validators.required],
      agreementDate: ['', Validators.required],
      dateOfCommencement: ['', Validators.required],
      dateOfCompletion: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifscCode: ['', Validators.required],
      branchName: ['', Validators.required],
    });
  }
}
