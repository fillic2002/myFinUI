import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharesService {

  constructor() { }

  public getShares(){
    return[
      {"id":1,"name":"EPL","NoOfShare":1},
      {"id":2,"name":"TML","NoOfShare":2}
    ]

  }
}
