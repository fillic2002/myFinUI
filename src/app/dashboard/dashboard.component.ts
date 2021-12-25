import { Component,ViewChild, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';
import {Router} from '@angular/router';  
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';

registerLocaleData(localeIn);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  
})
export class DashboardComponent implements OnInit {
 
 
  public dbDetail = [] as any;
  public assetValue =[] as number[];
  public assetName=[] as string[];
  public bankAmt: any;
  public total: any;
  assetValues=[] as any;
  invstValues=[] as any; 
  assetXaxis=[] as any;
  astReturn=[] as any;
  yearReturn=[] as any;
  public assetId=0 as number;
  asttype:string | undefined;
  
  constructor(private _dashbrd:SharesService,private route:ActivatedRoute,private router:Router) { }
 
  ngOnInit(): void {
    this._dashbrd.getDashBoard()
    .subscribe(data=>{
        this.dbDetail = data;
        var to:number;
        to=0; 
        for (var i = 0; i < this.dbDetail.length; i++) {
          to= to + parseFloat(this.dbDetail[i].currentValue);       
          this.assetValue.push(this.dbDetail[i].currentValue);
          this.assetName.push(this.dbDetail[i].assetName);          
        }         
        this.total=to.toFixed(2);
       }); 
       this.asttype="All";
  /*  this._dashbrd.getBankAcTotal()
    .subscribe(data =>{ 
      this.bankAmt = data;
      var to:number;
      to=0;
      for (var i = 0; i < this.dbDetail.length; i++) {
        to= to + parseFloat(this.dbDetail[i].total);       
      }
      console.log(Number(this.bankAmt.amt));
      to= to + Number(this.bankAmt.amt);
      this.total=to.toFixed(2);

    });
*/
    this._dashbrd.getAssetsHistory(1)
    .subscribe(ast =>{ 
      ast.forEach(element => {
        this.assetValues.push(element.assetValue.toFixed(2));
        this.assetXaxis.push(element.qtr+"-"+element.year);
        this.invstValues.push(element.investment.toFixed(2));        
      }); 
    });
    this._dashbrd.getAssetsReturn(this.assetId)
    .subscribe(rtn=>{
      rtn.forEach(element => {
        this.astReturn.push(element.return.toFixed(2)); 
        this.yearReturn.push(element.year); 
      });
       
    }); 
  }
  public showReturn(assetName:string)
  {
    this.astReturn.length=0;
    this.yearReturn.length=0;
    console.log(assetName);
    if(assetName=="Shares") 
    {
      this.assetId=1;
      this.asttype="Shares"
    }
    else if(assetName=="PF")
    {
      this.assetId=3;this.asttype="PF"
    }
    else if(assetName=="PPF")
    {
      this.assetId=4;this.asttype="PPF"
    }else if(assetName=="Equity MF")
    {
      this.assetId=2;this.asttype="Equity MF"
    }else if(assetName=="Debt MF")
    {
      this.assetId=5;this.asttype="Debt MF"
    }else if(assetName=="Plot")
    {
      this.assetId=7;this.asttype="Plot"
    }else if(assetName=="Gold")
    {
      this.assetId=12;this.asttype="Gold"
    }


      this._dashbrd.getAssetsReturn(this.assetId)
    .subscribe(rtn=>{
      rtn.forEach(element => {
        this.astReturn.push(element.return.toFixed(2)); 
        this.yearReturn.push(element.year); 
      });
     
    });
    

  }
  public onSelect(option:any)
  {  
    this.router.navigate(['/']);
  } 

  showTotal():void{     
    }
    public getTrColor(x:any):string
    {   
      if(parseFloat(x)>=0)
            return 'green';
      else
        return 'red'      
    }
//------------------- Bar Chart ----------------------------------
    public barChartOptions: ChartOptions = { 
      responsive: true,
    };  
    public barChartLabels: Label[] = this.assetXaxis; //['"'+this.assetName[0]+'"', '2016', '2017', '2018', '2019', '2020'];
    public barChartType: ChartType = 'line';
    public barChartLegend = true; 
    public barChartPlugins = [];
    
    public barChartData: ChartDataSets[] = [
      { data:this.assetValues, label: 'Current Asset' },
      { data:this.invstValues, label: 'investment' },    
    ];
//-------------------Pie Chart-------------------------------=----------
public pieChartOptions: ChartOptions = { 
  responsive: true,
};

public pieChartLabels: Label[] = this.assetName;  
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [];
public pieChartColors: Array < any > = [{
  backgroundColor: ['lightred', 'green','red','blue','lightgreen','lightblue','orange','pink','darkgrey', 'rgba(148,159,177,0.2)'], 
}];
public pieChartData: ChartDataSets[] = [
  { data:this.assetValue, label: 'Current Value' },      
];

//-------------------Bar Chart-------------------------------=----------
public chartOptions: ChartOptions = { 
  responsive: true,
};

public chartLabels: Label[] =  this.yearReturn;  
public chartType1: ChartType = 'bar';
public chartLegend1 = true;
public chartPlugins1 = []; 

public chartColors1: Color[] = [
  { backgroundColor: '#a05195 ' },
  { backgroundColor: '#08b100db' },     
]
public chartDataset1: ChartDataSets[] = [
  { data:this.astReturn, label: 'Return' },      
];
}
