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

  ngOnInit(): void {
    this.GetFolioDetails();
    this.GetExpense();
    this.GetMonthlyExpenseHistory(0);
  } 
  GetExpense()
  {
    this._shrdServ.getExpense(this.selectedfolio)
      .subscribe(data =>{ 
        console.log(data);
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
  GetMonthlyExpense(f:number, my:string)
  {
      this._shrdServ.getMonthlyExpense(f,my)
      .subscribe(data =>{ 
        console.log(data);
        this.monthlyExpense = data;
      });
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
    console.log(id);
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
