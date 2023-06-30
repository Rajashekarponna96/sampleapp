import { Component, OnInit } from '@angular/core';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import {ConfirmationService,MessageService} from 'primeng/api';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../global/global-constants';
import * as FileSaver from 'file-saver';
import { ReplaceZeroWithEmptyForCSPipe } from 'src/app/pipes/replace-zero-with-empty-for-cs.pipe';
import { PurchaseinvoiceAgeingListService } from 'src/app/services/purchaseinvoice-ageing-list.service';





@Component({
  selector: 'app-purchase-invoice-ageing-list',
  templateUrl: './purchase-invoice-ageing-list.component.html',
  styleUrls: ['./purchase-invoice-ageing-list.component.css'],
  providers: [ConfirmationService,MessageService,ReplaceZeroWithEmptyForCSPipe]
})
export class PurchaseInvoiceAgeingListComponent implements OnInit {

  today: number = Date.now();

  invoiceList:any[] = []
  //printList:any[] = []
  inProgress:boolean = false

  offset:number = 0

  private _invSub:any

  exportColumns:any[] = [];

  

  constructor(private httpClient:HttpClient,private replZero:ReplaceZeroWithEmptyForCSPipe,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.exportColumns = [
      { title: 'Invoice', dataKey: 'invnum' },
      { title: 'Date', dataKey: 'trdatetime' },
      { title: 'Party', dataKey: 'partyname'},
      { title: 'Contact', dataKey: 'endpoint'},
      { title: 'Value', dataKey: 'credit'},
      { title: 'Paid', dataKey: 'paid'},
      { title: 'Payable', dataKey: 'payable'},
      { title: 'Days', dataKey: 'numdays'}
    ];
    this.loadSaleInvoiceAgeingList(0)  
  }

  loadSaleInvoiceAgeingList(offset:number) { 
    
    this.inProgress = true
    
    let ahlService:PurchaseinvoiceAgeingListService = new PurchaseinvoiceAgeingListService(this.httpClient)
    let criteria:any = {offset:offset};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchPurchaseInvoiceAgeingList(criteria).subscribe({
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
          
          //this.stockList = []
          //this.stockList = dataSuccess.success
          let newItems:any[] = dataSuccess.success
          for (let index = 0; index < newItems.length; index++) {
            const element = newItems[index];
            this.invoiceList.push(JSON.parse(JSON.stringify(element)))
          }
           
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

  newExportPdf() {
    //console.log('PRINT LIST',this.printList)
    const doc: jsPDF = new jsPDF("l", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Purchase Invoice Ageing List as on ' + datePipe.transform(this.today,'fullDate');
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    let glpdf:any = JSON.parse(JSON.stringify(this.invoiceList))

    let formattedBody = glpdf.map((item:any) => {
      item.trdatetime = datePipe.transform(item.trdatetime, 'dd-MMM-yyyy hh:mm a');
      item.credit = this.replZero.transform(item.credit,'')
      item.payable = this.replZero.transform(item.payable,'')
      item.paid = this.replZero.transform(item.paid,'')
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
        credit: { halign: 'right' },
        paid: { halign: 'right' },
        payable: {halign: 'right'}
        }
    });
    //doc.save('stockregister.pdf');
    doc.output("dataurlnewwindow")
  }


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.invoiceList);
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

  handleView(inv:any) {

  }

  getTotalAmount() {
    let totalAmount:number = 0
    for (let index = 0; index < this.invoiceList.length; index++) {
      const element = this.invoiceList[index];
      totalAmount = totalAmount + parseFloat(element.payable)
    }
    return totalAmount
  }

  onRowSelect(inv:any) {

  }

  
}
