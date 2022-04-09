import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAcctType, IShareDetail } from '../ShareDetail';
import { Console } from 'console';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  data = [
    { id: 1, name: 'Deposit'},
    { id: 2, name: 'Withdrawl'}]; 
    desc = [  
      { id: 1, name: 'Salary'},
      { id: 2, name: 'Rent' },
      { id: 3, name: 'School Fee' },      
      { id: 4, name: 'Internet' },
      { id: 5, name: 'PF-Deposit' }, 
      { id: 6, name: 'PF-Int' },
      { id: 7, name: 'PPF-Deposit' },
      { id: 8, name: 'PPF-Int' },
      { id: 9, name: 'Loan Intrest' },
      { id: 99, name: 'Others' }
    ]; 
  constructor(private _eqTransaction:SharesService,private router:Router) { }
  selectedTranType: any;
  selectedDesc:any;  
  ActType=[] as IAcctType[];
  showresult: boolean = false ;
  public result=[] as any;
  public companyid: string="";
  name:string='';
  shrdetail!: IShareDetail;
  response!: string;

  ngOnInit(): void {
     
    //this.selectedDesc=1;
    //this.selectedTranType=1;
  //  this._eqTransaction.getBankType().subscribe(data=>{
   //   this.ActType =data;
   //   console.log(this.ActType);
   //   });  
  } 
  changeAccount(event:any){
    this.selectedTranType = event.target.value;
  }
  changeDesc(event:any){    
    this.selectedDesc = event.target.value;
   // console.log(this.selectedDesc);
  }

  AddTransaction():void  {
    //debugger;
    var salary =(document.getElementById('txtAmt')as  HTMLInputElement).value;
    var txtDt = (document.getElementById('txtDt') as  HTMLInputElement).value;
    var txtAcctType = (document.getElementById('txtAcctType')as HTMLInputElement).value;
    var folioId = (document.getElementById('portfolio')as HTMLInputElement).value;
    var trnType = (document.getElementById('trnType')as HTMLSelectElement).value;
    var typ = (document.getElementById('portfolio')as HTMLInputElement).value;
    var desc = (document.getElementById('txtDesc')as HTMLInputElement).value;
    
    //console.log(desc);
    
    this._eqTransaction.postBankTransaction(
      salary,desc,txtDt,trnType,txtAcctType,parseInt( folioId)
    ).subscribe(data => {
      this.response="New Transaction added to the database.";
    });

  }
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  AddNewAct():void{   
//    var salary =document.getElementById('txtAmt');
 //   var txtDt =document.getElementById('txtDt').value;
 //   var txtAcctType = document.getElementById('txtAcctType').value;
 //   var folioId = document.getElementById('portfolio').value;
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
  public getId(e:any)
  {    
    this.showresult =false;
    this.companyid=e;
    var re=this.result.filter((s: { id: any; })=>s.id==e)[0];
   // console.log(re);
    (document.getElementById("desc") as HTMLInputElement).value = re.desc;
    (document.getElementById("txtSector") as HTMLInputElement).value = re.sector;
    (document.getElementById("txtDivLink") as HTMLInputElement).value = re.divlink;
    (document.getElementById("symbol") as HTMLInputElement).value = re.shortName;
    (document.getElementById("txtName") as HTMLInputElement).value = re.fullName;     
  }
  UpdateEquity()
  {
    //debugger;
    
    var shr:IShareDetail =<IShareDetail>
    {
      desc:(document.getElementById("desc") as HTMLInputElement).value,
      divLink : (document.getElementById("txtDivLink") as HTMLInputElement).value,
      id : (document.getElementById("txtISIN") as HTMLInputElement).value,
      sector : (document.getElementById("txtSector") as HTMLInputElement).value,
      shortName : (document.getElementById("symbol") as HTMLInputElement).value,
      fullName: (document.getElementById("txtName") as HTMLInputElement).value
    
    };    
      
    this._eqTransaction.postEquityUpdate(shr)
      .subscribe(data =>{
         
        if(data==true)
        {
          this.response ="Data Added Successfully";
        }
        console.log(data);   
      });
     
  }
}
