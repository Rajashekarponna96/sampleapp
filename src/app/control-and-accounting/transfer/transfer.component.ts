import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ItemsListService } from 'src/app/services/items-list.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { StockLocationListService } from 'src/app/services/stock-location-list.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { StockItemInLocationService } from 'src/app/services/stock-item-in-location.service';
import { SaveTransferService } from 'src/app/services/save-transfer.service';
import { InvoiceListService } from 'src/app/services/invoice-list.service';
import { Search } from 'src/app/services/search';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class TransferComponent implements OnInit {

  transferList:any[] = []
  displayModal:boolean =  false

  selectedDate: Date = new Date();
  newInvoice:any = {}

  selectedItem:any = {
    itemname:'',
    uom:{
      uom:''
    }
  }
  filteredItems:any[] = new Array
  private _iSub:any
  @ViewChild('selectItem') selectItem:any
  placeholderItem = 'select item'

  selectedUOM:any

  selectedFromLocation:any = {
    'location':''
  }
  filteredFromLocations:any[] = new Array
  @ViewChild('selectFromLocation') selectFromLocation:any
  placeholderFromLocation = 'select from location'

  selectedItemQuantity:any
  selectedQty:any

  selectedToLocation:any = {
    'location':''
  }
  filteredToLocations:any[] = new Array
  @ViewChild('selectToLocation') selectToLocation:any
  placeholderToLocation = 'select to location'

  inProgress:boolean = false

  _siSub:any

  _invSub:any

  
  

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { 
    this.selectedItem = {
      itemname:'',
      uom:{
        uom:''
      }
    }
  }

  ngOnInit(): void {
    this.loadInvoices(0,0)
  }

  loadInvoices(offset:number,moreoffset:number) {

    this.inProgress = true
    
    let ahlService:InvoiceListService = new InvoiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'transfer',attribute:''};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchInvoiceList(criteria).subscribe({
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
          // this.saleList = []
          this.transferList = dataSuccess.success
          // this.totalRecords = this.saleList.length
          // console.log('TOTAL RECORDS',this.totalRecords)
          // // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          // this.sanitizedInvoiceList = []
          // this.sanitizeInvoices()
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

  showModalDialog() {
    this.displayModal = true
  }

  handleMore() {

  }

  onRowSelect(e:any) {

  }

  handleView(inv:any) {

  }

  dateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.newInvoice.date = isoDateTime
    //this.selectedDate = isoDateTime
   
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

  handleOnSelectItem(event:any) {

    this.selectedItem = event

    //console.log('ITEM SELECTED',event)

    

  }

  itemChange(event:any) {
    console.log('ITEM CHANGE',event)
    console.log('ITEM CHANGE TYPEOF',typeof event)
    if(event === null || event === '') {
      this.selectedItem = {
        itemname:'',
        uom:{
          uom:''
        }
      }
    }
    else {
      this.selectedItem = event;
    }
    
  }

  filterFromLocations(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:StockLocationListService = new StockLocationListService(this.httpClient)
    this._iSub = iService.fetchStockLocations(criteria).subscribe({
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
          this.filteredFromLocations = dataSuccess.success;
          console.log('FILTERED STOCK LOCATIONS',dataSuccess.success)
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

  handleOnSelectFromLocation(event:any) {

    this.selectedFromLocation = event
    // call the xetadata_stockbalance_ofitem_inlocation
    console.log('SELECTED ITEM',this.selectedItem)
    if (typeof this.selectedItem === 'undefined' || this.selectedItem == null || this.selectedItem.itemname === '') {
      this.confirm('You must select an item')
      return 
    }
    let a = {
      'itemid':this.selectedItem.id,
      'location':this.selectedFromLocation.location
    }
    this.stockItemInLocation(a)
  }

  fromLocationChange(event:any) {
    console.log('LOCATION CHANGE',event)
    this.selectedItemQuantity = ''
  }



  stockItemInLocation(event:any) {
    console.log('IN STOCK ITEM IN LOCATION',event)
    console.log('CRITERIA',event)
    let iService:StockItemInLocationService = new StockItemInLocationService(this.httpClient)
    this._iSub = iService.fetchStockItemInLocation(event).subscribe({
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
          //this.filteredFromLocations = dataSuccess.success;
          console.log('STOCK ITEM IN LOCATION',dataSuccess.success[0])
          this.selectedItemQuantity = dataSuccess.success[0].quantity
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

  filterToLocations(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:StockLocationListService = new StockLocationListService(this.httpClient)
    this._iSub = iService.fetchStockLocations(criteria).subscribe({
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
          this.filteredToLocations = dataSuccess.success;
          console.log('FILTERED STOCK LOCATIONS',dataSuccess.success)
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

  handleOnSelectToLocation(event:any) {

    this.selectedToLocation = event

  }

  toLocationChange(event:any) {
    console.log('LOCATION CHANGE',event)
  }


  handleSaveTransfer() {

    if (typeof this.selectedItem === 'undefined' || this.selectedItem == null) {
      this.confirm('You must select an item')
      return false
    }

    if (this.selectedFromLocation.location === '' || this.selectedFromLocation == null || typeof this.selectedFromLocation === 'undefined' ) {
      this.confirm('You must select from location')
      return false
    }

    if (this.selectedToLocation.location === '' || this.selectedToLocation == null || typeof this.selectedToLocation === 'undefined' ) {
      this.confirm('You must select from location')
      return false
    }

    
    if (typeof this.selectedQty === 'undefined' || this.selectedQty == null || this.selectedQty === 0) {
      this.confirm('You must enter a quantity greater than zero')
      return false
    }

    if (this.selectedFromLocation.location === this.selectedToLocation.location) {
      this.confirm('You must select different from and to location')
      return false
    }
    

    let transferform = {
      'date': this.ISODate(this.selectedDate),
      'from': this.selectedFromLocation,
      'to':this.selectedToLocation,
      'item':this.selectedItem,
      'quantity':this.selectedQty
    }

    console.log('TRANSFER FORM TO BE SAVED',JSON.stringify(transferform))

    this.saveSale(transferform)

    return

  }


  saveSale(newInvoice:any){

    this.inProgress = true
    
    let sah:SaveTransferService = new SaveTransferService(this.httpClient)
    this._siSub = sah.saveTransfer(newInvoice).subscribe({
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
          //this.sanitizedInvoiceList
          this.loadInvoices(0,0)
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



  ISODate(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime) 
    
    return isoDateTime
   
  }



}
