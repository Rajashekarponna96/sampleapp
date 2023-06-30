import { Component, OnInit, ViewChild } from '@angular/core';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { PeopleService } from 'src/app/services/people.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import * as moment from 'moment';
import { Search } from 'src/app/services/search';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { SaveChequeService } from 'src/app/services/save-cheque.service';
import { GlobalConstants } from 'src/app/global/global-constants';

@Component({
  selector: 'app-equity-payable',
  templateUrl: './equity-payable.component.html',
  styleUrls: ['./equity-payable.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class EquityPayableComponent implements OnInit {

  selectedDate: Date = new Date();

  displayModal = false;
  displayViewModal = false;

  equityList:any[] = []
  inProgress:boolean = false
  private _invSub:any

  selectedParty:any
  filteredParties:any[] = new Array
  private _pSub:any
  @ViewChild('selectParty') selectParty:any
  placeholderParty = 'select party'


  selectedEquityTypeAH:any
  filteredEquityTypeAH:any[] = new Array
  private _bpSub:any
  @ViewChild('selectBankParty') selectEquityTypeAH:any
  placeholderBankParty = 'select equity accounthead'

  newEquity:any = {}

  selectedEquity:any = {}
  
  selectedVal:any
  @ViewChild('selectVal') selectVal:any

  selectedQty:any
  @ViewChild('selectQty') selectQty:any

  selectedNumber:any
  @ViewChild('selectNumber') selectNumber:any

  _piSub:any;

  offset:number = 0

  lo:any


  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
    this.loadEquity(0,0)
  }

  loadEquity(offset:number,moreoffset:number) {

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
    this.newEquity.date = isoDateTime
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
    this.newEquity.promisee = event;

  }

  partyChange(event:any) {
    this.newEquity.promisee =  {
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

  filterEquityTypeAH(event:any) {
    console.log('IN FILTER PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'equity-accounthead-begins'};
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
          this.filteredEquityTypeAH = dataSuccess.success;
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




  handleOnSelectEquityTypeAH(event:any) {
    this.selectedEquityTypeAH = event
    this.newEquity.cashtypeah = event;

  }

  equityTypeAHChange(event:any) {
    this.newEquity.cashtypeah =  {
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

    if (typeof this.selectedNumber === 'undefined' || this.selectedNumber == null || this.selectedNumber === '') {
      this.confirm('You must enter cheque number')
      return false
    }

    if (typeof this.selectedParty === 'undefined' || this.selectedParty == null) {
      this.confirm('You must select a party')
      return false
    }

    if (typeof this.selectedEquityTypeAH === 'undefined' || this.selectedEquityTypeAH == null) {
      this.confirm('You must select an equity account')
      return false
    }
  
    if (typeof this.selectedVal === 'undefined' || this.selectedVal == null ) {
      this.confirm('You must enter par value')
      return false
    }

    

     

    let equity:any = {
      date: this.ISODate(this.selectedDate),
      instrumentnumber: this.selectedNumber.toString(),
      promisee: this.selectedParty,
      promisor: this.lo.entityne,
      amount: this.selectedVal,
      draweeis: "entity",
      status: "",
      cashtypeah: this.selectedEquityTypeAH,
      files: [],
      instrumenttype: "equity",
      uom: {
        uom: "each",
        country: "global",
        symbol: "each"
      },
      quantity:this.selectedQty,
      par: this.selectedVal/this.selectedQty
    }

    console.log('EQUITY TO BE SAVED',JSON.stringify(equity))

    //this.saveEquity(equity)

    return false

  }


  
  // saveEquity(cheque:any) {
  //   this.inProgress = true
  //   let sah:SaveChequeService = new SaveChequeService(this.httpClient)
  //   this._piSub = sah.saveCheque(cheque).subscribe({
  //     complete:() => {console.info('complete')},
  //     error:(e) => {
  //       console.log('ERROR',e)
  //       this.inProgress = false
  //       this.confirm('A server error occured while saving account head. '+e.message)
  //       return;
  //     },
  //     next:(v) => {
  //       console.log('NEXT',v);
  //       if (v.hasOwnProperty('error')) {
  //         let dataError:Xetaerror = <Xetaerror>v; 
  //         //alert(dataError.error);
  //         this.confirm(dataError.error)
  //         this.inProgress = false
  //         return;
  //       }
  //       else if(v.hasOwnProperty('success')) {

  //         this.inProgress = false
  //         this.displayModal = false
  //         this.loadCheques(0,0)
  //         return;
  //       }
  //       else if(v == null) {

  //         this.inProgress = false
  //         this.confirm('A null object has been returned. An undefined error has occurred.')
  //         return;
  //       }
  //       else {
  //         //alert('An undefined error has occurred.')
  //         this.inProgress = false
  //         this.confirm('An undefined error has occurred.')
  //         return
  //       }
  //     }
  //   })

  //   return
  // }








  handleMore() {
    // this.offset = this.offset + 500
    // this.loadMore(this.offset)
  }


  // loadMore(offset:number) {

  //   this.inProgress = true
    
  //   let ahlService:ChequeListService = new ChequeListService(this.httpClient)
  //   let criteria:any = {draweeis:'anybank',offset:offset};
  //   console.log('CRITERIA',criteria)
  //   this._invSub = ahlService.fetchCheques(criteria).subscribe({
  //     complete:() => {console.info('complete')},
  //     error:(e) => {
  //       this.inProgress = false
  //       this.confirm('A server error occured while fetching cheques. '+e.message)
  //       return
  //     },
  //     next:(v) => {
  //       console.log('NEXT',v);
  //       if (v.hasOwnProperty('error')) {
  //         let dataError:Xetaerror = <Xetaerror>v; 
  //         this.confirm(dataError.error)
  //         this.inProgress = false
  //         return
  //       }
  //       else if(v.hasOwnProperty('success')) {
          
  //         let dataSuccess:XetaSuccess = <XetaSuccess>v;
  //         let newCheques:any[] = dataSuccess.success
  //         for (let index = 0; index < newCheques.length; index++) {
  //           const element = newCheques[index];
  //           this.chequeList.push(JSON.parse(JSON.stringify(element)))
  //         }
          
  //         this.inProgress = false
  //         return
  //       }
  //       else if(v == null) { 
  //         this.inProgress = false
  //         this.confirm('A null object has been returned. An undefined error has occurred.')
  //         return
  //       }
  //       else {
  //         //alert('An undefined error has occurred.')
  //         this.inProgress = false
  //         this.confirm('An undefined error has occurred.')
  //         return false
  //       }
  //     }
  //   })

  // }


}
