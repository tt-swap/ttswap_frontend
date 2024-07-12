import { useEffect, useState } from "react";
import { myInvestGoodDatas, myTransactions, myDisInvestProof, myGoodDatas, myIndex } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, prettifyCurrencys, timestampSubH } from '@/graphql/util';

// 我的投资列表
export async function myInvestGoodsDatas(wallet_address: string, id: string): Promise<object> {

    const goodsDatas = await myInvestGoodDatas({ id: id, address: wallet_address.toLowerCase() });

    // let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, 6);
    // let jz = goodValue;

    let item = { items: {}, error: false, error_message: "" };

    let items: object[] = [];

    item.items = items;

    goodsDatas.data.proofStates.forEach((e: any) => {
        let base_decimals1 = powerIterative(10, e.good1.tokendecimals);
        let base_decimals2 = powerIterative(10, e.good2.tokendecimals);
        // let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

        let map = {
            id: "", name: "", symbol: "", logo_url: "", investQuantity: 0,
            totalInvestValue: 0, unitFee: 0, profit: 0, APY: 0, valueSymbol: ""
        };
        let map1 = {
            id: "", name: "", symbol: "", logo_url: "", investQuantity: 0,
            totalInvestValue: 0, unitFee: 0, profit: 0, APY: 0, valueSymbol: ""
        };

        let proofValue = 0;
        if (e.good2Quantity > 0) {
            proofValue = e.proofValue / tokendecimals;// * 2;
        } else {
            proofValue = e.proofValue / tokendecimals;
        }
        map.id = e.id;
        map.name = e.good1.tokenname;
        map.symbol = e.good1.tokensymbol;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
        map.totalInvestValue = proofValue;
        map.logo_url = iconUrl("ethereum", e.good1.erc20Address);
        map.investQuantity = e.good1Quantity / base_decimals1;
        map.unitFee = e.good1.feeQuantity / e.good1.investQuantity;
        map.profit = map.unitFee * map.investQuantity - (e.good1ContructFee / base_decimals1);
        map.APY = (map.profit / (map.investQuantity * timestampSubH(e.good1.modifiedTime))) * 365 * 100;

        items.push(map);
        if (e.good2Quantity > 0) {
            map1.id = e.id;
            map1.name = e.good2.tokenname;
            map1.symbol = e.good2.tokensymbol;
            map1.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map1.totalInvestValue = proofValue;
            map1.logo_url = iconUrl("ethereum", e.good2.erc20Address);
            map1.investQuantity = e.good2Quantity / base_decimals2;
            map1.unitFee = e.good2.feeQuantity / e.good2.investQuantity;
            map1.profit = map1.unitFee * map1.investQuantity - (e.good2ContructFee / base_decimals2);
            map1.APY = (map1.profit / (map1.investQuantity * timestampSubH(e.good2.modifiedTime))) * 365;

            items.push(map1);
        }
    });

    // console.log(item)
    return item;
}

