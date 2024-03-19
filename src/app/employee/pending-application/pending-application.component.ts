import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { BillsService } from '../../services/bills.service';
import { DialogComponent } from '../dialog/dialog.component';
import { VoucherService } from '../../services/voucher.service';
import { PaymentService } from '../../services/payment.service';
import { S3uploadService } from '../../services/s3upload.service';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  accountcode: string;
  sno: string;
  description: string;
  amount: string;
}

@Component({
  selector: 'app-pending-application',
  templateUrl: './pending-application.component.html',
  styleUrl: './pending-application.component.css'
})

export class PendingApplicationComponent {

  role: any;
  getSingleBillDataResponse: any = {};
  dataOfMeasurementFileAE!: File;
  billId: any;
  vendorProjectId: any;
  updateDisable: boolean = false;
  SEFile!: File;
  CEFile!: File;

  showAE: boolean = false;
  showAEE: boolean = false;
  showDA: boolean = false;
  showEE: boolean = false;
  showSE: boolean = false;
  showSEHQ: boolean = false;
  showCE: boolean = false;
  showDCAO: boolean = false;
  showFA: boolean = false;
  showMD: boolean = false;


  statusofEE: any;

  AEFormReadOnly: boolean = false;
  AEEFormReadOnly: boolean = false;
  AssistantFormReadOnly: boolean = false;
  DAFormReadOnly: boolean = false;
  EEFormReadOnly: boolean = false;
  SEFormReadOnly: boolean = false;
  SEHQFormReadOnly: boolean = false;
  CEFormReadOnly: boolean = false;

  displayedColumns: string[] = ['sno', 'accountcode', 'description', 'amount'];
  panelOpenState = false;
  id: any;
  revieweddate: any;

  applicationForm!: FormGroup;
  AEpart1Form!: FormGroup;
  AEpart2Form!: FormGroup;
  AEpart3Form!: FormGroup;
  AEEForm!: FormGroup;
  AssistantForm!: FormGroup;
  DivisionalAccountantForm!: FormGroup;
  EEForm!: FormGroup;
  SEForm!: FormGroup;
  SEHQForm!: FormGroup;
  CEForm!: FormGroup;
  DCAOForm!: FormGroup;
  FAForm!: FormGroup;
  MDForm!: FormGroup;
  DCAOForm2!: FormGroup;

  currentDate: any;
  fileurl: any;
  tanurl: any;
  panurl: any;
  gsturl: any;
  viewModel: any;

  maxCertificateCharacters: number = 1000;
  dcaoBankFields: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private billService: BillsService,
    private route: ActivatedRoute,
    private date: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private voucherService: VoucherService,
    private paymentService: PaymentService,
    private s3Service: S3uploadService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.role = sessionStorage.getItem('role');

    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    if (this.role == "AE") {
      this.showAE = true;
    }

    if (this.role == "AEE") {
      this.showAE = true;
      this.showAEE = true;
      this.AEFormReadOnly = true;
    }

