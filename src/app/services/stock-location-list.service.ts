import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalConstants } from '../global/global-constants'; 


@Injectable({
  providedIn: 'root'
})
export class StockLocationListService {

  constructor(private http:HttpClient) { }

  fetchStockLocations(criteria:any) {
    
    let loginObject = GlobalConstants.loginObject
    
    let headers  = new HttpHeaders();
    headers = headers.append('Content-Type','application/json; charset=utf-8').append('authorization','Basic ' + btoa(loginObject.accountid+":"+loginObject.endpoint+":"+loginObject.token+":"+loginObject.schema+":"+loginObject.database));
    
    let postdata = JSON.stringify(criteria)
    console.log('POSTDATA',postdata)

    let params = new HttpParams();
    params = params.append('postdata',postdata); 
   
    let ROOT_URL = 'https://'+loginObject.appurl+'/unifund/AuthStockLocations';

    return this.http.get(ROOT_URL,{headers:headers,params:params}) 


  }


}
