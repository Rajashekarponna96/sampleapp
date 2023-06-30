import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild,Input } from '@angular/core';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import { Search } from 'src/app/services/search';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { EventData } from 'src/app/global/event-data';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { Xetaerror } from 'src/app/global/xetaerror';
import { XetaSuccess } from 'src/app/global/xeta-success';


import { MenuItem } from 'primeng/api';

import { SaveAccountHeadService } from 'src/app/services/save-account-head.service';
import { GlobalConstants } from 'src/app/global/global-constants';
import { UpdateAccountheadService } from 'src/app/services/update-accounthead.service';


@Component({
  selector: 'app-other-account-heads',
  templateUrl: './other-account-heads.component.html',
  styleUrls: ['./other-account-heads.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class OtherAccountHeadsComponent implements OnInit {


  accountheads:any[] = new Array
  selectedRows:any[] = new Array
  inProgress:boolean = false
  _ahlSub:any
  masterCopy:any[] = new Array
  recordsPerPage:number = 50
  inFilter:boolean = false
  filteredList:any[] = []
  searchText:string = ''
  @ViewChild('paginator') paginator:any
  moreoffset:number = 0
  totalRecords:number = 0
  @ViewChild('listview') listview:any


  @Input() currentMode:string = ''

  @ViewChild('accountHeadTitle') accountHeadTitle:any
  @ViewChild('selectAccountType') selectAccountType:any
  
  //@Input() accountHead:any

  defaultGroups:any[] = [{type:''},{type:'sales'},{type:'purchases'},{type:'cash'},{type:'equity'}]
  partofList:any[] = [{type:''},{type:'TRD'},{type:'P&L'},{type:'BAL'}]

  items:MenuItem[] = [
    {label:'New'}
  ];
  disableEditButton:boolean = true
  disableSaveButton:boolean = true
  disablePartof:boolean = false

  
  private _sahSub:any

  displayModal:boolean = false
  displayEditModal:boolean = false
  
  accountHead:any = {
    id: "",
    accounthead: "",
    defaultgroup: "",
    relationship: "",
    neid: "-1",
    person: "",
    name: "",
    endpoint: "",
    accounttype: "",
    partofgroup: -1,
    isgroup: false,
    partof:""
  }
  
  offset:number = 0

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService,private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadAccountHeads(0,0)
  }


  loadAccountHeads(offset:number,moreoffset:number) {
    let ahlService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'nonparty-accounthead'};
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
          this.masterCopy = dataSuccess.success
          this.totalRecords = this.masterCopy.length
          this.accountheads = this.masterCopy.slice(offset,this.recordsPerPage+offset);
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


  newOtherAccountButtonClick(event:any) {
    
    this.items = [
      {label:'New'}
    ];
    this.disableEditButton = true
    this.disableSaveButton = false

    this.accountHead ={
      id: "",
      accounthead: "",
      defaultgroup: "",
      relationship: "",
      neid: "-1",
      person: "",
      name: "",
      endpoint: "",
      accounttype: "",
      partofgroup: -1,
      isgroup: false,
      partof:""
    }
    this.defaultGroups = [{type:''},{type:'sales'},{type:'purchases'},{type:'cash'},{type:'equity'}]

    
  }

  showModalDialog() {
    
    let lo:any = GlobalConstants.loginObject
    if(this.haskeys(lo.digitalkey)) {
      if(!lo.digitalkey.otheraccountheads.new) {
        this.confirm("You are not permitted to use this feature.")
        return
      }
    }
    else if(!this.haskeys(lo.digitalkey)) {
      console.log('NO KEYS ARE DEFINED')
    }

    this.accountHead ={
      id: "",
      accounthead: "",
      defaultgroup: "",
      relationship: "",
      neid: "-1",
      person: "",
      name: "",
      endpoint: "",
      accounttype: "",
      partofgroup: -1,
      isgroup: false
    }
    this.defaultGroups = [{type:''},{type:'sales'},{type:'purchases'},{type:'cash'},{type:'equity'}]

    this.displayModal = true

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


  inputChange(event:any) {
    console.log('ISVALID',this.accountHeadTitle.valid)
    this.accountHead['isvalid'] = this.accountHeadTitle.valid

  }

  defaultGroupChange(event:any) {
    console.log('CP DROPDOWN CHANGE',event)
    if(event === 'equity' || event === 'cash') {
      this.accountHead.partof = 'BAL'
      this.disablePartof = true
    }
    else {
      this.disablePartof = false
    }
  }

  partofChange(event:any) {

    console.log('CP DROPDOWN CHANGE',event)
    this.accountHead.partof = event

  }

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
      
    }
  }


  handleSave(){


    console.log(this.accountHeadTitle.errors ? true : false)
    console.log(this.selectAccountType.errors ? true : false)


    if(this.accountHeadTitle.errors || this.selectAccountType.errors)
    {
      console.log('there is an error in the form !')
      this.confirm('There are errors in the form.  Please check before saving.')
      return
    }

    if(this.accountHead.partof === '') {
      this.confirm('You must select a part of account.')
      return
    }


    console.log('SAVE FORM',this.accountHead)
    
    //return
    
    this.inProgress = true

    

    let sah:SaveAccountHeadService = new SaveAccountHeadService(this.httpClient)
    this._sahSub = sah.saveAccountHead(this.accountHead).subscribe({
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

          this.disableSaveButton = true;
          this.inProgress = false
          
          this.displayModal = false;
          this.loadAccountHeads(0,0)

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


  handleDisplay(ah:any) {

  }


  handleEditAccount(ah:any) {
    this.accountHead = ah

    console.log('ACCOUNTHEAD TO BE EDITED',ah)

    if(this.accountHead.defaultgroup === 'equity' || this.accountHead.defaultgroup === 'cash') {
      this.disablePartof = true
    }
    else {
      this.disablePartof = false
    }

    this.displayEditModal = true;
  }

  handleUpdate() {


    if(this.accountHead.partof === '') {
      this.confirm('You must select a part of account.')
      return
    }


    
    console.log('ITEM TO BE UPDATED',JSON.stringify(this.accountHead))
    

    this.inProgress = true

    //return

    
    
    let sah:UpdateAccountheadService = new UpdateAccountheadService(this.httpClient)
    this._sahSub = sah.updateAccountHead(this.accountHead).subscribe({
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
          
          this.displayEditModal = false
          this.loadAccountHeads(0,0)
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
  //   let criteria:Search = <Search>{searchtext:'',screen:'display',offset:this.moreoffset,searchtype:'nonparty-accounthead'};
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

  ngOnDestroy() {
    console.log('UNSUB IN AH LIST COMPONENT')
    this._ahlSub.unsubscribe()
  }










  handleMore() {
    this.offset = this.offset+500
    this.loadMore(this.offset)
  }

  loadMore(offset:number) {
    let ahlService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'nonparty-accounthead'};
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

}
