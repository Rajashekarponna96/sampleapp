import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { EventData } from 'src/app/global/event-data';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { AccountsOfPersonService } from 'src/app/services/accounts-of-person.service';
import { PeopleWithoutEndpointsServiceService } from 'src/app/services/people-without-endpoints-service.service';
import { SaveAccountHeadService } from 'src/app/services/save-account-head.service';
import { Search } from 'src/app/services/search';

import { MenuItem } from 'primeng/api';

import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { GlobalConstants } from 'src/app/global/global-constants';
import { UpdateDigitalKeyService } from 'src/app/services/update-digital-key.service';
import { DigitalKeyService } from 'src/app/services/digital-key.service';


@Component({
  selector: 'app-party-account-heads',
  templateUrl: './party-account-heads.component.html',
  styleUrls: ['./party-account-heads.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class PartyAccountHeadsComponent implements OnInit {

  
  selectedPerson:any
  filteredPeople:any[] = new Array
  private _pweSub:any
  existingAccounts:any[] = new Array
  private _aopSub:any
  selectedPersonName:string = ''
  endpoints:any[] = new Array
  filteredEndpoints:any[] = new Array
  selectedEndpoint:any
  selectedFullEndpoint:any
  accountTypes:any[] = [{type:'customer'},{type:'vendor'},{type:'employee'},{type:'bank'}]
  filteredAccountTypes:any[] = new Array
  filteredComponentNames:any[] = new Array
  selectedAccountType:any
  selectedInitialComponent:any
  extPwd:string = ''
  intPwd:string = ''
  private _sahSub:any
  inProgress:boolean = false

  
  accountheads:any[] = new Array
  selectedRows:any[] = new Array
  _ahlSub:any
  
  inFilter:boolean = false
  filteredList:any[] = []
  searchText:string = ''
  @ViewChild('paginator') paginator:any
  
  @ViewChild('listview') listview:any
  

  displayModal:boolean = false
  accountHeadList:any[] = []

  disableExternalPWD:boolean = false
  disableInternalPWD:boolean = false
  
  offset:number = 0

  displayAccessModal:boolean = false

  dkeyList:any[] = []

  ahid:any

  lo:any

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    
    this.lo = GlobalConstants.loginObject

    this.filteredComponentNames = [
      {type: 'DashboardComponent'},
      {type: 'StockRegisterComponent'}
    ]
    
    this.loadAccountHeads(0,0)
  }

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
    }
  } 

  
  ngOnDestroy():void {
    console.log('PWE SUB',this._pweSub)
    console.log('AOP SUB',this._aopSub)
    if(typeof this._pweSub !== 'undefined'){
      this._pweSub.unsubscribe()
    }
    if(typeof this._aopSub !== 'undefined'){
      this._aopSub.unsubscribe()
    }

    console.log('UNSUB IN AH LIST COMPONENT')
    this._ahlSub.unsubscribe()
    console.log('UNSUB IN NEW VIEW PARTY ACCOUNT')
  }


  showModalDialog() {

    this.selectedPerson = null
    
    this.existingAccounts = []

    this.filteredEndpoints = []

    this.disableInternalPWD = true
    this.disableExternalPWD = true

    this.displayModal = true
  }

  


  loadAccountHeads(offset:number,moreoffset:number) {
    let ahlService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'party-accounthead'};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchAccountHeads(criteria).subscribe({
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
          this.accountheads = dataSuccess.success
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





  



  filterPeople(event:any) {
    console.log('IN FILTER PEOPLE',event)
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    console.log('CRITERIA',criteria)
    let pweService:PeopleWithoutEndpointsServiceService = new PeopleWithoutEndpointsServiceService(this.httpClient)
    this._pweSub = pweService.fetchPeople(criteria).subscribe({
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
          this.filteredPeople = dataSuccess.success;
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
    this.selectedEndpoint = undefined
    this.extPwd = ''
    this.intPwd = ''
    console.log('SELECT A PERSON',event.person)
    let person = {person:event.person}
    this.selectedPersonName = event.name
    let aopService:AccountsOfPersonService = new AccountsOfPersonService(this.httpClient)
    this._aopSub = aopService.fetchAccountsOfPerson(person).subscribe({
      complete: () => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        alert('A server error occured while fetching accounts of person. '+e.message)
        return;
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          alert(dataError.error);
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.existingAccounts = dataSuccess.success;
          console.log('EXISTING ACCOUNTS',this.existingAccounts)
          this.endpoints = event.content.endpoints
          console.log('ENDPOINTS',this.endpoints)
          this.filteredEndpoints = []
          this.filteredAccountTypes = []
          for (let index = 0; index < this.endpoints.length; index++) {
            const element = this.endpoints[index];
            if(element.type == 'telephone') {
              element['recordid'] = index
              element['endpointdetail'] = element.detail.telephone
              this.filteredEndpoints.push(element)
            }
            if(element.type == 'emailid') {
              element['recordid'] = index
              element['endpointdetail'] = element.detail.emailid
              this.filteredEndpoints.push(element)
            }
          }
          console.log('FILTERED ENDPOINTS',this.filteredEndpoints)
          
          let existingAccountTypes:any[] = []
          //existingAccountTypes.push({type:''})
          for (let index = 0; index < this.existingAccounts.length; index++) {
            const element = this.existingAccounts[index];
            let a:any = {}
            a['type'] = element.accounttype
            existingAccountTypes.push(a)
          }
          
          console.log('EXISTING ACCOUNT TYPES',existingAccountTypes)
          console.log('ACCOUNT TYPES',this.accountTypes)
          

          this.filteredAccountTypes = this.filterByReference(this.accountTypes,existingAccountTypes)
          console.log('FILTERED ACCOUNT TYPES',this.filteredAccountTypes)
          if(this.filteredAccountTypes.length > 0) {
            this.filteredAccountTypes.splice(0, 0, {type:''})
          }

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



  filterByReference = (accountTypes:any[], existingAccountTypes:any[]) => {
    let res = [];
    res = accountTypes.filter(el => {
       return !existingAccountTypes.find(element => {
          return element.type === el.type;
       });
    });
    return res;
 }



 accountTypeChange(event:any) {

  console.log('CP DROPDOWN CHANGE',event.value)

  if(event.value === 'employee') {
    this.disableInternalPWD = false
    this.disableExternalPWD = false
  }
  else {
    this.disableInternalPWD = true
    this.disableExternalPWD = false
  }

 }

 componentChange(event:any) {

 }


 handleSave(){

  console.log('PERSON',this.selectedPerson)
  console.log('ENDPOINT',this.selectedEndpoint)
  console.log('ACCOUNT TYPE',this.selectedAccountType)

  if (typeof this.selectedPerson === 'undefined' || this.selectedPerson == null) {
    //alert('You must select a person')
    this.confirm('You must select a person')
    return false
  }
  if (typeof this.selectedEndpoint === 'undefined' || this.selectedEndpoint == null) {
    // alert('You must select a telephone or an email-id')
    this.confirm('You must select a telephone or an email-id')
    return false
  }
  if (typeof this.selectedAccountType === 'undefined' || this.selectedAccountType == null || this.selectedAccountType === '') {
    // alert('You must select an account type')
    this.confirm('You must select an account type')
    return false
  }

  if(this.selectedPerson.pc === 'company' && this.selectedAccountType === 'employee') {
    this.confirm('Companies cannot be employees.')
    return false
  }

  if(this.selectedPerson.pc === 'person' && this.selectedAccountType === 'bank') {
    this.confirm('Individuals cannot be banks')
    return false
  }
  

  this.inProgress = true

  let newAh:any = {}
  newAh['accounthead'] = this.selectedPersonName
  newAh['endpoint'] = this.selectedEndpoint.endpointdetail
  newAh['defaultgroup'] = 'party'
  newAh['accounttype'] = this.selectedAccountType
  newAh['isgroup'] = false
  newAh['partofgroup'] = 'null'
  newAh['person'] = this.selectedPerson.person
  newAh['neid'] = -1
  newAh['extpwd'] = this.extPwd
  newAh['intpwd'] = this.intPwd

  console.log('AH TO BE SAVED',JSON.stringify(newAh))

  //return

  let sah:SaveAccountHeadService = new SaveAccountHeadService(this.httpClient)
  this._sahSub = sah.saveAccountHead(newAh).subscribe({
    complete:() => {console.info('complete')},
    error:(e) => {
      console.log('ERROR',e)
      //alert('A server error occured while saving account head. '+e.message)
      this.inProgress = false
      this.confirm('A server error occured while saving account head. '+e.message)
      return false;
    },
    next:(v) => {
      console.log('NEXT',v);
      if(v == null) {
        //alert('A null object has been returned. An undefined error has occurred.') 
        this.inProgress = false
        this.confirm('A null object has been returned. An undefined error has occurred.')
        return false;
      }
      if (v.hasOwnProperty('error')) {
        let dataError:Xetaerror = <Xetaerror>v; 
        //alert(dataError.error);
        this.confirm(dataError.error)
        this.inProgress = false
        return false;
      }
      else if(v.hasOwnProperty('success')) {
        
        this.inProgress = false
        this.displayModal = false
        this.loadAccountHeads(0,0)

        return true;
      }
      
      else {
        //alert('An undefined error has occurred.')
        this.inProgress = false
        this.confirm('An undefined error has occurred.')
        return false
      }
    }
  })

  return false

}




handleDisplay(data:any) {

  console.log('AH DATA',data)
  let pwe:any = {}
  pwe['name'] = data.accounthead
  this.selectedPerson = pwe
  this.selectedPersonName = pwe.name

  this.existingAccounts = []

  let es:any[] = []
  let e:any = {}
  e['endpointdetail'] = data.endpoint
  es.push(e)
  this.filteredEndpoints = es


  let at:any = {type:data.accounttype}
  let ats:any[] = []
  ats.push(at)
  this.filteredAccountTypes = ats

  this.extPwd = data.extpwd
  this.intPwd = data.intpwd


}


handleAccess(ah:any) {

  console.log('AH',ah)

  this.dkeyList = []
  this.ahid = ah["id"]
  this.loadAccess(ah["id"])

  return

  
}





loadAccess(ahid:any) {
  
  let ahlService:DigitalKeyService = new DigitalKeyService(this.httpClient)
  let criteria:any = {accountid: ahid}
  console.log('CRITERIA',criteria)
  this._ahlSub = ahlService.fetchDigitalKey(criteria).subscribe({
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
        this.inProgress = false
        
        let dataSuccess:XetaSuccess = <XetaSuccess>v;
        let dkey:any = dataSuccess.success
        for (const [key, value] of Object.entries(dkey)) {
          if (key !== "initialscreen") {
            let a:any = JSON.parse(JSON.stringify(value))
            a["key"] = key
            this.dkeyList.push(a)
            
          }
          else if(key === "initialscreen") {
            this.selectedInitialComponent = value
          }
          
        }
        this.displayAccessModal = true;
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




checkChanged(i:any) {
  console.log('CLASS TO BE CHANGED:',this.dkeyList[i])
}

handleUpdateAccess() {

  let dk:any = {}
  for (let index = 0; index < this.dkeyList.length; index++) {
    const element = this.dkeyList[index];
    let b:any = {}
    b["name"] = element.name
    b["new"] = element.new
    b["view"] = element.view
    b["edit"] = element.edit
    dk[element.key] = b
  }

  let finaldk:any = {}
  dk["initialscreen"] = this.selectedInitialComponent
  finaldk["digitalkey"] = dk
  finaldk["accountid"] = this.ahid

  console.log('UPDATED DIGITAL KEY',JSON.stringify(finaldk))

  this.handleUpdateAccessService(finaldk)

}

handleUpdateAccessService(finaldk:any) {
  

  this.inProgress = true

  
  let sah:UpdateDigitalKeyService = new UpdateDigitalKeyService(this.httpClient)
  this._sahSub = sah.updateDigitalKey(finaldk).subscribe({
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
        
        this.displayAccessModal = false
        //this.loadItems(0,0)
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
  this.offset = this.offset+500
  this.loadMore(this.offset)
}



loadMore(offset:number) {
  let ahlService:AccountHeadListService = new AccountHeadListService(this.httpClient)
  let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'party-accounthead'};
  console.log('CRITERIA',criteria)
  this._ahlSub = ahlService.fetchAccountHeads(criteria).subscribe({
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
        
        let newAccountHeads:any[] = dataSuccess.success
          for (let index = 0; index < newAccountHeads.length; index++) {
            const element = newAccountHeads[index];
            this.accountheads.push(JSON.parse(JSON.stringify(element)))
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

  // DO NOT DELETE

  // searchInputChanged(event:any) { 
  //   console.log(this.searchText)
  //   let trimmedText = this.searchText.trim()
  //   this.filterAccountHeads(trimmedText)
  //   this.paginator.changePage(0);
  // }

  // filterAccountHeads(trimmedText:string) {
  //   if(trimmedText != '') {
      
  //     this.inFilter = true
  //     this.filteredList = this.filterService.filter(this.masterCopy,['accounthead','accounttype','defaultgroup'],trimmedText,FilterMatchMode.CONTAINS)
  //     console.log('FILTERED LIST',this.filteredList)
      
  //     this.accountheads = this.filteredList.slice(0,this.recordsPerPage+0);
  //     this.totalRecords = this.filteredList.length
      
  //   }
  //   else if (trimmedText == '') {
  //     this.inFilter = false
  //     this.accountheads = this.masterCopy.slice(0,this.recordsPerPage+0);
  //     this.totalRecords = this.masterCopy.length
      
  //   }
  // }

  // handleMore(event:any) {
    
  //   this.inFilter = false
  //   this.moreoffset = this.moreoffset+50
  //   this.inProgress = true
  //   let ahlService:AccountHeadListService = new AccountHeadListService(this.httpClient)
  //   let criteria:Search = <Search>{searchtext:'',screen:'display',offset:this.moreoffset,searchtype:'party-accounthead'};
  //   console.log(criteria)
  //   this._ahlSub = ahlService.fetchAccountHeads(criteria).subscribe({
  //     complete:() => {console.info('complete')},
  //     error:(e) => {
  //       this.inProgress = false
  //       this.confirm('A server error occured while fetching account heads. '+e.message)
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

  //         console.log(dataSuccess.success);
  //         for (let index = 0; index < dataSuccess.success.length; index++) {
  //           const element = dataSuccess.success[index];
  //           this.masterCopy.push(element)
  //         }

  //         this.totalRecords = this.masterCopy.length
  //         this.paginator.totalRecords = this.masterCopy.length
  //         let lastPage = Math.floor(this.paginator.totalRecords/this.paginator.rows)
  //         console.log('ROWS',this.paginator.rows)
  //         console.log('TOTAL RECORDS',this.paginator.totalRecords)
  //         console.log('LAST PAGE',lastPage)
          
  //         // get the last page slice
  //         this.accountheads = this.masterCopy.slice(this.paginator.rows*lastPage,this.recordsPerPage+(this.paginator.rows*lastPage));
  //         this.paginator.changePage(lastPage)
          
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

  // paginate(event:any) {

  //   console.log('PAGE EVENT',event)
  //   if(this.inFilter) {
  //     this.accountheads = this.filteredList.slice(event.first,this.recordsPerPage+event.first);
  //   }
  //   else if(!this.inFilter) {
  //     this.accountheads = this.masterCopy.slice(event.first,this.recordsPerPage+event.first);
  //   }

  // }

  

  


  
}
