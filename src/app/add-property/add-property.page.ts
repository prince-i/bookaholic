import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.page.html',
  styleUrls: ['./add-property.page.scss'],
})
export class AddPropertyPage implements OnInit {
  userId: any;

  type: any;
  forRent: any;
  name: any;
  desc: any;
  price: any;
  address: any;
  image: any;

  constructor(private dataService: DataService, private router: Router, private modalController: ModalController) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }

  ionViewWillEnter() {
    this.pullPropertyTypes();    
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }

  imgSrc: any = "https://i.ibb.co/xsQb7JJ/default-image-620x600.jpg";
  onUploadHandler(file: any) {
    this.imgSrc = file.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgSrc = event.target.result;
    }
    reader.readAsDataURL(this.imgSrc);
  }

  propertyInfo: any = {};
  sellerAddProperty = async() => {
    this.propertyInfo.acc_id = this.userId;
    this.propertyInfo.type_id = this.type;
    this.propertyInfo.prop_isForRent = this.forRent;
    this.propertyInfo.prop_name = this.name;
    this.propertyInfo.prop_description = this.desc;
    this.propertyInfo.prop_price = this.price;
    this.propertyInfo.prop_address = this.address;
    this.propertyInfo.prop_image = this.imgSrc;

    await this.dataService.sendApiRequest('sellerAddProperty', this.propertyInfo).subscribe((data: { remarks: any; }) => {
      if(data.remarks == "success"){
        window.alert("Success adding!");
        this.realtimePulling(); // For pulling data if the component is from another e.g. Modals
        this.dismissModal();
      }else{
        window.alert("There is problem in adding!");
      }
    });
  }

  propertyTypesData: any = [];
  pullPropertyTypes = async() => {
    await this.dataService.sendApiRequest('sellerPullPropertyTypes', null).subscribe((data: { payload: any; }) => {
      this.propertyTypesData = data.payload;
      console.log(this.propertyTypesData);
    });
  }

  realtimePulling = () => {
    this.dataService.sendUpdate('Message from Sender Component to Receiver Component!');
  }
}
