import { Component, OnInit } from '@angular/core';
import { ClassificationListService } from 'src/app/services/classification-list.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { UpdateClassificationService } from 'src/app/services/update-classification.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styleUrls: ['./classification.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ClassificationComponent implements OnInit {

  _invSub:any
  inProgress:boolean = false;
  classificationList:any[] = []
  finalList:any[] = []
  private _sahSub:any

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }
  

  ngOnInit(): void {
    this.loadClassificationList()
  }

 
  loadClassificationList() {
    this.inProgress = true
    
    let ahlService:ClassificationListService = new ClassificationListService(this.httpClient)
    let criteria:any = {}
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchClassificationList(criteria).subscribe({
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
          this.classificationList = dataSuccess.success
          console.log('CLASSIFICATION LIST',this.classificationList)
          this.processClassificationList(this.classificationList)
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

  processClassificationList(cl:any)
  {
    this.finalList = []
    for (let index = 0; index < cl.length; index++) {
      const element = cl[index];
      let c:any = {}
      let item:any = element["item"]
      c["item"] = item["itemname"]
      let accounthead:any = element["accounthead"]
      c["accounthead"] = accounthead["accounthead"]
      c["trd"] = element["partoftrading"]
      c["pl"] = element["partofpl"]
      c["bs"] = element["partofbalancesheet"]
      c["itemid"] = item["id"]
      c["ahid"] = accounthead["id"]
      this.finalList.push(c)
    }
  }

  onRowSelect(e:any) {

  }

  onRowEditInit(inv:any,i:any) {

  }

  onRowEditSave(inv:any,i:any) {
    let array:any[]
    let obj:any = this.finalList[i]
    array = Object.entries(obj)
    
    let trues = 0
    let falses = 0

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      //console.log('ELEMENT VALUE',element)
      if(element[1] === true) {
        trues = trues+1
      }
      if(element[1] === false) {
        falses = falses + 1
      }
    }
    
    console.log('TRUES: ',trues)
    console.log('FALSES: ',falses)

    if(trues != 1) {
      this.confirm("You must choose either one of three options and uncheck the remaining.")
      return
    }

    console.log('CLASS TO BE UPDATED: ',JSON.stringify(inv))

    this.inProgress = true
    
    let sah:UpdateClassificationService = new UpdateClassificationService(this.httpClient)
    this._sahSub = sah.updateClassification(inv).subscribe({
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
          this.loadClassificationList()
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

  }
  

  checkChanged(i:any) {
    console.log('CLASS TO BE CHANGED:',this.finalList[i])
  }

}
