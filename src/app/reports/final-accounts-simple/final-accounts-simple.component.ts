import { Component, OnInit, ViewChild } from '@angular/core';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FinalAccountsSimpleService } from 'src/app/services/final-accounts-simple.service';
import { GlobalConstants } from '../../global/global-constants';
import * as FileSaver from 'file-saver';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'



@Component({
  selector: 'app-final-accounts-simple',
  templateUrl: './final-accounts-simple.component.html',
  styleUrls: ['./final-accounts-simple.component.css'],
  providers: [ConfirmationService,MessageService]  
})
export class FinalAccountsSimpleComponent implements OnInit {

  today: number = Date.now();
  _invSub:any
  inProgress:boolean = false

  finalAccounts:any[] = []

  exportColumns:any[] = [];

  @ViewChild('dt') exports: any;
  

  constructor(private datePipe: DatePipe,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.exportColumns = [
      { title: '', dataKey: 'title' },
      { title: 'Amount', dataKey: 'amount' }
      
    ];
    this.loadFinalAccounts()
  }
  
  loadFinalAccounts() {
    this.inProgress = true
    let ahlService:FinalAccountsSimpleService = new FinalAccountsSimpleService(this.httpClient)
    let criteria:any = {}
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchFinalAccountsSimple(criteria).subscribe({
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
        else if(v.hasOwnProperty('detailed')) {
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

  onRowSelect(event:any) {
    
  }

  processFinalAccounts(fa:any) {

    let fromdate = fa.detailed.fromdate
    let todate = fa.detailed.todate

    if (todate == '\'infinity\'') {
      console.log('YES YES')
      todate = '2022-11-30T17:00:00Z'
    }

    let a:any = {}
    let s = "Profit or Loss for the period "+this.datePipe.transform(fromdate)+" to "+ this.datePipe.transform(todate);
    a["title"] = s
    a["amount"] = ""

    this.finalAccounts.push(JSON.parse(JSON.stringify(a)))

    let empty:any = {} 
    empty["title"] = ""
    empty["amount"] = ""
    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))

    for (let index = 0; index < fa.detailed.opscreditrows.length; index++) {
      const element = fa.detailed.opscreditrows[index];
      let newElement:any = this.formattedNumber(element)
      this.finalAccounts.push(JSON.parse(JSON.stringify(newElement)))
      
    }

    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))

    

    for (let index = 0; index < fa.detailed.opsdebitrows.length; index++) {
      const element = fa.detailed.opsdebitrows[index];
      let newElement:any = this.formattedNumber(element)
      this.finalAccounts.push(JSON.parse(JSON.stringify(newElement)))
      
    }

    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))
    

    let pl:any = fa.detailed.profitloss
    let plElement:any = this.formattedNumber(pl[0])
    this.finalAccounts.push(plElement)


    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))
    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))

    s = "BALANCE SHEET AS AT "+ this.datePipe.transform(todate);
    a["title"] = s
    a["amount"] = ""
    this.finalAccounts.push(JSON.parse(JSON.stringify(a)))

    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))

    for (let index = 0; index < fa.detailed.assetrows.length; index++) {
      const element = fa.detailed.assetrows[index];
      let newElement:any = this.formattedNumber(element)
      this.finalAccounts.push(JSON.parse(JSON.stringify(newElement)))
      
    }

    this.finalAccounts.push(JSON.parse(JSON.stringify(empty)))

    for (let index = 0; index < fa.detailed.liabilityrows.length; index++) {
      const element = fa.detailed.liabilityrows[index];
      let newElement:any = this.formattedNumber(element)
      this.finalAccounts.push(JSON.parse(JSON.stringify(newElement)))
      
    }

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
    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Statement of operations and balance sheet';
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    autoTable(doc,{
      columns: this.exportColumns, 
      body:this.finalAccounts,
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
