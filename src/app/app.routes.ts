import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { PatientRegistrationComponent } from './links/opd/transaction/patient-registration/patient-registration.component';
import { OpdmanagementComponent } from './links/opd/transaction/opdmanagement/opdmanagement.component';
import { PatientsRegisteredReportComponent } from './links/opd/reports/patients-registered-report/patients-registered-report.component';
import { PrintComponent } from './shared/print/print.component';
import { ModuleComponent } from './module/module.component';
import { CompanyMasterComponent } from './links/admin/master/company-master/company-master.component';

export const routes: Routes = [
    { path:'',component: HomePageComponent,pathMatch:'full' },
    { path:'login', component: LoginComponent },
    { path:'homePage',component: HomePageComponent },
    { path:'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path:'opd', component: ModuleComponent, canActivate: [AuthGuard] },
    { path:'ipd',component: ModuleComponent, canActivate:[AuthGuard] },
    { path:'hrandpayroll',component: ModuleComponent,canActivate:[AuthGuard] },
    { path:'bloodbank',component: ModuleComponent,canActivate:[AuthGuard] },
    { path:'admin',component: ModuleComponent,canActivate:[AuthGuard] },
    { path:'opd/patientregistration', component: PatientRegistrationComponent, canActivate:[AuthGuard] },
    { path:'opd/opdmanagement', component: OpdmanagementComponent, canActivate:[AuthGuard] },
    { path:'opd/opdmanagement/:id', component: OpdmanagementComponent, canActivate:[AuthGuard] },
    { path:'opd/patientregistrationreport', component: PatientsRegisteredReportComponent, canActivate:[AuthGuard] },
    { path:'admin/companymaster', component: CompanyMasterComponent, canActivate:[AuthGuard] },
    { path:'print', component: PrintComponent, canActivate: [AuthGuard] }
];
