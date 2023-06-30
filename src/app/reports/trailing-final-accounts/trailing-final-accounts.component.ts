import { Component, OnInit } from '@angular/core';
import { TrailingFinalAccountsService } from 'src/app/services/trailing-final-accounts.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/global/global-constants';
import * as FileSaver from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-trailing-final-accounts',
  templateUrl: './trailing-final-accounts.component.html',
  styleUrls: ['./trailing-final-accounts.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class TrailingFinalAccountsComponent implements OnInit {

  _invSub:any
  inProgress:boolean = false

  //finalAccounts:any

  //cols: any[] = [];

  //finaltrailing:any[] = []

  exportColumns:any[] = [];

  unprocessedData:any[] = [];

  constructor(private datePipe: DatePipe,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.exportColumns = [
      {title: '', dataKey: 'title'},
      {title: '', dataKey: 'a'},
      {title: '', dataKey: 'b'},
      {title: '', dataKey: 'c'},
      {title: '', dataKey: 'd'},
      {title: '', dataKey: 'e'},
      {title: '', dataKey: 'f'},
      {title: '', dataKey: 'g'},
      {title: '', dataKey: 'h'},
      {title: '', dataKey: 'i'},
      {title: '', dataKey: 'j'},
      {title: '', dataKey: 'k'},
      {title: '', dataKey: 'l'}
      
    ];
    this.loadTrailingFinalAccounts()
  }
  
  
  loadTrailingFinalAccounts() {
    this.inProgress = true
    let ahlService:TrailingFinalAccountsService = new TrailingFinalAccountsService(this.httpClient)
    let criteria:any = {}
    let loginObject = GlobalConstants.loginObject
    criteria["timezone"] = loginObject.timezone
    criteria["type"] = "month"
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchTrailingFinalAccounts(criteria).subscribe({
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
          this.confirm(dataError.error)
          this.inProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.unprocessedData = dataSuccess.success
          console.log('TRAILING FINAL ACCOUNTS',this.unprocessedData)
          
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



  




  isInt(n:any) {
    return n % 1 === 0;
  }
  
  formattedNumber(ca:any) {
    
    let n:number = ca.amount
    let a = n.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
    const myArray = a.split(".");

    ca["integer"] = myArray[0]
    ca["fraction"] = "."+myArray[1]

    if (this.isInt(n)){
      ca["showfraction"] = false
    }
    else if(!this.isInt(n)) {
      ca["showfraction"] = true
    }

    //ca["amount"] = n
    
    return ca

  }


  newExportPdf() {
    //console.log('PRINT LIST',this.printList)
    const doc: jsPDF = new jsPDF("landscape", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Trailing statement of operations and balance sheet';
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    autoTable(doc,{
      columns: this.exportColumns, 
      body:this.unprocessedData,
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
      theme: "grid"
    });
    //doc.save('stockregister.pdf');
    doc.output("dataurlnewwindow")
  }


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.unprocessedData);
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
