import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharesService } from '../shares.service';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/en-IN';
registerLocaleData(localeIn);

@Component({
  selector: 'app-bankdetail',
  templateUrl: './bankdetail.component.html',
  styleUrls: ['./bankdetail.component.css']
})
export class BankdetailComponent implements OnInit {
  public accDetail =[] as any;
  public filterAcct =[] as any;
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
  
  constructor(private _acct:SharesService, private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this._acct.getBankAcDetails()
    .subscribe(data =>{ 
      this.accDetail = data;    
      var to:number=0;
      
      for (var i = 0; i < this.accDetail.length; i++) {        
        
        if(this.accDetail[i].userid==1)
        { 
          //console.log(this.accDetail[i].acctType)
          if(this.accDetail[i].acctType=="Liquid" || this.accDetail[i].acctType=="FD")
            {
              this.rcash += parseFloat(this.accDetail[i].amt);
              
            }
          else if(this.accDetail[i].acctType=="people provident fund")
            {this.rppf += parseFloat(this.accDetail[i].amt);}
          else if(this.accDetail[i].acctType=="providend fund")
            {this.rpf += parseFloat(this.accDetail[i].amt);}
        }
        else
        {
          if(this.accDetail[i].acctType=="Liquid"|| this.accDetail[i].acctType=="FD")
            {this.gcash += parseFloat(this.accDetail[i].amt);}
          else if(this.accDetail[i].acctType=="people provident fund")
            {this.gppf += parseFloat(this.accDetail[i].amt);}
          else if(this.accDetail[i].acctType=="providend fund")
            {this.gpf += parseFloat(this.accDetail[i].amt);}
        }
      }
      this.at=this.rcash+this.rpf+this.rppf+this.gcash+this.gpf+this.gppf;
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
  public onFilter(e:any)
  {
    console.log(e.target.value);
    if(e.target.value==2)
    {
      this.cash=this.gcash;
      this.pf=this.gpf;
      this.ppf =this.gppf;
    }
    else{
      this.cash=this.rcash;
      this.pf=this.rpf;
      this.ppf =this.rppf;
    }
    this.at=0;
    this.filterAcct=this.accDetail.filter((acct: { userid: number; }) => acct.userid==e.target.value);
    for (var i = 0; i < this.filterAcct.length; i++) {
      this.at=this.at+parseFloat(this.accDetail[i].amt);
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
    console.log(this.tRoi+","+this.tAmt+","+this.tId ); 
    this.AddTransaction();
    this.status="Account Updated Successfully!";
  }
  onChange(item:string,event:any)
  {
    //console.log(item);
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
}
