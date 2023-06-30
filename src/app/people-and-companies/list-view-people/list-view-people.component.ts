import { Component, EventEmitter, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FilterService,FilterMatchMode } from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { PeopleWithoutEndpointsServiceService } from '../../services/people-without-endpoints-service.service';

import { Search } from '../../services/search';


@Component({
  selector: 'app-list-view-people',
  templateUrl: './list-view-people.component.html',
  styleUrls: ['./list-view-people.component.css']
})
export class ListViewPeopleComponent implements OnInit,OnChanges {

  people: any[] = new Array;

  private _peopleSub:any;

  @Output() selectEvent = new EventEmitter<any>()
  @Output() loadEvent = new EventEmitter<any>()

  @Input() currentMode:string = ''

  selectedRows:any[] = []

  inProgress:boolean = false

  masterCopy: any[] = new Array;
  
  @Input() offset:number = 0

  @Input() recordsPerPage:number = 0

  inFilter:boolean = false

  filteredList:any[] = []

  moreoffset:number = 0

  
  
  constructor(private peopleService:PeopleWithoutEndpointsServiceService, private eventBusService:EventBusServiceService,private filterService: FilterService) { }

  ngOnInit(): void {

    this.inProgress = true
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:this.offset,searchtype:'party'};
    this._peopleSub = this.peopleService.fetchPeople(criteria).subscribe((res:any) => {
      console.log(res.success);
      this.masterCopy = res.success;
      this.people = this.masterCopy.slice(this.offset,this.recordsPerPage+this.offset);
      this.inProgress = false
      this.loadEvent.emit(this.masterCopy.length)
      
    })

    this.eventBusService.on('MoreButtonPressed',(data:any) => {
      console.log('MORE EVENT RECEIVED',data)
      this.handleMore()
    }) 

    this.eventBusService.on('FilterList',(data:any) => {
      if(data != '') {
        this.inFilter = true
        console.log('FILTER EVENT RECEIVED',data)
        this.inFilter = true
        this.filteredList = this.filterService.filter(this.masterCopy,['name','pc'],data,FilterMatchMode.CONTAINS)
        console.log('FILTERED LIST',this.filteredList)
        this.loadEvent.emit(this.filteredList.length)
        this.people = this.filteredList.slice(this.offset,this.recordsPerPage+this.offset);
      }
      else if (data == '') {
        this.inFilter = false
        this.people = this.masterCopy.slice(this.offset,this.recordsPerPage+this.offset);
      }
      
    })

    this.eventBusService.on('Paginate',(data:any) => {
      if(this.inFilter) {
        this.people = this.filteredList.slice(data,this.recordsPerPage+data);
      }
      else if(!this.inFilter) {
        this.people = this.masterCopy.slice(data,this.recordsPerPage+data);
      }
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if(this.currentMode == 'newmode') {
      this.selectedRows = []
    }
    
  }


  public selectionChange(event:any) {
    this.selectEvent.emit(event)
  }

  

  ngOnDestroy() {
    //this._countrySub.unsubscribe()
    this._peopleSub.unsubscribe()
    console.log('UNSUB')
  }

  handleMore() {
      
      this.moreoffset = this.moreoffset+50
      this.inProgress = true
      let criteria:Search = <Search>{searchtext:'',screen:'display',offset:this.moreoffset,searchtype:'party'};
      console.log(criteria)
       this._peopleSub = this.peopleService.fetchPeople(criteria).subscribe((res:any) => {
        console.log(res.success);
        for (let index = 0; index < res.success.length; index++) {
          const element = res.success[index];
          this.masterCopy.push(element)
        }
        this.inProgress = false
        console.log('LENGTH',this.masterCopy.length)
        this.loadEvent.emit(this.masterCopy.length)
        
      })

  }



}
