import { useEffect, useState } from "react";
import { SwapTokens } from "@/shared/types/token";
import { parGoodDatas } from './graphql';
import { powerIterative, iconUrl } from '@/graphql/util';


//物品列表
export async function GoodsDatas(params: { id: string; sel: string }): Promise<object> {

    // console.log(params,7777)
    let item: SwapTokens = {
        tokenValue: [],
        tokens: []
    };
    if (params.id) {

        const goodsDatas = await parGoodDatas({ id: params.id, sel: params.sel });

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;


        let items: object[] = [];
        let items1: object[] = [];

        // @ts-ignore
        item.tokenValue = items;
        // @ts-ignore
        item.tokens = items1;

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0, currentValue: 0,
                buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: "",
            };
            map.id = e.id;
            map.name = e.tokenname;
            map.decimals = e.tokendecimals;
            map.symbol = e.tokensymbol;
            map.currentQuantity = e.currentQuantity;
            map.currentValue = e.currentValue;
            map.logo_url = iconUrl("ethereum", e.erc20Address);
            map.address = e.erc20Address;
            map.price = current_price;
            map.buyFee = Math.floor(e.goodConfig % (2 ** 240) / (2 ** 233)) / 10000;
            map.sellFee = Math.floor(e.goodConfig % (2 ** 233) / (2 ** 226)) / 10000;
            items.push(map);
        });

        goodsDatas.data.parGoodStates.forEach((e: any) => {
            let map = {
                id: "", name: "", symbol: "", logo_url: "", address: "", children: {}
            };
            let children: object[] = [];
            map.children = children;
            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.logo_url = iconUrl("ethereum", e.erc20Address);
            map.address = e.erc20Address;

            e.Goodlist.forEach((en: any) => {
                let map1 = {
                    id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0, currentValue: 0,
                    buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: ""
                };
                let base_decimals = powerIterative(10, en.tokendecimals);
                let current_price = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;


                map1.id = en.id;
                map1.name = en.tokenname;
                map1.decimals = en.tokendecimals;
                map1.symbol = en.tokensymbol;
                map1.currentQuantity = en.currentQuantity;
                map1.currentValue = en.currentValue;
                map1.logo_url = iconUrl("ethereum", en.erc20Address);
                map1.address = en.erc20Address;
                map1.price = current_price;
                map1.buyFee = Math.floor(en.goodConfig % (2 ** 240) / (2 ** 233)) / 10000;
                map1.sellFee = Math.floor(en.goodConfig % (2 ** 233) / (2 ** 226)) / 10000;
                children.push(map1);
            });
            items1.push(map);
        });
    }

    // console.log(item,"***&&")
    return item;
}

