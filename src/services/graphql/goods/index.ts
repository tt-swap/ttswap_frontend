import { getExplorer, getChainName } from '@/data/networks';
import { goodsTransactions, goodDataView, GoodsSearch, GoodKLine } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, timestampdToDateYear, infoUrl, complete24HourData } from '@/services/graphql/util';
import BigNumber from 'bignumber.js';
import { getSWETH } from '@/data/contractConfig';
import { timestampParser } from "@/utils/timestamp-parser";

// 物品记录列表
export async function goodsTransactionsDatas(params: { id: string; address: string; walletAddress: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const blockExplorerUrls = getExplorer(ssionChian);
    let item = { items: [], pagination: { has_more: true }, error: false, error_message: "", tokensymbol: "" };
    if (params.id !== "") {
        const goodsDatas = await goodsTransactions({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase(), walletAddress: params.walletAddress.toLowerCase() }, ssionChian);

        // let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        // let tokendecimals = powerIterative(10, 6);
        // let jz = goodValue;



        let items: object[] = [];

        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

        item.items = items;
        if (goodsDatas.data.transactions.length < params.pageSize || goodsDatas.data.transactions.length === 0) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.transactions.forEach((e: any) => {
            let from_decimals = powerIterative(10, e.fromgood.tokendecimals);
            // let to_decimals = powerIterative(10, e.togood.tokendecimals);
            // let from_price = 0;
            // if (e.fromgood.currentValue > 0 || e.fromgood.currentQuantity > 0 || e.fromgood.tokendecimals > 0) {
            //     from_price = ((e.fromgood.currentValue / tokendecimals) / (e.fromgood.currentQuantity / from_decimals)) / jz;
            // }
            // let to_price = 0;
            // if (e.togood.currentValue > 0 || e.togood.currentQuantity > 0 || e.togood.tokendecimals > 0) {
            //     to_price = ((e.togood.currentValue / tokendecimals) / (e.togood.currentQuantity / to_decimals)) / jz;
            // }

            let map = {
                id: "", blockNumber: "", type: "", symbol1: "", symbol2: "", fromgoodQuanity: 0, fromgoodActualQuanity: 0, togoodQuantity: 0,
                togoodActualQuantity: 0, hash: "", totalValue: 0, time: 0, valueSymbol: ""
            };

            map.id = e.id;
            map.time = e.timestamp * 1000;
            map.blockNumber = e.blockNumber;
            map.type = e.transtype;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            // @ts-ignore
            map.hash = blockExplorerUrls[0] + "/tx/" + e.hash;
            map.symbol1 = e.fromgood.tokensymbol;
            // map.symbol2 = e.togood.tokensymbol;
            if (from_decimals > 0) {
                map.fromgoodQuanity = e.fromgoodQuanity / from_decimals;
                map.fromgoodActualQuanity = e.fromgoodActualQuanity / from_decimals;
            } else {
                map.fromgoodQuanity = 0;
                map.fromgoodActualQuanity = 0;
            }
            if (Number(e.togoodQuantity) > 0) {
                map.symbol2 = e.togood.tokensymbol;
                let to_decimals = powerIterative(10, e.togood.tokendecimals);
                if (to_decimals > 0) {
                    map.togoodQuantity = e.togoodQuantity / to_decimals;
                    map.togoodActualQuantity = e.togoodActualQuantity / to_decimals;
                } else {
                    map.togoodQuantity = 0;
                    map.togoodActualQuantity = 0;
                }
            } else {
                map.symbol2 = "#";
                map.togoodQuantity = 0;
                map.togoodActualQuantity = 0;
            }
            // map.totalValue = e.transvalue / tokendecimals;
            // if (e.transtype === "buy" || e.transtype === "pay") {
            //     map.totalValue = map.fromgoodQuanity * from_price;
            // } else {
            //     map.totalValue = (map.fromgoodQuanity * from_price) + (map.togoodQuantity * to_price);
            // }
            // console.log(map.fromgoodQuanity,"********",from_price,"***",map.togoodQuantity,"**",to_price)
            items.push(map);
        });


        // console.log(item,"********")
        // return item;
    }
    return item;
}


// getLpTokenView物品记录列表
export async function getLpTokenView(id: string, address: string, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    const blockExplorerUrls = getExplorer(ssionChian);
    const SWETH = getSWETH(ssionChian);
    const address3 = "0x0000000000000000000000000000000000000003";

    let item = { items: {}, error: false, error_message: "" };

    if (id !== "") {
        let items: object[] = [];
        item.items = items;

        const data = {
            id: "", name: "", decimals: 0, symbol: "", logo_url: "", vlogo_url: "", exp_url: "", address: "", valueSymbol: "",
            price: 0, NAVPS: 0, APY: 0, price_24h: 0, tokenInfo: "0",
            currentQuantity: 0, currentValue: 0, investQuantity: 0, investValue: 0, currentFee: 0, currentFeeValue: 0,
            tradeQuantity24: 0, tradeValue24: 0, fee24: 0, feeValue24: 0, investQuantity24: 0, investValue24: 0,
            totalInvestQuantity: 0, totalInvestValue: 0, totalTradeQuantity: 0, totalTradeValue: 0, totalDisinvestQuantity: 0, totalDisinvestValue: 0,
            totalTradeCount: 0, totalInvestCount: 0, owner: "", isvaluegood: false,
            buyFee: 0, sellFee: 0, investFee: 0, divestFee: 0, investM: 0, divestChips: 0,
            investor: 0, operator: 0, portal: 0, referrer: 0, user: 0, protocol: 0, maxLiquidity: 0,
            // chart_data: { volume_chart_7d: {}, volume_chart_30d: {}, quote_currency: "" }
        };
        try {

            // console.log(params,99999)
            const goodsDatas = await goodDataView({ id: id, time: timestampdToDateYear(1), time24: timestampdToDateSub(0), address: address.toLowerCase(), eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) }, ssionChian);

            let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
            let tokendecimals = powerIterative(10, 6);
            let jz = goodValue;

            goodsDatas.data.goodStates.forEach((e: any) => {
                let base_decimals = powerIterative(10, e.tokendecimals);
                let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

                let map = data;

                map.id = e.id;
                map.name = e.tokenname;
                map.symbol = e.tokensymbol;
                if (e.erc20Address === address3) {
                    map.address = SWETH;
                } else {
                    map.address = e.erc20Address;
                }
                map.isvaluegood = e.isvaluegood;
                // map.address = e.erc20Address;
                map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
                map.logo_url = iconUrl(chainName, e.erc20Address);
                map.tokenInfo = infoUrl(chainName, e.erc20Address);
                map.vlogo_url = iconUrl(chainName, goodsDatas.data.goodState.id);
                // @ts-ignore
                map.exp_url = blockExplorerUrls[0] + "/address/" + map.address;
                map.decimals = e.tokendecimals;
                map.price = current_price;
                map.investQuantity = e.investQuantity / base_decimals;
                map.investValue = map.investQuantity * current_price;
                map.currentQuantity = e.currentQuantity / base_decimals;
                map.currentValue = map.currentQuantity * current_price;
                map.currentFee = e.feeQuantity / base_decimals;
                map.currentFeeValue = map.currentFee * current_price;
                map.NAVPS = e.investActualQuantity / e.investShares;
                map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
                map.totalInvestValue = map.totalInvestQuantity * current_price;
                map.totalTradeQuantity = e.totalTradeQuantity / base_decimals;
                map.totalTradeValue = map.totalTradeQuantity * current_price;
                map.totalDisinvestQuantity = e.totalDisinvestQuantity / base_decimals;
                map.totalDisinvestValue = map.totalDisinvestQuantity * current_price;
                map.totalTradeCount = e.totalTradeCount;
                map.totalInvestCount = e.totalInvestCount;
                map.owner = e.owner;

                const m154 = new BigNumber(2).pow(154);
                const m148 = new BigNumber(2).pow(148);
                const m142 = new BigNumber(2).pow(142);
                const m135 = new BigNumber(2).pow(135);
                const m160 = new BigNumber(2).pow(160);
                const m128 = new BigNumber(2).pow(128);
                const m173 = new BigNumber(2).pow(173);
                const m168 = new BigNumber(2).pow(168);
                const m250 = new BigNumber(2).pow(250);
                const m247 = new BigNumber(2).pow(247);
                const m243 = new BigNumber(2).pow(243);
                const m240 = new BigNumber(2).pow(240);
                const m235 = new BigNumber(2).pow(235);
                const m230 = new BigNumber(2).pow(230);
                const m225 = new BigNumber(2).pow(225);
                const m220 = new BigNumber(2).pow(220);
                const goodConfig = new BigNumber(e.goodConfig);

                map.investFee = goodConfig.mod(m154).div(m148).integerValue(1).toNumber();    //154-148
                map.divestFee = goodConfig.mod(m148).div(m142).integerValue(1).toNumber();    //148-142
                map.buyFee = goodConfig.mod(m142).div(m135).integerValue(1).toNumber();   //142-135
                map.sellFee = goodConfig.mod(m135).div(m128).integerValue(1).toNumber();  //135-128
                map.divestChips = goodConfig.mod(m168).div(m160).integerValue(1).toNumber() * 4;  //168-160
                map.investM = goodConfig.mod(m173).div(m168).integerValue(1).toNumber();  //173-168


                map.investor = goodConfig.mod(m250).div(m247).integerValue(1).toNumber() * 10;    //250-247
                map.operator = goodConfig.mod(m247).div(m243).integerValue(1).toNumber() * 2;     //247-243
                map.portal = goodConfig.mod(m243).div(m240).integerValue(1).toNumber() * 4;   //243-240
                map.referrer = goodConfig.mod(m240).div(m235).integerValue(1).toNumber();  //240-235
                map.user = goodConfig.mod(m235).div(m230).integerValue(1).toNumber(); //235-230
                map.protocol = goodConfig.mod(m230).div(m225).integerValue(1).toNumber();    //230-225
                map.maxLiquidity = goodConfig.mod(m225).div(m220).integerValue(1).toNumber(); //225-220
                if (map.maxLiquidity === 0) {
                    map.maxLiquidity = 1
                }

                if (e.goodData.length > 0) {
                    let en = e.date24[0];
                    let enY = e.goodData[0];
                    let current_price_24h = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;
                    map.investQuantity24 = (e.investQuantity - en.investQuantity) / base_decimals;
                    map.fee24 = (e.feeQuantity - en.feeQuantity) / base_decimals;
                    map.investValue24 = map.investQuantity24 * current_price_24h;
                    map.feeValue24 = map.fee24 * current_price_24h;
                    map.tradeQuantity24 = (e.totalTradeQuantity - en.totalTradeQuantity) / base_decimals;
                    map.tradeValue24 = map.tradeQuantity24 * current_price_24h;
                    map.price_24h = (current_price - current_price_24h) / current_price_24h;
                    // let uintFY = (enY.feeQuantity + enY.investQuantity) / enY.investQuantity;
                    let NAVPS = enY.investActualQuantity / enY.investShares;
                    map.APY = map.NAVPS / NAVPS - 1;//uintF / uintFY - 1;
                    // console.log(e.feeQuantity + e.investQuantity, uintF, uintFY, map.APY, "sdfsdfsd")
                } else {
                    map.investQuantity24 = map.investQuantity;
                    map.fee24 = map.currentFee;
                    map.investValue24 = map.investValue;
                    map.feeValue24 = map.currentFeeValue;
                    map.price_24h = 0;
                    map.APY = 0;
                }

                items.push(map);
                // console.log(items,8686868)
            });
        } catch (error) {
            items.push(data);
        }


        // return item;
    }
    return item;
}




