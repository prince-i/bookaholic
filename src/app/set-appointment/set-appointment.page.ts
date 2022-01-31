import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-set-appointment',
  templateUrl: './set-appointment.page.html',
  styleUrls: ['./set-appointment.page.scss'],
})
export class SetAppointmentPage implements OnInit {
  appointment_prop_id: any;
  userId: any;

  constructor(private dataService: DataService, private router: Router,
  private modalController: ModalController, public navParams: NavParams) {
    this.navParams.get('appointment_prop_id');
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.userId = localStorage.getItem('userId');
    this.userPullSelectedProperty();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  date: any;
  time: any;
  appointmentInfo: any = {};
  userSetAppointment = async() => {
    this.appointmentInfo.prop_id = this.appointment_prop_id;
    this.appointmentInfo.acc_id = this.userId;
    this.appointmentInfo.app_date = this.date;
    this.appointmentInfo.app_time = this.time;

    await this.dataService.sendApiRequest('userSetAppointment', this.appointmentInfo).subscribe((data: { remarks: any; }) => {
      if(data.remarks == "success"){
        window.alert("Success adding!");
        this.dismissModal();
      }else{
        window.alert("There is problem in adding!");
      }
    });
  }

  property: any = [];
  propertyLoaded: boolean = false;
  userPullSelectedProperty = async() => {
    this.propertyLoaded = false;
    await this.dataService.sendApiRequest('sellerPullLastPropertyValues', this.appointment_prop_id).subscribe((data: { payload: any; }) => {
      this.property = data.payload;
      console.log(this.property);
      this.propertyLoaded = true;
    });
  }

}
