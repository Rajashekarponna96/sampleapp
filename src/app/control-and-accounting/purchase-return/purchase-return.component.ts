import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { InvoiceListService } from 'src/app/services/invoice-list.service';
import { Search } from 'src/app/services/search';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class PurchaseReturnComponent implements OnInit {

  purchaseReturnList:any = []
  sanitizedInvoiceList:any[] = []

  inProgress:boolean = false

  private _invSub:any

  totalRecords:number = 0 

  selectedInvoice:any = {}

  displayViewModal:boolean = false;

  viewPartyName:any;
  viewTotal:number = 0
  
  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadInvoices(0,0)
  }

  sanitizeInvoices() {
    for (let index = 0; index < this.purchaseReturnList.length; index++) {
      const element = this.purchaseReturnList[index];

      let sanitInvoice:any = {}
      sanitInvoice['date'] = element.date
      sanitInvoice['vendor'] = element.partyaccounthead.accounthead

      console.log('VENDOR',element.partyaccounthead.accounthead)
      
      let taxableValue:number = 0
      let aftertaxValue:number = 0
      let tax = 0
      for (let j = 0; j < element.vouchers.length; j++) { 
        const voucher = element.vouchers[j];
        let q = Math.abs(voucher.quantity)
        taxableValue = (q*voucher.ratebeforetaxes)+taxableValue
        aftertaxValue = (q*voucher.rateaftertaxes)+aftertaxValue
      }

      tax = aftertaxValue - taxableValue

      sanitInvoice['taxablevalue'] = taxableValue
      sanitInvoice['tax'] = tax
      sanitInvoice['aftertaxvalue'] = aftertaxValue
      sanitInvoice['invoice'] = element

      this.sanitizedInvoiceList.push(sanitInvoice)
      
    }
  }

  loadInvoices(offset:number,moreoffset:number) {
    
    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'purchasereturns',attribute:''};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchInvoiceList(criteria).subscribe({
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
          this.purchaseReturnList = []
          this.purchaseReturnList = dataSuccess.success
          this.totalRecords = this.purchaseReturnList.length
          console.log('TOTAL RECORDS',this.totalRecords)
          // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.sanitizedInvoiceList = []
          this.sanitizeInvoices()
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
    if(event !== null) {
      console.log('ROW SELECT',event)
      //this.selectedInvoice = event.data
    }
  }

  // handleView(invoice:any) {
  //   console.log('INVOICE',invoice)
  //   this.selectedInvoice = invoice
  //   this.displayViewModal = true
  // }

  handleView(invoice:any) {
    console.log('INVOICE',invoice)
    this.selectedInvoice = invoice
    console.log('PARTY',this.selectedInvoice.partyaccounthead.accounthead)
    this.viewPartyName = this.selectedInvoice.partyaccounthead.accounthead 
    this.displayViewModal = true

    this.viewTotal = 0
    for (let index = 0; index < this.selectedInvoice.vouchers.length; index++) {
      const voucher = this.selectedInvoice.vouchers[index];
      let a:number = voucher.quantity * voucher.rateaftertaxes
      this.viewTotal = this.viewTotal + a
    }
  }

}
