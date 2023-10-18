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
  getAssetClass(folioId:Number):Observable<any[]>{
    return this.client.get<any[]>("http://localhost:59921/portfolio/GetAssetAllocationBySize/"+folioId)  
  }
  getAllfolio():Observable<IFolio[]>{
    return this.client.get<IFolio[]>("http://localhost:59921/portfolio/GetAllfolio")  
  }
  getTransaction(id:Number):Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction/getAllTransaction/"+id)  
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
  getYearlyInvestment(folioId:Number,flag:string):Observable<IAssetHistory[]>{
    return this.client.get<IAssetHistory[]>("http://localhost:59921/transaction/getInvestment/"+flag+"/"+folioId)  
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
  postTransaction(price:any,name:any,qty:any,dt:any,folioId: any,option:any,assetType:any,pb:any,mv:any):Observable<any>{   
   
    return this.client.post("http://localhost:59921/transaction/postTransaction",{ 
    price: parseFloat(price),
    equity:{
      assetId: String(name),
      assetType:parseInt(assetType),
    },  
    qty:parseFloat(qty), 
    tranDate:new Date(Date.parse(dt)),
    tranType: parseInt(option),
    portfolioId:parseInt(folioId),
    PB_tran:parseFloat(pb),
    MarketCap_Tran:parseFloat(mv)   
    });
  }  
  UpdateTransaction(tranid:string)
  {    
    return this.client.post("http://localhost:59921/transaction/verifyTransaction",{ 
    verified: true,   
    tranId:tranid  
    });
  }
  postBankTransaction(salary:any,desc:string,txtDt:any,trnType:any,acctid:any,id:any):Observable<boolean[]>{
   // console.log(id);
    return this.client.post<boolean[]>("http://localhost:59921/transaction/AddBankTransaction",{
      tranDate: new Date(Date.parse(txtDt)),
      amt:parseFloat(salary),
      folioId:parseInt(id),
       tranType:trnType,
       Description:desc,
       AcctId:parseInt(acctid)
    })  
  }
  postPFTransaction(txtDt:any,empInvst:string,folioId:any,trnType:any,pension:any,emplrInvst:any,actType:any):Observable<boolean[]>{
    // console.log(id);
     return this.client.post<boolean[]>("http://localhost:59921/transaction/AddPFTransaction",{
       DateOfTransaction: new Date(Date.parse(txtDt)),
       InvestmentEmp:parseFloat(empInvst),
       Folioid:parseInt(folioId),
       TypeOfTransaction:trnType,
       Pension:parseInt(pension),
       AccountType:parseInt(actType),
       InvestmentEmplr:parseInt(emplrInvst)
     })  
   }
  deleteBondTransaction(bondId:any,id:string,txtDt:Date):Observable<boolean[]>{
    // console.log(id);
     return this.client.post<boolean[]>("http://localhost:59921/Bonds/DeleteBondTransaction",{
      purchaseDate:txtDt,       
       folioId:parseInt(id),       
        BondDetail:{
          BondId:bondId
        }
     });  
   }
  postBondDetails(bondName:string,bondID:string,coupon:string,facevalue:string,minInvst:string,dom:string)
  {
    return this.client.post<boolean[]>("http://localhost:59921/Bonds/AddBond",{
      dateOfMaturity: new Date(Date.parse(dom)),
      minInvst:parseFloat(minInvst),
      BondId:bondID,
      BondName:bondName,
      facevalue:parseFloat(facevalue),
      couponRate:parseFloat(coupon)
    })  
  }  
  postPropertyTransaction(salary:any,txtDt:any,trnType:any,asstType:any,folioId:any):Observable<boolean[]>{
    return this.client.post<boolean[]>("http://localhost:59921/transaction/postTransaction",{
      tranDate: new Date(Date.parse(txtDt)),
      price:parseFloat(salary),
      portfolioId:parseInt(folioId),
      tranType:trnType,       
      assetTypeId:parseInt(asstType)
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
    return this.client.get<IBankAcDetail[]>("http://localhost:59921/bankasset/GetBankAcDetails")  
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
 getCompDividend(year:string):Observable<IDividend[]>{
  return this.client.get<IDividend[]>("http://localhost:59921/Shares/getYearlyCompDividend/"+year)  
 }
 
 getBondIntrest(year:string):Observable<any[]>{
  return this.client.get<any[]>("http://localhost:59921/Bonds/getBondIntrest/"+year)  
 }
 getMonthlyBondIntrest(year:string):Observable<any[]>{
  return this.client.get<any[]>("http://localhost:59921/Bonds/getMonthlyBondIntrest/"+year)  
 }
 getYearlyBondIntrest():Observable<any[]>{ 
  return this.client.get<any[]>("http://localhost:59921/Bonds/getYearlyBondIntrest")  
 }
 getMonthlyPFDetails(folioid:any,acttype:any,year:number):Observable<IPfAcct[]>{
  return this.client.get<IPfAcct[]>("http://localhost:59921/bankasset/GetMonthlyPFDetails/"+folioid+"/"+acttype+"/"+year)  
 }
 getPFAcDetails(folioid:string,acttype:any):Observable<IPfAcct[]>{
  return this.client.get<IPfAcct[]>("http://localhost:59921/bankasset/GetPfYearlyDetails/"+folioid+"/"+acttype)    
 }
 deleteTransaction(id:string,dt:Date):Observable<any>{   
  return this.client.post("http://localhost:59921/transaction/deletetransction",{    
    equity:
    {
      assetId:id
    },
    tranDate: dt,
    price:0,    
    qty:0,    
    tranType: 1,
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
 GetXirrReturn(folioId:number,assetId:number):Observable<any>{
  return this.client.get("http://localhost:59921/portfolio/getNetAssetsReturn/"+folioId+"/"+assetId);
 }

 getExpense(folioID:number)
 { return this.client.get("http://localhost:59921/portfolio/GetfolioExpense/"+folioID);}

 getMonthlyExpense(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyfolioExpense/"+folioID+"/"+my); }
 
 getBondDetails(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/Bonds/GetBondsDetails"); }
 
 getBondTransaction(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/Bonds/GetBondTrasaction/"+folioID); }
 getBondHoldings(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/Bonds/GetBondHolding/"+folioID); }
 searchBond(searchString:string)
 { 
  return this.client.post("http://localhost:59921/Bonds/SearchBond/",
    {
      BondName:searchString
    }); 
  }
 updateBondDetails(bondId:string,bondName:string,coupon:number,DOM:string,intrestPayCycle:string,fv:number,CP:number)
 { 
  return this.client.post("http://localhost:59921/Bonds/UpdateBondDetails/",
  {
   
		couponRate:coupon,
    BondName:bondName,
		BondId:bondId,
		 //minInvst:,
		dateOfMaturity:DOM,
		 //firstIPDate:,
		LivePrice:CP,
		 //YTM :,
		faceValue:fv,
		 //BondLink:,
		intrestCycle:intrestPayCycle,
		 //rating:,
		 //symbol :,  
 }); 
}


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
  fileUpload(file:any,folioID:number)
  {
    return this.client.post("http://localhost:59921/UploadTransactionFile/",
    {
      data:file,
      folioID: folioID
    });
  }
}
