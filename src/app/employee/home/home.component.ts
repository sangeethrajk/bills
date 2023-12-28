import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BillsService } from '../../services/bills.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  allBillsLength: any;
  reviewedBillsLength: any;
  pendingBillsLength: any;
  totalBillsLength: any;
  role = sessionStorage.getItem('role')!
  username = sessionStorage.getItem('username')!
  hidemenu: boolean = false

  constructor(private billService: BillsService) { }

  ngOnInit(): void {
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload');
    //   location.reload();
    // } else {
    //   localStorage.removeItem('foo')
    // }

    if (this.role === "AE") {
      this.hidemenu = true
    }

    this.getAllBills();
    this.getReviewedBills();
    this.getPendingBills();
    this.getTotalBills();

  }

  getAllBills() {
    this.billService.getAll(0).subscribe(data => {

      if (Array.isArray(data.data.bill)) {
        const transformedData = data.data.bill
          .filter((item: { pendingWith: any, status: any }) => {
            if (this.role === "AEE" && item.pendingWith === "AE") {
              return true;
            } else if (this.role === "EE" && (item.pendingWith === "AE" || item.pendingWith === "AEE" || item.pendingWith === "Assistant" || item.pendingWith === "DA")) {
              return true;
            }
            else if (this.role === "Assistant" && (item.pendingWith === "AE" || item.pendingWith === "AEE" || item.pendingWith === "EE")) {
              return item.status !== "Approved by DA";
            }
            else if (this.role === "DA" && (item.pendingWith === "AE" || item.pendingWith === "AEE" || item.pendingWith === "EE" || item.pendingWith === "Assistant")) {
              return item.status !== "Approved by DA";
            }
            return false;
          })
          .map((index: number) => ({ slNo: index + 1 }));

        this.allBillsLength = transformedData.length;
      } else {
        console.error("API response is not an array.");
      }
    }, error => {
      console.error(error);
    });
  }

  getReviewedBills() {

    this.billService.getReviewedWith(this.role).subscribe(
      (response: any) => {
        const reviewedBills = response.data;
        this.reviewedBillsLength = reviewedBills.length;

      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPendingBills() {

    this.billService.getPendingWith(this.role).subscribe(
      (response: any) => {
        const pendingBills = response.data;
        this.pendingBillsLength = pendingBills.length;

      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  getTotalBills() {

    this.billService.getTotalBills(1).subscribe(
      (response: any) => {
        const totalBills = response.data;
        this.totalBillsLength = totalBills.length;

      },
      (error: any) => {
        console.log(error);
      }
    )
  }

}
