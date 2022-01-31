import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any;
  password: any;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  loginCredentials: any = {};
  user
  accountLogin = async() => {
    this.loginCredentials.acc_email = this.email;
    this.loginCredentials.acc_password = this.password;

    await this.dataService.sendApiRequest('accountLogin', this.loginCredentials).subscribe((data: { payload: any; status: any; }) => {
      
      if(data.status['remarks'] == "success"){
        if(data.payload.acc_verified == 1){
          localStorage.setItem('userId', data.payload.acc_id);
          localStorage.setItem('userRole', data.payload.acc_role);
          this.dataService.setLogin();
          this.router.navigate(['/tabs']);
        }else{
          localStorage.setItem('userId', data.payload.acc_id);
          localStorage.setItem('userRole', data.payload.acc_role);
          this.router.navigate(['/email-verify']);
        }
      }else if(data.status['remarks'] == "notExist"){
        window.alert("Account not found!");
      }else{
        window.alert("Wrong password")
      }
    });
  }

  redirectToRegister(){
    this.router.navigate(['/register']);
  }
}
