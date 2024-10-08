import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { Console, debug } from 'console';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { DateTime } from '@syncfusion/ej2-angular-charts';

providers: [DatePipe]

export interface returnonasset{
  monthyear:Date;
  return:number;
  current:number;
  previous:number;
}
export interface returnonassets{
  year:number;
  return:number;
  dividend:number;
  xirr:number;
  netInvstmnt:number;
}
export interface compDivYear{
  liveprice:number;
  div:number;
  dt:Date;
  compId:number;
  compName:string
}
export interface divHistory{
  year:number;
  return:number;  
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'] 
})

export class PortfolioComponent implements OnInit {

  public portfolio =[] as any;
  
  public filterPortfolio =[] as any;
  public compDivDetails=[] as any;
  public yearlyDivDetails=[] as any;
  public bondIntrestDetails=[] as any;
  public eqtTransaction=[] as any;
  eqtQty=[] as number[];
  eqtTrandt=[] as Date[];
  divDt=[] as any[];
  divVal=[] as number[]
  
  public sharecount:number=0;
  public sdividend:number=0;
  public eqInvstVal:number=0;
  public eqCurrVal:number=0;
  public mfInvstVal:number=0;
  public share=[] as any;
  public pfcount:any;
  public mfCurrVal:number=0;  
  public mfPLPercent:number=0;
  public eqPLPercent:number=0;
  public eqXirrReturn:number=0;
  public mfCount:number=0;
  public sector=[] as string[];  
  public assetValue =[] as number[];
  public sectorInvstmt =[] as number[];
  public sectorDiv =[] as number[];
  public sectorProfit =[] as number[];
  
  public assetProfit =[] as number[];
  public dividendHistory=[] as number[];
  public assetValueHistory=[] as number[];
  public investmentHistory=[] as number[];
  public assetHistoryTime=[] as string[];
  public companyDividend=[] as divHistory[]; 
  assetReturns=[] as returnonassets[];
  retrunYear=[] as string[];
  //assetClass=[] as string[];
  assetClsInvest=[] as number[];
  
  public returnNet =[] as number[];
  public show:boolean = false;
  public showDiv:boolean = false;
  public showCmp:boolean = true;  
  public showGraph:boolean = true;
  public selectedMonth:number=0;
   
  
  isMF:boolean=false;
  isShare:boolean=true;
  direction:string="asc";
  dividendTotal:number=0;
  invstTotal:number=0;
  previousMonthAsset:number=0;
  previousMonthInvst:number=0;
  option:number=0;
  folioId:number=0;
  netReturn:number=0;
  pastYearReturn:number=0;
  shareName:string="";
  trnDt:Date=new Date();
  public buttonName:any = 'Show';
  public trnStatus:string='Add >'
  status:string=""; 
  comment:string="";
  isShown: boolean = true;
  selectedEqt:string="";
  selectedEqtID:string=""; 
  ownership:number=0;
  totalShare:number=0;
  folios=[] as any;
  assetClass=[] as any;
  public assetClassName=[] as string[];
  const assetClassInvstmnt=[];
  totalBondIntrest:number=0;
  public maxY :number=0;
  companyurl : string="";

