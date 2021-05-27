 

export class Sort{
    private sortorder =1;
    private collator=new Intl.Collator(undefined, {
        numeric:false,
        sensitivity:"base",
    });

    constructor(){     
    }

    public startsort(order:any, type="", property:number){
        //if(order =="desc")
        //{
         //   this.sortorder=-1;            
       // }
        
        return(a,b)=>{
            console.log(property);
            return this.collator.compare(a[property],b[property])*this.sortorder;

        }
    }


}
