import { Component, OnInit,ViewChild } from '@angular/core';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { HttpClient } from '@angular/common/http';
import { EventData } from 'src/app/global/event-data';
import { Xetaerror } from 'src/app/global/xetaerror';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { StockLocationListService } from 'src/app/services/stock-location-list.service';
import { SaveStockLocationService } from 'src/app/services/save-stock-location.service';

@Component({
  selector: 'app-stock-locations',
  templateUrl: './stock-locations.component.html',
  styleUrls: ['./stock-locations.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class StockLocationsComponent implements OnInit {

  _ahlSub:any
  inProgress:boolean = false
  stockLocations:any[] = []

  displayModal:boolean = false

  selectedLocation:any = {
    'stocklocation':''
  }

  _sahSub:any

  @ViewChild('itemTitle') itemTitle:any

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService,private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadStockLocations(0,0)
  }

  loadStockLocations(offset:number,moreoffset:number) {
    
    let ahlService:StockLocationListService = new StockLocationListService(this.httpClient)
    let criteria:any = {searchtext:'',screen:'display',offset:moreoffset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchStockLocations(criteria).subscribe({
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
          this.stockLocations = dataSuccess.success
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
    
    this.selectedLocation = {
      'stocklocation':''
    }
    this.displayModal = true

  }

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
    }
    
  }

  handleDeleteStockLocation(t:any) {
    console.log('EVENT',t)
    //this.tags.splice(t,1)
  }

  inputChange(event:any) {

  }

  handleSave() {

    if(this.itemTitle.errors)
    {
      console.log('there is an error in the form !')
      this.confirm('There are errors in the form.  Please check before saving.')
      return
    }

    
    
    console.log('ITEM TO BE SAVED',JSON.stringify(this.selectedLocation))

    //return
    
    this.inProgress = true
    
    let sah:SaveStockLocationService = new SaveStockLocationService(this.httpClient)
    this._sahSub = sah.saveStockLocation(this.selectedLocation).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inProgress = false
        this.confirm('A server error occured while saving stock location. '+e.message)
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
          this.loadStockLocations(0,0)
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
