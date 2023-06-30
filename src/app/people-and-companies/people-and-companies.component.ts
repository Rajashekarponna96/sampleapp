import { Component, ElementRef, Input, OnInit,Output,ViewChild,EventEmitter,AfterViewInit } from '@angular/core';
import { FilterService, MenuItem, FilterMatchMode } from "primeng/api";
import { CountryService } from "./countryservice";
import { PersonWithoutEndpoint } from './new-view-people/person-without-endpoint';
import { CheckPersonService } from '../services/check-person.service';
import { Person } from '../model/person';
import { HttpClient } from '@angular/common/http';

import { XetaSuccess } from '../global/xeta-success';
import { Xetaerror } from '../global/xetaerror';
import { SavePersonService } from '../services/save-person.service';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';



@Component({
  selector: 'app-people-and-companies',
  templateUrl: './people-and-companies.component.html',
  styleUrls: ['./people-and-companies.component.css'],
  providers: [CountryService, FilterService]
})
export class PeopleAndCompaniesComponent implements OnInit {

  
  @ViewChild('listview') listView:any
  @ViewChild('newview') newView:any

  @ViewChild('checkSaveBtn') checkSaveBtn:any

  @Input() inProgress:boolean = false;

  

  index:number = -1
  
  countries: any[] = new Array;

  filteredCountries: any[] = new Array;

  selectedCountries: any[] = new Array;

  currentMode:string = 'viewmode'
  selectedPerson:PersonWithoutEndpoint = new PersonWithoutEndpoint;
  disableEditButton:boolean = true
  disableSaveButton:boolean = true
  
  items:MenuItem[] = new Array;

  personView:string = 'New'


  similarPeople:any

  personToBeSaved:any

  copyOfPWE:PersonWithoutEndpoint = new PersonWithoutEndpoint()

  searchText:string = ''

  totalRecords:number = 0

  recordsPerPage:number = 50

  offset:number = 0

  

  filteredList:any[] = []

  mostSimilarIsThere:boolean = false
  
  

  constructor(private countryService: CountryService,
    private filterService: FilterService, private httpClient:HttpClient,private eventBusService:EventBusServiceService) 
    { }

  ngOnInit(): void {

    this.items = [
      {label:'View',disabled:true},
    ];

    this.countryService.getCountries().then(countries => {
      this.countries = countries;
    });

    this.selectedPerson = {
      person: "-1",
      pc: "",
      name: "",
      content: {
        pc:'',
        names: [
          
        ],
        endpoints:[
          
        ],
        dobi: "infinity",
        dodd: "infinity",
        govtids: [],
        files: [],
        locations: [],
        connections: [],
        medical: {},
        academic: {},
        financialstatements: {}
      }
    }

  }

  

  ngOnDestroy() {
    //this._countrySub.unsubscribe()
    // this._peopleSub.unsubscribe()
    // console.log('UNSUB')
  }

