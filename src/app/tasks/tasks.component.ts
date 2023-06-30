import { Component, OnInit } from '@angular/core';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';
import { GlobalConstants } from '../global/global-constants';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  lo:any
  constructor(private eventBusService:EventBusServiceService) { }

  ngOnInit(): void {
    this.lo = GlobalConstants.loginObject
  }

  handleDayTasks() {
    this.eventBusService.emit(new EventData('DayTasks','daytasks'))
  }

  handleMSTS() {
    this.eventBusService.emit(new EventData('MilkSupplyTaskSheet','milksupplytasksheet')) 
  }

}