  selectedfolio: number=0;
  selectedAssetClass:number=1;
 
  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router, public datepipe: DatePipe) {  }

  ngOnInit(): void {         
    this.GetFolioDetails();
    this.changeFolio('0');
    //this.GetAssetClass();
   
  }
  GetAssetClass()
  { 
    this.assetClassName.length=0;
    this.assetClassInvstmnt.length=0;
   
    this._portfolio.getAssetClass(this.selectedfolio)
    .subscribe(data=>{
      //console.log(data); 
      data.forEach(element => {        
        
        this.assetClassName.push(this.GetCategoryBySize(element.cmpSize));
        this.assetClassInvstmnt.push(element.percent.toFixed(2));
      });      
       
    });  
  }
  const GetCategoryBySize = (cmpSize:number): string => {
    if(cmpSize==0)
      return "small"; 
    else if(cmpSize==1) 
      return "medium";
    else if(cmpSize==2) 
      return "large";
    else if(cmpSize==3) 
      return "Enterprise";
    else 
      return "small";
  };
  const GetCategoryIDBySize = (category:string): number => {
    if(category=="small")
      return 0;
    else if(category=="medium") 
      return 1;
    else if(category=="large") 
      return 2;
    else if(category=="Enterprise") 
      return 3;
    else 
      return 0;
  };
  
  
   
  GetFolioDetails()
  {
    this._portfolio.getAllfolio()
      .subscribe(data=>{
        this.folios =data;       
      }); 
  }

  changeFolio(e :any){    
    this.GetAssetClass();
    this.returnNet.length=0
    this.retrunYear.length=0;
    this.showGraph =true;
    this.sector.length=0;
    if(typeof e!='string')
    {    
      this.folioId=e.target.value;  
    }    
    this.assetValue.splice(0,this.assetValue.length);  
    this.sectorfolio();
    
    this._portfolio.getPortfolio(this.folioId)
     .subscribe(data =>{ 
      //console.log(data);
      data.forEach(element => {
        //console.log(this.selectedAssetClass);
        if(element.equityType==this.selectedAssetClass)
        {
          element.profit= element.qty*(element.eq.livePrice - element.avgprice);
          element.percentage = element.xirr;
        } 
        
        if(element.eq.sector!="")
          {          
            this.assetValue[this.sector.indexOf(element.eq.sector)] += parseFloat((element.avgprice*element.qty).toFixed(2));
            this.assetProfit[this.sector.indexOf(element.eq.sector)] += parseFloat(((element.eq.livePrice-element.avgprice)*element.qty).toFixed(2));
            //console.log( this.assetProfit[this.sector.indexOf(element.sector)] );
          }
      });
    this.sector = this.sector.filter((e, i) => i == this.sector.indexOf(e)) 
     
    this.portfolio = data;
   
    this.sharecount =0;this.mfPLPercent=0;
    var eto:number;
    var mto:number;var mato:number;
    var eato:number;eto=0;eato=0;
    mto=0;mato=0;this.sdividend=0;
 
     for (var i = 0; i < this.portfolio.length; i++) {
       if(this.portfolio[i].equityType==this.selectedAssetClass)
       {
        eto= eto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty);        
        eato= eato + parseFloat(this.portfolio[i].eq.livePrice)*parseFloat(this.portfolio[i].qty);
        this.sharecount +=1; 
        this.sdividend+= this.portfolio[i].dividend;
       }
       else
       {
        mto= mto + parseFloat(this.portfolio[i].avgprice)*parseFloat(this.portfolio[i].qty); 
        mato= mato + parseFloat(this.portfolio[i].eq.livePrice)*parseFloat(this.portfolio[i].qty);
        this.mfCount +=1;
       } 
     }
     this.eqInvstVal=eto; 
     this.eqCurrVal = eato;
     //this.eqPLPercent = (eato-eto+this.sdividend)*100/eto; 
     this.mfInvstVal=mto;    
     this.mfCurrVal =mato; 
     this.mfPLPercent = (this.mfCurrVal-this.mfInvstVal)*100/this.mfInvstVal;
     this.barChartLabels=this.sector;     
     this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; }) => s.equityType==this.selectedAssetClass);
     console.log(this.filterPortfolio );
    });
  
    this.assetReturns.length=0;    
    if(this.isShare)
    {
      this.option=1;
    }
    else
    {
      this.option=5;
    }
    
    this._portfolio.getAssetHistory(this.folioId,this.option)
    .subscribe(data=>{      
      data.forEach(element => {               
        this.assetHistoryTime.push(element.month+"-"+element.year);         
        this.assetValueHistory.push(parseFloat(element.assetValue.toFixed(2)));        
        this.dividendHistory.push(element.dividend);
        this.investmentHistory.push(parseFloat(element.investment.toFixed(2)));
        
        this.previousMonthAsset=element.assetValue;
        this.previousMonthInvst=element.investment;                          
      })      
    }); 
 
    this._portfolio.getAssetReturn(this.folioId,this.option)
    .subscribe(data=>{
      var i=0;
      data.forEach(element => {            
          let a:returnonassets={ year:element.year,return:element.return,dividend:element.dividend,xirr:element.xirr,netInvstmnt:element.netInvstmnt};        
          this.assetReturns.push(a);
          if(i>0)
          { 
            this.retrunYear.push(element.year.toString());
            this.returnNet.push(element.xirr);
          } i++;
      })
    });
   
    this._portfolio.GetFolioComment(this.folioId)
    .subscribe(data=>{  
      this.comment=data.comment;
    }); 

    this.assetHistoryTime.length=0;
    this.dividendHistory.length=0;
    this.assetValueHistory.length=0;
    this.investmentHistory.length=0;
    this.sectorInvstmt.length=0;
    this.sectorProfit.length=0;
    this.sectorDiv.length=0;
     
    this.GetXirrReturn(this.folioId,1);
  
  }
  
  public tranVerified(e:any)
  {
    //console.log(e); 
    this._portfolio.UpdateTransaction(e.tranId) 
    .subscribe(data=>{        
      this.status ="Transaction Verified Successfully";
    });
    this.showdividend(e.eq.assetId,e.eq.equityName)
  }  
