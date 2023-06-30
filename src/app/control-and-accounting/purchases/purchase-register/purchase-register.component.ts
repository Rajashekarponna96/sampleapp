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
import { SavePurchaseReturnService } from 'src/app/services/save-purchase-return.service';
import { EventData } from 'src/app/global/event-data';
import { GlobalConstants } from 'src/app/global/global-constants';
import { StockLocationBalanceService } from 'src/app/services/stock-location-balance.service';
import { StockLocationListService } from 'src/app/services/stock-location-list.service';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-purchase-register',
  templateUrl: './purchase-register.component.html',
  styleUrls: ['./purchase-register.component.css'],
  providers: [ConfirmationService,MessageService,DatePipe]
})
export class PurchaseRegisterComponent implements OnInit {

  selectedDate: Date = new Date();
  

  purchaseList:any = []

  sanitizedInvoiceList:any[] = []

  
  newInvoice:any = {}
  newVoucher:any = {}

  selectedEntity:any = {
    id:1
  }
  filteredEntities:any[] = new Array
  private _eSub:any
  @ViewChild('selectEntity') selectEntity:any
  placeholderEntity = 'select entity'

  selectedParty:any
  filteredParties:any[] = new Array
  private _pSub:any
  @ViewChild('selectParty') selectParty:any
  placeholderParty = 'select account'



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

  selectedQty:any
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

  discountLabel:string = 'Discount Percent'
  discountAmount:number = 0

  discountState:boolean = false

  selectedRecordid:any
  selectedVoucherid:any

  

  ri:string = 'rit'

  rad:any = 0

  rbt:any = 0
  t:any = 0
  rat:any = 0

  rbtString:string = "0"
  tString:string = "0"
  ratString:string = "0"

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

  selectedExpiryDate:any;


  viewList:any[] = new Array;


  viewPartyName:any;
  viewTotal:number = 0   

  displayReturnModal:boolean = false
  displaySubEditReturnModal:boolean = false

  selectedReturnVouchers:any[] = []

  purchaseInvoiceID:any

  offset:number = 0

  lo:any

  selectedStockLocationBalance:any[] = []
  
  selectedLocationQty:number = 0

  inStockBalanceProgress:boolean = false

  _sbSub:any

  selectedFromLocation:any
  filteredFromLocations:any[] = new Array
  @ViewChild('selectFromLocation') selectFromLocation:any
  placeholderFromLocation = 'select location'

  titleOptions:any[] = [{type:'ownership'},{type:'possession'}]
  selectedTitleOption:any
  disableTitleOption:boolean = false


  selectedSNO:any
  selectedBNO:any
  selectedBrand:any


  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    //this.inProgress = true
    this.lo = GlobalConstants.loginObject
    this.loadInvoices(0,0)
    
    this.viewPartyName = ''
    this.viewTotal = 0

