import {Component, HostListener, Input} from '@angular/core'; 
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label,Color } from 'ng2-charts';
import {Router} from '@angular/router';
import { SharesService } from '../shares.service';
import { TypeofExpr } from '@angular/compiler';
import { type } from 'os';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';

export interface cashflow{
  monthyear:string;
  cash:number;
  dividend:number; 
}
@Component({
  selector: 'taxcompu',
  templateUrl: './taxcompu.component.html',
  styleUrls: ['./taxcompu.component.css'],
})
  
export class TaxcompuComponent {  
  
  public cashflw =[] as cashflow[];
  public cashflwMF =[] as cashflow[];
  public cashflwDMF =[] as cashflow[];
  public cashFlwTotal =[] as cashflow[]; 
  public cashFlwMonthlyTotal =[] as cashflow[];   
   
  currentMonthCashflowShr:number=0;
  currentMonthCashflowEMF:number=0;
  currentMonthCashflowDMF:number=0;
  avgMonthCashflow:number=0;
  avgOverCashFlow:number=0;
   
   
  prevMonthInvst:number=0;
  cumMonthlyAsst:number=0;
  ConsolidatedCashflow:number=0;
  pastMonth:number=6;
   
  cumDiv:number=0;
  avgDiv:number=0;
  netInvestAdded:number=0;
  timeLine=[] as string[];
  timeLinemaster=[] as string[];
  timeLineMF=[] as string[];
  timeLineMFmaster=[] as string[];
  timeLineMFD=[] as string[];
  timeLineMFDmaster=[] as string[];

  monthlyCashflowShr =[] as number[];
  monthlyCashflowMaster =[] as number[];
  monthlyDiv =[] as number[];
  monthlyDivMaster =[] as number[];
  avgDebtCashflow:number=0;
  avgEqtCashflow:number=0;
  
  monthlyCashflowEMF =[] as number[];
  monthlyCashflowDMF =[] as number[];
  monthlyCashflowMFDmaster =[] as number[]; 
  monthlyCashflowMFmaster=[] as number[];

    constructor(private _portfolio:SharesService, private router:Router) {  }    
    sortDirection: string = '';     

    ngOnInit() { 
      this._portfolio.getCashFlow(1,6)
      .subscribe(data=>{
        data.forEach(element => {          
          if(element.assettype==1)
          {
            this.netInvestAdded = element.investment-this.prevMonthInvst;
            this.currentMonthCashflowShr = element.assetValue-this.cumMonthlyAsst-this.netInvestAdded;
            let a:cashflow={ monthyear:element.qtr.toString()+"-"+element.year.toString(),cash:this.currentMonthCashflowShr,dividend:element.dividend-this.cumDiv};
            this.cashflw.push(a);

            this.timeLine.push(element.qtr.toString()+"-"+element.year.toString());
            this.monthlyCashflowShr.push(this.currentMonthCashflowShr);

            this.cumDiv = element.dividend;
            this.cumMonthlyAsst = element.assetValue;
            this.prevMonthInvst = element.investment;
          }
          else{

          }
        });
      });
    }
    changeFolio(e :any) {
     
      this.monthlyCashflowShr.length=0; 
       this.cashflwMF.length=0;
       this.cashflwDMF.length=0;
       this.cashflw.length=0;
      this.monthlyCashflowEMF.length=0;
      this.monthlyDiv.length=0;
      this.timeLine.length=0;
      this.timeLineMF.length=0;
      this.timeLineMFD.length=0;
      this.timeLineMFDmaster.length=0;
      this.timeLineMFmaster.length=0;
      this.monthlyCashflowMaster.length=0;
      this.monthlyDivMaster.length=0;
      this.monthlyCashflowMFmaster.length=0;
      this.monthlyCashflowMFDmaster.length=0;
      this.ConsolidatedCashflow =0;
      this.avgMonthCashflow=0;
      this.avgDebtCashflow=0;
      this.avgEqtCashflow=0;
      this.cashFlwMonthlyTotal.length=0;


      this._portfolio.getCashFlow(e.target.value,this.pastMonth)
      .subscribe(data=>{
        data.forEach(element => {           
                   //For share cash flow
          if(element.assettype == 1)
          {           
            this.timeLine.push(element.qtr.toString()+"-"+element.year.toString());
            this.monthlyCashflowShr.push(element.cashflow);
            this.monthlyDiv.push(element.dividend);
            
            let a:cashflow={ monthyear:element.qtr.toString()+"-"+element.year.toString(),cash:element.cashflow,dividend:element.dividend};
            this.cashflw.push(a);
   
           // console.log(element.cashflow);
            this.cashFlwMonthlyTotal.push(a);
            this.avgMonthCashflow +=  element.dividend+element.cashflow;
            this.avgDiv+= element.dividend;
                      
          }
          // For Equity MF cash flow
          else if(element.assettype==2){              

            this.timeLineMF.push(element.qtr.toString()+"-"+element.year.toString());
            this.monthlyCashflowEMF.push(element.cashflow);
            
            let a:cashflow={ monthyear:element.qtr.toString()+"-"+element.year.toString(),cash:element.cashflow,dividend:0};
            this.cashflwMF.push(a);
            this.avgEqtCashflow +=  element.cashflow;

            this.avgMonthCashflow += element.cashflow;
            let ass:string=element.qtr.toString()+"-"+element.year.toString();

            let objs=this.cashFlwMonthlyTotal.find(obj=>obj.monthyear===ass) as cashflow ;
           console.log(this.cashFlwMonthlyTotal.length);    
            if(objs)
            {             
              console.log("IN::"+ objs);    
            }
            
          }
          //For Debt MF cash flow
          else if(element.assettype==5)
          {
            this.timeLineMFD.push(element.qtr.toString()+"-"+element.year.toString());
            this.monthlyCashflowDMF.push(element.cashflow);

            let a:cashflow={ monthyear:element.qtr.toString()+"-"+element.year.toString(),cash:element.cashflow,dividend:0};
            this.cashflwDMF.push(a); 
            this.avgMonthCashflow += element.cashflow;
            this.avgDebtCashflow+= element.cashflow;
          }
        });
        this.timeLineMFmaster = Array.from( this.timeLineMF);
        this.timeLinemaster = Array.from( this.timeLine);
        this.monthlyCashflowMFDmaster = Array.from(this.monthlyCashflowDMF);
        this.monthlyCashflowMFmaster = Array.from(this.monthlyCashflowEMF);
        this.monthlyDivMaster = Array.from(this.monthlyDiv);
        this.monthlyCashflowMaster=Array.from(this.monthlyCashflowShr);
         
      });
    }

