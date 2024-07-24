import { getChainName } from '@/data/networks';
import { InvestTokenD } from "@/shared/types/token";
import { parGoodDatas } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl } from '@/graphql/util';
import BigNumber from 'bignumber.js';


let chainId = 0;
if (sessionStorage.getItem("chainId") !== null) {
    chainId = Number(sessionStorage.getItem("chainId"));
}
// const blockExplorerUrls = getExplorer(chainId);
const chainName = getChainName(chainId);

//物品列表
export async function GoodsDatas(params: { id: string; sel: string }): Promise<object> {
    let item: InvestTokenD = {
        tokenValue: [],
        tokens: []
    };
    if (params.id !== "") {

        const goodsDatas = await parGoodDatas({ id: params.id, sel: params.sel, time: timestampdToDateSub(1) });

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
        const m217 = new BigNumber(2).pow(217);
        const m223 = new BigNumber(2).pow(223);

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            const goodConfig = new BigNumber(e.goodConfig);

            let map = {
                id: "", name: "", decimals: 0, symbol: "", investQuantity: 0, feeQuantity: 0,
                investFee: 0, disinvestFee: 0, price: 0, logo_url: "", address: "", isvaluegood: false
            };
            map.id = e.id;
            map.name = e.tokenname;
            map.decimals = e.tokendecimals;
            map.symbol = e.tokensymbol;
            map.investQuantity = e.investQuantity / base_decimals;
            map.feeQuantity = e.feeQuantity / base_decimals;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.address = e.erc20Address;
            map.isvaluegood = e.isvaluegood;
            map.price = current_price;
            // @ts-ignore
            map.investFee = goodConfig.mod(m223).div(m217).integerValue(1).div(10000).toNumber();
            // @ts-ignore
            map.disinvestFee = goodConfig.mod(m217).div(m211).integerValue(1).div(10000).toNumber();
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
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.address = e.erc20Address;

            e.Goodlist.forEach((en: any) => {
                let map1 = {
                    id: "", name: "", decimals: 0, symbol: "", investQuantity: 0, feeQuantity: 0, apy: 0,
                    investFee: 0, disinvestFee: 0, price: 0, logo_url: "", address: "", isvaluegood: false
                };
                let base_decimals = powerIterative(10, en.tokendecimals);
                let current_price = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;

                const goodConfig1 = new BigNumber(en.goodConfig);

                map1.id = en.id;
                map1.name = en.tokenname;
                map1.decimals = en.tokendecimals;
                map1.symbol = en.tokensymbol;
                map1.investQuantity = en.investQuantity / base_decimals;
                map1.feeQuantity = en.feeQuantity / base_decimals;
                map1.logo_url = iconUrl(chainName, en.erc20Address);
                map1.address = en.erc20Address;
                map1.isvaluegood = en.isvaluegood;
                map1.price = current_price;
                // @ts-ignore
                map1.investFee = goodConfig1.mod(m223).div(m217).integerValue(1).div(10000).toNumber();
                // @ts-ignore
                map1.disinvestFee = goodConfig1.mod(m217).div(m211).integerValue(1).div(10000).toNumber();
                if (en.goodData.length > 0) {
                    map1.apy = (en.feeQuantity - en.goodData[0].feeQuantity) / en.feeQuantity * 365;
                } else {
                    map1.apy = 0;
                }
                children.push(map1);
            });
            items1.push(map);
        });
    }
    // console.log(item,"***&&")
    return item;
}

