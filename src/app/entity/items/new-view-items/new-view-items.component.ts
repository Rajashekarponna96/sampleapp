import { Component, OnInit, Input, ViewChild,ElementRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { EventData } from 'src/app/global/event-data';

import { Xetaerror } from 'src/app/global/xetaerror';
import { SaveItemService } from 'src/app/services/save-item.service';
import { UOMListService } from 'src/app/services/uomlist.service';

import { XetaSuccess } from 'src/app/global/xeta-success'; 



@Component({
  selector: 'app-new-view-items',
  templateUrl: './new-view-items.component.html',
  styleUrls: ['./new-view-items.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class NewViewItemsComponent implements OnInit {


  @Input() currentMode:string = ''

  @ViewChild('itemTitle') itemTitle:any
  @ViewChild('selectUOM') selectUOM:any
  
  @Input() item:any

  placeholder:string = 'select uom'

  items:MenuItem[] = [
    {label:'Items',disabled:true}
  ];
  disableEditButton:boolean = true
  disableSaveButton:boolean = true

  inProgress:boolean = false
  private _sahSub:any

  selectedUOM:any
  filteredUOMs:any[] = new Array
  private _pweSub:any

  disableControls:boolean = true

  selectedTax:any = {
    taxname: "",
    taxcode: "",
    taxpercent: "",
    taxtype: "",
    taxamount: "0.00",
    taxauthority: {}
  }

  taxTypes:any[] = [{type:''},{type:'vat'},{type:'nonvat'}]

  @ViewChild('selectTaxType') selectTaxType:any
  
 
  @ViewChild('taxNameInput') taxNameInput:ElementRef = new ElementRef({})

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.eventBusService.on('SelectedItem',(data:any)=> {
      console.log('SELECTED',data)
      this.item = data
      this.disableSaveButton = true
      this.selectedUOM = data.uom
      this.disableControls = true
    })
    
  }

  inputChange(event:any) {
    console.log('ISVALID',this.itemTitle.valid)
    this.item['isvalid'] = this.itemTitle.valid

  }

  itemClick(event:any) {
    console.log('BREAD CRUMB ITEM CLICK',event.item.label)
  }

  saveButtonClick(event:any) {
    this.handleSave()
    //this.eventBusService.emit(new EventData('SaveOtherAccountHead','saveoah'))
  }

  editButtonClick(event:any) {

  }

  newOtherAccountButtonClick(event:any) {
    
    this.items = [
      {label:'New'}
    ];
    this.disableEditButton = true
    this.disableSaveButton = false

    this.disableControls = false

    this.item = {
      itemname: "",
      uom: {
        uom: "",
        symbol: "",
        country: ""
      },
      partofgroup: -1,
      usercode: "",
      isgroup: false,
      files: [],
      taxes: [],
      recipe: {
        consumedunits: [],
        byproducts: []
      }
    }

    this.selectedUOM = null

    this.eventBusService.emit(new EventData('NewItem','newitem'))
    
    
  }


  handleSave(){


    // console.log(this.itemTitle.errors ? true : false)
    // console.log(this.selectUOM.errors ? true : false)


    if(this.itemTitle.errors || this.selectUOM.errors)
    {
      console.log('there is an error in the form !')
      this.confirm('There are errors in the form.  Please check before saving.')
      return
    }

    this.inProgress = true


    let sah:SaveItemService = new SaveItemService(this.httpClient)
    this._sahSub = sah.saveItem(this.item).subscribe({
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
          this.eventBusService.emit(new EventData('SuccessSaveItem','savesuccessit'))
          this.disableControls = true
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




  filterUOMs(event:any) {
    console.log('IN FILTER UOMs',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {
      searchtext: event.query,
      screen: "",
      searchtype: "begins",
      offset: 0
    }
    console.log('CRITERIA',criteria)
    let pweService:UOMListService = new UOMListService(this.httpClient)
    this._pweSub = pweService.fetchUOMs(criteria).subscribe({
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
          this.filteredUOMs = dataSuccess.success;
          console.log('FILTERED UOMS',dataSuccess.success)
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
    this.selectedUOM = event
    this.item.uom = event;
  }

  
  UOMChange(event:any) {
    this.item.uom = {uom:'',symbol:'',country:''}
    //this.item.uom = ''
  }

  ngOnDestroy():void {
    console.log('PWE SUB',this._pweSub)
    console.log('AOP SUB',this._sahSub)
    if(typeof this._pweSub !== 'undefined'){
      this._pweSub.unsubscribe()
    }
    if(typeof this._sahSub !== 'undefined'){
      this._sahSub.unsubscribe()
    }
    console.log('UNSUB IN NEW VIEW PARTY ACCOUNT')
  }


  handleDelete(event:any) {
    console.log('EVENT',event)
    this.item.taxes.splice(event,1)
  }

  handleNewTax() {
    
    let highRecID:number = this.highestRecordID(this.item.taxes)
    console.log('HID',highRecID)

    this.selectedTax['recordid'] = highRecID + 1

    let copiedTax = JSON.parse(JSON.stringify(this.selectedTax));
    this.item.taxes.push(copiedTax)

    this.clearTaxForm()

    this.taxNameInput.nativeElement.focus()

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


  

  clearTaxForm() {

    this.selectedTax = {
      taxname: "",
      taxcode: "",
      taxpercent: "",
      taxtype: "",
      taxamount: "0.00",
      taxauthority: {}
    }

  }

  
  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
      this.selectedTax = event.data
    }
    
  }



}






/*

{
  itemname: "Manifolds",
  uom: {
    uom: "each",
    symbol: "each",
    country: "global"
  },
  partofgroup: -1,
  usercode: "M123",
  isgroup: false,
  files: [],
  taxes: [
    {
      taxname: "CGST",
      taxcode: "",
      taxpercent: "2.5",
      taxtype: "vat",
      taxamount: "0.00",
      taxauthority: {
        id: "6",
        accounthead: "Commercial Taxes Department ",
        defaultgroup: "party",
        relationship: "",
        neid: "3",
        person: "3",
        name: "",
        endpoint: "18004253787",
        accounttype: "vendor",
        partofgroup: -1,
        isgroup: false
      }
    }
  ],
  recipe: {
    consumedunits: [],
    byproducts: []
  }
}
*/