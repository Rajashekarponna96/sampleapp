
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
import { GlobalConstants } from 'src/app/global/global-constants';

import { ProfileService } from 'src/app/services/profile.service';
import { PersonService } from 'src/app/services/person.service';
import { SendHTMLInvoiceLinkService } from 'src/app/services/send-htmlinvoice-link.service';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { UpdateSaleInvoiceService } from 'src/app/services/update-sale-invoice.service';
import { StockLocationBalanceService } from 'src/app/services/stock-location-balance.service';
import { StockLocationListService } from 'src/app/services/stock-location-list.service';




@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class SalesComponent implements OnInit {

  selectedStockBalances:any[] = []
  selectedStockLocationBalance:any[] = []
  
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

  displayOptionsModal:boolean = false
  selectedPaymentMethods:string = ""
  

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

  viewPartyName:any;
  viewTotal:number = 0

  displayReturnModal:boolean = false
  displaySubEditReturnModal:boolean = false

  selectedReturnVouchers:any[] = []

  saleInvoiceID:any

  offset:number = 0

  lo:any

  _ahlSub:any

  selectedPerson:any = {}
  selectedEntityName:string = ""
  selectedEntityAddress:string = ""
  selectedEntityTelephone:string = ""
  selectedEntityEmail:string = ""
  selectedEntityGSTNumber:string = ""
  selectedInvoiceDate:string = ""
  selectedInvoiceNumber:string = ""

  selectedPartyName:string = ""
  selectedPartyEndpoint:string = ""
  selectedPartyTel:string = ""
  selectedPartyEmail:string = ""
  selectedPartyAddr:string = ""

  selectedGSTCode:string = ""
  
  selectedPlaceOfSale:string = ""
  selectedEWayBillNo:string = ""
  selectedPONO:string = ""

  selectedPartyGSTCode:string = ""
  selectedPurchaseOrderDate:string = ""
  selectedPONumber:string = ""
  selectedPODate:Date = new Date()
  selectedPOFormattedDate:string = ''

  selectedTotalSale:string = ""
  selectedTotalDiscAmt:string = ""
  selectedTotalTaxableValue:string = ""
  selectedCGSTTotalAmt:string = ""
  selectedSGSTTotalAmt:string = ""
  selectedIGSTTotalAmt:string = ""

  selectedAmountInWords:string = ""

  selectedTotalGST:string = ""

  selectedGrandTotal:string = ""


  displaySendInvoiceModal:boolean = false
  filteredEndpoints:any[] = []
  selectedEndpoint:any = {}

  base64Invoice:string = ''

  selectedPartyPerson:any = {}
  selectedEntityPerson:any = {}

  pid:any
  
  whatsappShortName:string = ""

  _piSub:any

  poDateChangedStatus:boolean = false

  selectedLocationQty = 0

  selectedFromLocation:any
  filteredFromLocations:any[] = new Array
  @ViewChild('selectFromLocation') selectFromLocation:any
  placeholderFromLocation = 'select location'

  selectedSNOBoolean:any
  selectedBNOBoolean:any
  selectedEDTBoolean:any
  selectedBrandBoolean:any

  selectedValues: string[] = [];

  sbcols: any[] = new Array;

  titleOptions:any[] = [{type:'ownership'},{type:'possession'},{type:''}]
  selectedTitleOption:any
  disableTitleOption:boolean = false

  disableDynPrice:boolean = true
  

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.lo = GlobalConstants.loginObject
    this.loadInvoices(0,0)

    this.viewPartyName = ''
    this.viewTotal = 0

    this.selectedPartyName = ''

    this.lo = GlobalConstants.loginObject;
    if (!this.lo.hasOwnProperty('whatsappshortname')) {
      this.lo.whatsappshortname = '';
    }
    this.whatsappShortName = this.lo.whatsappshortname;

    this.sbcols = [
      {field: 'balance'},
      {field: 'rate'},
      {field: 'inputqty'},
      {field: 'title'}
    ]

    this.loadEntity()

  }


  sanitizeInvoices() {
    for (let index = 0; index < this.saleList.length; index++) {
      const element = this.saleList[index];

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

  loadInvoices(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'sales',attribute:''};
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
    this.disableDynPrice = true
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

  poDateSelected(event:any) {

    console.log('PO DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('PO ISO DATE',isoDateTime)
    this.poDateChangedStatus = true
    //this.selectedPODate = isoDateTime
    //this.selectedDate = isoDateTime
   
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
    
    this.selectedItem = v.object
    this.selectedUIR = v.userinputrate
    this.selectedQty = v.quantity
    this.selectedStockBalances = this.uneditedSbs
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
    this.pcchange(ri)
    this.selectedVoucherid = v.recordid
    this.displaySubEditModal = true

  }

  handleDeleteVoucher(v:any) {
    this.selectedVouchers.splice(v,1)
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

    // here we'll add DYNAMIC sale price

    let dyncp:any = {
      context: 'DYNAMIC',
      saleprice: 0,
      taxes: []
    }

    this.selectedItem.contextprices = [...this.selectedItem.contextprices,dyncp]

    
    const dictionary = {
      'id':this.selectedItem.itemdef.id,
      'serialnumber': this.selectedValues.includes('val1'),
      'batchnumber': this.selectedValues.includes('val2'),
      'expirydate': this.selectedValues.includes('val3'),
      'brand': this.selectedValues.includes('val4')
    }; 

    this.loadStockBalance(dictionary)
    this.loadStockLocationBalance(this.selectedItem.itemdef.id)

    this.selectedContextPrices = this.selectedItem.contextprices

    console.log('SELECTED CPS',this.selectedContextPrices)

    //return

    this.rat = 0
    this.rbt = 0
    this.t = 0
    this.selectedUOM = this.selectedItem.itemdef.uom.uom

    this.pcchange(this.ri)


  }

  snoBoolChange(event:any) {
    console.log('EV',this.selectedValues)

    const dictionary = {
      'id':this.selectedItem.itemdef.id,
      'serialnumber': this.selectedValues.includes('val1'),
      'batchnumber': this.selectedValues.includes('val2'),
      'expirydate': this.selectedValues.includes('val3'),
      'brand': this.selectedValues.includes('val4')
    };

    this.loadStockBalance(dictionary)
    this.loadStockLocationBalance(this.selectedItem.itemdef.id)
    this.selectedQty = 0
  }

  bnoBoolChange(event:any) {
    console.log('EV',this.selectedValues)
    const dictionary = {
      'id':this.selectedItem.itemdef.id,
      'serialnumber': this.selectedValues.includes('val1'),
      'batchnumber': this.selectedValues.includes('val2'),
      'expirydate': this.selectedValues.includes('val3'),
      'brand': this.selectedValues.includes('val4')
    };

    this.loadStockBalance(dictionary)
    this.loadStockLocationBalance(this.selectedItem.itemdef.id)
    this.selectedQty = 0
  }

  edtBoolChange(event:any) {
    console.log('EV',this.selectedValues)
    console.log('EV',this.selectedValues)
    const dictionary = {
      'id':this.selectedItem.itemdef.id,
      'serialnumber': this.selectedValues.includes('val1'),
      'batchnumber': this.selectedValues.includes('val2'),
      'expirydate': this.selectedValues.includes('val3'),
      'brand': this.selectedValues.includes('val4')
    };

    this.loadStockBalance(dictionary)
    this.loadStockLocationBalance(this.selectedItem.itemdef.id)
    this.selectedQty = 0
  }

  brandBoolChange(event:any) {
    console.log('EV',this.selectedValues)
    console.log('EV',this.selectedValues)
    const dictionary = {
      'id':this.selectedItem.itemdef.id,
      'serialnumber': this.selectedValues.includes('val1'),
      'batchnumber': this.selectedValues.includes('val2'),
      'expirydate': this.selectedValues.includes('val3'),
      'brand': this.selectedValues.includes('val4')
    };

    this.loadStockBalance(dictionary)
    this.loadStockLocationBalance(this.selectedItem.itemdef.id)
    this.selectedQty = 0
  }


  loadStockBalance(itemid:any) {

    this.inStockBalanceProgress = true

    console.log('IN STOCK BALANCES')
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = itemid;
    console.log('CRITERIA',criteria)
    let iService:StockBalanceItemService = new StockBalanceItemService(this.httpClient)
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
          this.inStockBalanceProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.selectedStockBalances = dataSuccess.success;
          let tempsbs = []
          for (let index = 0; index < this.selectedStockBalances.length; index++) {
            const element = this.selectedStockBalances[index];
            element['id'] = index
            element['inputqty'] = 0
            if(element['balance'] > 0) {
              tempsbs.push(element)
            }
          }
          this.selectedStockBalances = tempsbs

          if (this.selectedStockBalances.length > 0) {
            let obj = this.selectedStockBalances[0]
            const dictionaryList = Object.keys(obj).map(key => {
              return { field: key };
            });
            this.sbcols = dictionaryList
          }

          console.log('STOCK BALANCES',this.selectedStockBalances)
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


  cpChange(event:any) {

    console.log('CP DROPDOWN CHANGE',event.value)

    if (event.value.context === 'DYNAMIC') {
      this.disableDynPrice = false
    }
    else if (event.value.context !== 'DYNAMIC') {
      this.disableDynPrice = true
    }

    if(event.value !== null) {

      this.selectedUIR = event.value.saleprice
      this.selectedTaxes = event.value.taxes

      // if context is DYNAMIC, selected UIR is dynamic price input

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


  


  onNewSearchChange(event:any,i:any,sb:any): void {
    
    sb.inputqty = event.target.value
    
    this.selectedQty = 0

    if(parseFloat(this.selectedStockBalances[i].inputqty) < 0){
      this.confirm('You cannot issue negative stock')
      event.target.value = 0
      sb.inputqty = 0
    }

    if(parseFloat(sb.balance) < parseFloat(event.target.value)) {
      this.confirm('You cannot issue stock more than the available quantity')
      event.target.value = 0
      sb.inputqty = 0
    }

    this.selectedQty = 0
    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      this.selectedQty = parseFloat(element.inputqty) + this.selectedQty
      
    }

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

    this.selectedAccountMap = null
    
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

    this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    this.selectedUIR = 0
    this.selectedQty = 0
    this.selectedAccountMap = null
    this.selectedUOM = ""
    this.selectedTaxes = []
    this.inputDiscount = 0
    this.rad = 0
    this.pcchange('rit')
    this.selectedStockBalances = []
    this.selectedContextPrices = []
    this.displaySubModal = true;

  }

  handleAddVoucher(){

    console.log('ITEM',this.selectedItem)
    console.log('QUANTITY',this.selectedQty)
    console.log('USER INPUT RATE',this.selectedUIR)

    if (typeof this.selectedItem === 'undefined' || this.selectedItem == null) {
      this.confirm('You must select an item')
      return false
    }
    if (typeof this.selectedQty === 'undefined' || this.selectedQty == null || this.selectedQty === 0) {
      this.confirm('You must enter a quantity greater than zero')
      return false
    }

    if (typeof this.selectedLocationQty === 'undefined' || this.selectedLocationQty == null || this.selectedLocationQty === 0) {
      this.confirm('You must enter a location quantity greater than zero')
      return false
    }

    if(this.selectedQty != this.selectedLocationQty) {
      this.confirm('You must enter a location quantity equal to actual quantity')
      return false
    }

    if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
      this.confirm('You must enter a sale price greater than or equal to zero')
      return false
    }

    if ((typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) && this.selectedTitleOption === 'ownership') {
      this.confirm('You must select an account')
      return false
    }

    if(this.taxPartyCheck()) {
      this.confirm('One or more tax entries do not have tax authority selected.')
      return false
    }


    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      if (element.title === 'possession' && this.selectedTitleOption === 'ownership') {
        this.confirm('One or more items that are on possession are being transfered with ownership title.')
        return false
      }
    }


    this.pcchange(this.ri)

    let v:any = this.buildVoucher()
    this.selectedVouchers.push(v)
    
    this.displaySubModal = false
    return false

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
    v['action'] = 'iss'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem.itemdef))
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
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
    v['title'] = this.selectedTitleOption

    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null
    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    this.uneditedSbs = JSON.parse(JSON.stringify(this.selectedStockBalances))
    
    let sbs = []
    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      if(parseFloat(element.inputqty) > 0) {
        sbs.push(element)
      }
    }

    v['stockbalanceinputs'] = sbs


    let slbs = []
    for (let index = 0; index < this.selectedStockLocationBalance.length; index++) {
      const element = this.selectedStockLocationBalance[index];
      if(parseFloat(element.inputqty) > 0) {
        slbs.push(element)
      }
    }

    v['stocklocationbalanceinputs'] = slbs

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

    if (typeof this.selectedLocationQty === 'undefined' || this.selectedLocationQty == null || this.selectedLocationQty === 0) {
      this.confirm('You must enter a location quantity greater than zero')
      return false
    }

    if(this.selectedQty != this.selectedLocationQty) {
      this.confirm('You must enter a location quantity equal to actual quantity')
      return false
    }

    if (typeof this.selectedUIR === 'undefined' || this.selectedUIR == null) {
      this.confirm('You must enter a quantity greater than or equal to zero')
      return false
    }

    if ((typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null) && this.selectedTitleOption === 'ownership') {
      this.confirm('You must select an account')
      return false
    }

    if(this.taxPartyCheck()) {
      this.confirm('One or more tax entries do not have tax authority selected.')
      return false
    }

    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      if (element.title === 'possession') {
        this.confirm('One or more items that are on possession are being sold.')
        return false
      }
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
    
    v['action'] = 'iss'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem)) // only this.selectedItem because it is assigned in handleEditVoucher
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
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
    v['title'] = this.selectedTitleOption
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null
    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    this.uneditedSbs = JSON.parse(JSON.stringify(this.selectedStockBalances))

    let sbs = []
    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      if(parseFloat(element.inputqty) > 0) {
        sbs.push(element)
      }
    }

    v['stockbalanceinputs'] = sbs

    let slbs = []
    for (let index = 0; index < this.selectedStockLocationBalance.length; index++) {
      const element = this.selectedStockLocationBalance[index];
      if(parseFloat(element.inputqty) > 0) {
        slbs.push(element)
      }
    }

    v['stocklocationbalanceinputs'] = slbs


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

    if (!this.displayReturnModal) {
      if(this.selectedItem === null) {
        this.confirm('You must select an item')
        return
      }
      else if (this.selectedItem.itemdef.itemfatype === 'stock') {
        searchtype = 'stockitem-accounthead-contains'
      }
      else if(this.selectedItem.itemdef.itemfatype === 'asset') {
        searchtype = 'assetitem-accounthead-contains'
      }
      else if(this.selectedItem.itemdef.itemfatype === 'other') {
        searchtype = 'otheritem-accounthead-contains'
      } 
    }

    else if (this.displayReturnModal) {
      if (this.selectedItem.itemfatype === 'stock') {
        searchtype = 'stockitem-accounthead-contains'
      }
      else if(this.selectedItem.itemfatype === 'asset') {
        searchtype = 'assetitem-accounthead-contains'
      }
      else if(this.selectedItem.itemfatype === 'other') {
        searchtype = 'otheritem-accounthead-contains'
      }
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






  filterAccountMapsForEdit(event:any) {
    console.log('IN FILTER PARTIES FOR EDIT',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    
    let searchtype = ''
    console.log('SELECTED ITEM',this.selectedItem)

    if (!this.displayReturnModal) {
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
    }

    else if (this.displayReturnModal) {
      if (this.selectedItem.itemfatype === 'stock') {
        searchtype = 'stockitem-accounthead-contains'
      }
      else if(this.selectedItem.itemfatype === 'asset') {
        searchtype = 'assetitem-accounthead-contains'
      }
      else if(this.selectedItem.itemfatype === 'other') {
        searchtype = 'otheritem-accounthead-contains'
      }
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
    this.selectedEntity = {
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
    newInvoice['salesformtype'] = 'sale'

    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))

    this.saveSale(newInvoice)

    return false
  }


  saveSale(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveSaleService = new SaveSaleService(this.httpClient)
    this._siSub = sah.saveSale(newInvoice).subscribe({
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












  // SALE RETURN // SALE RETURN // SALE RETURN // SALE RETURN // SALE RETURN // SALE RETURN // SALE RETURN //



  handleReturn(inv:any) {


    let lo:any = GlobalConstants.loginObject
    if(this.haskeys(lo.digitalkey)) {
      if(!lo.digitalkey.purchases.edit) {
        this.confirm("You are not permitted to use this feature.")
        return
      }
    }
    else if(!this.haskeys(lo.digitalkey)) {
      console.log('NO KEYS ARE DEFINED')
    }

    this.saleInvoiceID = inv.id
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
    this.selectedStockBalances = JSON.parse(JSON.stringify(v.stockbalanceinputs))

    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];
      element.balance = element.inputqty
      element.inputqty = 0
    }

    if (this.selectedStockBalances.length > 0) {
      let obj = this.selectedStockBalances[0]
      const dictionaryList = Object.keys(obj).map(key => {
        return { field: key };
      });
      this.sbcols = dictionaryList
    }

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
    this.selectedVoucherid = v.recordid

    this.selectedTitleOption = v.title
    this.titleOptionChange(v.title)

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

    for (let index = 0; index < this.selectedStockBalances.length; index++) {
      const element = this.selectedStockBalances[index];

      let newV:any = this.rebuildReturnVoucher(v,element)
      if (element.hasOwnProperty('serialno')) {
        newV.serialno = element.serialno;
      }
      if (element.hasOwnProperty('batchno')) {
        newV.batchno = element.batchno;
      }
      if (element.hasOwnProperty('brand')) {
        newV.brand = element.brand;
      }
      if (element.hasOwnProperty('expirydate')) {
        newV.expirydate = element.expirydate;
      }

      vouchers.push(newV)
      
    }

    
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

    if (typeof this.selectedFromLocation === 'undefined' || this.selectedFromLocation == null || this.selectedFromLocation === '') {
      this.confirm('You must select a location')
      return false
    }

    this.displaySubEditReturnModal = false

    return false
  }


  

  rebuildReturnVoucher(v:any,sbi:any) {
    


    let newV:any = JSON.parse(JSON.stringify(v))

    newV['action'] = 'rec'
    newV['quantity'] = sbi.inputqty
    newV['originalrateaftertaxes'] = sbi.rate
    newV['expirydate'] = sbi.expirydate
    newV['salevoucherid'] = v.id
    newV['location'] = this.selectedFromLocation

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


  handleSaveSaleReturn() {
    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(this.selectedDate)
    newInvoice['entity'] = this.selectedEntity
    newInvoice['partyaccounthead'] = this.selectedParty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedReturnVouchers
    newInvoice['saleformid'] = this.saleInvoiceID
    //newInvoice['salesformtype'] = 'sale'

    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))


    this.saveSaleReturn(newInvoice)
    
 
  }



  saveSaleReturn(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveSaleReturnService = new SaveSaleReturnService(this.httpClient)
    this._siSub = sah.saveSaleReturn(newInvoice).subscribe({
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
          this.eventBusService.emit(new EventData('SalesReturn','salesreturn'))
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
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'sales',attribute:''};
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
          let newSales:any[] = dataSuccess.success
          for (let index = 0; index < newSales.length; index++) {
            const element = newSales[index];
            this.saleList.push(JSON.parse(JSON.stringify(element)))
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





  

  





  



  



  formatNumber(n:any):string {
    let td = 4000.6984;
    let formatted = n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    console.log('FORMATTED',formatted);
    return formatted
  }


  


  numberToWords(num: any): any {

    console.log("NUMNUM", num)

    let ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    let tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  
    if (num < 20) {
      return ones[num];
    }
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
    }
    if (num < 1000) {
      return ones[Math.floor(num / 100)] + " hundred" + (num % 100 !== 0 ? " and " + this.numberToWords(num % 100) : "");
    }
    if (num < 100000) {
      return this.numberToWords(Math.floor(num / 1000)) + " thousand" + (num % 1000 !== 0 ? " " + this.numberToWords(num % 1000) : "");
    }
    if (num < 10000000) {
      return this.numberToWords(Math.floor(num / 100000)) + " lakh" + (num % 100000 !== 0 ? " " + this.numberToWords(num % 100000) : "");
    }
    if (num < 1000000000) {
      return this.numberToWords(Math.floor(num / 10000000)) + " crore" + (num % 10000000 !== 0 ? " " + this.numberToWords(num % 10000000) : "");
    }
    return this.numberToWords(Math.floor(num / 1000000000)) + " billion" + (num % 1000000000 !== 0 ? " " + this.numberToWords(num % 1000000000) : "");
  }
  

  


  numberToCurrency(num: number): string {

    console.log('NUMBER',num)
    //return ''

    const wholeNum = Math.floor(num); // 1514
    const fraction = +(num - wholeNum).toFixed(2); // 0.29

    let newfrac = parseInt((fraction * 100).toFixed(2))
    //console.log('UNFLOORED',parseInt(newfrac.toFixed(2)))
    //console.log('NEWFRAC',Math.floor(newfrac))

    let currency = "";
  
    if (wholeNum > 0) {
      currency = this.numberToWords(wholeNum) + " rupees";
    } else {
      currency = "zero rupees";
    }
  
    if (newfrac > 0) {
      currency += " and " + this.numberToWords(newfrac) + " paise";
    }
  
    return currency;

  }
  
  
  
  handleSendInvoice(invoice:any) {

    console.log('PAH',invoice.partyaccounthead)
    this.pid = invoice.partyaccounthead.id

    this.loadParty(this.pid)

    this.base64Invoice = btoa(this.makeHtmlString(invoice))
    

    // get person from api
  }


  sendInvoice() {

    this.lo.whatsappshortname = this.whatsappShortName;
    GlobalConstants.loginObject = this.lo;

    //console.log('A PRINT',this.base64Invoice)
    // call api to send base64
    console.log('WHATSAPP',this.selectedEndpoint)
    //console.log('PID',this.pid)
    // url
    // pid
    //console.log(window.location.href);

    let url = window.location.href
    //let domain = url.split("//")[-1].split("/")[0].split(":")[0]
    const domain = new URL(url).hostname;

    if (!this.selectedEndpoint || Object.keys(this.selectedEndpoint).length === 0) {
      // this.selectedEndpoint is empty
      this.confirm('You must select a telephone number')
      return
    }

    if (this.selectedEndpoint === null) {
      this.confirm('You must select a telephone number')
      return
    }
    if(this.whatsappShortName === '') {
      this.confirm('You must enter a short name')
      return
    }

    let a:any = {
      html:this.base64Invoice,
      url:domain,
      ahid:this.pid,
      phone:this.selectedEndpoint.endpointdetail,
      entityname:this.whatsappShortName
    }

    console.log('A',a)

    

    this.handleSendLink(a)

  }







  makeHtmlString(invoice:any):string {

    

    let style:string = `<style type="text/css">*{margin:0;padding:0;text-indent:0}.s1{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:15pt}.s2{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:8pt}.s3{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:5pt}.s4{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:10.5pt}.s5{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:4.5pt}.s6{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:5.5pt}.s7{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:7.5pt}.s8{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:8.5pt}.s9{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:9pt}.s10{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:400;text-decoration:none;font-size:5pt}.s11{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6.5pt}.s12{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6pt}.s13{color:red;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6pt}table,tbody{vertical-align:top;overflow:visible}</style>`
    
    

    let compheader = '<p style="text-indent:0;text-align:left"><br></p><table style="border-collapse:collapse;margin-left:5.97pt" cellspacing="0"><tr style="height:46pt"><td style="width:560pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="14"><p class="s1" style="padding-top:1pt;padding-left:100pt;padding-right:101pt;text-indent:0;text-align:center">'+this.selectedEntityName+'</p><p class="s2" style="padding-left:174pt;padding-right:175pt;text-indent:0;line-height:111%;text-align:center"><a href="mailto:info@netlogon.in" class="s2" target="_blank">'+this.selectedEntityAddress+' E-mail:</a>'+this.selectedEntityEmail+', Cell.: '+this.selectedEntityTelephone+'</p></td></tr>' 

    let invtitle = '<tr style="height:14pt"><td style="width:560pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="14"><p class="s4" style="padding-left:100pt;padding-right:100pt;text-indent:0;text-align:center">GST INVOICE</p></td></tr>'

    let billto = '<tr style="height:9pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="5"><p style="text-indent:0;text-align:left"><br></p><p class="s5" style="padding-left:10pt;text-indent:0;text-align:left">BILL TO</p></td><td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2" rowspan="5"><p style="text-indent:0;text-align:left"><br></p><p class="s6" style="padding-left:1pt;text-indent:0;text-align:left">TO</p><p class="s6" style="padding-left:1pt;text-indent:0;line-height:115%;text-align:left">'+this.selectedPartyName+', '+this.selectedPartyEndpoint+'</p></td>'

    let shiptogst = '<td style="width:176pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="5"><p class="s7" style="padding-left:71pt;padding-right:71pt;text-indent:0;line-height:7pt;text-align:center">SHIP TO</p></td><td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-left:20pt;text-indent:0;line-height:7pt;text-align:left">GSTIN:</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s9" style="padding-left:5pt;text-indent:0;line-height:7pt;text-align:left">'+this.selectedEntityGSTNumber+'</p></td><tr style="height:10pt"><td style="width:176pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="5" rowspan="4"><p style="text-indent:0;text-align:left"><br></p><p class="s10" style="padding-left:1pt;text-indent:0;text-align:left">TO</p><p class="s10" style="padding-left:1pt;text-indent:0;line-height:111%;text-align:left">'+ this.selectedPartyName+', '+this.selectedPartyEndpoint+'</p></td>'

    let invoicenumber = '<td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-left:7pt;text-indent:0;line-height:9pt;text-align:left">INVOICE NO.</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s7" style="padding-left:5pt;text-indent:0;text-align:left">'+this.selectedInvoiceNumber+'</p></td>'

    let invoicedate = '<tr style="height:10pt"><td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-left:2pt;text-indent:0;line-height:9pt;text-align:left">INVOICE DATE:</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s7" style="padding-left:5pt;text-indent:0;text-align:left">'+this.selectedInvoiceDate+'</p></td></tr>'

    let placeofsale = '<tr style="height:10pt"><td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-left:2pt;text-indent:0;line-height:9pt;text-align:left">POS</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s7" style="padding-left:5pt;text-indent:0;text-align:left">'+this.selectedPlaceOfSale+'</p></td></tr>'

    let ewaybillno = '<tr style="height:10pt"><td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-left:2pt;text-indent:0;line-height:9pt;text-align:left">E-Way Bill No:</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s7" style="padding-left:5pt;text-indent:0;text-align:left">'+this.selectedEWayBillNo+'</p></td></tr>'

    let partygstcodeorderdatenumber = '<tr style="height:10pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s5" style="padding-top:2pt;text-indent:0;text-align:center">GSTIN</p></td><td style="width:162pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-left:1pt;text-indent:0;text-align:left">'+this.selectedPartyGSTCode+'</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s6" style="padding-top:1pt;padding-right:1pt;text-indent:0;text-align:center">PO.NO.</p></td><td style="width:224pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="6"><p class="s11" style="padding-left:5pt;text-indent:0;text-align:left">'+this.selectedPONO+'</p></td><td style="width:30pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s6" style="padding-top:1pt;padding-left:9pt;text-indent:0;text-align:left">Date</p></td><td style="width:106pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s5" style="padding-top:1pt;padding-left:5pt;text-indent:0;text-align:left">'+this.selectedPOFormattedDate+'</p></td></tr>'

    let voucherheader = '<tr style="height:10pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:1pt;padding-left:3pt;text-indent:0;text-align:left">Sl.</p><p class="s7" style="padding-left:2pt;text-indent:0;text-align:left">No.</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:34pt;text-indent:0;text-align:left">Product Description</p></td><td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s6" style="padding-top:4pt;padding-left:2pt;text-indent:0;text-align:left">HSN/SA</p><p class="s6" style="padding-top:1pt;padding-left:3pt;text-indent:0;text-align:left">C Code</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:5pt;text-indent:0;text-align:left">Qty</p></td><td style="width:37pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:11pt;text-indent:0;text-align:left">Rate</p></td><td style="width:41pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:3pt;text-indent:0;text-align:left">Total Sale</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:3pt;text-indent:0;text-align:left">Disc.</p></td><td style="width:54pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" rowspan="2"><p class="s7" style="padding-top:6pt;padding-left:3pt;text-indent:0;text-align:left">Taxable Value</p></td><td style="width:70pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-left:24pt;padding-right:23pt;text-indent:0;line-height:9pt;text-align:center">CGST</p></td><td style="width:73pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-left:25pt;padding-right:25pt;text-indent:0;line-height:9pt;text-align:center">SGST</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-left:21pt;padding-right:21pt;text-indent:0;line-height:9pt;text-align:center">IGST</p></td></tr><tr style="height:12pt"><td style="width:28pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;text-indent:0;text-align:right">Rate %</p></td><td style="width:42pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;padding-left:7pt;text-indent:0;text-align:left">Amount</p></td><td style="width:30pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;padding-right:2pt;text-indent:0;text-align:right">Rate %</p></td><td style="width:43pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;padding-left:7pt;text-indent:0;text-align:left">Amount</p></td><td style="width:31pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;padding-left:1pt;padding-right:1pt;text-indent:0;text-align:center">Rate %</p></td><td style="width:32pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:1pt;padding-left:1pt;padding-right:1pt;text-indent:0;text-align:center">Amount</p></td></tr>'


    let vouchers = invoice.vouchers

    let vlines = ''

    let ts:number = 0 //total sale
    let td:number = 0 // total discount
    let ttv:number = 0 // total taxable value
    let tcgst:number = 0
    let tsgst:number = 0
    let tigst:number = 0
    let sumgst:number = 0
    let gt:number = 0

    


    for (let index = 0; index < vouchers.length; index++) {
      const element = vouchers[index];

      let cgstamt = 0
      let cgstrat = 0
      let sgstamt = 0
      let sgstrat = 0
      let igstamt = 0
      let igstrat = 0
      

      if(element.taxes.length == 0) {

      }
      if(element.taxes.length == 1) {
        cgstamt = element.taxes[0].taxamount * element.quantity 
        cgstrat = element.taxes[0].taxpercent
      }
      if(element.taxes.length == 2) {
        cgstamt = element.taxes[0].taxamount * element.quantity
        cgstrat = element.taxes[0].taxpercent
        sgstamt = element.taxes[1].taxamount * element.quantity
        sgstrat = element.taxes[1].taxpercent  
      }
      if(element.taxes.length == 3) {
        cgstamt = element.taxes[0].taxamount * element.quantity
        cgstrat = element.taxes[0].taxpercent
        sgstamt = element.taxes[1].taxamount * element.quantity
        sgstrat = element.taxes[1].taxpercent
        igstamt = element.taxes[2].taxamount * element.quantity
        igstrat = element.taxes[2].taxpercent

      }
      
      console.log('TAXES',element)
      let hsncode = ''
      if (element.taxes.length > 0) {
        hsncode = element.taxes[0].taxcode
      }
       

      vlines = vlines + '<tr style="height:35pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-left:1pt;text-indent:0;text-align:center">'+(index+1).toString()+'</p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s6" style="padding-left:1pt;text-indent:0;line-height:6pt;text-align:justify">'+element.object.itemname+' '+element.object.uom.uom+'</p></td><td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-left:5pt;text-indent:0;text-align:left">'+hsncode+'</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="text-indent:0;text-align:center">'+this.formatNumber(element.quantity)+'</p></td><td style="width:37pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(element.userinputrate)+'</p></td><td style="width:41pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(element.quantity*element.userinputrate)+'</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(element.discountamount*element.quantity)+'</p></td><td style="width:54pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber((element.quantity*element.userinputrate)-(element.quantity*element.discountamount))+'</p></td><td style="width:28pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:1pt;text-indent:0;text-align:right">'+this.formatNumber(cgstrat)+'%</p></td><td style="width:42pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:1pt;text-indent:0;text-align:right">'+this.formatNumber(cgstamt)+'</p></td><td style="width:30pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:1pt;text-indent:0;text-align:right">'+this.formatNumber(sgstrat)+'%</p></td><td style="width:43pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-right:1pt;text-indent:0;text-align:right">'+this.formatNumber(sgstamt)+'</p></td><td style="width:31pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-left:3pt;padding-right:1pt;text-indent:0;text-align:center">'+this.formatNumber(igstrat)+'%</p></td><td style="width:32pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p><p class="s7" style="padding-left:3pt;padding-right:1pt;text-indent:0;text-align:center">'+this.formatNumber(igstamt)+'</p></td></tr>'
      
      ts = ts+(parseFloat(element.userinputrate)*parseFloat(element.quantity))
      td = td+(parseFloat(element.discountamount)*parseFloat(element.quantity))
      tcgst = tcgst +cgstamt
      tsgst = tsgst +sgstamt
      tigst = tigst +igstamt

    }

    ttv = ts - td
    sumgst = tcgst+tsgst+tigst

    gt = ttv+sumgst

    this.selectedAmountInWords = 'Rupees '+this.numberToCurrency(gt)

    console.log('VLINES',vlines)

    this.selectedTotalDiscAmt = this.formatNumber(td)


    let emptyrowspace = '<tr style="height:35pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:26pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:37pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:41pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:54pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:28pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:42pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:30pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:43pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:31pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:32pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td></tr><tr style="height:45pt"><td style="width:560pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="14"><p style="text-indent:0;text-align:left"><br></p></td></tr>'

    let totals = '<tr style="height:15pt"><td style="width:237pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="5"><p class="s6" style="padding-top:3pt;padding-right:1pt;text-indent:0;text-align:right">TOTAL</p></td><td style="width:41pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:3pt;text-indent:0;text-align:right;padding-right:5pt">'+this.formatNumber(ts)+'</p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:3pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(td)+'</p></td><td style="width:54pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:3pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(ttv)+'</p></td><td style="width:28pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:42pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:3pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(tcgst)+'</p></td><td style="width:30pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:43pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s7" style="padding-top:3pt;padding-right:13pt;text-indent:0;text-align:right">'+this.formatNumber(tsgst)+'</p></td><td style="width:31pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:32pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p class="s6" style="padding-top:4pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(tigst)+'</p></td></tr>'

    let remarks = '<tr style="height:8pt"><td style="width:300pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="7"><p class="s6" style="padding-left:1pt;text-indent:0;line-height:6pt;text-align:left">Remarks:</p></td><td style="width:197pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="5"><p class="s5" style="padding-left:88pt;padding-right:88pt;text-indent:0;text-align:center">Summary</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s5" style="padding-left:21pt;padding-right:21pt;text-indent:0;text-align:center">Amount</p></td></tr>'

    let amtinwords = '<tr style="height:16pt"><td style="width:382pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="9"><p class="s6" style="padding-top:4pt;padding-left:1pt;text-indent:0;text-align:left">'+this.selectedAmountInWords+'</p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-left:59pt;text-indent:0;text-align:left">Total Invoice Value</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-top:2pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(ts)+'</p></td></tr>'

    let paymethoddiscamt = '<tr style="height:16pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:221pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4" rowspan="3"><p class="s6" style="padding-top:5pt;padding-left:1pt;text-indent:0;text-align:left">Payment Methods: '+this.selectedPaymentMethods+'</p></td><td style="width:145pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4" rowspan="3"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-left:70pt;text-indent:0;text-align:left">Total Discounts</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p style="text-indent:0;text-align:left"><br></p><p class="s5" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(td)+'</p></td></tr>' 

    let totaltaxablevalue = '<tr style="height:16pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-left:57pt;text-indent:0;text-align:left">Total Taxable Value</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-top:2pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(ttv)+'</p></td></tr>'

    let totalcgstamt = '<tr style="height:17pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:4pt;padding-right:1pt;text-indent:0;text-align:right">Total CGST</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-top:3pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(tcgst)+'</p></td></tr>'

    let totalsgstamt = '<tr style="height:16pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:136pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:85pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s6" style="padding-top:4pt;padding-left:2pt;text-indent:0;text-align:left">Receiver&#39;s Signature with Stamp</p></td><td style="width:145pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p class="s6" style="padding-top:4pt;padding-left:49pt;text-indent:0;text-align:left">Accounts Manager</p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-right:1pt;text-indent:0;text-align:right">Total SGST</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-top:2pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(tsgst)+'</p></td></tr>'

    let totaligstamt = '<tr style="height:16pt"><td style="width:16pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:221pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="4"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:41pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:22pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:54pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:28pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt"><p style="text-indent:0;text-align:left"><br></p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-right:1pt;text-indent:0;text-align:right">Total IGST</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s7" style="padding-top:2pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(tigst)+'</p></td></tr>'

    let totalgst = '<tr style="height:16pt"><td style="width:382pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="9"><p class="s6" style="padding-top:4pt;padding-left:126pt;padding-right:126pt;text-indent:0;text-align:center">Note: Make all cheques payable to Company Name</p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-right:1pt;text-indent:0;text-align:right">Total GST</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p style="text-indent:0;text-align:left"><br></p><p class="s5" style="padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(sumgst)+'</p></td></tr>'

    let grandtotal = '<tr style="height:16pt"><td style="width:382pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="9"><p class="s6" style="padding-top:4pt;padding-left:126pt;padding-right:126pt;text-indent:0;text-align:center">Thank you for your Business</p></td><td style="width:115pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="3"><p class="s12" style="padding-top:3pt;padding-right:1pt;text-indent:0;text-align:right">Grand Total</p></td><td style="width:63pt;border-top-style:solid;border-top-width:1pt;border-left-style:solid;border-left-width:1pt;border-bottom-style:solid;border-bottom-width:1pt;border-right-style:solid;border-right-width:1pt" colspan="2"><p class="s8" style="padding-top:2pt;padding-right:5pt;text-indent:0;text-align:right">'+this.formatNumber(gt)+'</p></td></tr></table>'



    let final = '<!DOCTYPE html><head>'+style+'</head><body>'+compheader+invtitle+billto+shiptogst+invoicenumber+invoicedate+placeofsale+ewaybillno+partygstcodeorderdatenumber+voucherheader + vlines + emptyrowspace+totals+remarks+amtinwords+paymethoddiscamt+totaltaxablevalue+totalcgstamt+totalsgstamt+totaligstamt+totalgst+grandtotal+'</body></html>'

    return final
    
  }






  handlePrint(invoice:any) {

    let final:string =  this.makeHtmlString(invoice)

    //return

    console.log('A PRINT',final)

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow?.document.write(final);
    newWindow?.document.close();
    newWindow?.focus();
    newWindow?.print();



    // const wrapper = document.createElement('div');
    // wrapper.innerHTML = style + printContents?.innerHTML;

    // //const wrapper = document.getElementById('newfa');
    // if(wrapper) {
    //   html2canvas(wrapper).then((canvas) => {
    //     // do something with the canvas object
    //     var imgData = canvas.toDataURL('image/png');
    //     var pdf = new jsPDF();
    //     pdf.addImage(imgData, 'PNG', 0, 0,210,297);
    //     pdf.save("download.pdf");
    //   });
    // }

  }


  handleNewPrint(invoice:any) {
  
    this.loadPartyPerson(invoice.partyaccounthead.id,invoice)

    //console.log('PARTY ACCOUNTHEAD',invoice.partyaccounthead)

  }


  loadPartyPerson(pid:any,invoice:any) {
    
    this.inProgress = true
    
    let ahlService:PersonService = new PersonService(this.httpClient)
    let criteria:any = {id:pid};
    console.log('CRITERIA IN PARTY PERSON LOAD',JSON.stringify(criteria))
    this._ahlSub = ahlService.fetchPerson(criteria).subscribe({

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
          this.selectedPartyPerson = dataSuccess.success
          console.log('SPP',JSON.stringify(this.selectedPartyPerson))

          this.invoiceFields(this.selectedPartyPerson,invoice)

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


  
  invoiceFields(person:any,invoice:any) {


    for (const name of person.names) {
      if (name.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEBILLTO')) {
        console.log(name.fullname);
        if(name.hasOwnProperty("fullname")) {
          this.selectedPartyName = name.fullname
        }
        else if (name.hasOwnProperty("name")) {
          this.selectedPartyName = name.name
        }
        break
      }
    }
    
    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'telephone' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEBILLTO')) {
        console.log(endpoint.detail.telephone);
        this.selectedPartyTel = endpoint.detail.telephone
        break
      }
    }

    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'emailid' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEBILLTO')) {
        console.log(endpoint.detail.telephone);
        this.selectedPartyEmail = endpoint.detail.emailid
        break
      }
    }

    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'address' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEBILLTO')) {
        console.log(endpoint.detail.telephone);
        this.selectedPartyAddr = endpoint.detail.fulladdress
        break
      }
    }

    


    console.log('PARTY NAME',this.selectedPartyName)
    console.log('PARTY TES',this.selectedPartyTel)
    console.log('PARTY EMAIL',this.selectedPartyEmail)
    console.log('PARTY ADDR',this.selectedPartyAddr)

    this.selectedPartyEndpoint = [this.selectedPartyAddr, this.selectedPartyEmail, this.selectedPartyTel].filter(Boolean).join(" ");

    
    if(this.selectedPartyName === '') {
      this.confirm('You must tag one name of your customer as SALEINVOICEBILLTO')
      return
    }

    if(this.selectedPartyEndpoint === '') {
      this.confirm('You must tag atleast an email, or telephone or address as SALEINVOICEBILLTO')
      return
    }


    for (const govtid of person.govtids) {
      if (govtid.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEGSTNOPARTY')) {
        console.log(govtid.idnumber);
        this.selectedPartyGSTCode = govtid.idnumber
        break
      }
    }


    console.log('PARTY GST CODE',this.selectedPartyGSTCode)

    this.loadEntityPerson(1,invoice)

  }




  loadEntityPerson(pid:any,invoice:any) {
    
    this.inProgress = true

    let ahlService:ProfileService = new ProfileService(this.httpClient)
    let criteria:any = {id:pid};
    console.log('CRITERIA IN PARTY PERSON LOAD',JSON.stringify(criteria))
    this._ahlSub = ahlService.fetchProfile(criteria).subscribe({

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
          this.selectedEntityPerson = dataSuccess.success
          console.log('SEP',JSON.stringify(this.selectedEntityPerson))

          this.invoiceFieldsEntity(this.selectedEntityPerson,invoice)

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


  



  invoiceFieldsEntity(person:any,invoice:any) {

    for (const name of person.names) {
      if (name.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICECOMPANYNAME')) {
        console.log(name.fullname);
        if(name.hasOwnProperty("fullname")) {
          this.selectedEntityName = name.fullname
        }
        else if (name.hasOwnProperty("name")) {
          this.selectedEntityName = name.name
        }
        break
      }
    }

    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'telephone' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICE')) {
        console.log(endpoint.detail.telephone);
        this.selectedEntityTelephone = endpoint.detail.telephone
        break
      }
    }

    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'emailid' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICE')) {
        console.log(endpoint.detail.telephone);
        this.selectedEntityEmail = endpoint.detail.emailid
        break
      }
    }

    for (const endpoint of person.endpoints) {
      if (endpoint.type === 'address' && endpoint.detail.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICE')) {
        console.log(endpoint.detail.telephone);
        this.selectedEntityAddress = endpoint.detail.fulladdress
        break
      }
    }

    console.log('ENTITY NAME',this.selectedEntityName)
    console.log('ENTITY TEL',this.selectedEntityTelephone)
    console.log('ENTITY EMAIL',this.selectedEntityEmail)
    console.log('ENTITY ADDR',this.selectedEntityAddress)

    let entityConcat = [this.selectedEntityAddress, this.selectedEntityEmail, this.selectedEntityTelephone].filter(Boolean).join(" ");


    if(this.selectedEntityName === '') {
      this.confirm('You must tag one name of your customer as SALEINVOICE')
      return
    }

    if(entityConcat === '') {
      this.confirm('You must tag atleast an email, or telephone or address as SALEINVOICE')
      return
    }


    for (const govtid of person.govtids) {
      if (govtid.tags.some((tag: { tag: any; }) => tag.tag === 'SALEINVOICEGSTNOENTITY')) {
        console.log(govtid.idnumber);
        this.selectedEntityGSTNumber = govtid.idnumber
        break
      }
    }


    console.log('ENTITY GST CODE',this.selectedEntityGSTNumber)

    console.log('INVOICE',invoice)

    //this.selectedInvoiceNumber = invoice.id.toString()

    this.selectedInvoiceNumber = invoice.id
    

    const dateString = "2023-02-19T17:03:07.849+0530";
    
    const date = new Date(invoice.date);
    const formattedDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    console.log(formattedDate); // Output: "19-02-2023"

    this.selectedInvoiceDate = formattedDate

    const podate = new Date(invoice.date);
    const poFormattedDate = podate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    console.log(poFormattedDate); // Output: "19-02-2023"

    this.selectedPOFormattedDate = poFormattedDate



    this.handlePrint(invoice)
    

  }






  loadParty(pid:any) {
    
    this.inProgress = true
    
    let ahlService:PersonService = new PersonService(this.httpClient)
    let criteria:any = {id:pid};
    console.log('CRITERIA IN LOAD',JSON.stringify(criteria))
    this._ahlSub = ahlService.fetchPerson(criteria).subscribe({
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
          this.selectedPartyPerson = dataSuccess.success
          let endpoints = this.selectedPartyPerson.endpoints
          console.log('ENDPOINTS',endpoints)
          this.filteredEndpoints = []
          
          for (let index = 0; index < endpoints.length; index++) {
            const element = endpoints[index];
            if(element.type == 'telephone') {
              element['recordid'] = index
              element['endpointdetail'] = element.detail.telephone
              this.filteredEndpoints.push(element) 
            }
            // if(element.type == 'emailid') {
            //   element['recordid'] = index
            //   element['endpointdetail'] = element.detail.emailid
            //   this.filteredEndpoints.push(element)
            // }
          }
          this.inProgress = false
          this.displaySendInvoiceModal = true
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


  handleSendLink(ch:any) {
    this.inProgress = true
    
    let sah:SendHTMLInvoiceLinkService = new SendHTMLInvoiceLinkService(this.httpClient)
    this._piSub = sah.sendInvoice(ch).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inProgress = false
        this.confirm('A server error occured while sending invoice. '+e.message)
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
          this.displaySendInvoiceModal = false

          this.selectedEndpoint =  null
          this.pid = null
          this.base64Invoice = ''
          //this.loadCheques(0,0)
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

  


  
  handleEWayBillNo(inv:any) {

    if(!inv.hasOwnProperty("ewaybillno")) {
      this.selectedEWayBillNo = ""
    }
    else if(inv.hasOwnProperty("ewaybillno")) {
      this.selectedEWayBillNo = inv.ewaybillno
    }

    if(!inv.hasOwnProperty("paymentmethods")) {
      this.selectedPaymentMethods = ""
    }
    else if(inv.hasOwnProperty("paymentmethods")) {
      this.selectedPaymentMethods = inv.paymentmethods
    }

    if(!inv.hasOwnProperty("pono")) {
      this.selectedPONO = ""
    }
    else if(inv.hasOwnProperty("pono")) {
      this.selectedPONO = inv.pono
    }

    if(!inv.hasOwnProperty("podate")) {
      this.selectedPOFormattedDate = ""
    }
    else if(inv.hasOwnProperty("podate")) {
      this.selectedPOFormattedDate = inv.ponodate
    }


    this.displayOptionsModal = true
    this.selectedInvoice = inv

  }

  saveOptions() {

    this.selectedInvoice["ewaybillno"] = this.selectedEWayBillNo
    this.selectedInvoice["paymentmethods"] = this.selectedPaymentMethods
    this.selectedInvoice["pono"] = this.selectedPONO
    this.selectedInvoice["podate"] = this.selectedPODate

    console.log("SALE TO BE UPDATED",JSON.stringify(this.selectedInvoice))

    this.inProgress = true
    
    let sah:UpdateSaleInvoiceService = new UpdateSaleInvoiceService(this.httpClient)
    this._siSub = sah.updateSaleInvoice(this.selectedInvoice).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inProgress = false
        this.confirm('A server error occured while updating invoice. '+e.message)
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
          this.displayOptionsModal = false
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



  loadEntity() {
    
    this.inProgress = true
    
    a:ProfileService
    let ahlService:ProfileService = new ProfileService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchProfile(criteria).subscribe({
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
          this.selectedPerson = dataSuccess.success
          //this.handleView()
          this.selectedEntityName = this.selectedPerson.names[0].name

          let telephones = this.selectedPerson.endpoints.filter((endpoint:any) => endpoint.type === 'telephone');
          let addresses = this.selectedPerson.endpoints.filter((endpoint:any) => endpoint.type === 'address');

          let address = '';
          if (addresses.length > 0) {
            let cd = addresses[0].detail;
            this.selectedEntityAddress = cd.doorno + ' ' + cd.street + ' ' + cd.area + ' ' + cd.city + ' ' + cd.state + ' ' + cd.country + ' ' + cd.pincode
          }
          if (telephones.length > 0) {
            this.selectedEntityTelephone = telephones[0].detail.telephone;
          }

          
          

          console.log('NAME',this.selectedEntityName)
          console.log('ADDRESS',this.selectedEntityAddress)
          console.log('TELEPHONE',this.selectedEntityTelephone)
          console.log('EMAIL',this.selectedEntityEmail)


          this.selectedEntityGSTNumber = ""
          this.selectedInvoiceDate = ""
          this.selectedInvoiceNumber = ""
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
