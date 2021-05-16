import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction,IDashboard,IFolio,IBankAcDetail, IShareDetail, IAssetHistory } from './ShareDetail';

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
  getTransaction(id:Number):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/getfolio/"+id)  
  }
  getfolioAssetHistory(folioId:number):Observable<IAssetHistory[]>{    
    return this.client.get<IAssetHistory[]>("http://localhost:59921/portfolio/GetFolioSnapshot/"+folioId)  
  }
  postTransaction(price:any,name:any,qty:any,dt:any,folioId: any,option:any,assetType:any):Observable<any>{   
    return this.client.post("http://localhost:59921/transaction/updatefolio",{ 
    price: parseFloat(price.value),
    equityId:name.value,
    qty:parseFloat(qty),
    tranDate:new Date(Date.parse(dt.value)),
    tranType: option,
    portfolioId:parseInt(folioId),
    typeAsset:parseInt(assetType)
     })
  }
  postAcTransaction(userid:any,Id:any,roi:any,amt:any,dt:any):Observable<any>{
    //console.log("AMT::"+parseFloat(amt));
    
    if(dt == null)
    {     
      dt= new Date();
    }
    //console.log("Date:"+Date.parse(dt));
    return this.client.post("http://localhost:59921/BankAsset/SaveAcctStatus",{ 
      userid:parseInt(userid),
      acctId: parseFloat(Id),
      amt:parseFloat(amt),
      roi:parseFloat(roi),
      transactionDate:new Date(Date.parse(dt))      
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
 getShare(name:string):Observable<IShareDetail[]>{
  return this.client.get<IShareDetail[]>("http://localhost:59921/Shares/search/"+name)  
 }
 deleteTransaction(id:string,dt:Date):Observable<any>{
   console.log(new Date(dt));
  return this.client.post("http://localhost:59921/transaction/deletetransction",{    
    equityId:id,    
    tranDate: dt,
    price:0,    
    qty:0,    
    tranType: 'B',
    portfolioId:1,
    typeAsset:1
  })
 }
}
