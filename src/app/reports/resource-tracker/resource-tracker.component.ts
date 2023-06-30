import { Component, OnInit } from '@angular/core';
import { ResourceTrackerService } from 'src/app/services/resource-tracker.service';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { EventBusServiceService } from 'src/app/global/event-bus-service.service';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';

import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/global/global-constants';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-resource-tracker',
  templateUrl: './resource-tracker.component.html',
  styleUrls: ['./resource-tracker.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ResourceTrackerComponent implements OnInit {

  today: number = Date.now();
  _ahlSub:any
  inProgress:boolean = false

  resources:any[] = new Array
  offset:number = 0

  exportColumns:any[] = [];

  constructor(private datePipe:DatePipe, private httpClient:HttpClient,private eventBusService:EventBusServiceService,private confirmationService:ConfirmationService, private messageService: MessageService,private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadResources(0,0)
  }

  loadResources(offset:number,moreoffset:number) {
    
    let ahlService:ResourceTrackerService = new ResourceTrackerService(this.httpClient)
    let criteria:any = {offset:offset};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchResources(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.resources = dataSuccess.success
          // for (let index = 0; index < this.masterCopy.length; index++) {
          //   const element = this.masterCopy[index];
          //   element.recordid = index
          // }
          // this.totalRecords = this.masterCopy.length
          // this.items = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.inProgress = false
          return
        }
        else if(v == null) { 
          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      } 
    })

  }

  confirm(msg:string) {
    this.confirmationService.confirm({
        header:'Error',
        message: msg,
        acceptVisible: true,
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
            //Actual logic to perform a confirmation
        }
    });
  }
  
  onRowSelect(event:any) {
    
  }


  handleMore() {
    this.offset = this.offset + 5000
    this.loadMore(this.offset)
  }

  loadMore(offset:number) {
    a:ResourceTrackerService
    let ahlService:ResourceTrackerService = new ResourceTrackerService(this.httpClient)
    let criteria:any = {offset:offset};
    console.log('CRITERIA',criteria)
    this._ahlSub = ahlService.fetchResources(criteria).subscribe({
      complete:() => {console.info('complete')},
      error:(e) => {
        this.inProgress = false
        this.confirm('A server error occured while fetching account heads. '+e.message)
        return
      },
      next:(v) => {
        console.log('NEXT',v);
        if (v.hasOwnProperty('error')) {
          let dataError:Xetaerror = <Xetaerror>v; 
          this.confirm(dataError.error)
          this.inProgress = false
          return
        }
        else if(v.hasOwnProperty('success')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          let newItems:any[] = dataSuccess.success
          for (let index = 0; index < newItems.length; index++) {
            const element = newItems[index];
            this.resources.push(JSON.parse(JSON.stringify(element)))
          }
          this.inProgress = false
          return
        }
        else if(v == null) { 
          this.inProgress = false
          this.confirm('A null object has been returned. An undefined error has occurred.')
          return
        }
        else {
          //alert('An undefined error has occurred.')
          this.inProgress = false
          this.confirm('An undefined error has occurred.')
          return false
        }
      }
    })

  }


  newExportPdf() {
    //console.log('PRINT LIST',this.printList)
    const doc: jsPDF = new jsPDF("p", "pt", "a4");
    let datePipe: DatePipe = new DatePipe("en-US");
    
    let b = 'Closing Stock as on ' + datePipe.transform(this.today,'fullDate');
    let loginObject = GlobalConstants.loginObject
    let a = loginObject.entityname
    console.log(loginObject)

    autoTable(doc,{
      columns: this.exportColumns, 
      body:this.resources,
      didDrawPage: function (data) {
        doc.setFontSize(15)
        doc.setFont("helvetica","bold")
        doc.text(a, data.settings.margin.left + 0, 20);
        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.text(b, data.settings.margin.left + 0, 35)
        console.log('MARGINS',data.settings.margin);
      },
      margin: { top: 40 },
      theme: "grid"
    });
    //doc.save('stockregister.pdf');
    doc.output("dataurlnewwindow")
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.resources);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xls', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    //let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_TYPE = 'application/vnd.ms-excel;charset=utf-8';
    let EXCEL_EXTENSION = '.xls';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION); 
  }

  checkNum(a:any):boolean {
    if (isFinite(a)) {
      return true
    }
    return false
  }

  formatExpiryDate(expirydate: any): string {
    if (expirydate instanceof Date && !isNaN(expirydate.getTime())) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(expirydate, 'dd-MMM-yyyy hh:mm a');
      return formattedDate ?? '';
    } else {
      return '';
    }
  }

}
