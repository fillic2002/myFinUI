import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OptionComponent } from './option/option.component';
import { SharesdetailComponent } from './sharesdetail/sharesdetail.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BankdetailComponent } from './bankdetail/bankdetail.component';
import { TaxcompuComponent } from './taxcompu/taxcompu.component';
import { AdminComponent } from './admin/admin.component';
import { ExpenseComponent } from './expense/expense.component';
import { BondsComponent } from './bonds/bonds.component';
import { AlertComponent } from './alert/alert.component';

const routes: Routes = [
  {path:'', component:OptionComponent},
  {path:'shares',component:SharesdetailComponent},
  {path:'portfolio',component:PortfolioComponent},
  {path:'transaction',component:TransactionComponent},
  {path:'dashboard',component:DashboardComponent},  
  {path:'bankdetail',component:BankdetailComponent},
  {path:'tax',component:TaxcompuComponent},
  {path:'admin',component:AdminComponent},
  {path:'expense',component:ExpenseComponent},  
  {path:'bonds',component:BondsComponent},
  {path:'alert',component:AlertComponent},
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComp =[SharesdetailComponent,OptionComponent] 