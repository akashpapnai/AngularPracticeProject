import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
    { path:'',component: HomePageComponent,pathMatch:'full' },
    { path:'login', component: LoginComponent },
    { path:'homePage',component: HomePageComponent }
];
