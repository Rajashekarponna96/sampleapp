import { Component, OnInit } from '@angular/core';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';
import { GlobalConstants } from '../global/global-constants';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {

  lo:any
  constructor(private eventBusService:EventBusServiceService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
  }

  

  handlePartyAccountHeads() {
    this.eventBusService.emit(new EventData('PartyAccountHeads','pahs'))
  }

  handleOtherAccountHeads() {
    this.eventBusService.emit(new EventData('OtherAccountHeads','oahs'))
  }

  handleItems() {
    this.eventBusService.emit(new EventData('Items','items'))
  }

  handleWriteCheque() {
    this.eventBusService.emit(new EventData('WriteCheque','writecheque'))
  }

  handleReceiveCheque() {
    this.eventBusService.emit(new EventData('ReceiveCheque','receivecheque'))
  }

  handleTags() {
    this.eventBusService.emit(new EventData('Tags','tags'))
  }

  handleItemLevels() {
    this.eventBusService.emit(new EventData('ItemLevels','itemlevels'))
  }

  handleStockLocations() {
    this.eventBusService.emit(new EventData('StockLocations','stocklocations'))
  }

  handleUOMs() {
    this.eventBusService.emit(new EventData('UOMs','uoms'))
  }

  handleProfile() {
    this.eventBusService.emit(new EventData('Profile','profile'))
  }

  handleEquityPayable() {
    this.eventBusService.emit(new EventData('EquityPayable','equitypayable'))
  }

  handleOpeningBalances() {
    this.eventBusService.emit(new EventData('OpeningBalances','openingbalances'))
  }

 }
