import { Component, OnInit } from '@angular/core';
import { LiquidityService } from '../services/liquidity.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { WeeklySalesService } from '../services/weekly-sales.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class DashboardComponent implements OnInit {

  basicData: any;

  basicOptions: any;

  weeklySalesData:any;

  weeklySalesOptions:any

  inLiquidityProgress:boolean = true

  private _invSub:any
  private _wnvSub:any

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { 

    this.basicData = {
      labels: ['Creditors', 'Debtors', 'Cash', 'Bank', 'Cheques'],
      datasets: [
          {
              label: '',
              backgroundColor: [
                '#EC407A',
                '#AB47BC',
                '#42A5F5',
                '#7E57C2',
                '#66BB6A',
                '#FFCA28',
                '#26A69A'
            ],
              data: [0, 0, 0, 0, 0]
          }
      ]
    };

  }

  ngOnInit(): void {
    this.loadLiquidityReport()
    this.loadWeeklyReport()
  }

  loadLiquidityReport() {

    this.inLiquidityProgress = true

    let ahlService:LiquidityService = new LiquidityService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchLiquidityReport(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inLiquidityProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inLiquidityProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          
          let report:any = dataSuccess.success
          let data:any[] = []
          data.push(report.creditors)
          data.push(report.debtors)
          data.push(report.cash)
          data.push(report.bank)
          data.push(report.cheques)
          


          this.basicData = {
            labels: ['Creditors', 'Debtors', 'Cash', 'Bank', 'Cheques'],
            datasets: [
                {
                    label: '',
                    backgroundColor: [
                      '#EC407A',
                      '#AB47BC',
                      '#42A5F5',
                      '#7E57C2',
                      '#66BB6A',
                      '#FFCA28',
                      '#26A69A'
                  ],
                    data: data
                }
            ]
          }

          this.inLiquidityProgress = false
          return
        }
        else if(v == null) { 
          this.inLiquidityProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inLiquidityProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })
  }




  confirm(msg:string) {
    this.confirmationService.confirm({
        header:'Error',
        message: msg,
        acceptVisible: true,
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
  }


  loadWeeklyReport() {

    this.inLiquidityProgress = true
    
    let ahlService:WeeklySalesService = new WeeklySalesService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._wnvSub = ahlService.fetchWeeklySales(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inLiquidityProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inLiquidityProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          
          let report:any = dataSuccess.success
          let data:any[] = []
          let labels:any[] = []

          for (let index = 0; index < report.length; index++) {
            const element = report[index];
            labels.push(element.weekly)
            data.push(element.credit)
          }
          
          this.weeklySalesData = {
            labels: labels,
            datasets: [
                
                {
                    label: 'Weekly Sales',
                    data: data,
                    fill: false,
                    borderColor: '#FFA726',
                    tension: .4
                }
            ]
        };
          


          

          this.inLiquidityProgress = false
          return
        }
        else if(v == null) { 
          this.inLiquidityProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inLiquidityProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })
  }

  



}