public sectorfolio()
{
  this._portfolio.getSectorPortfolio(this.folioId)
  .subscribe(data =>{   
  // console.log(data);   

   data.sort((a: { invested: number; },b: { invested: number; })=>a.invested-b.invested);
   data.forEach(element => {
     this.sector.push(element.sectorName);        
     this.sectorDiv[this.sector.indexOf(element.sectorName)]=element.dividend.toFixed(2);
     this.sectorInvstmt[this.sector.indexOf(element.sectorName)]=element.invested.toFixed(2);
     this.sectorProfit[this.sector.indexOf(element.sectorName)]=element.currentValue-element.invested;
   });
              
   }); 
   if(this.selectedfolio == 3 || this.selectedfolio==4)
   {
    this.maxY = 20000; 
   }
   
   
}

 

NextInvest(m: number ) 
{
 //console.log(this.selectedMonth);
 //debugger;
 var month = Number(this.selectedMonth.split('-')[0]);
 var year = Number(this.selectedMonth.split('-')[1]);
 if(month == 12)
 {
  if(m>=0)
    {
      month = 1;
      year = year+1;     
    }  
  else
    {
      month = 11;      
    }
 }
 else
 { 
  if(m>=0)
  {
    month += 1;
  }
  else
  {
    if(month>=2)
      month -= 1;
    else
      {
        month=12;
        year -=1;
      }
  }

 }

 this.selectedMonth = month.toString() +"-"+ year.toString(); 
 this.getAssetInvestdetails(); 
}
public GetXirrReturn(folioId:number, AssetId:number)
{
  this._portfolio.GetXirrReturn(this.folioId,AssetId)
  .subscribe(data=>{  
    this.eqPLPercent =data;
    
  });
}
  onClick(option:any)
  {
    this._portfolio.getlivePrice()
    .subscribe(data => {
      this.share = data;    
     });
  } 
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  public selectnext(option:any)
  {    
    this.router.navigate(['/transaction']);  
  }
  public selecttype(option:any)
  {    
    for (var i = 0; i < this.portfolio.length; i++) {
      }  
  }
  public getTrColor(x:any):string
  {   
    if(parseFloat(x)>=0) 
          return '#22a704';
    else
      return '#bf1722'
  }
  public getTranTypeColor(x:any):string
  {    
    if(x=="1" ||x=="true")
          return '#00b38a';
    else
      return '#bf1722'
  }
  public getHeaderTrColor(x:any):string
  {   
    if(parseFloat(x)>=0)
          return '#FFF659';
    else
      return '#bf1722'
  }
      
  sort(e:string) {      
     //debugger;
    if(e=="divPaymentDate")
    {
      if(this.direction =="asc") 
      {      
        this.yearlyDivDetails.sort((a: { dt: Date; },b: { dt: Date; })=>(a.dt>b.dt)?1:-1);       
        this.direction ="desc";
      }
      else
      {
        this.yearlyDivDetails.sort((a: { dt: number; },b: { dt: number; })=>(b.dt>a.dt)?1:-1);       
        this.direction ="asc";
      }
    }
    
 
    if(e=="intrestPaymentDate")
      { 
        if(this.direction =="asc")
        {      
          this.bondIntrestDetails.sort((a: { intrestPaymentDate: number; },b: { intrestPaymentDate: number; })=>(a.intrestPaymentDate>b.intrestPaymentDate)?1:-1);       
          this.direction ="desc";
        }
        else 
        {
          this.bondIntrestDetails.sort((a: { intrestPaymentDate: number; },b: { intrestPaymentDate: number; })=>(b.intrestPaymentDate>a.intrestPaymentDate)?1:-1);       
          this.direction ="asc";
        } 
    }  
    else if(e=="total")
      { 
        if(this.direction =="asc")
        {      
          this.eqtTransaction.sort((a: { price: number; qty: number; },b: { price: number; qty: number; })=>(a.price*a.qty>b.price*b.qty)?1:-1);       
          this.direction ="desc";
        }
        else 
        {
          this.eqtTransaction.sort((a: { price: number; qty: number; },b: { price: number; qty: number; })=>(b.price*b.qty>a.price*a.qty)?1:-1);       
          this.direction ="asc";
        }
    } 
    else if(e=="amttotal")
      { 
        if(this.direction =="asc")
        {      
          this.filterPortfolio.sort((a: {eq:{ livePrice: number;}; qty: number; },b:{eq: { livePrice: number;}; qty: number; })=>(a.eq.livePrice*a.qty>b.eq.livePrice*b.qty)?1:-1);       
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a: {eq:{ livePrice: number;}; qty: number; },b:{eq:{ livePrice: number;}; qty: number; })=>(b.eq.livePrice*b.qty>a.eq.livePrice*a.qty)?1:-1);       
          this.direction ="asc";
        }
    } 
     
    else if(e=="dtpurchase")
      {       
        if(this.direction =="asc")
        {       
          this.eqtTransaction.sort((a: { tranDate: number; },b: { tranDate: number; })=>(a.tranDate>b.tranDate)?1:-1);       
          this.direction ="desc";
        }
        else  
        {
          this.eqtTransaction.sort((a: { tranDate: number; },b: { tranDate: number; })=>(b.tranDate>a.tranDate)?1:-1);
          this.direction ="asc";
        }
    } 
    else if(e=="current")
      {
        if(this.direction =="asc")
        {
          this.assetReturn.sort((a: { current: number; },b: { current: number; })=>a.current-b.current);
          this.direction ="desc";
        }
        else
        {
          this.assetReturn.sort((a: { current: number; },b: { current: number; })=>b.current-a.current);
          this.direction ="asc";
        }
     }
    if(e=="Dividend")
      {
        if(this.direction =="asc")
        {
          this.filterPortfolio.sort((a: { dividend: number; },b: { dividend: number; })=>a.dividend-b.dividend);
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a: { dividend: number; },b: { dividend: number; })=>b.dividend-a.dividend);
          this.direction ="asc";
        } 
     }
      
     if(e=="netDiv")
      {
        if(this.direction =="asc")
        {
          this.compDivDetails.sort((a: { dividend: number; qty:number; },b: { dividend: number; qty:number; })=>a.dividend-b.dividend);
          this.direction ="desc";
        }
        else 
        {
          this.compDivDetails.sort((a: { dividend: number; qty:number; },b: { dividend: number; qty:number; })=>b.dividend-a.dividend);
          this.direction ="asc";
        }
     }
     if(e=="DivReturn")
      {
        //console.log(this.compDivDetails);
        if(this.direction =="asc")
        {
          this.compDivDetails.sort((a: { dividend: number; avgprice:number;qty:number; },b: { dividend: number; avgprice:number;qty:number; })=>a.dividend/(a.avgprice*a.qty)-b.dividend/(b.avgprice*b.qty));
          this.direction ="desc";
        }
        else 
        {
          this.compDivDetails.sort((a: { dividend: number; avgprice:number;qty:number; },b: { dividend: number; avgprice:number; qty:number;})=>b.dividend/(b.avgprice*b.qty)-a.dividend/(a.avgprice*a.qty));
          this.direction ="asc";
        }
     }
    if(e=="Divyield")
      {
        if(this.direction =="asc") 
        {
          this.filterPortfolio.sort((a: { divReturnXirr: number; },b: { divReturnXirr: number; })=>a.divReturnXirr-b.divReturnXirr);
          this.direction ="desc";
        }
        else 
        {
          this.filterPortfolio.sort((a: { divReturnXirr: number; },b: { divReturnXirr: number; })=>b.divReturnXirr-a.divReturnXirr);
          this.direction ="asc";
        }
     }
     if(e=="name")
     {
       if(this.direction =="asc")
       {
         this.filterPortfolio.sort((a: { equityname: number; },b: { equityname: number; })=>(a.equityname>b.equityname)?1:-1);
         this.direction ="desc";
       }
       else 
       {
         this.filterPortfolio.sort((a: { equityname: number; },b: { equityname: number; })=>(b.equityname-a.equityname)?1:-1);
         this.direction ="asc";
       }
    }
     if(e=="Return")
      {
        if(this.direction =="asc")
        {
          this.filterPortfolio.sort((a: { percentage: number; },b: { percentage: number; })=>a.percentage-b.percentage);
          this.direction ="desc";          
        }
        else 
        {
          this.filterPortfolio.sort((a: { percentage: number; },b: { percentage: number; })=>b.percentage-a.percentage);
          this.direction ="asc";
        }
     }
    // console.log(e);
     if(e=="Investment")
     {
      if(this.direction =="asc")
       {
        
         this.filterPortfolio.sort((a: { qty: number; avgprice: number; },b: { qty: number; avgprice: number; })=>a.qty*a.avgprice-b.qty*b.avgprice);
         this.direction ="desc";
       }
       else 
       {
        this.filterPortfolio.sort((a: { qty: number; avgprice: number; },b: { qty: number; avgprice: number; })=>b.qty*b.avgprice-a.qty*a.avgprice);
         this.direction ="asc";
       }
    }
    if(e=="Gain")
    {
      if(this.direction =="asc")
      {
        this.filterPortfolio.sort((a: { profit: number; },b: { profit: number; })=>b.profit-a.profit);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a: { profit: number; },b: { profit: number; })=>a.profit-b.profit);
        this.direction ="asc";
      }
   }
   else if(e=="Year")
    {
      if(this.direction =="asc")
      { 
        this.assetReturns.sort((a,b)=>b.year-a.year);
        this.direction ="desc";   
      } 
      else 
      {
        this.assetReturns.sort((a,b)=>a.year-b.year);
        this.direction ="asc";      
      } 
    }
    else if(e=="pb")
    {
      if(this.direction =="asc")
      {
        this.filterPortfolio.sort((a: { eq: { pb: number; }; },b: { eq: { pb: number; }; })=>b.eq.pb-a.eq.pb);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a: { eq: { pb: number; }; },b: { eq: { pb: number; }; })=>a.eq.pb-b.eq.pb);
        this.direction ="asc";
      }
   }   
   else if(e=="marketcap")
    {      
      if(this.direction =="asc")
      {
        this.filterPortfolio.sort((a: { eq: { marketCap: number; }; },b: { eq: { marketCap: number; }; })=>b.eq.marketCap-a.eq.marketCap);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a: { eq: { marketCap: number; }; },b: { eq: { marketCap: number; }; })=>a.eq.marketCap-b.eq.marketCap);
        this.direction ="asc";
      }
   }if(e=="qty")
   {
    if(this.direction =="asc")
    {
      this.compDivDetails.sort((a: { qty: number; },b: { qty: number; })=>a.qty-b.qty);
      this.direction ="desc";
    }
    else 
    {
      this.compDivDetails.sort((a: { qty: number; },b: { qty: number; })=>b.qty-a.qty);
      this.direction ="asc";
    }
   }
  }
  CalculateNetInvst()
  {
    this.eqInvstVal=0;
    for (var i = 0; i < this.filterPortfolio.length; i++) {          
      this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;          
      this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].eq.livePrice;
      this.sdividend+= this.filterPortfolio[i].dividend;           
    }
  } 
  selectDivType(e:string):void
  {
    //console.log( this.yearlyDivDetails);
    if(e=="companywise"){
      this.showDividendByGroup();
    }
    else if(e=="datewise"){
      this.showDividendByGroup();
    }
  }
  setradio(e: string): void   
  {       
    this.assetHistoryTime.length=0;
    this.assetValueHistory.length=0;
    this.investmentHistory.length=0;
    this.dividendHistory.length=0;
    this.eqCurrVal =0;
    this.eqInvstVal=0;
    //this.eqInvstVal=0;
    this.sdividend=0;
      if(e=="share")
      {
        this.selectedAssetClass =1;
        this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; }) => s.equityType==this.selectedAssetClass);     
        //console.log(this.filterPortfolio);  
        this.GetXirrReturn(this.folioId,1);      
        this.CalculateNetInvst();
        this._portfolio.getAssetHistory(this.folioId,this.selectedAssetClass)
        .subscribe(data=>{      
          data.forEach(element => {
                     
            this.assetHistoryTime.push(element.month.toString()+"-"+element.year.toString());
            this.assetValueHistory.push(parseFloat(element.assetValue.toFixed(2)));        
            this.dividendHistory.push(element.dividend);
            this.investmentHistory.push(parseFloat(element.investment.toFixed(2)));        
            let dt:Date = new Date(element.year,element.month);
            if(this.previousMonthAsset==0)
            {          
              this.previousMonthAsset=element.assetValue;
              this.previousMonthInvst = element.investment;          
            } 
            else{      
              this.previousMonthAsset=element.assetValue;
              this.previousMonthInvst=element.investment;                  
            }
          })
        });
        this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, this.selectedAssetClass)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return,xirr:element.xirr,dividend:element.dividend};        
                  this.assetReturns.push(a);
              })
            });
        }
        else if(e=="MF")
        {
          
        this.selectedAssetClass =2;
          this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; }) => s.equityType==this.selectedAssetClass);
          //console.log(this.filterPortfolio);  
          for (var i = 0; i < this.filterPortfolio.length; i++){           
            
            this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;
            this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].eq.livePrice;
            this.sdividend =0;
            
          }
          this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, this.selectedAssetClass)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return,xirr:element.xirr};        
                  this.assetReturns.push(a);
              })
            });
          
          this.GetXirrReturn(this.folioId,this.selectedAssetClass);
          
          this._portfolio.getAssetHistory(this.folioId,this.selectedAssetClass)
          .subscribe(data=>{      
            data.forEach(element => {              
              this.assetHistoryTime.push(element.month.toString()+"-"+element.year.toString());
              this.assetValueHistory.push(parseFloat(element.assetValue.toFixed(2)));        
              
              this.investmentHistory.push(parseFloat(element.investment.toFixed(2)));        
              let dt:Date = new Date(element.year,element.month);
              if(this.previousMonthAsset==0)
              {                     
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst = element.investment;          
              }
              else{           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst=element.investment;                  
              }
            })      
          });
        }else if(e=="debt")
        {
          //console.log(this.selectedfolio);
          this.selectedAssetClass =5;
          this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; })=> s.equityType==this.selectedAssetClass);
          
          for (var i = 0; i < this.filterPortfolio.length; i++){           
            this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;
            this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].eq.livePrice;
            this.sdividend =0;
          }
          this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, this.selectedAssetClass)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,return:element.return,xirr:element.xirr};        
                  this.assetReturns.push(a);
              })
            });
          this.GetXirrReturn(this.folioId,this.selectedAssetClass);
          
          this._portfolio.getAssetHistory(this.folioId,this.selectedAssetClass)
          .subscribe(data=>{      
            data.forEach(element => {              
              this.assetHistoryTime.push(element.month.toString()+"-"+element.year.toString());
              this.assetValueHistory.push(parseFloat(element.assetValue.toFixed(2)));        
              
              this.investmentHistory.push(parseFloat(element.investment.toFixed(2)));        
              let dt:Date = new Date(element.year,element.month);
              if(this.previousMonthAsset==0)
              {           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst = element.investment;          
              }
              else{           
                this.previousMonthAsset=element.assetValue;
                this.previousMonthInvst=element.investment;                  
              }
            })      
          });
        }else if(e=="bonds"){
          
        this.selectedAssetClass =9;
          this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; })=> s.equityType==this.selectedAssetClass);
          for (var i = 0; i < this.filterPortfolio.length; i++){           
            this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;
            this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].eq.livePrice;
            this.sdividend =0;
          } 
           
          this.assetReturns.length=0;
          this._portfolio.getAssetReturn(this.folioId, this.selectedAssetClass)
            .subscribe(data=>{      
              data.forEach(element => {            
                  let a:returnonassets={ year:element.year,dividend:element.dividend};        
                  this.assetReturns.push(a);
              })
            });
        }
  } 
  showdividend(p:any)
  {
   // p.eq.assetId,p.eq.equityName
   //debugger;
    this.companyurl =p.eq.analysisurl;
    //console.log(p);
    this.selectedEqt =p.eq.equityName;
    this.selectedEqtID =p.eq.assetId;
    this.divVal.length=0;
    this.divDt.length=0;
    this.eqtQty.length=0;
    let year:number=0;   
    //debugger;
    this._portfolio.getDividend(p.eq.assetId)
    .subscribe(data => { 
      this.share = data;      
      this.companyDividend=data.div;
      //console.log(data);
      data.div.forEach(element => { 
       
        if(this.divDt.length==0)        
        {
          year = new Date(element.dt).getFullYear();
          while(year <= new Date().getFullYear())
          {
            this.divDt.push(year);
            year =year+1;
            this.divVal.push(0);
          }           
        }     
        this.dividendTotal += element.divValue;        
        this.divVal[this.divDt.indexOf(new Date(element.dt).getFullYear())]+=element.divValue ;   
         
      }); 
     });
    
    this._portfolio.getYrlyEqtInvestment(this.folioId, p.eq.assetId)
    .subscribe(data => { 
      
      this.eqtQty.length=0;      
      this.eqtTrandt.length=0;
      data.forEach(element=>{
        //console.log()   
        this.eqtQty.push(element.qty);
        let ss = this.datepipe.transform(element.tranDate, 'yyyy-MM-dd');
        this.eqtTrandt.push( ss!=null?new Date(ss).getFullYear():new Date() );
      });      
     });
     this._portfolio.getEqtTransaction(this.folioId, p.eq.assetId)
     .subscribe(data => {
       this.eqtTransaction=data;
       this.totalShare=0;
       //console.log(this.eqtTransaction);
       data.forEach(element=>{
        this.totalShare += element.qty;
       });
       });

     (document.getElementById('sharedetails')as HTMLDivElement).style.display='block';        
    this.shareName = p.eq.assetId;
  }
   
  showCompDividend(year:string) 
  {    
    this.compDivDetails.length=0;
    this.yearlyDivDetails.length=0;

    if(this.selectedAssetClass==1)
    {
     
      const keys = new Set();
      const uniqueRows = [];
       
      this._portfolio.getCompDividend(year)
        .subscribe(data => { 
          const currentYear = new Date().getFullYear();  
        //this.compDivDetails=data;
        (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='block'; 
        data.forEach(element => { 
          
          element.eq.div.forEach(row=>{
       //debugger;
            const match = row.dt.match(year);
            if(match!=null  && (row.creditType==10 ||row.creditType==11||row.creditType==12))
            { 
            //Add uniq dividend values to list           
              

              let a:compDivYear={  
                div:row.divValue,
                livePrice:element.eq.livePrice,
                avgPrice:element.avgprice,
                dt:row.dt,
                compId:element.eq.assetId,
                compName:element.eq.equityName 
              };  
               
              const exists = this.yearlyDivDetails.some(obj => obj.dt === row.dt && obj.compId===element.eq.assetId);              
              if(!exists)
              {
                this.yearlyDivDetails.push(a);               
              }
              //company wise collection
               const compExist =this.compDivDetails.some(obj => obj.compId===element.eq.assetId);
               if(!compExist)
               {
                this.compDivDetails.push(a);                          
               }else {
                var item = this.compDivDetails.find(obj => obj.compId === element.eq.assetId);
                console.log(element.eq.equityName+"::"+item.div+"," + row.divValue);
                item.div += Number(row.divValue);                
               }
            }            
          });
        });
        }); 
    }else if(this.selectedAssetClass==9)
    {
      /*this.totalBondIntrest=0;
      this._portfolio.getBondIntrest(year)
        .subscribe(data => { 
        this.bondIntrestDetails =data;
        (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='block'; 
        data.forEach(element => {
          this.totalBondIntrest+= element.amt;
        });
        });*/
        this.router.navigate(['/bonds']);
    }
    this.yearlyDivDetails.sort((a, b) => a.name.localeCompare(b.equityName));
  }

  hideShareDetails()
  {
    (document.getElementById('sharedetails')as HTMLDivElement).style.display='none';
    (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='none'; 
  }
  public showDividendByGroup() {
    this.showDiv = !this.showDiv;
    this.showCmp = !this.showDiv;
  } 

  public showTrans() {
    this.show = !this.show;    
    if(this.show){ 
      this.buttonName = "^ Hide";
      this.trnStatus ='Hide';
    }
    else{
      this.buttonName = "Show";
      this.trnStatus ='Add >';
    }
  }
  public AddComment()
  {
    this.comment =(<HTMLInputElement>document.getElementById("comment")).value;
    this._portfolio.AddFolioComment(this.folioId, this.comment)
    .subscribe(data => { 
     
      if(data==true)
      {
        this.status ="Comment Updated Successfully";
      
      }
    });
  }

 //.................... Sector wise Chart........................
  public barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Sector Wise Asset Distribution"
    },scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true, // This option ensures that the Y-axis starts from zero
         
        }
      }]
    }
  };

  public barChartLabels: Label[] = this.sector; 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: 'skyblue' },
    { backgroundColor: '#00b38a' },
    { backgroundColor: '#D1692E' },
  ]
 public sectorChartData: ChartDataSets[] = [
    { data:this.sectorInvstmt, label: 'Invested',stack:'a' },
    { data:this.sectorProfit, label: 'Return',stack:'a' },
    { data:this.sectorDiv, label: 'Div',stack:'a' }
  ];
