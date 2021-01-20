import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction,IDashboard,IFolio,IBankAcDetail, IShareDetail } from './ShareDetail';

@Injectable({
  providedIn: 'root'
})
export class SharesService {
   constructor(private client:HttpClient) { }

  getPortfolio(id:number):Observable<IPortfolio[]>{    
    return this.client.get<IPortfolio[]>("http://localhost:59921/portfolio/Getfolio/"+id)  
  }
  getAllfolio():Observable<IFolio[]>{
    return this.client.get<IFolio[]>("http://localhost:59921/portfolio/GetAllfolio")  
  }
  getTransaction():Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction")  
  }

  postTransaction(price:any,name:any,qty:any,dt:any,folioId: any):Observable<any>{
    //var trandata =new ITransaction();
    console.log(folioId);
    return this.client.post("http://localhost:59921/transaction",{ 
    price: parseFloat( price.value),
    equityId:name.value,
    qty:parseFloat(qty.value),
    tranDate:new Date(Date.parse(dt.value)),
    tranType:"B",
    portfolioId:parseFloat(folioId)
    })  
  }
  postAcTransaction(userid:any,Id:any,roi:any,amt:any,dt:any):Observable<any>{
    //var trandata =new ITransaction();
    console.log(dt.value);
    return this.client.post("http://localhost:59921/BankAsset/SaveAcctStatus",{ 
      userid:parseInt(userid.value),
      acctId: parseFloat( Id.value),
      amt:parseFloat(amt.value),
      roi:parseFloat(roi.value),
      transactionDate:new Date(Date.parse(dt.value))
      
    })  
  }

  getDashBoard():Observable<IDashboard[]>{
    return this.client.get<IDashboard[]>("http://localhost:59921/dashboard")  
  }

  getBankAcTotal():Observable<IBankAcDetail[]>{
    return this.client.get<IBankAcDetail[]>("http://localhost:59921/bankasset/GetTotalAmt")  
  }

  getBankAcDetails():Observable<IBankAcDetail[]>{
    return this.client.get<IBankAcDetail[]>("http://localhost:59921/bankasset/GetDetailedAmt")  
  }
 getlivePrice():Observable<IShareDetail[]>{
    return this.client.get<IShareDetail[]>("http://localhost:59921/Shares/GetLivePrice")  
 }
}
