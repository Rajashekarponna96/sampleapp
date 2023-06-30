import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PersonWithoutEndpoint } from './person-without-endpoint';


@Component({
  selector: 'app-new-view-people',
  templateUrl: './new-view-people.component.html',
  styleUrls: ['./new-view-people.component.css']
})
export class NewViewPeopleComponent implements OnInit,OnChanges {


  @Input() personWithoutEndpoint:PersonWithoutEndpoint = new PersonWithoutEndpoint
  @Input() currentMode:string = 'viewmode'

  

  isperson:boolean = true;
  iscompany:boolean = false;

  disableRadio:boolean = true;
  disablePNButton = true;


  names:any[] = []
  emailids:any[] = []
  telephones:any[] = []
  postalAddresses:any[] = [] 
  

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('PERSON IN NEW CHANGE VIEW',this.personWithoutEndpoint);
    
    if(this.currentMode == 'viewmode') {
      this.disableRadio = true
      this.disablePNButton = true
    }
    else if (this.currentMode == 'newmode') {
      this.disableRadio = false
      this.disablePNButton = false
    }
    // else if (this.currentMode == 'editmode') {
    //   this.disableRadio = true
    //   this.disablePNButton = false
    // }

    
    

    if(this.personWithoutEndpoint.content != null) {
      
      if(this.personWithoutEndpoint.pc == 'person') {
        this.isperson = true
        this.iscompany = false
      }
      else if(this.personWithoutEndpoint.pc == 'company') {
        this.isperson = false
        this.iscompany = true
      }

      this.break(this.personWithoutEndpoint.content)
    }

  }


  break(person:any) {

    this.names = person.names

    //console.log('ENDPOINTS',person.endpoints)
    
    let elist:any = []
    let tlist:any = []
    let alist:any = []
    person.endpoints.forEach(function(value:any) {
      //console.log('ENDPOINT',value)
      if(value.type == 'emailid') {
        elist.push(value)
      }
      else if(value.type == 'telephone') {
        tlist.push(value)
      }
      else if(value.type == 'address') {
        alist.push(value)
      }
    })
    this.emailids = elist
    this.telephones = tlist
    this.postalAddresses = alist

    
    console.log('THIS.PAS',this.postalAddresses)

  }




  pcchange(event:any) {

    console.log('EVENT',event)

    this.personWithoutEndpoint.pc = event
    this.personWithoutEndpoint.content.pc = event

    if(event == 'person') {

      console.log('IN PERSON')

      this.names.splice(0,this.names.length)
      this.isperson = true
      this.iscompany = false

      this.names.push({
        firstname: "",
        middlename: "",
        lastname: "",
        fullname: ""
      })

      this.personWithoutEndpoint.content.names = this.names
    }
    else if (event == 'company') {

      console.log('IN COMPANY')

      this.names.splice(0,this.names.length)
      this.isperson = false
      this.iscompany = true

      let cnArray = [{
        name:""
      }]

      this.names = cnArray
      console.log(this.names)

      this.personWithoutEndpoint.content.names = this.names

    }
  }

  handleDeleteOfName(event:any) {
    console.log('DELETE',event)
    let updatedArray = [];
    for (let el of this.names) {
      if (el !== event) {
        updatedArray.push(el);
      }
    }
    this.names = updatedArray;
    this.personWithoutEndpoint.content.names = this.names
  }

  

  handleAddName() {
    if(this.personWithoutEndpoint.pc == 'person') {
      this.names.push({
        firstname: "",
        middlename: "",
        lastname: "",
        fullname: ""
      })
    }
    if(this.personWithoutEndpoint.pc == 'company') {
      this.names.push({
        name:""
      })
    }
    this.personWithoutEndpoint.content.names = this.names
    
  }


  handleAddEmailID() {

    this.emailids.push({
      type: "emailid",
      detail: {
        "emailid": ""
      } 
    })
    
    let endpointList:any[] = []
    this.emailids.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.telephones.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.postalAddresses.forEach(function(value:any) {
      endpointList.push(value)
    })

    this.personWithoutEndpoint.content.endpoints = endpointList
    
  }



  handleDeleteOfEmail(event:any) {
    console.log('DELETE',event)
    let updatedArray = [];
    for (let el of this.emailids) {
      if (el !== event) {
        updatedArray.push(el);
      }
    }
    this.emailids = updatedArray;
    this.make()
  }

  make() {
    let endpointList:any = []
    
    this.telephones.forEach(function(value:any) {
      endpointList.push(value)
    })

    this.emailids.forEach(function(value:any) {
      endpointList.push(value)
    })

    this.postalAddresses.forEach(function(value:any) {
      endpointList.push(value)
    })

    
    this.personWithoutEndpoint.content.endpoints = endpointList
    
  }


  handleAddTelephone() {

    this.telephones.push({
      type: "telephone",
      detail: {
        "telephone": ""
      } 
    })
    
    let endpointList:any[] = []
    this.emailids.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.telephones.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.postalAddresses.forEach(function(value:any) {
      endpointList.push(value)
    })

    this.personWithoutEndpoint.content.endpoints = endpointList
    
  }

  handleDeleteOfTelephone(event:any) {
    console.log('DELETE',event)
    let updatedArray = [];
    for (let el of this.telephones) {
      if (el !== event) {
        updatedArray.push(el);
      }
    }
    this.telephones = updatedArray;
    this.make()
  }


  handleAddAddress() {

    this.postalAddresses.push({
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
    })
    
    let endpointList:any[] = []
    this.emailids.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.telephones.forEach(function(value:any) {
      endpointList.push(value)
    })
    this.postalAddresses.forEach(function(value:any) {
      endpointList.push(value)
    })

    this.personWithoutEndpoint.content.endpoints = endpointList
    
  }

  handleDeleteOfPostalAddress(event:any) {
    console.log('DELETE',event)
    let updatedArray = [];
    for (let el of this.postalAddresses) {
      if (el !== event) {
        updatedArray.push(el);
      }
    }
    this.postalAddresses = updatedArray;
    this.make()
  }
  

}