// 我的记录列表
export async function myTransactionsDatas(wallet_address: string, id: string): Promise<object> {
    const goodsDatas = await myTransactions({ id: id, address: wallet_address.toLowerCase() });

    let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, 6);
    let jz = goodValue;


    let item = { items: {}, error: false, error_message: "", tokensymbol: "" };

    let items: object[] = [];

    item.items = items;
    item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

    goodsDatas.data.transactions.forEach((e: any) => {
        let from_decimals = powerIterative(10, e.frompargood.tokendecimals);
        let to_decimals = powerIterative(10, e.togood.tokendecimals);
        let from_price = 0;
        if (e.frompargood.currentValue > 0 || e.frompargood.currentQuantity > 0 || e.frompargood.tokendecimals > 0) {
            from_price = ((e.frompargood.currentValue / tokendecimals) / (e.frompargood.currentQuantity / from_decimals)) / jz;
        }
        let to_price = 0;
        if (e.togood.currentValue > 0 || e.togood.currentQuantity > 0 || e.togood.tokendecimals > 0) {
            to_price = ((e.togood.currentValue / tokendecimals) / (e.togood.currentQuantity / to_decimals)) / jz;
        }

        let map = {
            id: "", blockNumber: "", type: "", symbol1: "", symbol2: "", fromgoodQuanity: 0, togoodQuantity: 0,
            hash: "", totalValue: 0, time: 0, valueSymbol: ""
        };

        map.id = e.id;
        map.time = e.timestamp * 1000;
        map.blockNumber = e.blockNumber;
        map.type = e.transtype;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
        map.hash = e.hash;
        map.symbol1 = e.frompargood.tokensymbol;
        map.symbol2 = e.togood.tokensymbol;
        if (from_decimals > 0) {
            map.fromgoodQuanity = e.fromgoodQuanity / from_decimals;
        } else {
            map.fromgoodQuanity = 0;
        }
        if (to_decimals > 0) {
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

// 撤资数据
export async function myDisInvestProofGood(id: number): Promise<object> {
    const goodsDatas = await myDisInvestProof({ id: id });

    let data = {
        id: 0, isvaluegood: false,
        good1: {},
        good2: {}
    };
    let map = {
        id: 0, symbol: "", decimals: 0, quantity: 0, unitFee: 0, maxNum: 0, rate: 0,
        profit: 0, APY: 0, nowUnitFee: 0, disfee: 0, unitV: 0, logo_url: "", contructFee: 0
    }
    let map1 = {
        id: 0, symbol: "", decimals: 0, quantity: 0, unitFee: 0, maxNum: 0, rate: 0,
        profit: 0, APY: 0, nowUnitFee: 0, disfee: 0, unitV: 0, logo_url: "", contructFee: 0
    }
    data.good1 = map;
    data.good2 = map1;
    let good = goodsDatas.data.proofState;
    let good1 = good.good1;
    let decimals = powerIterative(10, 6);
    let decimals1 = powerIterative(10, good1.tokendecimals);
    let disfeeL1 = Math.floor(good1.goodConfig % (2 ** 246) / (2 ** 240)) / 10000;
    let click1 = Math.floor(good1.goodConfig % (2 ** 216) / (2 ** 206)) / 10000;
    let unitV1 = (good1.currentValue / decimals) / (good1.currentQuantity / decimals1);
    let good1N1;
    let good1N2;
    let maxNum1 = good1.currentQuantity / decimals1;
    if (click1 > 0) {
        good1N1 = (good1.currentQuantity / decimals1) / click1;
        good1N2 = (good1.currentValue / decimals) / click1 / unitV1;
        maxNum1 = good1N1 > good1N2 ? good1N2 : good1N1;
    }

    // console.log(click1, good1N2)
    data.id = good.id;
    data.isvaluegood = good1.isvaluegood;

    map.id = good1.id;
    map.symbol = good1.tokensymbol;
    map.decimals = good1.tokendecimals;
    map.quantity = good.good1Quantity / decimals1;
    map.unitFee = good.good1ContructFee / good.good1Quantity;
    map.unitV = unitV1;
    map.logo_url = iconUrl("ethereum", good1.erc20Address);
    map.nowUnitFee = good1.feeQuantity / good1.investQuantity;
    map.contructFee = good.good1ContructFee / decimals1;
    map.profit = map.nowUnitFee * map.quantity - map.contructFee;
    map.APY = (map.profit / (map.quantity * timestampSubH(good.createTime))) * 365;
    map.disfee = map.quantity * disfeeL1;
    map.maxNum = maxNum1;
    map.rate = disfeeL1;

    let good2 = good.good2;
    let decimals2 = powerIterative(10, good2.tokendecimals);
    let disfeeL2 = Math.floor(good2.goodConfig % (2 ** 246) / (2 ** 240)) / 10000;
    let click2 = Math.floor(good2.goodConfig % (2 ** 216) / (2 ** 206)) / 10000;
    let unitV2 = (good2.currentValue / decimals) / (good2.currentQuantity / decimals2);
    let good2N1;
    let good2N2;
    let maxNum2 = good2.currentQuantity / decimals2;
    if (click1 > 0) {
        good2N1 = (good2.currentQuantity / decimals2) / click2;
        good2N2 = (good2.currentValue / decimals) / click2 / unitV2;
        maxNum2 = good2N1 > good2N2 ? good2N2 : good2N1;
    }

    map1.id = good2.id;
    map1.symbol = good2.tokensymbol;
    map1.decimals = good2.tokendecimals;
    map1.quantity = good.good2Quantity / decimals2;
    map1.unitFee = good.good2ContructFee / good.good2Quantity;
    map1.unitV = unitV2;
    map1.logo_url = iconUrl("ethereum", good2.erc20Address);
    map1.nowUnitFee = good2.feeQuantity / good2.investQuantity;
    map1.contructFee = good.good2ContructFee / decimals2;
    map1.profit = map1.nowUnitFee * map1.quantity - map1.contructFee;
    map1.APY = (map1.profit / (map1.quantity * timestampSubH(good.createTime))) * 365;
    map1.disfee = map1.quantity * disfeeL2;
    map1.maxNum = maxNum2;
    map1.rate = disfeeL2;
    return data;
}


// 
export async function myIndexes(id: string, wallet_address: any): Promise<object> {
    const goodsDatas = await myIndex({ id: id, address: wallet_address.toLowerCase() });
    let items = { disinvestCount: 0, disinvestValue: 0, investCount: 0, investValue: 0, tradeCount: 0, tradeValue: 0 };
    let goodQuantity = goodsDatas.data.goodState.currentQuantity / goodsDatas.data.goodState.currentValue;
    let tokendecimals = powerIterative(10, 6);
    let data = goodsDatas.data.customer;
    items.disinvestCount = data.disinvestCount;
    items.investCount = data.investCount;
    items.tradeCount = data.tradeCount;
    items.disinvestValue = data.disinvestValue / tokendecimals * goodQuantity;
    items.investValue = data.investValue / tokendecimals * goodQuantity;
    items.tradeValue = data.tradeValue / tokendecimals * goodQuantity;
    return items;
}

export async function myGoodsDatas(params: { id: string; pageNumber: number; pageSize: number; address: string; }): Promise<object> {
    const goodsDatas = await myGoodDatas({ id: params.id, first: 10, time: timestampdToDateSub(1), skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() });

    let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, 6);
    let jz = goodValue;

    let item = { items: {}, pagination: { page_number: 0, page_size: 0, has_more: true }, error: false, error_message: "" };

    let items: object[] = [];
    let pagination = {
        has_more: true,
        page_number: 0,
        page_size: 10,
        total_count: null
    };

    item.items = items;
    item.pagination = pagination;
    item.pagination.page_number = params.pageNumber;
    item.pagination.page_size = params.pageSize;

    if (goodsDatas.data.goodStates.length < params.pageSize) {
        item.pagination.has_more = false;
    }
    goodsDatas.data.goodStates.forEach((e: any) => {
        let base_decimals = powerIterative(10, e.tokendecimals);
        let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

        let map = {
            id: "", name: "", decimals: 0, symbol: "", logo_url: "", investQuantity: 0, investValue: 0, valueSymbol: "",
            totalInvestQuantity: 0, totalInvestValue: 0, investQuantity24: 0, investValue24: 0,
            totalFee: 0, price: 0, price_24h: 0, totalFeeValue: 0, fee24: 0, feeValue24: 0, unitFee: 0, APY: 0
        };

        map.id = e.id;
        map.name = e.tokenname;
        map.symbol = e.tokensymbol;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
        map.decimals = e.tokendecimals;
        map.investQuantity = e.investQuantity / base_decimals;
        map.investValue = e.investQuantity / base_decimals * current_price;
        map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
        map.totalFee = e.feeQuantity / base_decimals;
        map.totalInvestValue = e.totalInvestQuantity / base_decimals * current_price;
        map.totalFeeValue = e.feeQuantity / base_decimals * current_price;
        map.logo_url = iconUrl("ethereum", e.id);
        map.price = current_price;
        map.unitFee = map.totalFee / map.totalInvestQuantity;

        if (e.goodData.length > 0) {
            let en = e.goodData[0];
            // e.goodData.forEach((en: any) => {
            //     if (e.id === en.pargood.id) {
            let current_price_24h = ((en.pargood.currentValue / tokendecimals) / (en.pargood.currentQuantity / base_decimals)) / jz;
            // let s = splitNumber(en.open);
            map.investQuantity24 = (e.investQuantity - en.investQuantity) / base_decimals;
            map.fee24 = (e.feeQuantity - en.feeQuantity) / base_decimals;
            map.investValue24 = (e.totalInvestQuantity - en.totalInvestQuantity) / base_decimals * current_price_24h;
            map.feeValue24 = (e.feeQuantity - en.feeQuantity) / base_decimals * current_price_24h;
            map.price_24h = current_price_24h;
            map.APY = (map.totalFee - en.feeQuantity / base_decimals) / map.totalFee * 365;
            //     }
            // });
        } else {
            map.investQuantity24 = 0;
            map.fee24 = 0;
            map.investValue24 = 0;
            map.feeValue24 = 0;
            if (map.totalFee > 0)
                map.APY = (map.totalFee - map.fee24) / map.totalFee * 365;
            map.totalFee = 0;
        }

        items.push(map);
    });


    // console.log(item)
    return item;
}