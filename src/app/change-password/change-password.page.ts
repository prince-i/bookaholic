import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) { }
  userId: any;
  
  old_pass: any;
  new_pass: any;
  conf_pass: any;

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  changePasswordData: any = {};
  changePassword = async() => {
    this.changePasswordData.acc_id = this.userId;
    this.changePasswordData.old_password = this.old_pass;
    this.changePasswordData.acc_password = this.new_pass;

    if(this.new_pass == this.conf_pass){
      await this.dataService.sendApiRequestForUpdate('userChangePassword/', this.changePasswordData, this.changePasswordData.acc_id).subscribe((data: { status: any; }) => {
        if(data.status['remarks'] == "success"){
          window.alert('success changing password!');
          this.dismissModal();
        }else if(data.status['remarks'] == "incorrect"){
          window.alert('old password is incorrect!');
        }else{
          window.alert('there is an error in changing password.');
        }
      });
    }else{
      window.alert("Password did not match!");
    }
  }

}
