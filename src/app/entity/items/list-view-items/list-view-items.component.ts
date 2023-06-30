import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Search } from 'src/app/services/search';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { EventData } from 'src/app/global/event-data';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { Xetaerror } from 'src/app/global/xetaerror';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { ItemsListService } from 'src/app/services/items-list.service';

@Component({
  selector: 'app-list-view-items',
  templateUrl: './list-view-items.component.html',
  styleUrls: ['./list-view-items.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ListViewItemsComponent implements OnInit {

  items:any[] = new Array
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

  constructor(private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService,private filterService: FilterService) { }

  ngOnInit(): void {

    this.loadItems(0,0)

    this.eventBusService.on('NewItem',(data:any)=> {
      console.log('IN LIST VIEW NEW PAH')
      this.selectedRows = []
    })

    this.eventBusService.on('SuccessSaveItem',(data:any)=> {
      this.loadItems(0,0)
    })

  }

  selectionChange(event:any) {
    

    console.log('IN ITEM')
    this.eventBusService.emit(new EventData('SelectedItem',event.value[0]))
    
  }


  loadItems(offset:number,moreoffset:number) {
    let ahlService:ItemsListService = new ItemsListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:moreoffset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchItems(criteria).subscribe({
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
          this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
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


  searchInputChanged(event:any) { 
    console.log(this.searchText)
    let trimmedText = this.searchText.trim()
    this.filterItems(trimmedText)
    this.paginator.changePage(0);
  }

  filterItems(trimmedText:string) {
    if(trimmedText != '') {
      
      this.inFilter = true
      this.filteredList = this.filterService.filter(this.masterCopy,['itemname','usercode'],trimmedText,FilterMatchMode.CONTAINS)
      console.log('FILTERED LIST',this.filteredList)
      
      this.items = this.filteredList.slice(0,this.recordsPerPage+0);
      this.totalRecords = this.filteredList.length
      
    }
    else if (trimmedText == '') {
      this.inFilter = false
      this.items = this.masterCopy.slice(0,this.recordsPerPage+0);
      this.totalRecords = this.masterCopy.length
      
    }
  }

  handleMore(event:any) {
    
    this.inFilter = false
    this.moreoffset = this.moreoffset+50
    this.inProgress = true
    let ahlService:ItemsListService = new ItemsListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:this.moreoffset,searchtype:'',attribute:''};
    console.log(criteria)
    this._ahlSub = ahlService.fetchItems(criteria).subscribe({
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

          console.log(dataSuccess.success);
          for (let index = 0; index < dataSuccess.success.length; index++) {
            const element = dataSuccess.success[index];
            this.masterCopy.push(element)
          }

          this.totalRecords = this.masterCopy.length
          this.paginator.totalRecords = this.masterCopy.length
          let lastPage = Math.floor(this.paginator.totalRecords/this.paginator.rows)
          console.log('ROWS',this.paginator.rows)
          console.log('TOTAL RECORDS',this.paginator.totalRecords)
          console.log('LAST PAGE',lastPage)
          
          // get the last page slice
          this.items = this.masterCopy.slice(this.paginator.rows*lastPage,this.recordsPerPage+(this.paginator.rows*lastPage));
          this.paginator.changePage(lastPage)
          
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

  paginate(event:any) {

    console.log('PAGE EVENT',event)
    if(this.inFilter) {
      this.items = this.filteredList.slice(event.first,this.recordsPerPage+event.first);
    }
    else if(!this.inFilter) {
      this.items = this.masterCopy.slice(event.first,this.recordsPerPage+event.first);
    }

  }

  ngOnDestroy() {
    console.log('UNSUB IN AH LIST COMPONENT')
    this._ahlSub.unsubscribe()
  }


}
