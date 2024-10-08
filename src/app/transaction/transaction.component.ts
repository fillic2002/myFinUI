import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { Console, debug } from 'console';
import { divHistory } from '../portfolio/portfolio.component';
import { IDividend } from '../ShareDetail';
import { element } from 'protractor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Decipher } from 'crypto';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  TypeOfTran = [
    { id: 3, name: 'Deposit'},
    { id: 6, name: 'Intrest'}]; 

   
  public portfolio =[] as any;
  public PFAcctDetails =[] as any;
  public filterPortfolio =[] as any;
  public equitytransaction =[] as any;
  public folio =[] as any;
  public status!: string;
  public eqtotal:any;
  public mftotal:any;
  public selectedLevel:any;
  public selectedfolio: number =0;
  public selectedMonth: number =0;
  public purchaseOption: any=1;
  isShown: boolean = true;
  public assetType: Number=1;
  public assetId: any;
  public buttonName:any = 'Show';
  public show:boolean = false;
  public DetailSummary:boolean = true;
   
  public trnStatus:string='Add >'
  public result=[] as any;
  public companyid: string="";
  public yearEqt: number[] = [];
  public invstEqt =[] as number[];
  public proftEqt =[] as number[];
  public yearMF =[] as number[];
  public invstMF =[] as number[];
  public proftMF =[] as number[];
  public yearDebt =[] as number[];
  public invstDebt =[] as number[];
  public proftDebt =[] as number[];
  public invstBonds =[] as number[];
  public proftBonds =[] as number[];
  public proftPf =[] as number[];
  public proftPPf =[] as number[];
  public invstPPF =[] as number[];
  pfinvstmnt=[] as number[];
  public monthlyInvstShr =[] as number[];
  public monthlyInvstEqtMF =[] as number[];
  public monthlyInvstDebtMF =[] as number[];
  public monthlyInvstPF =[] as number[];
  public monthlyInvstPPF =[] as number[];
  public filterMonthlyInvst =[] as number[];
  public MonthlyInvst =[] as number[];
 
  enlargedChartId: number | null = null;
   
  invstmnt=[] as number[];
  intrest=[] as number[];
  //pfinvstmnt=[] as number[];
  pfintrest=[] as number[];
  year=[] as number[];
  pfyear=[] as number[];
  month=[] as string[];
   
  showresult: boolean = false ;
  qty: any;
  direction:string="asc";
  //isMF:boolean=false;
  isShare:boolean=true;
  currentDt:Date | undefined;
  selectedEqt:string="";  
  divVal=[] as number[];
  divDt=[] as any[];
  public share=[] as any;
  dividendTotal:number=0;
  public companyDividend=[] as IDividend[]; 
  eqtQty=[] as number[];
  eqtTrandt=[] as Date[];
  shareName:string="";  
  public eqtTransaction=[] as any;
  folioId:number=0;
  datepipe: any;

  sectorInvstMonth=[] as number[];
  sectorInvstValue=[] as number[];
  sectors=[] as string[];
  stackedDatasetSector=[] as any[];
  filteredStacedData=[] as any[];
  datas=[] as any[];
  compName:string='';
  pb_tran:number =0;
  msg:string ='';
  uniqueSectorNames: Set<string> = new Set<string>();


  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this.GetFolioDetails();
    this.getMonthlyInvestment(0);
    this.invstDebt.length=0;
    this.invstEqt.length=0;
    this.invstMF.length=0;
    this.invstBonds.length=0;
    this.proftEqt.length=0;
    this.proftMF.length=0;
  
    this._eqTransaction.getTransaction(0) 
      .subscribe(data =>{ 
      this.equitytransaction = data;    
      this.filterPortfolio=  this.equitytransaction.filter(s => s.equity.assetType===1 && (s.tranType===1 || s.tranType===2));      
      //console.log(this.filterPortfolio);
      var to:number;
      to=0;  
      for (var i = 0; i < this.equitytransaction.length; i++) {
        to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
      }
      this.eqtotal=to.toFixed(2);     
    }); 
    
    this.getYearlyIvestment(0);
  }

