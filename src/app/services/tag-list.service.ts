import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalConstants } from '../global/global-constants';
import { Search } from './search';

@Injectable({
  providedIn: 'root'
})
export class TagListService {

  constructor(private http:HttpClient) { }

  fetchTags(criteria:any) { 
    
    let loginObject = GlobalConstants.loginObject
    
    let headers  = new HttpHeaders();
    headers = headers.append('Content-Type','application/json; charset=utf-8').append('authorization','Basic ' + btoa(loginObject.accountid+":"+loginObject.endpoint+":"+loginObject.token+":"+loginObject.schema+":"+loginObject.database));
    
    let postdata = JSON.stringify(criteria)

    let params = new HttpParams();
    params = params.append('postdata',postdata);
   
    let ROOT_URL = 'https://'+loginObject.appurl+'/unifund/AuthRTags';

    return this.http.get(ROOT_URL,{headers:headers,params:params})

  }

}
