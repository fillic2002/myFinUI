import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import { CommonFunctions } from '../common/equitysearch/CommonFunctions';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css']
})
export class LandComponent implements OnInit {

  public selectedfolio!: number;
  constructor(private _eqTransaction:SharesService) { }
  propertylist!: string;
  updatedAstValue!:number;
  status: string = '';

  ngOnInit(): void {
    this.getPropertyDetails();
  }
  getPropertyDetails()
  {
    this.selectedfolio=0;
    this._eqTransaction.getPropertyTransaction(this.selectedfolio)
      .subscribe(data => {
      this.propertylist=data;
    });
  }
  updateCurrentValue(event: any,property:any)
  {
    debugger;
    const editField = event.target.innerHTML;
    this.updatedAstValue= editField.toString().replace(',','');
    /*  this.tRoi=Number(ROI.toString().replace('%','')); 
    }
    else if(property=='roi')  
    {      
      const editField = event.target.textContent.toString().replace('%','');
      this.tRoi=editField;
      this.tAmt=amt;
    }*/  
    this._eqTransaction.postLandTransaction(this.updatedAstValue,property.astId,property.qty,property.transactionDate,property.portfolioId,
    1, property.astType,property.investment).subscribe(data => {
         this.status="Account Updated Successfully!";                
    });
  
    //this.ngOnInit();
  }

}