//物品列表
export async function GoodsSearchDatas(params: { id: string; sel: string }, ssionChian: number): Promise<object> {
    const chainName = getChainName(ssionChian);
    let item: Object[] = [];
    if (params.id !== "") {

        const goodsDatas = await GoodsSearch({ id: params.id, sel: params.sel.toLowerCase(), time: timestampdToDateSub(0) }, ssionChian);

        const goodState = goodsDatas.data.goodState;
        // console.log("***&&", goodState.goodData[0].currentValue)
        const goodValue = goodState.currentValue / goodState.currentQuantity;
        const goodValue24 = goodState.goodData[0].currentValue / goodState.goodData[0].currentQuantity;
        const tokendecimals = powerIterative(10, 6);

        goodsDatas.data.goodStates.forEach((en: any) => {
            let map1 = {
                id: "", name: "", decimals: 0, symbol: "", price: 0, logo_url: "",
                address: "", isvaluegood: false, valueSymbol: "", h24: 0, trade24hValue: 0
            };
            let base_decimals = powerIterative(10, en.tokendecimals);
            let current_price = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / goodValue;
            let current_price24 = ((en.goodData[0].currentValue / tokendecimals) / (en.goodData[0].currentQuantity / base_decimals)) / goodValue;
            let t24 = (en.totalTradeQuantity - en.goodData[0].totalTradeQuantity) / base_decimals
            map1.id = en.id;
            map1.name = en.tokenname;
            map1.decimals = en.tokendecimals;
            map1.symbol = en.tokensymbol;
            map1.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map1.logo_url = iconUrl(chainName, en.erc20Address);
            map1.address = en.erc20Address;
            map1.isvaluegood = en.isvaluegood;
            map1.price = current_price;
            map1.h24 = (current_price - current_price24) / current_price24;
            map1.trade24hValue = t24 * current_price;
            item.push(map1);
        });
    }
    // console.log(item,"***&&")
    return item;
}




