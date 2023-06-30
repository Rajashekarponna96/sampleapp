
import { Validator, NG_VALIDATORS, UntypedFormControl } from '@angular/forms'
import { Directive, OnInit, forwardRef } from '@angular/core';


@Directive({
    selector: '[ddmmyyyyValidator]',
    providers: [
      { provide: NG_VALIDATORS, useExisting: DDMMYYYValidator, multi: true }
    ]
  })

export class DDMMYYYValidator implements Validator, OnInit {

    ngOnInit() {}

    validate(c: UntypedFormControl) {

        console.log('CONTROL VALUE',c.value)
        let myArray:any
        if(c.value !== null) {
            myArray = c.value.split('-')
            console.log('MYARRAY',myArray[0])

            let dp:number = myArray[0]
            let mp:number = myArray[1]
            let yp:number = myArray[2]

            console.log('DP',dp)
            console.log('MP',mp)
            console.log('YP',yp)

            if(isNaN(dp)) {
                console.log('DP is NOT number')
                return { 'gte': true, 'requiredValue': 'Date must be a number' }
            }
            if(!isNaN(dp)) {
                // if(dp < 1 || dp > 31) {
                //     console.log('DP is less than 1 OR is greater than 31')
                //     return { 'gte': true, 'requiredValue': 'Date must be between 1 or 31' }
                // }
                if((mp == 1 || mp == 3 || mp == 5 || mp == 7 || mp == 8 || mp == 10 || mp == 12) && (dp < 1 || dp > 31)) {
                    console.log('DP is less than 1 OR is greater than 31')
                    return { 'gte': true, 'requiredValue': 'Date must be between 1 or 31 for the months of Jan,Mar,May,Jul,Aug,Oct and Dec' }
                }
                if((mp == 4 || mp == 6 || mp == 9 || mp == 11) && (dp < 1 || dp > 30)) {
                    console.log('DP is less than 1 OR is greater than 31')
                    return { 'gte': true, 'requiredValue': 'Date must be between 1 or 30 for the months of Apr,Jun,Sep and Nov' }
                }

            }
            if(isNaN(mp)) {
                console.log('MP is NOT number')
                return { 'gte': true, 'requiredValue': 'month must be a number' }
            }
            if(!isNaN(mp)) {
                if(mp < 1 || mp > 12) {
                    console.log('MP is less than 1 OR is greater than 12')
                    return { 'gte': true, 'requiredValue': 'month must be between 1 or 31' }
                }
            }
            if(isNaN(yp)) {
                console.log('YP is NOT number')
                return { 'gte': true, 'requiredValue': 'year must be a number' }
            }
            
            console.log(yp+' IS LEAP',this.leapYear(yp) ? true : false)

            if(this.leapYear(yp) && mp == 2 && (dp < 1 || dp > 29)) {
                console.log('YP is NOT number')
                return { 'gte': true, 'requiredValue': 'date must be between 1 and 29 for a leap year' }
            }
            if(!this.leapYear(yp) && mp == 2 && (dp < 1 || dp > 28)) {
                console.log('YP is NOT number')
                return { 'gte': true, 'requiredValue': 'date must be between 1 and 28' }
            }

        }
        
 
        // let v: number = +c.value;

        // if (isNaN(v)) {
        //   return { 'gte': true, 'requiredValue': 10 }
        // }
     
        // if (v <= +10) {
        //   return { 'gte': true, 'requiredValue': 10 }
        // }
     
        return null;
    }


    leapYear(year:number)
    {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

}
