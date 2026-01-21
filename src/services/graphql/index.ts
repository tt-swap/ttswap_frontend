
import { getChainName, getExplorer } from '@/data/networks';
import { goodStates, goodState, publicSale } from '@/services/graphql/graphql';
import { iconUrl } from '@/services/graphql/util';

//价值物品列表
export async function GoodsDatas(ssionChian: number) {
    const chainName = getChainName(ssionChian);
    const goodsDatas = await goodStates(ssionChian);
    let items: object[] = [];
    goodsDatas.data.goodStates.forEach((e: any) => {
        let map = {
            id: e.id,
            name: e.tokenname,
            decimals: e.tokendecimals,
            symbol: e.tokensymbol,
            logo_url: iconUrl(chainName, e.erc20Address),
            address: e.erc20Address,
            currentQuantity: e.currentQuantity,
            currentValue: e.currentValue,
        };
        items.push(map);
    });
    return items;
}

//价值物品
export async function valueGood(ssionChian: number) {
    const goodsDatas = await goodState(ssionChian);
    return goodsDatas;
}


//publicSaleData
export async function publicSaleData(ssionChian: number) {
    const blockExplorerUrls = getExplorer(ssionChian);
    const goodsDatas = await publicSale(ssionChian);
    let data = { items: [], totalT: 0, totalU: 0 };
    let t = 0;
    let u = 0;
    const a1 = 87500;
    const a2 = 75000;

    goodsDatas.data.ttswapPublicsellLogs.forEach((e: any) => {
        let a = 1;
        if (u > a1 && u <= (a1 + a2)) {
            a = 2;
        } else if (u > (a1 + a2)) {
            a = 3;
        }
        let map = {
            id: e.id,
            create_time: e.create_time*1000,
            ttsamount: e.ttsamount / 1e12,
            usdtamount: e.usdtamount / 1e6,
            user: e.user,
            hash: blockExplorerUrls[0] + "/tx/" + e.id,
            phase: a
        };
        data.items.push(map);
        t += map.ttsamount;
        u += map.usdtamount;
    });
    data.items.sort((a, b) => b.create_time - a.create_time);
    data.totalT = t;
    data.totalU = u;
    return data;
}