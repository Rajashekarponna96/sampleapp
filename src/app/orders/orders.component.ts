import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { PeopleService } from 'src/app/services/people.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import * as moment from 'moment';
import { Search } from 'src/app/services/search';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import { ItemsListService } from 'src/app/services/items-list.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { InvoiceListService } from 'src/app/services/invoice-list.service';
import { SavePurchaseService } from 'src/app/services/save-purchase.service';
import { TagListService } from 'src/app/services/tag-list.service'
import { SaveOrderService } from '../services/save-order.service';
import { OrderListService } from '../services/order-list.service';
import { UpdateOrderService } from '../services/update-order.service';
import { ProductServiceListService } from '../services/product-service-list.service';





@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class OrdersComponent implements OnInit {

  selectedDate: Date = new Date();
  

  orderList:any = []

  sanitizedOrderList:any[] = []

  selectedObjectType:any = 'item'
  disableItemInput:boolean = false
  disableViaPersonInput:boolean = true
  

  
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


  displayEditModal:boolean = false;


  displaySubIssueModal:boolean = false;

  displayViewModal:boolean = false;


  displayTaxModal:boolean = false;
  displayTaxEditModal: boolean = false;

  disableAccountMap:boolean = false;
  disableQuantity:boolean = false;
  disableNewTaxButton:boolean = false;
  disableDiscountInput:boolean = false;
  disableDiscountSwitch:boolean = false;

  disableRate:boolean = false;

  selectedItem:any
  filteredItems:any[] = new Array
  private _iSub:any
  @ViewChild('selectItem') selectItem:any
  placeholderItem = 'select item'


  selectedViaPerson:any
  filteredViaPeople:any[] = new Array
  private _pvSub:any
  @ViewChild('selectViaPerson') selectViaPerson:any
  placeholderViaPerson = 'select via person'

  selectedUOM:any = ""

  selectedQty:any
  @ViewChild('selectQty') selectQty:any

  selectedUIR:any
  @ViewChild('selectUIR') selectUIR:any
  
  
  selectedTaxes:any[] = []
  selectedVouchers:any[] = []
  selectedIssueVouchers:any = []

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

  selectedVoucher:any

  ri:string = 'rit'

  rad:any = 0

  rbt:any = 0
  t:any = 0
  rat:any = 0

  inProgress:boolean = false


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

  selectedExpiryDate: Date = new Date();

  selectedFromDate: Date = new Date();
  selectedToDate:Date = new Date();
  selectedDueDate:Date = new Date();


  selectedTags:any[] = []
  filteredTags:any[] = new Array 

  selectedTerminated:boolean = false

  selectedOrder:any

  intervals:any[] = []

  selectedInterval:any
  selectedTime:any
  
  hf:string = "12"

  selectedIntervalSP:any
  selectedTimeSP:any

  selectedOrderID:any

  selectedProduct:any
  @ViewChild('selectProduct') selectProduct:any
  placeholderProduct = 'select product or service'
  filteredProducts:any[] = []

  selectedContextPrices:any[] = []

  selectedCP:any

  inIssuePromise:boolean = false

  selectedIntervalMain:any
  selectedTimeMain:any;

  selectedDeliveryIncharge:any

  filteredDeliveryIncharges:any[] = []

  placeholderDeliveryIncharge:string = 'select delivery incharge'

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadOrders(0,0)
    
    this.selectedExpiryDate.setFullYear(8994,10,18)
    this.selectedExpiryDate.setHours(0);
    this.selectedExpiryDate.setMinutes(0);
    this.selectedExpiryDate.setSeconds(0);

    this.intervals = [
      {name:''},
      {name: 'day'},
      {name: 'alternate day'}
    ];
  }

  loadOrders(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:OrderListService = new OrderListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchOrderList(criteria).subscribe({
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
          this.orderList = []
          this.orderList = dataSuccess.success
          this.totalRecords = this.orderList.length
          console.log('TOTAL RECORDS',this.totalRecords)
          // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.sanitizedOrderList = []
          this.sanitizeOrders()
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

  filterProductsServices(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'search',offset:0,searchtype:'item-name-contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:ProductServiceListService = new ProductServiceListService(this.httpClient)
    this._iSub = iService.fetchProductServiceList(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredProducts = dataSuccess.success;
          console.log('FILTERED ITEMS',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectProduct(event:any) {
    
    this.selectedProduct = event

    this.selectedContextPrices = this.selectedProduct.contextprices

    console.log('SELECTED CPS',this.selectedContextPrices)


    this.rat = 0
    this.rbt = 0
    this.t = 0
    this.selectedUOM = this.selectedProduct.itemdef.uom.uom

    this.pcchange(this.ri)


  }

  productChange(event:any) {

    console.log('PRODUCT CHANGE',event)
    this.selectedUOM = ""
    //this.selectedStockBalances = []
    this.selectedContextPrices = []
    this.selectedTaxes = []
    
  }


  cpChange(event:any) {

    console.log('CP DROPDOWN CHANGE',event.value)

    if(event.value !== null) {

      this.selectedUIR = event.value.saleprice
      this.selectedTaxes = event.value.taxes

      for (let index = 0; index < this.selectedTaxes.length; index++) {
        const element = this.selectedTaxes[index];
        element['recordid'] = index
      }

      this.uirChange({})

    }

    if(event.value === null) {
      this.selectedUIR = 0
      this.selectedTaxes = []
      this.uirChange({})
    }


  }

  sanitizeOrders() {
    for (let index = 0; index < this.orderList.length; index++) {
      const element = this.orderList[index];

      let sanitInvoice:any = {}
      sanitInvoice['id'] = element.id
      sanitInvoice['vendor'] = element.content.partyaccounthead.accounthead

      console.log('VENDOR',element.content.partyaccounthead.accounthead)
      
      
      
      let rv = 0
      let iv = 0
      for (let j = 0; j < element.content.receivevouchers.length; j++) {
        const voucher = element.content.receivevouchers[j];
        if(voucher.objecttype === 'item') {
          let q = Math.abs(voucher.quantity)
          rv = (q*voucher.rateaftertaxes)+rv
        }
        if(voucher.objecttype === 'viaperson') {
          rv = voucher.userinputrate + rv
        }
        if(voucher.objecttype === 'value') {
          rv = voucher.userinputrate + rv
        }
      }

      for (let j = 0; j < element.content.issuevouchers.length; j++) {
        const voucher = element.content.issuevouchers[j];
        if(voucher.objecttype === 'item') {
          let q = Math.abs(voucher.quantity)
          iv = (q*voucher.rateaftertaxes)+iv
        }
        if(voucher.objecttype === 'viaperson') {
          iv = voucher.userinputrate + iv
        }
        if(voucher.objecttype === 'value') {
          iv = voucher.userinputrate + iv
        } 
      }

      

      sanitInvoice['receivevalue'] = rv
      sanitInvoice['issuevalue'] = iv
      
      let t:any[] = element.content.tags
      let a:string = ''
      for (let index = 0; index < t.length; index++) {
        const e:any = t[index];
        if(t.length === 1) {
          a = e.tag
        }
        if(t.length > 1) {
          if(index === 0) {
            a = e.tag
          }
          if(index === t.length-1) {
            a = a + ', ' + e.tag
          }
          if(index > 0 && index < t.length-1) {
            a = a +', '+ e.tag 
          }
        } 
      }

      sanitInvoice['tags'] = a

      sanitInvoice['terminated'] = element.content.terminated
      sanitInvoice['invoice'] = element.content

      this.sanitizedOrderList.push(sanitInvoice)
      
    }
  }


  objectTypeClick(event:any) {
    console.log('OBJECT TYPE',event)
    this.selectedObjectType = event
    if(event === 'item') {
      this.disableItemInput = false
      this.disableViaPersonInput = true
      this.disableAccountMap = false
      this.disableQuantity = false
      this.disableDiscountInput = false
      this.disableDiscountSwitch = false
      this.disableNewTaxButton = false
      this.selectedItem = null
      this.selectedViaPerson = null
      this.selectedAccountMap = null
      this.selectedUIR = null
      this.selectedQty = null
      this.selectedProduct = null
      this.selectedCP = null
      this.uirChange({})
      this.selectedTaxes = []

      if(this.inIssuePromise) {
        this.disableRate = true
      }
      if(!this.inIssuePromise){
        this.disableRate = false
      }

      
    }
    if(event === 'viaperson') {
      this.disableItemInput = true
      this.disableViaPersonInput = false
      this.disableAccountMap = true
      this.disableQuantity = true
      this.disableDiscountInput = true
      this.disableDiscountSwitch = true
      this.disableNewTaxButton = true
      this.selectedItem = null
      this.selectedViaPerson = null
      this.selectedAccountMap = null
      this.selectedUIR = null
      this.selectedQty = null
      this.selectedProduct = null
      this.selectedCP = null
      this.uirChange({})
      this.selectedTaxes = []
      this.disableRate = false
      
    }
    if(event === 'value') {
      this.disableItemInput = true
      this.disableViaPersonInput = true
      this.disableAccountMap = true
      this.disableQuantity = true
      this.disableDiscountInput = true
      this.disableDiscountSwitch = true
      this.disableNewTaxButton = true
      this.selectedItem = null
      this.selectedViaPerson = null
      this.selectedAccountMap = null
      this.selectedUIR = null
      this.selectedQty = null
      this.selectedProduct = null
      this.selectedCP = null
      this.uirChange({})
      this.selectedTaxes = []
      this.disableRate = false
    }

  }

  mainIntervalChange(event:any) {
    console.log('MAIN TIME DROPDOWN CHANGE',event.value)
    this.selectedIntervalMain = event.value
  }

  timeSelectedMain(event:any) {
    console.log('MAIN TIME',event)
    this.selectedTimeMain = event
  }

  spChange(event:any) {

    console.log('CP DROPDOWN CHANGE',event.value)
    this.selectedIntervalSP = event.value
  }

  rpChange(event:any) {
    this.selectedInterval = event.value
  }


  timeSelectedSP(event:any) {
    console.log('SP TIME',event)
    this.selectedTimeSP = event
  }

  timeSelectedRP(event:any) {
    console.log('RP TIME',event)
    this.selectedTime = event
  }


  returnNewInvoice() {
    let ni = {
      date: new Date(),
      entity:{
        person: "",
        id: "",
        name: "",
        endpoint: "",
        displayfile: {},
        isanonymous: "",
        endpointtype: ""
      },
      partyaccounthead: {
        id: "",
        accounthead: "",
        defaultgroup: "",
        relationship: "",
        neid: "",
        person: "",
        name: "",
        endpoint: "",
        accounttype: "",
        partofgroup: -1,
        isgroup: false
      },
      vouchers:[]
    }
    return ni
  }

  showModalDialog() {
    this.newInvoice = this.returnNewInvoice()
    this.selectedEntity = null
    this.selectedDate = new Date()
    this.selectedParty = null
    this.selectedVouchers = []
    this.selectedIssueVouchers = []
    this.selectedTags = []
    this.selectedIntervalMain = null
    this.selectedTimeMain = null
    this.displayModal = true;
  }

  

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
      this.selectedInvoice = event.data
    }
  }


  dateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.newInvoice.date = isoDateTime
    this.selectedDate = event
   
  }

  expiryDateSelected(event:any) {

    console.log('EXPIRY DATE SELECTED',event)

    this.selectedExpiryDate = event

  }

  fromDateSelected(event:any) {

    console.log('FROM DATE SELECTED',event)

    this.selectedFromDate = event

  }

  toDateSelected(event:any) {

    console.log('TO DATE SELECTED',event)

    this.selectedToDate = event

  }

  dueDateSelected(event:any) {

    console.log('DUE DATE SELECTED',event)

    this.selectedDueDate = event

  }


  handleView(invoice:any) {
    console.log('INVOICE',invoice)
    this.selectedInvoice = invoice
    this.displayViewModal = true
  }

  handleEdit(order:any,index:number,orderid:number) {

    console.log('ORDER DATE',order.date)
    this.selectedOrder = order
    this.selectedOrderID = orderid
    this.selectedEntity = order.entity
    this.selectedDate = new Date(order.date)
    this.selectedParty = order.partyaccounthead
    this.selectedVouchers = order.receivevouchers
    for (let index = 0; index < this.selectedVouchers.length; index++) {
      const element = this.selectedVouchers[index];
      let a:string = element.intervaltime
      element.intervaltime = new Date(a)
    }
    this.selectedIssueVouchers = order.issuevouchers
    for (let index = 0; index < this.selectedIssueVouchers.length; index++) {
      const element = this.selectedIssueVouchers[index];
      let a:string = element.intervaltime
      element.intervaltime = new Date(a)

      // if (!element.hasOwnProperty('deliveryincharge')) {
      //   this.selectedDeliveryIncharge = null;
      //   } else {
      //   this.selectedDeliveryIncharge = order.deliveryincharge
      // }

    }
    this.selectedTags = order.tags
    this.selectedTerminated = order.terminated

    this.selectedIntervalMain = order.interval
    this.selectedTimeMain = new Date(order.intervaltime)

    

    this.displayEditModal = true;

  }


  filterEntities(event:any) {
    console.log('IN FILTER UOMs',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {
      searchtext: event.query,
      screen: "tokenfield",
      searchtype: "entity-name-begins",
      offset: 0
    }
    console.log('CRITERIA',criteria)
    let eService:PeopleService = new PeopleService(this.httpClient)
    this._eSub = eService.fetchPeople(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredEntities = dataSuccess.success;
          console.log('FILTERED PEOPLE',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelect(event:any) {
    this.selectedEntity = event
    this.newInvoice.entity = event;
  }

  entityChange(event:any) {
    this.newInvoice.entity = {
      person: "",
      id: "",
      name: "",
      endpoint: "",
      displayfile: {},
      isanonymous: "",
      endpointtype: ""
    }
    
  }

  filterParties(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
    console.log('CRITERIA',criteria)
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._eSub = pService.fetchAccountHeads(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredParties = dataSuccess.success;
          console.log('FILTERED PEOPLE',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectParty(event:any) {
    this.selectedParty = event
    this.newInvoice.partyaccounthead = event;
  }

  partyChange(event:any) {
    this.newInvoice.partyaccounthead =  {
      id: "",
      accounthead: "",
      defaultgroup: "",
      relationship: "",
      neid: "",
      person: "",
      name: "",
      endpoint: "",
      accounttype: "",
      partofgroup: -1,
      isgroup: false
    }
  }






  filterDeliveryIncharges(event:any) {
    console.log('IN FILTER DELIVERY INCHARGES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
    console.log('CRITERIA',criteria)
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._eSub = pService.fetchAccountHeads(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredDeliveryIncharges = dataSuccess.success;
          console.log('FILTERED DELIVERY INCHARGES',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectDeliveryIncharge(event:any) {
    this.selectedDeliveryIncharge = event
    //this.newInvoice.partyaccounthead = event;
  }

  deliveryInchargeChange(event:any) {
    this.selectedDeliveryIncharge =  {
      id: "",
      accounthead: "",
      defaultgroup: "",
      relationship: "",
      neid: "",
      person: "",
      name: "",
      endpoint: "",
      accounttype: "",
      partofgroup: -1,
      isgroup: false
    }
  }



  terminateChange(event:any) {
    console.log('TERMINATE',event)
    this.selectedTerminated = event
  }


  filterViaPeople(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
    console.log('CRITERIA',criteria)
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._eSub = pService.fetchAccountHeads(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredViaPeople = dataSuccess.success;
          console.log('FILTERED VIA PEOPLE',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectViaPerson(event:any) {
    this.selectedViaPerson = event
    //this.newInvoice.partyaccounthead = event;
  }

  // viaPersonChange(event:any) {
  //   this.newInvoice.partyaccounthead =  {
  //     id: "",
  //     accounthead: "",
  //     defaultgroup: "",
  //     relationship: "",
  //     neid: "",
  //     person: "",
  //     name: "",
  //     endpoint: "",
  //     accounttype: "",
  //     partofgroup: -1,
  //     isgroup: false
  //   }
  // }



  handleViewVoucher(v:any) {

  }

  

  handleDeleteVoucher(v:any) {
    this.selectedVouchers.splice(v,1)
  }

  handleDeleteIssueVoucher(v:any) {
    this.selectedIssueVouchers.splice(v,1)
  }

  filterItems(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'itemname-contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:ItemsListService = new ItemsListService(this.httpClient)
    this._iSub = iService.fetchItems(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredItems = dataSuccess.success;
          console.log('FILTERED ITEMS',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectItem(event:any) {
    
    this.selectedItem = event

    this.selectedTaxes = this.selectedItem.taxes

    for (let index = 0; index < this.selectedTaxes.length; index++) {
      const element = this.selectedTaxes[index];
      element['recordid'] = index
    }

    this.rat = 0
    this.rbt = 0
    this.t = 0
    this.selectedUOM = this.selectedItem.uom.uom

    this.pcchange(this.ri)
  }


  highestRecordID(objectArray:any[]) {
    let recid = 0
    for (let index = 0; index < objectArray.length; index++) {
      const element = objectArray[index];
      if(element.recordid > recid) {
        recid = element.recordid
      }
    }
    return recid

  }



  itemChange(event:any) {

    console.log('ITEM CHANGE',event)
    this.selectedUOM = ""
    this.selectedTaxes = []
    
  }

  viaPersonChange(event:any) {

    console.log('VIA PERSON CHANGE',event)
    this.selectedUOM = ""
    this.selectedTaxes = []
    
  } 


  calculateTaxFactor() {
    let totaltaxperc:number = 0
    for (let index = 0; index < this.selectedTaxes.length; index++) {
      const tax = this.selectedTaxes[index];
      console.log('TAX',parseFloat(tax.taxpercent))
      totaltaxperc = parseFloat(tax.taxpercent) + totaltaxperc
      
    }
    let tf = 1+(totaltaxperc/100)
    console.log('TAXFACTOR',tf)
    return tf
    
  }
  

  

  discountChange(event:any) {
    
    let d:number = parseFloat(event)

    if(this.selectedUIR === null) {
      return
    }

    if(!this.discountState) {
      this.discountAmount = this.selectedUIR*(d/100)
      this.selectedDiscountAmount = this.discountAmount
      this.selectedDiscountPercent = d
      this.rad = this.selectedUIR - this.discountAmount

    }
    if(this.discountState) {
      this.discountAmount = d
      this.selectedDiscountAmount = d
      this.selectedDiscountPercent = (d*100)/this.selectedUIR
      this.rad = this.selectedUIR - d
    }

    if(isNaN(this.discountAmount)) {
      this.discountAmount = 0
      this.selectedDiscountAmount = 0
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(isNaN(this.rad)) {
      this.rad = this.selectedUIR
    }

    this.pcchange(this.ri)

  }

  handleDiscountSwitchChange(event:any) {
    this.discountState = event.checked
    console.log('DISCOUNT STATE',this.discountState)

    if(this.discountState) {
      this.discountLabel = 'discount amount'
      this.selectedDiscountPercent 
    }
    if(!this.discountState) {
      this.discountLabel = 'discount percent'
    }

    if(this.inputDiscount === null || this.selectedUIR === null) {
      return
    }

    if(this.discountState) {
      this.discountAmount = this.inputDiscount
      this.selectedDiscountAmount = this.inputDiscount
      this.selectedDiscountPercent = (this.inputDiscount*100)/this.selectedUIR
      this.rad = this.selectedUIR - this.discountAmount
    }
    if(!this.discountState) {
      this.discountAmount = this.selectedUIR*(this.inputDiscount/100)
      this.selectedDiscountAmount = this.discountAmount
      this.selectedDiscountPercent = this.inputDiscount
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(isNaN(this.discountAmount)) {
      this.discountAmount = 0
      this.selectedDiscountAmount = 0
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(isNaN(this.rad)) {
      this.rad = this.selectedUIR
    }

    this.pcchange(this.ri)

  }


  pcchange(event:any) {

    console.log('RI EVENT',event)

    this.ri = event

    if(this.ri === 'rit') {
      this.rbt = this.rad/this.calculateTaxFactor()
      this.rat = this.rad
      this.t = this.rat - this.rbt
      
    }
    if(this.ri === 'ret') {
      this.rbt = this.rad
      this.rat = this.rad*this.calculateTaxFactor()
      this.t = this.rat - this.rbt
    }

    this.calculateSeparateTaxes()
    
  }

  calculateSeparateTaxes() {
    this.totalvatperc = 0
    this.totalnonvatperc = 0
    
    for (let index = 0; index < this.selectedTaxes.length; index++) {
      const element = this.selectedTaxes[index];
      let tt = element.taxtype.toLowerCase()
      if(tt === 'vat') {
        this.totalvatperc = this.totalvatperc + parseFloat(element.taxpercent)
      }
      if(tt === 'nonvat') {
        this.totalnonvatperc = this.totalnonvatperc + parseFloat(element.taxpercent)
      }
    }

    let totaltaxperc = this.totalvatperc + this.totalnonvatperc
    this.vattaxperunit = (this.totalvatperc/totaltaxperc)*this.t
    this.nonvattaxperunit = (this.totalnonvatperc/totaltaxperc)*this.t

    if (isNaN(this.vattaxperunit)) {
      this.vattaxperunit = 0
    }

    if (isNaN(this.nonvattaxperunit)) {
      this.nonvattaxperunit = 0
    }


    console.log('TOTALVATPERC',this.totalvatperc)
    console.log('TOTALNONVATPERC',this.totalnonvatperc)
    console.log('TOTALTAXPERC',totaltaxperc)
    console.log('T',this.t)
    console.log('VATTAXPU',this.vattaxperunit)
    console.log('NONVATTAXPU',this.nonvattaxperunit)


    // individual taxperc / totaltaxperc * this.t

    for (let index = 0; index < this.selectedTaxes.length; index++) {
      const element = this.selectedTaxes[index];

      let ta = ((element.taxpercent / totaltaxperc) * this.t)
      element['taxamount'] = ta
      
    }


  }


  uirChange(event:any) {
    let uir:number = parseFloat(event)
    
    if(!this.discountState) {
      this.discountAmount = uir*(this.inputDiscount/100)
      this.selectedDiscountAmount = this.discountAmount
      this.selectedDiscountPercent = this.inputDiscount
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(this.discountState) {
      this.discountAmount = this.inputDiscount
      this.selectedDiscountAmount = this.inputDiscount
      this.selectedDiscountPercent = (this.inputDiscount*100)/uir
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(isNaN(this.discountAmount)) {
      this.discountAmount = 0
      this.selectedDiscountAmount = 0
      this.rad = this.selectedUIR - this.discountAmount
    }

    if(isNaN(this.rad)) {
      this.rad = this.selectedUIR
    }

    

    this.pcchange(this.ri)
  }


  returnNewVoucher() {
    let v:any = {
      action: "rec",
      objecttype: "item",
      object: {
        itemname:null
      },
      quantity: null,
      currency: "",
      fromdatetime: "",
      todatetime: "",
      duedatetime: "",
      userinputrate: null,
      rateincludesvat: "True",
      taxes: [],
      discountpercent: null,
      discountamount: null,
      rateafterdiscount: null,
      rateaftertaxes: null,
      taxfactor: 1,
      taxesperunit: null,
      uom: {
        uom: "",
        symbol: "",
        country: ""
      },
      nonvattaxperunit: null,
      vattaxperunit: null,
      nonvatpercent: null,
      vatpercent: null,
      ratebeforetaxes: null,
      intofrom: {
        id: "0",
        itemname: "",
        iscontainer: "True",
        usercode: "",
        uom: {
          uom: "each",
          symbol: "each",
          country: "global"
        },
        taxes: [],
        files: [],
        recipe: {
          consumedunits: [],
          byproducts: []
        }
      },
      by: {
        itemid: "0",
        neid: "",
        relationshipid: "",
        name: ""
      },
      delivery: {
        id: "-1",
        accounthead: "",
        defaultgroup: "",
        relationship: "-1",
        neid: "-1",
        person: "-1",
        name: "",
        endpoint: "",
        rtype: ""
      },
      title: "",
      accountmap: {
        id: "",
        accounthead: "",
        defaultgroup: "",
        relationship: "",
        neid: "",
        person: "",
        name: "",
        endpoint: "",
        accounttype: "",
        partofgroup: -1,
        isgroup: false
      },
      files: [],
      expirydate: new Date(),
      vendorperson: null
    }

    return v

  }

  showNewVoucherDialog() {

    this.inIssuePromise = false
    this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    this.selectedUIR = null
    this.selectedQty = null
    this.selectedAccountMap = null

    this.selectedExpiryDate = new Date()
    this.selectedFromDate = new Date()
    this.selectedToDate = new Date()
    this.selectedDueDate = new Date()

    this.selectedViaPerson = null
    this.selectedObjectType = 'item'

    this.objectTypeClick(this.selectedObjectType)


    this.selectedUOM = ""
    this.selectedTaxes = []
    this.pcchange('rit')
    this.selectedInterval = null
    this.selectedTime = null
    this.selectedIntervalSP = null
    this.selectedTimeSP = null
    this.displaySubModal = true;

  }


  showNewIssueVoucherDialog() {

    this.inIssuePromise = true;
    this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    this.selectedUIR = null
    this.selectedQty = null
    this.selectedAccountMap = null

    this.selectedDeliveryIncharge = null
    this.selectedExpiryDate = new Date()
    this.selectedFromDate = new Date()
    this.selectedToDate = new Date()
    this.selectedDueDate = new Date()

    this.selectedViaPerson = null
    this.selectedObjectType = 'item'

    this.objectTypeClick(this.selectedObjectType)


    this.selectedUOM = ""
    this.selectedTaxes = []
    this.pcchange('rit')
    this.selectedInterval = null
    this.selectedTime = null
    this.selectedIntervalSP = null
    this.selectedTimeSP = null
    this.displaySubIssueModal = true;

  }

  

  handleAddReceiveVoucher(){

    console.log('ITEM',this.selectedItem)
    console.log('QUANTITY',this.selectedQty)
    console.log('USER INPUT RATE',this.selectedUIR)

    if(this.selectedObjectType === 'item') {
      if (typeof this.selectedItem === 'undefined' || this.selectedItem == null) {
        this.confirm('You must select an item')
        return false
      }
      if (typeof this.selectedQty === 'undefined' || this.selectedQty == null || this.selectedQty === 0) {
        this.confirm('You must enter a quantity greater than zero')
        return false
      }
  
      if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
        this.confirm('You must enter a quantity greater than or equal to zero')
        return false
      }
  
      if (typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) {
        this.confirm('You must select an account')
        return false
      }
  
      if(this.taxPartyCheck()) {
        this.confirm('One or more tax entries do not have tax authority selected.')
        return false
      }

      this.pcchange(this.ri)
  
    }

    if(this.selectedObjectType === 'viaperson') {
      if (typeof this.selectedViaPerson === 'undefined' || this.selectedViaPerson == null) {
        this.confirm('You must select a person')
        return false
      }
      if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
        this.confirm('You must enter a quantity greater than or equal to zero')
        return false
      }
      
    }

    if(this.selectedObjectType === 'value') {
      if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
        this.confirm('You must enter a quantity greater than or equal to zero')
        return false
      }
    }

    

    let v:any = this.buildVoucher('rec')
    this.selectedVouchers.push(v)

    console.log('RECEIVE PROMISES',this.selectedVouchers)
    
    this.displaySubModal = false
    return false

  } 

  handleAddIssueVoucher(){

    console.log('ITEM',this.selectedItem)
    console.log('QUANTITY',this.selectedQty)
    console.log('USER INPUT RATE',this.selectedUIR)

    if(this.selectedObjectType === 'item') {
      if (typeof this.selectedProduct === 'undefined' || this.selectedProduct == null) {
        this.confirm('You must select a product')
        return false
      }
      if (typeof this.selectedQty === 'undefined' || this.selectedQty == null || this.selectedQty === 0) {
        this.confirm('You must enter a quantity greater than zero')
        return false
      }
  
      if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
        this.confirm('You must enter a rate greater than or equal to zero')
        return false
      }
  
      if (typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) {
        this.confirm('You must select an account')
        return false
      }

      if (typeof this.selectedDeliveryIncharge === 'undefined' || this.selectedDeliveryIncharge == null) {
        this.confirm('You must select a delivery incharge')
        return false
      }
  
      if(this.taxPartyCheck()) {
        this.confirm('One or more tax entries do not have tax authority selected.')
        return false
      }

      this.pcchange(this.ri)
  
    }

    if(this.selectedObjectType === 'viaperson') {
      if (typeof this.selectedViaPerson === 'undefined' || this.selectedViaPerson == null) {
        this.confirm('You must select a person')
        return false
      }
      if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
        this.confirm('You must enter a quantity greater than or equal to zero')
        return false
      }
      
    }

    
    
    

    let v:any = this.buildVoucher('iss')
    this.selectedIssueVouchers.push(v)
    
    this.displaySubIssueModal = false
    return false

  }


  buildVoucher(action:string) {
    /*
      {
      action: "rec",
      objecttype: "item",
      object: {
        itemname:null
      },
      quantity: null,
      currency: "",
      fromdatetime: "",
      todatetime: "",
      duedatetime: "",
      userinputrate: null,
      rateincludesvat: "True",
      taxes: [],
      discountpercent: null,
      discountamount: null,
      rateafterdiscount: null,
      rateaftertaxes: null,
      taxfactor: 1,
      taxesperunit: null,
      uom: {
        uom: "",
        symbol: "",
        country: ""
      },
      nonvattaxperunit: null,
      vattaxperunit: null,
      nonvatpercent: null,
      vatpercent: null,
      ratebeforetaxes: null,
      intofrom: {
        id: "0",
        itemname: "",
        iscontainer: "True",
        usercode: "",
        uom: {
          uom: "each",
          symbol: "each",
          country: "global"
        },
        taxes: [],
        files: [],
        recipe: {
          consumedunits: [],
          byproducts: []
        }
      },
      by: {
        itemid: "0",
        neid: "",
        relationshipid: "",
        name: ""
      },
      delivery: {
        id: "-1",
        accounthead: "",
        defaultgroup: "",
        relationship: "-1",
        neid: "-1",
        person: "-1",
        name: "",
        endpoint: "",
        rtype: ""
      },
      title: "",
      accountmap: {
        id: "",
        accounthead: "",
        defaultgroup: "",
        relationship: "",
        neid: "",
        person: "",
        name: "",
        endpoint: "",
        accounttype: "",
        partofgroup: -1,
        isgroup: false
      },
      files: [],
      expirydate: new Date(),
      vendorperson: null
    }
    */

    

    let v:any = {}
    v['action'] = action
    v['objecttype'] = this.selectedObjectType
    if(this.selectedObjectType === 'item') {
      if(action === 'iss') {
        v['object'] = JSON.parse(JSON.stringify(this.selectedProduct))
      }
      if(action === 'rec') {
        v['object'] = JSON.parse(JSON.stringify(this.selectedItem))
      }
      
    }
    if(this.selectedObjectType === 'viaperson') {
      v['object'] = JSON.parse(JSON.stringify(this.selectedViaPerson))
    }
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    v['deliveryincharge'] = JSON.parse(JSON.stringify(this.selectedDeliveryIncharge))
    v['fromdatetime'] = this.ISODate(this.selectedFromDate)
    v['todatetime'] = this.ISODate(this.selectedToDate)
    v['duedatetime'] = this.ISODate(this.selectedDueDate)
    v['expirydate'] = this.ISODate(this.selectedExpiryDate)
    v['userinputrate'] = this.selectedUIR
    if(this.ri === 'rit'){
      v['rateincludesvat'] = true
    }
    if(this.ri === 'ret') {
      v['rateincludesvat'] = false
    }

    v['taxes'] = JSON.parse(JSON.stringify(this.selectedTaxes))
    if(isNaN(this.selectedDiscountPercent)) {
      this.selectedDiscountPercent = 0
    }
    v['discountpercent'] = this.selectedDiscountPercent
    v['discountamount'] = this.selectedDiscountAmount
    v['rateafterdiscount'] = this.rad
    v['rateaftertaxes'] = this.rat
    v['taxfactor'] = this.calculateTaxFactor()
    v['taxesperunit'] = this.t
    v['uom'] = {
      uom: "",
      symbol: "",
      country: ""
    }
    
    v['nonvattaxperunit'] = this.nonvattaxperunit
    
    v['vattaxperunit'] = this.vattaxperunit
    v['nonvatpercent'] = this.totalnonvatperc
    v['vatpercent'] = this.totalvatperc
    v['ratebeforetaxes'] = this.rbt

    v['intofrom'] = {
      id: "0",
      itemname: "",
      iscontainer: "True",
      usercode: "",
      uom: {
        uom: "each",
        symbol: "each",
        country: "global"
      },
      taxes: [],
      files: [],
      recipe: {
        consumedunits: [],
        byproducts: []
      }
    }
    v['by'] = {
      itemid: "0",
      neid: "",
      relationshipid: "",
      name: ""
    }
    v['delivery'] ={
      id: "-1",
      accounthead: "",
      defaultgroup: "",
      relationship: "-1",
      neid: "-1",
      person: "-1",
      name: "",
      endpoint: "",
      rtype: ""
    }
    v['title'] = ""
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    v['files'] = []
    v['vendorperson'] = null
    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    if(action === 'rec') {
      v['interval'] = this.selectedInterval
      v['intervaltime'] = this.selectedTime
    }
    if(action === 'iss') {
      v['interval'] = this.selectedIntervalSP
      v['intervaltime'] = this.selectedTimeSP
      
    }


    

    return v

  }


  

  taxPartyCheck() {

    for (let index = 0; index < this.selectedTaxes.length; index++) {
      const element = this.selectedTaxes[index];
      //console.log("key" in obj)
      if(!("taxauthority" in element) || (element.taxauthority.accounthead === '')) {
        return true
      }
    }
    return false
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
  

  handleAddTax() {
    // let copiedTax = JSON.parse(JSON.stringify(this.selectedTax));
    // this.item.taxes.push(copiedTax)

    if (typeof this.selectedTaxParty === 'undefined' || this.selectedTaxParty == null) {
      this.confirm('You must select a tax authority')
      return false
    }
    if (typeof this.selectedTaxpercent === 'undefined' || this.selectedTaxpercent == null ) {
      this.confirm('You must enter tax percent')
      return false
    }

    if (typeof this.selectedTaxname === 'undefined' || this.selectedTaxname == null || this.selectedTaxname === '') {
      this.confirm('You must enter a tax name')
      return false
    }

    if (typeof this.selectedTaxtype === 'undefined' || this.selectedTaxtype == null || this.selectedTaxtype === '') {
      this.confirm('You must select a tax type')
      return false
    }

    if(this.selectedTaxParty.accounthead === '') {
      this.confirm('You must select a tax authority')
    }

    let tax:any = {}
    tax['taxname'] = this.selectedTaxname
    if(this.selectedTaxcode === null) {
      this.selectedTaxcode = ""
    }
    tax['taxcode'] = this.selectedTaxcode
    tax['taxpercent'] = this.selectedTaxpercent
    tax['taxtype'] = this.selectedTaxtype
    tax['taxauthority'] = this.selectedTaxParty
    tax['recordid'] = this.highestRecordID(this.selectedTaxes) + 1

    console.log('TAX TO BE ADDED',tax)

    //return false

    this.selectedTaxes.push(tax)
    this.pcchange(this.ri)


    this.selectedTaxname = null
    this.selectedTaxcode = null
    this.selectedTaxtype = null
    this.selectedTaxpercent = null
    this.selectedTaxParty = null
    

    this.displayTaxModal = false

    return false

  }

  handleUpdateTax() {
    
    let tax:any = this.recordByRecordID(this.selectedRecordid,this.selectedTaxes)
    tax.taxname = this.selectedTaxname
    if(this.selectedTaxcode === null) {
      this.selectedTaxcode = ""
    }
    tax.taxcode = this.selectedTaxcode
    tax.taxpercent = this.selectedTaxpercent
    tax.taxauthority = this.selectedTaxParty
    tax.taxtype = this.selectedTaxtype
    this.pcchange(this.ri)
    this.displayTaxEditModal = false
    console.log('TAX TO BE UPDATED',tax)

  }

  handleTaxDelete(event:any) {
    console.log('EVENT',event)
    this.selectedTaxes.splice(event,1)
    this.pcchange(this.ri)
  }

  handleTaxEdit(tax:any) {
    console.log('TAX TO BE EDITED',tax)
    this.selectedTaxname = tax.taxname
    this.selectedTaxcode = tax.taxcode
    this.selectedTaxpercent = tax.taxpercent
    this.selectedTaxtype = tax.taxtype
    this.selectedTaxParty = tax.taxauthority
    this.selectedRecordid = tax.recordid
    this.displayTaxEditModal = true
  }

  showNewTaxDialog() {

    this.selectedTaxname = null
    this.selectedTaxcode = null
    this.selectedTaxtype = null
    this.selectedTaxpercent = null
    this.selectedTaxParty = null
    this.displayTaxModal = true;
  }

  handleOnSelectTaxParty(event:any) {
    this.selectedTaxParty = event
  }

  

  recordByRecordID(recordid:any,array:any) {
    let object:any
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.recordid === recordid) {
        object = element
      }
    }
    return object
  }



  filterAccountMaps(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'nominal-accounthead-begins'};
    console.log('CRITERIA',criteria)
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._eSub = pService.fetchAccountHeads(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredAccountMaps = dataSuccess.success;
          console.log('FILTERED PEOPLE',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }

  handleOnSelectAccountMap(event:any) {
    this.selectedAccountMap = event
    //this.newInvoice.partyaccounthead = event;
  }

  accountMapChange(event:any) {
    this.selectedAccountMap =  {
      id: "",
      accounthead: "",
      defaultgroup: "",
      relationship: "",
      neid: "",
      person: "",
      name: "",
      endpoint: "",
      accounttype: "",
      partofgroup: -1,
      isgroup: false
    }
  }


  ISODate(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    
    return isoDateTime
   
  }




  filterTags(event:any) {
    console.log('IN FILTER TAGS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'begins'};
    console.log('CRITERIA',criteria)
    
    let pService:TagListService = new TagListService(this.httpClient)
    this._eSub = pService.fetchTags(criteria).subscribe({
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
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.filteredTags = dataSuccess.success;
          console.log('FILTERED TAGS',dataSuccess.success)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }





  handleSaveOrder() {
    if (typeof this.selectedEntity === 'undefined' || this.selectedEntity == null) {
      this.confirm('You must select an entity')
      return false
    }

    if (typeof this.selectedParty === 'undefined' || this.selectedParty == null) {
      this.confirm('You must select a party')
      return false
    }

    if(this.selectedVouchers.length === 0 || this.selectedIssueVouchers.length === 0) {
      this.confirm('You must enter atleast one voucher')
      return false
    }

    

    let newOrder:any = {}
    //newOrder['date'] = this.ISODate(this.selectedDate)
    newOrder['dobr'] = "infinity"
    newOrder['doer'] = "infinity"
    newOrder['date'] = this.selectedDate
    newOrder['entity'] = this.selectedEntity
    newOrder['partyaccounthead'] = this.selectedParty
    newOrder['tags'] = this.selectedTags
    newOrder['receivevouchers'] = this.selectedVouchers
    newOrder['issuevouchers'] = this.selectedIssueVouchers
    newOrder['interval'] = this.selectedIntervalMain
    newOrder['intervaltime'] = this.selectedTimeMain
    newOrder['terminated'] = this.selectedTerminated
    newOrder['files'] = []

    console.log('ORDER TO BE SAVED',JSON.stringify(newOrder))

    this.saveOrder(newOrder)

    return false
  }


  saveOrder(newOrder:any){

    this.inProgress = true
    
    let sah:SaveOrderService = new SaveOrderService(this.httpClient)
    this._siSub = sah.saveOrder(newOrder).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inProgress = false
        this.confirm('A server error occured while saving account head. '+e.message)
        return;
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          //alert(dataError.error);
          this.confirm(dataError.error)
          this.inProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {

          this.inProgress = false
          this.displayModal = false
          this.sanitizedOrderList
          this.loadOrders(0,0)
          return;
        }
        else if(v == null) {

          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          this.confirm('An undefined error has occurred.')
          return
        }
      }
    })

    return

  }

  handleUpdateOrder() {

    if (typeof this.selectedEntity === 'undefined' || this.selectedEntity == null) {
      this.confirm('You must select an entity')
      return false
    }

    if (typeof this.selectedParty === 'undefined' || this.selectedParty == null) {
      this.confirm('You must select a party')
      return false
    }

    if(this.selectedVouchers.length === 0 || this.selectedIssueVouchers.length === 0) {
      this.confirm('You must enter atleast one voucher')
      return false
    }

    this.selectedOrder['dobr'] = "infinity"
    this.selectedOrder['doer'] = "infinity"
    this.selectedOrder['date'] = this.selectedDate
    this.selectedOrder['entity'] = this.selectedEntity
    this.selectedOrder['partyaccounthead'] = this.selectedParty
    this.selectedOrder['tags'] = this.selectedTags
    this.selectedOrder['receivevouchers'] = this.selectedVouchers
    this.selectedOrder['issuevouchers'] = this.selectedIssueVouchers
    this.selectedOrder['terminated'] = this.selectedTerminated
    this.selectedOrder['intervaltime'] = this.selectedTimeMain
    this.selectedOrder['terminated'] = this.selectedTerminated
    this.selectedOrder['files'] = []

    let finalJSON:any = {}
    finalJSON['id'] = this.selectedOrderID
    finalJSON['content'] = this.selectedOrder
    console.log('ORDER TO BE UPDATED',JSON.stringify(finalJSON))

    this.updateOrder(finalJSON)

    return false
  }


  updateOrder(newOrder:any){

    this.inProgress = true
    
    let sah:UpdateOrderService = new UpdateOrderService(this.httpClient)
    this._siSub = sah.updateOrder(newOrder).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inProgress = false
        this.confirm('A server error occured while saving account head. '+e.message)
        return;
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          //alert(dataError.error);
          this.confirm(dataError.error)
          this.inProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {

          this.inProgress = false
          this.displayEditModal = false
          this.sanitizedOrderList
          this.loadOrders(0,0)
          return;
        }
        else if(v == null) {

          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          this.confirm('An undefined error has occurred.')
          return
        }
      }
    })

    return

  }

}
