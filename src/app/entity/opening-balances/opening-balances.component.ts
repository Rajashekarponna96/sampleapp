import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ReplaceZeroWithEmptyForCSPipe } from 'src/app/pipes/replace-zero-with-empty-for-cs.pipe';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { PeopleService } from 'src/app/services/people.service';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { Search } from 'src/app/services/search';
import { AccountHeadListService } from 'src/app/services/account-head-list.service';
import { ItemsListService } from 'src/app/services/items-list.service';

@Component({
  selector: 'app-opening-balances',
  templateUrl: './opening-balances.component.html',
  styleUrls: ['./opening-balances.component.css'],
  providers: [ConfirmationService,MessageService,ReplaceZeroWithEmptyForCSPipe]
})
export class OpeningBalancesComponent implements OnInit {


  openingBalances:any[] = []
  inProgress:boolean =  false
  selectedAsOnDate:Date = new Date()
  
  displayCSModal: boolean = false;
  displayCSSubModal:boolean = false;

  asOnDateString:any

  selectedVouchers:any[] = []

  selectedItem:any
  filteredItems:any[] = new Array
  private _iSub:any
  @ViewChild('selectItem') selectItem:any
  placeholderItem = 'select item'

  newInvoice:any = {}
  newVoucher:any = {}

  selectedUOM:any = ""

  selectedQty:number = 0

  selectedUIR:any
  @ViewChild('selectUIR') selectUIR:any

  constructor(private eventBusService:EventBusServiceService,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    let cs = {
      accounthead:'Closing Stock',
      debit:0,
      credit:0
    }
    this.openingBalances.push(cs)
    let accpl = {
      accounthead:'Accumulated Profit or Loss',
      debit:0,
      credit:0
    }
    this.openingBalances.push(accpl)

    this.selectedAsOnDate = new Date()

  }

  onRowSelect(e:any) {

  }

  handleEdit(inv:any) {

  }

  asOnDateSelected(event:any) {

    console.log('DATE SELECTED',event)

    let date1 = moment(event).format('YYYY-MM-DD');
    let time1 = moment(event).format('HH:mm:ss.SSSZZ')
    let isoDateTime = date1+'T'+time1
    console.log('ISO DATE',isoDateTime)
    this.asOnDateString = isoDateTime
    //this.selectedDate = isoDateTime
   
  }

  showNewVoucherDialog() {

    //this.newVoucher = this.returnNewVoucher()
    this.selectedItem = null
    //this.selectedRelatedItem = null
    this.selectedUIR = 0
    this.selectedQty = 0
    //this.selectedAccountMap = null
    this.selectedUOM = ""
    // this.selectedTaxes = []
    // this.inputDiscount = 0
    // this.rad = 0
    //this.pcchange('rit')
    // this.selectedStockBalances = []
    // this.selectedContextPrices = []
    this.displayCSSubModal = true;

  }

