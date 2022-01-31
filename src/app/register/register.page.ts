import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  fname: any;
  lname: any;
  mobile: any;
  role: any;
  email: any;
  password: any;
  conf_password: any;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  registerCredentials: any = {}
  accountRegister = async() =>{
    this.registerCredentials.acc_email = this.email;
    this.registerCredentials.acc_password = this.password;
    this.registerCredentials.acc_fname = this.fname;
    this.registerCredentials.acc_lname = this.lname;
    this.registerCredentials.acc_phone = this.mobile;
    this.registerCredentials.acc_role = this.role;
    console.log(this.registerCredentials);

    
    if(this.registerCredentials.acc_password == this.conf_password){
      await this.dataService.sendApiRequest('accountRegister', this.registerCredentials).subscribe((data: { payload: any; }) => {
        if(data.payload == "exist!"){
          console.log('exist');
        }else if (data.payload == this.email){
          console.log('success');
          this.router.navigate(['/login']);
        }
      });
    }else{
      console.log('Password did not match');
    }
  }

  redirectToLogin(){
    this.router.navigate(['/login']);
  }
}
