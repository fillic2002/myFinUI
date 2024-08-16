import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction,IDashboard,IFolio,IBankAcDetail, IShareDetail, IAssetHistory, IAssetReturn, ICashflow,IPfAcct, IDividend } from './ShareDetail';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import * as _ from 'lodash';
import { debug } from 'console';
import { BehaviorSubject } from 'rxjs';
import { DateTime } from '@syncfusion/ej2-angular-charts';

@Injectable({
    providedIn: 'root'
})
export class SharesService { 
   constructor(private client:HttpClient) { }
   private dataSource = new BehaviorSubject<string>('Initial data');
   currentData = this.dataSource.asObservable();
   
   changeData(data: string) {
    this.dataSource.next(data);
  }
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
  postTransaction(price:any,name:any,qty:any,dt:any,folioId: any,option:any,assetType:any,pb:any,mv:any, ver:any):Observable<any>{   
   
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
    MarketCap_Tran:parseFloat(mv),
    verified: ver === 0 ? false :ver
    });
  }  
  // Need to remove this with new method
  UpdateTransaction(tranid:string)
  {    
    return this.client.post("http://localhost:59921/transaction/verifyTransaction",{ 
    verified: true,   
    tranId:tranid  
    });
  }
  UpdateTransactionNew(pb:any, dt:string, astId: string,price:number, folioId:number,id:string,qty:number):Observable<boolean[]>{  
 
    return this.client.post<boolean[]>("http://localhost:59921/transaction/updateTransaction",{ 
      tranDate:new Date(Date.parse(dt)),   
      PB_Tran:parseFloat(pb),
      equity:{
        assetId: astId.toString()
      },
      qty: parseFloat(qty.toString()),
      portfolioId:folioId,
      price: parseFloat(price.toString()),
      tranId:id,
      verified:true 
    });
  }
  postBankTransaction(salary:any,desc:string,txtDt:any,trnType:any,acctid:any,id:any):Observable<boolean[]>{
   
    return this.client.post<boolean[]>("http://localhost:59921/transaction/AddBankTransaction",{
      tranDate: new Date(Date.parse(txtDt)),
      amt:parseFloat(salary),
      folioId:parseInt(id),
       tranType:trnType,
       Description:desc,
       AcctId:parseInt(acctid)
    })  
  }
  postPFTransaction(txtDt:any,empInvst:string,folioId:any,actType:any,pension:any,emplrInvst:any,trnType:any):Observable<boolean[]>{
    // console.log(id);
     return this.client.post<boolean[]>("http://localhost:59921/transaction/AddPFTransaction",{
       DateOfTransaction: new Date(Date.parse(txtDt)),
       InvestmentEmp:parseFloat(empInvst),
       Folioid:parseInt(folioId),
       TypeOfTransaction:parseInt(trnType),
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
  addEquity(shareDtl: any)
  {
    return this.client.post("http://localhost:59921/Shares/addEquity",{
      assetId:shareDtl.assetId,
      symbol:shareDtl.symbol,
      equityName:shareDtl.equityName,
      livePrice:shareDtl.livePrice,
      sourceurl:shareDtl.sourceurl,
      divUrl:shareDtl.divUrl, 
      sector:shareDtl.sector,
      analysisurl:shareDtl.analysisurl,
      assetType:shareDtl.assetType
    }); 
  }
  postEquityUpdate(shareDtl: any)
  {
 
    return this.client.post("http://localhost:59921/Shares/updateequity",{
      assetId:shareDtl.assetId,
      symbol:shareDtl.symbol,
      equityName:shareDtl.equityName,
      livePrice:shareDtl.livePrice,
      sourceurl:shareDtl.sourceurl,
      divUrl:shareDtl.divUrl, 
      sector:shareDtl.sector,
      analysisurl:shareDtl.analysisurl
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
 deleteTransaction(tranId:string):Observable<any>{   
  return this.client.post("http://localhost:59921/transaction/deletetransction",{    
    price:0,    
    qty:0,    
    tranType: 1,
    portfolioId:1,
    typeAsset:1,
    tranId:tranId
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
 
 getBondTransaction(folioID:number)
 { return this.client.get("http://localhost:59921/Bonds/GetBondTrasaction/"+folioID); }
 getBondHoldings(folioID:number,my:string)
 { return this.client.get("http://localhost:59921/Bonds/GetBondHolding/"+folioID); }
 searchBond(bondObj:any)
 { 
  return this.client.post("http://localhost:59921/Bonds/SearchBond/",
    {
      BondName: bondObj.bondDetail.bondName,
      BondId: bondObj.bondDetail.bondId
    }); 
 }
 updateBondDetails(bondObj:any)
  //bondId:string,bondName:string,coupon:number,DOM:string,intrestPayCycle:string,fv:number,CP:number)
 { 
  return this.client.post("http://localhost:59921/Bonds/UpdateBondDetails/",
  {
		couponRate:bondObj.couponRate,
    BondName:bondObj.bondName,
		BondId:bondObj.bondId,	
		dateOfMaturity:bondObj.dateOfMaturity,	
		LivePrice: bondObj.livePrice,
		faceValue:bondObj.faceValue,	
		intrestCycle:bondObj.intrestCycle,	
 }); 
}
updateBondPaymentDetails(item:any, validated:boolean)
 { 
  return this.client.post("http://localhost:59921/Bonds/UpdateBondIntrestPaymentDetails/",
  {
		intrestAmt:item.intrestAmt,
    intrestPaymentDate:item.intrestPaymentDate,
		BondDetail:{
      bondId:item.bondDetail.bondId
    },			
		folioId:item.folioId,
		validated:validated	,
    bondTranId: item.bondTranId,
    bondIntrstTranInd: item.bondIntrstTranInd
 }); 
}
updateMonthlyExpense(exp:any){ 
 
  return this.client.post("http://localhost:59921/portfolio/AddExpense/",
  {
    expId:parseInt(exp.expId),
		folioId:parseInt(exp.folioId),
		dtOfTran: new Date(exp.dtOfTran),
		amt:parseInt(exp.amt),
		desc:exp.desc,		
    expenseType:  parseInt(exp.expenseType)       
  }); 
}


 getMonthlyInvstment(folioID:number,pastmonth:number)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyInvestment/"+folioID+"/"+pastmonth); }
 
 getMonthlyExpenseHistory(folioID:number,m:number)
 { return this.client.get("http://localhost:59921/portfolio/GetMonthlyfolioExpenseHistory/"+folioID+"/"+m); }
 
 getExpenseType()
 {return this.client.get("http://localhost:59921/portfolio/GetExpenseType/");}
 
 getAnalysiss()
 {return this.client.get("http://localhost:59921/Analysis/getAnalysis/");}

 getAnalysis(eqtId: string)
 {return this.client.get("http://localhost:59921/Analysis/getAnalysis/"+eqtId);}

 AddAlertType(alrtType:string)
 {
   return this.client.post("http://localhost:59921/Alert/addalert/",
   {
    AlertName: alrtType
   });
  }
  UpdateAnalysis(id:number, notes:string,astId: string)
  {
    return this.client.post("http://localhost:59921/Analysis/Updateanalysis/",
    {
      equity: {
        assetId:  astId
      },        
      notes: [
        {
          analysisID: id,
          content: notes          
      }]
    });
  }
  AddAnalysis(dt:Date, year:number,notes:string,selectedReportType:number, astId: string)
  {
    return this.client.post("http://localhost:59921/Analysis/addanalysis/",
    {
      equity: {
        assetId:  astId
      },      
      revwType:1,  
      yr:parseInt(year),
      notes: [{
        content: notes,
        dtUpdated: new Date(dt) 
      }]
    });
  }
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
    return this.client.post("http://localhost:59921/transaction/UploadTransactionFile/"+file+"/"+folioID);
  }
}
