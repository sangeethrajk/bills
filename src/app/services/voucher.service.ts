import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VoucherService {

    generateVoucherNumber(): string {
        // Implement your voucher number generation logic here
        const randomPart = Math.floor(Math.random() * 10000).toString().padStart(6, '0');
        const currentDate = new Date();
        const datePart = currentDate.getFullYear().toString().slice(-2) +
            (currentDate.getMonth() + 1).toString().padStart(2, '0') +
            currentDate.getDate().toString().padStart(2, '0');

        return 'TNHB' + datePart + randomPart;
    }
}
