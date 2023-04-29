import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { Console, debug } from 'console';
import { element } from 'protractor';
import { DatePipe } from '@angular/common';

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
  
  public returnNet =[] as number[];
  public show:boolean = false;
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
  totalBondIntrest:number=0;

  selectedfolio!: number;
  selectedAssetClass:number=1;
 
  constructor(private _portfolio:SharesService,private route:ActivatedRoute,private router:Router, public datepipe: DatePipe) {  }

  ngOnInit(): void {         
    this.GetFolioDetails();
    this.changeFolio('0');
    
  }
  GetFolioDetails() {
    throw new Error('Method not implemented.');
  }
  GetFolioDetails()
  {
    this._portfolio.getAllfolio()
      .subscribe(data=>{
        this.folios =data;       
      }); 
  }
  changeFolio(e :any){    
     
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
      data.forEach(element => {         
        element.profit= element.qty*(element.eq.livePrice - element.avgprice);
        element.percentage = element.xirr; 
        if(element.eq.sector!="Debt" && element.eq.sector!="Equity" )
        {
          if(this.sector.indexOf(element.eq.sector)<=-1 )
          {
            if(element.eq.sector!="")
            {
           // this.sector.push(element.eq.sector);
            //this.assetValue[this.sector.indexOf(element.eq.sector)]=0;
            //this.assetProfit[this.sector.indexOf(element.eq.sector)]=0;            
            }
          } 
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
       if(this.portfolio[i].equityType==1)
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
          let a:returnonassets={ year:element.year,return:element.return,dividend:element.dividend,xirr:element.xirr};        
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
    
    this.GetXirrReturn(this.folioId,1);
    
  }
 
public sectorfolio()
{
  this._portfolio.getSectorPortfolio(this.folioId)
  .subscribe(data =>{   
   //console.log(data);
   data.sort((a: { invested: number; },b: { invested: number; })=>a.invested-b.invested);
   data.forEach(element => { 
     this.sector.push(element.sectorName);         
     this.sectorDiv[this.sector.indexOf(element.sectorName)]=element.dividend.toFixed(2);
     this.sectorInvstmt[this.sector.indexOf(element.sectorName)]=element.invested.toFixed(2);
     this.sectorProfit[this.sector.indexOf(element.sectorName)]=element.currentValue-element.invested;
   });
              
   }); 
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
    
    if(x=="1")
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
    if(e=="intrestPaymentDate")
      { 
        if(this.direction =="asc")
        {      
          this.bondIntrestDetails.sort((a,b)=>(a.intrestPaymentDate>b.intrestPaymentDate)?1:-1);       
          this.direction ="desc";
        }
        else 
        {
          this.bondIntrestDetails.sort((a,b)=>(b.intrestPaymentDate>a.intrestPaymentDate)?1:-1);       
          this.direction ="asc";
        }
     }else  
      if(e=="total")
      { 
        if(this.direction =="asc")
        {      
          this.eqtTransaction.sort((a,b)=>(a.price*a.qty>b.price*b.qty)?1:-1);       
          this.direction ="desc";
        }
        else 
        {
          this.eqtTransaction.sort((a,b)=>(b.price*b.qty>a.price*a.qty)?1:-1);       
          this.direction ="asc";
        }
     }else if(e=="dtpurchase")
      {       
        if(this.direction =="asc")
        {       
          this.eqtTransaction.sort((a,b)=>(a.tranDate>b.tranDate)?1:-1);       
          this.direction ="desc";
        }
        else  
        {
          this.eqtTransaction.sort((a,b)=>(b.tranDate>a.tranDate)?1:-1);
          this.direction ="asc";
        }
     } 
      if(e=="current")
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
          this.compDivDetails.sort((a: { dividend: number; qty:number; },b: { dividend: number; qty:number; })=>a.dividend*a.qty-b.dividend*b.qty);
          this.direction ="desc";
        }
        else 
        {
          this.compDivDetails.sort((a: { dividend: number; qty:number; },b: { dividend: number; qty:number; })=>b.dividend*b.qty-a.dividend*a.qty);
          this.direction ="asc";
        }
     }
     if(e=="DivReturn")
      {
        if(this.direction =="asc")
        {
          this.compDivDetails.sort((a: { dividend: number; livePrice:number; },b: { dividend: number; livePrice:number; })=>a.dividend/a.livePrice-b.dividend/b.livePrice);
          this.direction ="desc";
        }
        else 
        {
          this.compDivDetails.sort((a: { dividend: number; livePrice:number; },b: { dividend: number; livePrice:number; })=>b.dividend/b.livePrice-a.dividend/a.livePrice);
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
        this.filterPortfolio.sort((a,b)=>b.eq.pb-a.eq.pb);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a,b)=>a.eq.pb-b.eq.pb);
        this.direction ="asc";
      }
   }   
   else if(e=="marketcap")
    {      
      if(this.direction =="asc")
      {
        this.filterPortfolio.sort((a,b)=>b.eq.marketCap-a.eq.marketCap);
        this.direction ="desc";
      }
      else 
      {
        this.filterPortfolio.sort((a,b)=>a.eq.marketCap-b.eq.marketCap);
        this.direction ="asc";
      }
   }if(e=="qty")
   {
    if(this.direction =="asc")
    {
      this.compDivDetails.sort((a,b)=>a.qty-b.qty);
      this.direction ="desc";
    }
    else 
    {
      this.compDivDetails.sort((a,b)=>b.qty-a.qty);
      this.direction ="asc";
    }
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
    this.sdividend=0;
      if(e=="share")
      {
        this.selectedAssetClass =1;
        this.filterPortfolio =  this.portfolio.filter((s: { equityType: number; }) => s.equityType==this.selectedAssetClass);     
        this.GetXirrReturn(this.folioId,1);
        for (var i = 0; i < this.filterPortfolio.length; i++) {          
          this.eqInvstVal += this.filterPortfolio[i].qty*this.filterPortfolio[i].avgprice;          
          this.eqCurrVal +=  this.filterPortfolio[i].qty*this.filterPortfolio[i].eq.livePrice;
          this.sdividend+= this.filterPortfolio[i].dividend;           
        }
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
  showdividend(e:string,eqtName:string)
  {
    this.selectedEqt =eqtName;
    this.selectedEqtID =e;
    this.divVal.length=0;
    this.divDt.length=0;
    this.eqtQty.length=0;    
    debugger;
    this._portfolio.getDividend(e)
    .subscribe(data => { 
      this.share = data; 
      
      this.companyDividend=data;
      data.forEach(element => { 
        this.dividendTotal += element.value;
         this.divDt.push(new Date(element.dt).getFullYear());
         this.divVal.push(element.divValue);
         //console.log(new Date(element.dt).getMonth());
      }); 
     });
    
    this._portfolio.getYrlyEqtInvestment(this.folioId, e)
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
     this._portfolio.getEqtTransaction(this.folioId, e)
     .subscribe(data => { 
       this.eqtTransaction=data;
       this.totalShare=0; 
       console.log(this.eqtTransaction);   
       data.forEach(element=>{ 
        this.totalShare += element.qty;
       });
       }); 

     (document.getElementById('sharedetails')as HTMLDivElement).style.display='block';        
    this.shareName = e;
  }
  showCompDividend(year:string) 
  {
    this.compDivDetails.length=0;
    if(this.selectedAssetClass==1)
    {
      this._portfolio.getCompDividend(year)
        .subscribe(data => { 
        this.compDivDetails =data; 
        (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='block'; 
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

  }

  hideShareDetails()
  {
    (document.getElementById('sharedetails')as HTMLDivElement).style.display='none';
    (document.getElementById('cmpDivDetails')as HTMLDivElement).style.display='none'; 
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
    }
  };

  public barChartLabels: Label[] = this.sector; 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: 'skyblue ' },
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
    text: "Xirr Return Over Time"
  }};

public rtnHistorylbl: Label[] = this.retrunYear; 
public rtnChartType: ChartType = 'bar';
public rtnChartLegend = true;
public rtnChartPlugins = [];
public rtnChartColors: Color[] = [   
  { backgroundColor: '#00b38a' },
]
public rtnInvstmt: ChartDataSets[] = [
  { data:this.returnNet, label: 'rtn' }  
];
  //--------------------Asset History Chart -----------------------
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
      this.filterPortfolio =  this.portfolio.filter((s: {
        eq: any; sector: any; 
      })=> s.eq.sector==lbl);    
      this.filterPortfolio.forEach(element => { 
        
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
          this.selectedMonth = label;          
          this._portfolio.getEqtMonthlyTransaction(this.folioId,label.split('-')[0],label.split('-')[1],this.selectedAssetClass.toString())
          .subscribe(data=>{ 
            this.invstTotal=0;            
            this.eqtTransaction=data;
            console.log(this.eqtTransaction);
            this.show = false;
            data.forEach(element=>{
              if(element.tranType =="1")
                this.invstTotal += element.price*element.qty;              
              else
                this.invstTotal -= element.price*element.qty;              
             });
          });
        }
       }
  }
}
