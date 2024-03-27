import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { BillsService } from '../../services/bills.service';

@Component({
  selector: 'app-lc-format-content',
  templateUrl: './lc-format-content.component.html',
  styleUrls: ['./lc-format-content.component.css']
})
export class LcFormatContentComponent {

  @ViewChild('lcSection') lcSection!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private billsService: BillsService) { }

  generateUniqueFileName() {
    const now = new Date();
    const timestamp = now.toLocaleString().replace(/\/|,|:|\s/g, '-'); // Replace special characters with dashes
    const randomChars = Math.random().toString(36).substring(7); // Generate random characters
    return `lc_${timestamp}_${randomChars}.pdf`;
  }

  generateLC(id: any, email: any) {
    const data = this.lcSection.nativeElement;
    const fileName = this.generateUniqueFileName();

    html2canvas(data, { scale: 3 }).then(canvas => {
      const pdf = new jspdf('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate width and height based on A4 aspect ratio
      const width = pdfWidth * 0.8; // Adjust width if needed
      const ratio = canvas.height / canvas.width;
      const height = width * ratio; // Maintain aspect ratio

      const contentDataURL = canvas.toDataURL('image/png');

      // Adjust y position to position content closer to the top
      pdf.addImage(contentDataURL, 'PNG', (pdfWidth - width) / 2, 10, width, height);
      pdf.save(fileName);
      this.sendPdfToBackend(pdf.output('blob'), fileName, id, email); // Pass the blob instead of fileName
    });
  }

  sendPdfToBackend(fileBlob: Blob, fileName: string, id: any, email: any) {
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);
    formData.append('billId', id.toString());
    formData.append('billStatus', "Completed");
    formData.append('email', email);

    this.billsService.saveLCPdf(formData).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

}
