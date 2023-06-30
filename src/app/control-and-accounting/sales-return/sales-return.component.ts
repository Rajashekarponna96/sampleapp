import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { PeopleService } from 'src/app/services/people.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import * as moment from 'moment';
import { Search } from 'src/app/services/search';

import {ConfirmationService,MessageService} from 'primeng/api';
import { InvoiceListService } from 'src/app/services/invoice-list.service';



@Component({
  selector: 'app-sales-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class SalesReturnComponent implements OnInit {

  selectedStockBalances:any[] = []

  
  selectedDate: Date = new Date();
  

  saleList:any = []

  sanitizedInvoiceList:any[] = []


  newInvoice:any = {}
  newVoucher:any = {}

  selectedEntity:any
  filteredEntities:any[] = new Array
  private _eSub:any
  @ViewChild('selectEntity') selectEntity:any
  placeholderEntity = 'select entity'

  selectedParty:any
  filteredParties:any[] = new Array
  private _pSub:any
  @ViewChild('selectParty') selectParty:any
  placeholderParty = 'select party' 


  selectedInvoice:any = {}

  displayModal: boolean = false;
  displaySubModal: boolean = false;
  displaySubEditModal:boolean = false;

  displayViewModal:boolean = false;

  displayTaxModal:boolean = false;
  displayTaxEditModal: boolean = false;

  selectedItem:any
  filteredItems:any[] = new Array
  private _iSub:any
  @ViewChild('selectItem') selectItem:any
  placeholderItem = 'select item'

  selectedUOM:any = ""

  selectedQty:number = 0
  @ViewChild('selectQty') selectQty:any

  selectedUIR:any
  @ViewChild('selectUIR') selectUIR:any
  
  
  selectedTaxes:any[] = []
  selectedVouchers:any[] = []

  selectedTaxname:any
  @ViewChild('selectTaxname') selectTaxname:any

  selectedTaxcode:any
  @ViewChild('selectTaxcode') selectTaxcode:any

  selectedTaxpercent:any
  @ViewChild('selectTaxpercent') selectTaxpercent:any

  selectedTaxtype:any
  @ViewChild('selectTaxtype') selectTaxtype:any

  taxTypes:any[] = [{type:''},{type:'vat'},{type:'nonvat'}]


  selectedTaxParty:any
  @ViewChild('selectTaxParty') selectTaxParty:any
  placeholderTaxParty = 'select tax authority'



  inputDiscount:any
  @ViewChild('selectDiscount') selectDiscount:any

  selectedDiscountAmount:any
  selectedDiscountPercent:any

  
  // @ViewChild('discountPercentInput') discountPercentInput:ElementRef = new ElementRef({}); 
  // @ViewChild('discountAmountInput') discountAmountInput:ElementRef = new ElementRef({});

  discountLabel:string = 'discount percent'
  discountAmount:number = 0

  discountState:boolean = false

  selectedRecordid:any
  selectedVoucherid:any

  ri:string = 'rit'

  rad:any = 0

  rbt:any = 0
  t:any = 0
  rat:any = 0

  inProgress:boolean = false

  viewPartyName:any;
  viewTotal:number = 0


  // private totaltaxfactor:any
  // private nonvatpu:any
  // private vatpu:any
  
  // private totaltaxperc:number = 0

  private vattaxperunit:number = 0
  private nonvattaxperunit:number = 0

  private totalvatperc:number = 0
  private totalnonvatperc:number = 0
  
  selectedAccountMap:any
  filteredAccountMaps:any[] = new Array
  private _amSub:any
  @ViewChild('selectAccountMap') selectAccountMap:any
  placeholderAccountMap = 'select account map'

  private _invSub:any
  totalRecords:number = 0

  private _siSub:any

  inStockBalanceProgress:boolean = false
  private _sbSub:any

  selectedContextPrices:any[] = []

  selectedCP:any
  @ViewChild('selectCP') selectCP:any


  uneditedSbs:any[] = []

  

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.loadInvoices(0,0)
    
    this.viewPartyName = ''
    this.viewTotal = 0
  }


  sanitizeInvoices() {
    for (let index = 0; index < this.saleList.length; index++) {
      const element = this.saleList[index];

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
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'salesreturns',attribute:''};
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
          this.saleList = []
          this.saleList = dataSuccess.success
          this.totalRecords = this.saleList.length
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
      this.selectedInvoice = event.data
    }
  }

  


  

  
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
