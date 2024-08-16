import { Component, OnInit } from '@angular/core';
import { SharesService } from 'src/app/shares.service';

@Component({
  selector: 'eqt-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  isShown: boolean = true;
  showresult: boolean = false ;
  public result=[] as any;
  public companyid: string="";
 
  constructor(private _sharedService:SharesService) { }

  ngOnInit(): void {
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
    public getId(e:any)
    {    
      
      this.showresult =false;
      this.companyid=e;
      this._sharedService.changeData(this.result.filter(x=>x.assetId===this.companyid));
    } 
}
