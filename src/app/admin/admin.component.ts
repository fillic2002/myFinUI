import { Component, OnInit } from '@angular/core';
import { SharesService } from '../shares.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAcctType, IShareDetail } from '../ShareDetail';
import { Console } from 'console';
import { EquitysearchComponent } from '../common/equitysearch/equitysearch.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  TypeOfTran = [
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
  expType!:string; 
  expTypes=[] as any;
  folios=[] as any;
  folioId:number=1;
  public selectedfolio!: number;
  public expType1!: number;
  showContainer: number = 1; 
  
  ngOnInit(): void {
    this.GetExpenseType();
    this.GetFolioDetails();

  } 
  changeAccount(event:any){
    this.selectedTranType = event.target.value;
    this.response="";
  }
  changeDesc(event:any){    
    this.selectedDesc = event.target.value;
    this.response="";
  }   
  public selectnext(option:any)
  {
    if(option='Expense')   
      this.router.navigate(['/expense']);
    if(option='Tax')   
      this.router.navigate(['/tax']);
  }
  AddPropertyTran():void{
    var amt =(document.getElementById('propertAmt')as  HTMLInputElement).value;    
    var txtDt = (document.getElementById('txtPropertyTranDt') as  HTMLInputElement).value;    
    var asstType = (document.getElementById('asstType')as HTMLSelectElement).value;    
    var trnType = (document.getElementById('prpTranType')as HTMLSelectElement).value;    
    
    this._eqTransaction.postPropertyTransaction(amt,txtDt,trnType,asstType,this.selectedfolio)
    .subscribe(data => {
    this.response="New Property Transaction added to the database.";
  });
  }
  AddBondDetails(){
  debugger;
    var bondName =(document.getElementById('bondName')as  HTMLInputElement).value;
    var minInvst = (document.getElementById('minInvst') as  HTMLInputElement).value;    
    var bondID = (document.getElementById('bondID')as HTMLInputElement).value;    
    var coupon = (document.getElementById('couponrt')as HTMLInputElement).value;
    var facevalue = (document.getElementById('ytm')as HTMLInputElement).value;
    var dom = (document.getElementById('dtOfMaturity')as HTMLInputElement).value;
    
    this._eqTransaction.postBondDetails(bondName,bondID,coupon,facevalue,minInvst,dom)
    .subscribe(data => {
       this.response="New Transaction added to the database.";
    }); 
  }
  toggleContainer(containerNumber: number): void {
    this.showContainer = containerNumber;
  }
  AddBondTran()  
  {
    // /debugger;
    var tranType =(document.getElementById('bondTranType')as  HTMLInputElement).value;
    var price = (document.getElementById('bondPurAmt') as  HTMLInputElement).value;    
    var bondID = (document.getElementById('bondId')as HTMLInputElement).value;    
    //var coupon = (document.getElementById('coupon')as HTMLInputElement).value;
    var qty = (document.getElementById('bondPurQty')as HTMLInputElement).value;
    var dt = (document.getElementById('bondPurchaseDt')as HTMLInputElement).value;

    this._eqTransaction.postTransaction(price,bondID,qty,dt,this.selectedfolio,tranType,9,0,0)
    .subscribe(data => {
        this.response="New Transaction added to the database.";
    }); 
  }
  AddTransaction():void{
  
    var salary =(document.getElementById('txtAmt')as  HTMLInputElement).value;    
    var txtDt = (document.getElementById('txtDt') as  HTMLInputElement).value;    
    var txtAcctType = (document.getElementById('txtAcctType')as HTMLInputElement).value;    
    var trnType = (document.getElementById('trnType')as HTMLSelectElement).value;    
    
    var desc = (document.getElementById('txtDesc')as HTMLInputElement).value;   
    //console.log(desc);
    this._eqTransaction.postBankTransaction(salary,desc,txtDt,trnType,txtAcctType,this.selectedfolio)
      .subscribe(data => {
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
    <unknown>{
      desc: (document.getElementById("desc") as HTMLInputElement).value,
      divLink: (document.getElementById("txtDivLink") as HTMLInputElement).value,
      id: (document.getElementById("txtISIN") as HTMLInputElement).value,
      sector: (document.getElementById("txtSector") as HTMLInputElement).value,
      shortName: (document.getElementById("symbol") as HTMLInputElement).value,
      fullName: (document.getElementById("txtName") as HTMLInputElement).value
      
    };    
      
    this._eqTransaction.postEquityUpdate(shr)
      .subscribe(data =>{
         
        if(data==true)
        {
          this.response ="Data Added Successfully";
        }
        //console.log(data);   
      });
     
  }
  AddExpenseType()
  {
    this._eqTransaction.AddExpenseType(this.expType)
    .subscribe(data=>{
      //console.log(data);   
    });
    this.GetExpenseType();
  }

  AddExpense()
  {
    var desc=(document.getElementById("txtExpDesc") as HTMLInputElement).value;
    var dtOfTran=(document.getElementById("txtExpDt") as HTMLInputElement).value;
    var amt=(document.getElementById("expamt") as HTMLInputElement).value;    

    this._eqTransaction.AddExpense(desc,this.selectedfolio,parseFloat(amt), new Date(Date.parse(dtOfTran)),this.expType1)
    .subscribe(data=>{
     // console.log(data);
      if(data=="fasle")
      { this.response="Expense Added failed."; }       
      else{this.response="Expense Added Successfully."; }
        
    });
    this.GetExpenseType();
  }

  GetExpenseType()
  {
    this._eqTransaction.getExpenseType()
    .subscribe(data=>{
      this.expTypes =data;
      //console.log(this.expTypes);
    });
  }
GetFolioDetails()
{
  this._eqTransaction.getAllfolio()
    .subscribe(data=>{
      this.folios =data;
      console.log(data);
    }); 
}
 
}
