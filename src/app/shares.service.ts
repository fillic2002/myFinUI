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

  postTransaction(configdata):Observable<any>{
    //var trandata =new ITransaction();
    console.log(configdata.value);
    return this.client.post("http://localhost:59921/transaction",{ equityid: configdata.value,
    price: 165.50,
    equityName:"ITC",
    qty:25
    })  
  }
  getDashBoard():Observable<IDashboard[]>{
    return this.client.get<IDashboard[]>("http://localhost:59921/dashboard")  
  }

}
