export interface IShareDetail
{
    id: Int32Array
    shortName: string
    fullName:string
    livePrice:Number
}
export interface IPortfolio
{
    trasactionId: Number
    avgprice: Number
    equityname:string
    qty:number
    livePrice:Number
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
}