//.................... Folio wise Return........................
public rtnChartOptions: ChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: "Asset Allocation by size"
  }};
 
public rtnHistorylbl: Label[] = this.assetClassName; 
public rtnChartType: ChartType = 'pie';
public rtnChartLegend = true;
public rtnChartPlugins = [];
public rtnChartColors: Color[] = [
  { backgroundColor: ['skyblue','orange', '#00b38a', '#BF4F51' ]}
];
public rtnInvstmt: ChartDataSets[] = [
  { data:this.assetClassInvstmnt, label: 'Allocation' } 
];
  //--------------------Asset History Chart ----------------------
  public barChartOptions2: ChartOptions = { 
    responsive: true,
    title: {
      display: true,
      text: "Investment vs return"
    } 
  };
  public assetHistorylbl: Label[] = this.assetHistoryTime; 
  public barChartType2: ChartType = 'line';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];
  
  public getfolioAssetHistory: ChartDataSets[] = [
    { data:this.investmentHistory, label: 'Investment' },        
    { data:this.assetValueHistory, label: 'Current Value' },     
    { data:this.dividendHistory, label: 'Dividend' },
  ]; 

  //---------------------Equity Investment History--------------------
  public eqtChartOptions: ChartOptions = {
    responsive: true,
    title: { 
      display: true,
      text: "Investment over Time"
    }
  };
  public eqtyHistorylbl: Label[] = this.eqtTrandt; 
  public eqtChartType: ChartType = 'bar';
  public eqtChartPlugins = []; 
  public eqtChartColors: Color[] = [
    { backgroundColor: '#a05195 ' },
    { backgroundColor: '#08b100db' },     
  ]
  public EquityInvstmt:ChartDataSets[] = [
    { data:this.eqtQty, label: 'No Of Shares',stack:'a' }    
  ];

  //-------------------  Dividend Snapshot ----------------------------
  public divChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Dividend Paid"
    }
  };
  public eqtyHstryDiv: Label[] = this.divDt; 
  public divChartType: ChartType = 'bar';
  public divChartPlugins = [];
  public divChartColors: Color[] = [
    { backgroundColor: 'green ' },
    { backgroundColor: '#08b100db' },     
  ]
  public DivReturn:ChartDataSets[] = [
    { data:this.divVal, label: 'Dividend',stack:'a' }    
  ]; 
