import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SharesService } from '../shares.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {

  constructor(private _shrdServ:SharesService,private router:Router) { }
  
  selectedfolio:number=0;
  folios=[] as any;
  monthYear=[] as string[];
  expAmt=[] as number[];
  monthlyExpense=[] as any[]; 
  public expType1!: number;
  expType!:string;
  public expTypes=[] as any;
  selectedValues: any[] = [];
  public selectedFile: File | null = null;
  selectedTranType!: string

  ngOnInit(): void {
    this.GetFolioDetails();
    this.GetExpenseType();
    this.GetExpense();
    this.GetMonthlyExpenseHistory(0);
  }
  changeAccount(event:any){   
    this.selectedTranType = event.target.value;    
  }
  CopyOver(e:any)
  {    
    (document.getElementById("txtExpDesc") as HTMLInputElement).value= e.desc;
    (document.getElementById("expamt") as HTMLInputElement).value=e.amt;
  } 
  GetExpenseType()
  {
    this._shrdServ.getExpenseType()
    .subscribe(data=>{
      this.expTypes =data;        
    });
  
  }
  AddExpense()
  {
    var desc=(document.getElementById("txtExpDesc") as HTMLInputElement).value;
    var dtOfTran=(document.getElementById("txtExpDt") as HTMLInputElement).value;
    var amt=(document.getElementById("expamt") as HTMLInputElement).value;    

    this._shrdServ.AddExpense(desc,this.selectedfolio,parseFloat(amt), new Date(Date.parse(dtOfTran)),this.expType1)
    .subscribe(data=>{
     // console.log(data);
      if(data=="false")
      { this.response="Expense Added failed."; }       
      else{this.response="Expense Added Successfully."; }
        
    });
    this.GetExpenseType();
  }
  GetExpense()
  {
    this._shrdServ.getExpense(this.selectedfolio)
      .subscribe(data =>{ 
        //console.log(data);
      });
  } 
  public onSelect(option:any)
  {    
    this.router.navigate(['/']);
  }
  GetMonthlyExpenseHistory(f:number)
  { 
    this.expAmt.length =0;
    this.monthYear.length=0;
    this._shrdServ.getMonthlyExpenseHistory(f,6)
    .subscribe(data =>{
      data.forEach(element => { 
        this.monthYear.push(element.monthYear);
        this.expAmt.push(element.totalExpAmt);
        //console.log( this.monthYear); 
      });  
    });
  }
  UpdateExpense(expItem: any)
  {    
    expItem.expenseType =  this.selectedTranType;
    console.log(expItem);
    this._shrdServ.updateMonthlyExpense(expItem)
    .subscribe(data =>{ 
      console.log(data);
      expItem.editRow=false;
    });
  }
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(event: any) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this._shrdServ.fileUpload(this.selectedFile,0)
      .subscribe(data =>{ 

      });
      console.log(this.selectedFile);
    }
   
   
  }
  GetMonthlyExpense(f:number, my:string)
  { 
      this._shrdServ.getMonthlyExpense(f,my)
      .subscribe(data =>{ 
        console.log(data);
        this.monthlyExpense = data; 
        this.selectedValues =data.map((x: { expenseType: string; })=>x.expenseType);
        console.log(this.selectedValues);
        this.monthlyExpense.forEach(item => {
          item.isEdit = false;
        });
      });
  }
  editRow(item:any)
  {  
    item.isEdit = true;
  }

GetFolioDetails()  
{
  this._shrdServ.getAllfolio()
    .subscribe(data=>{
      this.folios =data;      
    });   
 } 

changeFolio(e:any)
 {
  this.GetExpense();
  this.GetMonthlyExpense(this.selectedfolio,"6-2022");
  this.GetMonthlyExpenseHistory(this.selectedfolio);
 }
 historyClick(e:any)
 {   
  if (e.event.type == "click") {
    const clickedIndex = e.active[0]?.index; 
    var lbl=e.active[0]._chart.getElementAtEvent(event)[0]._model.label;
    this.GetMonthlyExpense(this.selectedfolio, lbl);     
  }
  
 }
 public deleterecord(id:any)
  {
    //console.log(id);
    if(confirm("Are you sure to delete ")) {        
      this._shrdServ.deleteExpense(id)
        .subscribe(data =>{
          this.monthlyExpense = data;   
           
        });
    } 
    this.ngOnInit();
  }
 public selectnext(option:any)
  {    
    this.router.navigate(['/admin']);  
  }

//-------------------  Monthly Expense ----------------------------
public expLbl: Label[] = this.monthYear; 
public expType: ChartType = 'bar';
public barChartLegend = true;
public expPlugins = [];
public expColors: Color[] = [
  { backgroundColor: 'green ' },
  { backgroundColor: '#08b100db' },     
]
public getMonthlyExpense:ChartDataSets[] = [
  { data:this.expAmt, label: 'Expense',stack:'a' }    
]; 
public expOption: ChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: "Expense Over Time"
  }
};
}
