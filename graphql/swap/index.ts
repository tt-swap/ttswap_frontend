import { getExplorer, getChainName } from '@/data/networks';
import { SwapTokens } from "@/shared/types/token";
import { parGoodDatas,newGoodsPrices } from './graphql';
import { powerIterative, iconUrl } from '@/graphql/util';
import BigNumber from 'bignumber.js';

// let chainId = 0;
// if (sessionStorage.getItem("chainId") !== null) {
//     chainId = Number(sessionStorage.getItem("chainId"));
// }
// const blockExplorerUrls = getExplorer(chainId);



//物品列表
export async function GoodsDatas(params: { id: string; sel: string;par:number },ssionChian:number): Promise<object> {

    const chainName = getChainName(ssionChian);
    // console.log(params,7777)
    let item: SwapTokens = {
        tokenValue: [],
        tokens: []
    };
    if (params.id !== "") {

        const goodsDatas = await parGoodDatas({ id: params.id, sel: params.sel,par:params.par },ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;


        let items: object[] = [];
        let items1: object[] = [];

        // @ts-ignore
        item.tokenValue = items;
        // @ts-ignore
        item.tokens = items1;

        const m211 = new BigNumber(2).pow(211);
        const m204 = new BigNumber(2).pow(204);
        const m197 = new BigNumber(2).pow(197);

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0, currentValue: 0,
                buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: "",
            };
            const goodConfig = new BigNumber(e.goodConfig);
            map.id = e.id;
            map.name = e.tokenname;
            map.decimals = e.tokendecimals;
            map.symbol = e.tokensymbol;
            map.currentQuantity = e.currentQuantity;
            map.currentValue = e.currentValue;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.address = e.erc20Address;
            map.price = current_price;
            map.buyFee = goodConfig.mod(m211).div(m204).integerValue(1).div(10000).toNumber(); //Math.floor(e.goodConfig % (2 ** 211) / (2 ** 204)) / 10000;
            map.sellFee = goodConfig.mod(m204).div(m197).integerValue(1).div(10000).toNumber(); //Math.floor(e.goodConfig % (2 ** 204) / (2 ** 197)) / 10000;
            items.push(map);

            // console.log(goodConfig.mod(m211).div(m204).integerValue(1).div(10000).toString(),555555555,BigNumber(12.89).integerValue(1).toNumber())
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
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.address = e.erc20Address;

            e.Goodlist.forEach((en: any) => {
                let map1 = {
                    id: "", name: "", decimals: 0, symbol: "", currentQuantity: 0, currentValue: 0,
                    buyFee: 0, sellFee: 0, price: 0, logo_url: "", address: ""
                };
                const goodConfig1 = new BigNumber(en.goodConfig);
                let base_decimals = powerIterative(10, en.tokendecimals);
                let current_price = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;


                map1.id = en.id;
                map1.name = en.tokenname;
                map1.decimals = en.tokendecimals;
                map1.symbol = en.tokensymbol;
                map1.currentQuantity = en.currentQuantity;
                map1.currentValue = en.currentValue;
                map1.logo_url = iconUrl(chainName, en.erc20Address);
                map1.address = en.erc20Address;
                map1.price = current_price;
                map1.buyFee = goodConfig1.mod(m211).div(m204).integerValue(1).div(10000).toNumber(); // Math.floor(en.goodConfig % (2 ** 211) / (2 ** 204)) / 10000;
                // @ts-ignore
                map1.sellFee = goodConfig1.mod(m204).div(m197).integerValue(1).div(10000).toNumber(); //Math.floor(en.goodConfig % (2 ** 204) / (2 ** 197)) / 10000;
                children.push(map1);
            });
            items1.push(map);
        });
    }

    // console.log(item,"***&&")
    return item;
}


//newGoodsPrice
export async function newGoodsPrice(params: { id: string; from: string;to:string },ssionChian:number): Promise<object> {

    let item = {};
    if (params.id !== "") {

        const goodsDatas = await newGoodsPrices({ id: params.id, from: params.from,to:params.to },ssionChian);

        const goodsValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        const tokendecimals = powerIterative(10, 6);
        const from =goodsDatas.data.from[0];
        const to =goodsDatas.data.to[0];
        const goodsFValue = (from.currentValue/tokendecimals) / (from.currentQuantity/10**from.tokendecimals);
        const goodsTValue = (to.currentValue/tokendecimals) / (to.currentQuantity/10**to.tokendecimals);

        let map = {
            fromPrice:0,toPrice:0,fromValue:0,toValue:0,fromQuan:0,toQuan:0
        };
        item = map;
        map.fromQuan=from.currentQuantity;
        map.toQuan=to.currentQuantity;
        map.fromValue=from.currentValue;
        map.toValue=to.currentValue;
        map.fromPrice=goodsFValue/goodsValue;
        map.toPrice=goodsTValue/goodsValue;
    }
    return item;
}
