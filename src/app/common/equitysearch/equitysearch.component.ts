import { Component, OnInit } from '@angular/core';
import { SharesService } from 'src/app/shares.service';

@Component({
  selector: 'app-equitysearch',
  templateUrl: './equitysearch.component.html',
  styleUrls: ['./equitysearch.component.css']
})
export class EquitysearchComponent implements OnInit {

  constructor(private _eqTransaction:SharesService) { }
  showresult: boolean = false ;  
  public companyid: string="";
  public result=[] as any;
  public selectedvalue =[] as any;

  ngOnInit(): void {


  }
  public getId(e:any)
  {    
   
    this.showresult =false;
    this.companyid=e;
    this.selectedvalue =this.result.filter(s=>s.assetId==e);    
   // alert(e);
  } 
  public getasset(e:any)
  {    
    if(e.target.value.length>2)
    {    
      this.showresult =true;
      this._eqTransaction.getShare(e.target.value)
      .subscribe(data =>{
        this.result = data;
      });
    }
  }
  UpdateEquity()
  {
    
    console.log(this.selectedvalue);
    this._eqTransaction.postEquityUpdate(this.selectedvalue[0])
      .subscribe(data =>{
        
      });
  }

}
