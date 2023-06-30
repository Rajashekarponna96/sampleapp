import { GlobalConstants } from '../global/global-constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaleinvoiceAgeingListService {

  constructor(private http:HttpClient) { }

  fetchSaleInvoiceAgeingList(criteria:any) {
    
    let loginObject = GlobalConstants.loginObject
    
    let headers  = new HttpHeaders();
    headers = headers.append('Content-Type','application/json; charset=utf-8').append('authorization','Basic ' + btoa(loginObject.accountid+":"+loginObject.endpoint+":"+loginObject.token+":"+loginObject.schema+":"+loginObject.database));
    
    criteria["timezone"] = loginObject.timezone
    let postdata = JSON.stringify(criteria)
    console.log('POSTDATA',postdata)

    let params = new HttpParams();
    params = params.append('postdata',postdata);
   
    let ROOT_URL = 'https://'+loginObject.appurl+'/unifund/AuthSaleInvoiceAgeingList';

    return this.http.get(ROOT_URL,{headers:headers,params:params}) 

  }  


}
