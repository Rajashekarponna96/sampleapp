import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent implements OnInit {

  

  purchase:any = {
    entity: {},
    partyaccounthead: {},
    party: {},
    usercode: "",
    date: "",
    vouchers: []
  }

  constructor() { }

  ngOnInit(): void {
  }

}
