import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import * as moment from 'moment';
import { Search } from 'src/app/services/search';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import {ConfirmationService,MessageService} from 'primeng/api';
import { BRSSummaryService } from 'src/app/services/brssummary.service';
import { BRSDetailService } from 'src/app/services/brsdetail.service';
import { SavePaymentService } from 'src/app/services/save-payment.service';
import { SaveReceiptService } from 'src/app/services/save-receipt.service';
import { BRSClearChequeService } from 'src/app/services/brsclear-cheque.service';
import { BRSCancelChequeService } from 'src/app/services/brscancel-cheque.service';

@Component({
  selector: 'app-brs',
  templateUrl: './brs.component.html',
  styleUrls: ['./brs.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class BRSComponent implements OnInit {


  BRSSummaryList:any[] = []

  selectedBankParty:any
  filteredBankParties:any[] = new Array
  private _bpSub:any
  @ViewChild('selectBankParty') selectBankParty:any
  placeholderBankParty = 'select bank'

  _pSub:any
  _invSub:any

  inProgress:boolean = false

  chequesOnHandModal:boolean = false
  chequesList:any[] = []

  selectedAspect:any

  selectedChequesForDeposit:any[] = []

  _piSub:any

  selectedVouchers:any[] = []


  chequesDepositedModal:boolean = false

  selectedChequesForReturn:any[] = []

  chequesReturnedModal:boolean = false


  chequesWrittenModal:boolean = false
  chequesIssuedModal:boolean = false

  offsetCOH:number = 0
  offsetCDBNYC:number = 0
  offsetRC:number = 0
  offsetCWBNYITP:number = 0
  offsetCIBNYDBTB:number = 0


  
  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  
  
  filterBankParties(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'bank-party-accounthead-contains'};
    console.log('CRITERIA',criteria)
    
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._pSub = pService.fetchAccountHeads(criteria).subscribe({
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
          this.filteredBankParties = dataSuccess.success;
          console.log('FILTERED BANKS',dataSuccess.success)
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

  handleOnSelectBankParty(event:any) {
    console.log('HANDLE ON SELECT',event)
    this.selectedBankParty = event

    this.brsSummary({})
  }

  bankPartyChange(event:any) {
    console.log('BANK PARTY CHANGE',event)
    this.selectedBankParty = event

    if(this.selectedBankParty === null) {
      this.BRSSummaryList = []
    }
  }

  onRowSelect(event:any) {
    //console.log('SELECT',event)
    console.log('CHEQUES TO BE DEPOSITED',this.selectedChequesForDeposit)
  }

  handleView(asp:any) {
    console.log('ASPECT',asp)
    if(asp.title === 'Cheques on Hand') {
      let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques on hand',
        'offset':0
      }
      this.brsDetail(criteria)
    }

    if(asp.title === 'Cheques deposited but not yet credited.') {
      let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques deposited but not yet credited',
        'offset':0
      }
      this.brsDetail(criteria)
    }

    if(asp.title === 'Returned Cheques') {
      let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'returned cheques',
        'offset':0
      }
      this.brsDetail(criteria)
    }


    if(asp.title === 'Cheques written but not yet issued to party.') {
      let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques written but not yet issued',
        'offset':0
      }
      this.brsDetail(criteria)
    }

    if(asp.title === 'Cheques issued but not yet debited by bank.') {
      let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques issued but not yet debited',
        'offset':0
      }
      this.brsDetail(criteria)
    }
    
  }

  brsSummary(event:any) {

    this.inProgress = true

    let ahlService:BRSSummaryService = new BRSSummaryService(this.httpClient)
    let criteria:any = {bankaccount:this.selectedBankParty.id};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchBRSSummary(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching cheques. '+e.message)
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
          this.BRSSummaryList = []
          this.BRSSummaryList = dataSuccess.success
          
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




  brsDetail(event:any) {

    this.inProgress = true

    
    let ahlService:BRSDetailService = new BRSDetailService(this.httpClient)
    let criteria:any = event;
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchBRSDetail(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching cheques. '+e.message)
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
          this.chequesList = []
          console.log('CHEQUE AA LIST',dataSuccess.success)
          this.chequesList = dataSuccess.success
          this.inProgress = false
          if(event.aspect === 'cheques on hand') {
            this.chequesOnHandModal = true
          }
          if(event.aspect === 'cheques deposited but not yet credited') {
            this.chequesDepositedModal = true
          }
          if(event.aspect === 'returned cheques') {
            this.chequesReturnedModal = true
          }
          if(event.aspect === 'cheques written but not yet issued') {
            this.chequesWrittenModal = true
          }
          if(event.aspect === 'cheques issued but not yet debited') {
            this.chequesIssuedModal = true
          }
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


  ISODate(event:any) {

    console.log('DATE SELECTED',event)
  
    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    
    return isoDateTime
   
  }


  onRowDepositSelect(event:any) {
    //console.log('SELECT',event)
    console.log('CHEQUES TO BE RETURNED',this.selectedChequesForReturn)
  }

  buildChequeDepositVoucher(ch:any) {
    
    ch['drawer'] = this.selectedBankParty

    let v:any = {}
    v['action'] = 'iss'
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(ch))
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = ch.amount
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
    v['accountmap'] = JSON.parse(JSON.stringify(ch.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

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

  handleDeposit() {

    this.selectedVouchers = []
    for (let index = 0; index < this.selectedChequesForDeposit.length; index++) {
      const element = this.selectedChequesForDeposit[index];
      let v = this.buildChequeDepositVoucher(element)
      this.selectedVouchers.push(v)
      
    }

    console.log('VOUCHERS',this.selectedVouchers)

    this.handleSavePayment()


  }

  handleSavePayment() {
    

    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(new Date())
    newInvoice['entity'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['partyaccounthead'] = this.selectedBankParty
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
          this.brsSummary({})
          this.chequesOnHandModal = false
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



  



  // RETURN CHEQUES FROM THE BANK 
  buildChequeReceiptVoucher(ch:any) {
    
    // ch['drawer'] = this.selectedBankParty


    let v:any = {}
    v['action'] = 'rec'
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(ch))
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = ch.amount
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
    v['accountmap'] = JSON.parse(JSON.stringify(ch.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

  }


  // BUILD VOUCHERS OF CHEQUES TO RECORD RETURN FROM THE BANK
  handleReturn() {

    this.selectedVouchers = []
    for (let index = 0; index < this.selectedChequesForReturn.length; index++) {
      
      const element = this.selectedChequesForReturn[index];
      let v = this.buildChequeReceiptVoucher(element)
      this.selectedVouchers.push(v)
      
    }

    console.log('VOUCHERS',this.selectedVouchers)

    this.handleSaveReceipt()


  }

  
  // RETURN CHEQUES FROM THE BANK
  handleSaveReceipt() {
    
  
    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(new Date())
    newInvoice['entity'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['partyaccounthead'] = this.selectedBankParty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedVouchers
  
  
    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))
  
    this.saveReceipt(newInvoice)
  
    return false

  }
  


  // RETURN CHEQUES FROM THE BANK
  saveReceipt(newInvoice:any) {
    
    this.inProgress = true
    
    let sah:SaveReceiptService = new SaveReceiptService(this.httpClient)
    this._piSub = sah.saveReceipt(newInvoice).subscribe({
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
          this.brsSummary({})
          this.chequesDepositedModal = false
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


  
  // BUILD PAYMENT VOUCHER TO RETURN CHEQUE TO ORIGINAL PARTY 
  buildChequeReturnToPartyVoucher(ch:any) {
    
    ch['drawer'] = ch.originalparty

    let v:any = {}
    v['action'] = 'iss'
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(ch))
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = ch.amount
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
    v['accountmap'] = JSON.parse(JSON.stringify(ch.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

  }



  // PAY BACK CHEQUE TO ORIGINAL PARTY
  handleReturnToParty(ch:any) {

    this.selectedVouchers = []
    this.selectedVouchers.push(this.buildChequeReturnToPartyVoucher(ch))


    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(new Date())
    newInvoice['entity'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['partyaccounthead'] = ch.originalparty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedVouchers
  
  
    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))
  
    this.saveReturnToOriginalParty(newInvoice)
  
    return false


  }

  // PAY BACK CHEQUE TO ORIGINAL PARTY
  saveReturnToOriginalParty(newInvoice:any){
  
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
          this.brsSummary({})
          let criteria:any = {
            'bankaccount':this.selectedBankParty.id,
            'aspect':'returned cheques',
            'offset':0
          }
          this.brsDetail(criteria)
          //this.chequesReturnedModal = false
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






  // RECEIVE ISSUED CHECK FROM PARTY
  buildChequeReturnByPartyVoucher(ch:any) {
    
    // ch['drawer'] = this.selectedBankParty


    let v:any = {}
    v['action'] = 'rec'
    v['objecttype'] = 'instrument'
    v['object'] = JSON.parse(JSON.stringify(ch))
    v['quantity'] = 1
    v['currency'] = '',
    v['fromdatetime'] = 'infinity'
    v['todatetime'] = 'infinity'
    v['duedatetime'] = 'infinity'
    v['userinputrate'] = ch.amount
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
    v['accountmap'] = JSON.parse(JSON.stringify(ch.cashtypeah))
    v['files'] = []
    v['expirydate'] = new Date()
    v['vendorperson'] = null

    //v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1


    return v

  }



  // RECEIVE ISSUED CHECK FROM PARTY
  handleReturnByParty(ch:any) {

    this.selectedVouchers = []
    this.selectedVouchers.push(this.buildChequeReturnByPartyVoucher(ch))


    let newInvoice:any = {}
    newInvoice['date'] = this.ISODate(new Date())
    newInvoice['entity'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['partyaccounthead'] = ch.originalparty
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['vouchers'] = this.selectedVouchers
  
  
    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))
  
    this.saveReturnByOriginalParty(newInvoice)
  
    return false


  }


  // RECEIVE ISSUED CHECK FROM PARTY
  saveReturnByOriginalParty(newInvoice:any) {
    
    this.inProgress = true
    
    let sah:SaveReceiptService = new SaveReceiptService(this.httpClient)
    this._piSub = sah.saveReceipt(newInvoice).subscribe({
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
          this.brsSummary({})
          let criteria:any = 
          {
            'bankaccount':this.selectedBankParty.id,
            'aspect':'cheques issued but not yet debited',
            'offset':0
          }
          this.brsDetail(criteria)
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





  handleClearDepositedCheque(ch:any) {
    this.inProgress = true
    sa:BRSClearChequeService
    let sah:BRSClearChequeService = new BRSClearChequeService(this.httpClient)
    this._piSub = sah.saveCheque(ch).subscribe({
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
          this.brsSummary({})
          let criteria:any = 
          {
            'bankaccount':this.selectedBankParty.id,
            'aspect':'cheques deposited but not yet credited',
            'offset':0
          }
          this.brsDetail(criteria)
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




  handleCancelWrittenCheque(ch:any) {
    
    console.log('CANCELLING WRITTEN CHEQUE',JSON.stringify(ch))

    //return

    
    this.inProgress = true
    let sah:BRSCancelChequeService = new BRSCancelChequeService(this.httpClient)
    this._piSub = sah.cancelCheque(ch).subscribe({
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
          this.brsSummary({})
          let criteria:any = 
          {
            'bankaccount':this.selectedBankParty.id,
            'aspect':'cheques written but not yet issued',
            'offset':0
          }
          this.brsDetail(criteria)
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

  handleClearIssuedCheque(ch:any) {
    this.inProgress = true
    sa:BRSClearChequeService
    let sah:BRSClearChequeService = new BRSClearChequeService(this.httpClient)
    this._piSub = sah.saveCheque(ch).subscribe({
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
          this.brsSummary({})
          let criteria:any = 
          {
            'bankaccount':this.selectedBankParty.id,
            'aspect':'cheques issued but not yet debited',
            'offset':0
          }
          this.brsDetail(criteria)
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



  /*
  offsetCOH:number = 0
  offsetCDBNYC:number = 0
  offsetRC:number = 0
  offsetCWBNYITP:number = 0
  offsetCIBNYDBTB:number = 0
  */


  handleMoreCOH() {
    this.offsetCOH = this.offsetCOH + 500
    let criteria:any =
    {
      'bankaccount':this.selectedBankParty.id,
      'aspect':'cheques on hand',
      'offset':this.offsetCOH
    }
    this.moreBRSDetail(criteria)
  }


  handleMoreCDBYNC() {
    this.offsetCDBNYC = this.offsetCDBNYC + 500
    let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques deposited but not yet credited',
        'offset':this.offsetCDBNYC
      }
      this.moreBRSDetail(criteria)
  }

  handleMoreRC() {
    this.offsetRC = this.offsetRC + 500
    let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'returned cheques',
        'offset':this.offsetRC
      }
      this.moreBRSDetail(criteria)
  }

  handleMoreCWBNYITP() {
    this.offsetCWBNYITP = this.offsetCWBNYITP + 500
    let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques written but not yet issued',
        'offset':this.offsetCWBNYITP
      }
      this.moreBRSDetail(criteria)
  }

  handleMoreCIBNYDBTB() {
    this.offsetCIBNYDBTB = this.offsetCIBNYDBTB + 500
    let criteria:any = 
      {
        'bankaccount':this.selectedBankParty.id,
        'aspect':'cheques issued but not yet debited',
        'offset':this.offsetCIBNYDBTB
      }
      this.moreBRSDetail(criteria)
  }


  moreBRSDetail(event:any) {

    this.inProgress = true

    
    let ahlService:BRSDetailService = new BRSDetailService(this.httpClient)
    let criteria:any = event;
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchBRSDetail(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching cheques. '+e.message)
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
          this.chequesList = []
          console.log('CHEQUE AA LIST',dataSuccess.success)
          this.chequesList = dataSuccess.success
          this.inProgress = false
          if(event.aspect === 'cheques on hand') {
            this.chequesOnHandModal = true
          }
          if(event.aspect === 'cheques deposited but not yet credited') {
            this.chequesDepositedModal = true
          }
          if(event.aspect === 'returned cheques') {
            this.chequesReturnedModal = true
          }
          if(event.aspect === 'cheques issued but not yet debited') {
            this.chequesIssuedModal = true
          }
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
