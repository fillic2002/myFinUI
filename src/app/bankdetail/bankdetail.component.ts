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
  public at:  any;
   
  constructor(private _acct:SharesService, private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this._acct.getBankAcDetails()
    .subscribe(data =>{ 
      this.accDetail = data;    
      var to:number;
      to=0;
      for (var i = 0; i < this.accDetail.length; i++) {
        to= to + parseFloat(this.accDetail[i].amt); 
       
      }
      this.at=to.toFixed(2);
    });
  }
  AddTransaction():void  {

    alert(document.getElementById('txtUserId'));
   this._acct.postAcTransaction(
    document.getElementById('txtUserId'),
     document.getElementById('txtId'),
     document.getElementById('txtRoi'),
     document.getElementById('txtAmt'),
     document.getElementById('txtDt')
   
   )
    .subscribe(data => {
     // var status= document.getElementById('status')
      //status=data;
                         
    })    
  }
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }

}
