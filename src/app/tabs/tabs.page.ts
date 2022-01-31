import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userId: any;
  userRole: any;

  constructor() {}

  ionViewWillEnter() {
    this.userId = localStorage.getItem('userId');
    this.userRole = localStorage.getItem('userRole');

    this.checkRole();
  }

  checkRole = async () => {
    console.log("ROLE: ",this.userRole, " ID: ", this.userId);
  };

}
