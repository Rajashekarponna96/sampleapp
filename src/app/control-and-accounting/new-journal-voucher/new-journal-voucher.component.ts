import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import { Search } from 'src/app/services/search';
import {ConfirmationService,MessageService} from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { JournalVoucherListService } from 'src/app/services/journal-voucher-list.service';

import { ItemsListService } from 'src/app/services/items-list.service';
import { DecimalPipe } from '@angular/common';
import { SaveNewJournalVoucherService } from 'src/app/services/save-new-journal-voucher.service';


@Component({
  selector: 'app-new-journal-voucher',
  templateUrl: './new-journal-voucher.component.html',
  styleUrls: ['./new-journal-voucher.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class NewJournalVoucherComponent implements OnInit {

  journalVoucherList:any[] = [] 
  selectedDate:Date = new Date()

  displayModal:boolean = false
  

  selectedDebitAccount:any
  filteredDebitAccounts:any[] = []
  placeholderDebitAccount:any

  selectedCreditAccount:any
  filteredCreditAccounts:any[] = []
  placeholderCreditAccount:any


  selectedDebitAmount:any
  selectedCreditAmount:any


  selectedNarration:string = ""

  _eSub:any
  _ahlSub:any
  _siSub:any

  inProgress:boolean = false

  selectedVouchers:any[] = []
  voucher:any = {
    'item':{
      'itemname':'',
      'uom':{
        'uom':''
      }
    },
    rate:0,
    quantity:0

  }
  filteredItems:any[] =[]
  placeholderItem:string = ''

  displaySubModal:boolean = false
  displaySubEditModal:boolean = false

  _iSub:any

  constructor(private decimalPipe: DecimalPipe,private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
     
    let a:any = {}
    a["title"] = 'Some Party A/c'
    a["debitcol"] = "100"
    a["debitfractioncol"] = ".00"
    a["showdebitfractioncol"] = false
    a["creditcol"] = ""
    a["creditfractioncol"] = ""
    a["showcreditfractioncol"] = false
    a["style"] = "color: #1C00ff00"

    
    console.log('A',a)

    let jvEntries = []
    jvEntries.push(a)

    let b:any = {}
    b["title"] = 'To Other Party A/c'
    b["debitcol"] = ""
    b["debitfractioncol"] = ""
    b["showdebitfractioncol"] = false
    b["creditcol"] = "100"
    b["creditfractioncol"] = ".00"
    b["showcreditfractioncol"] = false
    b["style"] = "color: #1C00ff00" 

    jvEntries.push(b)

    let jv:any = {}
    jv["jvEntries"] = jvEntries

    this.journalVoucherList.push(jv)

    console.log('JV LIST',this.journalVoucherList)

    this.loadJVs(0,0)

  }

  showNewVoucherDialog() {
    this.voucher = {
      'item':{
        'itemname':'',
        'uom':{
          'uom':''
        }
      },
      rate:0,
      quantity:0
  
    }
    this.displaySubModal = true
  }

  handleEditVoucher(v:any) {
    this.voucher = v
    this.displaySubEditModal = true
  }

  handleDeleteVoucher(i:any) {

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

  handleOnSelectItem(e:any) {
    console.log('ITEM HANDLE',e)
    this.voucher.item = e


  } 

  itemChange(e:any) {
    console.log('ITEM CHANGE',e)
    if (e === null) {
      console.log('IN NULL')
      this.voucher.item = {
          'itemname':'',
          'uom':{
            'uom':''
          }
      }
      return
    }
  }

  uirChange(e:any) {

  }

  handleAddVoucher() {
    console.log('ITEM',this.voucher.item)
    console.log('QUANTITY',this.voucher.quantity)
    console.log('USER INPUT RATE',this.voucher.rate)

    if(this.voucher.quantity < 0) {
      this.confirm('You cannot enter negative values for quantity')
      return false
    }

    if(this.voucher.rate < 0) {
      this.confirm('You cannot enter negative values for rate')
      return false
    }

    if (typeof this.voucher.item === 'undefined' || this.voucher.item == null || this.voucher.item.itemname === '') {
      this.confirm('You must select an item')
      return false
    }

    if (typeof this.voucher.quantity === 'undefined' || this.voucher.quantity == null || this.voucher.quantity === 0) {
      this.confirm('You must enter a quantity greater than zero')
      return false
    }

    if (typeof this.voucher.rate === 'undefined' || this.voucher.rate == null) {
      this.confirm('You must enter a quantity greater than or equal to zero')
      return false
    }


    this.selectedVouchers.push(this.voucher)
    
    this.displaySubModal = false
    return false

  }

  handleUpdateVoucher() {
    if(this.voucher.quantity < 0) {
      this.confirm('You cannot enter negative values for quantity')
      return false
    }

    if(this.voucher.rate < 0) {
      this.confirm('You cannot enter negative values for rate')
      return false
    }

    if (typeof this.voucher.item === 'undefined' || this.voucher.item == null || this.voucher.item.itemname === '') {
      this.confirm('You must select an item')
      return false
    }
    if (typeof this.voucher.quantity === 'undefined' || this.voucher.quantity == null || this.voucher.quantity === 0) {
      this.confirm('You must enter a quantity greater than zero')
      return false
    }

    if (typeof this.voucher.rate === 'undefined' || this.voucher.rate == null) {
      this.confirm('You must enter a quantity greater than or equal to zero')
      return false
    }
    this.displaySubEditModal = false
    return false
  }


  loadJVs(offset:number,moreoffset:number) {
    
    let ahlService:JournalVoucherListService = new JournalVoucherListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'',offset:moreoffset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchJournalVoucherList(criteria).subscribe({
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
          //this.masterCopy = dataSuccess.success
          this.processData(dataSuccess.success)
          
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



  processData(udata:any) {
    console.log('UDATA',udata)
    this.journalVoucherList = []
    for (let index = 0; index < udata.length; index++) {
        const element = udata[index];
        let jv:any = {}
        let jvEntries = []
        
        let a:any = {}
        a['title'] = element.debitaccount.accounthead
        a["creditcol"] = ""
        a["creditfractioncol"] = ""
        a["style"] = "color: #1C00ff00"

        a = this.formattedNumber(element.amount as number,a,'debitcol')
        jvEntries.push(a)


        let b:any = {}
        b['title'] = element.creditaccount.accounthead
        b["debitcol"] = ""
        b["debitfractioncol"] = ""
        b["style"] = "color: #1C00ff00"

        b = this.formattedNumber(element.amount as number,b,'creditcol')
        jvEntries.push(b)

        jv["invoicedate"] = element.invoicedate
        jv["jvEntries"] = jvEntries
        
        this.journalVoucherList.push(jv)

     }

     console.log('PROCESSED JVs',this.journalVoucherList)


  }



  isInt(n:any) {
    return n % 1 === 0;
  }

  formattedNumber(n:number,ca:any,coltype:any) {
    
    let a = n.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
    const myArray = a.split(".");

    ca["amount"] = n

    if (coltype === 'debitcol') {
      ca["debitamount"] = n
      ca["debitcol"] = myArray[0]
      ca["debitfractioncol"] = "."+myArray[1]
      
      if (this.isInt(n)){
        ca["style"] = "color: #1C00ff00"
      }
      else if(!this.isInt(n)) {
        ca["style"] = "color: #000000"
      }

      


    }
    else if(coltype === 'creditcol') {
      ca["creditamount"] = n
      ca["creditcol"] = myArray[0]
      ca["creditfractioncol"] = "."+myArray[1]

      if (this.isInt(n)){
        ca["style"] = "color: #1C00ff00"
      }
      else if(!this.isInt(n)) {
        ca["style"] = "color: #000000"
      }

      

    }
    
    return ca

  }


  

  onRowSelect(e:any) {

  }

  handleView(inv:any) {

  }

  showModalDialog() {
    this.displayModal = true
  }

  handleMore() {

  }

  


  dateSelected(event:any) {

  }



  filterDebits(event:any) {
    console.log('IN FILTER PARTIES',event)
    
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'noncashnonparty-accounthead-contains'};
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
          this.filteredDebitAccounts = dataSuccess.success;
          console.log('FILTERED DEBIT ACCOUNTS',dataSuccess.success)
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

  handleOnSelectDebitAccount(event:any) {
    this.selectedDebitAccount = event
  }

  debitAccountChange(event:any) {

  } 




  filterCredits(event:any) {
    console.log('IN FILTER PARTIES',event)
    
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'noncashnonparty-accounthead-contains'};
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
          this.filteredCreditAccounts = dataSuccess.success;
          console.log('FILTERED CREDIT ACCOUNTS',dataSuccess.success)
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

  handleOnSelectCreditAccount(event:any) {

  }

  creditAccountChange(event:any) {
    
  }


  debitAmountChange(event:any) {
    console.log('DEBIT AMOUNT EVENT',event)
  }

  creditAmountChange(event:any) { 

  }

  narrationChange(event:any) {

  }

  



  handleSaveJournalVoucher() {

    //return

    console.log('DEBIT',this.selectedDebitAmount)
    console.log('CREDIT',this.selectedCreditAmount)
    
    let a:any = this.decimalPipe.transform(this.getTotalAmount(), '1.0-2')
    a = a.replaceAll(',', '');
    console.log('AAA',a)
    let b = parseFloat(a)
    console.log('V TOTAL',b)

    //return


    if(this.selectedDebitAmount <= 0 || typeof this.selectedDebitAmount === 'undefined') {
      this.confirm('You must enter positive values greater than zero in debit amount.')
      return false
    }

    if(this.selectedCreditAmount <= 0 || typeof this.selectedCreditAmount === 'undefined') {
      this.confirm('You must enter positive values greater than zero in credit amount.')
      return false
    }

    if(this.selectedDebitAmount != this.selectedCreditAmount) {
      this.confirm('You must enter equal amounts in debit and credit')
      return false
    }

    if(this.selectedDebitAmount != b && this.selectedVouchers.length > 0) {
      this.confirm('You must enter in debit an amount equal to total amount in vouchers')
      return false
    }

    if(this.selectedCreditAmount != b && this.selectedVouchers.length > 0)  {
      this.confirm('You must enter in credit an amount equal to total amount in vouchers')
      return false
    }


    if (typeof this.selectedDebitAccount === 'undefined' || this.selectedDebitAccount == null) {
      this.confirm('You must select a debit account')
      return false
    }

    if (typeof this.selectedCreditAccount === 'undefined' || this.selectedCreditAccount == null) {
      this.confirm('You must select a credit account')
      return false
    }

    if (this.selectedDebitAccount.id === this.selectedCreditAccount.id) {
      this.confirm('You must select a different debit and credit account')
      return false
    }

    let jv:any = {}
    jv["invoicedate"] = this.selectedDate
    jv["debitaccount"] = this.selectedDebitAccount
    jv["creditaccount"] = this.selectedCreditAccount
    jv["amount"] =  this.selectedDebitAmount
    jv["narration"] = this.selectedNarration
    jv["vouchers"] = this.selectedVouchers


    console.log('JV',JSON.stringify(jv))

    this.saveJournalVoucher(jv)

    return


  }


  saveJournalVoucher(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveNewJournalVoucherService = new SaveNewJournalVoucherService(this.httpClient)
    this._siSub = sah.saveNewJournalVoucher(newInvoice).subscribe({
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
          this.loadJVs(0,0)
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

  getTotalAmount() {
    let totalAmount = 0
    for (let index = 0; index < this.selectedVouchers.length; index++) {
      const element = this.selectedVouchers[index];
      totalAmount = totalAmount + (element.rate * element.quantity)
    }
    return totalAmount
  }

}
