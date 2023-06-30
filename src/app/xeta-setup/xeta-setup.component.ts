import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-xeta-setup',
  templateUrl: './xeta-setup.component.html',
  styleUrls: ['./xeta-setup.component.css']
})
export class XetaSetupComponent implements OnInit {


  selectedOption: string = '';
  namesArray:any[] = [];
  
  form:any = new UntypedFormGroup({
    personalName: new UntypedFormGroup({
      firstName: new UntypedFormControl(''),
      middleName: new UntypedFormControl(''),
      lastName: new UntypedFormControl('')
    }),
    companyName: new UntypedFormGroup({
      name: new UntypedFormControl('')
    })
  });

  constructor() { }

  ngOnInit(): void {
    this.selectedOption = 'person';
  }

  addName() {
    if (this.selectedOption === 'person') {
      const { firstName, middleName, lastName } = this.form.get('personalName').value;
      this.namesArray.push({ firstName, middleName, lastName });
      this.form.get('personalName').reset();
    } else if (this.selectedOption === 'company') {
      //this.namesArray = [];
      const name = this.form.get('companyName').value.name;
      this.namesArray.push({ name });
      this.form.get('companyName').reset();
    }
  }

  deleteName(index: number) {
    this.namesArray.splice(index, 1);
  }

  resetNamesArray(value: string) {
    // if (value === 'person') {
    //   this.namesArray = [];
    // }
    this.namesArray = []
  }

}