getYearlyIvestment(folioId:number)
{  
    this.invstEqt.length=0; 
    this.invstMF.length=0;
    this.year.length=0;
    this.pfyear.length=0;
    this.yearDebt.length=0;
    this.invstDebt.length=0;
    this.invstBonds.length=0; 
    this.invstPPF.length=0;
    this.proftEqt.length=0;
    this.proftMF.length=0;
    this.proftDebt.length=0;
    this.proftBonds.length=0;
    this.proftPPf.length=0;
    this.proftPf.length=0;
    this.pfinvstmnt.length=0;
     
  this._eqTransaction.getYearlyInvestment(folioId,"Yearly")
  .subscribe(data =>{
    data.forEach(element => { 
          
      if(element.assettype==1) //shares
      {
        this.addYear(element.year);             
        this.invstEqt.push(element.investment.toFixed(2));
        this.proftEqt.push(element.profitCurrentyear.toFixed(2));
        
      }else if(element.assettype==2)//eqt_fund
      {
        this.addYear(element.year)
        this.invstMF.push(element.investment.toFixed(2));
        this.proftMF.push(element.profitCurrentyear.toFixed(2));
      }else if(element.assettype==5) //debt_fund
      {
        this.addYear(element.year)
        this.invstDebt.push(element.investment.toFixed(2));
        this.proftDebt.push(element.profitCurrentyear.toFixed(2));
         
      }else if(element.assettype==9) //bonds
      {
        this.addYear(element.year)
        this.invstBonds.push(element.investment.toFixed(2));
        this.proftBonds.push(element.profitCurrentyear.toFixed(2));
      }else if(element.assettype==3) //pf
      {
        
        this.addPfYear(element.year)
        this.pfinvstmnt.push(element.investment.toFixed(2));
        this.proftPf.push(element.profitCurrentyear.toFixed(2));        

      }else if(element.assettype==4) //ppf
      {
        this.addYear(element.year)
        this.invstPPF.push(element.investment.toFixed(2));
        this.proftPPf.push(element.profitCurrentyear.toFixed(2));
      }
    });   
    this.invstEqt.reverse(); 
    this.invstMF.reverse();
    this.year.reverse();    
    this.yearDebt.reverse();
    this.invstDebt.reverse();
    this.invstBonds.reverse(); 
    this.invstPPF.reverse();
    this.proftEqt.reverse();
    this.proftMF.reverse();
    this.proftDebt.reverse();
    this.proftBonds.reverse();
    this.proftPPf.reverse();

    this.pfyear.reverse();
    this.proftPf.reverse();
    this.pfinvstmnt.reverse();
  }); 
}

/*getPf_PPFInvestment()
{
  this.pfintrest.length=0;
  this.pfinvstmnt.length=0;
  this.year=0;
  this._eqTransaction.getPFAcDetails('0', 3)
    .subscribe(data =>{       
      this.PFAcctDetails=data;       
      data.forEach(element=>{
        //console.log(element);
        this.addYear(element.year);         
        if(element.typeOfTransaction=="int") 
          { 
            var inv:number=0;
            inv= element.investmentEmplr+element.investmentEmp;     
            
            this.pfintrest.push(inv);   
        }else if(element.typeOfTransaction=="deposit")
          {
            var inv:number=0;
            inv= element.investmentEmplr+element.investmentEmp;     
            this.pfinvstmnt.push(inv);        
          }
        });       
    });
     
}*/
 
getSectorWiseInvestment(data:any[]) {

//  console.log(data);      
  const labels = data.map(entry => `${entry.year}-${entry.month}`);  
  const datasets = [];
  
  const sectorNames = [...new Set(data.flatMap(entry => entry.sectorInvstmt.map(sector => sector.sectorName)))];

  for (const sectorName of sectorNames) {
    const sectorData = {
      label: sectorName,
      backgroundColor: this.getRandomColor(),
      data: data.map(entry => {
        const sector = entry.sectorInvstmt.find(sector => sector.sectorName === sectorName) ;
        return sector ? sector.invested.toFixed(2) : 0;
      })
    };
    datasets.push(sectorData);
  }  
  return { labels, datasets };
}

