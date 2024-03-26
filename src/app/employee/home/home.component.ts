import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BillsService } from '../../services/bills.service';
import Chart from 'chart.js/auto'

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
  role: any;
  username = sessionStorage.getItem('username')!
  hidemenu: boolean = false


  constructor(private billService: BillsService) { }

  ngOnInit(): void {

    this.role = sessionStorage.getItem('role');

    if (this.role === "AE") {
      this.hidemenu = true
    }

    this.chart();
  }

  chart() {
    const ctx = document.getElementById('allapplications') as HTMLCanvasElement;

    const data = {
      labels: [
        'Total Bills',
        'Pending Bills',
        'Reviewed Bills'
      ],
      datasets: [{
        label: 'Bills Overview',
        // data: [this.totalBillsLength, this.pendingBillsLength, this.reviewedBillsLength],
        data: [10, 7, 3],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    };

    new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        scales: {
          x: {
            display: false // Hide x-axis grid lines
          },
          y: {
            display: false // Hide y-axis grid lines
          }
        }
      }
    });
  }


}
