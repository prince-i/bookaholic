import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.page.html',
  styleUrls: ['./edit-property.page.scss'],
})

export class EditPropertyPage implements OnInit {
  prop_id: any;
  userId: any;

  type: any;
  forRent: any;
  name: any;
  desc: any;
  price: any;
  address: any;
  image: any;

  constructor(private dataService: DataService, private router: Router,
  private modalController: ModalController, public navParams: NavParams) {
    this.navParams.get('prop_id');
   }

  ngOnInit() {}

  ionViewWillEnter(){
    this.userId = localStorage.getItem('userId');
    
    this.pullPropertyTypes();    
    this.sellerPullLastPropertyValues();
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  propertyTypesData: any = [];
  pullPropertyTypes = async() => {
    await this.dataService.sendApiRequest('sellerPullPropertyTypes', null).subscribe((data: { payload: any; }) => {
      this.propertyTypesData = data.payload;
      console.log(this.propertyTypesData);
    });
  }

  lastPropertyValue: any = [];
  lastValueLoaded: boolean = false;
  imgSrc: any = "https://i.ibb.co/xsQb7JJ/default-image-620x600.jpg";
  sellerPullLastPropertyValues = async() => {
    this.lastValueLoaded = false;
    await this.dataService.sendApiRequest('sellerPullLastPropertyValues', this.prop_id).subscribe((data: { payload: any; }) => {
      this.lastPropertyValue = data.payload;
      this.lastValueLoaded = true;

      // Populate fields
      this.name = this.lastPropertyValue[0].prop_name;
      this.desc = this.lastPropertyValue[0].prop_description;
      this.price = this.lastPropertyValue[0].prop_price;
      this.address = this.lastPropertyValue[0].prop_address;
      this.imgSrc = this.lastPropertyValue[0].prop_image;
    });
  }

  onUploadHandler(file: any) {
    this.imgSrc = file.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgSrc = event.target.result;
    }
    reader.readAsDataURL(this.imgSrc);
  }

  propertyInfo: any = {};
  sellerEditProperty = async() => {
    this.propertyInfo.acc_id = this.userId;
    this.propertyInfo.type_id = this.type;
    this.propertyInfo.prop_isForRent = this.forRent;
    this.propertyInfo.prop_name = this.name;
    this.propertyInfo.prop_description = this.desc;
    this.propertyInfo.prop_price = this.price;
    this.propertyInfo.prop_address = this.address;
    this.propertyInfo.prop_image = this.imgSrc;

    await this.dataService.sendApiRequestForUpdate('sellerEditProperty/', this.propertyInfo, this.prop_id).subscribe((data: { remarks: any; }) => {
        window.alert("Success editing!");
        this.realtimePulling(); // For pulling data if the component is from another e.g. Modals
        this.dismissModal();
    });
  }

  realtimePulling = () => {
    this.dataService.sendUpdate('Message from Sender Component to Receiver Component!');
  }

}