drawChartSectorWiseInvst(sectordata:any[])
{ 
  const filterData=sectordata.filter(item=> item.assetId===1); 
  const ctx = document.getElementById('sectorWiseMonthlyInvst').getContext('2d');
  const stacedData=this.getSectorWiseInvestment(filterData)
  
  const myChart = new Chart(ctx, {
  type: 'line',
  data: stacedData,
  options: {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true,beginAtZero:true }
    },
    onClick:(event,elements)=>{
  
      if (elements.length > 0) {
        var activePoint = myChart.getElementAtEvent(event)[0];
        var data = activePoint._chart.data;
        var datasetIndex = activePoint._datasetIndex;
        var label = stacedData.datasets[datasetIndex].label;
        var value = stacedData.datasets[datasetIndex].data[activePoint._index];       
        //debugger;
        const clickedElementIndex = elements[0]._index;
        const xAxisValue = stacedData.labels[clickedElementIndex];
        var dt= xAxisValue.split('-');
        this.filterPortfolio=this.equitytransaction.filter(x=>x.equity.sector===label && new Date(x.tranDate).getFullYear() == dt[0] && new Date(x.tranDate).getMonth()==dt[1]-1);
        //console.log(xAxisValue);
      }
    }
  }
});
 
}
 getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
 
getMonthlyInvestment(folioId:any)
  {    
    this.filterMonthlyInvst.length=0;    
    this.MonthlyInvst.length=0;

    this._eqTransaction.getMonthlyInvstment(folioId,12)
    .subscribe(data=>{
      this.drawChartSectorWiseInvst(data);
      this.filterMonthlyInvst = data;
      this.MonthlyInvst =data;
      this.monthlyInvest(data);
    }); 
     
  }
monthlyInvest(data:any[])
{
  data.forEach(element=>{        
    this.monthlyInvstPPF.length=0;
     if(this.month.findIndex(x=>x==element.month+"-"+element.year) < 0)
     {          
       this.month.push(element.month+"-"+element.year);  
     }
     if(element.assetId==1){
     // console.log(element);
       this.monthlyInvstShr.push(element.invested.toFixed(1))
       this.sectorInvstMonth.push(element.month);
     }else if(element.assetId==2){
       this.monthlyInvstEqtMF.push(element.invested.toFixed(1))        
     }else if(element.assetId==5){          
       this.monthlyInvstDebtMF.push(element.invested.toFixed(1))        
     }else if(element.assetId==3){          
       this.monthlyInvstPF.push(element.invested.toFixed(1))        
     }else if(element.assetId==4){          
       this.monthlyInvstPPF.push(element.invested.toFixed(1))        
     }
   });
}

GetFolioDetails()
{
  this._eqTransaction.getAllfolio()
    .subscribe(data=>{
      this.folio =data;
     // console.log(data);
    }); 
}
  AddTransaction():void  {
    if(document.getElementById('txtName') == null)
    {
      this.assetId =""
    }
    else{
      this.assetId = (document.getElementById('txtName')as HTMLInputElement).value;
    }
    
    
    this.qty = (document.getElementById('txtQty') as HTMLInputElement).value; 
    var PB = (document.getElementById('txtPB') as HTMLInputElement).value;
    var price = (document.getElementById('txtPrice') as HTMLInputElement).value;
    var dt =(document.getElementById('txtDt') as HTMLInputElement).value;
    this.qty=this.qty.replace(',','');
    var mv = (document.getElementById('txtMarketCap') as HTMLInputElement).value;    
    debugger;
    if(this.selectedfolio == 0) 
      return;
    this._eqTransaction.postTransaction(price,this.assetId,this.qty,dt,this.selectedfolio,this.purchaseOption,this.assetType,PB,mv,0) 
    .subscribe(data => {
     var status= document.getElementById('status')
     this.status="Record "+this.purchaseOption+" Successfully for: "+this.assetId +" in portfolio: "+this.selectedfolio;
     setTimeout(() => {
      this.status ="";
    }, 5000);  
     this.ngOnInit();      
    })
     
    //document.getElementById('status').style.display='block';
  }
add()
{ 
    this._eqTransaction.getAllfolio()
    .subscribe(datan =>{ 
      this.folio = datan;
    });
   
}
hideShareDetails()
{
  document.getElementById('status').style.display='none';
} 
public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  public selectnext(option:any)
  { 
    if(option='Portfolio')   
      this.router.navigate(['/portfolio']);
    if(option='Tax')   
      this.router.navigate(['/tax']);
  }
  public selectFolio()
  {    
    this.router.navigate(['/portfolio']);   
  }
  
selected(){
 
  }
