import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { DataService } from '../service/data.service';
import { SetAppointmentPage } from '../set-appointment/set-appointment.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userId: any;
  userRole: any;

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');

    this.checkRole();
  }

  checkRole = async () => {
    console.log("ROLE: ",this.userRole, " ID: ", this.userId);

    if(this.userRole == 0){
      this.userPullSaveProperty();
    }else if(this.userRole == 1){
    }
  };

  savePropertyData: any = [];
  userPullSaveProperty = async () => {
    await this.dataService.sendApiRequest('userPullSaveProperty', this.userId).subscribe((data: { payload: any; }) => {
      this.savePropertyData = data.payload;
    });
  }

  propertyToUnsave: any = {}
  userUnsaveProperty = async (id: any) => {
    this.propertyToUnsave.acc_id = this.userId;
    this.propertyToUnsave.save_status = 1;
    console.log(this.propertyToUnsave, id);
    await this.dataService.sendApiRequestForUpdate('userUnsaveProperty/', this.propertyToUnsave, id).subscribe((data: {remarks: any;}) => {
      this.userPullSaveProperty();
    });
  }

  @Input() appointment_prop_id: any; // For referencing as variable
  async setAppointmentModalTrigger(id: any) {
    const modal = await this.modalController.create({
      component: SetAppointmentPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'appointment_prop_id': id,
      }
    });
    return await modal.present();
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
}
