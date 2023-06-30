import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import {ConfirmationService,MessageService} from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { UpdateProfileService } from 'src/app/services/update-profile.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ProfileComponent implements OnInit {

  

  person:any

  //pc:any

  names:any[] = []
  emailids:any[] = []
  telephones:any[] = []
  postalAddresses:any[] = []
  govtids:any[] = []

  _ahlSub:any
  _chkSub:any

  isperson:boolean = true;
  iscompany:boolean = false;

  inProgress:boolean = false

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) {
    //this.loadEntity()
    this.person = this.returnNewPerson()
  }

  ngOnInit(): void {
    this.loadEntity()
  }


  
  loadEntity() {
    
    this.inProgress = true
    
    let ahlService:ProfileService = new ProfileService(this.httpClient)
    let criteria:any = {};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchProfile(criteria).subscribe({
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
          this.person = dataSuccess.success
          this.person["pc"] = this.person["person-or-company"]
          this.handleView()
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
      financialstatements: {},
      accounttype: null,
      intpwd: "",
      extpwd:""
      
    }

    return person
  }


  handleView() {

    

    let pc = ''

    if (this.person.hasOwnProperty("person-or-company")) {
      this.person["pc"] = this.person["person-or-company"]
      pc = this.person["person-or-company"]
      // console.log('INPC',pc)
    }
    else if(this.person.hasOwnProperty("pc")) {
      pc = this.person["pc"]
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
    
    //this.make()

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


    console.log('FRESH PERSON',JSON.stringify(this.person))
    //return

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
      if(telephone !== '') {
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
      if(emailid !== '') {
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

    

    //this.handleCheckPerson()

    this.updateEntity()

  }


  



  updateEntity() {

    console.log('ENTITY TO BE UPDATED',JSON.stringify(this.person))
    //return;
    
    this.inProgress = true
    
    let ahlService:UpdateProfileService = new UpdateProfileService(this.httpClient)
    this._chkSub = ahlService.updateProfile(this.person).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while updating person. '+e.message)
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
          this.loadEntity()
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
