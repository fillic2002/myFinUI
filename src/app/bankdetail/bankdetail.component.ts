import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharesService } from '../shares.service';
import { registerLocaleData } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {Color, Label } from 'ng2-charts';
import localeIn from '@angular/common/locales/en-IN';
import { Console } from 'console';
registerLocaleData(localeIn);

@Component({
  selector: 'app-bankdetail',
  templateUrl: './bankdetail.component.html',
  styleUrls: ['./bankdetail.component.css']
})
export class BankdetailComponent implements OnInit {
  public accDetail =[] as any;
  public filterAcct =[] as any;
  public PFAcctDetails =[] as any;
  invstmnt=[] as number[];
  intrest=[] as number[];
  year=[] as number[];
  acctType=[] as string[];
  return=[] as number[];
  public at:any;
  public rcash:number=0;
  public rpf:number=0;
  public rppf:number=0;
  public cash:number=0;
  public pf:number=0;
  public ppf:number=0;
  public gcash:number=0;
  public gpf:number=0;
  public gppf:number=0;
  public show:boolean = false;
  public buttonName:any = 'Show';
  public editField:string='';

  public tAmt:number=0;
  public tRoi:number=0;
  public tUserid:number=1;
  public tId:number=1;
  public tdt:Date= new Date();
  status:string="";
  private _userselected: string = "";
  public get userselected(): string {
    return this._userselected;
  }
  public set userselected(value: string) {
    this._userselected = value;
  }  
  accountselected:string="";
  
  constructor(private _acct:SharesService, private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this._acct.getBankAcDetails()
    .subscribe(data =>{ 
      this.accDetail = data;    
      var to:number=0;       
      for (var i = 0; i < this.accDetail.length; i++) {   

        //this.acctType.push(this.accDetail[i].acctName+'-'+this.accDetail[i].acctType);
        if(this.return.indexOf(this.accDetail[i].roi.toFixed(2))< 0)
        {
          this.return.push(this.accDetail[i].roi.toFixed(2));  
          this.acctType.push(this.accDetail[i].acctName+'-'+this.accDetail[i].acctType);
        }
        
        if(this.accDetail[i].acctType=="People Provident Fund")
          {this.ppf += parseFloat(this.accDetail[i].amt);}
        else if(this.accDetail[i].acctType=="Providend Fund")
          {this.pf += parseFloat(this.accDetail[i].amt);}
        else{
          this.cash += parseFloat(this.accDetail[i].amt);}           
      }
      this.at=this.cash+this.pf+this.ppf;
      this.filterAcct = this.accDetail;
    });
    
  }
  AddTransaction():void  {    
    this._acct.postAcTransaction(
     this.tUserid,
     this.tId,
     this.tRoi,
     this.tAmt,
     this.tdt
   )
    .subscribe(data => {
     // var status= document.getElementById('status')
      //status=data;                
    })
    this.ngOnInit(); 
  }
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  public ChangeAccount(e:any)
  {    
    this.at=0;
    //console.log(this.accDetail.length);
    this.filterAcct=this.accDetail.filter((acct: { userid: number; }) => acct.userid==e.target.value);
    for (var i = 0; i < this.filterAcct.length; i++) {
      this.at=this.at+parseFloat(this.accDetail[i].amt);
    }
    this.filterPF(e.target.value);
  }
  public filterPF(act:number)
  {
    this.pf =0;
    this.ppf=0;
    this.cash=0;

    this.accDetail.forEach((x:any) => {
     if(x.acctType=="People Provident Fund" && x.userid==act)
      {
        this.ppf+=x.amt;
      }else if(x.acctType=="Providend Fund" && x.userid==act)
      {
        this.pf+=x.amt;
      }else if((x.acctType=="Liquid" || x.acctType=="FD")&& x.userid==act)
      {
        this.cash +=x.amt;   
      }
    });
   // this._acct.getPFAcDetails()
   // .subscribe(data =>{ 
   //   this.accDetail = data;    
   //   var to:number=0; 
   // });

  }
  public SelectAccount(actname:string, userid:string)
  {     
    this._userselected = userid;
    this.year.length=0;this.intrest.length=0;this.invstmnt.length=0;
    this.accountselected = actname;    
    var actType;
    if(actname=='PPF')
      actType=4; 
      if(actname=='PF')
      actType=3;
    this._acct.getPFAcDetails(userid, actType)
    .subscribe(data =>{      
      this.PFAcctDetails=data;
      //console.log(this.PFAcctDetails);
      data.forEach(element=>{
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
  }
  private addYear(yr:number)
  {     
    var found=this.year.indexOf(yr);
    if(found < 0)
    {
      this.year.push(yr);
    }   
  }
  public showTrans() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  changeValue(acctId: number, property: string, event: any) {
    this.editField = event.target.textContent;    
  }
  updateList(event: any,acctId: number,property: string,user:number,ROI:string,amt:number) {
    
    const editField = event.target.textContent;    
    this.tUserid = user;
    this.tId=acctId;
    if(property=='amt')
    {
      this.tAmt= editField.toString().replace(',','');
      this.tRoi=Number(ROI.toString().replace('%',''));
    }
    else if(property=='roi')
    {      
      const editField = event.target.textContent.toString().replace('%','');
      this.tRoi=editField;
      this.tAmt=amt;
    }
  
    this.AddTransaction();
    this.status="Account Updated Successfully!";
  }
  onChange(item:string,event:any)
  {
     
    if(item=='amt') 
    {
      this.tAmt = event.target.value;       
    }
    else if(item=='roi')
    {
      this.tRoi = event.target.value;
    }
    else if(item=='userid')
    {
      this.tUserid = event.target.value;
    }
    else if(item=='id')
    {
      this.tId = event.target.value;
    }
    else if(item=='dt')
    {
      this.tdt = event.target.value;
    }    
  }
  
  //--------------------Investment vs intrest data -----------------------
  public ChartOptions: ChartOptions = {
    responsive: true,
  };
  public ChartLabels: Label[] = this.year; 
  public ChartType: ChartType = 'bar';
  public ChartLegend = true;
  public ChartPlugins = [];
  public ChartColors: Color[] = [
    { backgroundColor: 'skyblue ' },
    { backgroundColor: '#08b100db' },     
  ]
  
  public invstVsintrestData: ChartDataSets[] = [
    { data:this.invstmnt, label: 'Investment',stack:'a' },        
    { data:this.intrest, label: 'Intrest',stack:'a' },     
    
  ];
 //--------------------Return Matrix -----------------------
 public returnOptions: ChartOptions = {
  responsive: true,
};
public returnLbl: Label[] = this.acctType; 
public returnType: ChartType = 'bar';
public returnLegend = true;
public returnPlugins = [];
public returnColors: Color[] = [
  { backgroundColor: 'skyblue ' },
  { backgroundColor: '#08b100db' },     
]
public returnmatrix: ChartDataSets[] = [
  { data:this.return, label: 'Bank Return',stack:'a' }   
];

}
