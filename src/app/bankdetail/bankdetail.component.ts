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
      var to:number;
      to=0;
      for (var i = 0; i < this.accDetail.length; i++) {
        //to= to + parseFloat(this.accDetail[i].acctType);
        
        if(this.accDetail[i].userid==1)
        { 
          console.log(this.accDetail[i].acctType)
          if(this.accDetail[i].acctType=="Liquid")
            {this.rcash += parseFloat(this.accDetail[i].amt);}
          else if(this.accDetail[i].acctType=="people provident fund")
            {this.rppf += parseFloat(this.accDetail[i].amt);}
          else if(this.accDetail[i].acctType=="providend fund")
            {this.rpf += parseFloat(this.accDetail[i].amt);}
        }
        else
        {
          if(this.accDetail[i].acctType=="Liquid")
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
      status              
    })
    this.ngOnInit();
  }
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  public onFilter(e:any)
  {
    
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
  updateList(acctId: number, property: string, event: any) {
    const editField = event.target.textContent.replace('%','');
    
    this.accDetail[acctId][property] = editField;
    
    //console.log(this.accDetail[acctId]['amt'].split(',').join(''));

    this.tUserid = this.accDetail[acctId]['userid'];
    this.tId= this.accDetail[acctId]['acctId'];
    this.tRoi= this.accDetail[acctId]['roi'];
    this.tAmt= this.accDetail[acctId]['amt'].split(',').join('');
        
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