  filterItems(event:any) {
    console.log('IN FILTER ITEMS',event)
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:any = {searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'itemname-contains',attribute:''};
    console.log('CRITERIA',criteria)
    let iService:ItemsListService = new ItemsListService(this.httpClient)
    this._iSub = iService.fetchItems(criteria).subscribe({
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
          this.filteredItems = dataSuccess.success;
          console.log('FILTERED ITEMS',dataSuccess.success)
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



  handleOnSelectItem(event:any) {
    
    this.selectedItem = event


    // this.rat = 0
    // this.rbt = 0
    // this.t = 0
    this.selectedUOM = this.selectedItem.uom.uom

    //this.pcchange(this.ri)


  }

  itemChange(event:any) {

    console.log('ITEM CHANGE',event)
    this.selectedUOM = ""
    // this.selectedStockBalances = []
    // this.selectedContextPrices = []
    // this.selectedTaxes = []
    
  }
  
  uirChange(event:any) {
    let uir:number = parseFloat(event)
    
    // if(!this.discountState) {
    //   this.discountAmount = uir*(this.inputDiscount/100)
    //   this.selectedDiscountAmount = this.discountAmount
    //   this.selectedDiscountPercent = this.inputDiscount
    //   this.rad = this.selectedUIR - this.discountAmount
    // }

    // if(this.discountState) {
    //   this.discountAmount = this.inputDiscount
    //   this.selectedDiscountAmount = this.inputDiscount
    //   this.selectedDiscountPercent = (this.inputDiscount*100)/uir
    //   this.rad = this.selectedUIR - this.discountAmount
    // }

    // if(isNaN(this.discountAmount)) {
    //   this.discountAmount = 0
    //   this.selectedDiscountAmount = 0
    //   this.rad = this.selectedUIR - this.discountAmount
    // }

    // if(isNaN(this.rad)) {
    //   this.rad = this.selectedUIR
    // }

    

    //this.pcchange(this.ri)
  }


  handleAddVoucher() {

  }

  // handleAddVoucher(){

  //   console.log('ITEM',this.selectedItem)
  //   console.log('QUANTITY',this.selectedQty)
  //   console.log('USER INPUT RATE',this.selectedUIR)
  //   console.log('ACCOUNT MAP',this.selectedAccountMap)

  //   if (typeof this.selectedItem === 'undefined' || this.selectedItem == null) {
  //     this.confirm('You must select an item')
  //     return false
  //   }
  //   if (typeof this.selectedQty === 'undefined' || this.selectedQty == null || this.selectedQty === 0) {
  //     this.confirm('You must enter a quantity greater than zero')
  //     return false
  //   }

  //   if (typeof this.selectedAccountMap === 'undefined' || this.selectedAccountMap == null || this.selectedAccountMap.accounthead === '') {
  //     this.confirm('You must select an account')
  //     return false
  //   }

  //   let v:any = this.buildVoucher()
  //   this.selectedVouchers.push(v)
    
  //   this.displaySubModal = false
  //   return false

  // }





  buildVoucher() {
    /*
      {
      action: "rec",
      objecttype: "item",
      object: {
        itemname:null
      },
      quantity: null,
      currency: "",
      fromdatetime: "",
      todatetime: "",
      duedatetime: "",
      userinputrate: null,
      rateincludesvat: "True",
      taxes: [],
      discountpercent: null,
      discountamount: null,
      rateafterdiscount: null,
      rateaftertaxes: null,
      taxfactor: 1,
      taxesperunit: null,
      uom: {
        uom: "",
        symbol: "",
        country: ""
      },
      nonvattaxperunit: null,
      vattaxperunit: null,
      nonvatpercent: null,
      vatpercent: null,
      ratebeforetaxes: null,
      intofrom: {
        id: "0",
        itemname: "",
        iscontainer: "True",
        usercode: "",
        uom: {
          uom: "each",
          symbol: "each",
          country: "global"
        },
        taxes: [],
        files: [],
        recipe: {
          consumedunits: [],
          byproducts: []
        }
      },
      by: {
        itemid: "0",
        neid: "",
        relationshipid: "",
        name: ""
      },
      delivery: {
        id: "-1",
        accounthead: "",
        defaultgroup: "",
        relationship: "-1",
        neid: "-1",
        person: "-1",
        name: "",
        endpoint: "",
        rtype: ""
      },
      title: "",
      accountmap: {
        id: "",
        accounthead: "",
        defaultgroup: "",
        relationship: "",
        neid: "",
        person: "",
        name: "",
        endpoint: "",
        accounttype: "",
        partofgroup: -1,
        isgroup: false
      },
      files: [],
      expirydate: new Date(),
      vendorperson: null
    }
    */

    

    let v:any = {}
    v['action'] = 'prod'
    v['objecttype'] = 'item'
    v['object'] = JSON.parse(JSON.stringify(this.selectedItem))
    v['quantity'] = this.selectedQty
    v['currency'] = '',
    // v['fromdatetime'] = 'infinity'
    // v['todatetime'] = 'infinity'
    // v['duedatetime'] = 'infinity'
    v['originalrateaftertaxes'] = this.selectedUIR
    // if(this.ri === 'rit'){
    //   v['rateincludesvat'] = true
    // }
    // if(this.ri === 'ret') {
    //   v['rateincludesvat'] = false
    // }

    // v['taxes'] = JSON.parse(JSON.stringify(this.selectedTaxes))
    // if(isNaN(this.selectedDiscountPercent)) {
    //   this.selectedDiscountPercent = 0
    // }
    // v['discountpercent'] = this.selectedDiscountPercent
    // v['discountamount'] = this.selectedDiscountAmount
    // v['rateafterdiscount'] = this.rad
    // v['rateaftertaxes'] = this.rat
    // v['taxfactor'] = 0
    // v['taxesperunit'] = this.t
    v['uom'] = {
      uom: "",
      symbol: "",
      country: ""
    }
    
    // v['nonvattaxperunit'] = this.nonvattaxperunit
    
    // v['vattaxperunit'] = this.vattaxperunit
    // v['nonvatpercent'] = this.totalnonvatperc
    // v['vatpercent'] = this.totalvatperc
    // v['ratebeforetaxes'] = this.rbt

    // v['intofrom'] = {
    //   id: "0",
    //   itemname: "",
    //   iscontainer: "True",
    //   usercode: "",
    //   uom: {
    //     uom: "each",
    //     symbol: "each",
    //     country: "global"
    //   },
    //   taxes: [],
    //   files: [],
    //   recipe: {
    //     consumedunits: [],
    //     byproducts: []
    //   }
    // }
    // v['by'] = {
    //   itemid: "0",
    //   neid: "",
    //   relationshipid: "",
    //   name: ""
    // }
    // v['delivery'] ={
    //   id: "-1",
    //   accounthead: "",
    //   defaultgroup: "",
    //   relationship: "-1",
    //   neid: "-1",
    //   person: "-1",
    //   name: "",
    //   endpoint: "",
    //   rtype: ""
    // }
    // v['title'] = ""

    
    //v['accountmap'] = JSON.parse(JSON.stringify(this.selectedAccountMap))
    
    //v['relateditem'] = this.selectedRelatedItem
    v['files'] = []
    v['expirydate'] = new Date()
    //v['vendorperson'] = null
    v['recordid'] = this.highestRecordID(this.selectedVouchers) + 1

    

    return v

  }

  highestRecordID(objectArray:any[]) {
    let recid = 0
    for (let index = 0; index < objectArray.length; index++) {
      const element = objectArray[index];
      if(element.recordid > recid) {
        recid = element.recordid
      }
    }
    return recid

  }



}
