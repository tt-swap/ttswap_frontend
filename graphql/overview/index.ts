import { useEffect, useState } from "react";
import { getExplorer, getChainName } from '@/data/networks';
import { ecosystemChartData, parGoodDatas, InvestGoodDatas, transactions } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, splitNumber, timestampSubH } from '@/graphql/util';

let chainId = 0;
if (sessionStorage.getItem("chainId") !== null) {
    chainId = Number(sessionStorage.getItem("chainId"));
}
const blockExplorerUrls = getExplorer(chainId);
const chainName = getChainName(chainId);


// overview charts
export async function ecosystemChartDatas(id: string): Promise<object> {

    let item = { quote_currency: '', volume_chart_7d: [{}], volume_chart_30d: [{}], liquidity_chart_7d: [{}], liquidity_chart_30d: [{}] };

    if (id !== "") {
        const data = await ecosystemChartData({ id: id, eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) });
        let goodValue = data.data.goodState.currentValue / data.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        item.quote_currency = data.data.goodState.tokensymbol;
        let volume_chart_7d: object[] = [];
        let volume_chart_30d: object[] = [];
        let liquidity_chart_7d: object[] = [];
        let liquidity_chart_30d: object[] = [];

        item.volume_chart_7d = volume_chart_7d;
        item.volume_chart_30d = volume_chart_30d;
        item.liquidity_chart_7d = liquidity_chart_7d;
        item.liquidity_chart_30d = liquidity_chart_30d;

        data.data.days7.forEach((e: any) => {
            let map = { dt: 0, quote_currency: "", pretty_liquidity_quote: 0, liquidity_quote: 0 };
            let jz = e.totalInvestValue * goodValue / tokendecimals;
            map.dt = e.modifiedTime * 1000;
            map.pretty_liquidity_quote = jz;
            map.liquidity_quote = jz;
            map.quote_currency = data.data.goodState.tokensymbol;
            liquidity_chart_7d.push(map);

            let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
            let jz1 = e.totalTradeValue * goodValue / tokendecimals;
            map1.dt = e.modifiedTime * 1000;
            map1.pretty_volume_quote = jz1;
            map1.volume_quote = jz1;
            map1.quote_currency = data.data.goodState.tokensymbol;
            volume_chart_7d.push(map1);
        });
        data.data.days30.forEach((e: any) => {
            let map = { dt: 0, quote_currency: "", pretty_liquidity_quote: 0, liquidity_quote: 0 };
            let jz = e.totalInvestValue * goodValue / tokendecimals;
            map.dt = e.modifiedTime * 1000;
            map.pretty_liquidity_quote = jz;
            map.liquidity_quote = jz;
            map.quote_currency = data.data.goodState.tokensymbol;
            liquidity_chart_30d.push(map);

            let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
            let jz1 = e.totalTradeValue * goodValue / tokendecimals;
            map1.dt = e.modifiedTime * 1000;
            map1.pretty_volume_quote = jz1;
            map1.volume_quote = jz1;
            map1.quote_currency = data.data.goodState.tokensymbol;
            volume_chart_30d.push(map1);
        });
    }
    return item;
}


//物品列表
export async function GoodsDatas(params: { id: string; pageNumber: number; pageSize: number; }): Promise<object> {

    let item = { items: {}, pagination: { page_number: 0, page_size: 0, has_more: true }, error: false, error_message: "" };

    if (params.id !== "") {
        const goodsDatas = await parGoodDatas({ id: params.id, first: params.pageSize, time: timestampdToDateSub(1), skips: params.pageSize * params.pageNumber });

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

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

        if (goodsDatas.data.parGoodStates.length < params.pageSize) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.parGoodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", valueSymbol: "", totalTradeQuantity: 0,
                totalFee: 0, price: 0, price_24h: 0, totalTradeValue: 0, totalFeeValue: 0,
                tradeQuantity24: 0, fee24: 0, tradeValue24: 0, feeValue24: 0, logo_url: "", priceC_24h: 0
            };

            if (e.parGooddata.length > 0) {
                let en = e.parGooddata[0];
                // e.parGooddata.forEach((en: any) => {
                //     if (e.id === en.pargood.id) {
                let current_price_24h = ((en.pargood.currentValue / tokendecimals) / (en.pargood.currentQuantity / base_decimals)) / jz;
                // let s = splitNumber(en.open);
                // map.tradeQuantity24 = (e.totalTradeQuantity - en.totalTradeQuantity) / base_decimals;
                // map.fee24 = (e.totalProfit - en.totalProfit) / base_decimals;
                // map.tradeValue24 = (e.totalTradeQuantity - en.totalTradeQuantity) / base_decimals * current_price_24h;
                // map.feeValue24 = (e.totalProfit - en.totalProfit) / base_decimals * current_price_24h;
                map.price_24h = current_price_24h;
                //     }
                // });
            } else {
                map.tradeQuantity24 = 0;
                map.fee24 = 0;
                map.tradeValue24 = 0;
                map.feeValue24 = 0;
            }

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.decimals = e.tokendecimals;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.totalTradeQuantity = e.totalTradeQuantity / base_decimals;
            // map.totalFee = e.totalProfit / base_decimals;
            // map.totalTradeValue = e.totalTradeQuantity / base_decimals * current_price;
            // map.totalFeeValue = e.totalProfit / base_decimals * current_price;
            map.logo_url = iconUrl(chainName, e.id);
            map.price = current_price;
            map.priceC_24h = (map.price - map.price_24h) / map.price;


            items.push(map);
        });

    }
    // console.log(item,"***&&")
    return item;
}


