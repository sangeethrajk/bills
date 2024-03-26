import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-lc-format-content',
  templateUrl: './lc-format-content.component.html',
  styleUrl: './lc-format-content.component.css'
})
export class LcFormatContentComponent {

  @ViewChild('lcSection') lcSection!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  generateUniqueFileName() {
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons with dashes
    const randomChars = Math.random().toString(36).substring(7); // Generate random characters
    return `lc_${timestamp}_${randomChars}.pdf`;
  }

  generateLC() {
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
    });
  }

}
