import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from './event-data';

@Injectable({
  providedIn: 'root'
})
export class EventBusServiceService {

  private subject$ = new Subject();

  constructor() { }

  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject$.pipe(
      filter( (e: any) => e.name === eventName),
      map( (e: EventData) => e["value"])).subscribe(action);
  }

}
