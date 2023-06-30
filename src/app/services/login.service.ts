import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private http:HttpClient ) { }

  login(lo:any) {
    console.log('APPURL',lo.appurl)
    let appurl = 'https://'+lo.appurl+'/unifund/Login'
    return this.http.post(appurl,JSON.stringify(lo))

  }

}
