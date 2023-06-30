import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StockBalanceRegisterService } from 'src/app/services/stock-balance-register.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import {ConfirmationService,MessageService} from 'primeng/api';
import { StockBalanceItemService } from 'src/app/services/stock-balance-item.service';
import { StockBalanceItemForReportService } from 'src/app/services/stock-balance-item-for-report.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { DatePipe } from '@angular/common';
import { GlobalConstants } from '../../global/global-constants';
import * as FileSaver from 'file-saver';



@Component({
  selector: 'app-stock-balance-register',
  templateUrl: './stock-balance-register.component.html',
  styleUrls: ['./stock-balance-register.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class StockBalanceRegisterComponent implements OnInit {


  stockList:any[] = []
  //printList:any[] = []
  inProgress:boolean = false

  private _invSub:any

  today: number = Date.now();

  displayViewDetailModal:boolean = false;

  stockDetailList:any[] = []

  private _sbSub:any

  selectedItem:any = {
    'item':'',
    'uom':''
  }

  exportColumns:any[] = [];

  @ViewChild('dt') exports: any;

  

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.exportColumns = [
      { title: 'ID', dataKey: 'id' },
      { title: 'Item', dataKey: 'item' },
      { title: 'UOM', dataKey: 'uom' },
      { title: 'Quantity', dataKey: 'quantity'},
      { title: 'Reorder', dataKey: 'reorder'},
      { title: 'Status', dataKey: 'status'}
      
    ]; 

    this.loadStockBalances(0,0)
  }



  loadStockBalances(offset:number,moreoffset:number) {
    
    this.inProgress = true
    
    let ahlService:StockBalanceRegisterService = new StockBalanceRegisterService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchStockBalanceRegister(criteria).subscribe({
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
          
          this.stockList = []
          this.stockList = dataSuccess.success

          

          for (let index = 0; index < this.stockList.length; index++) {
            const element = this.stockList[index];
            element.quantity = parseFloat(element.quantity)
            element.quantity = parseFloat(element.quantity.toFixed(2))
            
            element["reorder"] = element.itemdetail.reorderquantity

            let ro = parseFloat(element.itemdetail.reorderquantity)
            
            if (element.quantity > ro) {
              element["status"] = "ok"
            }
            if (element.quantity <= ro) {
              element["status"] = "reorder"
            }
           
            
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


  handleView(item:any) {
    this.selectedItem = item
    this.loadStockDetailBalance(item.id)
  }

  onRowSelect(event:any) {
    
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

  
  sampleInvoicePdf() {
    const doc: jsPDF = new jsPDF("p", "pt", "a4")

    // doc.setTextColor("#42d254");
    // doc.setDrawColor(150,150,150);
    // doc.cell(100, 40, 100, 200, "cell",10,"center");

    doc.line(20, 20, 60, 20); // horizontal line
    doc.setLineWidth(1);
    doc.line(20, 21, 60, 21);
    doc.output("dataurlnewwindow")

  }
  

  newExportPdf() {
    //console.log('PRINT LIST',this.printList)
    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");

    let b = 'Closing Stock as on ' + datePipe.transform(this.today,'fullDate');
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    autoTable(doc,{
      columns: this.exportColumns, 
      body:this.stockList,
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


  exportPDFHtml() {
    const doc = new jsPDF('p', 'pt', 'letter');

    const content = this.exports.nativeElement;

    console.log(content)

    const margins = {
      top: 80,
      bottom: 60,
      left: 40,
      width: 522
    };
    console.log(doc);
 //   setTimeout(() => { ** REMOVE **
      (doc as any).fromHTML(content, margins.left, margins.top, {}, function () {
        doc.output("dataurlnewwindow",{filename: "export.pdf"}); 
        //doc.save("export.pdf");
      }, margins);

  }


  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.stockList);
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


  loadStockDetailBalance(itemid:any) {

    this.inProgress = true

    console.log('IN STOCK DETAIL BALANCES')
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {id:itemid};
    console.log('CRITERIA',criteria)
    let iService:StockBalanceItemForReportService = new StockBalanceItemForReportService(this.httpClient)
    this._sbSub = iService.fetchStockBalance(criteria).subscribe({
      complete: () => {
        console.info('complete')
      },
      error: (e) => {
        console.log('ERROR',e)
        alert('A server error occured. '+e.message)
        return;
      },
      next: (v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          alert(dataError.error);
          this.inProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.stockDetailList = dataSuccess.success;

          for (let index = 0; index < this.stockDetailList.length; index++) {
            const element = this.stockDetailList[index];
            element.balance = parseFloat(element.balance.toFixed(2))
          }
          console.log('STOCK BALANCES',this.stockDetailList)

          this.displayViewDetailModal = true
          this.inProgress = false
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          this.inProgress = false
          return;
        }
        else {
          this.inProgress = false
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }


}
