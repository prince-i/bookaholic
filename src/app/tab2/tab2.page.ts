import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import * as moment from 'moment';
import { async } from '@angular/core/testing';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  userId: any;
  userRole: any;

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');

    this.checkRole();
  };

  userData: any;
  checkRole = async () => {
    console.log("ROLE: ",this.userRole, " ID: ", this.userId);

    if(this.userRole == 0){
      this.pullUserAppointments();
    }else if(this.userRole == 1){
      this.pullSellerAppointments();
    }
  };

  async editProfileModalTrigger() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  };

  async changePasswordModalTrigger() {
    const modal = await this.modalController.create({
      component: ChangePasswordPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  };

  accountLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  userAppointmentData: any = [];
  pullUserAppointments = async() => {
    await this.dataService.sendApiRequest('pullUserAppointments', this.userId).subscribe((data: { payload: any; }) => {
      this.userAppointmentData = data.payload;
        for (let i = 0; i < this.userAppointmentData.length; i++){
          this.userAppointmentData[i].app_date = moment(this.userAppointmentData[i].app_date).format("MMM Do YYYY");
          this.userAppointmentData[i].app_time = moment(this.userAppointmentData[i].app_time).format("LT");
        }
    });
  }

  appointmentToCancel: any = {}
  userCancelAppointment = async(id: any) => {
    this.appointmentToCancel.app_id = id;
    this.appointmentToCancel.app_status = 2;

    await this.dataService.sendApiRequestForUpdate('userCancelAppointment/', this.appointmentToCancel, id).subscribe((data: { payload: any; }) => {
      this.pullUserAppointments();
      window.alert('success!');
    });
  }

  sellerAppointmentData: any = [];
  pullSellerAppointments = async() => {
    await this.dataService.sendApiRequest('pullSellerAppointments', this.userId).subscribe((data: { payload: any; }) => {
      this.sellerAppointmentData = data.payload;
        for (let i = 0; i < this.sellerAppointmentData.length; i++){
          this.sellerAppointmentData[i].app_date = moment(this.sellerAppointmentData[i].app_date).format("MMM Do YYYY");
          this.sellerAppointmentData[i].app_time = moment(this.sellerAppointmentData[i].app_time).format("LT");
        } 
        console.log(this.sellerAppointmentData); 
    });
  }

  appointmentToApprove: any = {};
  sellerApproveAppointment = async(id: any) => {
    this.appointmentToApprove.app_id = id;
    this.appointmentToApprove.app_status = 1;

    await this.dataService.sendApiRequestForUpdate('userCancelAppointment/', this.appointmentToApprove, id).subscribe((data: { payload: any; }) => {
      this.pullSellerAppointments();
      window.alert('success!');
    });
  }

  
  appointmentToDecline: any = {}
  sellerDeclineAppointment = async(id: any) => {
    this.appointmentToDecline.app_id = id;
    this.appointmentToDecline.app_status = 3;

    await this.dataService.sendApiRequestForUpdate('userCancelAppointment/', this.appointmentToDecline, id).subscribe((data: { payload: any; }) => {
      this.pullSellerAppointments();
      window.alert('success!');
    });
  }

  sellerFilterAppointments = async(value: any) => {
    if(value == ""){
      this.pullSellerAppointments();
    }else{
      await this.dataService.sendApiRequestForUpdate('sellerFilterAppointments/', value, this.userId).subscribe((data: { payload: any; }) => {
        this.sellerAppointmentData = data.payload;
        for (let i = 0; i < this.sellerAppointmentData.length; i++){
          this.sellerAppointmentData[i].app_date = moment(this.sellerAppointmentData[i].app_date).format("MMM Do YYYY");
          this.sellerAppointmentData[i].app_time = moment(this.sellerAppointmentData[i].app_time).format("LT");
        } 
      });
    }
  }

  userFilterAppointments = async(value: any) => {
    if(value == ""){
      this.pullUserAppointments();
    }else{
      await this.dataService.sendApiRequestForUpdate('userFilterAppointments/', value, this.userId).subscribe((data: { payload: any; }) => {
        this.userAppointmentData = data.payload;
        for (let i = 0; i < this.userAppointmentData.length; i++){
          this.userAppointmentData[i].app_date = moment(this.userAppointmentData[i].app_date).format("MMM Do YYYY");
          this.userAppointmentData[i].app_time = moment(this.userAppointmentData[i].app_time).format("LT");
        } 
      });
    }
  }

}
