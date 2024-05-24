import { useEffect, useState } from "react";
import { ecosystemChartData, parGoodDatas } from '@/graphql/article';
import { timestampdToDateSub, powerIterative, iconUrl } from '@/graphql/data.processing.util';
// x的n次方
export async function ecosystemChartDatas(): Promise<object> {
    // useEffect(() => {
    const data = await ecosystemChartData({ id: 1, eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) });
    let goodValue = data.data.goodState.currentValue / data.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, data.data.goodState.tokendecimals);
    let item = { volume_chart_7d: {}, volume_chart_30d: {}, liquidity_chart_7d: {}, liquidity_chart_30d: {} };

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
    // console.log(item,"##")
    return item;
    // });


}


export async function GoodsDatas(): Promise<object> {
    const goodsDatas = await parGoodDatas({ id: 1, first: 10, time: timestampdToDateSub(1) });

    let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    let tokendecimals = powerIterative(10, goodsDatas.data.goodState.tokendecimals);
    let jz = goodValue / tokendecimals;

    let item = { items: {}, pagination: {}, error: false, error_message: "" };

    let items: object[] = [];
    let pagination = {
        "has_more": true,
        "page_number": 0,
        "page_size": 10,
        "total_count": null
    };

    item.items = items;
    item.pagination = pagination;

    goodsDatas.data.parGoodStates.forEach((e: any) => {
        
        let map = {
            id: "", name: "", decimals: 0, symbol: "", totalTradeQuantity: 0,
            totalFee: 0, price: 0, totalTradeValue: 0, totalFeeValue: 0,
            tradeQuantity24: 0, fee24: 0, tradeValue24: 0, feeValue24: 0, logo_url:""
        };

        if (goodsDatas.data.parGoodDatas.lenght > 0) {
            goodsDatas.data.parGoodDatas.forEach((en: any) => {
                if (e.id===en.pargood.id) {
                    map.tradeQuantity24 = e.totalTradeQuantity - en.totalTradeQuantity;
                    map.fee24 = e.totalProfit - en.totalProfit;
                    map.tradeValue24 = (e.totalTradeQuantity - en.totalTradeQuantity) * jz;
                    map.feeValue24 = (e.totalProfit - en.totalProfit) * jz;
                }
            });
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
        map.totalTradeQuantity = e.totalTradeQuantity;
        map.totalFee = e.totalProfit;
        map.totalTradeValue = e.totalTradeQuantity * jz;
        map.totalFeeValue = e.totalProfit * jz;
        map.logo_url = iconUrl("ethereum",e.id);
        map.price = e.totalProfit;


        items.push(map);
    });


    console.log(item)
    return item;
}
