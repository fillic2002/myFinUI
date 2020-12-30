import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction,IDashboard } from './ShareDetail';

@Injectable({
  providedIn: 'root'
})
export class SharesService {
 
  constructor(private client:HttpClient) { }

   getPortfolio():Observable<IPortfolio[]>{
    return this.client.get<IPortfolio[]>("http://localhost:59921/portfolio")  
  }
  getTransaction():Observable<ITransaction[]>{
    return this.client.get<ITransaction[]>("http://localhost:59921/transaction")  
  }

  postTransaction(price:any,name:any,qty:any,dt:any):Observable<any>{
    //var trandata =new ITransaction();
    console.log(dt.value);
    return this.client.post("http://localhost:59921/transaction",{ equityid: 1,
    price: parseFloat( price.value),
    equityName:name.value,
    qty:parseFloat(qty.value),
    tranDate:new Date(Date.parse(dt.value))
    })  
  }
  getDashBoard():Observable<IDashboard[]>{
    return this.client.get<IDashboard[]>("http://localhost:59921/dashboard")  
  }

}