    public onSelect(option:any)
    {    
      this.router.navigate(['/']);
    }
     
    selectCashflow(option:any)
    {
      this.pastMonth=option;
      let totoalItemEMF:number;
      let totoalItemDMF:number;
      let totoalItemShr:number;
      totoalItemEMF = this.monthlyCashflowMFmaster.length;
      totoalItemDMF = this.monthlyCashflowMFDmaster.length;
      totoalItemShr=this.monthlyCashflowMaster.length;

       // console.log(this.timeLineMF);
        this.monthlyCashflowDMF.length=0;
        this.monthlyCashflowEMF.length=0;
        this.timeLineMF.length=0;
        this.timeLine.length=0;
        this.monthlyCashflowShr.length=0;
        this.monthlyDiv.length=0;

        //console.log(this.timeLineMFmaster);

        for (let i = 0; i < option; i++) {          
          
          this.timeLineMF[i]=this.timeLineMFmaster[totoalItemEMF-option+i-1];
          this.timeLine[i]=this.timeLineMFmaster[totoalItemShr-option+i-1];
          this.monthlyCashflowEMF[i]= this.monthlyCashflowMFmaster[totoalItemEMF-option+i-1];
          this.monthlyDiv[i]= this.monthlyDivMaster[totoalItemShr-option+i-1];
          this.monthlyCashflowDMF[i]=this.monthlyCashflowMFDmaster[totoalItemDMF-option+i-1];
          this.monthlyCashflowShr[i] = this.monthlyCashflowMaster[totoalItemShr-option+i-1];
        }
         
  
    }
// Showing cash flow from Shares
    public barChartOptions: ChartOptions = {
      responsive: true,
      
    };
  
    public barChartLabels: Label[] = this.timeLine; 
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
    public barChartColors: Color[] = [
      { backgroundColor: 'skyblue ' },
      { backgroundColor: '#08b100db' },
      
    ]
    public barChartData: ChartDataSets[] = [
      { data:this.monthlyCashflowShr, label: 'Shares',stack:'a' },
      { data:this.monthlyDiv, label: 'Div',stack:'a' }
      
    ];
    
 // Showing cash flow from MF
 public barChartOptionsMF: ChartOptions = {
  responsive: true,  
};
public barChartLabelsMF: Label[] = this.timeLineMF; 
public barChartTypeMF: ChartType = 'bar';
public barChartLegendMF = true;
public barChartPluginsMF = [];
public barChartColorsMF: Color[] = [
  { backgroundColor: 'green' },
  { backgroundColor: 'blue' },
  
]
public barChartDataMF: ChartDataSets[] = [
  { data:this.monthlyCashflowEMF, label: 'Equity MF',stack:'a' },
  { data:this.monthlyCashflowDMF, label: 'Debt MF',stack:'a' }
  
  
];

}

 
