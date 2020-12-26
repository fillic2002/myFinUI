import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPortfolio, ITransaction } from './ShareDetail';

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
}
