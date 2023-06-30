import { Component, OnInit } from '@angular/core';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../global/global-constants';
import * as FileSaver from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import * as moment from 'moment';
import { ReplaceZeroWithEmptyForCSPipe } from 'src/app/pipes/replace-zero-with-empty-for-cs.pipe';
import { PenultimateFinalAccountsService } from 'src/app/services/penultimate-final-accounts.service';


@Component({
  selector: 'app-penultimate-final-accounts',
  templateUrl: './penultimate-final-accounts.component.html',
  styleUrls: ['./penultimate-final-accounts.component.css'],
  providers: [ConfirmationService,MessageService,ReplaceZeroWithEmptyForCSPipe]
})
export class PenultimateFinalAccountsComponent implements OnInit {

  selectedFromDate:any
  selectedToDate:any

  fromDateString:any
  toDateString:any

  finalAccounts:any[] = []

  inProgress:boolean = false

  _invSub:any

  exportColumns:any[] = [];


  constructor(private replZero: ReplaceZeroWithEmptyForCSPipe, private datePipe: DatePipe,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.exportColumns = [
      { title: '', dataKey: 'dahid' },
      { title: '', dataKey: 'dac' },
      { title: '', dataKey: 'debit'},
      { title: '', dataKey: 'cahid'},
      { title: '', dataKey: 'cac'},
      { title: '', dataKey: 'credit'}
    ];
  }
  
  fromDateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.fromDateString = isoDateTime
    //this.selectedDate = isoDateTime
   
  }


  toDateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.toDateString = isoDateTime
    //this.selectedDate = isoDateTime
   
  }

  onRowSelect(event:any) {

  }

  getFinalAccounts() {


    if (this.selectedFromDate >= this.selectedToDate) {
      this.confirm('From date should be less than to date')
      return
   } 

    let criteria:any = {}
    criteria["timezone"] = GlobalConstants.loginObject.timezone
    criteria["fromdate"] = this.selectedFromDate
    criteria["todate"] = this.selectedToDate

    console.log('CRITERIA',JSON.stringify(criteria))

    this.loadFinalAccounts(criteria)

  }


  loadFinalAccounts(criteria:any) {
    this.inProgress = true
    let ahlService:PenultimateFinalAccountsService = new PenultimateFinalAccountsService(this.httpClient)
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchFinalAccounts(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return 
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v;
          console.log('DATAERROR',dataError.error) 
          this.confirm(dataError.error)
          this.inProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          let unprocessedData = dataSuccess
          console.log('FINAL ACCOUNTS',unprocessedData)
          this.processFinalAccounts(unprocessedData)
          this.inProgress = false
          return
        }
        else if(v == null) { 
          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
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





  processFinalAccounts(unprocessedData:any) {

    let empty:any = {} 

    this.finalAccounts = []
    
    let trdtitle:any = {
      'dahid':'TRADING ACCOUNT',
      'dac':'EXPENSES',
      'debit':0,
      'cahid':'',
      'cac':'REVENUE',
      'credit':0
    }

    this.finalAccounts.push(trdtitle)

    for (let index = 0; index < unprocessedData.success.trdlines.length; index++) {
      const element = unprocessedData.success.trdlines[index];
      this.finalAccounts.push(element)
    }

    this.finalAccounts.push(empty)
    this.finalAccounts.push(empty)

    let pltitle:any = {
      'dahid':'PROFIT OR LOSS ACCOUNT',
      'dac':'EXPENSES',
      'debit':0,
      'cahid':'',
      'cac':'REVENUE',
      'credit':0
    }

    this.finalAccounts.push(pltitle)

    for (let index = 0; index < unprocessedData.success.pandlines.length; index++) {
      const element = unprocessedData.success.pandlines[index];
      this.finalAccounts.push(element)
    }

    this.finalAccounts.push(empty)
    this.finalAccounts.push(empty)

    let bstitle:any = {
      'dahid':'BALANCE SHEET',
      'dac':'ASSETS',
      'debit':0,
      'cahid':'',
      'cac':'LIABILITIES',
      'credit':0
    }

    this.finalAccounts.push(bstitle)

    for (let index = 0; index < unprocessedData.success.bslines.length; index++) {
      const element = unprocessedData.success.bslines[index];
      this.finalAccounts.push(element)
    }


    

    console.log('FA',this.finalAccounts)

    

    

    let a:any = {}
    
    this.finalAccounts.push(a)

    
    
    
    

  }


  formatNumber(a:number)
  {
    return a.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
  }
  
  isInt(n:any) {
    return n % 1 === 0;
  }
  
  formattedNumber(ca:number) { 
    
    
    let a = ca.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
    const myArray = a.split(".");

    let obj:any = {}
    obj["integer"] = myArray[0]
    obj["fraction"] = "."+myArray[1]

    if (this.isInt(ca)){
      obj["showfraction"] = false
    }
    else if(!this.isInt(ca)) {
      obj["showfraction"] = true
    }

    obj["number"] = ca
    
    return obj

  }



  newExportPdf() {
    //console.log('PRINT LIST',this.printList) 

    

    const doc: jsPDF = new jsPDF("l", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Final Accounts for the period ' + datePipe.transform(this.selectedFromDate,'dd-MMM-yyyy hh:mm a') +' to ' + datePipe.transform(this.selectedToDate,'dd-MMM-yyyy hh:mm a');
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    let glpdf:any = JSON.parse(JSON.stringify(this.finalAccounts))

    let formattedBody = glpdf.map((item:any) => {
      // item.trdatetime = datePipe.transform(item.trdatetime, 'dd-MMM-yyyy hh:mm a');
      item.debit = this.replZero.transform(item.debit,'')
      item.credit = this.replZero.transform(item.credit,'')
      
      return item;
    });

    autoTable(doc,{
      columns: this.exportColumns, 
      body:formattedBody,
      didDrawPage: function (data) {
        doc.setFontSize(15)
        doc.setFont("helvetica","bold")
        doc.text(a, data.settings.margin.left + 0, 20);
        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.text(b, data.settings.margin.left + 0, 35)
        console.log('MARGINS',data.settings.margin);
      },
      margin: { top: 40 },
      theme: "grid",
      columnStyles: {
        debit: { halign: 'right' },
        credit: { halign: 'right' }
        }
    });
    //doc.save('stockregister.pdf');
    doc.output("dataurlnewwindow")
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.finalAccounts);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xls', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "products");
    });
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    //let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_TYPE = 'application/vnd.ms-excel;charset=utf-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION); 
  }



}
