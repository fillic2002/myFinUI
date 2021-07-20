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

    public barChartOptions: ChartOptions = { 
      responsive: true,
    };
  
    public barChartLabels: Label[] = this.assetName; //['"'+this.assetName[0]+'"', '2016', '2017', '2018', '2019', '2020'];
    public barChartType: ChartType = 'pie';
    public barChartLegend = true;
    public barChartPlugins = [];
    public barChartColors: Array < any > = [{
      backgroundColor: ['lightred', 'green','red','blue','lightgreen','lightblue','orange','pink','darkgrey', 'rgba(148,159,177,0.2)'], 
   }];
    public barChartData: ChartDataSets[] = [
      { data:this.assetValue, label: 'Current Value' },      
    ];

}
