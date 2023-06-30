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
import { UltimateFinalAccountsService } from 'src/app/services/ultimate-final-accounts.service';

import { ReplaceZeroWithEmptyForCSPipe } from 'src/app/pipes/replace-zero-with-empty-for-cs.pipe';

@Component({
  selector: 'app-new-final-accounts',
  templateUrl: './new-final-accounts.component.html',
  styleUrls: ['./new-final-accounts.component.css'],
  providers: [ConfirmationService,MessageService,ReplaceZeroWithEmptyForCSPipe]
})
export class NewFinalAccountsComponent implements OnInit {

  selectedFromDate:any
  selectedToDate:any

  fromDateString:any
  toDateString:any

  finalAccounts:any[] = []

  inProgress:boolean = false

  _invSub:any

  exportColumns:any[] = [];

  

  debtorsDisplayModal:boolean = false
  debtorsDetail:any
  viewDebtorsTotal:number = 0

  creditorsDisplayModal:boolean = false
  creditorsDetail:any
  viewCreditorsTotal:number = 0

  closingStockDetail:any
  closingStockDisplayModal:boolean = false
  viewClosingStockTotal:number = 0


  constructor(private replZero: ReplaceZeroWithEmptyForCSPipe, private datePipe: DatePipe,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.exportColumns = [
      { title: '', dataKey: 'title' },
      { title: '', dataKey: 'subamount' },
      { title: '', dataKey: 'amount'} 
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

  showLink(e:any) {
    e.preventDefault()
    console.log('E LINK',e.target.textContent)

    if (e.target.textContent === '1') {
      this.debtorsDisplayModal = true
    }
    else if(e.target.textContent === '2') {
      this.creditorsDisplayModal = true
    }
    else if(e.target.textContent === '3') {
      this.closingStockDisplayModal = true
    }

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
    let ahlService:UltimateFinalAccountsService = new UltimateFinalAccountsService(this.httpClient)
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


  processFinalAccounts(unprocessedData:any) {

    this.finalAccounts = []

    let fromdate = unprocessedData.detailed.fromdate
    let todate = unprocessedData.detailed.todate

    let s = "Trading A/c for the period "+this.datePipe.transform(fromdate)+" to "+ this.datePipe.transform(todate);
    console.log('DATE PIPE',s)

    let a:any = {}
    //a["title"] = "Trading A/c for the period"
    a["title"] = s
    
    
    this.finalAccounts.push(a)

    let empty:any = {} 
    empty["title"] = ""
    
    // empty["amount"] = ""

    //this.finalAccounts.push(empty)

    

    let trdrows:any[] = unprocessedData.detailed.tradingdebitrows

    for (let index = 0; index < trdrows.length; index++) {
      const element = trdrows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["amount"] = this.formatNumber(element.debit)
      
      this.finalAccounts.push(c)
    }

    //this.finalAccounts.push(empty)

    let trcrows:any[] = unprocessedData.detailed.tradingcreditrows

    for (let index = 0; index < trcrows.length; index++) {
      const element = trcrows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["amount"] = this.formatNumber(element.credit)
      
      this.finalAccounts.push(c)
    }
    
    
    this.finalAccounts.push(empty)
    //this.finalAccounts.push(empty)

    let pl:any = {}
    pl["title"] = "Profit & Loss A/c for the period "+this.datePipe.transform(fromdate)+" to "+ this.datePipe.transform(todate)
    
    
    this.finalAccounts.push(pl)

    this.finalAccounts.push(empty)

    let pldrows:any[] = unprocessedData.detailed.pldebitrows

    for (let index = 0; index < pldrows.length; index++) {
      const element = pldrows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["amount"] = this.formatNumber(element.debit)
      
      this.finalAccounts.push(c)
    }


    this.finalAccounts.push(empty)

    let plcrows:any[] = unprocessedData.detailed.plcreditrows

    for (let index = 0; index < plcrows.length; index++) {
      const element = plcrows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["amount"] = this.formatNumber(element.credit)
      
      this.finalAccounts.push(c)
    }



    this.finalAccounts.push(empty)
    //this.finalAccounts.push(empty)

    let bs:any = {}
    bs["title"] = "Balance Sheet as at "+ this.datePipe.transform(todate)
    
    
    this.finalAccounts.push(bs)

    //this.finalAccounts.push(empty)

    let at:any = {}
    at["title"] = "ASSETS"
    
    this.finalAccounts.push(at)

    let barows:any[] = unprocessedData.detailed.assetrows

    for (let index = 0; index < barows.length; index++) {
      const element = barows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["subamount"] = this.formatNumber(element.subamount)
      c["amount"] = this.formatNumber(element.debit)

      if (c["title"] == 'Sundry Debtors') {
        c["annex"] = "1"
        this.debtorsDetail = unprocessedData.assetannexfinal.party

        for (let index = 0; index < this.debtorsDetail.length; index++) {
          const element = this.debtorsDetail[index];
          this.viewDebtorsTotal = this.viewDebtorsTotal + element.debit
        }
      }

      else if (c["title"] == 'Closing Stock') {
        c["annex"] = "3"
        this.closingStockDetail = unprocessedData.csannexfinal

        for (let index = 0; index < this.closingStockDetail.length; index++) {
          const element = this.closingStockDetail[index];
          this.viewClosingStockTotal = this.viewClosingStockTotal + (element.sum * element.org)
        }
      }
      
      

      this.finalAccounts.push(c)
    }


    this.finalAccounts.push(empty)


    let lt:any = {}
    lt["title"] = "LIABILITIES"
    
    this.finalAccounts.push(lt)

    let blrows:any[] = unprocessedData.detailed.liabilityrows

    for (let index = 0; index < blrows.length; index++) {
      const element = blrows[index];
      let c:any = {}
      c["title"] = element.accounthead
      c["subamount"] = this.formatNumber(element.subamount)
      c["amount"] = this.formatNumber(element.credit)

      if (c["title"] == 'Sundry Creditors') {
        c["annex"] = "2"
        this.creditorsDetail = unprocessedData.liabiannexfinal.party

        for (let index = 0; index < this.creditorsDetail.length; index++) {
          const element = this.creditorsDetail[index];
          this.viewCreditorsTotal = this.viewCreditorsTotal + element.credit
        }
      }
      
      this.finalAccounts.push(c)
    }

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
    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Statement of operations and balance sheet';
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    let fa:any = JSON.parse(JSON.stringify(this.finalAccounts))

    let formattedBody = fa.map((item:any) => {
      item.subamount = this.replZero.transform(item.subamount,'')
      item.amount = this.replZero.transform(item.amount,'')
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
      subamount: { halign: 'right' },
      amount: { halign: 'right' }
      }
    });
    //doc.save('stockregister.pdf');
    doc.output("dataurlnewwindow")
  }


  

}
