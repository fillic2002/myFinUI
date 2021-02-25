export interface IShareDetail
{
    id: Int32Array
    shortName: string
    fullName:string
    livePrice:Number
}
export interface IPortfolio
{
    trasactionId: number
    avgprice: number
    equityname:string
    qty:number
    livePrice:number
    profit:number
    percentage:number
    equityType:number
    dividend:number
}
export interface ITransaction
{
    equityid: Number
    price: Number
    equityName:string
    qty:number
    tranDate:Date
    tranType:string
     
}
export interface IDashboard
{
     Id:Number
     assetName:string
     total:string
}
export interface IFolio
{
    folioID:Number
    folioName:string     
}
export interface IBankAcDetail
{
    acctId:Number
    amt:Number
    roi:Number 
    transactionDate:Date
    acctName:string
    acctType:string
    userid:number
}