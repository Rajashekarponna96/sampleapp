import { EventData } from './event-data';

// describe('EventData', () => {
//   it('should create an instance', () => {
//     expect(new EventData()).toBeTruthy();
//   });
// });
// import EventData from './event-data';

describe('EventData', () => {
  it('should create an instance', () => {
    const eventData = new EventData('myEvent', 'myValue');
    expect(eventData).toBeTruthy();
  });
});