    //console.log('INIT ENTITY',this.selectedEntity)

  }

  loadInvoices(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'purchases',attribute:''};
    console.log('CRITERIA',criteria)
    //return
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
          this.purchaseList = []
          this.purchaseList = dataSuccess.success
          this.totalRecords = this.purchaseList.length
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

  



  sanitizeInvoices() {
    for (let index = 0; index < this.purchaseList.length; index++) {
      const element = this.purchaseList[index];

      let sanitInvoice:any = {}
      sanitInvoice['id'] = element.id
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
    this.displayModal = true;
  }

  haskeys(o:any) {
    let hasKeys = false;

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        // a key exists at this point, for sure!
        hasKeys = true;
        break; // break when found
      }
    }
    return hasKeys
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
    //this.selectedDate = isoDateTime
   
  }

  expiryDateSelected(event:any) {

    console.log('EXPIRY DATE SELECTED',event)

    this.selectedExpiryDate = event

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

  handleViewVoucher(v:any) {

  }

  handleEditVoucher(v:any) {
    
    console.log('VOUCHER TO BE EDITED',v)

    if(this.selectedQty < 0) {
      this.confirm('You cannot enter negative values for quantity')
      return
    }

    if(this.selectedUIR < 0) {
      this.confirm('You cannot enter negative values for rate')
      return
    }
    
    this.selectedItem = v.object
    this.selectedUIR = v.userinputrate
    this.selectedQty = v.quantity
    this.selectedAccountMap = v.accountmap
    console.log('V EXPDATE',v.expirydate)
    this.selectedExpiryDate = moment(v.expirydate, 'YYYY-MM-DDTHH:mm:ss.SSSZZ').toDate();
    this.selectedUOM = v.object.uom.uom
    this.selectedTaxes = v.taxes
    this.selectedTitleOption = v.title
    let ri = ""
    if(v.rateincludesvat) {
      ri = 'rit'
    }
    if(!v.rateincludesvat) {
      ri = 'ret'
    }
    this.pcchange(ri)
    this.selectedVoucherid = v.recordid
    this.displaySubEditModal = true

  }

  handleDeleteVoucher(v:any) {
    this.selectedVouchers.splice(v,1)
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

    this.selectedAccountMap = null
    
  }


  filterFromLocations(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:StockLocationListService = new StockLocationListService(this.httpClient)
    this._iSub = iService.fetchStockLocations(criteria).subscribe({
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
          this.filteredFromLocations = dataSuccess.success;
          console.log('FILTERED STOCK LOCATIONS',dataSuccess.success)
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



  handleOnSelectFromLocation(event:any) {

    this.selectedFromLocation = event
    // call the xetadata_stockbalance_ofitem_inlocation
    console.log('SELECTED ITEM',this.selectedItem)
    if (typeof this.selectedItem === 'undefined' || this.selectedItem == null || this.selectedItem.itemname === '') {
      this.confirm('You must select an item')
      return 
    }
    // let a = {
    //   'itemid':this.selectedItem.id,
    //   'location':this.selectedFromLocation.location
    // }
    //this.stockItemInLocation(a)
  }

  fromLocationChange(event:any) {
    console.log('LOCATION CHANGE',event)
    //this.selectedItemQuantity = ''
  }

  titleOptionChange(event:any) {
    console.log('TITLE CHANGE',event)
    if (event === 'possession') {
      this.disableTitleOption = true
      this.selectedAccountMap = null
    }
    else if(event === 'ownership') {
      this.disableTitleOption = false
      this.selectedAccountMap = null
    }
  }

  snoChange(event:any) {

  }

  bnoChange(event:any) {

  }

  brandChange(event:any) {

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
      this.discountLabel = 'Discount Amount'
      this.selectedDiscountPercent 
    }
    if(!this.discountState) {
      this.discountLabel = 'Discount Percent'
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

    this.rbtString = this.formatNumber(this.rbt)
    this.tString = this.formatNumber(this.t)
    this.ratString = this.formatNumber(this.rat)

    this.calculateSeparateTaxes()
    
  }
  



  formatNumber(a:number)
  {
    return a.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
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
      vendorperson: null,
      brand:null,
      batchno:null,
      serialno:null
    }

    return v

  }

  showNewVoucherDialog() {

    this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    this.selectedUIR = null
    this.selectedQty = null
    this.selectedAccountMap = null
    this.selectedTitleOption = null
    this.selectedFromLocation = null

    this.selectedExpiryDate = new Date()
    this.inputDiscount = null
    this.discountState = false

    this.selectedUOM = ""
    this.selectedTaxes = []
    this.pcchange('rit')
    this.displaySubModal = true;

  }

  

  handleAddVoucher(){

    console.log('ITEM',this.selectedItem)
    console.log('QUANTITY',this.selectedQty)
    console.log('USER INPUT RATE',this.selectedUIR)
    console.log('TITLE OPTION',this.selectedTitleOption)

    if(this.selectedQty < 0) {
      this.confirm('You cannot enter negative values for quantity')
      return false
    }

    if(this.selectedUIR < 0) {
      this.confirm('You cannot enter negative values for rate')
      return false
    }

    if (typeof this.selectedItem === 'undefined' || this.selectedItem == null) {
      this.confirm('You must select an item')
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

    if ((typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) && this.selectedTitleOption === 'ownership') {
      this.confirm('You must select an account')
      return false
    }

    if (typeof this.selectedFromLocation === 'undefined' || this.selectedFromLocation == null || this.selectedFromLocation === '') {
      this.confirm('You must select a location')
      return false
    }

    if(this.taxPartyCheck()) {
      this.confirm('One or more tax entries do not have tax authority selected.')
      return false
    }

    this.pcchange(this.ri)

    let v:any = this.buildVoucher()

    

    this.selectedVouchers.push(v)
    
    this.displaySubModal = false
    return false

  }


  buildVoucher() {
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
    v['action'] = 'rec'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem))
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
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

    v['location'] = this.selectedFromLocation

    v['title'] = this.selectedTitleOption

    v['serialno'] = this.selectedSNO
    v['batchno'] = this.selectedBNO
    v['brand'] = this.selectedBrand

    //console.log('THIS THIS THIS V',JSON.stringify(v))

    return v

  }


  handleUpdateVoucher() {

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

    let v:any = this.recordByRecordID(this.selectedVoucherid,this.selectedVouchers)
    console.log('VOUCHER',v)
    this.rebuildVoucher(v)
    this.displaySubEditModal = false

    return false

  }


  rebuildVoucher(v:any) {
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

    // IN REBUILD VOUCHER

    this.pcchange(this.ri)
    
    v['action'] = 'rec'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem))
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
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
    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    v['location'] = this.selectedFromLocation
    v['title'] = this.selectedTitleOption

    v['serialno'] = this.selectedSNO
    v['batchno'] = this.selectedBNO
    v['brand'] = this.selectedBrand

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
    let searchtype = ''
    console.log('SELECTED ITEM',this.selectedItem)
    
    
    if(this.selectedItem === null) {
      this.confirm('You must select an item')
      return
    }
    else if (this.selectedItem.itemfatype === 'stock') {
      searchtype = 'stockitem-accounthead-contains'
    }
    else if(this.selectedItem.itemfatype === 'asset') {
      searchtype = 'assetitem-accounthead-contains'
    }
    else if(this.selectedItem.itemfatype === 'other') {
      searchtype = 'otheritem-accounthead-contains'
    }  
    

    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:searchtype};
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
    this.selectedAccountMap =  null
    // this.selectedAccountMap =  {
    //   id: "",
    //   accounthead: "",
    //   defaultgroup: "",
    //   relationship: "",
    //   neid: "",
    //   person: "",
    //   name: "",
    //   endpoint: "",
    //   accounttype: "",
    //   partofgroup: -1,
    //   isgroup: false
    // }
  }


  ISODate(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    
    return isoDateTime
   
  }

  handleSavePurchase() {

    this.selectedEntity  = {
      id:1
    }

    if (typeof this.selectedEntity === 'undefined' || this.selectedEntity == null) {
      this.confirm('You must select an entity')
      return false
    }

    if (typeof this.selectedParty === 'undefined' || this.selectedParty == null) {
      this.confirm('You must select a party')
      return false
    }

    if(this.selectedVouchers.length === 0) {
      this.confirm('You must enter atleast one voucher')
      return false
    }

    if(this.rad < 0) {
      this.confirm('Rate after discount must be positive')
      return false
    }

    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(this.selectedDate)
    newInvoice['entity'] = this.selectedEntity
    newInvoice['partyaccounthead'] = this.selectedParty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedVouchers

    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))

    this.savePurchase(newInvoice)

    return false
  }


  savePurchase(newInvoice:any){

    this.inProgress = true

    let sah:SavePurchaseService = new SavePurchaseService(this.httpClient)
    this._siSub = sah.savePurchase(newInvoice).subscribe({
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
          this.sanitizedInvoiceList
          this.loadInvoices(0,0)
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
















  // PURCHASE RETURN // PURCHASE RETURN // PURCHASE RETURN // PURCHASE RETURN // PURCHASE RETURN // PURCHASE RETURN // PURCHASE RETURN //



  handleReturn(inv:any) {

    let lo:any = GlobalConstants.loginObject
    if(this.haskeys(lo.digitalkey)) {
      if(!lo.digitalkey.purchases.view) {
        this.confirm("You are not permitted to use this feature.")
        return
      }
    }
    else if(!this.haskeys(lo.digitalkey)) {
      console.log('NO KEYS ARE DEFINED')
    }

    this.purchaseInvoiceID = inv.id
    this.selectedEntity = inv.entity
    this.selectedParty = inv.partyaccounthead

    this.selectedVouchers = inv.vouchers

    this.displayReturnModal = true

  }

  handleEditReturnVoucher(v:any) {
    
    console.log('VOUCHER TO BE RETURNED',v)
    
    this.selectedItem = v.object
    this.selectedUIR = v.userinputrate
    this.selectedQty = 0
    // this.selectedStockBalances = JSON.parse(JSON.stringify(v.stockbalanceinputs))
    // for (let index = 0; index < this.selectedStockBalances.length; index++) {
    //   const element = this.selectedStockBalances[index];
    //   element.balance = element.inputqty
    //   element.inputqty = 0
    // }
    this.selectedAccountMap = v.accountmap
    this.selectedUOM = v.object.uom.uom
    this.selectedTaxes = v.taxes
    let ri = ""
    if(v.rateincludesvat) {
      this.ri = 'rit'
    }
    if(!v.rateincludesvat) {
      this.ri = 'ret'
    }
    
    this.uirChange(v.userinputrate)

    if (v.serialno !== null && typeof v.serialno !== 'undefined') {
      this.selectedSNO = v.serialno;
    }
    if (v.batchno !== null && typeof v.batchno !== 'undefined') {
      this.selectedBNO = v.batchno;
    }
    if (v.expirydate !== null && typeof v.expirydate !== 'undefined') {
      this.selectedExpiryDate = v.expirydate;
    }
    if (v.brand !== null && typeof v.brand !== 'undefined') {
      this.selectedBrand = v.brand;
    }

    this.selectedTitleOption = v.title

    this.titleOptionChange(v.title)

    this.selectedVoucherid = v.recordid

    this.loadStockLocationBalance(this.selectedItem.id)

    this.displaySubEditReturnModal = true

  }

  handleDeleteReturnVoucher(v:any) {
    console.log('EVENT',v)
    this.selectedReturnVouchers.splice(v,1)
  }


  handleUpdateReturnVoucher() {
    this.pcchange(this.ri)

    let v:any = this.recordByRecordID(this.selectedVoucherid,this.selectedVouchers)

    

    let vouchers:any[] = []
    let newV:any = this.rebuildReturnVoucher(v)
    console.log('NEWV',JSON.stringify(newV))

    // for (let index = 0; index < this.selectedStockBalances.length; index++) {
    //   const element = this.selectedStockBalances[index];

    //   let newV:any = this.rebuildReturnVoucher(v,element)
    //   vouchers.push(newV)
      
    // }

    if(newV.quantity < 0) {

      this.confirm('You cannot enter negative values for quantity')
      return
      
    }

    vouchers.push(newV)
    console.log('RETURN VOUCHERS',vouchers)

    // if this voucher is not there, add it
    //this.selectedReturnVouchers.push(newV)
    // if this voucher is already there, update it

    let tempV:any = this.recordByRecordID(v.recordid,this.selectedReturnVouchers)
    console.log('TEMPV',tempV)

    if(typeof tempV === 'undefined') {
      console.log('RETURN VOUCHERS NOT THERE')
      this.selectedReturnVouchers = vouchers
    }
    else if(typeof tempV !== 'undefined') {
      console.log('RETURN VOUCHERS THERE')

      for (let index = 0; index < this.selectedReturnVouchers.length; index++) {
        const element = this.selectedReturnVouchers[index];
        let a:any = this.indexByRecordID(this.selectedReturnVouchers[index],this.selectedReturnVouchers)
        this.selectedReturnVouchers.splice(a,1)
        
      }

      this.selectedReturnVouchers = vouchers
      

    }


    if (typeof this.selectedLocationQty === 'undefined' || this.selectedLocationQty == null || this.selectedLocationQty === 0) {
      this.confirm('You must enter a location quantity greater than zero')
      return false
    }

    if(this.selectedQty != this.selectedLocationQty) {
      this.confirm('You must enter a location quantity equal to actual quantity')
      return false
    }



    this.displaySubEditReturnModal = false

    return false 

  }


  loadStockLocationBalance(itemid:any) {

    this.inStockBalanceProgress = true

    console.log('IN STOCK BALANCES')
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {id:itemid};
    console.log('CRITERIA',criteria)
    
    let iService:StockLocationBalanceService = new StockLocationBalanceService(this.httpClient)
    this._sbSub = iService.fetchStockLocationBalance(criteria).subscribe({
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
          this.inStockBalanceProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.selectedStockLocationBalance = dataSuccess.success;
          let tempsbs = []
          for (let index = 0; index < this.selectedStockLocationBalance.length; index++) {
            const element = this.selectedStockLocationBalance[index];
            element['inputqty'] = 0
            tempsbs.push(element)
            // if(element['balance'] > 0) {
            //   tempsbs.push(element)
            // }
          }
          this.selectedStockLocationBalance = tempsbs
          console.log('STOCK LOCATION BALANCES',this.selectedStockLocationBalance)
          this.inStockBalanceProgress = false
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          this.inStockBalanceProgress = false
          return;
        }
        else {
          this.inStockBalanceProgress = false
          alert('An undefined error has occurred.')
          return
        }
      }
    })
  }


  onSearchSLBChange(event:any,i:any): void {  
    console.log('VALUE',event.target.value);
    this.selectedStockLocationBalance[i].inputqty = event.target.value
    console.log('S Locaiton B',this.selectedStockLocationBalance)

    // this.selectedQty = 0

    if(parseFloat(this.selectedStockLocationBalance[i].inputqty) < 0){
      this.confirm('You cannot issue negative stock')
      event.target.value = 0
      this.selectedStockLocationBalance[i].inputqty = 0
    }

    if(parseFloat(this.selectedStockLocationBalance[i].quantity) < parseFloat(event.target.value)) {
      this.confirm('You cannot issue stock more than the available quantity')
      event.target.value = 0
      this.selectedStockLocationBalance[i].inputqty = 0
    }

    this.selectedLocationQty = 0
    for (let index = 0; index < this.selectedStockLocationBalance.length; index++) {
      const element = this.selectedStockLocationBalance[index];
      this.selectedLocationQty = parseFloat(element.inputqty) + this.selectedLocationQty
      
    }

  } 
  

  rebuildReturnVoucher(v:any) {
    
    console.log('VID',v.id)
    let newV:any = JSON.parse(JSON.stringify(v))

    newV['action'] = 'iss'
    newV['quantity'] = this.selectedQty
    // newV['originalrateaftertaxes'] = sbi.rate
    // newV['expirydate'] = sbi.expirydate
    newV['purchasevoucherid'] = v.id

    let slbs = []
    for (let index = 0; index < this.selectedStockLocationBalance.length; index++) {
      const element = this.selectedStockLocationBalance[index];
      if(parseFloat(element.inputqty) > 0) {
        slbs.push(element)
      }
    }

    newV['stocklocationbalanceinputs'] = slbs

    return newV

  }


  indexByRecordID(v:any,array:any[]) {

    let a = null
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element['recordid'] === v.recordid) {
        a = index
      }
    }
    return a
  }





  handleSaveSaleReturn() {
    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(this.selectedDate)
    newInvoice['entity'] = this.selectedEntity
    newInvoice['partyaccounthead'] = this.selectedParty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedReturnVouchers
    //newInvoice['saleformid'] = this.saleInvoiceID
    //newInvoice['salesformtype'] = 'sale'

    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))


    this.savePurchaseReturn(newInvoice)

    
    
  }



  savePurchaseReturn(newInvoice:any){

    this.inProgress = true
    
    let sah:SavePurchaseReturnService = new SavePurchaseReturnService(this.httpClient)
    this._siSub = sah.savePurchaseReturn(newInvoice).subscribe({
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
          this.displayReturnModal = false
          this.eventBusService.emit(new EventData('PurchaseReturn','purchasereturn'))
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





  handleMore() {
    this.offset = this.offset + 500
    this.loadMore(this.offset)
  }





  loadMore(offset:number) {

    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'purchases',attribute:''};
    console.log('CRITERIA',criteria)
    //return
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
          let newPurchases:any[] = dataSuccess.success
          for (let index = 0; index < newPurchases.length; index++) {
            const element = newPurchases[index];
            this.purchaseList.push(JSON.parse(JSON.stringify(element)))
          }
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

}
