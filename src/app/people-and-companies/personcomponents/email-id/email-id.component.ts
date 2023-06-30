import { Component, OnInit, Input, Output, EventEmitter,OnChanges, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { TagListService } from 'src/app/services/tag-list.service';


@Component({
  selector: 'app-email-id',
  templateUrl: './email-id.component.html',
  styleUrls: ['./email-id.component.css']
})
export class EmailIDComponent implements OnInit {

  @Input() endpoint:any;

  @Output() deleteEvent = new EventEmitter<any>()

  @Input() mode:string = ''

  whetherDisabled:boolean = false


  @ViewChild('email') emailInput:any

  selectedTags:any[] = []
  filteredTags:any[] = new Array

  _eSub:any

  constructor(private httpClient:HttpClient) { } 

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.whetherDisabled = true;
    }
    else if(this.mode ==='') {
      this.whetherDisabled = false;
    } 
    this.selectedTags = this.endpoint.detail.tags 
    console.log('EMAIL ENDPOINT',this.endpoint)
   }

  inputChange(event:any) {
    this.endpoint.detail.tags = this.selectedTags 
    console.log('ISVALID',this.emailInput.valid)
    this.endpoint['isvalid'] = this.emailInput.valid
  }

  handleDelete() {
    this.deleteEvent.emit(this.endpoint)
  }

  
  filterTags(event:any) {
    console.log('IN FILTER TAGS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'begins'};
    console.log('CRITERIA',criteria)
    
    let pService:TagListService = new TagListService(this.httpClient)
    this._eSub = pService.fetchTags(criteria).subscribe({
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
          this.filteredTags = dataSuccess.success;
          console.log('FILTERED TAGS',dataSuccess.success)
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

  

}
