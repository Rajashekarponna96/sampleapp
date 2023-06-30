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
import { SaveJournalVoucherService } from 'src/app/services/save-journal-voucher.service';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class JournalVoucherComponent implements OnInit {


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

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

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
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'partyequity-accounthead-begins'};
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
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'partyequity-accounthead-begins'};
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


    console.log('JV',JSON.stringify(jv))

    this.saveJournalVoucher(jv)

    return


  }


  saveJournalVoucher(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveJournalVoucherService = new SaveJournalVoucherService(this.httpClient)
    this._siSub = sah.saveJournalVoucher(newInvoice).subscribe({
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

}
