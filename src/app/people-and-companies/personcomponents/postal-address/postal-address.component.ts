import { Component, OnInit, Input, Output, EventEmitter,OnChanges, ViewChild } from '@angular/core';
import { TagListService } from 'src/app/services/tag-list.service';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';

@Component({
  selector: 'app-postal-address',
  templateUrl: './postal-address.component.html',
  styleUrls: ['./postal-address.component.css']
})
export class PostalAddressComponent implements OnInit {

  // @Input() endpoint:any = { "type":"address","detail":{
  //   "doorno": "",
  //   "street": "",
  //   "area":"",
  //   "city":"",
  //   "state":"",
  //   "country":"",
  //   "pincode":"",
  //   "tags":[]
  // }};

  @Input() endpoint:any

  @Output() deleteEvent = new EventEmitter<any>()

  @Input() mode:string = ''

  whetherDisabled:boolean = false

  
  @ViewChild('postaladdress') postalAddressInput:any


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
  }
  
  handleDelete() {
    this.deleteEvent.emit(this.endpoint)
  }

  handleChange(event:any,control:any) {

    let dn = ''
    let st = ''
    let ar = ''
    let ci = ''
    let sa = ''
    let co = ''
    let pi = ''
    
    if (control === 'doorno') {
      this.endpoint.detail.doorno = event.trim()
      dn = this.endpoint.detail.doorno
    }
    if (control === 'street') {
      this.endpoint.detail.street = event.trim()
      st = this.endpoint.detail.street
    }
    if (control === 'area') {
      this.endpoint.detail.area = event.trim()
      ar = this.endpoint.detail.area
    }
    if (control === 'city') {
      this.endpoint.detail.city = event.trim()
      ci = this.endpoint.detail.city
    }
    if (control === 'state') {
      this.endpoint.detail.state = event.trim()
      st = this.endpoint.detail.state
    }
    if (control === 'country') {
      this.endpoint.detail.country = event.trim()
      co = this.endpoint.detail.country
    }
    if (control === 'pincode') {
      this.endpoint.detail.pincode = event.trim()
      pi = this.endpoint.detail.pincode
    }

    
    this.endpoint.detail.fulladdress = [this.endpoint.detail.doorno, this.endpoint.detail.street, this.endpoint.detail.area, this.endpoint.detail.city, this.endpoint.detail.state, this.endpoint.detail.country, this.endpoint.detail.pincode].filter(Boolean).join(" ");
    this.endpoint.detail.tags = this.selectedTags

    console.log('FULL ADD',this.endpoint.detail.fulladdress)

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