//投资列表
export async function investGoodsDatas(params: { id: string; pageNumber: number; pageSize: number; }): Promise<object> {

    let item = { items: {}, pagination: { page_number: 0, page_size: 0, has_more: true }, error: false, error_message: "" };

    if (params.id !== "") {
        const goodsDatas = await InvestGoodDatas({ id: params.id, first: 10, time: timestampdToDateSub(1), skip: params.pageSize * params.pageNumber });

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

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

        if (goodsDatas.data.parGoodStates.length < params.pageSize) {
            item.pagination.has_more = false;
        }
        goodsDatas.data.parGoodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", logo_url: "", investQuantity: 0, investValue: 0, valueSymbol: "",
                totalInvestQuantity: 0, totalInvestValue: 0, investQuantity24: 0, investValue24: 0,
                totalFee: 0, price: 0, price_24h: 0, totalFeeValue: 0, fee24: 0, feeValue24: 0, unitFee: 0, APY: 0, unitPrice: 0
            };

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.unitPrice = (e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals);
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.decimals = e.tokendecimals;
            map.investQuantity = e.investQuantity / base_decimals;
            map.investValue = e.investQuantity / base_decimals * current_price;
            map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
            map.totalFee = e.feeQuantity / base_decimals;
            map.totalInvestValue = e.totalInvestQuantity / base_decimals * current_price;
            map.totalFeeValue = e.feeQuantity / base_decimals * current_price;
            map.logo_url = iconUrl(chainName, e.id);
            map.price = current_price;
            map.unitFee = map.totalFee / map.totalInvestQuantity;

            let uintF = e.feeQuantity / e.investQuantity;
            if (e.parGooddata.length > 0) {
                let en = e.parGooddata[0];
                // e.parGoodData.forEach((en: any) => {
                //     if (e.id === en.pargood.id) {
                let current_price_24h = ((en.pargood.currentValue / tokendecimals) / (en.pargood.currentQuantity / base_decimals)) / jz;
                // let s = splitNumber(en.open);
                map.investQuantity24 = (e.investQuantity - en.investQuantity) / base_decimals;
                map.fee24 = (e.feeQuantity - en.feeQuantity) / base_decimals;
                map.investValue24 = (e.totalInvestQuantity - en.totalInvestQuantity) / base_decimals * current_price_24h;
                map.feeValue24 = (e.feeQuantity - en.feeQuantity) / base_decimals * current_price_24h;
                map.price_24h = current_price_24h;
                map.APY = (uintF - en.feeQuantity / en.investQuantity) * 365;
                //     }
                // });
            } else {
                map.investQuantity24 = 0;
                map.fee24 = 0;
                map.investValue24 = 0;
                map.feeValue24 = 0;
                if (map.totalFee > 0)
                    map.APY = (uintF - map.fee24) * 365;
                map.totalFee = 0;
            }

            items.push(map);
        });

    }
    // console.log(item)
    return item;
}

//记录列表
export async function transactionsDatas(id: string): Promise<object> {

    let item = { items: {}, pagination: {}, error: false, error_message: "", tokensymbol: "" };
    if (id !== "") {
        const goodsDatas = await transactions({ id: id, first: 10 });

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;



        let items: object[] = [];
        let pagination = {
            "has_more": true,
            "page_number": 0,
            "page_size": 10,
            "total_count": null
        };

        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;
        item.pagination = pagination;

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
            // @ts-ignore
            map.hash = blockExplorerUrls[0] + "/tx/" + e.hash;
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
            if (e.transtype === "buy" || e.transtype === "pay") {
                map.totalValue = map.fromgoodQuanity * from_price;
            } else {
                map.totalValue = (map.fromgoodQuanity * from_price) + (map.togoodQuantity * to_price);
            }
            // console.log(map.fromgoodQuanity,"********",from_price,"***",map.togoodQuantity,"**",to_price)
            items.push(map);
        });
    }

    // console.log(item,"********")
    return item;
}
