export interface IShareDetail
{
    id: string
    shortName: string
    equityname:string
    livePrice:number
    desc:string
    divLink:string
    sector:string
}
export interface IPortfolio
{
    trasactionId: number
    avgprice: number
    //equityname:string
    qty:number
    //livePrice:number
    profit:number
    percentage:number
    equityType:number
    dividend:number
    //sector:string
    //EquityId:string
    xirr:number
    eq:IShareDetail
}
export interface ITransaction
{
    equityid: number
    price: number
    equityName:string
    qty:number
    tranDate:Date
    tranType:string
    assetType:number
    pb:number
    marketcap:number
    portfolioId:number
    totalShare:number
    ownership:number
}
export interface IDashboard
{
     Id:number
     assetName:string
     invested:string
     currentValue:string
     XirrReturn:number
     diff:number
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
    month: number,
    year: number,
    qty: number,
    assettype:number,
    profitCurrentyear:number
}

export interface IDividend
{
    dt: Date,
    divValue: number,
    companyid: string,
    eqt:IAsset
}

export interface ICashflow
{
    portfolioId: number,
    month: number,
    year: number,    
    flow:IAssetFlow[]
}
export interface IAssetFlow
{    
    cashflow: number,
    dividend: number,        
    assettype:number
}

export interface IAssetReturn
{
    portfolioId: number,
    year: number,
    return:number,
    dividend:number,
    xirr:number
}
export interface IPfAcct
{
    dateOfTransaction: Date,    
    investmentEmp: number,    
    InvestmentEmplr:number,
    pension:number,
    folioid:number,
    balance:number,
    typeOfTransaction:string,
    year:number,
    month:number
}
export interface IAcctType
{
    acctTypeId: Date,    
    BankName: number,    
    acctType:number
}
export interface IAsset
{
    equityName:string,
    equityId:string,
    symbol:string,
    livePrice:number,
    description:string;
    sector:string;
    PB :number,
    MarketCap:number,
    freefloat :number,
}

     