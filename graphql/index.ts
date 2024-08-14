
import { getChainName } from '@/data/networks';
import { goodStates, goodState } from '@/graphql/graphql';
import {  iconUrl } from '@/graphql/util';



//价值物品列表
export async function GoodsDatas(ssionChian:number) {

    // let chainId = 0;
    // if (sessionStorage.getItem("chainId") !== null) {
    //     chainId = Number(sessionStorage.getItem("chainId"));
    // }
    const chainName = getChainName(ssionChian);
    
    const goodsDatas = await goodStates(ssionChian);

    let items: object[] = [];
    goodsDatas.data.goodStates.forEach((e: any) => {
        
        let map = {
            id: "", name: "", decimals: 0, symbol: "", logo_url: "", address: "",
        };
        map.id = e.id;
        map.name = e.tokenname;
        map.decimals = e.tokendecimals;
        map.symbol = e.tokensymbol;
        map.logo_url = iconUrl(chainName, e.erc20Address);
        map.address = e.erc20Address;
        items.push(map);
    });
    return items;
}

//价值物品
export async function valueGood(ssionChian:number) {
    const goodsDatas = await goodState(ssionChian);
    return goodsDatas;
}