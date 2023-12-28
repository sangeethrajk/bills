import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { BillsService } from '../../services/bills.service';

@Component({
  selector: 'app-reviewed-application',
  templateUrl: './reviewed-application.component.html',
  styleUrl: './reviewed-application.component.css'
})
export class ReviewedApplicationComponent {

  role = sessionStorage.getItem('role')!
  showAE: boolean = false;
  showAEE: boolean = false;
  showEE: boolean = false;
  showEEstage2: boolean = false;
  showAssistant: boolean = false;
  showDA: boolean = false;
  statusofEE: any;


  panelOpenState = false;

  applicationForm!: FormGroup;
  AEpart1Form!: FormGroup;
  AEpart2Form!: FormGroup;
  AEpart3Form!: FormGroup;
  AEEForm!: FormGroup;
  EEForm!: FormGroup;
  DivisionalAccountantForm!: FormGroup;
  EEForm1!: FormGroup;
  AssistantForm!: FormGroup;
  saveModel: any;
  id: any;
  fileurl: any;

  revieweddate: any
  viewModel: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private apiService: BillsService) { }

  ngOnInit() {

    if (this.role == "AE") {
      this.showAE = true;
    }
    if (this.role == "AEE") {
      this.showAEE = true;
    }

    if (this.role == "Assistant") {
      this.showAssistant = true;
    }
    if (this.role == "DA") {
      this.showDA = true;
    }

    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.applicationForm = this.formBuilder.group({
      nameOfWork: [''],
      nameOfContractor: [''],
      estimateNo: [''],
      division: [''],
      applieddate: [''],
      fileurl: this.fileurl
    });

    this.AEpart1Form = this.formBuilder.group({
      nameOfWork: [''],
      nameOfContractor: [''],
      estimateNo: [''],
      mainAgreementNo: [''],
      mainAgreementValue: [null],
      wc79OrderNo: [''],
      wc79OrderDate: [''],
      wc79OrderValue: [null],
      supplementAgreementNo: [''],
      supplementAgreementValue: [null],
      totalValue: [{ value: null }],
      dateOfCommencement: [''],
      dueDateOfCompletion: [''],
      actualDateOfCompletion: [''],
      finalBillCompletionReportEnclosed: [''],
      // value: [''],
    });

    this.AEpart2Form = this.formBuilder.group({
      partIIDateOfMeasurement: [''],
      dateOfCheckMeasurement: [''],
      physicalAchievement: [{ value: null }],
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
      allWorksCheckedByAEE: [''],
      computerizedMeasurementBookSubmitted: [''],
      preMeasurementsTaken: [''],
      actionTakenToRegularizeExcess: ['']
    });

    this.AEpart3Form = this.formBuilder.group({
      valueOfAgreement: [''],
      amountReleasedUptoPreviousBill: [''],
      balance: [''],
      amountRaisedInThisBill: [''],
      certificate: [''],
      signatureWithDate: [''],
    });

    this.AEEForm = this.formBuilder.group({
      dateOfCheckMeasurement: [''],
      certificate: [''],
      signatureWithDate: [''],
    })

    this.EEForm = this.formBuilder.group({
      dateOfCheckMeasurement: [''],
      certificate: [''],
      signatureWithDate: ['']
    })

    this.DivisionalAccountantForm = this.formBuilder.group({

      certificate: [''],
      billPassedFor: [''],
      billPayFor: [''],
      signatureWithDate: ['']

    })

    this.EEForm1 = this.formBuilder.group({
      billPassedFor: [''],
      billPayFor: [''],
      signatureWithDate: ['']

    })

    this.AssistantForm = this.formBuilder.group({
      valueOfWorkDoneAsReportedByAEAEE: [''],
      correctedValue: [''],
      gst_Percentage: [''],
      gstamount: [''],
      baseValue: [''],
      rmd: [null],
      it: [null],
      ec: [null],
      sgst: [null],
      cgst: [null],
      steelRecovery: [''],
      mobilization: [''],
      withheldAmount: [''],
      eotfine: [''],
      otherRecoveries: [''],
      totalDeduction: [0],
      netTotal: [''],
      dplpageNo: [''],
      dpldate: [''],
      billRegisterPageNo: [''],
      billRegisterDate: [''],
    })

    this.apiService.getapplbyid(this.id).subscribe(response => {
      console.log(response.data)
      this.viewModel = response.data.bill[0];
      this.fileurl = this.viewModel.fileurl
      this.statusofEE = this.viewModel.status;
      if (this.role == "EE") {
        // this.statusofEE=this.viewModel.status
        if (this.statusofEE == "Approved by EE") { this.showEE = true; this.showEEstage2 = false }
        else { this.showEEstage2 = true; this.showEE = false; }
      }

      this.applicationForm.patchValue({
        nameOfWork: this.viewModel.nameOfWork,
        nameOfContractor: this.viewModel.nameOfContractor,
        estimateNo: this.viewModel.estimateNo,
        division: this.viewModel.division
      })

      this.AEpart1Form.patchValue({
        nameOfWork: this.viewModel.nameOfWork,
        nameOfContractor: this.viewModel.nameOfContractor,
        estimateNo: this.viewModel.estimateNo,
        mainAgreementNo: this.viewModel.mainAgreementNo,
        mainAgreementValue: this.viewModel.mainAgreementValue,
        value: this.viewModel.value,
        wc79OrderNo: this.viewModel.wc79OrderNo,
        wc79OrderDate: this.viewModel.wc79OrderDate,
        wc79OrderValue: this.viewModel.wc79OrderValue,
        supplementAgreementNo: this.viewModel.supplementAgreementNo,
        supplementAgreementValue: this.viewModel.supplementAgreementValue,
        totalValue: this.viewModel.totalValue,
        dateOfCommencement: this.viewModel.dateOfCommencement,
        dueDateOfCompletion: this.viewModel.dueDateOfCompletion,
        actualDateOfCompletion: this.viewModel.actualDateOfCompletion,
        finalBillCompletionReportEnclosed: this.viewModel.finalBillCompletionReportEnclosed,

      });


      this.AEpart2Form.patchValue({
        partIIDateOfMeasurement: this.viewModel.partIIDateOfMeasurement,
        dateOfCheckMeasurement: this.viewModel.dateOfCheckMeasurement,
        workCarriedOutAtSpecifiedRateOfSpeed: this.viewModel.workCarriedOutAtSpecifiedRateOfSpeed,
        extensionOfTimeDate: this.viewModel.extensionOfTimeDate,
        extensionOfTimeOrderNo: this.viewModel.extensionOfTimeOrderNo,
        extensionOfTimeFineAmount: this.viewModel.extensionOfTimeFineAmount,
        liquidatedDamagesOrLumpSumFine: this.viewModel.liquidatedDamagesOrLumpSumFine,
        itemsCoveredInAgreement: this.viewModel.itemsCoveredInAgreement,
        quantitiesInBillAsPerEstimate: this.viewModel.quantitiesInBillAsPerEstimate,
        itemsOmittedOrPartlyDone: this.viewModel.itemsOmittedOrPartlyDone,
        partRatePaidInAgreement: this.viewModel.partRatePaidInAgreement,
        allWorksCheckedByAEE: this.viewModel.allWorksCheckedByAEE,
        computerizedMeasurementBookSubmitted: this.viewModel.computerizedMeasurementBookSubmitted,
        preMeasurementsTaken: this.viewModel.preMeasurementsTaken,
        physicalAchievement: this.viewModel.physicalAchievement,
        actualPercentage: this.viewModel.actualPercentage,
        extensionOfTime: this.viewModel.extensionOfTime,
        actionTakenToRegularizeExcess: this.viewModel.actionTakenToRegularizeExcess
      });


      this.AEpart3Form.patchValue({
        valueOfAgreement: this.viewModel.valueOfAgreement,
        amountReleasedUptoPreviousBill: this.viewModel.amountReleasedUptoPreviousBill,
        balance: this.viewModel.balance,
        amountRaisedInThisBill: this.viewModel.amountRaisedInThisBill,

      });

      this.AssistantForm.patchValue({
        valueOfWorkDoneAsReportedByAEAEE: this.viewModel.valueOfWorkDoneAsReportedByAEAEE,
        correctedValue: this.viewModel.correctedValue,
        gst_Percentage: this.viewModel.gst_Percentage,
        gstamount: this.viewModel.gstamount,
        eotfine: this.viewModel.eotfine,
        rmd: this.viewModel.rmd,
        it: this.viewModel.it,
        ec: this.viewModel.ec,
        sgst: this.viewModel.sgst,
        cgst: this.viewModel.cgst,
        dplpageNo: this.viewModel.dplpageNo,
        dpldate: this.viewModel.dpldate,
        baseValue: this.viewModel.baseValue,
        lessGST12: this.viewModel.lessGST12,
        lessGST18: this.viewModel.lessGST18,
        steelRecovery: this.viewModel.steelRecovery,
        mobilization: this.viewModel.mobilization,
        withheldAmount: this.viewModel.withheldAmount,
        otherRecoveries: this.viewModel.otherRecoveries,
        totalDeduction: this.viewModel.totalDeduction,
        netTotal: this.viewModel.netTotal,
        billRegisterPageNo: this.viewModel.billRegisterPageNo,
        billRegisterDate: this.viewModel.billRegisterDate,
      });
      console.log("AssisForm", this.AssistantForm)

      const billauthor = response.data.billAuthorization;

      for (const item of billauthor) {
        const roleoftheofficer = item.roleOfTheOfficer;
        const officerModel = item;

        switch (roleoftheofficer) {
          case 'AE':
            console.log(officerModel);
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
            if (this.viewModel.status == "Approved by EE") {
              console.log(officerModel);
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
            if (this.viewModel.pendingWith == "Submitted") {

              this.EEForm.patchValue({
                dateOfCheckMeasurement: officerModel.dateOfCheckMeasurement,
                certificate: officerModel.certificate,
                signatureWithDate: officerModel.signatureWithDate
              });
              this.EEForm1.patchValue({
                billPassedFor: officerModel.billPassedFor,
                billPayFor: officerModel.billPayFor,
                signatureWithDate: officerModel.signatureWithDate
              });
              this.revieweddate = officerModel.approvalDate;
            }
            break;

          case 'DA':
            this.DivisionalAccountantForm.patchValue({
              billPassedFor: officerModel.billPassedFor,
              billPayFor: officerModel.billPayFor,
              signatureWithDate: officerModel.signatureWithDate,
              certificate: officerModel.certificate
            });
            this.revieweddate = officerModel.approvalDate;
            break;
          case 'Assistant':

            this.revieweddate = "2023-09-16";
            break;


          default:

            break;
        }
      }
    }, error => {
      console.error(error);
    });

  }
  openFile(filePath: string): string {
    return 'file://' + filePath.replace(/\\/g, '/');
  }


  generatePDF() {
    let AEpart1Form = {};
    let AEpart2Form = {};
    let AEpart3Form = {};
    let AEEForm = {};
    let EEForm = {};
    let AssistantForm = {};
    let DAForm = {};
    let EEForm1 = {};

    if (this.role == "AE") {

      AEpart1Form = {
        "Name of work": this.viewModel.nameOfWork,
        "Name of Contractor": this.viewModel.nameOfContractor,
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

    } else if (this.role == "AEE") {

      AEpart1Form = {
        "Name of work": this.viewModel.nameOfWork,
        "Name of Contractor": this.viewModel.nameOfContractor,
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

    } else if (this.role == 'EE') {

      if (this.statusofEE == "Approved by AEE") {
        AEpart1Form = {
          "Name of work": this.viewModel.nameOfWork,
          "Name of Contractor": this.viewModel.nameOfContractor,
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
      } else {
        AEpart1Form = {
          "Name of work": this.viewModel.nameOfWork,
          "Name of Contractor": this.viewModel.nameOfContractor,
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
          "Value of work done": this.viewModel.valueOfWorkDoneAsReportedByAEAEE,
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

        EEForm1 = {
          "Bill passed for": this.EEForm1.get('billPassedFor')?.value,
          "Bill pay for": this.EEForm1.get('billPayFor')?.value,
          "Signature": this.EEForm1.get('signatureWithDate')?.value,
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

        const EE1Columns = ['Executive Engineer Revert', ''];
        const EE1Rows: any[][] = [];

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

        const EE1FormArray = Object.entries(EEForm);
        EE1FormArray.forEach(([key, value]) => {
          EE1Rows.push([key, value]);
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

        autoTable(doc, {
          head: [EE1Columns],
          body: EE1Rows,
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
        "Name of work": this.viewModel.nameOfWork,
        "Name of Contractor": this.viewModel.nameOfContractor,
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
        "Value of work done": this.viewModel.valueOfWorkDoneAsReportedByAEAEE,
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

    } else if (this.role == "DA") {

      AEpart1Form = {
        "Name of work": this.viewModel.nameOfWork,
        "Name of Contractor": this.viewModel.nameOfContractor,
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
        "Value of work done": this.viewModel.valueOfWorkDoneAsReportedByAEAEE,
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


  }
}
