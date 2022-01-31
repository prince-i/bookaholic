import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.page.html',
  styleUrls: ['./email-verify.page.scss'],
})
export class EmailVerifyPage implements OnInit {
  userId: any;
  otp: any;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem("userId");
    this.getUserInformation();
  }

  userData: any = {};
  userDataLoaded: boolean = false;
  getUserInformation = async() => {
    this.userDataLoaded = false;
    await this.dataService.sendApiRequest('pullUserInformation', this.userId).subscribe((data: { payload: any; }) => {
      this.userData = data.payload;
      this.userDataLoaded = true;
    });
  }

  verifyAccountData: any = {};
  userVerifyAccount = async() => {
    this.verifyAccountData.acc_id = this.userId;
    this.verifyAccountData.acc_otp = parseInt(this.otp);

    console.log(this.verifyAccountData);
    await this.dataService.sendApiRequestForUpdate('accountVerifyEmail/', this.verifyAccountData, this.verifyAccountData.acc_id).subscribe((data: { status: any; }) => {
      console.log(data.status['remarks']);
      if(data.status['remarks'] == "success"){
        this.dataService.setLogin();
        this.router.navigate(['/tabs']);
      }else{
        window.alert('incorrect otp!');
      }
    });
  }

  accountToEmail: any = {};
  resendOTP = async () =>{
    this.accountToEmail.acc_email = this.userData[0].acc_email;
    this.accountToEmail.acc_otp = this.userData[0].acc_otp;

    await this.dataService.sendApiRequest('resendUserOTP', this.accountToEmail).subscribe((data: { status: any; }) => {
      window.alert("Sent! Please check your email.");
    });
  }

}
