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

  showAE: boolean = false;
  showAEE: boolean = false;
  showEE: boolean = false;
  showEEstage2: boolean = false;
  showAssistant: boolean = false;
  showDA: boolean = false;

  statusofEE: any;

  AEFormReadOnly: boolean = false;
  AEEFormReadOnly: boolean = false;
  EEFormReadOnly: boolean = false;
  AssistantFormReadOnly: boolean = false;
  DAFormReadOnly: boolean = false;

  displayedColumns: string[] = ['sno', 'accountcode', 'description', 'amount'];
  panelOpenState = false;
  id: any;
  revieweddate: any

  applicationForm!: FormGroup;
  AEpart1Form!: FormGroup;
  AEpart2Form!: FormGroup;
  AEpart3Form!: FormGroup;
  AEEForm!: FormGroup;
  DivisionalAccountantForm!: FormGroup;
  EEForm!: FormGroup;
  AssistantForm!: FormGroup;
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

  constructor(
    private formBuilder: FormBuilder,
    private billService: BillsService,
    private route: ActivatedRoute,
    private date: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private voucherService: VoucherService
  ) { }

  ngOnInit() {

    this.role = sessionStorage.getItem('role');

    if (this.role == "AE") {
      this.showAE = true;
    }
    if (this.role == "AEE") {
      this.showAEE = true;
      this.AEFormReadOnly = true;
    }

    if (this.role == "Assistant") {
      this.showAssistant = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AEFormReadOnly = true;
      this.EEFormReadOnly = true;
    }
    if (this.role == "DA") {
      this.showDA = true;
      this.AEFormReadOnly = true;
      this.AEEFormReadOnly = true;
      this.AEFormReadOnly = true;
      this.EEFormReadOnly = true;
      this.AssistantFormReadOnly = true;
    }

    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });


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
      expenditureTillPreviousBill: [''],
      estimateNo: [''],
      fsValue: [''],
      reraNo: [''],
      mainAgreementNo: [''],
      mainAgreementValue: [null],
      wc79OrderNo: [''],
      wc79OrderDate: [''],
      wc79OrderValue: [null],
      supplementAgreementNo: [''],
      supplementAgreementValue: [null],
      totalValue: [null],
      dateOfCommencement: [''],
      dueDateOfCompletion: [''],
      actualDateOfCompletion: [''],
      finalBillCompletionReportEnclosed: [''],
      // value: [''],
    });

    this.AEpart2Form = this.formBuilder.group({
      partIIDateOfMeasurement: [''],
      dateOfCheckMeasurement: [''],
      physicalAchievement: [null],
      actualPercentage: [''],
      extensionOfTime: [''],
      extensionOfTimeOrderNo: [''],
      extensionOfTimeDate: [''],
      extensionOfTimeFineAmount: [''],
      liquidatedDamagesOrLumpSumFine: [''],
      itemsCoveredInAgreement: [''],
      quantitiesInBillAsPerEstimate: [''],
      itemsOmittedOrPartlyDone: [''],
      partRatePaidInAgreement: [''],
      computerizedMeasurementBookSubmitted: [''],
      actionTakenToRegularizeExcess: ['']
    });

    this.AEpart3Form = this.formBuilder.group({
      valueOfAgreement: [''],
      amountReleasedUptoPreviousBill: [''],
      balance: [''],
      amountRaisedInThisBill: [''],
      certificate: [''],
      signature: [''],
      date: [''],
    });

    this.AEEForm = this.formBuilder.group({
      allWorksCheckedByAEE: [''],
      preMeasurementsTaken: [''],
      dateOfCheckMeasurement: [''],
      certificate: [''],
      signature: [''],
    })

    this.AssistantForm = this.formBuilder.group({
      valueOfWorkDoneAsReportedByAE: [''],
      correctedValue: [''],
      gstamount: [''],
      gst_Percentage: [''],
      baseValue: [''],
      rmd: [0],
      labourFund: [0],
      it: [0],
      ec: [0],
      sgst: [0],
      cgst: [0],
      steelRecovery: [''],
      mobilization: [''],
      withheldAmount: [''],
      eotfine: [''],
      otherRecoveries: [''],
      otherRecoveriesRemarks: [''],
      totalDeduction: [0],
      netTotal: [''],
      dplpageNo: [''],
      dpldate: [''],
      billRegisterPageNo: [''],
      billRegisterDate: [''],
    })

    this.DivisionalAccountantForm = this.formBuilder.group({
      certificate: [''],
      billPassedFor: [''],
      billPayFor: [''],
      signatureWithDate: ['']
    })

    this.EEForm = this.formBuilder.group({
      voucherNo: [''],
      dateOfSuperCheck: [''],
      billPassedFor: [''],
      billPayFor: [''],
      remarks: [''],
      signatureWithDate: ['']
    })

    this.SEForm = this.formBuilder.group({
      dateOfInspection: [''],
      remarks: [''],
      signature: [''],
      date: [''],
    })

    this.SEHQForm = this.formBuilder.group({
      recommendationOfLC: [''],
      remarks: [''],
      signature: [''],
      date: [''],
    })

    this.CEForm = this.formBuilder.group({
      dateOfInspection: [''],
      recommendationOfLC: [''],
      remarks: [''],
      signature: [''],
      date: [''],
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

    this.billService.getapplbyid(this.id).subscribe(
      (response) => {
        this.viewModel = response.data.bill[0];
        this.fileurl = this.viewModel.fileurl
        this.statusofEE = this.viewModel.status;
        if (this.role == "EE") {
          console.log(this.statusofEE)
          if (this.statusofEE == "Approved by AEE") {
            this.showEE = true;
            this.showEEstage2 = false;
            this.AEFormReadOnly = true;
            this.AEEFormReadOnly = true
          }
          else {
            this.showEEstage2 = true;
            this.showEE = false;
            this.AEFormReadOnly = true;
            this.AEEFormReadOnly = true;
            this.AEFormReadOnly = true;
            this.EEFormReadOnly = true;
            this.AssistantFormReadOnly = true;
            this.DAFormReadOnly = true;
          }
        }
        console.log("this.viewModel", this.viewModel)
        this.applicationForm.patchValue({
          nameOfWork: this.viewModel.nameOfWork,
          nameOfContractor: this.viewModel.nameOfContractor,
          estimateNo: this.viewModel.estimateNo,
          division: this.viewModel.division,
          appliedDate: this.viewModel.appliedDate,
          fileurl: this.viewModel.fileurl
        });
        this.AEpart1Form.patchValue({
          estimateNo: this.viewModel.estimateNo,
          mainAgreementNo: this.viewModel.mainAgreementNo,
          value: this.viewModel.value,
          wc79OrderNoAndDate: this.viewModel.wc79OrderNoAndDate,
          supplementAgreementNo: this.viewModel.supplementAgreementNo,
          supplementAgreementValue: this.viewModel.supplementAgreementValue,
          totalValue: this.viewModel.totalValue,
          dueDateOfCompletion: this.viewModel.dueDateOfCompletion,
          actualDateOfCompletion: this.viewModel.actualDateOfCompletion,
          finalBillCompletionReportEnclosed: this.viewModel.finalBillCompletionReportEnclosed,
          dateOfCommencement: this.viewModel.dateOfCommencement,
          mainAgreementValue: this.viewModel.mainAgreementValue,
          wc79OrderDate: this.viewModel.wc79OrderDate,
          wc79OrderNo: this.viewModel.wc79OrderNo,
          wc79OrderValue: this.viewModel.wc79OrderValue,

        })
        this.AEpart2Form.patchValue({
          partIIDateOfMeasurement: this.viewModel.partIIDateOfMeasurement,
          dateOfCheckMeasurement: this.viewModel.dateOfCheckMeasurement,
          workCarriedOutAtSpecifiedRateOfSpeed: this.viewModel.workCarriedOutAtSpecifiedRateOfSpeed,
          extensionOfTimeDate: this.viewModel.extensionOfTimeDate,
          extensionOfTimeOrderNo: this.viewModel.extensionOfTimeOrderNo,
          fineAmount: this.viewModel.fineAmount,
          liquidatedDamagesOrLumpSumFine: this.viewModel.liquidatedDamagesOrLumpSumFine,
          itemsCoveredInAgreement: this.viewModel.itemsCoveredInAgreement,
          quantitiesInBillAsPerEstimate: this.viewModel.quantitiesInBillAsPerEstimate,
          itemsOmittedOrPartlyDone: this.viewModel.itemsOmittedOrPartlyDone,
          partRatePaidInAgreement: this.viewModel.partRatePaidInAgreement,
          allWorksCheckedByAEE: this.viewModel.allWorksCheckedByAEE,
          computerizedMeasurementBookSubmitted: this.viewModel.computerizedMeasurementBookSubmitted,
          preMeasurementsTaken: this.viewModel.preMeasurementsTaken,
          actionTakenToRegularizeExcess: this.viewModel.actionTakenToRegularizeExcess,
          physicalAchievement: this.viewModel.physicalAchievement,
          actualPercentage: this.viewModel.actualPercentage,
          extensionOfTime: this.viewModel.extensionOfTime,
          extensionOfTimeFineAmount: this.viewModel.extensionOfTimeFineAmount
        })
        this.AEpart3Form.patchValue({
          valueOfAgreement: this.viewModel.valueOfAgreement,
          amountReleasedUptoPreviousBill: this.viewModel.amountReleasedUptoPreviousBill,
          balance: this.viewModel.balance,
          amountRaisedInThisBill: this.viewModel.amountRaisedInThisBill,

        })

        this.AssistantForm.patchValue({
          valueOfWorkDoneAsReportedByAE: this.viewModel.valueOfWorkDoneAsReportedByAE,
          correctedValue: this.viewModel.correctedValue,
          gstamount: this.viewModel.gstamount,
          gst_Percentage: this.viewModel.gst_Percentage,
          baseValue: this.viewModel.baseValue,
          rmd: this.viewModel.rmd,
          it: this.viewModel.it,
          ec: this.viewModel.ec,
          sgst: this.viewModel.sgst,
          cgst: this.viewModel.cgst,
          steelRecovery: this.viewModel.steelRecovery,
          mobilization: this.viewModel.mobilization,
          withheldAmount: this.viewModel.withheldAmount,
          eotfine: this.viewModel.eotfine,
          otherRecoveries: this.viewModel.otherRecoveries,
          totalDeduction: this.viewModel.totalDeduction,
          netTotal: this.viewModel.netTotal,
          dplpageNo: this.viewModel.dplpageNo,
          dpldate: this.viewModel.dpldate,
          billRegisterPageNo: this.viewModel.billRegisterPageNo,
          billRegisterDate: this.viewModel.billRegisterDate,
        });
        this.DivisionalAccountantForm.patchValue({
          billPassedFor: this.viewModel.correctedValue,
          billPayFor: this.viewModel.netTotal,
        });
        const billauthor = response.data.billAuthorization;

        for (const item of billauthor) {

          const roleoftheofficer = item.roleOfTheOfficer;
          const officerModel = item;

          switch (roleoftheofficer) {
            case 'AE':
              console.log(officerModel)
              // this.AEpart2Form.patchValue({
              //   dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
              // });
              this.AEpart3Form.patchValue({
                certificate: officerModel.certificate,
                signatureWithDate: officerModel.signatureWithDate
              });
              this.revieweddate = officerModel.approvalDate;
              break;

            case 'AEE':
              this.AEEForm.patchValue({
                dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                certificate: officerModel.certificate,
                signatureWithDate: officerModel.signatureWithDate
              });
              this.revieweddate = officerModel.approvalDate;
              break;


            case 'EE':
              if (this.viewModel.status == "Approved by AEE") {
                this.EEForm.patchValue({
                  dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                  certificate: officerModel.certificate,
                  signatureWithDate: officerModel.signatureWithDate
                });
                this.revieweddate = officerModel.approvalDate;
              }
              if (this.viewModel.status == "Approved by EE") {
                this.EEForm.patchValue({
                  dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                  certificate: officerModel.certificate,
                  signatureWithDate: officerModel.signatureWithDate
                });
                this.revieweddate = officerModel.approvalDate;
              }
              if (this.viewModel.status == "Approved by Assistant") {
                this.EEForm.patchValue({
                  dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                  certificate: officerModel.certificate,
                  signatureWithDate: officerModel.signatureWithDate
                });
                this.revieweddate = officerModel.approvalDate;
              }
              if (this.viewModel.status == "Approved by DA") {
                this.EEForm.patchValue({
                  dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                  certificate: officerModel.certificate,
                  signatureWithDate: officerModel.signatureWithDate,
                  billPassedFor: officerModel.correctedValue,
                  billPayFor: officerModel.netTotal,
                });
                this.revieweddate = officerModel.approvalDate;
              }
              break;

            case 'DA':

              this.DivisionalAccountantForm.patchValue({
                billPassedFor: this.viewModel.correctedValue,
                billPayFor: this.viewModel.netTotal,
                signatureWithDate: officerModel.signatureWithDate,
                certificate: officerModel.certificate
              });
              this.revieweddate = officerModel.approvalDate;
              break;

            default:

              break;
          }
        }
      },
      (error) => {
        console.error(error);
      });

    const currentDate = new Date();
    this.currentDate = this.date.transform(currentDate, 'yyyy-MM-dd');
  }

  openFile(filePath: string): string {
    return 'file://' + filePath.replace(/\\/g, '/');
  }

  generateVoucherNo() {
    const division = this.applicationForm.get('division')?.value;
    const voucherNumber = this.voucherService.generateVoucherNumber(division);
    this.EEForm.get('voucherNo')?.setValue(voucherNumber);
  }

  saveNewBill() {

    if (this.role === 'AE') {
      const dateOfCheckMeasurementValue = this.AEpart3Form.get('dateOfCheckMeasurement')?.value;
      const certificate = this.AEpart3Form.get('certificate')?.value;
      const signatureWithDate = this.AEpart3Form.get('signatureWithDate')?.value;
      const nid = this.id;
      const billAuthorization = {
        "dateOfCheckMeasurement": dateOfCheckMeasurementValue,
        "approvalDate": this.currentDate,
        "certificate": certificate,
        "signatureWithDate": signatureWithDate,
        "roleOfTheOfficer": this.role,
        "billPassedFor": null,
        "billPayFor": null,
        "approvalStatus": "approve"
      };
      const bill = {
        ...this.applicationForm.value,
        ...this.AEpart1Form.value,
        ...this.AEpart2Form.value,
        ...this.AEpart3Form.value,
        nid
      };

      const data = {
        "bill": bill,
        "billAuthorization": billAuthorization
      }

      console.log(data)
      this.billService.saveNewBill(data).subscribe(
        (response) => {

          const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px', // Set the width and other dialog options as needed
            data: {
              isSuccess: true,
              message: 'Bill sent successfully to Assistant Executive Engineer'
            }, // Pass data to the dialog if needed
          });

          // You can handle dialog close events if necessary
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['home', 'pending']);
          });

        },
        (error) => {
          console.error('Error:', error);
        }
      );
    }

    if (this.role === 'AEE') {
      const dateOfCheckMeasurementValue = this.AEEForm.get('dateOfCheckMeasurement')?.value;
      const certificate = this.AEEForm.get('certificate')?.value;
      const signatureWithDate = this.AEEForm.get('signatureWithDate')?.value;
      const nid = this.id;
      const billAuthorization = {
        "dateOfCheckMeasurement": dateOfCheckMeasurementValue,
        "approvalDate": this.currentDate,
        "certificate": certificate,
        "signatureWithDate": signatureWithDate,
        "roleOfTheOfficer": this.role,
        "billPassedFor": null,
        "billPayFor": null,
        "approvalStatus": "approve"
      };
      const bill = {
        ...this.applicationForm.value,
        ...this.AEpart1Form.value,
        ...this.AEpart2Form.value,
        ...this.AEpart3Form.value,
        ...this.AEEForm.value,
        nid
      };

      const data = {
        "bill": bill,
        "billAuthorization": billAuthorization
      }

      this.billService.saveNewBill(data).subscribe(
        (response) => {

          console.log('Response from backend:', response);
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px', // Set the width and other dialog options as needed
            data: {
              isSuccess: true,
              message: 'Bill sent successfully to Executive Engineer'
            }, // Pass data to the dialog if needed
          });

          // You can handle dialog close events if necessary
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['home', 'pending']);
          });
        },
        (error) => {

          console.error('Error:', error);
        }
      );
    }

    if (this.role === 'EE') {
      if (this.statusofEE == "Approved by AEE") {
        const dateOfCheckMeasurementValue = this.EEForm.get('dateOfCheckMeasurement')?.value;
        const certificate = this.EEForm.get('certificate')?.value;
        const signatureWithDate = this.EEForm.get('signatureWithDate')?.value;
        const nid = this.id;
        const billAuthorization = {
          "dateOfCheckMeasurement": dateOfCheckMeasurementValue,
          "approvalDate": this.currentDate,
          "certificate": certificate,
          "signatureWithDate": signatureWithDate,
          "roleOfTheOfficer": this.role,
          "billPassedFor": null,
          "billPayFor": null,
          "approvalStatus": "approve"
        };
        const bill = {
          ...this.applicationForm.value,
          ...this.AEpart1Form.value,
          ...this.AEpart2Form.value,
          ...this.AEpart3Form.value,
          ...this.AEEForm.value,
          ...this.EEForm.value,
          nid,
          status: this.statusofEE,

        };

        const data = {
          "bill": bill,
          "billAuthorization": billAuthorization
        }

        console.log(data);
        this.billService.saveNewBill(data).subscribe(
          (response) => {

            console.log('Response from backend:', response);
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '400px', // Set the width and other dialog options as needed
              data: {
                isSuccess: true,
                message: 'Bill sent successfully to Assistant'
              }, // Pass data to the dialog if needed
            });

            // You can handle dialog close events if necessary
            dialogRef.afterClosed().subscribe((result) => {
              this.router.navigate(['home', 'pending']);
            });
          },
          (error) => {

            console.error('Error:', error);
          }
        );
      }
      else {
        const signatureWithDate = this.EEForm.get('signatureWithDate')?.value;
        const billpassedfor = this.EEForm.get('billPassedFor')?.value;
        const billpayedfor = this.EEForm.get('billPayFor')?.value;
        const nid = this.id;
        const billAuthorization = {
          "dateOfCheckMeasurement": null,
          "approvalDate": this.currentDate,
          "certificate": null,
          "signatureWithDate": signatureWithDate,
          "roleOfTheOfficer": this.role,
          "billPassedFor": billpassedfor,
          "billPayFor": billpayedfor,
          "approvalStatus": "approve"
        };
        const bill = {
          ...this.applicationForm.value,
          ...this.AEpart1Form.value,
          ...this.AEpart2Form.value,
          ...this.AEpart3Form.value,
          ...this.AEEForm.value,
          ...this.EEForm.value,
          ...this.AssistantForm.value,
          ...this.DivisionalAccountantForm.value,
          ...this.EEForm.value,
          nid,
          status: this.statusofEE,
        };

        const data = {
          "bill": bill,
          "billAuthorization": billAuthorization
        }

        this.billService.saveNewBill(data).subscribe(
          (response) => {

            console.log('Response from backend:', response);
            const dialogRef = this.dialog.open(DialogComponent, {
              width: '400px', // Set the width and other dialog options as needed
              data: {
                isSuccess: true,
                message: 'Bill sent successfully'
              }, // Pass data to the dialog if needed
            });

            // You can handle dialog close events if necessary
            dialogRef.afterClosed().subscribe((result) => {
              this.router.navigate(['home', 'pending']);
            });
          },
          (error) => {

            console.error('Error:', error);
          }
        );
      }
    }

    if (this.role === 'DA') {

      const certificate = this.DivisionalAccountantForm.get('certificate')?.value;
      const signatureWithDate = this.DivisionalAccountantForm.get('signatureWithDate')?.value;
      const billpassedfor = this.DivisionalAccountantForm.get('billPassedFor')?.value;
      const billpayedfor = this.DivisionalAccountantForm.get('billPayFor')?.value;
      const nid = this.id;
      const billAuthorization = {
        "dateOfCheckMeasurement": null,
        "approvalDate": this.currentDate,
        "certificate": certificate,
        "signatureWithDate": signatureWithDate,
        "roleOfTheOfficer": this.role,
        "billPassedFor": billpassedfor,
        "billPayFor": billpayedfor,
        "approvalStatus": "approve"
      };
      const bill = {
        ...this.applicationForm.value,
        ...this.AEpart1Form.value,
        ...this.AEpart2Form.value,
        ...this.AEpart3Form.value,
        ...this.AEEForm.value,
        ...this.EEForm.value,
        ...this.DivisionalAccountantForm.value,
        ...this.AssistantForm.value,
        nid
      };

      const data = {
        "bill": bill,
        "billAuthorization": billAuthorization
      }

      this.billService.saveNewBill(data).subscribe(
        (response) => {

          console.log('Response from backend:', response);
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px', // Set the width and other dialog options as needed
            data: {
              isSuccess: true,
              message: 'Bill sent successfully to Executive Engineer'
            }, // Pass data to the dialog if needed
          });

          // You can handle dialog close events if necessary
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['home', 'pending']);
          });
        },
        (error) => {

          console.error('Error:', error);
        }
      );
    }

    if (this.role === 'Assistant') {
      const nid = this.id;
      const bill = {
        ...this.applicationForm.value,
        ...this.AEpart1Form.value,
        ...this.AEpart2Form.value,
        ...this.AEpart3Form.value,
        ...this.AEEForm.value,
        ...this.AEEForm.value,
        ...this.AssistantForm.value,
        nid
      };


      const billAuthorization = {
        "dateOfCheckMeasurement": null,
        "approvalDate": this.currentDate,
        "certificate": null,
        "signatureWithDate": null,
        "roleOfTheOfficer": this.role,
        "billPassedFor": null,
        "billPayFor": null,
        "approvalStatus": "approve"
      };

      const data = {
        "bill": bill,
        "billAuthorization": billAuthorization
      }

      console.log(data);
      this.billService.saveNewBill(data).subscribe(
        (response) => {
          console.log('Response from backend:', response);
          const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px', // Set the width and other dialog options as needed
            data: {
              isSuccess: true,
              message: 'Bill sent successfully to Divisional Accountant'
            }, // Pass data to the dialog if needed
          });

          // You can handle dialog close events if necessary
          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigate(['home', 'pending']);
          });

        },
        (error) => {

          console.error('Error:', error);
        }
      );
    }

  }

  calculateGST() {
    // Retrieve the selected value from the dropdown
    const selectedValue = parseInt((document.getElementById('dropdownSelect') as HTMLSelectElement).value);
    const divideValue = selectedValue + 100;

    // Check if AssistantForm is defined and not null
    console.log("calculate is clicked");

    // Retrieve the 'correctedValue' control from the form
    const correctedValueControl = this.AssistantForm.get('correctedValue');
    console.log("correctedValueControl", correctedValueControl);

    // Check if 'correctedValueControl' is not null and its value is a number
    if (correctedValueControl) {
      // Extract the numeric value and calculate the GST amount based on the selected value
      const correctedValue = correctedValueControl.value;
      let gstamount = (selectedValue / divideValue) * correctedValue;
      gstamount = parseFloat(gstamount.toFixed(2));
      let baseValue = correctedValue - gstamount;
      let rmd = (5 / 100) * baseValue;
      let labourFund = (1 / 100) * baseValue;
      let it = (2 / 100) * baseValue;
      let ec = (0.066 / 100) * it;
      let sgst = (1 / 100) * baseValue;
      let cgst = (1 / 100) * baseValue;

      this.AssistantForm.get('gstamount')?.setValue(gstamount);

      baseValue = parseFloat(baseValue.toFixed(2));
      this.AssistantForm.get('baseValue')?.setValue(baseValue);

      rmd = Math.ceil(parseFloat(rmd.toFixed(2)) / 100) * 100;
      this.AssistantForm.get('rmd')?.setValue(rmd);

      labourFund = Math.ceil(parseFloat(labourFund.toFixed(2)));
      this.AssistantForm.get('labourFund')?.setValue(labourFund);

      it = Math.ceil(parseFloat(it.toFixed(2)));
      this.AssistantForm.get('it')?.setValue(it);

      ec = Math.ceil(parseFloat(ec.toFixed(2)));
      this.AssistantForm.get('ec')?.setValue(ec);

      sgst = Math.ceil(parseFloat(sgst.toFixed(2)));
      this.AssistantForm.get('sgst')?.setValue(sgst);

      cgst = Math.ceil(parseFloat(cgst.toFixed(2)));
      this.AssistantForm.get('cgst')?.setValue(cgst);

      // this.totalDeduction = parseFloat(this.totalDeduction.toFixed(2));
      // this.AssistantForm.get('totalDeduction')?.setValue(this.totalDeduction);

    } else {
      // Handle the case when 'correctedValueControl' is null or its value is not a number
      console.error('Invalid or missing value for correctedValue');
      // You can also set a default or handle this situation accordingly
    }
  }

  calculateTotalDeduction() {
    const rmd = parseFloat(this.AssistantForm.get('rmd')?.value || '0');
    const labourFund = parseFloat(this.AssistantForm.get('labourFund')?.value || '0');
    const it = parseFloat(this.AssistantForm.get('it')?.value || '0');
    const ec = parseFloat(this.AssistantForm.get('ec')?.value || '0');
    const sgst = parseFloat(this.AssistantForm.get('sgst')?.value || '0');
    const cgst = parseFloat(this.AssistantForm.get('cgst')?.value || '0');
    const steelRecovery = parseFloat(this.AssistantForm.get('steelRecovery')?.value || '0');
    const mobilization = parseFloat(this.AssistantForm.get('mobilization')?.value || '0');
    const withheldAmount = parseFloat(this.AssistantForm.get('withheldAmount')?.value || '0');
    const eotfine = parseFloat(this.AssistantForm.get('eotfine')?.value || '0');
    const otherRecoveries = parseFloat(this.AssistantForm.get('otherRecoveries')?.value || '0');

    let totalDeduction = rmd + labourFund + it + ec + sgst + cgst + steelRecovery + mobilization + withheldAmount + eotfine + otherRecoveries;
    totalDeduction = parseFloat(totalDeduction.toFixed(2));

    this.AssistantForm.get('totalDeduction')?.setValue(totalDeduction);

    let netTotal = this.AssistantForm.get('baseValue')?.value - this.AssistantForm.get('totalDeduction')?.value;
    netTotal = parseFloat(netTotal.toFixed(2));
    this.AssistantForm.get('netTotal')?.setValue(netTotal);

    const valueOfWorkDoneAsReportedByAE = this.AssistantForm.get('valueOfWorkDoneAsReportedByAE')?.value;
    this.DivisionalAccountantForm.get('billPassedFor')?.setValue(valueOfWorkDoneAsReportedByAE);
    this.DivisionalAccountantForm.get('billPayFor')?.setValue(netTotal);

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
    const dateOfCommencement = new Date(this.AEpart1Form.get('dateOfCommencement')?.value);
    const dueDateOfCompletion = new Date(this.AEpart1Form.get('dueDateOfCompletion')?.value);
    const actualDateOfCompletion = new Date(this.AEpart1Form.get('actualDateOfCompletion')?.value);

    if (dateOfCommencement && dueDateOfCompletion && actualDateOfCompletion) {
      const totalDays = dateOfCommencement.getTime() - dueDateOfCompletion.getTime();
      const totalDaysBetween = Math.floor(totalDays / (1000 * 60 * 60 * 24));
      const totalDaysTaken = dateOfCommencement.getTime() - actualDateOfCompletion.getTime();
      const totalDaysTakenBetween = Math.floor(totalDaysTaken / (1000 * 60 * 60 * 24));
      const physicalAchievement = ((totalDaysTakenBetween / totalDaysBetween) * 100).toFixed(2);
      const cappedAchievement = Math.min(parseFloat(physicalAchievement), 100).toFixed(2);
      this.AEpart2Form.get('physicalAchievement')?.setValue(cappedAchievement);
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
          "Value of work done": this.viewModel.valueOfWorkDoneAsReportedByAE,
          "Corrected Value": this.viewModel.correctedValue,
          "GST Percentage": this.viewModel.gst_Percentage,
          "GST Amount": this.viewModel.gstamount,
          "Base value": this.viewModel.baseValue,
          "RMD 5%": this.viewModel.rmd,
          "IT 2%": this.viewModel.it,
          "EC 0.066%": this.viewModel.ec,
          "SGST 1%": this.viewModel.sgst,
          "CGST 1%": this.viewModel.cgst,
          "Steel Recovery": this.viewModel.steelRecovery,
          "Mobilization": this.viewModel.mobilization,
          "Withheld amount": this.viewModel.withheldAmount,
          "EOT fine": this.viewModel.eotfine,
          "Other Recoveries (if any)": this.viewModel.otherRecoveries,
          "Total Deduction": this.viewModel.totalDeduction,
          "Net Total": this.viewModel.netTotal,
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
        "Value of work done": this.viewModel.valueOfWorkDoneAsReportedByAE,
        "Corrected Value": this.viewModel.correctedValue,
        "GST Percentage": this.viewModel.gst_Percentage,
        "GST Amount": this.viewModel.gstamount,
        "Base value": this.viewModel.baseValue,
        "RMD 5%": this.viewModel.rmd,
        "IT 2%": this.viewModel.it,
        "EC 0.066%": this.viewModel.ec,
        "SGST 1%": this.viewModel.sgst,
        "CGST 1%": this.viewModel.cgst,
        "Steel Recovery": this.viewModel.steelRecovery,
        "Mobilization": this.viewModel.mobilization,
        "Withheld amount": this.viewModel.withheldAmount,
        "EOT fine": this.viewModel.eotfine,
        "Other Recoveries (if any)": this.viewModel.otherRecoveries,
        "Total Deduction": this.viewModel.totalDeduction,
        "Net Total": this.viewModel.netTotal,
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

}
