import { Component, OnInit } from '@angular/core';
import { Xetaerror } from 'src/app/global/xetaerror';
import { HttpClient } from '@angular/common/http';
import { XetaSuccess } from 'src/app/global/xeta-success';
import {ConfirmationService,MessageService} from 'primeng/api';
import { RecipeCostListService } from 'src/app/services/recipe-cost-list.service';

@Component({
  selector: 'app-recipe-cost-list',
  templateUrl: './recipe-cost-list.component.html',
  styleUrls: ['./recipe-cost-list.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class RecipeCostListComponent implements OnInit {

  recipeCostList:any[] = []
  //printList:any[] = []
  inProgress:boolean = false

  basisList:any[] = []
  oosList:any[] = []

  displayBasisModal:boolean = false
  displayOOSModal:boolean = false

  private _invSub:any

  itemname:any
  cost:any

  constructor(private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadStockBalances(0,"item")
  }

  loadStockBalances(offset:number,itemtype:string) {
    
    this.inProgress = true
    
    let ahlService:RecipeCostListService = new RecipeCostListService(this.httpClient)
    let criteria:any = {offset:offset,itemtype:itemtype};
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchRecipeCostList(criteria).subscribe({
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
          
          this.recipeCostList = []
          let rcl:any[] = dataSuccess.success

          for (let index = 0; index < rcl.length; index++) {
            const element = rcl[index];
            if (typeof(element["cost"]) == "number") {
              element["cpu"] = element["cost"]
              element["status"] = ""
            }
            else {
              element["cpu"] = 0
              element["status"] = element["cost"]
            }
            this.recipeCostList.push(element)
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

  handleView(item:any) {
    //this.selectedItem = item

    this.itemname = item.itemname
    this.cost = (item.cost as number).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})

    this.basisList = item.basis
    this.oosList = item.oosList

    console.log('BASIS LIST',this.basisList)

    
    this.displayBasisModal = true
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  handleViewOOS(item:any) {

    this.itemname = item.itemname
    this.oosList = item.itemsoos

    console.log('OOS LIST',this.oosList)

    this.displayOOSModal = true

  }

  onRowSelect(event:any) {
    
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

}
