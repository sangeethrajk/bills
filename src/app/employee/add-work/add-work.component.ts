import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-work',
  templateUrl: './add-work.component.html',
  styleUrl: './add-work.component.css'
})
export class AddWorkComponent implements OnInit {
  workDetailsForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.workDetailsForm = this.formBuilder.group({
      nameofWork: ['', Validators.required],
      agreementNumber: ['', Validators.required],
      agreementValue: ['', Validators.required],
      agreementDate: ['', Validators.required],
      dateOfCommencement: ['', Validators.required],
      dateOfCompletion: ['', Validators.required],
      selectedDivision: ['', Validators.required],
      aeEngineer: ['', Validators.required],
      aeeEngineer: ['', Validators.required],
    });

    this.workDetailsForm.get('selectedDivision')?.valueChanges.subscribe(() => {
      this.onDivisionSelected();
    });
  }

  divisions = [
    { name: 'Villupuram Housing Unit', AE: 2, AEE: 1 },
    { name: 'JJ Nagar', AE: 4, AEE: 1 },
    { name: 'SPD -I', AE: 5, AEE: 1 },
    { name: 'Coimbatore Housing Unit', AE: 3, AEE: 1 },
    { name: 'Tirunelveli Housing Unit', AE: 4, AEE: 1 },
    { name: 'Hosur Housing Unit', AE: 1, AEE: 1 },
    { name: 'CIT Nagar', AE: 7, AEE: 3 },
    { name: 'Erode Housing Unit', AE: 2, AEE: 1 },
    { name: 'Anna Nagar', AE: 3, AEE: 3 },
    { name: 'Salem Housing Unit', AE: 3, AEE: 1 },
    { name: 'Thoppur Uchampatti', AE: 2, AEE: 1 },
    { name: 'Trichy', AE: 4, AEE: 1 },
    { name: 'SPD - II', AE: 4, AEE: 2 },
    { name: 'SPD - III', AE: 2, AEE: 1 },
    { name: 'Madurai', AE: 4, AEE: 3 },
    { name: 'Thirumazhisai', AE: 3, AEE: 1 },
    { name: 'Foreshore', AE: 7, AEE: 1 },
    { name: 'SAF Games', AE: 2, AEE: 1 },
    { name: 'Ramanathapuram', AE: 2, AEE: 1 },
    { name: 'Thanjavur', AE: 1, AEE: 1 },
    { name: 'KK Nagar', AE: 4, AEE: 2 },
    { name: 'Nandanam', AE: 1, AEE: 1 },
    { name: 'Vellore', AE: 1, AEE: 1 },
    { name: 'Maintenance', AE: 1, AEE: 1 },
    { name: 'Besant Nagar', AE: 2, AEE: 1 },
  ];

  aeEngineers!: string[];
  aeeEngineers!: string[];

  onDivisionSelected() {
    const selectedDivision = this.workDetailsForm.get('selectedDivision')?.value;
    if (selectedDivision) {
      this.aeEngineers = this.generateEngineers(selectedDivision.AE, 'AE', selectedDivision.name);
      this.aeeEngineers = this.generateEngineers(selectedDivision.AEE, 'AEE', selectedDivision.name);
    } else {
      this.aeEngineers = [];
      this.aeeEngineers = [];
    }
  }

  private generateEngineers(count: number, prefix: string, selectedDivision: string): string[] {
    const cleanedDivision = selectedDivision.replace(/\s/g, "");
    return Array.from({ length: count }, (_, i) => `${cleanedDivision}_${prefix}_${i + 1}`);
  }

}