changeFolio(e :any) {
    debugger;
    this.status="";   
    this.selectedfolio=e.target.value;    
    //console.log(this.selectedfolio);
    
    this.getYearlyIvestment(this.selectedfolio);    
    this.getMonthlyInvestment(this.selectedfolio);    

    this._eqTransaction.getTransaction(e.target.value)
    .subscribe(data =>{
      this.portfolio=data;
      this.equitytransaction = data
      
      var eqto:number;
      var mfto:number;
      eqto=0;
      mfto=0;
      for (var i = 0; i < this.equitytransaction.length; i++) {
       if(this.equitytransaction.equityType=1){
        eqto= eqto + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
       }
       else
       {
        mfto= mfto + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
       }
     }
     this.eqtotal=eqto.toFixed(2);
     this.mftotal=mfto.toFixed(2);
     if(this.isShare)
         this.filterPortfolio =  this.equitytransaction.filter(s => s.equity.assetType===1);
     else  
         this.filterPortfolio =  this.equitytransaction.filter(s => s.equity.assetType===2 ||s.equity.assetType===5 );
    });
    this.intrest.length=0;
    this.invstmnt.length=0;
    //this.year=0;
    // This function only update PPF values
    this._eqTransaction.getPFAcDetails(this.selectedfolio, 4)
    .subscribe(data =>{       
      this.PFAcctDetails=data;
      data.forEach(element=>{
        console.log("PF::"+element.year);
      this.addYear(element.year);         
      if(element.typeOfTransaction=="int")
        { 
          var inv:number=0;
          inv= element.InvestmentEmplr+element.investmentEmp;   
          this.intrest.push(inv);   
      }else if(element.typeOfTransaction=="Deposit")
        { 
          var inv:number=0;
          inv= element.InvestmentEmplr+element.investmentEmp;     
          this.invstmnt.push(inv);        
        }
      });  
    });    
}
private addYear(yr:number)
  { 
  if(this.year.length===0 && yr >= 2016)
    {
      this.year.push(yr);
    }else{
      var found=this.year.indexOf(yr);
      if(found < 0 && yr >= 2016)
      {
        this.year.push(yr);
      }   
    }
  }
  private addPfYear(yr:number)
  {    
    if(this.pfyear.length===0)
    {
      this.pfyear.push(yr);
    }else{
      var found=this.pfyear.indexOf(yr);
      if(found < 0)
      {
        this.pfyear.push(yr);
      }   
    }
  }

changeDate(e:any){
    this.status="";
  }
selectOption(e:any)
  {
    this.purchaseOption = e.target.value;
    
  }
