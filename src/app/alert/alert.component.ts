import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common/equitysearch/CommonFunctions';
import { SharesService } from '../shares.service';
import { debug } from 'console';
import { DateTime } from '@syncfusion/ej2-angular-charts';
import { divHistory } from '../portfolio/portfolio.component';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  showContainer: number = 1; 
  response!: string;
  showresult: boolean = false ;
  public companyid: string=""; 
  isShown: boolean = true;
  public result=[] as any; 
  analysisObj:any; 
  note:any;
  TypeOfTran= [] as any;
  listOfAnalysis= [] as any;
  reportType: { key: string, value: string }[] = [
    { key: '1', value: 'Financial Report' },
    { key: '2', value: 'Rating' },
    { key: '3', value: 'Transcript Conf Call' }    
  ];
  yr: string[] = ['2020', '2021', '2022', '2023','2024'];
  selectedReportType: string = '';
  selectedEquity=[] as any;
  notesByAssetId: { [key: string]: { notes: string[], dates: string[] } } = {};
  notesAssetId=[] as any;

  public share=[] as any;
  public companyDividend=[] as divHistory[]; 
  divDt=[] as any[];
  divVal=[] as number[];
  dividendTotal:number=0;
  eqtTrandt=[] as Date[];
  eqtQty=[] as number[];

  constructor(public commonFunctions: CommonFunctions,private _sharedService:SharesService,public datepipe: DatePipe) { }

  ngOnInit(): void { 
    //this.GetAnalysis();
    this._sharedService.currentData.subscribe(data => this.selectedEquity = data);
  } 
   
  SeachAnalysis()
  {
    this.GetDividendDetails();
    this.GetYearlyEqtInvst();
    this.GetAnalysis();
  }
  GetAnalysis()
  {
    debugger;
    this._sharedService.getAnalysis(this.selectedEquity[0].assetId).subscribe(data=>{
      this.listOfAnalysis=data; 
      console.log(data);  
      //this.notesByAssetId = this.groupNotesAndDatesByAssetId(this.listOfAnalysis); 
    });
  }
  GetDividendDetails(){
    let year:number=0;  
    this._sharedService.getDividend(this.selectedEquity[0].assetId)
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
  } 
  updateList(event: any,note: any) {
   debugger;
    this.note = event.target.textContent;    
    //var astId = this.listOfAnalysis.find(a=>a.equity.equityName===asstName);
    this._sharedService.UpdateAnalysis(note.analysisID, this.note,this.selectedEquity[0].assetId )
    .subscribe(data => {
       this.response="Notes modified for asset name ::" + this.selectedEquity[0].assetId ;
    }); 
    setTimeout(() => {
      this.response ="";
    }, 5000);  
  }
  onChange( event: any) {
    
    this.note = event.target.textContent;
  }
   
  toggleContainer(containerNumber: number): void { 
    this.showContainer = containerNumber;
  }
  onItemChange(event: any) {
    this.selectedReportType = event.target.value;
  }  
  AddAlertType(){
   
    var alertName =(document.getElementById('alertType')as  HTMLInputElement).value;
    
    this._sharedService.AddAlertType(alertName)
    .subscribe(data => {
       this.response="New Transaction added to the database."; 
    });
  }
  AddAnalysis(){ 
    
    var dt =(document.getElementById('txtPfDt')as  HTMLInputElement).value;
    var yr = (document.getElementById('yrDropdwn') as HTMLSelectElement).value;     
    var notes = (document.getElementById('commentBox') as HTMLInputElement).value;
    //var revwType = this.selectedReportType;
     
    this._sharedService.AddAnalysis(dt, yr,notes, this.selectedReportType,this.selectedEquity[0].assetId )
    .subscribe(data => {
       this.response="New Analysis added to the database for ::"+ this.selectedEquity[0].equityName; 
    }); 
    setTimeout(() => {
      this.response ="";
    }, 5000); 
  } 
  public getId(e:any)
  {    
    this.showresult =false;
    this.companyid=e;
   // alert(e);
  }
  public getasset(e:any)
  {    
    if(e.target.value.length>2)
    {    
      this.showresult =true;
      this._sharedService.getShare(e.target.value)
      .subscribe(data =>{
        this.result = data;
      });
    }
  }
  GetYearlyEqtInvst()
  {
    this._sharedService.getYrlyEqtInvestment(0,this.selectedEquity[0].assetId)
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
  }
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

}
