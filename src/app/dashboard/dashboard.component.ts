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
  public preMonthDshbrd = [] as any;  
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
  netAddition:number=0;
  monthyr:string="";
  
  constructor(private _dashbrd:SharesService,private route:ActivatedRoute,private router:Router) { }
 
  ngOnInit(): void {
    this._dashbrd.getDashBoard()
    .subscribe(data=>{
        this.dbDetail = data;
        //console.log(this.dbDetail);
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
   
    this._dashbrd.getAssetsHistory(0)
    .subscribe(ast =>{ 
      ast.forEach(element => {
        this.assetValues.push(element.assetValue.toFixed(2));
        this.assetXaxis.push(element.month+"-"+element.year);
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
//------------------- Asset History ----------------------------------
    public barChartOptions: ChartOptions = { 
      responsive: true,
    };  
    public barChartLabels: Label[] = this.assetXaxis; 
    public barChartType: ChartType = 'line';
    public barChartLegend = true; 
    public barChartPlugins = [];
    
    public assetHistory: ChartDataSets[] = [
      { data:this.assetValues, label: 'Current Asset' },
      { data:this.invstValues, label: 'investment' },    
    ];
//-------------------Pie Chart-------------------------------=----------
public pieChartOptions: ChartOptions = { 
  responsive: true,
};

public pieChartLabels: Label[] = this.assetName;  
public pieChartType: ChartType = 'bar';
public pieChartLegend = true;
public pieChartPlugins = [];
public pieChartColors: Array < any > = [{
  backgroundColor: ['#ed5210', 'green','#00b38a','lightblue','#6667ab','	#d31461','lightgreen','orange','#afb0d3', 'blue'], 
}];
public pieChartData: ChartDataSets[] = [
  { data:this.assetValue, label: 'Current Value' },       
];

//-------------------Asset return-----------------------------------------
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
public chartClick(e: any): void {
  if (e.active.length > 0) {
    this.netAddition=0;
    const chart = e.active[0]._chart;
    const activePoints = chart.getElementAtEvent(e.event);
    if ( activePoints.length > 0) {
      // get the internal index of slice
      const clickedElementIndex = activePoints[0]._index;
      const label = chart.data.labels[clickedElementIndex];
      this.monthyr=label;
      // get value by index
      const value = chart.data.datasets[0].data[clickedElementIndex];     
      this.assetValue.length=0
      this.assetName.length=0
      this._dashbrd.getMonthDashBoard(label.split('-')[0], label.split('-')[1])
      .subscribe(data=>{
          this.dbDetail = data;
          //console.log(this.dbDetail);
          var to:number; 
          to=0;
          for (var i = 0; i < this.dbDetail.length; i++) {
            to= to + parseFloat(this.dbDetail[i].currentValue);       
            this.assetValue.push(this.dbDetail[i].currentValue);
            this.assetName.push(this.dbDetail[i].assetName);          
          }         
          this.total=to.toFixed(2);
        });
      this._dashbrd.getMonthDashBoard(label.split('-')[0]-1, label.split('-')[1])
      .subscribe(data=>{
          this.preMonthDshbrd = data;                    
          for (var i = 0; i < this.preMonthDshbrd.length; i++) {          
            this.preMonthDshbrd[i].diff=this.dbDetail[i].currentValue- this.preMonthDshbrd[i].currentValue
            this.netAddition +=this.preMonthDshbrd[i].diff;
          }         
        });
      }
      }
}
}