  filterCountry(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    console.log('QUERY',query)
    for (let i = 0; i < this.countries.length; i++) {
      let country = this.countries[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  

  listSelectionChange(event:any) {
    console.log('LIST SELECTION CHANGE',event)
    this.selectedPerson = event.value[0]
    this.currentMode = 'viewmode'
    this.disableSaveButton = true;
    this.items = [
      {label:'View',disabled:true},
    ];
  }

  listLoadEvent(event:any) {
    console.log('LOAD EVENT',event)
    this.totalRecords = event
  }

  newButtonClick(event:any) {

    console.log('IN NEW')

    this.selectedPerson = {
      person: "-1",
      pc: "person",
      name: "",
      content: {
        pc: 'person',
        names: [
          {
            firstname: "",
            middlename: "",
            lastname: "",
            fullname: ""
          }
        ],
        endpoints:[
          {
            type: 'emailid',
            detail: {
              emailid: ''
            }
          },
          {
            type: 'telephone',
            detail: {
              telephone: ''
            }
          },
          {
            type: "address",
            detail: {
              "doorno": "",
              "street": "",
              "area":"",
              "city":"",
              "state":"",
              "country":"",
              "pincode":"",
              "tags":[]
            } 
          }

        ],
        dobi: "infinity",
        dodd: "infinity",
        govtids: [],
        files: [],
        locations: [],
        connections: [],
        medical: {},
        academic: {},
        financialstatements: {}
      }
    }

    this.currentMode = 'newmode'
    this.disableEditButton = true
    this.disableSaveButton = false

    this.items = [
      {label:'New'}
    ];
    this.personView = 'New'

  }


  editButtonClick(event:any) {
    //this.currentMode = 'editmode'
  }

  itemClick(event:any) {
    console.log('BREAD CRUMB ITEM CLICK',event.item.label)
    this.personView = event.item.label
    if(event.item.label == 'New') {
      this.selectedPerson = this.copyOfPWE
      this.checkSaveBtn.innerText = 'Check'
      console.log('CHECK SAVE BTN',this.checkSaveBtn)
    }
    
  }

  checkButtonClick(event:any){
    
    if(this.personView == 'New') {
      this.checkPerson(event)
    }
    else if (this.personView == 'Similar People') {
      if(this.mostSimilarIsThere) {
        alert('A similar person is already there in the database.')
        return
      }
      this.savePerson(event)
    }
  }

  checkPerson(event:any){

    console.log('EVENT',event.target)
    console.log('NEW VIEW',this.newView)

    this.copyOfPWE = this.newView.personWithoutEndpoint
    this.personToBeSaved = this.newView.personWithoutEndpoint.content

    // let atleastOneName = true;
    // let atleastOneEndpoint = true;

    // this.personToBeSaved.names.forEach(function(value:any) {
    //   endpointList.push(value)
    // })

    let person = this.personToBeSaved;

    let newNames:any[] = []
    newNames = person.names.filter(function(el:any) {
      if(person.pc == 'person') {
        return el.fullname != ''
      }
      else if(person.pc == 'company'){
        return el.name != ''
      }
      return false
    })

    console.log('NEW NAMES',newNames)

    let newEndpoints:any[] = []
    newEndpoints = person.endpoints.filter(function(el:any) {
      if(el.type == 'emailid') {
        //return el.detail.emailid != ''
        return el.isvalid
      }
      else if (el.type == 'telephone') {
        return el.detail.telephone != ''
      }
      return false
    })

    console.log('NEW ENDPOINTS',newEndpoints)


    
    if(newNames.length === 0) {
      alert('You must enter atleast one name')
      return;
    }
    else if(newEndpoints.length === 0) {
      alert('You must enter atleast one valid email-id or telephone')
      return;
    }

    this.personToBeSaved.names = newNames
    this.personToBeSaved.endpoints = newEndpoints
    
    let cps:CheckPersonService = new CheckPersonService(this.httpClient)

    console.log('CHECK PERSON',this.personToBeSaved)
 
    this.personToBeSaved["person-or-company"] = this.personToBeSaved.pc

    console.log('SAVE FINAL PERSON',this.personToBeSaved)

    cps.checkPerson(this.personToBeSaved).subscribe({
      complete: () => {console.info('complete')},
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
          this.personView = 'New'
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.similarPeople = dataSuccess.success;
          this.mostSimilarIsThere = this.mostSimilar(this.similarPeople)
          this.items = [{label:'New'},{label:'Similar People'}];
          this.personView = 'Similar People'
          console.log('SIMILAR PEOPLE',this.similarPeople)
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          this.personView = 'New'
          return;
        }
        else {
          alert('An undefined error has occurred.')
          this.personView = 'New'
          return
        }
      }
    })


    
  }


  mostSimilar(similarPeople:any):boolean{
    for (let index = 0; index < similarPeople.length; index++) {
      const element = similarPeople[index];
      console.log('ELEMENT',element)
      if (element.similarity > 0.98) {
        return true
      }
    }
    return false
  }
  

  savePerson(event:any) {
    
    console.log('EVENT',event.target)
    console.log('NEW VIEW',this.newView)
    
    let sps:SavePersonService = new SavePersonService(this.httpClient)

    console.log('SAVE FINAL PERSON',this.personToBeSaved)

    sps.savePerson(this.personToBeSaved).subscribe({
      complete: () => {console.info('complete')},
      error: (e) => {
        console.log('ERROR',e)
        alert('A server error occured. '+e.message)
        this.personView = 'New'
        this.selectedPerson = this.copyOfPWE
        return;
      },
      next: (v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          alert(dataError.error);
          this.personView = 'New'
          return;
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          //alert(dataSuccess.success)
          this.items = [
            {label:'View',disabled:true},
          ];
          this.personView = 'New'
          this.currentMode = 'viewmode'
          this.disableSaveButton = true
          this.listView.ngOnInit()
          return;
        }
        else if(v == null) {
          alert('A null object has been returned. An undefined error has occurred.')
          this.personView = 'New'
          return;
        }
        else {
          alert('An undefined error has occurred.')
          this.personView = 'New'
          return
        }
      }
    })

  }



  searchInputChanged(event:any) {
    console.log(this.searchText)
    let trimmedText = this.searchText.trim()
    this.eventBusService.emit(new EventData('FilterList',trimmedText))
    
  }

  paginate(event:any) {

    console.log('PAGINATE',event)
    this.eventBusService.emit(new EventData('Paginate',event.first))

  }

  handleMore(event:any) {
    this.searchText = ''
    this.eventBusService.emit(new EventData('FilterList',''))
    console.log('MORE IN PC')
    this.eventBusService.emit(new EventData('MoreButtonPressed','morebtn'))

  }


}
