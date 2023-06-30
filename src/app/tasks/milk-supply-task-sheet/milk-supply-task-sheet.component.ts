import { Component, OnInit } from '@angular/core';
import { MilkSupplyTaskSheetService } from 'src/app/services/milk-supply-task-sheet.service';
import { HttpClient } from '@angular/common/http';
import {ConfirmationService,FilterService,FilterMatchMode,MessageService} from 'primeng/api';
import { Xetaerror } from 'src/app/global/xetaerror';
import { XetaSuccess } from 'src/app/global/xeta-success';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-milk-supply-task-sheet',
  templateUrl: './milk-supply-task-sheet.component.html',
  styleUrls: ['./milk-supply-task-sheet.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class MilkSupplyTaskSheetComponent implements OnInit {

  today: number = Date.now();

  daytasks:any[] = new Array
  sdTaskList:any[] = new Array
  displayModal:boolean = false
  inProgress:boolean = false

  _ahlSub:any

  constructor(private confirmationService:ConfirmationService, private messageService: MessageService,private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.loadTasks(0,0,'')
  }

  loadTasks(offset:number,moreoffset:number,taskTitle:string) {

    this.inProgress = true
    
    let ahlService:MilkSupplyTaskSheetService = new MilkSupplyTaskSheetService(this.httpClient)
    let criteria:any = {taskstring:taskTitle};
    console.log('CRITERIA',criteria)
    
    this._ahlSub = ahlService.fetchMilkSupplyTaskSheet(criteria).subscribe({
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
          // this.masterCopy = dataSuccess.success
          // this.totalRecords = this.masterCopy.length
          // this.accountheads = this.masterCopy.slice(offset,this.recordsPerPage+offset);
          this.daytasks = dataSuccess.success
          // this.sanitizeDayTasks()
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



  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.daytasks);
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


  onRowSelect(event:any) {
    
  }

  getTotalAmount() {
    return 0
  }

}
