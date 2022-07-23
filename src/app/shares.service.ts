import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction,IDashboard,IFolio,IBankAcDetail, IShareDetail, IAssetHistory, IAssetReturn, ICashflow,IPfAcct, IDividend } from './ShareDetail';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class SharesService {
   constructor(private client:HttpClient) { }

  getPortfolio(id:number):Observable<IPortfolio[]>{
    return this.client.get<IPortfolio[]>("http://localhost:59921/portfolio/Getfolio/"+id)  
  }
  getSectorPortfolio(id:number):Observable<any[]>{
    return this.client.get<any[]>("http://localhost:59921/portfolio/SectorWiseAssetDistribution/"+id)  
  }
  getAllfolio():Observable<IFolio[]>{
    return this.client.get<IFolio[]>("http://localhost:59921/portfolio/GetAllfolio")  
  }
  getTransaction(id:Number):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/getfolio/"+id)  
  } 
  getEqtTransaction(folioid:Number,eqtId:string):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/tran/"+folioid+"/"+eqtId)  
  }
  getYrlyEqtInvestment(folioid:Number,eqtId:string):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/getYrlyEqtInvst/"+folioid+"/"+eqtId)  
  }
  getEqtMonthlyTransaction(folioid:Number,month:number,year:number,astType:string):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/tran/"+folioid+"/"+month+"/"+year+"/"+astType)  
  }
  getYearlyInvestment(flag:string):Observable<IAssetHistory[]>{
    return this.client.get<IAssetHistory[]>("http://localhost:59921/transaction/getInvestment/"+flag)  
  }
  getCashFlow({ folioId, pastmonth }: { folioId: number; pastmonth: number; }):Observable<ICashflow[]>{    
    return this.client.get<ICashflow[]>("http://localhost:59921/portfolio/GetCashFlowStatment/"+folioId+"/"+pastmonth)  
  }
  getCashFlowOut( folioId: number, pastmonth: number):Observable<ICashflow[]>{    
    return this.client.get<ICashflow[]>("http://localhost:59921/portfolio/GetCashFlowOutStatment/"+folioId+"/"+pastmonth)  
  }
  getAssetHistory(folioId:number,isShare:number):Observable<IAssetHistory[]>{    
    return this.client.get<IAssetHistory[]>("http://localhost:59921/portfolio/getAssetHistory/"+folioId+"/"+isShare);
  }
  getAssetReturn(folioId:number,isShare:number):Observable<IAssetReturn[]>{    
    return this.client.get<IAssetReturn[]>("http://localhost:59921/portfolio/getAssetsReturn/"+folioId+"/"+isShare);
  }
  getAssetsReturn(assetId:number):Observable<IAssetReturn[]>{    
    return this.client.get<IAssetReturn[]>("http://localhost:59921/portfolio/getAssetsReturn/"+assetId);
  }
  getAssetsHistory(folioId:number):Observable<IAssetHistory[]>{    
    return this.client.get<IAssetHistory[]>("http://localhost:59921/portfolio/getAssetsHistory/");
  }
  postTransaction(price:any,name:any,qty:any,dt:any,folioId: number,option:any,assetType:any,pb:any,mv:any):Observable<any>{   
    return this.client.post("http://localhost:59921/transaction/updatefolio",{ 
    price: parseFloat(price.value),
    equityId:name.value,
    qty:parseFloat(qty), 
    tranDate:new Date(Date.parse(dt.value)),
    tranType: option,
    portfolioId:parseInt(folioId),
    assetType:parseInt(assetType),
    PB:parseFloat(pb.value),
    MarketCap:parseFloat(mv.value),
     });
  }
  postBankTransaction(salary:any,desc:string,txtDt:any,trnType:any,acctid:any,id:any):Observable<boolean[]>{
    console.log(id);
    return this.client.post<boolean[]>("http://localhost:59921/transaction/AddBankTransaction",{
      tranDate: new Date(Date.parse(txtDt)),
      amt:parseFloat(salary),
      folioId:parseInt(id),
       tranType:trnType,
       Description:desc,
       AcctId:parseInt(acctid)
    })  
  }
 
  postAcTransaction(userid:any,Id:any,roi:any,amt:any,dt:any):Observable<any>{
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
  postEquityUpdate(shareDtl: IShareDetail)
  {
    return this.client.post("http://localhost:59921/Shares/updateequity",{
    id:shareDtl.id,
    shortName:shareDtl.shortName,
    fullName:shareDtl.fullName,
    livePrice:shareDtl.livePrice,
    desc:shareDtl.desc,
    divlink:shareDtl.divLink, 
    sector:shareDtl.sector
    }); 
  }

  getDashBoard():Observable<IDashboard[]>{
    return this.client.get<IDashboard[]>("http://localhost:59921/dashboard/getDashboard")  
  }
  getMonthDashBoard(m:number,y:number):Observable<IDashboard[]>{
    return this.client.get<IDashboard[]>("http://localhost:59921/dashboard/getDashboard/"+m+"/"+y);  
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
 getDividend(name:string):Observable<IDividend[]>{
  return this.client.get<IDividend[]>("http://localhost:59921/Shares/getdividend/"+name)  
 }
 getMonthlyPFDetails(folioid:any,acttype:any,year:number):Observable<IPfAcct[]>{
  return this.client.get<IPfAcct[]>("http://localhost:59921/bankasset/GetMonthlyPFDetails/"+folioid+"/"+acttype+"/"+year)  
 }
 getPFAcDetails(folioid:string,acttype:any):Observable<IPfAcct[]>{
  return this.client.get<IPfAcct[]>("http://localhost:59921/bankasset/GetPfYearlyDetails/"+folioid+"/"+acttype)    
 }
 deleteTransaction(id:string,dt:Date):Observable<any>{   
  return this.client.post("http://localhost:59921/transaction/deletetransction",{    
    equityId:id,    
    tranDate: dt,
    price:0,    
    qty:0,    
    tranType: 'B',
    portfolioId:1,
    typeAsset:1
  });
 }
 deleteExpense(id:number) :Observable<any>{   
  return this.client.post("http://localhost:59921/portfolio/DeleteExpense",{    
    expId:id  
  });
}
 AddFolioComment(id:number,cmt:string):Observable<any>{
  return this.client.post("http://localhost:59921/portfolio/AddComment",{
    folioID:parseInt(id),
    comment:cmt
  });
 }
 GetFolioComment(id:number):Observable<any>{
  return this.client.get("http://localhost:59921/portfolio/GetfolioComment/"+id);
 }

 getExpense(folioID:number)
 { return this.client.get("http://localhost:59921/portfolio/GetfolioExpense/"+folioID); }

 getMonthlyExpense(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyfolioExpense/"+folioID+"/"+my); }
 
 getMonthlyInvstment(folioID:number,pastmonth:number)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyInvestment/"+folioID+"/"+pastmonth); }
 
 getMonthlyExpenseHistory(folioID:number,m:number)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyfolioExpenseHistory/"+folioID+"/"+m); }
 
 getExpenseType()
 {return this.client.get("http://localhost:59921/portfolio/GetExpenseType/");}

 AddExpenseType(expType:string)
 {
   return this.client.post("http://localhost:59921/portfolio/AddExpenseType/",
   {
    expTypeDesc: expType
   });
  }
 AddExpense(expdesc:string,portfolioId:any,amount:any,dt:Date, expType:any)
 {
   return this.client.post("http://localhost:59921/portfolio/AddExpense/",
   {
    desc: expdesc,
    folioId:parseInt(portfolioId),
    dtOfTran:new Date( dt),
    amt: parseInt(amount),
    expenseType:{
      expTypeId:parseInt(expType)   
    }
   });
  }
}
