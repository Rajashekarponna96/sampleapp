import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newview',
  templateUrl: './newview.component.html',
  styleUrls: ['./newview.component.css']
})
export class NewviewComponent implements OnInit {

  sanitizedInvoiceList:any [] = []

  constructor() { }

  ngOnInit(): void {
  }

  onRowSelect(e:any) {

  }

  handleView(inv:any) {

  }

  handleNewPrint(inv:any) {

  }

  handleSendInvoice(inv:any) {

  }

  handleReturn(inv:any) {

  }

  handleEWayBillNo(inv:any) {

  }

}