//---------------------------------------------------------
  public sectorSelection(e: any): void {   
    this.isShown=true; 
    this.showGraph =false;
    this.sdividend=0;this.netReturn=0;this.eqInvstVal=0; this.eqCurrVal=0;
    if (e.event.type == "click") {
      const clickedIndex = e.active[0]?.index; 
      var lbl=e.active[0]._chart.getElementAtEvent(event)[0]._model.label;    
      
      this.filterPortfolio =  this.portfolio.filter((s: { eq: any; sector: any;   })=> s.eq.sector==lbl);      
      this.filterPortfolio.forEach((element: { dividend: number; profit: number; avgprice: number; qty: number; eq: { livePrice: number; }; }) => {         
              this.sdividend += element.dividend;
              this.netReturn += element.profit;
              this.eqInvstVal += element.avgprice*element.qty;  
              this.eqCurrVal += element.eq.livePrice*element.qty;
      });      
    }
  }
  public historyClick (e: any): void{
    this.isShown=false;
 
    if (e.active.length > 0) {  
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event); 
          
      if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
          const label = chart.data.labels[clickedElementIndex];
           
          // get value by index
          const value = chart.data.datasets[0].data[clickedElementIndex];     
          //console.log(activePoints[0]._datasetIndex);
          if(activePoints[0]._datasetIndex==2)
          {

          }

          this.selectedMonth = label;          
         this.getAssetInvestdetails(); 
        }
       }
  }
  private getAssetInvestdetails()
  {
    this._portfolio.getEqtMonthlyTransaction(this.folioId,this.selectedMonth.split('-')[0],this.selectedMonth.split('-')[1],this.selectedAssetClass.toString())
          .subscribe(data=>{ 
            this.invstTotal=0;            
            this.eqtTransaction=data;           
            this.show = false;
            data.forEach(element=>{
              if(element.tranType =="1")
                this.invstTotal += element.price*element.qty;              
              else
                this.invstTotal -= element.price*element.qty;              
             });
          });
  }
  public assetClassClick (e: any): void{
    this.isShown=false;
     
    if (e.active.length > 0) {  
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event); 
        if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
          const label = chart.data.labels[clickedElementIndex];
          // get value by index
          const value = chart.data.datasets[0].data[clickedElementIndex];                        
          
           this.filterPortfolio =  this.portfolio.filter((s: { eq: any; sector: any;})=> s.eq.category==this.GetCategoryIDBySize(label));          
           //console.log(this.filterPortfolio );
           this.filterPortfolio =  this.filterPortfolio.filter((s: { eq: any;})=> s.eq.assetType==1);          
           //console.log(this.filterPortfolio );
          this.isShown=true;
          this.CalculateNetInvst();
        }
       } 
  }

}
