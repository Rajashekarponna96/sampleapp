import { Component, OnInit,ViewChild } from '@angular/core';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';

import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { HttpClient } from '@angular/common/http';
import { EventData } from 'src/app/global/event-data';
import { Xetaerror } from 'src/app/global/xetaerror';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { ItemLevelListService } from 'src/app/services/item-level-list.service';
import { SaveItemLevelService } from 'src/app/services/save-item-level.service';

@Component({
  selector: 'app-item-levels',
  templateUrl: './item-levels.component.html',
  styleUrls: ['./item-levels.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ItemLevelsComponent implements OnInit {

  itemLevels:any[] = []  
  itemLevel:any = {}
  inProgress:boolean = false;

  displayModal:boolean = false;

  private _ahlSub:any
  private _sahSub:any

  itemLevelTypes:any[] = [{level:''},{level:'level1'},{level:'level2'},{level:'level3'}]

  @ViewChild('itemTitle') itemTitle:any

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService,private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadItemLevels(0,0)
  }

  loadItemLevels(offset:number,moreoffset:number) {
    
    let ahlService:ItemLevelListService = new ItemLevelListService(this.httpClient)
    let criteria:any = {searchtext:'',screen:'display',offset:moreoffset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchItemLevels(criteria).subscribe({
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
          this.itemLevels = dataSuccess.success
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
    
    this.itemLevel = {
      level: "",
      levelname: ""
    }

    this.displayModal = true

  }

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
    }
    
  }

  handleDeleteItemLevel(t:any) {
    console.log('EVENT',t)
    this.itemLevels.splice(t,1)
  }

  inputChange(event:any) {

  }

  itemLevelTypeChange(event:any) {

    console.log('CP DROPDOWN CHANGE',event.value)

  }

  handleSave() {

    if(this.itemTitle.errors)
    {
      console.log('there is an error in the form !')
      this.confirm('There are errors in the form.  Please check before saving.')
      return
    }

    if(this.itemLevel.level === '')
    {
      console.log('there is an error in the form !')
      this.confirm('You must choose a level.')
      return
    }

    
    console.log('ITEM LEVEL TO BE SAVED',JSON.stringify(this.itemLevel))

    //return
    
    this.inProgress = true

    let sah:SaveItemLevelService = new SaveItemLevelService(this.httpClient)
    this._sahSub = sah.saveItemLevel(this.itemLevel).subscribe({
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
          this.loadItemLevels(0,0)
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
