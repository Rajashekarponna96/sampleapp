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
import { SaveSaleService } from 'src/app/services/save-sale.service';
import { ProductServiceListService } from 'src/app/services/product-service-list.service';
import { StockBalanceItemService } from 'src/app/services/stock-balance-item.service';
import { SaveSaleReturnService } from 'src/app/services/save-sale-return.service';

import { EventData } from '../../global/event-data';
import { SaveConsumptionService } from 'src/app/services/save-consumption.service';
import { SaveProductionService } from 'src/app/services/save-production.service';
import { StockLocationListService } from 'src/app/services/stock-location-list.service';



@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ProductionComponent implements OnInit { 

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

  selectedRelatedItem:any
  filteredRelatedItems:any[] = new Array
  private _irSub:any
  @ViewChild('selectRelatedItem') selectRelatedItem:any
  placeholderRelatedItem = 'select related item'

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



  displayReturnModal:boolean = false
  displaySubEditReturnModal:boolean = false

  selectedReturnVouchers:any[] = []

  saleInvoiceID:any


  selectedExpiryDate: Date = new Date();

  viewTotal:number = 0

  selectedFromLocation:any
  filteredFromLocations:any[] = new Array
  @ViewChild('selectFromLocation') selectFromLocation:any
  placeholderFromLocation = 'select location'


  titleOptions:any[] = [{type:'ownership'},{type:'possession'},{type:''}]
  selectedTitleOption:any
  disableTitleOption:boolean = false


  selectedSNO:any
  selectedBNO:any
  selectedBrand:any





  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.loadInvoices(0,0)
    this.viewTotal = 0
  }


  sanitizeInvoices() {
    for (let index = 0; index < this.saleList.length; index++) {
      const element = this.saleList[index];

      let sanitInvoice:any = {} 
      sanitInvoice['date'] = element.date
      //sanitInvoice['vendor'] = element.partyaccounthead.accounthead

      //console.log('VENDOR',element.partyaccounthead.accounthead)
      
      let taxableValue:number = 0
      let aftertaxValue:number = 0
      let tax = 0
      for (let j = 0; j < element.vouchers.length; j++) {
        const voucher = element.vouchers[j];
        let amt = parseFloat(voucher.originalrateaftertaxes) * parseFloat(voucher.quantity)
        taxableValue = taxableValue + amt
      }

      tax = aftertaxValue - taxableValue

      sanitInvoice['taxablevalue'] = taxableValue
      sanitInvoice['invoice'] = element

      this.sanitizedInvoiceList.push(sanitInvoice)
      
    }
  }

  loadInvoices(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'production',attribute:''};
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
    this.selectedStockBalances = []
    this.selectedCP = null
    this.selectedContextPrices = []
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
    //this.selectedDate = isoDateTime
   
  }


  // handleView(invoice:any) {
  //   console.log('INVOICE',invoice)
  //   this.selectedInvoice = invoice
  //   this.displayViewModal = true
  // }

  handleView(invoice:any) { 
    console.log('INVOICE',invoice)
    this.selectedInvoice = invoice
    
    this.displayViewModal = true

    this.viewTotal = 0
    for (let index = 0; index < this.selectedInvoice.vouchers.length; index++) {
      const voucher = this.selectedInvoice.vouchers[index];
      let a:number = voucher.quantity * voucher.originalrateaftertaxes
      this.viewTotal = this.viewTotal + a
    }

  }



  expiryDateSelected(event:any) {

    console.log('EXPIRY DATE SELECTED',event)

    this.selectedExpiryDate = event

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
    this.selectedUIR = v.originalrateaftertaxes
    this.selectedQty = v.quantity
    this.selectedStockBalances = v.stockbalanceinputs
    this.selectedAccountMap = v.accountmap
    this.selectedUOM = v.object.uom.uom
    this.selectedTaxes = v.taxes
    let ri = ""
    if(v.rateincludesvat) {
      ri = 'rit'
    }
    if(!v.rateincludesvat) {
      ri = 'ret'
    }
    //this.pcchange(ri)
    this.selectedRelatedItem = v.relateditem
    this.selectedVoucherid = v.recordid
    this.displaySubEditModal = true

    this.selectedFromLocation = v.location

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


    this.rat = 0
    this.rbt = 0
    this.t = 0
    this.selectedUOM = this.selectedItem.uom.uom

    //this.pcchange(this.ri)


  }


  filterRelatedItems(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'itemcode-contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:ItemsListService = new ItemsListService(this.httpClient)
    this._irSub = iService.fetchItems(criteria).subscribe({
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
          this.filteredRelatedItems = dataSuccess.success;
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



  handleOnSelectRelatedItem(event:any) {
    
    this.selectedRelatedItem = event

    

    this.rat = 0
    this.rbt = 0
    this.t = 0
    this.selectedUOM = this.selectedRelatedItem.uom.uom

    //this.pcchange(this.ri)


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

    

    //this.pcchange(this.ri)
  }
  

  snoChange(event:any) {

  }

  bnoChange(event:any) {

  }

  brandChange(event:any) {

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


  onSearchChange(event:any,i:any): void {  
    console.log('VALUE',event.target.value);
    this.selectedStockBalances[i].inputqty = event.target.value
    console.log('SBS',this.selectedStockBalances)

    this.selectedQty = 0
  
    if(parseFloat(this.selectedStockBalances[i].balance) < parseFloat(event.target.value)) {
      this.confirm('You cannot issue stock more than the available quantity')
      event.target.value = 0
      this.selectedStockBalances[i].inputqty = 0
    }

    this.selectedQty = 0
    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      this.selectedQty = parseFloat(element.inputqty) + this.selectedQty
      
    }

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
    this.selectedStockBalances = []
    this.selectedContextPrices = []
    this.selectedTaxes = []
    
  } 


  relatedItemChange(event:any) {

    console.log('RELATED ITEM CHANGE',event)
    this.selectedUOM = ""
    this.selectedStockBalances = []
    this.selectedContextPrices = []
    this.selectedTaxes = []
    
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

    this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    this.selectedRelatedItem = null
    this.selectedUIR = 0
    this.selectedQty = 0
    this.selectedAccountMap = null
    this.selectedUOM = ""
    this.selectedTaxes = []
    this.inputDiscount = 0
    this.rad = 0
    //this.pcchange('rit')
    this.selectedStockBalances = []
    this.selectedContextPrices = []
    //this.titleOptionChange('ownership')
    this.displaySubModal = true;

  }

  handleAddVoucher(){

    console.log('ITEM',this.selectedItem)
    console.log('QUANTITY',this.selectedQty)
    console.log('USER INPUT RATE',this.selectedUIR)
    console.log('ACCOUNT MAP',this.selectedAccountMap)

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

    if ((typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) && this.selectedTitleOption === 'ownership') {
      this.confirm('You must select an account')
      return false
    }

    if (typeof this.selectedFromLocation === 'undefined' || this.selectedFromLocation == null || this.selectedFromLocation === '') {
      this.confirm('You must select a location')
      return false
    }

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
    v['action'] = 'prod'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem))
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    // v['fromdatetime'] = 'infinity'
    // v['todatetime'] = 'infinity'
    // v['duedatetime'] = 'infinity'
    v['originalrateaftertaxes'] = this.selectedUIR
    // if(this.ri === 'rit'){
    //   v['rateincludesvat'] = true
    // }
    // if(this.ri === 'ret') {
    //   v['rateincludesvat'] = false
    // }

    // v['taxes'] = JSON.parse(JSON.stringify(this.selectedTaxes))
    // if(isNaN(this.selectedDiscountPercent)) {
    //   this.selectedDiscountPercent = 0
    // }
    // v['discountpercent'] = this.selectedDiscountPercent
    // v['discountamount'] = this.selectedDiscountAmount
    // v['rateafterdiscount'] = this.rad
    // v['rateaftertaxes'] = this.rat
    // v['taxfactor'] = 0
    // v['taxesperunit'] = this.t
    v['uom'] = {
      uom: "",
      symbol: "",
      country: ""
    }
    
    // v['nonvattaxperunit'] = this.nonvattaxperunit
    
    // v['vattaxperunit'] = this.vattaxperunit
    // v['nonvatpercent'] = this.totalnonvatperc
    // v['vatpercent'] = this.totalvatperc
    // v['ratebeforetaxes'] = this.rbt

    // v['intofrom'] = {
    //   id: "0",
    //   itemname: "",
    //   iscontainer: "True",
    //   usercode: "",
    //   uom: {
    //     uom: "each",
    //     symbol: "each",
    //     country: "global"
    //   },
    //   taxes: [],
    //   files: [],
    //   recipe: {
    //     consumedunits: [],
    //     byproducts: []
    //   }
    // }
    // v['by'] = {
    //   itemid: "0",
    //   neid: "",
    //   relationshipid: "",
    //   name: ""
    // }
    // v['delivery'] ={
    //   id: "-1",
    //   accounthead: "",
    //   defaultgroup: "",
    //   relationship: "-1",
    //   neid: "-1",
    //   person: "-1",
    //   name: "",
    //   endpoint: "",
    //   rtype: ""
    // }
    // v['title'] = ""
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    
    v['relateditem'] = this.selectedRelatedItem
    v['files'] = []
    v['expirydate'] = this.selectedExpiryDate
    //v['vendorperson'] = null
    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    v['location'] = this.selectedFromLocation

    v['title'] = this.selectedTitleOption

    v['serialno'] = this.selectedSNO
    v['batchno'] = this.selectedBNO
    v['brand'] = this.selectedBrand

    return v

  }


  handleUpdateVoucher() {

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

    if ((typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) && this.selectedTitleOption === 'ownership') {
      this.confirm('You must select an account')
      return false
    }

    if (typeof this.selectedFromLocation === 'undefined' || this.selectedFromLocation == null || this.selectedFromLocation === '') {
      this.confirm('You must select a location')
      return false
    }

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

    //this.pcchange(this.ri)
    
    v['action'] = 'prod'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem)) // only this.selectedItem because it is assigned in handleEditVoucher
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    // v['fromdatetime'] = 'infinity'
    // v['todatetime'] = 'infinity'
    // v['duedatetime'] = 'infinity'
    v['originalrateaftertaxes'] = this.selectedUIR
    // if(this.ri === 'rit'){
    //   v['rateincludesvat'] = true
    // }
    // if(this.ri === 'ret') {
    //   v['rateincludesvat'] = false
    // }

    // v['taxes'] = JSON.parse(JSON.stringify(this.selectedTaxes))
    // if(isNaN(this.selectedDiscountPercent)) {
    //   this.selectedDiscountPercent = 0
    // }
    // v['discountpercent'] = this.selectedDiscountPercent
    // v['discountamount'] = this.selectedDiscountAmount
    // v['rateafterdiscount'] = this.rad
    // v['rateaftertaxes'] = this.rat
    // v['taxfactor'] = 0
    // v['taxesperunit'] = this.t
    v['uom'] = {
      uom: "",
      symbol: "",
      country: ""
    }
    // v['nonvattaxperunit'] = this.nonvattaxperunit
    // v['vattaxperunit'] = this.vattaxperunit
    // v['nonvatpercent'] = this.totalnonvatperc
    // v['vatpercent'] = this.totalvatperc
    // v['ratebeforetaxes'] = this.rbt

    // v['intofrom'] = {
    //   id: "0",
    //   itemname: "",
    //   iscontainer: "True",
    //   usercode: "",
    //   uom: {
    //     uom: "each",
    //     symbol: "each",
    //     country: "global"
    //   },
    //   taxes: [],
    //   files: [],
    //   recipe: {
    //     consumedunits: [],
    //     byproducts: []
    //   }
    // }
    // v['by'] = {
    //   itemid: "0",
    //   neid: "",
    //   relationshipid: "",
    //   name: ""
    // }
    // v['delivery'] ={
    //   id: "-1",
    //   accounthead: "",
    //   defaultgroup: "",
    //   relationship: "-1",
    //   neid: "-1",
    //   person: "-1",
    //   name: "",
    //   endpoint: "",
    //   rtype: ""
    // }
    // v['title'] = ""
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    v['relateditem'] = this.selectedRelatedItem
    v['files'] = []
    v['expirydate'] = this.selectedExpiryDate
    // v['vendorperson'] = null
    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    v['location'] = this.selectedFromLocation

    v['title'] = this.selectedTitleOption

    v['serialno'] = this.selectedSNO
    v['batchno'] = this.selectedBNO
    v['brand'] = this.selectedBrand

    return v

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
    this.selectedAccountMap = null
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

  handleSaveSale() {
    

    if(this.selectedVouchers.length === 0) {
      this.confirm('You must enter atleast one voucher')
      return false
    }

    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(this.selectedDate)
    newInvoice['vouchers'] = this.selectedVouchers
    newInvoice['type'] = 'production'

    console.log('PRODUCTION INVOICE TO BE SAVED',JSON.stringify(newInvoice))

    this.saveProduction(newInvoice)

    return false

  }


  saveProduction(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveProductionService = new SaveProductionService(this.httpClient)
    this._siSub = sah.saveProduction(newInvoice).subscribe({
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

}
