import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'replaceZeroWithEmpty'
})
export class ReplaceZeroWithEmptyPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any, replaceText: string = ''): unknown {
    //value = Number(value)
    if (typeof value === 'undefined' || value === null || value == 0) {
      return replaceText;
    }
    return value;
  }

}
