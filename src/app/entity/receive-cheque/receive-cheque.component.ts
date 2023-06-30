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
import { SaveReceiptService } from 'src/app/services/save-receipt.service';
import { ChequeListService } from 'src/app/services/cheque-list.service';
import { SaveChequeService } from 'src/app/services/save-cheque.service';
import { GlobalConstants } from 'src/app/global/global-constants';


@Component({
  selector: 'app-receive-cheque',
  templateUrl: './receive-cheque.component.html',
  styleUrls: ['./receive-cheque.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ReceiveChequeComponent implements OnInit { 

  selectedDate: Date = new Date();

  displayModal = false;
  displayViewModal = false;

  chequeList:any[] = []
  inProgress:boolean = false
  private _invSub:any
  totalRecords:number = 0


  selectedBankParty:any
  filteredBankParties:any[] = new Array
  private _bpSub:any
  @ViewChild('selectBankParty') selectBankParty:any
  placeholderBankParty = 'select bank'

  selectedParty:any
  filteredParties:any[] = new Array
  private _pSub:any
  @ViewChild('selectParty') selectParty:any
  placeholderParty = 'select party'

  newCheque:any = {}

  selectedCheque:any = {}
  
  selectedVal:any
  @ViewChild('selectVal') selectVal:any

  selectedNumber:any
  @ViewChild('selectNumber') selectNumber:any

  _piSub:any;

  offset:number = 0

  lo:any

  selectedBankName:any

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
    this.loadCheques(0,0)
  }

  loadCheques(offset:number,moreoffset:number) {

    this.inProgress = true
    
    let ahlService:ChequeListService = new ChequeListService(this.httpClient)
    let criteria:any = {draweeis:'anybank',offset:moreoffset};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchCheques(criteria).subscribe({
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
          this.chequeList = []
          this.chequeList = dataSuccess.success
          this.totalRecords = this.chequeList.length
          console.log('TOTAL RECORDS',this.totalRecords)
          // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          
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

  showModalDialog() {

    
    this.selectedDate = new Date()
    this.selectedParty = null
    this.selectedBankParty = null

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
    // if(event !== null) {
    //   console.log('ROW SELECT',event)
    //   this.selectedInvoice = event.data
    // }
  }

  handleView(invoice:any) {
    // console.log('INVOICE',invoice)
    // this.selectedInvoice = invoice
    // this.displayViewModal = true
  }

  dateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.newCheque.date = isoDateTime
    //this.selectedDate = isoDateTime
   
  }

  ISODate(event:any) {
  
    console.log('DATE SELECTED',event)
  
    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    
    return isoDateTime
   
  }



  filterParties(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
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
    this.newCheque.drawer = event;

  }

  partyChange(event:any) {
    this.newCheque.drawer =  {
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








  filterBankParties(event:any) {
    console.log('IN FILTER PARTIES',event)
    
    let criteria:any = {
      searchtext: event.query,
      screen: "tokenfield",
      searchtype: "party-name-begins",
      offset: 0
    }
    console.log('CRITERIA',criteria)
    let pService:PeopleService = new PeopleService(this.httpClient)
    this._pSub = pService.fetchPeople(criteria).subscribe({
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
    this.selectedBankParty = event
    this.newCheque.drawee = event;

  }

  bankPartyChange(event:any) {
    this.newCheque.drawee =  {
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





  
 
  



  handleSaveCheque() {

    console.log('BANK PARTY',this.selectedBankName)

    //return

    if (typeof this.selectedNumber === 'undefined' || this.selectedNumber == null || this.selectedNumber === '') {
      this.confirm('You must enter cheque number')
      return false
    }

    if (typeof this.selectedParty === 'undefined' || this.selectedParty == null) {
      this.confirm('You must select a party')
      return false
    }

    
    this.selectedBankParty = {
      name:this.selectedBankName,
      id: 1
    }
    if (typeof this.selectedBankParty === 'undefined' || this.selectedBankParty == null) {
      this.confirm('You must select a bank')
      return false
    }
  
    if (typeof this.selectedVal === 'undefined' || this.selectedVal == null ) {
      this.confirm('You must enter cheque amount')
      return false
    }

    

     

    let cheque:any = {
      maturitydate: this.ISODate(this.selectedDate),
      instrumentnumber: this.selectedNumber.toString(),
      drawer: this.selectedParty,
      drawee: this.selectedBankParty,
      amount: this.selectedVal,
      draweeis: "anybank",
      status: "",
      unclearedchequesaccount: {
        person: "",
        rtype: "",
        id: "2139",
        neid: "",
        accounthead: "Uncleared Cheques",
        defaultgroup: "equity",
        relationship: "",
        endpoint: "",
        name: ""
      },
      cashtypeah: {
        id: "2",
        accounthead: "Cheques",
        defaultgroup: "cash",
        neid: "",
        person: "",
        endpoint: "",
        rtype: ""
      },
      files: [],
      instrumenttype: "cheque",
      uom: {
        uom: "each",
        country: "global",
        symbol: "each"
      }
    }

    console.log('CHEQUE TO BE SAVED',JSON.stringify(cheque))

    //return

    this.saveCheque(cheque)

    return false

  }


  
  saveCheque(cheque:any) {
    this.inProgress = true
    let sah:SaveChequeService = new SaveChequeService(this.httpClient)
    this._piSub = sah.saveCheque(cheque).subscribe({
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
          this.loadCheques(0,0)
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
    
    let ahlService:ChequeListService = new ChequeListService(this.httpClient)
    let criteria:any = {draweeis:'anybank',offset:offset};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchCheques(criteria).subscribe({
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
          let newCheques:any[] = dataSuccess.success
          for (let index = 0; index < newCheques.length; index++) {
            const element = newCheques[index];
            this.chequeList.push(JSON.parse(JSON.stringify(element)))
          }
          
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
