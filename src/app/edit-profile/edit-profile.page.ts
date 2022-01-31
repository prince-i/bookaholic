import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { async } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userId: any;

  fname: any;
  lname: any;
  phone: any;

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }

  ionViewWillEnter() {
    this.getUserInformation();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  userData: any = {};
  userDataLoaded: boolean = false;
  getUserInformation = async() => {
    this.userDataLoaded = false;
    await this.dataService.sendApiRequest('pullUserInformation', this.userId).subscribe((data: { payload: any; }) => {
      this.userData = data.payload;

      this.fname = this.userData[0].acc_fname;
      this.lname = this.userData[0].acc_lname;
      this.phone = this.userData[0].acc_phone;
      this.userDataLoaded = true;
    });
  }

  profileToEditData: any = {};
  editProfile = async() => {
    this.profileToEditData.acc_id = this.userId;

    this.profileToEditData.acc_fname = this.fname;
    this.profileToEditData.acc_lname = this.lname;
    this.profileToEditData.acc_phone = this.phone;

    await this.dataService.sendApiRequestForUpdate('editProfile/', this.profileToEditData, this.userId).subscribe((data: { payload: any; }) => {
      window.alert("Success");
      this.getUserInformation();
    });
  }

}
