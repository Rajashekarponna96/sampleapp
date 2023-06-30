import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceZeroWithEmptyForCS'
})
export class ReplaceZeroWithEmptyForCSPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {}
  
  transform(value: any, replaceText: string = ''): unknown {
    //value = Number(value)
    if (typeof value === 'undefined' || value === null || value == 0 || value === undefined) {
      return replaceText;
    }
    return this.decimalPipe.transform(value, '1.2-2');
  }

}