changeAsset(e:any)
  {   
    this.assetType =e.target.value;
     if(e.target.value==12 || e.target.value==7|| e.target.value==8)
      {
        this.isShown = ! this.isShown;
      }
     else
     {
       this.isShown =true;
     }
     this._eqTransaction.getTransaction(this.selectedfolio)
    .subscribe(data =>{

     this.equitytransaction = data
     var to:number;
     to=0;
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.eqtotal=to.toFixed(2);
    }); 
  }
  public showTrans() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show){
      this.buttonName = "Hide";
      this.trnStatus ='Hide';
    }
    else{
      this.buttonName = "Show";
      this.trnStatus ='Add >';
    }
  }
  public getasset(e:any)
  {    
    if(e.target.value.length>2)
    {    
      this.showresult =true;
      this._eqTransaction.getShare(e.target.value)
      .subscribe(data =>{
        this.result = data;
      });
    }
  }
  public getId(e:any)
  {    
    this.showresult =false;
    this.companyid=e;
   // alert(e);
  } 
  public deleterecord(t:any)
  {    
    if(confirm("Are you sure to delete ")) {
 
    this._eqTransaction.deleteTransaction(t.tranId)
      .subscribe(data =>{
        this.result = data;        
      });
   }
  }
  public getBGColor(x:any):string
  {   
    if(x>100000)
        return '#aceda9db';
    if(x<5000 && x>10)
      return '#fa8d8d'
    if(x<100000 && x>70000)
      return '#e0abfa'
  }
  public getTranTypeColor(x:any):string
  {   
    if(x=='1'|| x=="true")
          return '#22a704';
    else
      return '#ff000091'
  }
  sort(e:string) {
     
    if(e=="ID")
    {
      if(this.direction =="asc")
      {         
        this.filterPortfolio.sort((a,b)=>(a.equityId>b.equityId)?1:-1);
        this.direction ="desc";
      }
      else
      {
        this.filterPortfolio.sort((a,b)=>(b.equityId>a.equityId)?1:-1);
        this.direction ="asc"; 
      }
   }
   if(e=="purchaseDt")
   {      
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.tranDate>b.tranDate)?1:-1);
       this.direction ="desc";
     }  
     else 
     {
       this.filterPortfolio.sort((a,b)=>(b.tranDate>a.tranDate)?1:-1);
       this.direction ="asc";
     }
  } 
  if(e=="pb")
   { 
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.pb>b.pb)?1:-1);
       this.direction ="desc";
     }  
     else  
     {
       this.filterPortfolio.sort((a,b)=>(b.pb>a.pb)?1:-1);
       this.direction ="asc";
     }
  }
  if(e=="mc")
   {      
     if(this.direction =="asc")
     {
       this.filterPortfolio.sort((a,b)=>(a.marketCap>b.marketCap)?1:-1);
       this.direction ="desc";
     }  
     else 
     {
       this.filterPortfolio.sort((a,b)=>(b.marketCap>a.marketCap)?1:-1);
       this.direction ="asc";
     }
  } 
  if(e=="ia")
  {
    if(this.direction =="asc")
    {
      this.filterPortfolio.sort((a,b)=>(a.qty*a.price>b.qty*b.price)?1:-1);
      this.direction ="desc";
    }  
    else 
    {
      this.filterPortfolio.sort((a,b)=>(b.qty*b.price>a.qty*a.price)?1:-1);
      this.direction ="asc";
    }
  }
  }
  HideSharedtl()
  {
    (document.getElementById('sharedetails') as HTMLDivElement).style.display='none';
    //document.getElementById('cmpDivDetails').style.display='none'; 
  }
  public filterAsset(e:any)
  {
    //console.log(this.equitytransaction);
    
    this.filterPortfolio =  this.equitytransaction.filter(s => s.equity.equityName.toLowerCase().includes(this.compName.toLowerCase()));
    
    this.filterPortfolio.forEach(item => {
      item.isEdit = false;
    });
    
  }
 updateTransaction( t:any)
  { 
    this._eqTransaction.UpdateTransactionNew(t.pB_Tran,t.tranDate,t.equity.assetId,t.price, t.portfolioId,t.tranId, t.qty)
      .subscribe(data =>{
      
        this.msg="Trasnsaction for "+ t.equity.equityName + " has been updated "+ data ;
        this.ngOnInit();
      });
  }
  editRow(item:any)
  {  
    item.isEdit = true;
  }
  //onChange(event:any,pb:number, dt:Date, astId:string)
  //{
  //  debugger;
   // this.pb_tran =pb;
     
  //}
  enlargeChart(chartId: number) {
    this.enlargedChartId = this.enlargedChartId === chartId ? null : chartId;
  }
  isEnlarged(chartId: number): boolean {
    return this.enlargedChartId === chartId;
  }

  AddTran(tran:any)
  {
    (document.getElementById('txtName')as  HTMLInputElement).value =  tran.equity.assetId;
    (document.getElementById('txtMarketCap')as  HTMLInputElement).value =  "0";
    (document.getElementById('txtPB')as  HTMLInputElement).value =  "0";
  }
  selectInvstOption(e: string): void   
  {
    this.yearEqt.length=0;
    this.invstEqt.length=0;
    this.invstMF.length=0;
    this.yearMF.length=0;
    this.yearDebt.length=0;
    this.invstDebt.length=0;
     if(e=="m")
     {
      this._eqTransaction.getYearlyInvestment("Monthly")
      .subscribe(data =>{
        data.forEach(element => {
           
          if(element.assettype==1)
            {
              this.yearEqt.push(element.year+"-"+element.qtr);
              this.invstEqt.push(element.investment.toFixed(2));
            }
            if(element.assettype==2)
            {
              this.yearMF.push(element.year+"-"+element.qtr)
              this.invstMF.push(element.investment.toFixed(2));
            }
            if(element.assettype==5)
            {
              this.yearDebt.push(element.year+"-"+element.qtr)
              this.invstDebt.push(element.investment.toFixed(2));
            }
        });
        this.yearEqt.reverse();
        this.invstEqt.reverse();
        this.invstMF.reverse();
        this.yearMF.reverse();
        this.yearDebt.reverse();
        this.invstDebt.reverse();
      });  
     }
     else{
      this._eqTransaction.getYearlyInvestment("Yearly")
      .subscribe(data =>{
        data.forEach(element => {
        
          if(element.assettype==1)
            {
              this.yearEqt.push(element.year)               
              this.invstEqt.push(element.investment.toFixed(2));
            }
            if(element.assettype==2)
            {
              this.yearMF.push(element.year)
              this.invstMF.push(element.investment.toFixed(2));
            }
            if(element.assettype==5)
            {
              this.yearDebt.push(element.year)
              this.invstDebt.push(element.investment.toFixed(2));
            }
        });
        this.yearEqt.reverse();
        this.invstEqt.reverse();
        this.invstMF.reverse();
        this.yearMF.reverse();
        this.yearDebt.reverse();
        this.invstDebt.reverse();
      }); 
     }
     
  }
  SelectAssetType(e: string): void   
  {            
        //this.isMF = !this.isMF;
        this.isShare=!this.isShare;
       // console.log(this.isShare);
        if(this.isShare)
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===1);
        else  
          this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===2 ||s.assetType===5 );

          this.filterPortfolio.forEach(item => {
            item.isEdit = false;
          });
  }
   
   //.................... Shares Investment........................
   public barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Net Investment"
    }    
  };
  public barChartLabels: Label[] = this.year.reverse(); 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: '#97CEEC' },
    { backgroundColor: '#009150' },
    { backgroundColor: 'lightblue' },
    { backgroundColor: '#00b38a' },
    { backgroundColor: '#BBBFD2' },
    { backgroundColor: '#33cc99' },
    { backgroundColor: '#B5E1E1' },
    { backgroundColor: '#addfad' }, 
               
  ]
  public invstShrDataSet: ChartDataSets[] = [
    { data:this.invstDebt, label: 'Debt MF',stack:'i'},    
    { data:this.proftDebt, label: 'prft_DebtMF',stack:'p'},    
    { data:this.invstMF, label: 'Eqty MF',stack:'i' },   
    { data:this.proftMF, label: 'p_MF',stack:'p' },   
    { data:this.invstEqt, label: 'Shares',stack:'i'  }, 
    { data:this.proftEqt, label: 'p_Eqt',stack:'p' },  
    { data:this.invstBonds, label: 'Bonds',stack:'i'},
    { data:this.proftBonds, label: 'prft_Bonds',stack:'p'},
    
  ];

   
