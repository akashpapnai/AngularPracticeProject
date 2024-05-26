import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { ConstantsService } from './constants.service';
import { OpdComponent } from './opd/opd.component';
import { IpdComponent } from './ipd/ipd.component';
import { HrandpayrollComponent } from './hrandpayroll/hrandpayroll.component';
import { BloodbankComponent } from './bloodbank/bloodbank.component';
import { PatientRegistrationComponent } from './links/opd/patient-registration/patient-registration.component';
import { OpdmanagementComponent } from './links/opd/opdmanagement/opdmanagement.component';
import { PatientsRegisteredReportComponent } from './links/opd/patients-registered-report/patients-registered-report.component';
import { PrintComponent } from './shared/print/print.component';

export const routes: Routes = [
    { path:'',component: HomePageComponent,pathMatch:'full' },
    { path:'login', component: LoginComponent },
    { path:'homePage',component: HomePageComponent },
    { path:'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path:'opd', component: OpdComponent, canActivate: [AuthGuard] },
    { path:'ipd',component:IpdComponent, canActivate:[AuthGuard] },
    { path:'hrandpayroll',component:HrandpayrollComponent,canActivate:[AuthGuard] },
    { path:'bloodbank',component:BloodbankComponent,canActivate:[AuthGuard] },
    { path:'opd/patientregistration', component: PatientRegistrationComponent, canActivate:[AuthGuard] },
    { path:'opd/opdmanagement', component: OpdmanagementComponent, canActivate:[AuthGuard] },
    { path:'opd/patientregistrationreport', component: PatientsRegisteredReportComponent, canActivate:[AuthGuard] },
    { path:'print', component: PrintComponent, canActivate: [AuthGuard] }
];
