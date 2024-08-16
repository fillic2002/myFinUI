import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class CommonFunctions {


    constructor(private router: Router) { }

    public onSelect(option: any) {
        this.router.navigate(['/']);
    }

}
