import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { PeopleService } from 'src/app/services/people.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import * as moment from 'moment';
import { Search } from 'src/app/services/search';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { InvoiceListService } from 'src/app/services/invoice-list.service';
import { ChequesOfPersonService } from 'src/app/services/cheques-of-person.service';
import { SavePaymentService } from 'src/app/services/save-payment.service';
import { PartyAccountBalanceListService } from 'src/app/services/party-account-balance-list.service';
import { GlobalConstants } from 'src/app/global/global-constants';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class PaymentsComponent implements OnInit {

  selectedDate: Date = new Date();
  
  paymentList:any = []

  sanitizedInvoiceList:any[] = []

  inProgress:boolean = false

  selectedInvoice:any = {}

  displayModal = false;
  displayViewModal = false;

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


  selectedVouchers:any[] = []

  displayCashModal:boolean = false;
  displayChequeModal:boolean = false;
  displayViaPersonModal:boolean = false;
  displayOtherModal:boolean = false;

  selectedCashAmount:any
  selectedViaPersonAmount:any

  selectedCP:any
  @ViewChild('selectCP') selectCP:any

  cashVoucher:any = {
    taxesperunit: "0.00",
    originalrateaftertaxes: "0.00",
    fromdatetime: "",
    vattaxperunit: "0.00",
    ratebeforetaxes: "0.00",
    title: "",
    files: [],
    discountamount: "0.00",
    object: {
      id: "1",
      uom: {
        uom: "each",
        country: "global",
        symbol: "each"
      },
      promisorah: {
        accounthead: "",
        id: "-1",
        endpoint: "",
        neid: "-1",
        defaultgroup: "",
        person: "-1"
      },
      instrumenttype: "cash",
      amount: "0",
      instrumentnumber: "",
      promiseeah: {
        accounthead: "",
        id: "-1",
        endpoint: "",
        neid: "-1",
        defaultgroup: "",
        person: "-1"
      },
      maturitydate: "",
      promisee: {
        endpoint: "",
        id: "-1",
        name: "",
        similarity: "0.000000",
        person: "-1"
      },
      cashtypeah: {
        accounthead: "Cash",
        id: "1",
        endpoint: "",
        neid: "0",
        defaultgroup: "cash",
        person: "0"
      },
      status: "",
      promisor: {
        endpoint: "",
        id: "-1",
        name: "",
        similarity: "0.000000",
        person: "-1"
      }
    },
    taxfactor: "0.00",
    instrumenttype: "cash",
    action: "iss",
    todatetime: "",
    vatpercent: "0.00",
    delivery: {
      accounthead: "",
      id: "-1",
      endpoint: "",
      neid: "-1",
      defaultgroup: "",
      person: "-1"
    },
    quantity: "1.00",
    rateaftertaxes: "0.00",
    taxes: [],
    rateincludesvat: false,
    duedatetime: "",
    nonvattaxperunit: "0.00",
    accountmap: {
      accounthead: "",
      id: "-1",
      endpoint: "",
      neid: "-1",
      defaultgroup: "",
      person: "-1"
    },
    objecttype: "instrument",
    userinputrate: "0",
    expirydate: "",
    nonvatpercent: "0.00",
    brandname: "",
    discountpercent: "0.00",
    rateafterdiscount: "0.00"
  }

  
  private _chSub:any
  selectedChequesOfPerson:any[] = []

  selectedRecordid:any
  selectedVoucherid:any

  displayEditChequeModal:boolean = false

  selectedViaPerson:any
  filteredViaPeople:any[] = new Array
  private _vpSub:any
  @ViewChild('selectViaPerson') selectViaPerson:any
  placeholderViaPerson = 'select via person'


  private _invSub:any
  private _piSub:any

  totalRecords:number = 0

  pabList:any[] = []

  sanitizedPabList:any[] = []

  displayViewPaymentsModal:boolean = false

  lo:any

  viewPartyName:any;
  viewTotal:number = 0

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    
    //console.log('VOUCHERS',this.selectedVouchers)
    this.lo = GlobalConstants.loginObject

    this.loadInvoices(0,0)

    this.loadPartyBalances(0,0)

    this.viewPartyName = ''
    this.viewTotal = 0
  }

  sanitizeInvoices() {
    for (let index = 0; index < this.paymentList.length; index++) {
      const element = this.paymentList[index];

      let sanitInvoice:any = {}
      sanitInvoice['date'] = element.date
      sanitInvoice['vendor'] = element.partyaccounthead.accounthead

      console.log('VENDOR',element.partyaccounthead.accounthead)
      
      let amount:number = 0
    
      for (let j = 0; j < element.vouchers.length; j++) {
        const voucher = element.vouchers[j];
        let amt = Math.abs(voucher.userinputrate)
        amount = amt + amount
        
      }

      sanitInvoice['amount'] = amount
      sanitInvoice['invoice'] = element

      this.sanitizedInvoiceList.push(sanitInvoice)
      
    }
  }

  loadInvoices(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'payments',attribute:''};
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
          this.paymentList = []
          this.paymentList = dataSuccess.success
          this.totalRecords = this.paymentList.length
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


  sanitizePabs() { 
    
    for (let index = 0; index < this.pabList.length; index++) {
      const element = this.pabList[index];
      
      if(element.debit == 'None' && element.credit == 'None') {
        //console.log('IN BOTH NOT NONE',element.debit)
      }
      else {
        if (element.debit == 'None') {
          element.debit = ""
        }
        if (element.credit == 'None') {
          element.credit = ""
        }
        this.sanitizedPabList.push(JSON.parse(JSON.stringify(element)))
      }
     
    }
  }
 
  loadPartyBalances(offset:number,moreoffset:number) {

    this.inProgress = true
    let ahlService:PartyAccountBalanceListService = new PartyAccountBalanceListService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchPartyBalanceList(criteria).subscribe({
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
          this.pabList = []
          this.pabList = dataSuccess.success
          this.totalRecords = this.paymentList.length
          console.log('TOTAL RECORDS',this.totalRecords)
          // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.sanitizedPabList = []
          this.sanitizePabs()
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



  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
      this.selectedInvoice = event.data
    }
  }

  showModalDialog() {
    
    this.selectedEntity = null
    this.selectedDate = new Date()
    this.selectedParty = null

    this.selectedVouchers = []
    this.selectedVouchers.push(this.cashVoucher)
    
    this.displayModal = true;

  }


  showModalPaymentsDialog() {

    this.displayViewPaymentsModal = true

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
      let a:number = parseFloat(voucher.object.amount) 
      this.viewTotal = this.viewTotal + a
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



  handleOnSelectViaPerson(event:any) {
    this.selectedViaPerson = event
    //this.newInvoice.partyaccounthead = event;

  }

  viaPersonChange(event:any) {
    //console.log('EVENT',event)
    this.selectedViaPerson = event
  }


  handleEditVoucher(v:any) {
    
    console.log('VOUCHER TO BE EDITED',v)

    if(v.object.instrumenttype === 'cash') {

      this.selectedCashAmount = v.object.amount
      this.displayCashModal = true
      return
    }

    if(v.object.instrumenttype === 'cheque') {
      this.selectedCP = v.object
      this.selectedVoucherid = v.recordid
      this.displayEditChequeModal = true
    }

    
    // this.selectedItem = v.object
    // this.selectedUIR = v.userinputrate
    // this.selectedQty = v.quantity
    // this.selectedStockBalances = this.uneditedSbs
    // this.selectedAccountMap = v.accountmap
    // this.selectedUOM = v.object.uom.uom
    // this.selectedTaxes = v.taxes
    // let ri = ""
    // if(v.rateincludesvat) {
    //   ri = 'rit'
    // }
    // if(!v.rateincludesvat) {
    //   ri = 'ret'
    // }
    // this.pcchange(ri)
    // this.selectedVoucherid = v.recordid
    // this.displaySubEditModal = true

  }

  

  handleDeleteVoucher(v:any) {
    console.log('V',v)
    if (v===0) {
      return
    }
    this.selectedVouchers.splice(v,1)
  }


  


  showCashDialog() {
    this.displayCashModal = true
  }

  cashAmountChange(event:any) {

    let ca:number = parseFloat(event)

    if(isNaN(ca)) {
      ca = 0
    }

    this.selectedCashAmount = ca
    let cashVoucher:any = this.selectedVouchers[0]
    
    cashVoucher.object.amount = ca
    cashVoucher.userinputrate = ca

  }

  viaPersonAmountChange(event:any) {
    console.log('EVENT',event);
  }



  showChequeDialog() {

    
    if (this.selectedParty === null) {
      this.confirm('You must select a party.')
      return
    }

    this.selectedCP = null
    // displayChequeModal is set in loadCheques
    this.loadChequesOfPerson(this.selectedParty.person)

  }

  showViaPersonDialog() {
    this.displayViaPersonModal = true;
  }


  loadChequesOfPerson(personid:any) {

    this.inProgress = true

    console.log('IN CHEQUES OF PERSON')
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    
    let criteria:any = {
      person: personid,
      offset: 0,
      draweeis: "ourbank"
    }
    
    console.log('CRITERIA',criteria)
    
    let iService:ChequesOfPersonService = new ChequesOfPersonService(this.httpClient)
    this._chSub = iService.fetchChequesOfPerson(criteria).subscribe({
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
          this.selectedChequesOfPerson = dataSuccess.success;
          console.log('CHEQUES OF PERSON',dataSuccess.success)
          this.inProgress = false
          this.displayChequeModal = true
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

  cpChange(event:any) {

    if(event.value !== null) {

      this.selectedCP = event.value
      
      //this.selectedCP.drawer = this.selectedParty
      
    }

    console.log('SELECTED CP',this.selectedCP)

    if(event.value === null) {
      this.selectedCP = null
    }


  }




  handleAddCheque(){

    console.log('CHEQUE',this.selectedCP)
    

    if (typeof this.selectedCP === 'undefined' || this.selectedCP == null) {
      this.confirm('You must select a cheque')
      return false
    }

    if(this.chequeAlreadySelected(this.selectedCP)) {
      this.confirm('This cheque has already been selected.')
      return false
    }
    
    let v:any = this.buildChequeVoucher()
    this.selectedVouchers.push(v)
    
    this.displayChequeModal = false
    return false

  }

  buildChequeVoucher() {
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
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(this.selectedCP))
    v['isviaperson'] = false
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = this.selectedCP.amount
    v['rateincludesvat'] = true
    

    v['taxes'] = []
    
    v['discountpercent'] = 0
    v['discountamount'] = 0
    v['rateafterdiscount'] = 0
    v['rateaftertaxes'] = 0
    v['taxfactor'] = 0
    v['taxesperunit'] = 0
    v['uom'] = {
      uom: "each",
      symbol: "each",
      country: "global"
    }
    
    v['nonvattaxperunit'] = 0
    
    v['vattaxperunit'] = 0
    v['nonvatpercent'] = 0
    v['vatpercent'] = 0
    v['ratebeforetaxes'] = 0

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
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedCP.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

  }

  chequeAlreadySelected(ch:any) {
    let there:boolean = false
    for (let index = 0; index < this.selectedVouchers.length; index++) {
      const element = this.selectedVouchers[index];
      console.log('ELEMENT',element)
      console.log('CH',ch)
      if(element.object.instrumentnumber === ch.instrumentnumber) {
        there = true
        break
      }
    }
    return there
  }


  handleAddViaPerson() {
    
    if(this.selectedViaPersonAmount == 0) {
      this.confirm('You must enter an amount greater than zero')
      return false
    }
    
    let v:any = this.buildViaPersonVoucher()
    //this.selectedVouchers.push(v)
    
    this.displayViaPersonModal = false
    return false
  }


  buildViaPersonVoucher() {
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
    v['objecttype'] = 'person'
    v['object'] = JSON.parse(JSON.stringify(this.selectedViaPerson))
    v['isviaperson'] = true;
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = this.selectedViaPersonAmount
    v['rateincludesvat'] = true
    

    v['taxes'] = []
    
    v['discountpercent'] = 0
    v['discountamount'] = 0
    v['rateafterdiscount'] = 0
    v['rateaftertaxes'] = 0
    v['taxfactor'] = 0
    v['taxesperunit'] = 0
    v['uom'] = {
      uom: "each",
      symbol: "each",
      country: "global"
    }
    
    v['nonvattaxperunit'] = 0
    
    v['vattaxperunit'] = 0
    v['nonvatpercent'] = 0
    v['vatpercent'] = 0
    v['ratebeforetaxes'] = 0

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
    v['accountmap'] = null
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

  }



  handleViewVoucher(v:any) {

  }

 


  handleUpdateCheque() {

    if (typeof this.selectedCP === 'undefined' || this.selectedCP == null) {
      this.confirm('You must select a cheque')
      return false
    }
    
    if(this.chequeAlreadySelected(this.selectedCP)) {
      this.confirm('This cheque has already been selected.')
      return false
    }

    let v:any = this.recordByRecordID(this.selectedVoucherid,this.selectedVouchers)
    console.log('VOUCHER',v)
    this.rebuildChequeVoucher(v)
    this.displayEditChequeModal = false

    return false

  }


  rebuildChequeVoucher(v:any) {
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

    
    
    v['action'] = 'iss'
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(this.selectedCP))
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = this.selectedCP.amount
    v['rateincludesvat'] = true
    

    v['taxes'] = []
    
    v['discountpercent'] = 0
    v['discountamount'] = 0
    v['rateafterdiscount'] = 0
    v['rateaftertaxes'] = 0
    v['taxfactor'] = 0
    v['taxesperunit'] = 0
    v['uom'] = {
      uom: "each",
      symbol: "each",
      country: "global"
    }
    
    v['nonvattaxperunit'] = 0
    
    v['vattaxperunit'] = 0
    v['nonvatpercent'] = 0
    v['vatpercent'] = 0
    v['ratebeforetaxes'] = 0

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
    v['accountmap'] = JSON.parse(JSON.stringify(this.selectedCP.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null


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

  /*

  // CASH OBJECT

  {
        "id": "1",
        "uom": {
          "uom": "each",
          "country": "global",
          "symbol": "each"
        },
        "promisorah": {
          "accounthead": "",
          "id": "-1",
          "endpoint": "",
          "neid": "-1",
          "defaultgroup": "",
          "person": "-1"
        },
        "instrumenttype": "cash",
        "amount": "1000",
        "instrumentnumber": "",
        "promiseeah": {
          "accounthead": "",
          "id": "-1",
          "endpoint": "",
          "neid": "-1",
          "defaultgroup": "",
          "person": "-1"
        },
        "maturitydate": "",
        "promisee": {
          "endpoint": "",
          "id": "-1",
          "name": "",
          "similarity": "0.000000",
          "person": "-1"
        },
        "cashtypeah": {
          "accounthead": "Cash",
          "id": "1",
          "endpoint": "",
          "neid": "0",
          "defaultgroup": "cash",
          "person": "0"
        },
        "status": "",
        "promisor": {
          "endpoint": "",
          "id": "-1",
          "name": "",
          "similarity": "0.000000",
          "person": "-1"
        }
      }


      // CHEQUE OBJECT

      {
  "maturitydate": "2022-08-09T09:54:32.053Z",
  "instrumentnumber": "989321",
  "drawer": {
    "id": "7",
    "accounthead": "Precision Castparts",
    "defaultgroup": "party",
    "relationship": "",
    "neid": "4",
    "person": "4",
    "name": "",
    "endpoint": "5039464800",
    "accounttype": "vendor",
    "partofgroup": -1,
    "isgroup": false
  },
  "drawee": {
    "id": "31",
    "accounthead": "AXIS BANK LTD",
    "defaultgroup": "party",
    "relationship": "",
    "neid": "14",
    "person": "13",
    "name": "",
    "endpoint": "#101 Financial Dist  Hyderabad Telangana India 500032",
    "accounttype": "bank",
    "partofgroup": -1,
    "isgroup": false
  },
  "amount": "5555",
  "draweeis": "ourbank",
  "status": "",
  "unclearedchequesaccount": {
    "person": "",
    "rtype": "",
    "id": "2139",
    "neid": "",
    "accounthead": "Uncleared Cheques",
    "defaultgroup": "equity",
    "relationship": "",
    "endpoint": "",
    "name": ""
  },
  "cashtypeah": {
    "id": "2",
    "accounthead": "Cheques",
    "defaultgroup": "cash",
    "neid": "",
    "person": "",
    "endpoint": "",
    "rtype": ""
  },
  "files": [],
  "instrumenttype": "cheque",
  "uom": {
    "uom": "each",
    "country": "global",
    "symbol": "each"
  }
}

  */


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


ISODate(event:any) {

  console.log('DATE SELECTED',event)

  let date1 = moment(event).format('YYYY-MM-DD');
  let time1 = moment(event).format('HH:mm:ss.SSSZZ')
  let isoDateTime = date1+'T'+time1
  console.log('ISO DATE',isoDateTime)
  
  return isoDateTime
 
}

handleSavePayment() {
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

  if(this.selectedVouchers.length === 1) {
    console.log('CASH VOUCHER',this.selectedVouchers[0].object)
    
    if(parseFloat(this.selectedVouchers[0].object.amount) === 0) {
      this.confirm('You must enter cash greater than zero')
      return false
    }
    
  }

  

  let newInvoice:any = {}
  newInvoice['date'] = this.ISODate(this.selectedDate)
  newInvoice['entity'] = this.selectedEntity
  newInvoice['partyaccounthead'] = this.selectedParty
  newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
  newInvoice['vouchers'] = this.selectedVouchers


  console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))

  this.savePayment(newInvoice)

  return false

}


savePayment(newInvoice:any){

  this.inProgress = true
  
  let sah:SavePaymentService = new SavePaymentService(this.httpClient)
  this._piSub = sah.savePayment(newInvoice).subscribe({
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
        this.loadPartyBalances(0,0)
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
