import { Component, OnInit } from '@angular/core';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';
import { GlobalConstants } from '../global/global-constants';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  lo:any

  constructor(private eventBusService:EventBusServiceService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
  }

  handleGeneralLedger() {
    this.eventBusService.emit(new EventData('GeneralLedger','generalledger'))
  }

  handleFinalAccounts() {
    this.eventBusService.emit(new EventData('FinalAccounts','finalaccounts'))
  }

  handleStockRegister() {
    this.eventBusService.emit(new EventData('StockRegister','stockregister'))
  }

  handleClassification() {
    this.eventBusService.emit(new EventData('Classification','classification'))
  }

  handleTrailingFinalAccounts() {
    this.eventBusService.emit(new EventData('TrailingFinalAccounts','trailingfinalaccounts'))
  }

  handleFinalAccountsSimple() {
    this.eventBusService.emit(new EventData('FinalAccountsSimple','finalaccountssimple'))
  }
  
  handleRecipeCostList() {
    this.eventBusService.emit(new EventData('RecipeCostList','recipecostlist'))
  }

  handleNewFinalAccounts() {
    this.eventBusService.emit(new EventData('NewFinalAccounts','newfinalaccounts'))
  }

  handleClosingStock() {
    this.eventBusService.emit(new EventData('ClosingStock','closingstock'))
  }

  handleSaleInvoiceAgeingList() {
    this.eventBusService.emit(new EventData('SaleInvoiceAgeingList','saleinvoiceageinglist'))
  }

  handlePurchaseInvoiceAgeingList() {
    this.eventBusService.emit(new EventData('PurchaseInvoiceAgeingList','purchaseinvoiceageinglist'))
  }

  handlePenultimateAccounts() {
    this.eventBusService.emit(new EventData('PenultimateFinalAccounts','penultimatefinalaccounts'))
  }

  handleResourceTracker() {
    this.eventBusService.emit(new EventData('ResourceTracker','resourcetracker'))
  }

}
