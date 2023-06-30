import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { GlobalConstants } from '../global/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CheckPersonService {

  constructor(private http: HttpClient) { }

  checkPerson(person:any) {

    let loginObject = GlobalConstants.loginObject
    
    let headers  = new HttpHeaders();
    headers = headers.append('Content-Type','application/json; charset=utf-8').append('authorization','Basic ' + btoa(loginObject.accountid+":"+loginObject.endpoint+":"+loginObject.token+":"+loginObject.schema+":"+loginObject.database));
    
    let postdata = JSON.stringify(person)
    console.log('POSTDATA',postdata)
    let params = new HttpParams();
    params = params.append('postdata',postdata);
   
    let ROOT_URL = 'https://'+loginObject.appurl+'/unifund/AuthSimilarPeople';
    console.log(ROOT_URL)
    return this.http.get(ROOT_URL,{headers:headers,params:params})

    

  }

}
