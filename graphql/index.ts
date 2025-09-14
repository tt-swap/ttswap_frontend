
import { getChainName } from '@/data/networks';
import { goodStates, goodState } from '@/graphql/graphql';
import { iconUrl } from '@/graphql/util';

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