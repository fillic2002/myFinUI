export interface IShareDetail
{
    id: Int32Array
    shortName: string
    fullName:string
    livePrice:number
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
    sector:string
}
export interface ITransaction
{
    equityid: number
    price: number
    equityName:string
    qty:number
    tranDate:Date
    tranType:string
     
}
export interface IDashboard
{
     Id:number
     assetName:string
     invested:string
     currentValue:string
}
export interface IFolio
{
    folioID:number
    folioName:string     
}
export interface IBankAcDetail
{
    acctId:number
    amt:number
    roi:number 
    transactionDate:Date
    acctName:string
    acctType:string
    userid:number
}
export interface IAssetHistory
{
    portfolioId: number,
    assetValue: number,
    dividend: number,
    investment:number,
    qtr: number,
    year: number,
    qty: number
}