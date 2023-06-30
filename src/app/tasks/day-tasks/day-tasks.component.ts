import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { EventData } from 'src/app/global/event-data';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';

import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { DayTaskListService } from 'src/app/services/day-task-list.service';
import { UpdateTaskService } from 'src/app/services/update-task.service';
import { GenerateTasksService } from 'src/app/services/generate-tasks.service';
import { TagListService } from 'src/app/services/tag-list.service';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import { PointOfSaleService } from 'src/app/services/point-of-sale.service';

@Component({
  selector: 'app-day-tasks',
  templateUrl: './day-tasks.component.html',
  styleUrls: ['./day-tasks.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class DayTasksComponent implements OnInit {

  daytasks:any[] = new Array
  sdTaskList:any[] = new Array
  displayModal:boolean = false
  inProgress:boolean = false
  selectedTaskTitle:any = 'milksale'

  displayPromiseModal:boolean = false;
  selectedParty:string = ''
  selectedEndpoint:string = ''
  selectedVouchers:any[] = []

  displaySubEditModal:boolean = false;

  selectedItem:any

  private _ahlSub:any

  selectedQty:any
  @ViewChild('selectQty') selectQty:any

  

  selectedUIR:any

  selectedTaxes:any[] = new Array

  ri:string = 'rit'

  rad:any = 0

  rbt:any = 0
  t:any = 0
  rat:any = 0

  private vattaxperunit:number = 0
  private nonvattaxperunit:number = 0

  private totalvatperc:number = 0
  private totalnonvatperc:number = 0

  discountLabel:string = 'discount percent'
  discountAmount:number = 0

  discountState:boolean = false

  inputDiscount:any
  @ViewChild('selectDiscount') selectDiscount:any

  selectedDiscountAmount:any
  selectedDiscountPercent:any

  selectedPromise:any

  indexOfPromiseBeingEdited:any


  selectedTags:any[] = []
  filteredTags:any[] = new Array
  
  private _eSub:any


  selectedFromParty:any
  filteredFromParties:any[] = new Array
  private _pSub:any
  @ViewChild('selectFromParty') selectFromParty:any
  placeholderFromParty = 'assigned by employee'


  selectedToParty:any
  filteredToParties:any[] = new Array
  @ViewChild('selectToParty') selectToParty:any
  placeholderToParty = 'assigned to employee'

  private _siSub:any


  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadTasks(0,0,this.selectedTaskTitle)
  }


  loadTasks(offset:number,moreoffset:number,taskTitle:string) {

    this.inProgress = true
    
    let ahlService:DayTaskListService = new DayTaskListService(this.httpClient)
    let criteria:any = {taskstring:taskTitle};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchDayTasks(criteria).subscribe({
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
          // this.masterCopy = dataSuccess.success
          // this.totalRecords = this.masterCopy.length
          // this.accountheads = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.daytasks = dataSuccess.success
          this.sanitizeDayTasks()
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


  handleGet() {

    let gt:any = {}

    // {"tags":[{"id": "1", "tag": "MILKSALE"}],"timezone":"Asia/Calcutta","fromperson":{"id":1},"toperson":{"id":1},"taskstring":"MILKSALE"}

    gt["taskstring"] = this.selectedTaskTitle
    gt["tags"] = this.selectedTags
    gt["fromperson"] = this.selectedFromParty
    gt["toperson"] = this.selectedToParty

    console.log('GT',JSON.stringify(gt))
    this.generateTasks(gt)
    
  }


  generateTasks(gt:any) {

    this.inProgress = true
    
    let ahlService:GenerateTasksService = new GenerateTasksService(this.httpClient)
    let criteria:any = gt;
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.generateTasks(criteria).subscribe({
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
          
          this.inProgress = false
          this.sdTaskList = []
          this.loadTasks(0,0,'MILKSALE')
          this.displayModal = false
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




  filterTags(event:any) {
    console.log('IN FILTER TAGS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'begins'};
    console.log('CRITERIA',criteria)
    
    let pService:TagListService = new TagListService(this.httpClient)
    this._eSub = pService.fetchTags(criteria).subscribe({
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
          this.filteredTags = dataSuccess.success;
          console.log('FILTERED TAGS',dataSuccess.success)
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
  

  filterFromParties(event:any) {
    console.log('IN FILTER FROM PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any= {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
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
          this.filteredFromParties = dataSuccess.success;
          console.log('FILTERED FROM PEOPLE',dataSuccess.success)
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


  handleOnSelectFromParty(event:any) {
    this.selectedFromParty = event
    //this.newInvoice.partyaccounthead = event;
  }


  fromPartyChange(event:any) {
    
  }


  filterToParties(event:any) {
    console.log('IN FILTER TO PARTIES',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any= {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
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
          this.filteredToParties = dataSuccess.success;
          console.log('FILTERED TO PEOPLE',dataSuccess.success)
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


  handleOnSelectToParty(event:any) {
    this.selectedToParty = event
  }


  toPartyChange(event:any) {
    
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






  sanitizeDayTasks() {
    
    let ah:any = {}
    for (let index = 0; index < this.daytasks.length; index++) {
      const element = this.daytasks[index];
      ah["id"] = element.id
      ah["accounthead"] = element.party.accounthead
      ah["endpoint"] = element.party.endpoint
      ah["itemname"] = element.strucnotes[0].object.itemdef.itemname
      ah["quantity"] = element.strucnotes[0].quantity
      ah["eststartdt"] = element.eststartdt
      ah["strucnotes"] = element.strucnotes

      ah["fulltaskdetail"] = element

      this.sdTaskList.push(JSON.parse(JSON.stringify(ah)))
    }
  }



  

  inputChange(event:any) {

  }

  showModalDialog() {
    this.displayModal = true
  }

  onRowSelect(event:any) {

  }
  
  handleLapse(ah:any,i:any) {
    let task:any = this.daytasks[i]
    task.status = 'lapsed'
    console.log('EDITED TASK TO BE SAVED',JSON.stringify(task))

    this.updateTask(task)

  }

  handleEdit(ah:any,i:any) {

    //this.selectedPromise = ah;
    this.indexOfPromiseBeingEdited = i

    this.selectedVouchers = ah.strucnotes
    console.log('PARTY',ah)
    this.selectedParty = ah.accounthead
    this.selectedEndpoint = ah.endpoint
    this.displayPromiseModal = true

  }


  handleDone(ah:any) {
    
    let newInvoice:any = {}
    newInvoice['date'] = new Date()
    newInvoice['entity'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    newInvoice['partyaccounthead'] = ah.fulltaskdetail.party
    newInvoice['party'] = {'person':-1,'id':-1,'name':"",'endpoint':"",'displayfile':{}}
    
    if(this.selectedVouchers.length === 0) {
      this.selectedVouchers = ah.fulltaskdetail.strucnotes
    }

    let copySelectedVouchers = JSON.parse(JSON.stringify(this.selectedVouchers))
    
    for (let index = 0; index < copySelectedVouchers.length; index++) {
      const element = copySelectedVouchers[index];
      element.object = element.object.itemdef
      
    }
    
    newInvoice['vouchers'] = copySelectedVouchers
    newInvoice['salesformtype'] = 'sale'
    newInvoice['relationshipid'] = ah.fulltaskdetail.relationshipid
    newInvoice['annotation'] = 'milksale'

    newInvoice['task'] = ah.fulltaskdetail

    console.log('INVOICE TO BE SAVED',JSON.stringify(newInvoice))

    this.saveSale(newInvoice)

  }


  saveSale(newInvoice:any){

    this.inProgress = true
    
    let sah:PointOfSaleService = new PointOfSaleService(this.httpClient)
    this._siSub = sah.savePointOfSale(newInvoice).subscribe({
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
          this.displayPromiseModal = false
          this.sdTaskList = []
          this.loadTasks(0,0,'milksale')

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


  handleEditPromise(v:any,i:any) {

    this.selectedItem = v.itemdef

    this.selectedUIR = v.userinputrate
    this.selectedQty = v.quantity
    
  }

  


  onSearchChange(event:any,i:any): void {  
    console.log('VALUE',event.target.value);
    //this.selectedQty = event.target.value;
    this.selectedVouchers[i].quantity = event.target.value
    

  }

  handleEditTask() {

    let task:any = this.daytasks[this.indexOfPromiseBeingEdited]
    task.strucnotes = this.selectedVouchers
    console.log('EDITED TASK TO BE SAVED',JSON.stringify(task))

    this.updateTask(task)

  }



  handleDeletePromise(i:any) {

  }

  

  updateTask(task:any) {

    this.inProgress = true
    
    let ahlService:UpdateTaskService = new UpdateTaskService(this.httpClient)
    let criteria:any = task;
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.updateTask(criteria).subscribe({
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
          this.displayPromiseModal = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.inProgress = false
          this.displayPromiseModal = false
          this.sdTaskList = []
          this.loadTasks(0,0,'milksale')
          return
        }
        else if(v == null) { 
          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          this.displayPromiseModal = false
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          this.confirm('An undefined error has occurred.')
          this.displayPromiseModal = false
          return false
        }
      }
    })

  }
  

  



  

}