//--------------------PPF Investment vs intrest data -----------------------
public ChartOptions: ChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: "PPF Investment"
  }
};
public ChartLabels: Label[] = this.year; 
public ChartType: ChartType = 'bar'; 
public ChartLegend = true;
public ChartPlugins = [];
public ChartColors: Color[] = [
  { backgroundColor: 'skyblue ' },
  { backgroundColor: '#08b100db' },     
]

public ppfDataSet: ChartDataSets[] = [ 
  { data:this.invstPPF, label: 'Investment',stack:'a' },        
  { data:this.proftPPf, label: 'Intrest',stack:'a' },   
];
//-------------------- Monthly Invst -----------------------
public mnthInvstChartOptions: ChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: "Monthly Investment"
  } 
}; 

public mnthInvstlbl: Label[] = this.month;
public mnthInvstChartType: ChartType = 'bar'; 
public mnthInvstChartLegend = true;
public mnthInvstChartPlugins = []; 
public mnthInvstChartColors: Color[] = [
  { backgroundColor: '#08b100db ' },
  { backgroundColor: 'skyblue ' },
  //{ backgroundColor: '#667D8B ' },
  //{ backgroundColor: '#8295AD ' },
  { backgroundColor: '#D1CDC4 '}
]
public mnthInvstDataSet: ChartDataSets[] = [
  { data:this.monthlyInvstShr, label: 'Shares',stack:'inv' },
  { data:this.monthlyInvstEqtMF, label: 'EqtMF',stack:'inv' },
  { data:this.monthlyInvstDebtMF, label: 'DebtMF',stack:'inv'}, 
  //{ data:this.monthlyInvstPF, label: 'PF',stack:'inv' },
  //{ data:this.monthlyInvstPPF, label: 'PPF',stack:'inv' } 
]; 

 //--------------------PF Investment -----------------------
public pfChartOptions: ChartOptions = {
  responsive: true, 
  title: {
    display: true,
    text: "PF Investment"
  }
};
public pfChartLabels: Label[] = this.pfyear; 
public pfChartType: ChartType = 'bar';
public pfChartLegend = false;
public pfChartPlugins = [];
public pfChartColors: Color[] = [
  { backgroundColor: 'skyblue ' },
  { backgroundColor: '#08b100db' },     
]

