import { Validator, NG_VALIDATORS, UntypedFormControl } from '@angular/forms'
import { Directive, OnInit, forwardRef } from '@angular/core';

@Directive({
    selector: '[hhmmValidator]',
    providers: [
      { provide: NG_VALIDATORS, useExisting: HHMMValidator, multi: true }
    ]
  })


export class HHMMValidator {
    ngOnInit() {}

    validate(c: UntypedFormControl) {
        console.log('TIME CONTROL VALUE',c.value)
        let myArray:any
        if(c.value !== null) {
            myArray = c.value.split(':')
            console.log('MYARRAY',myArray[0])

            let hp:number = myArray[0]
            let mp:number = myArray[1]
            console.log('HP',hp)
            console.log('MP',mp)

            if(isNaN(hp)) {
                console.log('HP is NOT number')
                return { 'gte': true, 'requiredValue': 'hour must be a number' }
            }
            if(!isNaN(hp)) {
                if(hp < 0 || hp > 23) {
                    console.log('HP is less than 0 OR is greater than 23')
                    return { 'gte': true, 'requiredValue': 'hour must be between 0 and 23' }
                }
            }
            if(isNaN(mp)) {
                console.log('MP is NOT number')
                return { 'gte': true, 'requiredValue': 'minute must be a number' }
            }
            if(!isNaN(mp)) {
                if(mp < 0 || mp > 59) {
                    console.log('MP is less than 0 OR is greater than 59')
                    return { 'gte': true, 'requiredValue': 'minute must be between 0 and 59' }
                }
            }
        }

        return null
    }
}
