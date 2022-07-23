import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../shares.service';
import {Router} from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import { debug } from 'console';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

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
  public purchaseOption: any="B";
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
  public yearMF =[] as number[];
  public invstMF =[] as number[];
  public yearDebt =[] as number[];
  public invstDebt =[] as number[];
  public monthlyInvstShr =[] as number[];
  public monthlyInvstEqtMF =[] as number[];
  public monthlyInvstDebtMF =[] as number[];
  public monthlyInvstPF =[] as number[];
  public monthlyInvstPPF =[] as number[];

  invstmnt=[] as number[];
  intrest=[] as number[];
  pfinvstmnt=[] as number[];
  pfintrest=[] as number[];
  year=[] as number[];
  month=[] as string[];
 
  showresult: boolean = false ;
  qty: any;
  direction:string="asc";
  //isMF:boolean=false;
  isShare:boolean=true;
  currentDt:Date | undefined;

  constructor(private _eqTransaction:SharesService,private route:ActivatedRoute,private  router:Router) { }

  ngOnInit(): void {
    this.GetFolioDetails();
    this.getMonthlyInvestment();
    this.invstDebt.length=0;
    this.invstEqt.length=0;
    this.invstMF.length=0;
    this._eqTransaction.getTransaction(0)
    .subscribe(data =>{
     this.equitytransaction = data
     this.filterPortfolio=data;
     //console.log(this.filterPortfolio);
     var to:number;
     to=0;  
     for (var i = 0; i < this.equitytransaction.length; i++) {
       to= to + parseFloat(this.equitytransaction[i].price)*parseFloat(this.equitytransaction[i].qty);        
     }
     this.eqtotal=to.toFixed(2);     
    }); 

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

    this.intrest.length=0;
    this.invstmnt.length=0;
    this._eqTransaction.getPFAcDetails('0', 4)
    .subscribe(data =>{       
      this.PFAcctDetails=data;       
      data.forEach(element=>{
        //console.log(element);
        this.addYear(element.year);         
        if(element.typeOfTransaction=="int") 
          { 
            var inv:number=0;
            inv= element.investmentEmplr+element.investmentEmp;     
            this.intrest.push(inv);   
        }else if(element.typeOfTransaction=="deposit")
          {
            var inv:number=0;
            inv= element.investmentEmplr+element.investmentEmp;     
            this.invstmnt.push(inv);        
          }
        });       
    });  
    
    this.pfintrest.length=0;
    this.pfinvstmnt.length=0;
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
  }
  getMonthlyInvestment()
  {
    this._eqTransaction.getMonthlyInvstment(0,12)
    .subscribe(data=>{
      data.forEach(element=>{
        
        console.log(element);
        if(this.month.findIndex(x=>x==element.month+"-"+element.year) < 0)
        {          
          this.month.push(element.month+"-"+element.year);  
        }        
        if(element.assetId==1){
          this.monthlyInvstShr.push(element.invested.toFixed(1))        
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
      this.assetId = document.getElementById('txtName');
    }
    debugger; 
    this.qty = document.getElementById('txtQty');
    var PB = document.getElementById('txtPB');
    this.qty=this.qty.value.replace(',','');
    var mv=document.getElementById('txtMaretCap');
    this._eqTransaction.postTransaction(document.getElementById('txtPrice'),
          this.assetId,
          this.qty,
          document.getElementById('txtDt'), 
          this.selectedfolio,
          this.purchaseOption,
          this.assetType,
          PB,mv
      ) 
    .subscribe(data => {
     var status= document.getElementById('status')
     this.status="Record "+this.purchaseOption+" Successfully for: "+this.assetId +" in portfolio: "+this.selectedfolio;

     this.ngOnInit();      
    })
     
    document.getElementById('status').style.display='block';
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
    this.status="";
    
    this.selectedfolio=e.target.value;
    //console.log(this.selectedfolio);
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
         this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===1);
     else  
         this.filterPortfolio =  this.equitytransaction.filter(s => s.assetType===2 ||s.assetType===5 );
    });
    this.intrest.length=0;
    this.invstmnt.length=0;
    this._eqTransaction.getPFAcDetails('2', 4)
    .subscribe(data =>{       
      this.PFAcctDetails=data;
      data.forEach(element=>{
      this.addYear(element.year);         
      if(element.typeOfTransaction=="int")
        { 
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.intrest.push(inv);   
      }else if(element.typeOfTransaction=="Deposit")
        {
          var inv:number=0;
          inv= element.investmentEmplr+element.investmentEmp;     
          this.invstmnt.push(inv);        
        }
      });       
    });
    
  }
  private addYear(yr:number)
  {     
    var found=this.year.indexOf(yr);
    if(found < 0)
    {
      this.year.push(yr);
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
  public deleterecord(id:any,dt:any)
  {
    if(confirm("Are you sure to delete ")) {    
    
    this._eqTransaction.deleteTransaction(id, dt)
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
  public getTrColor(x:any):string
  {   
    if(x=='B')
          return '#08b100db';
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

          //console.log(this.filterPortfolio );
  }
   
   //.................... Shares Investment........................
   public barChartOptions: ChartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Net Investment"
    }    
  };
  public barChartLabels: Label[] = this.yearEqt.reverse(); 
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartColors: Color[] = [
    { backgroundColor: '#BFA584' },
    { backgroundColor: '#f08080' },
    { backgroundColor: '#3cb371' },
    
              
  ]
  public invstShrDataSet: ChartDataSets[] = [
    { data:this.invstDebt, label: 'Debt MF' },
    { data:this.invstMF, label: 'Eqty MF' },   
    { data:this.invstEqt, label: 'Shares'  },
    
    
  ];

   //.................... MF Investment........................
  /* public barChartOptions1: ChartOptions = {
    responsive: true,    
  };

  public barChartLabels1: Label[] = this.yearMF; 
  public barChartType1: ChartType = 'bar';
  public barChartLegend1 = true;
  public barChartPlugins1 = [];
  public barChartColors1: Color[] = [
    { backgroundColor: '#D3BF8D' },
    { backgroundColor: '#08b100db' },     
  ]
  public invstMFDataSet: ChartDataSets[] = [
    { data:this.invstMF, label: 'Investment in Eqty MF',stack:'a' }
     
  ];
  //.................... Debt Investment........................
  public barChartOptions2: ChartOptions = {
    responsive: true,    
  };

  public barChartLabels2: Label[] = this.yearDebt; 
  public barChartType2: ChartType = 'bar';
  public barChartLegend2 = true;
  public barChartPlugins2 = [];
  public barChartColors2: Color[] = [ 
    { backgroundColor: '#889BB8' },
    { backgroundColor: '#D7E2E8' },     
  ]
  public invstDebtDataSet: ChartDataSets[] = [
    { data:this.invstDebt, label: 'Investment in Debt MF',stack:'a' }
     
  ];*/
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
  { data:this.invstmnt, label: 'Investment',stack:'a' },        
  { data:this.intrest, label: 'Intrest',stack:'a' },   
  
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
  { backgroundColor: '#726762 ' },
  { backgroundColor: '#BFA584 ' },
  { backgroundColor: '#667D8B ' },
  { backgroundColor: '#8295AD ' },
  { backgroundColor: '#D1CDC4 ' }
]
public mnthInvstDataSet: ChartDataSets[] = [
  { data:this.monthlyInvstShr, label: 'Shares',stack:'inv' },
  { data:this.monthlyInvstEqtMF, label: 'EqtMF',stack:'inv' },
  { data:this.monthlyInvstDebtMF, label: 'DebtMF',stack:'inv' },
  { data:this.monthlyInvstPF, label: 'PF',stack:'inv' },
  { data:this.monthlyInvstPPF, label: 'PPF',stack:'inv' }
];

 //--------------------PF Investment -----------------------
public pfChartOptions: ChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: "PF Investment"
  }
};
public pfChartLabels: Label[] = this.year; 
public pfChartType: ChartType = 'bar';
public pfChartLegend = false;
public pfChartPlugins = [];
public pfChartColors: Color[] = [
  { backgroundColor: 'skyblue ' },
  { backgroundColor: '#08b100db' },     
]

public pfDataSet: ChartDataSets[] = [
  { data:this.pfinvstmnt, label: 'Investment',stack:'a' },        
  { data:this.pfintrest, label: 'Intrest',stack:'a' },     
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
     // console.log(typeOfinvst);
      if(typeOfinvst=="Debt MF")
      {
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.assetType == 5);
      }
      if(typeOfinvst=='Shares')
      {       
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.assetType == 1);
      }
      if(typeOfinvst=="Eqty MF")
      {
        this.filterPortfolio =  this.equitytransaction.filter(s => new Date(s.tranDate).getFullYear()==label && s.assetType == 2);
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
 
}
