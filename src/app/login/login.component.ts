import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { Form, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../global/global-constants';
import { XetaSuccess } from '../global/xeta-success';
import { Xetaerror } from '../global/xetaerror';
import { EventBusServiceService } from '../global/event-bus-service.service';
import { EventData } from '../global/event-data';



import { Login } from '../services/login';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginObject: Login = new Login();

  loginForm: UntypedFormGroup = new UntypedFormGroup({});

  @Output() loginEvent = new EventEmitter<Login>();
  @Output() loginProgressEvent = new EventEmitter();
  @Output() loginErrorEvent = new EventEmitter();

  private appurl:UntypedFormControl = new UntypedFormControl;
  
  constructor(private loginService:LoginService,private eventBusService:EventBusServiceService) { }

  ngOnInit(): void {

    // get from local storage

    console.log('LOGIN DATA',localStorage.getItem('logindata'))

    let ld:any = localStorage.getItem('logindata')

    if(ld){
      console.log('YES')
    }
    else {
      console.log('NO')
      let j:any = {}
      j["endpoint"] = ""
      j["password"] = ""
      j["schema"] = ""
      j["database"] = ""
      j["appurl"] = ""
      ld = JSON.stringify(j)
    }

    let endpoint = new UntypedFormControl('',Validators.required);
    let password =  new UntypedFormControl('',Validators.required);
    let schema = new UntypedFormControl('',Validators.required);
    let database = new UntypedFormControl('',Validators.required);
    this.appurl = new UntypedFormControl('',Validators.required);

    let ldjson = JSON.parse(ld)
    

    endpoint.setValue(ldjson.endpoint)
    password.setValue(ldjson.password)
    schema.setValue(ldjson.schema)
    database.setValue(ldjson.database)
    this.appurl.setValue(ldjson.appurl)

    this.loginForm = new UntypedFormGroup({
      endpoint: endpoint,
      password: password,
      schema: schema,
      database: database,
      appurl: this.appurl
      
    }) 

  }

  handleLogin(event:any) {

    localStorage.setItem('logindata',JSON.stringify(this.loginForm.value))
    
    if(this.loginForm.valid) {

      this.loginProgressEvent.emit();

      let lo = this.loginForm.value;
      lo["location"] = "17.4121456, 78.34493719999999"
      console.log('LOGIN',JSON.stringify(lo))
      this.loginService.login(lo).subscribe({
        complete: () => {console.info('complete')},
        error: (e) => {
          console.log('ERROR',e) 
          alert('A server error occured. '+e.message)
          this.loginErrorEvent.emit();
          return;
        },
        next: (v) => {
          console.log('NEXT',v);
          if (v.hasOwnProperty('error')) {
            let dataError:Xetaerror = <Xetaerror>v; 
            alert(dataError.error);
            this.loginErrorEvent.emit();
            return;
          }
          else if(v.hasOwnProperty('success')) {
            let dataSuccess:XetaSuccess = <XetaSuccess>v;
            this.loginObject = <Login>dataSuccess.success;
            this.loginObject.appurl = this.appurl.value
            GlobalConstants.loginObject = this.loginObject;
            this.loginEvent.emit(this.loginObject);

            
            this.eventBusService.emit(new EventData('LoginSuccess',this.loginObject))

            let lo:any = JSON.parse(JSON.stringify(this.loginObject))

            if(lo.digitalkey.initialscreen === 'DashboardComponent') {
              this.eventBusService.emit(new EventData('Dashboard','dashboard'))
            }
            else if (lo.digitalkey.initialscreen === 'StockRegisterComponent') {
              this.eventBusService.emit(new EventData('StockRegister','stockregister'))
            }
            else {
              this.eventBusService.emit(new EventData('Dashboard','dashboard'))
            }
            

            return;
          }
          else if(v == null) {
            alert('A null object has been returned. An undefined error has occurred.')
            this.loginErrorEvent.emit();
            return;
          }
          else {
            alert('An undefined error has occurred.')
            this.loginErrorEvent.emit();
            return
          }
        }
      })
    }
    else {
      alert('One or more fields have not been entered.')
    }
    return;

  }

}
