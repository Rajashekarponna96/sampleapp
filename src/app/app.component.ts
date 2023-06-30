
import { Component, OnInit } from '@angular/core';
import { EventBusServiceService } from './global/event-bus-service.service';
import { GlobalConstants } from './global/global-constants';
import { ConsoleToggleService } from './services/console-toggle.service';

import { PeopleWithoutEndpointsServiceService } from './services/people-without-endpoints-service.service';
import { Search } from './services/search';

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { TestPDFService } from './services/test-pdf.service';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'xetadata';

  loggedOut:boolean = true;

  loginButton:any;

  inProgress:boolean = false;

  currentComponent:string = 'XetaProducts'
  //currentComponent:string = 'ContactsComponent'

  loginObject:any
  entityName:string = ''

  lo:any

  private _invSub:any
  
  people: any;

  constructor(private peopleService:PeopleWithoutEndpointsServiceService,private eventBusService:EventBusServiceService,private consoleToggleService: ConsoleToggleService,private httpClient:HttpClient) {
    this.consoleToggleService.disableConsoleInProduction();
  }

  sampleInvoicePdf() {
    const doc: jsPDF = new jsPDF("p", "pt", "a4")

    // doc.setTextColor("#42d254");
    // doc.setDrawColor(150,150,150);
    // doc.cell(100, 40, 100, 200, "cell",10,"center");

    let pageWidth = 595;

    console.log('DOC',doc);

    doc.setFontSize(20)
    doc.text("NewCo Trading",pageWidth/2,40,{ align : "center" })
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("38, Ektha Prime Highland Park, Financial District, Hyderabad",pageWidth/2,50,{align:"center"})

    

    let np = pageWidth - 80

    let x = np/3
    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.cell(40,100,x,60,"To\nToyaja Software Pvt Ltdasldkjfaksd\n38, Ektha Prime Highland Park,\nFinancial Disgrict",0,"center")
    
    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.text("GSTIN:",2*x,110)
    let y = x/2
    doc.text("36AAACO6220H1ZP",(2*x)+y,110)

    doc.text("INVOICE NO:",2*x,125)
    doc.text("1",(2*x)+y,125)

    doc.text("INVOICE DATE:",2*x,140)
    doc.text("3-Nov-2022",(2*x)+y,140)

    let line5 = 0.5
    doc.setLineWidth(line5);
    doc.line(40, 200, pageWidth-40, 200); // horizontal line


  
    doc.line(40,200,40,260); // vertical line
    doc.setFont("helvetica","bold");
    doc.setFontSize(8)
    doc.text("Sl.",45,208);
    doc.line(60,200,60,260);

    doc.line(240,200,240,260);

    // doc.line(20, 41, 60, 41); 
    doc.output("dataurlnewwindow")

    // const pdfDocCfg: PDFdocCfg_I = {
    //   jsPdfHtmlOptions: {},
    //   jsPdfOptions:     {
    //     unit: 'pt'
    //   },
    //   jsPdfDocProps:    {},
    //   autoTableOpt:     {},
    //   dataRowInfo:      {},
    //   margins_pt:       {top:   36,  // 36 pt = 0.5 in = 1.27 cm
    //                     bottom: 36,
    //                     left:   36,
    //                     right:  36},
    //   pageHeight: 0,
    //   lastRowPos: 0
    // }
    //                   // create new jsPDF API object instance
    //                   // that we use to generate the PDF doc.
    // const docPdf: jsPDF = new jsPDF(pdfDocCfg.jsPdfOptions);
  
    // const pageLeft: number   = 10;
    // const pageWidth: number  = docPdf.internal.pageSize.width;
    // const pageHorizCenter: number = pageWidth / 2;
  
    // // docPdf.setFont('times');
    // // docPdf.setFontType('normal');
    // let row: number        = 20;
    // let nextRowPos: number =  0;
  
    // docPdf.text('This is centred text 1.',                 pageHorizCenter, (nextRowPos += row),  {align: 'center'});
    // docPdf.text('This is centred text 2.',                 pageHorizCenter, (nextRowPos += row),  {align: 'center'});
    // docPdf.text('This is right aligned text 1',            pageWidth,       (nextRowPos += row),  {align: 'right'});
    // docPdf.text('This is right aligned text 2',            pageWidth,       (nextRowPos += row),  {align: 'right'});
    // docPdf.text('This is left aligned text 1 - default',   pageLeft,        (nextRowPos += row));
    // docPdf.text('This is left aligned text 2 - explicit',  pageLeft,        (nextRowPos += row),  {align: 'left'});
  

  }

  loadPDF() {

    this.inProgress = true
    let ahlService:TestPDFService = new TestPDFService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchTestPDF(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        console.log('A server error occurred while fetching PDF' +e.message)
        // this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          //this.confirm(dataError.error)
          console.log('ERROR',dataError.error)
          this.inProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          console.log(dataSuccess.success)
          this.printPdf(dataSuccess.success.base64)
          this.inProgress = false
          return
        }
        else if(v == null) { 
          this.inProgress = false
          console.log('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          console.log('An undefined error has occurred.')
          return false
        }
      }
    })

  }

  pdfSrc = "";
  printPdf(b64:string) {
    //let json: any =  { "type":"Buffer", "data":this.blob }
    //let bufferOriginal = Buffer.from(json.data);
    const byteArray = new Uint8Array(
      atob(b64)
        .split("")
        .map(char => char.charCodeAt(0))
    );

    const newByteArray = this.decodeBase64(b64)
    const file = new Blob([newByteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    window.open(fileURL);

  }

  

  decodeBase64(base64:any) {
    const text = atob(base64);
    //console.log('TEXT',text)
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes);
}





  ngOnInit() {
    
    

    this.eventBusService.on('PartyAccountHeads',(data:any) => {
      this.currentComponent = 'PartyAccountHeadsComponent'
    })

    this.eventBusService.on('OtherAccountHeads',(data:any) => {
      this.currentComponent = 'OtherAccountHeadsComponent'
    })

    this.eventBusService.on('Items',(data:any) => {
      this.currentComponent = 'ItemsComponent'
    })

    this.eventBusService.on('Purchases',(data:any) => {
      this.currentComponent = 'PurchasesComponent'
    })

    this.eventBusService.on('Sales',(data:any) => {
      this.currentComponent = 'SalesComponent'
    })

    this.eventBusService.on('SalesReturn',(data:any) => {
      this.currentComponent = 'SalesReturnComponent'
    })

    this.eventBusService.on('PurchaseReturn',(data:any) => {
      this.currentComponent = 'PurchaseReturnComponent'
    })

    this.eventBusService.on('Payments',(data:any) => {
      this.currentComponent = 'PaymentsComponent'
    })

    this.eventBusService.on('Receipts',(data:any) => {
      this.currentComponent = 'ReceiptsComponent'
    })

    this.eventBusService.on('Transfer',(data:any) => {
      this.currentComponent = 'TransferComponent'
    })

    this.eventBusService.on('WriteCheque',(data:any) => {
      this.currentComponent = 'WriteChequeComponent'
    })

    this.eventBusService.on('ReceiveCheque',(data:any) => {
      this.currentComponent = 'ReceiveChequeComponent'
    })

    this.eventBusService.on('BRS',(data:any) => {
      this.currentComponent = 'BRSComponent'
    })
    
    this.eventBusService.on('Dashboard',(data:any) => {
      this.currentComponent = 'DashboardComponent'
    })

    this.eventBusService.on('PenultimateFinalAccounts',(data:any) => {
      this.currentComponent = 'PenultimateFinalAccountsComponent'
    })

    this.eventBusService.on('ResourceTracker',(data:any) => {
      this.currentComponent = 'ResourceTrackerComponent'
    })

    this.eventBusService.on('FinalAccounts',(data:any) => {
      this.currentComponent = 'FinalAccountsComponent'
    })

    this.eventBusService.on('NewFinalAccounts',(data:any) => {
      this.currentComponent = 'NewFinalAccountsComponent'
    })

    this.eventBusService.on('TrailingFinalAccounts',(data:any) => {
      this.currentComponent = 'TrailingFinalAccountsComponent'
    })

    this.eventBusService.on('FinalAccountsSimple',(data:any) => {
      this.currentComponent = 'FinalAccountsSimpleComponent'
    })

    this.eventBusService.on('StockRegister',(data:any) => {
      this.currentComponent = 'StockRegisterComponent'
    })

    this.eventBusService.on('ClosingStock',(data:any) => {
      this.currentComponent = 'ClosingStockComponent'
    })

    this.eventBusService.on('SaleInvoiceAgeingList',(data:any) => {
      this.currentComponent = 'SaleInvoiceAgeingListComponent'
    })

    this.eventBusService.on('PurchaseInvoiceAgeingList',(data:any) => {
      this.currentComponent = 'PurchaseInvoiceAgeingListComponent'
    })

    this.eventBusService.on('Classification',(data:any) => {
      this.currentComponent = 'ClassificationComponent'
    })

    this.eventBusService.on('RecipeCostList',(data:any) => {
      this.currentComponent = 'RecipeCostListComponent'
    })

    this.eventBusService.on('UOMs',(data:any) => {
      this.currentComponent = 'UOMsComponent'
    })

    this.eventBusService.on('Tags',(data:any) => {
      this.currentComponent = 'TagsComponent'
    })

    this.eventBusService.on('ItemLevels',(data:any) => {
      this.currentComponent = 'ItemLevelsComponent'
    })

    this.eventBusService.on('StockLocations',(data:any) => {
      this.currentComponent = 'StockLocationsComponent'
    })


    this.eventBusService.on('Profile',(data:any) => {
      this.currentComponent = 'ProfileComponent'
    })

    this.eventBusService.on('EquityPayable',(data:any) => {
      this.currentComponent = 'EquityPayableComponent'
    })

    this.eventBusService.on('DayTasks',(data:any) => {
      this.currentComponent = 'DayTasksComponent'
    })

    this.eventBusService.on('Production',(data:any) => {
      this.currentComponent = 'ProductionComponent'
    })

    this.eventBusService.on('LineProduction',(data:any) => {
      this.currentComponent = 'LineProductionComponent'
    })

    this.eventBusService.on('Consumption',(data:any) => {
      this.currentComponent = 'ConsumptionComponent'
    })

    this.eventBusService.on('JournalVoucher',(data:any) => {
      this.currentComponent = 'JournalVoucherComponent'
    })

    this.eventBusService.on('NewJournalVoucher',(data:any) => {
      this.currentComponent = 'NewJournalVoucherComponent'
    })

    this.eventBusService.on('GeneralLedger',(data:any) => {
      this.currentComponent = 'GeneralLedgerComponent'
    })

    this.eventBusService.on('MilkSupplyTaskSheet',(data:any) => {
      this.currentComponent = 'MilkSupplyTaskSheetComponent'
    })

    this.eventBusService.on('OpeningBalances',(data:any) => {
      this.currentComponent = 'OpeningBalancesComponent'
    })
    

    this.eventBusService.on('LoginSuccess',(data:any) => {
      this.loginObject = data;
      this.entityName = this.loginObject.entityname
      this.lo = data
      
    })
    

  }

  handleLogin(event:any) {
    if(this.loggedOut){
      this.currentComponent = 'LoginComponent'
      console.log(event.target);
      this.loginButton = event.target;
    }
    else if(!this.loggedOut) { 
      this.currentComponent = 'XetaProducts'
      this.loggedOut = true;
      console.log(event.target);
      event.target.innerText = 'Login'
    }
  }

  handleProgressLogin() {
    this.inProgress = true;
  }

  handleSuccessLogin(event:any) {
    this.loginButton.innerText = 'Logout';
    this.loggedOut = false;
    this.currentComponent = '';
    this.inProgress = false;

  }

  handleErrorLogin() {
    this.inProgress = false;
  }

  handleXetaProducts() {
    this.currentComponent = 'XetaProducts'
  }

  handleXetaSetup() {
    this.currentComponent = 'XetaSetup'
  }

  
  handleContacts() {
    //this.currentComponent = 'ContactsComponent'
    this.currentComponent = 'NewContactsComponent'
  }

  handleEntity() {
    this.currentComponent = 'EntityComponent'
  }

  handleAccounts() {
    this.currentComponent = 'AccountsComponent'
  }

  handleProducts() {
    this.currentComponent = 'ProductsComponent'
  }

  handleDashboard() {
    this.currentComponent = 'DashboardComponent'
  }

  handleReports() {
    this.currentComponent = 'ReportsComponent'
  }

  handleOrders() {
    this.currentComponent = 'OrdersComponent'
  }

  handleTasks() {
    this.currentComponent = 'TasksComponent'
  }


  handleNewView() {
    this.currentComponent = 'NewViewComponent'
  }
  
}
