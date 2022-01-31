import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../service/data.service';
import { ModalController } from '@ionic/angular';
import { AddPropertyPage } from '../add-property/add-property.page';
import { EditPropertyPage } from '../edit-property/edit-property.page';
import { SetAppointmentPage } from '../set-appointment/set-appointment.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { async, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userId: any;
  userRole: any;

  messages: any;
  private subs!: Subscription;

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) {
    this.subs = this.dataService.getUpdate().subscribe(mess => {
      this.messages = mess; this.ionViewWillEnter();
    });
  };

  ionViewWillEnter() {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');

    this.checkRole();
  };
    
  userData: any;
  checkRole = async () => {
    console.log("ROLE: ",this.userRole, " ID: ", this.userId);

    if(this.userRole == 0){
      this.userPullProperties();
    }else if(this.userRole == 1){
      this.sellerPullProperties();
    }else if(this.userRole == 2){
      this.getApplicationTotalUsers();
      this.getApplicationTotalSellers();
      this.getApplicationTotalSolds();
      this.getApplicationTotalRented();
      this.getApplicationTotalSoldSales();
    }
  };

  accountLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async ionViewWillLeave() { // This is for stop pulling data from subs.
    this.subs.unsubscribe();
  };

  async addPropertyModalTrigger() {
    const modal = await this.modalController.create({
      component: AddPropertyPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  };

  @Input() prop_id: any; // For referencing as variable
  async editPropertyModalTrigger(id: any) {
    const modal = await this.modalController.create({
      component: EditPropertyPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'prop_id': id,
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

  propertyData: any = [];
  sellerPullProperties = async() => {
    await this.dataService.sendApiRequest('sellerPullProperties', this.userId).subscribe((data: { payload: any; }) => {
      this.propertyData = data.payload;

      for (let i = 0; i < this.propertyData.length; i++){
        if(this.propertyData[i].prop_status == 0){
          this.propertyData[i].prop_status = "Pending to Post";
        }else if(this.propertyData[i].prop_status == 1){
          this.propertyData[i].prop_status = "Posted";
        }else{
          this.propertyData[i].prop_status = "Sold / Rented";
        }
      }
    });
  };

  propertyToPost: any = {};
  sellerPostProperty = async(id: any) => {
    this.propertyToPost.prop_id = id;
    this.propertyToPost.prop_status = 1;

    await this.dataService.sendApiRequestForUpdate('sellerPostProperty/', this.propertyToPost, id).subscribe((data: { payload: any; }) => {
      this.sellerPullProperties();
      window.alert('success!');
    });
  };

  propertyToSold: any = {};
  sellerSoldProperty = async(id: any) => {
    this.propertyToSold.prop_id = id;
    this.propertyToSold.prop_status = 2;

    await this.dataService.sendApiRequestForUpdate('sellerPostProperty/', this.propertyToSold, id).subscribe((data: { payload: any; }) => {
      this.sellerPullProperties();
      window.alert('success!');
    });
  };

  propertyToArchive: any = {};
  sellerArchiveProperty = async(id: any) => {
    this.propertyToArchive.prop_id = id;
    this.propertyToArchive.prop_status = 3;

    await this.dataService.sendApiRequestForUpdate('sellerPostProperty/', this.propertyToArchive, id).subscribe((data: { payload: any; }) => {
      this.sellerPullProperties();
      window.alert('success!');
    });
  };

  userPropertyData: any = [];
  userPullProperties = async() => {
    await this.dataService.sendApiRequest('userPullProperties', null).subscribe((data: { payload: any; }) => {
      this.userPropertyData = data.payload;
      // console.log(this.userPropertyData);
    });
  };

  searchInput: any;
  userSearchProperties = async() => {
    if(this.searchInput == "" || null){
      this.userPullProperties();
    }else{
      await this.dataService.sendApiRequest('userSearchProperties', this.searchInput).subscribe((data: { payload: any; }) => {
        this.userPropertyData = data.payload;
      });
    }
  };

  userFilterProperties = async(value: any) => {
    if(value == ""){
      this.userPullProperties();
    }else{
      await this.dataService.sendApiRequest('userFilterProperties', value).subscribe((data: { payload: any; }) => {
        this.userPropertyData = data.payload;
      });
    }
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

  propertyToSave: any = {}
  userSaveProperty = async(id: any) => {
    this.propertyToSave.prop_id = id;
    this.propertyToSave.acc_id = this.userId;
    await this.dataService.sendApiRequest('userSaveProperty', this.propertyToSave).subscribe((data: { remarks: any; }) => {
      if(data.remarks == "success"){
        window.alert("Saved!");
      }else {
        window.alert("This property is already in your saves!");
      }
    });
  }

  totalUsers: any;
  getApplicationTotalUsers = async() => {
    await this.dataService.sendApiRequest('getApplicationTotalUsers', 0).subscribe((data: { payload: any; }) => {
      this.totalUsers = data.payload[0]["COUNT(acc_id)"];
    });
  }

  totalSellers: any;
  getApplicationTotalSellers = async() => {
    await this.dataService.sendApiRequest('getApplicationTotalUsers', 1).subscribe((data: { payload: any; }) => {
      this.totalSellers = data.payload[0]["COUNT(acc_id)"];
    });
  }

  totalSold: any;
  getApplicationTotalSolds = async() => {
    await this.dataService.sendApiRequest('getApplicationTotalProperties', 2).subscribe((data: { payload: any; }) => {
      this.totalSold = data.payload[0]["COUNT(prop_id)"];
    });
  }

  totalRented: any;
  getApplicationTotalRented = async() => {
    await this.dataService.sendApiRequest('getApplicationTotalProperties', 2).subscribe((data: { payload: any; }) => {
      this.totalRented = data.payload[0]["COUNT(prop_id)"];
    });
  }

  totalSoldSales: any;
  getApplicationTotalSoldSales = async() => {
    await this.dataService.sendApiRequest('getApplicationTotalSales', 2).subscribe((data: { payload: any; }) => {
      this.totalSoldSales = data.payload[0]["SUM(prop_price)"];
      if(this.totalSoldSales == null){
        this.totalSoldSales = 0;
      }
    });
  }
}
