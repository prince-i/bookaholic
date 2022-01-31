import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPropertyPage } from './edit-property.page';

const routes: Routes = [
  {
    path: '',
    component: EditPropertyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPropertyPageRoutingModule {}
