export interface IShareDetail
{
    id: Int32Array
    shortName: string
    fullName:string
}
export interface IPortfolio
{
    id: Int32Array
    avgprice: Number
    equityname:string
    qty:number
}
export interface ITransaction
{
    equityid: Int32Array
    price: Number
    equityName:string
    qty:number
    tranDate:Date
}