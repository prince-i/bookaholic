import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPropertyPageRoutingModule } from './add-property-routing.module';

import { AddPropertyPage } from './add-property.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPropertyPageRoutingModule
  ],
  declarations: [AddPropertyPage]
})
export class AddPropertyPageModule {}
