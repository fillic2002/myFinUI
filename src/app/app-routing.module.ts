import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionComponent } from './option/option.component';

import { SharesdetailComponent } from './sharesdetail/sharesdetail.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BankdetailComponent } from './bankdetail/bankdetail.component';

const routes: Routes = [
  {path:'', component:OptionComponent},
  {path:'shares',component:SharesdetailComponent},
  {path:'portfolio',component:PortfolioComponent},
  {path:'transaction',component:TransactionComponent},
  {path:'dashboard',component:DashboardComponent},  
  {path:'bankdetail',component:BankdetailComponent},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComp =[SharesdetailComponent,OptionComponent] 