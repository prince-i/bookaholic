import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'add-property',
    loadChildren: () => import('./add-property/add-property.module').then( m => m.AddPropertyPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-property',
    loadChildren: () => import('./edit-property/edit-property.module').then( m => m.EditPropertyPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'set-appointment',
    loadChildren: () => import('./set-appointment/set-appointment.module').then( m => m.SetAppointmentPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'email-verify',
    loadChildren: () => import('./email-verify/email-verify.module').then( m => m.EmailVerifyPageModule)
  },  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
