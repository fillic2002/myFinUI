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
  public salryFlw =[] as number[];
  public flw =[] as any[];
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
  pastMonth:number=12;
   
  cumDiv:number=0;
  avgDiv:number=0;
  netInvestAdded:number=0;
  timeLine=[] as string[];
  timeLineCashOut=[] as string[];
  timeLinemaster=[] as string[];
  timeLineMF=[] as string[];
  timeLineMFmaster=[] as string[];
  timeLineMFD=[] as string[];
  timeLineMFDmaster=[] as string[];

  monthlyCashflowShr =[] as number[];
  monthlyCashflowEqtMF =[] as number[];
  monthlyCashflowDebtMF=[] as number[];
  
  monthlyCashflowOut =[] as number[];
  monthlyCashflowMaster =[] as number[];
  monthlySalary =[] as number[];
  monthlyDividend =[] as number[];
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

      this.changeFolio(0);
      /*this._portfolio.getCashFlow({ folioId: 0, pastmonth: 12 })
      .subscribe(data=>{
        data.forEach(element => {      
          //console.log(element.flow);  
          var cashF=0;
          var div=0;
          this.flw = element.flow;   
          element.flow.forEach(e => {           
            cashF+= e.cashflow +e.dividend;
            //div+=e.dividend;
          });
         
            let a:cashflow={ monthyear:element.qtr.toString()+"-"+element.year.toString(),cash:cashF,dividend:div};
            this.cashflw.push(a);

            this.timeLine.push(element.qtr.toString()+"-"+element.year.toString());
             
        });
      });*/
    }



    changeFolio(e :any) {
     
      this.monthlyCashflowShr.length=0; 
      this.cashflwMF.length=0;
      this.cashflwDMF.length=0;
      this.cashflw.length=0;
      this.monthlyCashflowEMF.length=0;
      this.monthlySalary.length=0;
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
      this.monthlyDividend.length=0;
      this.timeLineCashOut.length=0;
      this.monthlyCashflowOut.length=0; 
this.monthlyCashflowDebtMF.length=0;

      this._portfolio.getCashFlow({ folioId: e.target.value, pastmonth: this.pastMonth })
      .subscribe(data=>{
        data.forEach(element => {           
          var cashFShares:number=0;
          var cashEqtMF:number=0;
          var cashDebtMF:number=0;
          var salary=0;
          var div=0;
          this.flw = element.flow;   
          element.flow.forEach(e => {
            //console.log(e); 
            if(e.assettype==6)
              salary +=e.cashflow;
            else if(e.assettype==1)
            {
              cashFShares+= e.cashflow;              
              div+= e.dividend;
            }
            else if(e.assettype==2)
            {
              cashEqtMF+= e.cashflow;              
              div+= e.dividend;
            }
            else if(e.assettype==5)
            {
              cashDebtMF+= e.cashflow;              
              div+= e.dividend;
            }
          }); 
          //console.log(element.qtr.toString()+"-"+element.year.toString());    
          this.timeLine.push(element.month.toString()+"-"+element.year.toString());
          this.monthlyCashflowShr.push(cashFShares.toFixed(2));
          this.monthlySalary.push(salary);
          this.monthlyCashflowDebtMF.push(cashDebtMF.toFixed(2));          
          this.monthlyCashflowEqtMF.push(cashEqtMF.toFixed(2));
          this.monthlyDividend.push(div);
            
          let a:cashflow={ monthyear:element.month.toString()+"-"+element.year.toString(),cash:cashFShares,dividend:salary};
          this.cashflw.push(a);
  
          //console.log(element.cashflow);
          this.cashFlwMonthlyTotal.push(a);
          this.avgMonthCashflow +=  salary+cashFShares;
          this.avgDiv+= salary;                       
          
        });
        this.timeLineMFmaster = Array.from( this.timeLineMF);
        this.timeLinemaster = Array.from( this.timeLine);
        this.monthlyCashflowMFDmaster = Array.from(this.monthlyCashflowDMF);
        this.monthlyCashflowMFmaster = Array.from(this.monthlyCashflowEMF); 
        this.monthlyDivMaster = Array.from(this.monthlySalary);
        this.monthlyCashflowMaster=Array.from(this.monthlyCashflowShr);         
      }); 

     this._portfolio.getCashFlowOut( e.target.value, this.pastMonth)
      .subscribe(
        data=>{          
          data.forEach(element => {  
            var cashF:number=0; 
            this.timeLineCashOut.push(element.month.toString()+"-"+element.year.toString());
            element.flow.forEach(e => {               
              cashF +=e.cashflow;              
            }); 
            this.monthlyCashflowOut.push(cashF.toFixed(2));
          });
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
        this.monthlySalary.length=0;

        //console.log(this.timeLineMFmaster);

        for (let i = 0; i < option; i++) {          
          
          this.timeLineMF[i]=this.timeLineMFmaster[totoalItemEMF-option+i-1];
          this.timeLine[i]=this.timeLineMFmaster[totoalItemShr-option+i-1];
          this.monthlyCashflowEMF[i]= this.monthlyCashflowMFmaster[totoalItemEMF-option+i-1];
          this.monthlySalary[i]= this.monthlyDivMaster[totoalItemShr-option+i-1];
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
      { backgroundColor: '#D1E9D8 ' },
      { backgroundColor: '#F0A2BC' },
      { backgroundColor: '#E9E5B8' },
      { backgroundColor: '#FA7BA8' },
      { backgroundColor: '#F8D8E3' },
       
    ]
    public barChartData: ChartDataSets[] = [
      { data:this.monthlySalary, label: 'DepositBank',stack:'a' },
      { data:this.monthlyCashflowShr, label: 'Shares',stack:'a' },
      { data:this.monthlyCashflowEqtMF, label: 'eqtMF',stack:'a' },      
      { data:this.monthlyCashflowDebtMF, label: 'DebtMF',stack:'a' },
      { data:this.monthlyDividend, label: 'Dividend',stack:'a' }      
     
    ];
    
 // Showing cash flow from MF
 public barChartOptionsMF: ChartOptions = {
  responsive: true,  
};
public barChartLabelsMF: Label[] = this.timeLineCashOut; 
public barChartTypeMF: ChartType = 'bar';
public barChartLegendMF = true;
public barChartPluginsMF = [];
public barChartColorsMF: Color[] = [
  { backgroundColor: '#cfa46b' },
  { backgroundColor: '#cfa46b' },
  
]
public barChartDataMF: ChartDataSets[] = [
  { data:this.monthlyCashflowOut, label: 'Cash Out',stack:'a' },
  
  
];

}

 