public pfDataSet: ChartDataSets[] = [
  
  { data:this.pfinvstmnt, label: 'pf',stack:'pf' },   
  { data:this.proftPf, label: 'pf_Intrest',stack:'pf' },   
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
//------------------------------------------------------------
public investChartOption: ChartOptions = {
  responsive: true, 
  title: {
    display: true,
    text: "Sector Wise Invst"
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true }
}
};
public sectorChartType: ChartType = 'bar';
public invstLabel: Label[] = this.sectorInvstMonth; 
public invstDataset:ChartDataSets[] = [
  { data:this.datas }    
]; 
//------------------------------------------------------------
public chartClick(e: any): void {
  
 
  if (e.active.length > 0) {
    this.DetailSummary = true;
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event); 
    
    if ( activePoints.length > 0) { 
      const clickedElementIndex = activePoints[0]._index;
      const label = chart.data.labels[clickedElementIndex];
      const typeOfinvst =activePoints[0]._view.datasetLabel;      
      
      if(typeOfinvst=="Debt MF")  
      {
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.equity.assetType == 5);
       //console.log(this.equitytransaction);         
      }
      if(typeOfinvst=='Shares')
      {       
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.equity.assetType == 1);
      }
      if(typeOfinvst=="Eqty MF")
      {
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.equity.assetType == 2);
      } 
      if(typeOfinvst=="Bonds")
      {
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.equity.assetType == 9);
      } 
    }   
  }}

 public getPFDetail(e:any): void {
  const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
    if ( activePoints.length > 0) {
      const clickedElementIndex = activePoints[0]._index;
      const label = chart.data.labels[clickedElementIndex];
      //const typeOfinvst =activePoints[0]._view.datasetLabel;      
      //console.log(this.selectedfolio)
      this._eqTransaction.getMonthlyPFDetails(this.selectedfolio,3,label)
      .subscribe(data =>{ 
        this.PFAcctDetails =data;
        this.DetailSummary = false;
      });      
    }  
 }
 
 public getMonthlyInvest(e: any)
 {
   if (e.active.length > 0) {  
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event); 
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];     
        this.selectedMonth = label.split('-')[0];     
       // console.log(this.equitytransaction);
        //console.log(value);
        
        this.filterPortfolio=this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label.split('-')[1] 
                    && new Date(s.tranDate).getMonth()+1 == label.split('-')[0] );
      }
   } 
  }
  AddPFTransaction():void{
  debugger;
    var empInvst =(document.getElementById('txtEmp')as  HTMLInputElement).value;    
    var txtPfDt = (document.getElementById('txtPfDt') as  HTMLInputElement).value;    
    var emplrInvst = (document.getElementById('txtEmplyr')as HTMLInputElement).value;    
    var pension = (document.getElementById('txtPension')as HTMLInputElement).value;    
    var trnType = (document.getElementById('trnType')as HTMLSelectElement).value;    
    var folioId = (document.getElementById('txtFolio')as HTMLInputElement).value;
    var actType = (document.getElementById('actType')as HTMLSelectElement).value;    
    //var AccountType = 3; 
    
    //var desc = (document.getElementById('txtDesc')as HTMLInputElement).value;   
    //debugger;
    //console.log(tranType);
    this._eqTransaction.postPFTransaction(txtPfDt,empInvst,this.selectedfolio,actType,pension,emplrInvst,trnType)
      .subscribe(data => {
        this.status="New Transaction added to the database.";
        setTimeout(() => {
          this.status ="";
        }, 5000);        
    });
   }
  MovePFDetails(tran:any)
  {
    //console.log(tran);
    (document.getElementById('txtEmp')as  HTMLInputElement).value =  tran.investmentEmp;
    (document.getElementById('txtEmplyr')as  HTMLInputElement).value =  tran.investmentEmplr;
    (document.getElementById('txtPension')as  HTMLInputElement).value =  tran.pension;
    (document.getElementById('txtFolio')as  HTMLInputElement).value =  tran.folioid;
    

  }

}
function getRandomValue(arg0: number, arg1: number) {
  throw new Error('Function not implemented.');
}

function getRandomColor() {
  throw new Error('Function not implemented.');
}
 