    if (this.role == "DA") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
    }

    if (this.role == "EE") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.showEE = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
      this.DAFormReadOnly = true;
    }

    if (this.role == "SE") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.showEE = true;
      this.showSE = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
      this.DAFormReadOnly = true;
      this.EEFormReadOnly = true;
    }

    if (this.role == "SEHQ") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.showEE = true;
      this.showSE = true;
      this.showSEHQ = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
      this.DAFormReadOnly = true;
      this.EEFormReadOnly = true;
      this.SEFormReadOnly = true;
    }

    if (this.role == "CE") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.showEE = true;
      this.showSE = true;
      this.showSEHQ = true;
      this.showCE = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
      this.DAFormReadOnly = true;
      this.EEFormReadOnly = true;
      this.SEFormReadOnly = true;
      this.SEHQFormReadOnly = true;
    }

    if (this.role == "DCAO") {
      this.showAE = true;
      this.showAEE = true;
      this.showDA = true;
      this.showEE = true;
      this.showSE = true;
      this.showSEHQ = true;
      this.showCE = true;
      this.showDCAO = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
      this.DAFormReadOnly = true;
      this.EEFormReadOnly = true;
      this.SEFormReadOnly = true;
      this.SEHQFormReadOnly = true;
      this.CEFormReadOnly = true;
    }


    this.applicationForm = this.formBuilder.group({
      division: [''],
      nameOfContractor: [''],
      nameOfWork: [''],
      agreementNo: [''],
      agreementDate: [''],
      dateOfCommencement: [''],
      dateOfCompletion: [''],
      agreementValue: [''],
      invoiceNo: [''],
      billNo: [''],
      billAmount: [''],
      billGSTPercentage: [''],
      billGSTAmount: [''],
      billTotal: [''],
      pan: [''],
      tan: [''],
      gst: [''],
      appliedDate: [''],
      fileurl: this.fileurl,
      tanurl: this.tanurl,
      panurl: this.panurl,
      gsturl: this.gsturl,
      bankName: [''],
      bankAccountNo: [''],
      accountHolderName: [''],
      ifscCode: [''],
      branchName: ['']
    });

    this.AEpart1Form = this.formBuilder.group({
      reraNumber: [''],
      fsValue: [''],
      estimateNo: [''],
      mainAgreementNo: [''],
      mainAgreementValue: [null],
      wc79OrderNo: [''],
      wc79OrderDate: [''],
      wc79OrderValue: [null],
      supplementAgreementNo: [''],
      supplementAgreementValue: [null],
      totalValue: [null],
      actualDateOfCompletion: [''],
      finalBillCompletionReportEnclosed: [''],
    });

    this.AEpart2Form = this.formBuilder.group({
      dateOfMeasurementByAE: [''],
      physicalProgress: [null],
      actualProgress: [''],
      eot: [''],
      eotOrderNo: [''],
      eotDate: [''],
      eotFineAmount: [''],
      liquidatedDamages: [''],
      whetherAllItemsCovered: [''],
      whetherQuantitiesAsPerEstimate: [''],
      workOmittedOrPartlyDone: [''],
      partRatePaid: [''],
      measurementBookSubmitted: [''],
      actionTakenToRegularizeExcess: ['']
    });

    this.AEpart3Form = this.formBuilder.group({
      valueOfAgreement: [''],
      amountReleasedUptoPreviousBill: [''],
      balance: [''],
      amountRaisedInThisBill: [''],
      certificateAE: [''],
      signatureAE: [''],
      date: [''],
    });

    this.AEEForm = this.formBuilder.group({
      workCheckMeasuredByAEE: [''],
      measurementCheckMeasuredByAEE: [''],
      dateOfCheckMeasurementAEE: [''],
      certificateAEE: [''],
      signatureAEE: [''],
    })

    this.AssistantForm = this.formBuilder.group({
      valueReportedByAE: [''],
      correctedValueByDA: [''],
      gstPercentage: [''],
      gstValue: [''],
      baseValueCode: [''],
      baseValue: [''],
      rmdCode: ['714'],
      rmdValue: [0],
      labourFundCode: ['774'],
      labourFund: [0],
      itCode: ['731'],
      itValue: [0],
      sgstCode: ['752'],
      sgstValue: [0],
      cgstCode: ['751'],
      cgstValue: [0],
      steelRecoveryCode: ['561'],
      steelRecoveryValue: [''],
      mobilizationCode: ['571'],
      mobilizationValue: [''],
      withheldCode: ['719'],
      withheldValue: [''],
      eotCode: ['190'],
      eotValue: [''],
      otherRecoveriesCode: [''],
      otherRecoveriesValue: [''],
      otherRecoveriesRemarks: [''],
      totalDeduction: [0],
      netTotalCode: ['701'],
      netTotalValue: [''],
      billRegisterPageNo: [''],
      billRegisterDate: [''],
    })

    this.DivisionalAccountantForm = this.formBuilder.group({
      remarksDA: [''],
      billPassedFor: [''],
      billPayFor: [''],
      signatureDA: ['']
    })

    this.EEForm = this.formBuilder.group({
      voucherNumber: [''],
      dateOfSuperCheck: [''],
      billPassedFor: [''],
      billPayFor: [''],
      remarksEE: [''],
      signatureEE: ['']
    })

    this.SEForm = this.formBuilder.group({
      dateOfInspectionSE: [''],
      remarksSE: [''],
      signatureSE: [''],
      date: [''],
    })

    this.SEHQForm = this.formBuilder.group({
      recommendationOfLCSEHQ: [''],
      remarksSEHQ: [''],
      signatureSEHQ: [''],
    })

    this.CEForm = this.formBuilder.group({
      dateOfInspectionCE: [''],
      recommendationOfLCCE: [''],
      remarksCE: [''],
      signatureCE: [''],
    })

    this.DCAOForm = this.formBuilder.group({
      passOrderForLC: [''],
      bankAccountNo: [''],
      remarks: [''],
      signature: [''],
      date: [''],
    })

    this.FAForm = this.formBuilder.group({
      lcIssuedOrder: [''],
      signature: [''],
      date: [''],
      remarks: ['']
    })

    this.MDForm = this.formBuilder.group({
      approvalStatus: ['approve'],
      remarks: [''],
      signature: [''],
      date: [''],
    })

    this.getSingleBillData();

    const currentDate = new Date();
    this.currentDate = this.date.transform(currentDate, 'dd-MM-yyyy');

  }

  aeCertificateWordCount(): { words: number, characters: number } {
    const certificateControl = this.AEpart3Form.get('certificateAE');
    const value = certificateControl?.value || '';

    // Simple word count logic (you may need to adjust for your specific requirements)
    const words = value.trim().split(/\s+/).length;

    // Character count
    const characters = value.length;

    return { words, characters };
  }

  generateVoucherNo() {
    const division = this.applicationForm.get('division')?.value;
    const voucherNumber = this.voucherService.generateVoucherNumber(division);
    this.EEForm.get('voucherNumber')?.setValue(voucherNumber);
  }

  correctedValueCheck() {
    this.AssistantForm.get('correctedValueByDA')?.valueChanges.subscribe((value) => {
      const valueReportedByAE = parseInt(this.AssistantForm.get('valueReportedByAE')?.value, 10);
      const correctedValueByDA = parseInt(value, 10);
      if (correctedValueByDA > valueReportedByAE) {
        // Reset correctedValueByDA to previous value or display a warning message
        this.AssistantForm.get('correctedValueByDA')?.setValue(valueReportedByAE);
      }
    });
  }

  getSingleBillData() {
    this.billService.getSingleBillBasedOnId(this.id).subscribe(
      (response: any) => {
        console.log(response);
        this.getSingleBillDataResponse = response;
        this.billId = response.id;
        this.vendorProjectId = response.vendorProjectId;
        this.getPreviousAmount();
        if (this.role == 'AE') {
          this.patchApplicationForm(response);
          this.AEpart3Form.patchValue({
            valueOfAgreement: response.agreementValue,
            amountRaisedInThisBill: response.billTotal,
          });
        } else if (this.role == "AEE") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
        } else if (this.role == "DA") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.AssistantForm.patchValue({
            valueReportedByAE: response.billTotal
          });
        } else if (this.role == "EE") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.patchDAForm(response);
          this.EEForm.patchValue({
            billPassedFor: response.billPassedFor,
            billPayFor: response.billPayFor
          })
        } else if (this.role == "SE") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.patchDAForm(response);
          this.patchEEForm(response);
        } else if (this.role == "SEHQ") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.patchDAForm(response);
          this.patchEEForm(response);
          this.patchSEForm(response);
        } else if (this.role == "CE") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.patchDAForm(response);
          this.patchEEForm(response);
          this.patchSEForm(response);
          this.patchSEHQForm(response);
        } else if (this.role == "DCAO") {
          this.patchApplicationForm(response);
          this.patchAEpart1Form(response);
          this.patchAEEForm(response);
          this.patchDAForm(response);
          this.patchEEForm(response);
          this.patchSEForm(response);
          this.patchSEHQForm(response);
          this.patchCEForm(response);
        }
      },
      (error: any) => {
        console.error(error);
      });
  }

  getPreviousAmount() {
    this.billService.getAmountReleasedUptoPreviousBill(this.vendorProjectId).subscribe(
      (response: any) => {
        console.log(response);
        this.AEpart3Form.patchValue({
          amountReleasedUptoPreviousBill: response.data
        });
        this.calculateBalance();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  dataOfMeasurementFileAEChanged(event: any) {
    this.dataOfMeasurementFileAE = event.target.files[0];
  }

  onSEFileSelected(event: any) {
    this.SEFile = event.target.files[0];
  }

  onCEFileSelected(event: any) {
    this.CEFile = event.target.files[0];
  }

  saveNewBill() {
    this.updateDisable = true;
    switch (this.role) {
      case 'AE': {
        if (!this.dataOfMeasurementFileAE) {
          this.showToast('warning', 'Please select a Date of Measurement File', 'File Not Selected');
          return;
        }
        this.s3Service.s3Direct(this.dataOfMeasurementFileAE, this.dataOfMeasurementFileAE?.name, "DateOfMeasurementFileAE")
          .then((generatedFileName) => {
            console.log('Generated filename:', generatedFileName);
            const currentDate = new Date();
            const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            const data = {
              "reraNumber": this.AEpart1Form.get('reraNumber')?.value,
              "fsValue": this.AEpart1Form.get('fsValue')?.value,
              "estimateNo": this.AEpart1Form.get('estimateNo')?.value,
              "mainAgreementNo": this.AEpart1Form.get('mainAgreementNo')?.value,
              "mainAgreementValue": this.AEpart1Form.get('mainAgreementValue')?.value,
              "wc79OrderNo": this.AEpart1Form.get('wc79OrderNo')?.value,
              "wc79OrderDate": this.AEpart1Form.get('wc79OrderDate')?.value,
              "wc79OrderValue": this.AEpart1Form.get('wc79OrderValue')?.value,
              "supplementAgreementNo": this.AEpart1Form.get('supplementAgreementNo')?.value,
              "supplementAgreementValue": this.AEpart1Form.get('supplementAgreementValue')?.value,
              "totalValue": this.AEpart1Form.get('totalValue')?.value,
              "actualDateOfCompletion": this.AEpart1Form.get('actualDateOfCompletion')?.value,
              "finalBillCompletionReportEnclosed": this.AEpart1Form.get('finalBillCompletionReportEnclosed')?.value,
              "dateOfMeasurementByAE": this.AEpart2Form.get('dateOfMeasurementByAE')?.value,
              "dateOfMeasurementFileNameAE": generatedFileName,
              "physicalProgress": this.AEpart2Form.get('physicalProgress')?.value,
              "actualProgress": this.AEpart2Form.get('actualProgress')?.value,
              "eot": this.AEpart2Form.get('eot')?.value,
              "eotOrderNo": this.AEpart2Form.get('eotOrderNo')?.value,
              "eotDate": this.AEpart2Form.get('eotDate')?.value,
              "eotFineAmount": this.AEpart2Form.get('eotFineAmount')?.value,
              "liquidatedDamages": this.AEpart2Form.get('liquidatedDamages')?.value,
              "whetherAllItemsCovered": this.AEpart2Form.get('whetherAllItemsCovered')?.value,
              "whetherQuantitiesAsPerEstimate": this.AEpart2Form.get('whetherQuantitiesAsPerEstimate')?.value,
              "workOmittedOrPartlyDone": this.AEpart2Form.get('workOmittedOrPartlyDone')?.value,
              "actionTakenToRegularizeExcess": this.AEpart2Form.get('actionTakenToRegularizeExcess')?.value,
              "partRatePaid": this.AEpart2Form.get('partRatePaid')?.value,
              "measurementBookSubmitted": this.AEpart2Form.get('measurementBookSubmitted')?.value,
              "certificateAE": this.AEpart3Form.get('certificateAE')?.value,
              "signatureAE": this.AEpart3Form.get('signatureAE')?.value,
              "dateOfSubmissionAE": formattedDate,
              "billStatus": "Pending with AEE"
            };
            console.log(data);
            this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
              (response: any) => {
                console.log(response);
                this.showToast('success', 'Bill Sent to AEE', 'Success');
                setTimeout(() => {
                  this.router.navigate(['employee', 'pending-list']);
                }, 3000);
              },
              (error: any) => {
                console.error(error);
                this.showToast('error', 'Error while submitting the bill', 'Error');
                this.updateDisable = false;
              }
            );
          })
          .catch((error) => {
            console.error('Error uploading file to S3:', error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          });
        break;
      }
      case 'AEE': {
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        const data = {
          workCheckMeasuredByAEE: this.AEEForm.get('workCheckMeasuredByAEE')?.value,
          measurementCheckMeasuredByAEE: this.AEEForm.get('measurementCheckMeasuredByAEE')?.value,
          dateOfCheckMeasurementAEE: this.AEEForm.get('dateOfCheckMeasurementAEE')?.value,
          certificateAEE: this.AEEForm.get('certificateAEE')?.value,
          signatureAEE: this.AEEForm.get('signatureAEE')?.value,
          dateOfSubmissionAEE: formattedDate,
          billStatus: "Pending with DA"
        };
        this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
          (response: any) => {
            console.log(response);
            this.showToast('success', 'Bill Sent to DA', 'Success');
            setTimeout(() => {
              this.router.navigate(['employee', 'pending-list']);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          }
        );
        break;
      }
      case 'DA': {
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        const data = {
          "valueReportedByAE": this.AssistantForm.get('valueReportedByAE')?.value,
          "correctedValueByDA": this.AssistantForm.get('correctedValueByDA')?.value,
          "gstPercentage": this.AssistantForm.get('gstPercentage')?.value,
          "gstValue": this.AssistantForm.get('gstValue')?.value,
          "baseValueCode": this.AssistantForm.get('baseValueCode')?.value,
          "baseValue": this.AssistantForm.get('baseValue')?.value,
          "rmdCode": this.AssistantForm.get('rmdCode')?.value,
          "rmdValue": this.AssistantForm.get('rmdValue')?.value,
          "labourFundCode": this.AssistantForm.get('labourFundCode')?.value,
          "labourFund": this.AssistantForm.get('labourFund')?.value,
          "itCode": this.AssistantForm.get('itCode')?.value,
          "itValue": this.AssistantForm.get('itValue')?.value,
          "sgstCode": this.AssistantForm.get('sgstCode')?.value,
          "sgstValue": this.AssistantForm.get('sgstValue')?.value,
          "cgstCode": this.AssistantForm.get('cgstCode')?.value,
          "cgstValue": this.AssistantForm.get('cgstValue')?.value,
          "steelRecoveryCode": this.AssistantForm.get('steelRecoveryCode')?.value,
          "steelRecoveryValue": this.AssistantForm.get('steelRecoveryValue')?.value,
          "mobilizationCode": this.AssistantForm.get('mobilizationCode')?.value,
          "mobilizationValue": this.AssistantForm.get('mobilizationValue')?.value,
          "withheldCode": this.AssistantForm.get('withheldCode')?.value,
          "withheldValue": this.AssistantForm.get('withheldValue')?.value,
          "eotCode": this.AssistantForm.get('eotCode')?.value,
          "eotValue": this.AssistantForm.get('eotValue')?.value,
          "otherRecoveriesCode": this.AssistantForm.get('otherRecoveriesCode')?.value,
          "otherRecoveriesValue": this.AssistantForm.get('otherRecoveriesValue')?.value,
          "otherRecoveriesRemarks": this.AssistantForm.get('otherRecoveriesRemarks')?.value,
          "totalDeduction": this.AssistantForm.get('totalDeduction')?.value,
          "netTotalCode": this.AssistantForm.get('netTotalCode')?.value,
          "netTotalValue": this.AssistantForm.get('netTotalValue')?.value,
          "billRegisterPageNo": this.AssistantForm.get('billRegisterPageNo')?.value,
          "billRegisterDate": this.AssistantForm.get('billRegisterDate')?.value,

          "remarksDA": this.DivisionalAccountantForm.get('remarksDA')?.value,
          "billPassedFor": this.DivisionalAccountantForm.get('billPassedFor')?.value,
          "billPayFor": this.DivisionalAccountantForm.get('billPayFor')?.value,
          "signatureDA": this.DivisionalAccountantForm.get('signatureDA')?.value,
          "dateOfSubmissionDA": formattedDate,
          billStatus: "Pending with EE"
        };
        this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
          (response: any) => {
            console.log(response);
            this.showToast('success', 'Bill Sent to EE', 'Success');
            setTimeout(() => {
              this.router.navigate(['employee', 'pending-list']);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          }
        );
        break;
      }
      case 'EE': {
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        const data = {
          "voucherNumber": this.EEForm.get('voucherNumber')?.value,
          "dateOfSuperCheck": this.EEForm.get('dateOfSuperCheck')?.value,
          "remarksEE": this.EEForm.get('remarksEE')?.value,
          "signatureEE": this.EEForm.get('signatureEE')?.value,
          "dateOfSubmissionEE": formattedDate,
          billStatus: "Pending with SE"
        };
        this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
          (response: any) => {
            console.log(response);
            this.showToast('success', 'Bill Sent to SE', 'Success');
            setTimeout(() => {
              this.router.navigate(['employee', 'pending-list']);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          }
        );
        break;
      }
      case 'SE': {
        this.s3Service.s3Direct(this.SEFile, this.SEFile?.name, "SEFilesUpload")
          .then((generatedFileName) => {
            console.log('Generated filename:', generatedFileName);
            const currentDate = new Date();
            const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            const data = {
              "dateOfInspectionSE": this.SEForm.get('dateOfInspectionSE')?.value,
              "inspectionSEFileName": generatedFileName,
              "remarksSE": this.SEForm.get('remarksSE')?.value,
              "signatureSE": this.SEForm.get('signatureSE')?.value,
              "dateOfSubmissionSE": formattedDate,
              billStatus: "Pending with SEHQ"
            };
            console.log(data);
            this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
              (response: any) => {
                console.log(response);
                this.showToast('success', 'Bill Sent to SEHQ', 'Success');
                setTimeout(() => {
                  this.router.navigate(['employee', 'pending-list']);
                }, 3000);
              },
              (error: any) => {
                console.error(error);
                this.showToast('error', 'Error while submitting the bill', 'Error');
                this.updateDisable = false;
              }
            );
          })
          .catch((error) => {
            console.error('Error uploading file to S3:', error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          });
        break;
      }
      case 'SEHQ': {
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        const data = {
          "recommendationOfLCSEHQ": this.SEHQForm.get('recommendationOfLCSEHQ')?.value,
          "remarksSEHQ": this.SEHQForm.get('remarksSEHQ')?.value,
          "signatureSEHQ": this.SEHQForm.get('signatureSEHQ')?.value,
          "dateOfSubmissionSEHQ": formattedDate,
          billStatus: "Pending with CE"
        };
        this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
          (response: any) => {
            console.log(response);
            this.showToast('success', 'Bill Sent to CE', 'Success');
            setTimeout(() => {
              this.router.navigate(['employee', 'pending-list']);
            }, 3000);
          },
          (error: any) => {
            console.error(error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          }
        );
        break;
      }
      case 'CE': {
        this.s3Service.s3Direct(this.CEFile, this.CEFile?.name, "CEFilesUpload")
          .then((generatedFileName) => {
            console.log('Generated filename:', generatedFileName);
            const currentDate = new Date();
            const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            const data = {
              "dateOfInspectionCE": this.CEForm.get('dateOfInspectionCE')?.value,
              "inspectionCEFileName": generatedFileName,
              "recommendationOfLCCE": this.CEForm.get('recommendationOfLCCE')?.value,
              "remarksCE": this.CEForm.get('remarksCE')?.value,
              "signatureCE": this.CEForm.get('signatureCE')?.value,
              "dateOfSubmissionCE": formattedDate,
              billStatus: "Pending with DCAO"
            };
            console.log(data);
            this.billService.updateBillByRole(this.role, this.billId, data).subscribe(
              (response: any) => {
                console.log(response);
                this.showToast('success', 'Bill Sent to DCAO', 'Success');
                setTimeout(() => {
                  this.router.navigate(['employee', 'pending-list']);
                }, 3000);
              },
              (error: any) => {
                console.error(error);
                this.showToast('error', 'Error while submitting the bill', 'Error');
                this.updateDisable = false;
              }
            );
          })
          .catch((error) => {
            console.error('Error uploading file to S3:', error);
            this.showToast('error', 'Error while submitting the bill', 'Error');
            this.updateDisable = false;
          });
        break;
      }
      default: {
        // Actions to be performed if the role doesn't match any case
        break;
      }
    }

  }

  onBankAccountNoChange() {
    this.dcaoBankFields = true;
    // const selectedBankAccountNo = this.myForm.get('bankAccountNo')?.value;

    // if (selectedBankAccountNo === '1') {
    //   this.myForm.patchValue({
    //     accountNumber: 'Account Number 1',
    //     accountHolder: 'Account Holder 1',
    //     bankName: 'Bank Name 1',
    //     bankBranch: 'Branch 1',
    //     ifscCode: 'IFSC Code 1'
    //   });
    // } else if (selectedBankAccountNo === '2') {
    // } else if (selectedBankAccountNo === '3') {
    // }
  }

  calculateGST() {
    // Retrieve the selected value from the dropdown
    const selectedValue = parseInt((document.getElementById('dropdownSelect') as HTMLSelectElement).value);
    const divideValue = selectedValue + 100;

    // Check if AssistantForm is defined and not null
    console.log("calculate is clicked");

    // Retrieve the 'correctedValueByDA' control from the form
    const correctedValueControl = this.AssistantForm.get('correctedValueByDA');
    console.log("correctedValueControl", correctedValueControl);

    // Check if 'correctedValueControl' is not null and its value is a number
    if (correctedValueControl) {
      // Extract the numeric value and calculate the GST amount based on the selected value
      const correctedValueByDA = correctedValueControl.value;
      let gstValue = (selectedValue / divideValue) * correctedValueByDA;
      gstValue = parseFloat(gstValue.toFixed(2));
      let baseValue = correctedValueByDA - gstValue;
      let rmdValue = (5 / 100) * baseValue;
      let labourFund = (1 / 100) * baseValue;
      let itValue = (2 / 100) * baseValue;
      let sgstValue = (1 / 100) * baseValue;
      let cgstValue = (1 / 100) * baseValue;

      this.AssistantForm.get('gstValue')?.setValue(gstValue);

      baseValue = parseFloat(baseValue.toFixed(2));
      this.AssistantForm.get('baseValue')?.setValue(baseValue);

      rmdValue = Math.ceil(parseFloat(rmdValue.toFixed(2)) / 100) * 100;
      this.AssistantForm.get('rmdValue')?.setValue(rmdValue);

      labourFund = Math.ceil(parseFloat(labourFund.toFixed(2)));
      this.AssistantForm.get('labourFund')?.setValue(labourFund);

      itValue = Math.ceil(parseFloat(itValue.toFixed(2)));
      this.AssistantForm.get('itValue')?.setValue(itValue);

      sgstValue = Math.ceil(parseFloat(sgstValue.toFixed(2)));
      this.AssistantForm.get('sgstValue')?.setValue(sgstValue);

      cgstValue = Math.ceil(parseFloat(cgstValue.toFixed(2)));
      this.AssistantForm.get('cgstValue')?.setValue(cgstValue);

      // this.totalDeduction = parseFloat(this.totalDeduction.toFixed(2));
      // this.AssistantForm.get('totalDeduction')?.setValue(this.totalDeduction);

    } else {
      // Handle the case when 'correctedValueControl' is null or its value is not a number
      console.error('Invalid or missing value for correctedValue');
      // You can also set a default or handle this situation accordingly
    }
  }

  calculateTotalDeduction() {
    const rmdValue = parseFloat(this.AssistantForm.get('rmdValue')?.value || '0');
    const labourFund = parseFloat(this.AssistantForm.get('labourFund')?.value || '0');
    const itValue = parseFloat(this.AssistantForm.get('itValue')?.value || '0');
    const sgstValue = parseFloat(this.AssistantForm.get('sgstValue')?.value || '0');
    const cgstValue = parseFloat(this.AssistantForm.get('cgstValue')?.value || '0');
    const steelRecoveryValue = parseFloat(this.AssistantForm.get('steelRecoveryValue')?.value || '0');
    const mobilizationValue = parseFloat(this.AssistantForm.get('mobilizationValue')?.value || '0');
    const withheldValue = parseFloat(this.AssistantForm.get('withheldValue')?.value || '0');
    const eotValue = parseFloat(this.AssistantForm.get('eotValue')?.value || '0');
    const otherRecoveriesValue = parseFloat(this.AssistantForm.get('otherRecoveriesValue')?.value || '0');

    let totalDeduction = rmdValue + labourFund + itValue + sgstValue + cgstValue + steelRecoveryValue + mobilizationValue + withheldValue + eotValue + otherRecoveriesValue;
    totalDeduction = parseFloat(totalDeduction.toFixed(2));

    this.AssistantForm.get('totalDeduction')?.setValue(totalDeduction);

    let netTotalValue = this.AssistantForm.get('baseValue')?.value - this.AssistantForm.get('totalDeduction')?.value;
    netTotalValue = parseFloat(netTotalValue.toFixed(2));
    this.AssistantForm.get('netTotalValue')?.setValue(netTotalValue);

    const valueReportedByAE = this.AssistantForm.get('valueReportedByAE')?.value;
    this.DivisionalAccountantForm.get('billPassedFor')?.setValue(valueReportedByAE);
    this.DivisionalAccountantForm.get('billPayFor')?.setValue(netTotalValue);

  }

  calculateTotalValue() {
    console.log("calculateTotalValue");
    const mainAgreementValue = parseFloat(this.AEpart1Form.get('mainAgreementValue')?.value);
    const wc79OrderValue = parseFloat(this.AEpart1Form.get('wc79OrderValue')?.value);
    const supplementAgreementValue = parseFloat(this.AEpart1Form.get('supplementAgreementValue')?.value);

    let totalValue;

    if (!isNaN(wc79OrderValue)) {
      totalValue = wc79OrderValue + supplementAgreementValue;
    } else if (!isNaN(mainAgreementValue)) {
      totalValue = mainAgreementValue + supplementAgreementValue;
    } else {
      // Handle the case when both mainAgreementValue and wc79OrderValue are not entered.
      // You can set a default value or handle it as per your requirements.
      totalValue = 0; // For example, setting it to 0.
    }

    this.AEpart1Form.get('totalValue')?.setValue(totalValue);
    console.log(totalValue);
  }

  calculatePhysicalAchievement() {
    const dateOfCommencement = new Date(this.applicationForm.get('dateOfCommencement')?.value);
    const dueDateOfCompletion = new Date(this.applicationForm.get('dateOfCompletion')?.value);
    const actualDateOfCompletion = new Date(this.AEpart1Form.get('actualDateOfCompletion')?.value);

    if (dateOfCommencement && dueDateOfCompletion && actualDateOfCompletion) {
      const totalDays = dateOfCommencement.getTime() - dueDateOfCompletion.getTime();
      const totalDaysBetween = Math.floor(totalDays / (1000 * 60 * 60 * 24));
      const totalDaysTaken = dateOfCommencement.getTime() - actualDateOfCompletion.getTime();
      const totalDaysTakenBetween = Math.floor(totalDaysTaken / (1000 * 60 * 60 * 24));
      const physicalAchievement = ((totalDaysTakenBetween / totalDaysBetween) * 100).toFixed(2);
      const cappedAchievement = Math.min(parseFloat(physicalAchievement), 100).toFixed(2);
      this.AEpart2Form.get('physicalProgress')?.setValue(cappedAchievement);
    }
  }

  calculateBalance() {
    const valueOfAgreement = this.AEpart3Form.get('valueOfAgreement')?.value;
    const amountReleasedUptoPreviousBill = this.AEpart3Form.get('amountReleasedUptoPreviousBill')?.value;
    const balance = valueOfAgreement - amountReleasedUptoPreviousBill;
    this.AEpart3Form.get('balance')?.setValue(balance);
  }




  generatePDF() {
    let AEpart1Form = {};
    let AEpart2Form = {};
    let AEpart3Form = {};
    let AEEForm = {};
    let EEForm = {};
    let AssistantForm = {};
    let DAForm = {};

    if (this.role == "AE") {
      let jsonData = {};
      jsonData = {
        "Name of work": this.viewModel.nameOfWork,
        "Name of Contractor": this.viewModel.nameOfContractor,
      };

      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

      const columns = ['Part – I Work Description', ''];
      const rows: any[][] = [];

      // Convert jsonData to an array of key-value pairs
      const jsonDataArray = Object.entries(jsonData);

      jsonDataArray.forEach(([key, value]) => {
        rows.push([key, value]);
        // rows.push(['', '']);
      });

      doc.setFontSize(12);
      autoTable(doc, {
        head: [columns],
        body: rows,
        theme: 'striped',
        startY: 10,
        margin: { top: 20 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      // Generate a Blob from the PDF data
      const pdfData = doc.output('blob');

      // Create a URL for the Blob and open it in a new tab
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');

      // Optionally, you can revoke the URL to release resources after the tab is closed
      URL.revokeObjectURL(pdfUrl);

    } else if (this.role == "AEE") {

      AEpart1Form = {
        "Estimate Number": this.viewModel.estimateNo,
        "Main Agreement Number": this.viewModel.mainAgreementNo,
        "WC-79 Order Number": this.viewModel.wc79OrderNo,
        "WC-79 Order Date": this.viewModel.wc79OrderDate,
        "WC-79 Order Value": this.viewModel.wc79OrderValue,
        "Supplement Agreement Number": this.viewModel.supplementAgreementNo,
        "Supplement Agreement Value": this.viewModel.supplementAgreementValue,
        "Total Value": this.viewModel.totalValue,
        "Date of commencement": this.viewModel.dateOfCommencement,
        "Due date of completion": this.viewModel.dueDateOfCompletion,
        "Actual date of completion": this.viewModel.actualDateOfCompletion,
        "Does final bill, completion report enclosed?": this.viewModel.finalBillCompletionReportEnclosed,
      };

      AEpart2Form = {
        "Date of measurement": this.viewModel.partIIDateOfMeasurement,
        "Date of check measurement": this.viewModel.dateOfCheckMeasurement,
        "Physical Achievement in %": this.viewModel.physicalAchievement,
        "Actual Percentage in %": this.viewModel.actualPercentage,
        "Extension of time (EOT)": this.viewModel.extensionOfTime,
        "EOT Order Number": this.viewModel.extensionOfTimeOrderNo,
        "EOT Date": this.viewModel.extensionOfTimeDate,
        "EOT Fine Amount": this.viewModel.extensionOfTimeFineAmount,
        "Liquidated damages / Lump sum fine imposed if any": this.viewModel.liquidatedDamagesOrLumpSumFine,
        "Whether all items covered in original or supplemental agreement": this.viewModel.itemsCoveredInAgreement,
        "Whether quantities in the bill are as per estimate": this.viewModel.quantitiesInBillAsPerEstimate,
        "Specify action taken to regularize such excess": this.viewModel.actionTakenToRegularizeExcess,
        "Have any items of work in the agreement being omitted or partly done": this.viewModel.itemsOmittedOrPartlyDone,
        "Whether part rate is paid": this.viewModel.partRatePaidInAgreement,
        "Whether all the works have been check measured by AEE and date of check measurement": this.viewModel.allWorksCheckedByAEE,
        "Whether computerized measurement book submitted?": this.viewModel.computerizedMeasurementBookSubmitted,
        "Whether pre measurements were taken wherever necessary and check measured by AEE and reference to pre measurement": this.viewModel.preMeasurementsTaken
      };

      AEpart3Form = {
        "Value of agreement": this.viewModel.valueOfAgreement,
        "Amount released upto previous bill": this.viewModel.amountReleasedUptoPreviousBill,
        "Balance": this.viewModel.balance,
        "Amount raised in this bill": this.viewModel.amountRaisedInThisBill,
        "Certificate": this.AEpart3Form.get('certificate')?.value,
        "Signature with date": this.AEpart3Form.get('signatureWithDate')?.value
      };

      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

      const AEHeader = ['Assistant Engineer', ''];
      const columnsPart1 = ['Part – I Work Description', ''];
      const rowsPart1: any[][] = [];

      const columnsPart2 = ['Part-II Bill details', ''];
      const rowsPart2: any[][] = [];

      const columnsPart3 = ['Part-III Payment details', ''];
      const rowsPart3: any[][] = [];

      const AEpart1FormArray = Object.entries(AEpart1Form);
      AEpart1FormArray.forEach(([key, value]) => {
        rowsPart1.push([key, value]);
      });

      const AEpart2FormArray = Object.entries(AEpart2Form);
      AEpart2FormArray.forEach(([key, value]) => {
        rowsPart2.push([key, value]);
      });

      const AEpart3FormArray = Object.entries(AEpart3Form);
      AEpart3FormArray.forEach(([key, value]) => {
        rowsPart3.push([key, value]);
      });

      doc.setFontSize(12);

      // Add Part 1 table
      autoTable(doc, {
        head: [AEHeader, columnsPart1],
        body: rowsPart1,
        theme: 'striped',
        startY: 10,
        margin: { top: 20 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      // Add Part 2 table
      autoTable(doc, {
        head: [columnsPart2],
        body: rowsPart2,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [columnsPart3],
        body: rowsPart3,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      // Generate a Blob from the PDF data
      const pdfData = doc.output('blob');

      // Create a URL for the Blob and open it in a new tab
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');

      // Optionally, you can revoke the URL to release resources after the tab is closed
      URL.revokeObjectURL(pdfUrl);
    } else if (this.role == "EE") {

      if (this.statusofEE == "Approved by AEE") {
        AEpart1Form = {
          "Estimate Number": this.viewModel.estimateNo,
          "Main Agreement Number": this.viewModel.mainAgreementNo,
          "WC-79 Order Number": this.viewModel.wc79OrderNo,
          "WC-79 Order Date": this.viewModel.wc79OrderDate,
          "WC-79 Order Value": this.viewModel.wc79OrderValue,
          "Supplement Agreement Number": this.viewModel.supplementAgreementNo,
          "Supplement Agreement Value": this.viewModel.supplementAgreementValue,
          "Total Value": this.viewModel.totalValue,
          "Date of commencement": this.viewModel.dateOfCommencement,
          "Due date of completion": this.viewModel.dueDateOfCompletion,
          "Actual date of completion": this.viewModel.actualDateOfCompletion,
          "Does final bill, completion report enclosed?": this.viewModel.finalBillCompletionReportEnclosed,
        };

        AEpart2Form = {
          "Date of measurement": this.viewModel.partIIDateOfMeasurement,
          "Date of check measurement": this.viewModel.dateOfCheckMeasurement,
          "Physical Achievement in %": this.viewModel.physicalAchievement,
          "Actual Percentage in %": this.viewModel.actualPercentage,
          "Extension of time (EOT)": this.viewModel.extensionOfTime,
          "EOT Order Number": this.viewModel.extensionOfTimeOrderNo,
          "EOT Date": this.viewModel.extensionOfTimeDate,
          "EOT Fine Amount": this.viewModel.extensionOfTimeFineAmount,
          "Liquidated damages / Lump sum fine imposed if any": this.viewModel.liquidatedDamagesOrLumpSumFine,
          "Whether all items covered in original or supplemental agreement": this.viewModel.itemsCoveredInAgreement,
          "Whether quantities in the bill are as per estimate": this.viewModel.quantitiesInBillAsPerEstimate,
          "Specify action taken to regularize such excess": this.viewModel.actionTakenToRegularizeExcess,
          "Have any items of work in the agreement being omitted or partly done": this.viewModel.itemsOmittedOrPartlyDone,
          "Whether part rate is paid": this.viewModel.partRatePaidInAgreement,
          "Whether all the works have been check measured by AEE and date of check measurement": this.viewModel.allWorksCheckedByAEE,
          "Whether computerized measurement book submitted?": this.viewModel.computerizedMeasurementBookSubmitted,
          "Whether pre measurements were taken wherever necessary and check measured by AEE and reference to pre measurement": this.viewModel.preMeasurementsTaken
        };

        AEpart3Form = {
          "Value of agreement": this.viewModel.valueOfAgreement,
          "Amount released upto previous bill": this.viewModel.amountReleasedUptoPreviousBill,
          "Balance": this.viewModel.balance,
          "Amount raised in this bill": this.viewModel.amountRaisedInThisBill,
          "Certificate": this.AEpart3Form.get('certificate')?.value,
          "Signature with date": this.AEpart3Form.get('signatureWithDate')?.value
        };

        AEEForm = {
          "Date of Check measurement": this.AEEForm.get('dateOfCheckMeasurement')?.value,
          "Certificate": this.AEEForm.get('certificate')?.value,
          "Signature": this.AEEForm.get('signatureWithDate')?.value,
        };

        const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

        const AEHeader = ['Assistant Engineer', ''];
        const columnsPart1 = ['Part – I Work Description', ''];
        const rowsPart1: any[][] = [];

        const columnsPart2 = ['Part-II Bill details', ''];
        const rowsPart2: any[][] = [];

        const columnsPart3 = ['Part-III Payment details', ''];
        const rowsPart3: any[][] = [];

        const AEEColumns = ['Assistant Executive Engineer', ''];
        const AEERows: any[][] = [];

        const AEpart1FormArray = Object.entries(AEpart1Form);
        AEpart1FormArray.forEach(([key, value]) => {
          rowsPart1.push([key, value]);
        });

        const AEpart2FormArray = Object.entries(AEpart2Form);
        AEpart2FormArray.forEach(([key, value]) => {
          rowsPart2.push([key, value]);
        });

        const AEpart3FormArray = Object.entries(AEpart3Form);
        AEpart3FormArray.forEach(([key, value]) => {
          rowsPart3.push([key, value]);
        });

        const AEEFormArray = Object.entries(AEEForm);
        AEEFormArray.forEach(([key, value]) => {
          AEERows.push([key, value]);
        });

        doc.setFontSize(12);

        // Add Part 1 table
        autoTable(doc, {
          head: [AEHeader, columnsPart1],
          body: rowsPart1,
          theme: 'striped',
          startY: 10,
          margin: { top: 20 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        // Add Part 2 table
        autoTable(doc, {
          head: [columnsPart2],
          body: rowsPart2,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [columnsPart3],
          body: rowsPart3,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [AEEColumns],
          body: AEERows,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        const pdfData = doc.output('blob');

        // Create a URL for the Blob and open it in a new tab
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, '_blank');

        // Optionally, you can revoke the URL to release resources after the tab is closed
        URL.revokeObjectURL(pdfUrl);
      } else {
        AEpart1Form = {
          "Estimate Number": this.viewModel.estimateNo,
          "Main Agreement Number": this.viewModel.mainAgreementNo,
          "WC-79 Order Number": this.viewModel.wc79OrderNo,
          "WC-79 Order Date": this.viewModel.wc79OrderDate,
          "WC-79 Order Value": this.viewModel.wc79OrderValue,
          "Supplement Agreement Number": this.viewModel.supplementAgreementNo,
          "Supplement Agreement Value": this.viewModel.supplementAgreementValue,
          "Total Value": this.viewModel.totalValue,
          "Date of commencement": this.viewModel.dateOfCommencement,
          "Due date of completion": this.viewModel.dueDateOfCompletion,
          "Actual date of completion": this.viewModel.actualDateOfCompletion,
          "Does final bill, completion report enclosed?": this.viewModel.finalBillCompletionReportEnclosed,
        };

        AEpart2Form = {
          "Date of measurement": this.viewModel.partIIDateOfMeasurement,
          "Date of check measurement": this.viewModel.dateOfCheckMeasurement,
          "Physical Achievement in %": this.viewModel.physicalAchievement,
          "Actual Percentage in %": this.viewModel.actualPercentage,
          "Extension of time (EOT)": this.viewModel.extensionOfTime,
          "EOT Order Number": this.viewModel.extensionOfTimeOrderNo,
          "EOT Date": this.viewModel.extensionOfTimeDate,
          "EOT Fine Amount": this.viewModel.extensionOfTimeFineAmount,
          "Liquidated damages / Lump sum fine imposed if any": this.viewModel.liquidatedDamagesOrLumpSumFine,
          "Whether all items covered in original or supplemental agreement": this.viewModel.itemsCoveredInAgreement,
          "Whether quantities in the bill are as per estimate": this.viewModel.quantitiesInBillAsPerEstimate,
          "Specify action taken to regularize such excess": this.viewModel.actionTakenToRegularizeExcess,
          "Have any items of work in the agreement being omitted or partly done": this.viewModel.itemsOmittedOrPartlyDone,
          "Whether part rate is paid": this.viewModel.partRatePaidInAgreement,
          "Whether all the works have been check measured by AEE and date of check measurement": this.viewModel.allWorksCheckedByAEE,
          "Whether computerized measurement book submitted?": this.viewModel.computerizedMeasurementBookSubmitted,
          "Whether pre measurements were taken wherever necessary and check measured by AEE and reference to pre measurement": this.viewModel.preMeasurementsTaken
        };

        AEpart3Form = {
          "Value of agreement": this.viewModel.valueOfAgreement,
          "Amount released upto previous bill": this.viewModel.amountReleasedUptoPreviousBill,
          "Balance": this.viewModel.balance,
          "Amount raised in this bill": this.viewModel.amountRaisedInThisBill,
          "Certificate": this.AEpart3Form.get('certificate')?.value,
          "Signature with date": this.AEpart3Form.get('signatureWithDate')?.value
        };

        AEEForm = {
          "Date of Check measurement": this.AEEForm.get('dateOfCheckMeasurement')?.value,
          "Certificate": this.AEEForm.get('certificate')?.value,
          "Signature": this.AEEForm.get('signatureWithDate')?.value,
        };

        EEForm = {
          "Date of super check": this.EEForm.get('dateOfCheckMeasurement')?.value,
          "Remarks": this.EEForm.get('certificate')?.value,
          "Signature": this.EEForm.get('signatureWithDate')?.value,
        };

        AssistantForm = {
          "Value of work done": this.viewModel.valueReportedByAE,
          "Corrected Value": this.viewModel.correctedValueByDA,
          "GST Percentage": this.viewModel.gstPercentage,
          "GST Amount": this.viewModel.gstValue,
          "Base value": this.viewModel.baseValue,
          "RMD 5%": this.viewModel.rmdValue,
          "IT 2%": this.viewModel.it,
          "EC 0.066%": this.viewModel.ec,
          "SGST 1%": this.viewModel.sgstValue,
          "CGST 1%": this.viewModel.cgstValue,
          "Steel Recovery": this.viewModel.steelRecoveryValue,
          "Mobilization": this.viewModel.mobilizationValue,
          "Withheld amount": this.viewModel.withheldValue,
          "EOT fine": this.viewModel.eotValue,
          "Other Recoveries (if any)": this.viewModel.otherRecoveriesValue,
          "Total Deduction": this.viewModel.totalDeduction,
          "Net Total": this.viewModel.netTotalValue,
          "Detailed project ledger (DPL) Page No.": this.viewModel.dplpageNo,
          "DPL Date": this.viewModel.dpldate,
          "Bill register Page No.": this.viewModel.billRegisterPageNo,
          "Bill register Date": this.viewModel.billRegisterDate,
        };

        DAForm = {
          "Remarks": this.DivisionalAccountantForm.get('certificate')?.value,
          "Bill passed for": this.DivisionalAccountantForm.get('billPassedFor')?.value,
          "Bill pay for": this.DivisionalAccountantForm.get('billPayFor')?.value,
          "Signature": this.DivisionalAccountantForm.get('signatureWithDate')?.value,
        };

        const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

        const AEHeader = ['Assistant Engineer', ''];
        const columnsPart1 = ['Part – I Work Description', ''];
        const rowsPart1: any[][] = [];

        const columnsPart2 = ['Part-II Bill details', ''];
        const rowsPart2: any[][] = [];

        const columnsPart3 = ['Part-III Payment details', ''];
        const rowsPart3: any[][] = [];

        const AEEColumns = ['Assistant Executive Engineer', ''];
        const AEERows: any[][] = [];

        const EEColumns = ['Executive Engineer', ''];
        const EERows: any[][] = [];

        const AssistantColumns = ['Assistant', ''];
        const AssistantRows: any[][] = [];

        const DAColumns = ['Divisional Accountant', ''];
        const DARows: any[][] = [];

        const AEpart1FormArray = Object.entries(AEpart1Form);
        AEpart1FormArray.forEach(([key, value]) => {
          rowsPart1.push([key, value]);
        });

        const AEpart2FormArray = Object.entries(AEpart2Form);
        AEpart2FormArray.forEach(([key, value]) => {
          rowsPart2.push([key, value]);
        });

        const AEpart3FormArray = Object.entries(AEpart3Form);
        AEpart3FormArray.forEach(([key, value]) => {
          rowsPart3.push([key, value]);
        });

        const AEEFormArray = Object.entries(AEEForm);
        AEEFormArray.forEach(([key, value]) => {
          AEERows.push([key, value]);
        });

        const EEFormArray = Object.entries(EEForm);
        EEFormArray.forEach(([key, value]) => {
          EERows.push([key, value]);
        });

        const AssistantFormArray = Object.entries(AssistantForm);
        AssistantFormArray.forEach(([key, value]) => {
          AssistantRows.push([key, value]);
        });

        const DAFormArray = Object.entries(DAForm);
        DAFormArray.forEach(([key, value]) => {
          DARows.push([key, value]);
        });

        doc.setFontSize(12);

        // Add Part 1 table
        autoTable(doc, {
          head: [AEHeader, columnsPart1],
          body: rowsPart1,
          theme: 'striped',
          startY: 10,
          margin: { top: 20 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        // Add Part 2 table
        autoTable(doc, {
          head: [columnsPart2],
          body: rowsPart2,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [columnsPart3],
          body: rowsPart3,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [AEEColumns],
          body: AEERows,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [EEColumns],
          body: EERows,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [AssistantColumns],
          body: AssistantRows,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        autoTable(doc, {
          head: [DAColumns],
          body: DARows,
          theme: 'striped',
          margin: { top: 10 },
          tableWidth: 'auto',
          rowPageBreak: 'avoid',
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
          }
        });

        const pdfData = doc.output('blob');

        // Create a URL for the Blob and open it in a new tab
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, '_blank');

        // Optionally, you can revoke the URL to release resources after the tab is closed
        URL.revokeObjectURL(pdfUrl);
      }

    } else if (this.role == "Assistant") {

      AEpart1Form = {
        "Estimate Number": this.viewModel.estimateNo,
        "Main Agreement Number": this.viewModel.mainAgreementNo,
        "WC-79 Order Number": this.viewModel.wc79OrderNo,
        "WC-79 Order Date": this.viewModel.wc79OrderDate,
        "WC-79 Order Value": this.viewModel.wc79OrderValue,
        "Supplement Agreement Number": this.viewModel.supplementAgreementNo,
        "Supplement Agreement Value": this.viewModel.supplementAgreementValue,
        "Total Value": this.viewModel.totalValue,
        "Date of commencement": this.viewModel.dateOfCommencement,
        "Due date of completion": this.viewModel.dueDateOfCompletion,
        "Actual date of completion": this.viewModel.actualDateOfCompletion,
        "Does final bill, completion report enclosed?": this.viewModel.finalBillCompletionReportEnclosed,
      };

      AEpart2Form = {
        "Date of measurement": this.viewModel.partIIDateOfMeasurement,
        "Date of check measurement": this.viewModel.dateOfCheckMeasurement,
        "Physical Achievement in %": this.viewModel.physicalAchievement,
        "Actual Percentage in %": this.viewModel.actualPercentage,
        "Extension of time (EOT)": this.viewModel.extensionOfTime,
        "EOT Order Number": this.viewModel.extensionOfTimeOrderNo,
        "EOT Date": this.viewModel.extensionOfTimeDate,
        "EOT Fine Amount": this.viewModel.extensionOfTimeFineAmount,
        "Liquidated damages / Lump sum fine imposed if any": this.viewModel.liquidatedDamagesOrLumpSumFine,
        "Whether all items covered in original or supplemental agreement": this.viewModel.itemsCoveredInAgreement,
        "Whether quantities in the bill are as per estimate": this.viewModel.quantitiesInBillAsPerEstimate,
        "Specify action taken to regularize such excess": this.viewModel.actionTakenToRegularizeExcess,
        "Have any items of work in the agreement being omitted or partly done": this.viewModel.itemsOmittedOrPartlyDone,
        "Whether part rate is paid": this.viewModel.partRatePaidInAgreement,
        "Whether all the works have been check measured by AEE and date of check measurement": this.viewModel.allWorksCheckedByAEE,
        "Whether computerized measurement book submitted?": this.viewModel.computerizedMeasurementBookSubmitted,
        "Whether pre measurements were taken wherever necessary and check measured by AEE and reference to pre measurement": this.viewModel.preMeasurementsTaken
      };

      AEpart3Form = {
        "Value of agreement": this.viewModel.valueOfAgreement,
        "Amount released upto previous bill": this.viewModel.amountReleasedUptoPreviousBill,
        "Balance": this.viewModel.balance,
        "Amount raised in this bill": this.viewModel.amountRaisedInThisBill,
        "Certificate": this.AEpart3Form.get('certificate')?.value,
        "Signature with date": this.AEpart3Form.get('signatureWithDate')?.value
      };

      AEEForm = {
        "Date of Check measurement": this.AEEForm.get('dateOfCheckMeasurement')?.value,
        "Certificate": this.AEEForm.get('certificate')?.value,
        "Signature": this.AEEForm.get('signatureWithDate')?.value,
      };

      EEForm = {
        "Date of super check": this.EEForm.get('dateOfCheckMeasurement')?.value,
        "Remarks": this.EEForm.get('certificate')?.value,
        "Signature": this.EEForm.get('signatureWithDate')?.value,
      };

      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

      const AEHeader = ['Assistant Engineer', ''];
      const columnsPart1 = ['Part – I Work Description', ''];
      const rowsPart1: any[][] = [];

      const columnsPart2 = ['Part-II Bill details', ''];
      const rowsPart2: any[][] = [];

      const columnsPart3 = ['Part-III Payment details', ''];
      const rowsPart3: any[][] = [];

      const AEEColumns = ['Assistant Executive Engineer', ''];
      const AEERows: any[][] = [];

      const EEColumns = ['Executive Engineer', ''];
      const EERows: any[][] = [];

      const AEpart1FormArray = Object.entries(AEpart1Form);
      AEpart1FormArray.forEach(([key, value]) => {
        rowsPart1.push([key, value]);
      });

      const AEpart2FormArray = Object.entries(AEpart2Form);
      AEpart2FormArray.forEach(([key, value]) => {
        rowsPart2.push([key, value]);
      });

      const AEpart3FormArray = Object.entries(AEpart3Form);
      AEpart3FormArray.forEach(([key, value]) => {
        rowsPart3.push([key, value]);
      });

      const AEEFormArray = Object.entries(AEEForm);
      AEEFormArray.forEach(([key, value]) => {
        AEERows.push([key, value]);
      });

      const EEFormArray = Object.entries(EEForm);
      EEFormArray.forEach(([key, value]) => {
        EERows.push([key, value]);
      });

      doc.setFontSize(12);

      // Add Part 1 table
      autoTable(doc, {
        head: [AEHeader, columnsPart1],
        body: rowsPart1,
        theme: 'striped',
        startY: 10,
        margin: { top: 20 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      // Add Part 2 table
      autoTable(doc, {
        head: [columnsPart2],
        body: rowsPart2,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [columnsPart3],
        body: rowsPart3,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [AEEColumns],
        body: AEERows,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [EEColumns],
        body: EERows,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      const pdfData = doc.output('blob');

      // Create a URL for the Blob and open it in a new tab
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');

      // Optionally, you can revoke the URL to release resources after the tab is closed
      URL.revokeObjectURL(pdfUrl);

    } else if (this.role == "DA") {

      AEpart1Form = {
        "Estimate Number": this.viewModel.estimateNo,
        "Main Agreement Number": this.viewModel.mainAgreementNo,
        "WC-79 Order Number": this.viewModel.wc79OrderNo,
        "WC-79 Order Date": this.viewModel.wc79OrderDate,
        "WC-79 Order Value": this.viewModel.wc79OrderValue,
        "Supplement Agreement Number": this.viewModel.supplementAgreementNo,
        "Supplement Agreement Value": this.viewModel.supplementAgreementValue,
        "Total Value": this.viewModel.totalValue,
        "Date of commencement": this.viewModel.dateOfCommencement,
        "Due date of completion": this.viewModel.dueDateOfCompletion,
        "Actual date of completion": this.viewModel.actualDateOfCompletion,
        "Does final bill, completion report enclosed?": this.viewModel.finalBillCompletionReportEnclosed,
      };

      AEpart2Form = {
        "Date of measurement": this.viewModel.partIIDateOfMeasurement,
        "Date of check measurement": this.viewModel.dateOfCheckMeasurement,
        "Physical Achievement in %": this.viewModel.physicalAchievement,
        "Actual Percentage in %": this.viewModel.actualPercentage,
        "Extension of time (EOT)": this.viewModel.extensionOfTime,
        "EOT Order Number": this.viewModel.extensionOfTimeOrderNo,
        "EOT Date": this.viewModel.extensionOfTimeDate,
        "EOT Fine Amount": this.viewModel.extensionOfTimeFineAmount,
        "Liquidated damages / Lump sum fine imposed if any": this.viewModel.liquidatedDamagesOrLumpSumFine,
        "Whether all items covered in original or supplemental agreement": this.viewModel.itemsCoveredInAgreement,
        "Whether quantities in the bill are as per estimate": this.viewModel.quantitiesInBillAsPerEstimate,
        "Specify action taken to regularize such excess": this.viewModel.actionTakenToRegularizeExcess,
        "Have any items of work in the agreement being omitted or partly done": this.viewModel.itemsOmittedOrPartlyDone,
        "Whether part rate is paid": this.viewModel.partRatePaidInAgreement,
        "Whether all the works have been check measured by AEE and date of check measurement": this.viewModel.allWorksCheckedByAEE,
        "Whether computerized measurement book submitted?": this.viewModel.computerizedMeasurementBookSubmitted,
        "Whether pre measurements were taken wherever necessary and check measured by AEE and reference to pre measurement": this.viewModel.preMeasurementsTaken
      };

      AEpart3Form = {
        "Value of agreement": this.viewModel.valueOfAgreement,
        "Amount released upto previous bill": this.viewModel.amountReleasedUptoPreviousBill,
        "Balance": this.viewModel.balance,
        "Amount raised in this bill": this.viewModel.amountRaisedInThisBill,
        "Certificate": this.AEpart3Form.get('certificate')?.value,
        "Signature with date": this.AEpart3Form.get('signatureWithDate')?.value
      };

      AEEForm = {
        "Date of Check measurement": this.AEEForm.get('dateOfCheckMeasurement')?.value,
        "Certificate": this.AEEForm.get('certificate')?.value,
        "Signature": this.AEEForm.get('signatureWithDate')?.value,
      };

      EEForm = {
        "Date of super check": this.EEForm.get('dateOfCheckMeasurement')?.value,
        "Remarks": this.EEForm.get('certificate')?.value,
        "Signature": this.EEForm.get('signatureWithDate')?.value,
      };

      AssistantForm = {
        "Value of work done": this.viewModel.valueReportedByAE,
        "Corrected Value": this.viewModel.correctedValueByDA,
        "GST Percentage": this.viewModel.gstPercentage,
        "GST Amount": this.viewModel.gstValue,
        "Base value": this.viewModel.baseValue,
        "RMD 5%": this.viewModel.rmdValue,
        "IT 2%": this.viewModel.it,
        "EC 0.066%": this.viewModel.ec,
        "SGST 1%": this.viewModel.sgstValue,
        "CGST 1%": this.viewModel.cgstValue,
        "Steel Recovery": this.viewModel.steelRecoveryValue,
        "Mobilization": this.viewModel.mobilizationValue,
        "Withheld amount": this.viewModel.withheldValue,
        "EOT fine": this.viewModel.eotValue,
        "Other Recoveries (if any)": this.viewModel.otherRecoveriesValue,
        "Total Deduction": this.viewModel.totalDeduction,
        "Net Total": this.viewModel.netTotalValue,
        "Detailed project ledger (DPL) Page No.": this.viewModel.dplpageNo,
        "DPL Date": this.viewModel.dpldate,
        "Bill register Page No.": this.viewModel.billRegisterPageNo,
        "Bill register Date": this.viewModel.billRegisterDate,
      };

      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size

      const AEHeader = ['Assistant Engineer', ''];
      const columnsPart1 = ['Part – I Work Description', ''];
      const rowsPart1: any[][] = [];

      const columnsPart2 = ['Part-II Bill details', ''];
      const rowsPart2: any[][] = [];

      const columnsPart3 = ['Part-III Payment details', ''];
      const rowsPart3: any[][] = [];

      const AEEColumns = ['Assistant Executive Engineer', ''];
      const AEERows: any[][] = [];

      const EEColumns = ['Executive Engineer', ''];
      const EERows: any[][] = [];

      const AssistantColumns = ['Assistant', ''];
      const AssistantRows: any[][] = [];

      const AEpart1FormArray = Object.entries(AEpart1Form);
      AEpart1FormArray.forEach(([key, value]) => {
        rowsPart1.push([key, value]);
      });

      const AEpart2FormArray = Object.entries(AEpart2Form);
      AEpart2FormArray.forEach(([key, value]) => {
        rowsPart2.push([key, value]);
      });

      const AEpart3FormArray = Object.entries(AEpart3Form);
      AEpart3FormArray.forEach(([key, value]) => {
        rowsPart3.push([key, value]);
      });

      const AEEFormArray = Object.entries(AEEForm);
      AEEFormArray.forEach(([key, value]) => {
        AEERows.push([key, value]);
      });

      const EEFormArray = Object.entries(EEForm);
      EEFormArray.forEach(([key, value]) => {
        EERows.push([key, value]);
      });

      const AssistantFormArray = Object.entries(AssistantForm);
      AssistantFormArray.forEach(([key, value]) => {
        AssistantRows.push([key, value]);
      });

      doc.setFontSize(12);

      // Add Part 1 table
      autoTable(doc, {
        head: [AEHeader, columnsPart1],
        body: rowsPart1,
        theme: 'striped',
        startY: 10,
        margin: { top: 20 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      // Add Part 2 table
      autoTable(doc, {
        head: [columnsPart2],
        body: rowsPart2,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [columnsPart3],
        body: rowsPart3,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [AEEColumns],
        body: AEERows,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [EEColumns],
        body: EERows,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      autoTable(doc, {
        head: [AssistantColumns],
        body: AssistantRows,
        theme: 'striped',
        margin: { top: 10 },
        tableWidth: 'auto',
        rowPageBreak: 'avoid',
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 80 },
        }
      });

      const pdfData = doc.output('blob');

      // Create a URL for the Blob and open it in a new tab
      const pdfUrl = URL.createObjectURL(pdfData);
      window.open(pdfUrl, '_blank');

      // Optionally, you can revoke the URL to release resources after the tab is closed
      URL.revokeObjectURL(pdfUrl);

    }

  }

  //Pay Vendor
  // payVendor() {
  //   this.paymentService.canaraEncryptData().subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       this.paymentService.canaraPaymentRequest(response.data).subscribe(
  //         (response: any) => {
  //           console.log(response);
  //         },
  //         (error: any) => {
  //           console.error(error);
  //         }
  //       );
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // }

  payVendor() {
    const dataToEncrypt = {
      "Authorization": "Basic U1lFREFQSUFVVEg6MmE4OGE5MWE5MmE2NGEx",
      "txnPassword": "2a88a91a92a64a1a1a3",
      "srcAcctNumber": "2774201000198",
      "destAcctNumber": "9833111000032",
      "customerID": "13961989",
      "txnAmount": "1",
      "benefName": "test"
    };
    this.paymentService.canaraEncryptData(dataToEncrypt).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  showToast(type: string, message: string, title: string) {
    const toastConfig = {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      tapToDismiss: false,
    };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, toastConfig);
        break;
      case 'warning':
        this.toastr.warning(message, title, toastConfig);
        break;
      case 'info':
        this.toastr.warning(message, title, toastConfig);
        break;
      default:
        this.toastr.error(message, title, toastConfig);
        break;
    }
  }

  patchApplicationForm(response: any) {
    this.applicationForm.patchValue({
      division: response.billDivision,
      nameOfContractor: response.nameOfTheContractor,
      nameOfWork: response.nameOfTheWork,
      agreementNo: response.agreementNumber,
      agreementDate: response.agreementDate,
      dateOfCommencement: response.commencementDate,
      dateOfCompletion: response.completionDate,
      agreementValue: response.agreementValue,
      invoiceNo: response.invoiceNumber,
      billNo: response.billNumber,
      billAmount: response.billAmount,
      billGSTPercentage: response.billGSTPercentage,
      billGSTAmount: response.billGSTAmount,
      billTotal: response.billTotal,
      pan: response.panNumber,
      tan: response.tanNumber,
      gst: response.gstNumber,
      appliedDate: response.creationTime,
      bankName: [''],
      bankAccountNo: [''],
      accountHolderName: [''],
      ifscCode: [''],
      branchName: ['']
    });
  }

  patchAEpart1Form(response: any) {
    this.AEpart1Form.patchValue(response);
    this.AEpart2Form.patchValue(response);
    this.AEpart3Form.patchValue({
      valueOfAgreement: response.agreementValue,
      amountRaisedInThisBill: response.billTotal,
      certificateAE: response.certificateAE,
      signatureAE: response.signatureAE,
      date: response.dateOfSubmissionAE,
    });
  }

  patchAEEForm(response: any) {
    this.AEEForm.patchValue(response);
  }

  patchDAForm(response: any) {
    this.AssistantForm.patchValue(response);
    this.DivisionalAccountantForm.patchValue(response);
  }

  patchEEForm(response: any) {
    this.EEForm.patchValue(response);
  }

  patchSEForm(response: any) {
    this.SEForm.patchValue(response);
  }

  patchSEHQForm(response: any) {
    this.SEHQForm.patchValue(response);
  }

  patchCEForm(response: any) {
    this.CEForm.patchValue(response);
  }

}
