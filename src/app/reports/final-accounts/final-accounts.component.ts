import { HttpClient } from '@angular/common/http';
import { Component, OnInit,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FinalAccountsService } from 'src/app/services/final-accounts.service';
import {ConfirmationService,MessageService} from 'primeng/api';
import { XetaSuccess } from 'src/app/global/xeta-success';
import { Xetaerror } from 'src/app/global/xetaerror';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-final-accounts',
  templateUrl: './final-accounts.component.html',
  styleUrls: ['./final-accounts.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class FinalAccountsComponent implements OnInit {

  _invSub:any
  inProgress:boolean = false

  finalAccounts:any

  compiledAccountsDebit:any[] = []
  compiledAccountsCredit:any[] = []
  compiledAccountsPLDebit:any[] = []
  compiledAccountsPLCredit:any[] = []
  compiledAccountsBSL:any[] = []
  compiledAccountsBSA:any[] = [] 

  @ViewChild('finalaccounts') divHello: any;
  
  constructor(private datePipe: DatePipe,private httpClient:HttpClient,private confirmationService:ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadFinalAccounts()
  }

  ngAfterViewInit() {
    //console.log('HTML',this.divHello.nativeElement.innerHTML);
    
  }

  print(e:any) {

    const printContents = document.getElementById('fa')
    //console.log('PRINT',printContents?.innerHTML)
    let a:any = printContents?.innerHTML
    a = '<!DOCTYPE html><html><body>'+a+'</body></html>'
    console.log('A PRINT',a)

  }

  testprint(e:any) {


    let style:string = `<style type="text/css">*{margin:0;padding:0;text-indent:0}.s1{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:15pt}.s2{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:5pt}.s3{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:5pt}.s4{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:10.5pt}.s5{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:4.5pt}.s6{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:5.5pt}.s7{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:7.5pt}.s8{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:8.5pt}.s9{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:9pt}.s10{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:400;text-decoration:none;font-size:5pt}.s11{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6.5pt}.s12{color:#000;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6pt}.s13{color:red;font-family:"Times New Roman",serif;font-style:normal;font-weight:700;text-decoration:none;font-size:6pt}table,tbody{vertical-align:top;overflow:visible}</style>`
    
    const printContents = document.getElementById('newfa')
    //console.log('PRINT',printContents?.innerHTML)
    let a:any = printContents?.innerHTML
    a = '<!DOCTYPE html><head>'+style+'</head><body>'+a+'</body></html>'
    console.log('A PRINT',a)


    const newWindow = window.open("", "", "width=800,height=600");
    newWindow?.document.write(a);
    newWindow?.document.close();
    newWindow?.focus();
    newWindow?.print();



    // const wrapper = document.createElement('div');
    // wrapper.innerHTML = style + printContents?.innerHTML;

    // //const wrapper = document.getElementById('newfa');
    // if(wrapper) {
    //   html2canvas(wrapper).then((canvas) => {
    //     // do something with the canvas object
    //     var imgData = canvas.toDataURL('image/png');
    //     var pdf = new jsPDF();
    //     pdf.addImage(imgData, 'PNG', 0, 0,210,297);
    //     pdf.save("download.pdf");
    //   });
    // }
    
  }



  downloadInvoice() {
    const invoiceContent = document.getElementById('invoiceContent');
    // if (invoiceContent) {
    //   html2canvas.default(invoiceContent,{ width:1389, height:1965, scale:1 }).then(canvas => {
    //       const pdf = new jsPDF();
    //       pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 15, 15, 210, 297);
    //       pdf.save('invoice.pdf');
    //       //pdf.output('dataurlnewwindow');
    //   });
    // }


  }


  
















  loadFinalAccounts() {
    this.inProgress = true
    let ahlService:FinalAccountsService = new FinalAccountsService(this.httpClient)
    let criteria:any = {}
    console.log('CRITERIA',criteria)
    this._invSub = ahlService.fetchFinalAccounts(criteria).subscribe({
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
        else if(v.hasOwnProperty('detailed')) {
          let dataSuccess:XetaSuccess = <XetaSuccess>v;
          this.finalAccounts = dataSuccess
          console.log('FINAL ACCOUNTS',this.finalAccounts)
          this.processFinalAccounts(this.finalAccounts)
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


  processFinalAccounts(fa:any) {

    console.log('TRADING DEBIT ROWS',fa.detailed.tradingdebitrows)
    console.log('TRADING CREDIT ROWS',fa.detailed.tradingcreditrows)
    
    let fromdate = fa.detailed.fromdate
    let todate = fa.detailed.todate

    let trddebitrows = fa.detailed.tradingdebitrows
    let trdcreditrows = fa.detailed.tradingcreditrows
    let pldebitrows = fa.detailed.pldebitrows
    let plcreditrows = fa.detailed.plcreditrows
    let liabilityrows = fa.detailed.liabilityrows
    let assetrows = fa.detailed.assetrows

    let csvalue = fa.detailed.closingstock
    let prodvalue = fa.detailed.prodsum
    let consvalue = fa.detailed.conssum


    // fromdate = fromdate.replace(' ', 'T');
    // todate = todate.replace(' ','T');

    // for (let index = 0; index < trddebitrows.length; index++) {
    //   const element = trddebitrows[index];
    //   if (condition) {
    //     array
    //   }
    // }


    // TRADING

    if (fromdate === 'null' || todate === 'null') {
      return;
    }

    console.log('FROM DATE',fromdate)
    console.log('TO DATE',todate)

    if (todate == '\'infinity\'') {
      console.log('YES YES')
      todate = '2022-11-30T17:00:00Z'
    }

    let s = "Trading A/c for the period "+this.datePipe.transform(fromdate)+" to "+ this.datePipe.transform(todate);
    console.log('DATE PIPE',s)

    let trdtitleca = {"title":s,"amount":""}

    this.compiledAccountsDebit.push(trdtitleca)

    let emptyca = {"title":"\uFEFF","amount":""}

    this.compiledAccountsDebit.push(emptyca)
    
    // let openca = {"title":"Opening Stock","amount":0}
    // this.compiledAccountsDebit.push(openca)

    // this.compiledAccountsDebit.push(emptyca)
    // this.compiledAccountsDebit.push(emptyca)
    

    for (let index = 0;  index < trddebitrows.length; index++) {
      const element = trddebitrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca = this.formattedNumber(Number(element.debit),ca)
      this.compiledAccountsDebit.push(ca)
     }


    this.compiledAccountsDebit.push(emptyca)
    // this.compiledAccountsDebit.push(emptyca)
    // this.compiledAccountsDebit.push(emptyca)
    

     


     // trading credit rows

     for (let index = 0;  index < trdcreditrows.length; index++) {
      const element = trdcreditrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca = this.formattedNumber(Number(element.credit),ca)
      this.compiledAccountsCredit.push(ca)
     }

     this.compiledAccountsCredit.push(emptyca)
     this.compiledAccountsCredit.push(emptyca)  


     let closeca = {"title":"CLOSING STOCK","amount":""}
     closeca = this.formattedNumber(csvalue,closeca)
     this.compiledAccountsCredit.push(closeca)

     this.compiledAccountsCredit.push(emptyca)
     this.compiledAccountsCredit.push(emptyca)


     let debitsum:number = 0
     let creditsum:number = 0
     let closingstocksum = 0

     for (let index = 0; index < this.compiledAccountsDebit.length; index++) {
      const element = this.compiledAccountsDebit[index];
      debitsum = Number(element["amount"]) + debitsum
      
     }

     console.log('DEBIT SUM',debitsum)

     for (let index = 0; index < this.compiledAccountsCredit.length; index++) {
      const element = this.compiledAccountsCredit[index];
      creditsum = Number(element["amount"]) + creditsum
      
     }


     console.log('CREDIT SUM',creditsum)

     //let indices = this.totalsIndex(this.compiledAccounts)

     let grossprofit:number = 0
     let grossloss:number = 0

     if(debitsum > creditsum) {
      
      let ca:any = {}
      ca["title"] = "Gross Loss c/f"
      ca = this.formattedNumber(Number(debitsum - creditsum),ca)
      grossloss = debitsum - creditsum

      this.compiledAccountsCredit.push(ca)

      
    } 

    if(debitsum < creditsum) {

      let ca:any = {}
      ca["title"] = "Gross Profit c/f"
      ca = this.formattedNumber(Number(creditsum - debitsum),ca)
      grossprofit = creditsum - debitsum

      this.compiledAccountsDebit.push(ca)
      
    }


    let totaldebitsum:number = 0
    let totalcreditsum:number = 0
    

     for (let index = 0; index < this.compiledAccountsDebit.length; index++) {
      const element = this.compiledAccountsDebit[index];
      totaldebitsum = Number(element["amount"]) + debitsum
      
     }

     console.log('TOTAL DEBIT SUM',totaldebitsum)

     for (let index = 0; index < this.compiledAccountsCredit.length; index++) {
      const element = this.compiledAccountsCredit[index];
      totalcreditsum = Number(element["amount"]) + creditsum
      
     }

     
     console.log('TOTAL CREDIT SUM',totalcreditsum)



     let totaltradedebitca:any = {}
     totaltradedebitca["title"] = "TOTAL"
     totaltradedebitca = this.formattedNumber(Number(totaldebitsum),totaltradedebitca)

     this.compiledAccountsDebit.push(totaltradedebitca)
      


     let totaltradecreditca:any = {}
     totaltradecreditca["title"] = "TOTAL"
     totaltradecreditca = this.formattedNumber(Number(totalcreditsum),totaltradecreditca)

     this.compiledAccountsCredit.push(totaltradecreditca)







    // PROFIT & LOSS

    let pls = "Profit & Loss A/c for the period "+this.datePipe.transform(fromdate)+" to "+ this.datePipe.transform(todate);
    let pltitleca = {"title":pls,"amount":""}

    this.compiledAccountsPLDebit.push(pltitleca)

    this.compiledAccountsPLDebit.push(emptyca)

    for (let index = 0;  index < pldebitrows.length; index++) {
      const element = pldebitrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca = this.formattedNumber(Number(element.debit),ca)
      this.compiledAccountsPLDebit.push(ca)
     }

    this.compiledAccountsPLDebit.push(emptyca)
    
    // let pldrtotalca = {"title":"TOTAL","amount":0}
    // this.compiledAccountsPLDebit.push(pldrtotalca)

    for (let index = 0;  index < plcreditrows.length; index++) {
      const element = plcreditrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca  = this.formattedNumber(Number(element.credit),ca)
      //console.log('CA',ca)
      this.compiledAccountsPLCredit.push(ca)
     }

    this.compiledAccountsPLCredit.push(emptyca)

    

    if(grossloss > grossprofit) {
      let ca:any = {}
      ca["title"] = "Gross Loss b/f"
      ca = this.formattedNumber(Number(grossloss),ca)
      this.compiledAccountsPLDebit.push(ca)
    }

    if(grossloss < grossprofit) {
      let ca:any = {}
      ca["title"] = "Gross Profit b/f"
      ca = this.formattedNumber(Number(grossprofit),ca)
      this.compiledAccountsPLCredit.push(ca)

    }



    let pldsum:number = 0
    let plcsum:number = 0
     

     for (let index = 0; index < this.compiledAccountsPLDebit.length; index++) {
      const element = this.compiledAccountsPLDebit[index];
      pldsum = Number(element["amount"]) + pldsum
      
     }

     console.log('PL DEBIT SUM',pldsum)

     for (let index = 0; index < this.compiledAccountsPLCredit.length; index++) {
      const element = this.compiledAccountsPLCredit[index];
      plcsum = Number(element["amount"]) + plcsum
      
     }


     console.log('PL CREDIT SUM',plcsum)



    // if(grossloss > grossprofit) {
    //   pldebitsum = pldebitsum + grossloss
    //   console.log('PLDEBITSUM',pldebitsum)
    // }

    // if(grossloss < grossprofit) {
    //   plcreditsum = plcreditsum + grossprofit
    //   console.log('PLCREDITSUM',pldebitsum)
    // }

    let netprofit:number = 0
    let netloss:number = 0

    if(pldsum > plcsum) {
      let ca:any = {}
      ca["title"] = "Net Loss c/f"
      ca = this.formattedNumber(Number(pldsum - plcsum),ca)
      netloss = pldsum - plcsum

      this.compiledAccountsPLCredit.push(ca)


  }

  if(pldsum < plcsum) {
      let ca:any = {}
      ca["title"] = "Net Profit c/f"
      ca = this.formattedNumber(Number(plcsum - pldsum),ca)
      netprofit = plcsum - pldsum

      this.compiledAccountsPLDebit.push(ca)


  }


  let totalpldebitsum:number = 0
  let totalplcreditsum:number = 0
    

  for (let index = 0; index < this.compiledAccountsPLDebit.length; index++) {
    const element = this.compiledAccountsPLDebit[index];
    totalpldebitsum = Number(element["amount"]) + totalpldebitsum
  
  }

  console.log('TOTAL PL DEBIT SUM',totalpldebitsum)

    for (let index = 0; index < this.compiledAccountsPLCredit.length; index++) {
    const element = this.compiledAccountsPLCredit[index];
    totalplcreditsum = Number(element["amount"]) + totalplcreditsum
  
  }

     
  console.log('TOTAL PL CREDIT SUM',totalplcreditsum)


  let totalpldebitca:any = {}
  totalpldebitca["title"] = "TOTAL"
  totalpldebitca = this.formattedNumber(Number(totalpldebitsum),totalpldebitca)

  this.compiledAccountsPLDebit.push(totalpldebitca)
      


  let totalplcreditca:any = {}
  totalplcreditca["title"] = "TOTAL"
  totalplcreditca = this.formattedNumber(Number(totalplcreditsum),totalplcreditca)

  this.compiledAccountsPLCredit.push(totalplcreditca)




  




    // BALANCE SHEET


    let bs = "Balance Sheet as at "+ this.datePipe.transform(todate);
    let bstitleca = {"title":bs,"amount":""}
    this.compiledAccountsBSA.push(bstitleca)

    this.compiledAccountsBSA.push(emptyca)



    // ASSETS

    let attca:any = {}
    attca["title"] = "ASSETS"
    attca["amount"] = ""
    this.compiledAccountsBSA.push(attca)

    this.compiledAccountsBSA.push(emptyca)

    let totalassetsum:number = 0
    let totalliabilitysum:number = 0

    
    for (let index = 0;  index < assetrows.length; index++) {
      const element = assetrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca = this.formattedNumber(Number(element.debit),ca)
      this.compiledAccountsBSA.push(ca)
      
     }

  

    let csca:any = {}
    csca["title"] = "Closing Stock"
    csca = this.formattedNumber(Number(csvalue),csca)
    this.compiledAccountsBSA.push(csca)




    if (netloss > netprofit) {
      
      let plca:any = {}
      plca["title"] = "Profit & Loss"
      plca = this.formattedNumber(Number(netloss),plca)

      this.compiledAccountsBSA.push(plca)


    }





    // LIABILITIES


    let atlca:any = {}
    atlca["title"] = "LIABILITIES"
    atlca["amount"] = ""
    this.compiledAccountsBSL.push(atlca)

    this.compiledAccountsBSL.push(emptyca)
    
    for (let index = 0;  index < liabilityrows.length; index++) {
      const element = liabilityrows[index];
      let ca:any = {}
      ca["title"] = element.accounthead
      ca = this.formattedNumber(Number(element.credit),ca)
      this.compiledAccountsBSL.push(ca)
      
     }

    

    if (netloss < netprofit) {
      
      let plca:any = {}
      plca["title"] = "Profit & Loss"
      plca = this.formattedNumber(Number(netprofit),plca)
      this.compiledAccountsBSL.push(plca)

    }

    
    


    // BALANCE SHEET TOTALS
    
    
  let totalbsassetsum:number = 0
  let totalbsliabilitysum:number = 0
    

  for (let index = 0; index < this.compiledAccountsBSA.length; index++) {
    const element = this.compiledAccountsBSA[index];
    totalbsassetsum = Number(element["amount"]) + totalbsassetsum
  
  }

  console.log('TOTAL BS ASSET SUM',totalbsassetsum)

    for (let index = 0; index < this.compiledAccountsBSL.length; index++) {
    const element = this.compiledAccountsBSL[index];
    totalbsliabilitysum = Number(element["amount"]) + totalbsliabilitysum
  
  }

     
  console.log('TOTAL BS LIABILITY SUM',totalbsliabilitysum)




  let totalassetca:any = {}
  totalassetca["title"] = "TOTAL"
  totalassetca = this.formattedNumber(Number(totalbsassetsum),totalassetca)
  this.compiledAccountsBSA.push(emptyca)
  this.compiledAccountsBSA.push(totalassetca)
  
  
  let totalliabilityca:any = {}
  totalliabilityca["title"] = "TOTAL"
  totalliabilityca = this.formattedNumber(Number(totalbsliabilitysum),totalliabilityca)
  this.compiledAccountsBSL.push(emptyca)
  this.compiledAccountsBSL.push(totalliabilityca)
    

  }




  



  isInt(n:any) {
    return n % 1 === 0;
  }
  
  formattedNumber(n:number,ca:any) {
    
    let a = n.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits:2})
    const myArray = a.split(".");

    ca["integer"] = myArray[0]
    ca["fraction"] = "."+myArray[1]

    if (this.isInt(n)){
      ca["showfraction"] = false
    }
    else if(!this.isInt(n)) {
      ca["showfraction"] = true
    }

    ca["amount"] = n
    
    return ca

  }

  /*

  split the fraction

  */


  getDebitThree(array:any) {
    let sum:number = 0
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(index >= 3) {
        sum = sum + element.debit
      }
    }
    return sum
  }

  getCreditThree(array:any) {
    let sum:number = 0
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(index >= 3) {
        sum = sum + element.credit
      }
    }
    return sum
  }


  getClosingThree(array:any) {
    let sum:number = 0
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(index >= 3) {
        sum = sum + (element.sum * element.org)
      }
    }
    return sum
  }

  // totalsIndex(cas:any) {
  //   let indices:any = []
  //   for (let index = 0; index < cas.length; index++) {
  //     const element = cas[index];
  //     if(element.title === 'TOTAL') {
  //       indices.push(index)
  //     }
  //   }
  //   return indices
  // }

  



}
