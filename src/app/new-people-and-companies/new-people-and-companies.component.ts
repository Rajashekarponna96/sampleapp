import { Component, OnInit } from '@angular/core';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import {ConfirmationService,MessageService} from 'primeng/api';
import { PeopleWithoutEndpointsServiceService } from '../services/people-without-endpoints-service.service';
import { HttpClient } from '@angular/common/http';
import { Search } from 'src/app/services/search';
import { CheckPersonService } from '../services/check-person.service';
import { SavePersonService } from '../services/save-person.service';
import { UpdatePersonService } from '../services/update-person.service';




@Component({
  selector: 'app-new-people-and-companies',
  templateUrl: './new-people-and-companies.component.html',
  styleUrls: ['./new-people-and-companies.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class NewPeopleAndCompaniesComponent implements OnInit {

  people:any[] = []
  inProgress:boolean = false
  private _ahlSub:any

  

  displayNewModal:boolean = false
  displaySimilarModal:boolean = false
  displayErrorModal:boolean = false
  displayViewModal:boolean = false

  similarPeople:any[] = []
  private _chkSub:any

  offset:number = 0

  viewNames:any[] = [] 

  
  person:any

  //selectedIsPerson:boolean = true
  

  

  isperson:boolean = true;
  iscompany:boolean = false;

  names:any[] = []
  emailids:any[] = []
  telephones:any[] = []
  postalAddresses:any[] = []
  govtids:any[] = []


  inCheckProgress:boolean = false

  displayEditModal:boolean = false

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) {
    this.person = this.returnNewPerson
  }

  ngOnInit(): void {
    this.loadPeople(0,0)
  }


  loadPeople(offset:number,moreoffset:number) {
    
    this.inProgress = true

    let ahlService:PeopleWithoutEndpointsServiceService = new PeopleWithoutEndpointsServiceService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'party'};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchPeople(criteria).subscribe({
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
          this.people = dataSuccess.success
          // for (let index = 0; index < this.products.length; index++) {
          //   const element = this.products[index];
          //   element.recordid = index

          // }
          // this.totalRecords = this.masterCopy.length
          // this.products = this.masterCopy.slice(offset,this.recordsPerPage+offset);
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

  onRowSelect(event:any) {
    if(event !== null) {
      console.log('ROW SELECT',event)
      //this.selectedPerson = event.data
    }
  }

  


  handleEdit(person:any) {

    
    this.person = person.content
    
    
    this.viewNames = this.person.names
    console.log('EDIT NAMES',this.viewNames)

    this.displayEditModal = true
    

    let pc = ''

    if (this.person.hasOwnProperty("person-or-company")) {
      this.person["pc"] = this.person["person-or-company"]
      pc = this.person["person-or-company"]
      // console.log('INPC',pc)
    }
    

    if(pc === 'company') {
      
      this.isperson = false;
      this.iscompany = true;
    }
    if(pc === 'person') {
      
      this.isperson = true;
      this.iscompany = false;
    }

    this.emailids = []
    this.telephones = []
    this.postalAddresses = []

    for (let index = 0; index < this.person.endpoints.length; index++) {
      const element = this.person.endpoints[index];
      if(element.type === 'telephone') {
        let t:any = JSON.parse(JSON.stringify(element))
        this.telephones.push(element)
      }
      if(element.type === 'emailid') {
        let e:any = JSON.parse(JSON.stringify(element))
        this.emailids.push(element)
      }
      if(element.type === 'address') {
        let e:any = JSON.parse(JSON.stringify(element))
        this.postalAddresses.push(element)
      }
      
    }

    this.govtids = []
    this.govtids = this.person.govtids 

  } 



  showModalDialog() {
    //this.currentMode = 'new'
    this.person = this.returnNewPerson()
    this.isperson = true;
    this.iscompany = false;
    this.names = []
    this.emailids = []
    this.telephones = []
    this.postalAddresses = []
    this.govtids = []

    for (let index = 0; index < this.person.endpoints.length; index++) {
      const element = this.person.endpoints[index];
      if(element.type === 'telephone') {
        let t:any = JSON.parse(JSON.stringify(element))
        this.telephones.push(element)
      }
      if(element.type === 'emailid') {
        let e:any = JSON.parse(JSON.stringify(element))
        this.emailids.push(element)
      }
      if(element.type === 'address') {
        let e:any = JSON.parse(JSON.stringify(element))
        this.postalAddresses.push(element)
      }
      
    }
    console.log('EMAILIDS',this.emailids)
    console.log('TELEPHONES',this.telephones)
    console.log('ADDRESSES',this.postalAddresses)
    this.displayNewModal = true
  }




  pcchange(event:any) {

    console.log('EVENT',event)

    this.person.pc = event
    

    if(event == 'person') {

      console.log('IN PERSON')

      this.names.splice(0,this.names.length)
      this.isperson = true
      this.iscompany = false

      this.names.push({
        firstname: "",
        middlename: "",
        lastname: "",
        fullname: "",
        "tags":[]
      })

      this.person.names = this.names
    }
    else if (event == 'company') {

      console.log('IN COMPANY')

      this.names.splice(0,this.names.length)
      this.isperson = false
      this.iscompany = true

      let cnArray = [{
        name:"",
        "tags":[]
      }]

      this.names = cnArray
      console.log(this.names)

      this.person.names = this.names

    }
  }

 
  returnNewPerson() {
    let person:any = {
      dobi: "infinity",
      dodd: "infinity",
      pc: "person",
      isanonymous: "False",
      govtids: [{
        idname: "",
        idnumber: "",
        files:[],
        "tags":[]
      }],
      files: [],
      locations: [],
      connections: [],
      endpoints: [
        {
          type: "emailid",
          detail: {
            emailid: "",
            "tags":[]
          }
        },
        {
          type: "telephone",
          detail: {
            telephone: "",
            "tags":[]
          }
        },{
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
      names: [
        {
          fullname: "",
          lastname: "",
          middlename: "",
          firstname: "",
          "tags":[]
        }
      ],
      medical: {},
      academic: {},
      financialstatements: {}
    }

    return person
  }



  handleDeleteOfName(event:any,i:number) {
    
    this.person.names.splice(i, 1);

  }




  handleAddName() {
    if(this.person.pc == 'person') {
      this.person.names.push({
        firstname: "",
        middlename: "",
        lastname: "",
        fullname: ""
      })
    }
    if(this.person.pc == 'company') {
      this.person.names.push({
        name:""
      })
    }
    
    //this.person.names = this.names
    
  }




  handleAddEmailID() {

    this.emailids.push({
      type: "emailid",
      detail: {
        "emailid": "",
        "tags":[]
      } 
    })
    
    
    this.make()
    
  }



  handleDeleteOfEmail(event:any,i:number) {
    this.emailids.splice(i, 1);
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

    this.postalAddresses.forEach(function(value:any){
      endpointList.push(value)
    })

    
    this.person.endpoints = endpointList
    
  }





  handleAddTelephone() {

    this.telephones.push({
      type: "telephone",
      detail: {
        "telephone": "",
        "tags":[]
      } 
    })
    
    this.make()
    
  }





  handleDeleteOfTelephone(event:any,i:number) {
    this.telephones.splice(i, 1);
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
    
    
    this.make()
    
  }

  handleDeleteOfPostalAddress(event:any,i:number) {
    this.postalAddresses.splice(i, 1);
    this.make()
  }


  handleAddGovtID() {
    this.person.govtids.push({
      idname: "",
      idnumber: "",
      files:[],
      "tags":[]
    })
    
    //this.person.govtids = this.govtids 
  }

  handleDeleteOfGovtID(event:any,i:number) {
    this.person.govtids.splice(i, 1);
  }




  atleast() {


    console.log('PERSON TO BE SAVED',JSON.stringify(this.person))

    return

    let nameThere:boolean = false
    let telephoneThere:boolean = false
    let emailThere:boolean = false

    for (let index = 0; index < this.person.names.length; index++) {
      const element = this.person.names[index];
      let name:string = ''
      //console.log('NAME ELEMENT',element)
      if(this.person.pc === 'person') {
        name = element.fullname.trim()
      }
      if(this.person.pc === 'company') {
        name = element.name.trim()
      }

      console.log('NAME',name)
      if(name !== '') {
        nameThere = true
        break
      }
      
    }

    for (let index = 0; index < this.person.endpoints.length; index++) {
      const element = this.person.endpoints[index];
      let telephone:string = ''
      if(element.type === 'telephone') {
        telephone = element.detail.telephone.trim()
      }
      if(telephone !== '' && element.isvalid === true) {
        telephoneThere = true
        break
      }

    }


    for (let index = 0; index < this.person.endpoints.length; index++) {
      const element = this.person.endpoints[index];
      let emailid:string = ''
      if(element.type === 'emailid') {
        emailid = element.detail.emailid.trim()
      }
      if(emailid !== '' && element.isvalid === true) {
        emailThere = true
        break
      }

    }

    console.log('NAME THERE',nameThere)
    console.log('TELE THERE',telephoneThere)
    console.log('EMAIL THERE',emailThere)

    


    if(!nameThere) {
      console.log('ERROR IN FORM')
      this.confirm('You must enter atleast one name')
      return
    }

    if(nameThere) {
      if(!telephoneThere && !emailThere) {
        console.log('ERROR IN FORM')
        this.confirm('You must enter atleast one telephone or and emailid.')
        return
      }
    }

    this.handleCheckPerson()

  }




  handleCheckPerson() {

    
    this.person['person-or-company'] = this.person.pc
    this.inCheckProgress = true
    
    let ahlService:CheckPersonService = new CheckPersonService(this.httpClient)
    this._chkSub = ahlService.checkPerson(this.person).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inCheckProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inCheckProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.similarPeople = dataSuccess.success
          this.inCheckProgress = false
          this.displaySimilarModal = true
          return
        }
        else if(v == null) { 
          this.inCheckProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inCheckProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })

    return false

  }



  


  saveAsNewPerson() {

    

    console.log('IN SAVE AS NEW PERSON')

    let there:boolean = false
    for (let index = 0; index < this.similarPeople.length; index++) {
      const element = this.similarPeople[index];
      if(parseFloat(element.similarity) > 0.98) {
        //this.confirm('One or more names and endpoint combinations already exist.')
        there = true
        break
      }
    }

    console.log('THERE',there)

    //there = true
    
    if(there) {
      this.displayErrorModal = true
      return
    }
    else if(!there) {
      this.savePerson()
    }


  }


  savePerson() {

    this.inCheckProgress = true
    
    let ahlService:SavePersonService = new SavePersonService(this.httpClient)
    this._chkSub = ahlService.savePerson(this.person).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inCheckProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inCheckProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          //this.similarPeople = dataSuccess.success
          this.inCheckProgress = false
          this.displaySimilarModal = false
          this.displayNewModal = false
          this.loadPeople(0,0)
          return
        }
        else if(v == null) { 
          this.inCheckProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inCheckProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })

  }






  updatePerson() {

    console.log('PERSON TO BE UPDATED',JSON.stringify(this.person))
    //return;
    
    this.inCheckProgress = true
    
    let ahlService:UpdatePersonService = new UpdatePersonService(this.httpClient)
    this._chkSub = ahlService.updatePerson(this.person).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inCheckProgress = false
        this.confirm('A server error occured while updating person. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inCheckProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          // let dataSuccess:XetaSuccess = <XetaSuccess>v;
          // //this.similarPeople = dataSuccess.success
          this.inCheckProgress = false
          this.displayEditModal = false
          this.loadPeople(0,0)
          return
        }
        else if(v == null) { 
          this.inCheckProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inCheckProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })

  }












  handleMore() {
    this.offset = this.offset + 500
    this.loadMore(this.offset)
  }


  loadMore(offset:number) {
    
    this.inProgress = true

    let ahlService:PeopleWithoutEndpointsServiceService = new PeopleWithoutEndpointsServiceService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'party'};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchPeople(criteria).subscribe({
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
          let newPeople:any[] = dataSuccess.success
          for (let index = 0; index < newPeople.length; index++) {
            const element = newPeople[index];
            this.people.push(JSON.parse(JSON.stringify(element)))
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
