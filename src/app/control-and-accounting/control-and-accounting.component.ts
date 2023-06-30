import { Component, OnInit } from '@angular/core';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';
import { GlobalConstants } from '../global/global-constants';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';

@Component({
  selector: 'app-control-and-accounting',
  templateUrl: './control-and-accounting.component.html',
  styleUrls: ['./control-and-accounting.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ControlAndAccountingComponent implements OnInit {

  lo:any

  constructor(private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
  } 


  handleSales() {
    this.eventBusService.emit(new EventData('Sales','sales'))
  }

  handlePurchases() {
    this.eventBusService.emit(new EventData('Purchases','purchases'))
  }

  handlePayments() {
    this.eventBusService.emit(new EventData('Payments','payments'))
  }

  handleReceipts() {
    this.eventBusService.emit(new EventData('Receipts','receipts'))
  }

  handleBRS() {
    this.eventBusService.emit(new EventData('BRS','brs'))
  }


  haskeys(o:any) {
    let hasKeys = false;

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        // a key exists at this point, for sure!
        hasKeys = true;
        break; // break when found
      }
    }
    return hasKeys
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

  handleSaleReturn() {
    this.eventBusService.emit(new EventData('SalesReturn','salesreturn'))
  }

  handlePurchaseReturn() {
    this.eventBusService.emit(new EventData('PurchaseReturn','purchasereturn'))
  }

  handleProduction() {
    this.eventBusService.emit(new EventData('Production','production'))
  }

  handleConsumption() {
    this.eventBusService.emit(new EventData('Consumption','consumption'))
  }

  handleConversion() {}

  handleTransfer() {
    this.eventBusService.emit(new EventData('Transfer','transfer'))
  }

  handleLineProduction() {
    this.eventBusService.emit(new EventData('LineProduction','lineproduction'))
  }
  handleJournalVoucher() {
    this.eventBusService.emit(new EventData('JournalVoucher','journalvoucher'))
  }

  handleNewJournalVoucher() {
    this.eventBusService.emit(new EventData('NewJournalVoucher','newjournalvoucher'))
  }

  handleNewInterface() {
    this.eventBusService.emit(new EventData('NewInterface','newinterface'))
  }

}
