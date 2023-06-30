import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConfirmationService,MessageService} from 'primeng/api';
import { ProductServiceListService } from '../services/product-service-list.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { Search } from 'src/app/services/search';
import { AccountHeadListService } from '../services/account-head-list.service';
import { UpdateProductService } from '../services/update-product.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ProductsComponent implements OnInit {

  _ahlSub:any
  inProgress:boolean = false
  
  products:any[] = []

  selectedProduct:any = {
    id: "",
    saleprice: "",
    inclinps: "",
    advertise: "",
    itemdef: {
      id: "",
      itemname: "",
      isgroup: false,
      partofgroup: -1,
      usercode: "",
      uom: {
        uom: "",
        symbol: "",
        country: ""
      },
      taxes: [
        {
          taxname: "",
          taxcode: "",
          taxpercent: "",
          taxtype: "",
          taxauthority: {
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
          }
        }
      ],
      files: [],
      recipe: {
        consumedunits: [],
        byproducts: []
      },
      displayfile: {},
      assocpurchaseaccounthead: {
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
        isgroup: null
      },
      assocsaleaccounthead: {
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
        isgroup: null
      },
      assocsalereturnaccounthead: {
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
        isgroup: null
      },
      assocpurchasereturnaccounthead: {
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
        isgroup: null
      },
      originalrates: [
        "0.0"
      ],
      idpath: "",
      path: "",
      uniques: {
        originalrateaftertaxes: [
          0
        ],
        expirydate: [
          "infinity"
        ],
        userinputrateperunit: [
          0
        ]
      }
    },
    files: [],
    displayfile: {},
    contextprices: []
  }

  displayModal:boolean = false
  displaySubModal:boolean = false
  displaySubEditModal:boolean = false
  displayTaxModal:boolean = false
  displayTaxEditModal:boolean = false

  selectedContext:any
  @ViewChild('selectContext') selectContext:any

  selectedSalePrice:any
  @ViewChild('selectSalePrice') selectSalePrice:any


  selectedTaxes:any[] = []

  selectedTaxname:any
  @ViewChild('selectTaxname') selectTaxname:any

  selectedTaxcode:any
  @ViewChild('selectTaxcode') selectTaxcode:any

  selectedTaxpercent:any
  @ViewChild('selectTaxpercent') selectTaxpercent:any

  selectedTaxtype:any
  @ViewChild('selectTaxtype') selectTaxtype:any

  taxTypes:any[] = [{type:''},{type:'vat'},{type:'nonvat'}]


  selectedTaxParty:any
  @ViewChild('selectTaxParty') selectTaxParty:any
  placeholderTaxParty = 'select tax authority'
  filteredParties:any[] = new Array
  private _pSub:any
  
  private _eSub:any

  selectedRecordid:any
  selectedContextid:any

  //selectedContextObject:any

  inSaveProgress:boolean = false

  private _siSub:any

  offset:number = 0


  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProducts(0,0) 
  }

  loadProducts(offset:number,moreoffset:number) {
    
    this.inProgress = true

    let ahlService:ProductServiceListService = new ProductServiceListService(this.httpClient)
    let criteria:any = {searchtext:'',screen:'display',offset:offset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchProductServiceList(criteria).subscribe({
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
          this.products = dataSuccess.success
          for (let index = 0; index < this.products.length; index++) {
            const element = this.products[index];
            element.recordid = index

          }
          // this.totalRecords = this.masterCopy.length
          // this.products = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          console.log('PRODUCTS LIST',this.products)
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
      this.selectedProduct = event.data
    }
  }

  handleEdit(product:any) {

    for (let index = 0; index < product.contextprices.length; index++) {
      const element = product.contextprices[index];
      element['recordid'] = index
    }


    this.selectedProduct = product
    if(this.selectedProduct.inclinps === 'True') {
      this.selectedProduct.inclinps = true
    }
    else if (this.selectedProduct.inclinps === 'False') {
      this.selectedProduct.inclinps = false
    }

    if(this.selectedProduct.advertise === 'True') {
      this.selectedProduct.advertise = true
    }
    else if (this.selectedProduct.advertise === 'False') {
      this.selectedProduct.advertise = false
    }

    this.selectedTaxes = this.selectedProduct.itemdef.taxes
    this.displayModal = true
  }

  showAddSalePriceDialog() {
    
    this.selectedContext = null
    this.selectedSalePrice = null
    this.selectedTaxes = []
    this.displaySubModal = true
  }

  handleEditContext(ctp:any) {
    this.selectedContext = ctp.context
    this.selectedSalePrice = ctp.saleprice
    this.selectedTaxes = ctp.taxes
    this.selectedContextid = ctp.recordid
    this.displaySubEditModal = true
  }

  handleDeleteContext(ctp:any) {

  }

  

  contextChange(event:any) {

    this.selectedContext = event
    
  }

  salePriceChange(event:any) {
    this.selectedSalePrice = parseFloat(event)
  }

  handleAddContextPrice() {

    if (typeof this.selectedContext === 'undefined' || this.selectedContext == null || this.selectedContext === '') {
      this.confirm('You must enter a context')
      return false
    }
    if (typeof this.selectedSalePrice === 'undefined' || this.selectedSalePrice == null || this.selectedSalePrice === '') {
      this.confirm('You must enter a sale price')
      return false
    }

    let newCTP = {
      context: this.selectedContext,
      saleprice: this.selectedSalePrice,
      taxes: this.selectedTaxes,
      recordid:0
    }
    newCTP['recordid'] = this.highestRecordID(this.selectedProduct.contextprices) + 1
    this.selectedProduct.contextprices.push(newCTP)
    this.displaySubModal = false
    

    return false
  }

  showNewTaxDialog() {
    this.selectedTaxname = null
    this.selectedTaxcode = null
    this.selectedTaxtype = null
    this.selectedTaxpercent = null
    this.selectedTaxParty = null
    this.displayTaxModal = true;
  }


  handleAddTax() {
    if (typeof this.selectedTaxParty === 'undefined' || this.selectedTaxParty == null) {
      this.confirm('You must select a tax authority')
      return false
    }
    if (typeof this.selectedTaxpercent === 'undefined' || this.selectedTaxpercent == null ) {
      this.confirm('You must enter tax percent')
      return false
    }

    if (typeof this.selectedTaxname === 'undefined' || this.selectedTaxname == null || this.selectedTaxname === '') {
      this.confirm('You must enter a tax name')
      return false
    }

    if (typeof this.selectedTaxtype === 'undefined' || this.selectedTaxtype == null || this.selectedTaxtype === '') {
      this.confirm('You must select a tax type')
      return false
    }

    if(this.selectedTaxParty.accounthead === '') {
      this.confirm('You must select a tax authority')
    }

    let tax:any = {}
    tax['taxname'] = this.selectedTaxname
    if(this.selectedTaxcode === null) {
      this.selectedTaxcode = ""
    }
    tax['taxcode'] = this.selectedTaxcode
    tax['taxpercent'] = this.selectedTaxpercent
    tax['taxtype'] = this.selectedTaxtype
    tax['taxauthority'] = this.selectedTaxParty
    tax['recordid'] = this.highestRecordID(this.selectedTaxes) + 1

    console.log('TAX TO BE ADDED',tax)

    //return false

    this.selectedTaxes.push(tax)
    


    this.selectedTaxname = null
    this.selectedTaxcode = null
    this.selectedTaxtype = null
    this.selectedTaxpercent = null
    this.selectedTaxParty = null
    

    this.displayTaxModal = false

    return false
  }

  handleTaxEdit(tax:any) {
    console.log('TAX TO BE EDITED',tax)
    this.selectedTaxname = tax.taxname
    this.selectedTaxcode = tax.taxcode
    this.selectedTaxpercent = tax.taxpercent
    this.selectedTaxtype = tax.taxtype
    this.selectedTaxParty = tax.taxauthority
    this.selectedRecordid = tax.recordid
    this.displayTaxEditModal = true
  }

  handleTaxDelete(event:any) {
    console.log('EVENT',event)
    this.selectedTaxes.splice(event,1)
    
  }

  handleUpdateTax() {

    if (typeof this.selectedTaxParty === 'undefined' || this.selectedTaxParty == null) {
      this.confirm('You must select a tax authority')
      return false
    }
    if (typeof this.selectedTaxpercent === 'undefined' || this.selectedTaxpercent == null ) {
      this.confirm('You must enter tax percent')
      return false
    }

    if (typeof this.selectedTaxname === 'undefined' || this.selectedTaxname == null || this.selectedTaxname === '') {
      this.confirm('You must enter a tax name')
      return false
    }

    if (typeof this.selectedTaxtype === 'undefined' || this.selectedTaxtype == null || this.selectedTaxtype === '') {
      this.confirm('You must select a tax type')
      return false
    }

    if(this.selectedTaxParty.accounthead === '') {
      this.confirm('You must select a tax authority')
    }
    
    let tax:any = this.recordByRecordID(this.selectedRecordid,this.selectedTaxes)
    tax.taxname = this.selectedTaxname
    if(this.selectedTaxcode === null) {
      this.selectedTaxcode = ""
    }
    tax.taxcode = this.selectedTaxcode
    tax.taxpercent = this.selectedTaxpercent
    tax.taxauthority = this.selectedTaxParty
    tax.taxtype = this.selectedTaxtype
    
    this.displayTaxEditModal = false
    console.log('TAX TO BE UPDATED',tax)

    return false

  }

  recordByRecordID(recordid:any,array:any) {
    let object:any
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.recordid === recordid) {
        object = element
      }
    }
    return object
  }


  filterParties(event:any) {
    console.log('IN FILTER PARTIES',event)
    
    // let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-name-contains'};
    let criteria:Search = <Search>{searchtext:event.query,screen:'tokenfield',offset:0,searchtype:'party-accounthead-contains'};
    console.log('CRITERIA',criteria)
    let pService:AccountHeadListService = new AccountHeadListService(this.httpClient)
    this._eSub = pService.fetchAccountHeads(criteria).subscribe({
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
          this.filteredParties = dataSuccess.success;
          console.log('FILTERED PEOPLE',dataSuccess.success)
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

  handleOnSelectTaxParty(event:any) {
    this.selectedTaxParty = event;
  }

  partyChange(event:any) {
    console.log('IN PARTY CHANGE',event)
    this.selectedTaxParty = event
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

  handleUpdateContextPrice() {
    if (typeof this.selectedContext === 'undefined' || this.selectedContext == null || this.selectedContext === '') {
      this.confirm('You must enter a context')
      return false
    }
    if (typeof this.selectedSalePrice === 'undefined' || this.selectedSalePrice == null || this.selectedSalePrice === '') {
      this.confirm('You must enter a sale price')
      return false
    }


    let ctp:any = this.recordByRecordID(this.selectedContextid,this.selectedProduct.contextprices)

    ctp.context = this.selectedContext
    ctp.saleprice = this.selectedSalePrice,
    ctp.taxes = this.selectedTaxes

    this.displaySubEditModal = false
    

    return false

  }


  handleUpdateProduct() {

    

    console.log('IN SAVE')
    //this.inSaveProgress = true

    let productJSON = JSON.stringify(this.selectedProduct)
    console.log('PRODUCT TO BE UPDATED',productJSON)


    this.inSaveProgress = true
    
    let sah:UpdateProductService = new UpdateProductService(this.httpClient)
    this._siSub = sah.updateProduct(this.selectedProduct).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        console.log('ERROR',e)
        this.inSaveProgress = false
        this.confirm('A server error occured while updating product. '+e.message)
        return;
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          //alert(dataError.error);
          this.confirm(dataError.error)
          this.inSaveProgress = false
          return;
        }
        else if(v.hasOwnProperty('success')) {

          this.inSaveProgress = false
          this.displayModal = false
          this.loadProducts(0,0)
          this.offset = 0
          return;
        }
        else if(v == null) {

          this.inSaveProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return;
        }
        else {
          //alert('An undefined error has occurred.')
          this.inSaveProgress = false
          this.confirm('An undefined error has occurred.')
          return
        }
      }
    })

    return


  }

  

  handleMore() {
    this.offset = this.offset + 500
    this.loadMore(this.offset)
  }

  loadMore(offset:number) {
    let ahlService:ProductServiceListService = new ProductServiceListService(this.httpClient)
    let criteria:Search = <Search>{searchtext:'',screen:'display',offset:offset,searchtype:'',attribute:''};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchProductServiceList(criteria).subscribe({
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
          let newItems:any[] = dataSuccess.success
          for (let index = 0; index < newItems.length; index++) {
            const element = newItems[index];
            //this.products.push(JSON.parse(JSON.stringify(element)))
            this.products = [...this.products,JSON.parse(JSON.stringify(element))]
          }
          console.log('PRODUCTS LIST',this.products)
          this.cdr.detectChanges()
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
