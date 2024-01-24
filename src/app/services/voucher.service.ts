import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VoucherService {

    generateVoucherNumber(division: any): string {
        // Remove spaces from the division
        const cleanedDivision = division.replace(/\s/g, '');

        // Implement your voucher number generation logic here
        const currentDate = new Date();
        const datePart = currentDate.getDate().toString().padStart(2, '0') +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') +
            currentDate.getFullYear().toString().slice(-2);  // Use last two digits of the year

        const hourMinutePart = currentDate.getHours().toString().padStart(2, '0') +
            currentDate.getMinutes().toString().padStart(2, '0');

        const randomPart = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        return 'TNHB' + '-' + datePart + '-' + hourMinutePart + '-' + cleanedDivision + '-' + randomPart;
    }
}
