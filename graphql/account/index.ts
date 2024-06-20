import { useEffect, useState } from "react";
import { myInvestGoodDatas,myTransactions } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl,splitNumber,timestampSubH } from '@/graphql/util';

// 我的投资列表
export async function myInvestGoodsDatas(wallet_address: string): Promise<object> {
    
    const goodsDatas = await myInvestGoodDatas({ id: 1, time: timestampdToDateSub(1),address:wallet_address });

    let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, 6);
    let jz = goodValue;

    let item = { items: {}, error: false, error_message: "" };

    let items: object[] = [];

    item.items = items;

    goodsDatas.data.proofStates.forEach((e: any) => {
        let base_decimals1 = powerIterative(10,e.good1.tokendecimals);
        let base_decimals2 = powerIterative(10,e.good2.tokendecimals);
        // let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;
        
        let map = {
            id: "", name: "", symbol: "", logo_url:"", investQuantity:0,
            totalInvestValue: 0, unitFee: 0, profit: 0, APY:0,valueSymbol:""
        };
        let map1 = {
            id: "", name: "", symbol: "", logo_url:"", investQuantity:0,
            totalInvestValue: 0, unitFee: 0, profit: 0, APY:0,valueSymbol:""
        };

        let proofValue = 0;
        if (e.good2Quantity >0) {
            proofValue = e.proofValue / tokendecimals;// * 2;
        } else {
            proofValue = e.proofValue / tokendecimals;
        }
        map.id = e.id;
        map.name = e.good1.tokenname;
        map.symbol = e.good1.tokensymbol;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
        map.totalInvestValue = proofValue;
        map.logo_url = iconUrl("ethereum",e.good1.erc20Address);
        map.investQuantity = e.good1Quantity / base_decimals1;
        map.unitFee = e.good1.feeQuantity / e.good1.investQuantity;
        map.profit = map.unitFee * map.investQuantity - (e.good1ContructFee / base_decimals1);
        map.APY =( map.profit / (map.investQuantity * timestampSubH(e.good1.modifiedTime)) )*365 *100;

        items.push(map);
        if (e.good2Quantity >0) {
            map1.id = e.id;
            map1.name = e.good2.tokenname;
            map1.symbol = e.good2.tokensymbol;
            map1.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map1.totalInvestValue = proofValue;
            map1.logo_url = iconUrl("ethereum",e.good2.erc20Address);
            map1.investQuantity = e.good2Quantity / base_decimals2;
            map1.unitFee = e.good2.feeQuantity / e.good2.investQuantity;
            map1.profit = map1.unitFee * map1.investQuantity - (e.good2ContructFee / base_decimals2);
            map1.APY =( map1.profit / (map1.investQuantity * timestampSubH(e.good2.modifiedTime)) )*365;
    
            items.push(map1);
        }
    });

// console.log(item)
    return item;
}

// 我的记录列表
export async function myTransactionsDatas(wallet_address: string): Promise<object> {
    const goodsDatas = await myTransactions({ id: 1, address:wallet_address });

    let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, 6);
    let jz = goodValue;
    

    let item = { items: {},  error: false, error_message: "", tokensymbol:""};

    let items: object[] = [];

    item.items = items;
    item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

    goodsDatas.data.transactions.forEach((e: any) => {
        let from_decimals = powerIterative(10,e.frompargood.tokendecimals);
        let to_decimals = powerIterative(10,e.togood.tokendecimals);
        let from_price =0;
        if (e.frompargood.currentValue >0 || e.frompargood.currentQuantity >0 ||e.frompargood.tokendecimals > 0) {
            from_price =((e.frompargood.currentValue / tokendecimals) / (e.frompargood.currentQuantity / from_decimals)) / jz;
        }
        let to_price = 0;
        if (e.togood.currentValue >0 || e.togood.currentQuantity >0 ||e.togood.tokendecimals > 0) {
            to_price = ((e.togood.currentValue / tokendecimals) / (e.togood.currentQuantity / to_decimals)) / jz;
        }

        let map = {
            id: "", blockNumber: "", type: "", symbol1: "",symbol2: "",fromgoodQuanity:0,togoodQuantity:0,
            hash:"",totalValue:0,time:0,valueSymbol:""
        };

        map.id = e.id;
        map.time = e.timestamp * 1000;
        map.blockNumber = e.blockNumber;
        map.type = e.transtype;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
        map.hash = e.hash;
        map.symbol1 = e.frompargood.tokensymbol;
        map.symbol2 = e.togood.tokensymbol;
        if (from_decimals >0) {
            map.fromgoodQuanity = e.fromgoodQuanity / from_decimals;
        } else {
            map.fromgoodQuanity = 0;
        }
        if (to_decimals >0) {
            map.togoodQuantity = e.togoodQuantity / to_decimals;
        } else {
            map.togoodQuantity = 0;
        }
        map.totalValue = (map.fromgoodQuanity * from_price) + (map.togoodQuantity * to_price)
        // console.log(map.fromgoodQuanity,"********",from_price,"***",map.togoodQuantity,"**",to_price)
        items.push(map);
    });


    // console.log(item,"********")
    return item;
}