//物品列表
export async function GoodKLineData(params: { id: string; sel: string }, ssionChian: number): Promise<object> {
    let item: any[] = [];
    if (params.id !== "") {
        const timestamp = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
        const goodsDatas = await GoodKLine({ id: params.id, sel: params.sel, time: timestamp }, ssionChian);

        const goodState = goodsDatas.data.goodState;
        // console.log("***&&", goodState.goodData[0].currentValue)
        const goodValue = goodState.currentValue / goodState.currentQuantity;
        const goodValue24 = goodState.goodData[0].currentValue / goodState.goodData[0].currentQuantity;
        const tokendecimals = powerIterative(10, 6);
        const tokendecimals1 = powerIterative(10, goodsDatas.data.h24[0]?.decimals);

        const m128 = new BigNumber(2).pow(128);
        const time = timestampParser(timestamp * 1000, "DD hh:mm");
        if (goodsDatas.data.h24.length > 0) {
            const e = goodsDatas.data.h24[0];
            console.log(e, "***&&", new BigNumber(e.open).div(m128).integerValue(1).toNumber(), new BigNumber(e.open).mod(m128).integerValue(1).toNumber())
            const open = ((new BigNumber(e.open).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.open).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
            const close = ((new BigNumber(e.close).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.close).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
            const low = ((new BigNumber(e.low).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.low).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
            const high = ((new BigNumber(e.high).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.high).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
            const amount = Number(e.totalTradeQuantity) / tokendecimals1;
            let arr = [time, open, close, low, high, amount];
            item.push(arr);
        } else {
            item.push([time, 0, 0, 0, 0, 0]);
        }
        if (goodsDatas.data.goodDatas.length > 0) {
            goodsDatas.data.goodDatas.forEach((e: any) => {
                const time = timestampParser(e.modifiedTime * 1000, "DD hh:mm");
                const open = ((new BigNumber(e.open).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.open).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
                const close = ((new BigNumber(e.close).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.close).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
                const low = ((new BigNumber(e.low).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.low).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
                const high = ((new BigNumber(e.high).div(m128).integerValue(1).toNumber() / tokendecimals) / (new BigNumber(e.high).mod(m128).integerValue(1).toNumber() / tokendecimals1)) / goodValue;
                const amount = e.totalTradeQuantity / tokendecimals1;
                let a = [time, open, close, low, high, amount];
                item.push(a);
            });
        }
        item = complete24HourData(item, 10);

    }
    // console.log(item,"***&&")
    return item;
}
