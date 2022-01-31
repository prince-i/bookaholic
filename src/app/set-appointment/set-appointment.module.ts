import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetAppointmentPageRoutingModule } from './set-appointment-routing.module';

import { SetAppointmentPage } from './set-appointment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetAppointmentPageRoutingModule
  ],
  declarations: [SetAppointmentPage]
})
export class SetAppointmentPageModule {}
