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

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;



        let items: object[] = [];

        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

        item.items = items;
        if (goodsDatas.data.transactions.length < params.pageSize || goodsDatas.data.transactions.length === 0) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.transactions.forEach((e: any) => {
            let from_decimals = powerIterative(10, e.fromgood.tokendecimals);
            let to_decimals = powerIterative(10, e.togood.tokendecimals);
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
            map.symbol2 = e.togood.tokensymbol;
            if (from_decimals > 0) {
                map.fromgoodQuanity = e.fromgoodQuanity / from_decimals;
                map.fromgoodActualQuanity = e.fromgoodActualQuanity / from_decimals;
            } else {
                map.fromgoodQuanity = 0;
                map.fromgoodActualQuanity = 0;
            }
            if (to_decimals > 0) {
                map.togoodQuantity = e.togoodQuantity / to_decimals;
                map.togoodActualQuantity = e.togoodActualQuantity / to_decimals;
            } else {
                map.togoodQuantity = 0;
                map.togoodActualQuantity = 0;
            }

            map.totalValue = e.transvalue / tokendecimals;
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
        // console.log(params,99999)
        const goodsDatas = await goodDataView({ id: id, time: timestampdToDateYear(1), time24: timestampdToDateSub(0), address: address.toLowerCase(), eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

        let items: object[] = [];
        item.items = items;

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", logo_url: "", vlogo_url: "", exp_url: "", address: "", valueSymbol: "",
                price: 0, NAVPS: 0, APY: 0, price_24h: 0, tokenInfo: "",
                currentQuantity: 0, currentValue: 0, investQuantity: 0, investValue: 0, currentFee: 0, currentFeeValue: 0,
                tradeQuantity24: 0, tradeValue24: 0, fee24: 0, feeValue24: 0, investQuantity24: 0, investValue24: 0,
                totalInvestQuantity: 0, totalInvestValue: 0, totalTradeQuantity: 0, totalTradeValue: 0, totalDisinvestQuantity: 0, totalDisinvestValue: 0,
                totalTradeCount: 0, totalInvestCount: 0, owner: "", isvaluegood: false,
                buyFee: 0, sellFee: 0, investFee: 0, divestFee: 0, swapChips: 0, divestChips: 0,
                investor: 0, operator: 0, portal: 0, referrer: 0, user: 0, protocol: 0, maxLiquidity: 0,
                // chart_data: { volume_chart_7d: {}, volume_chart_30d: {}, quote_currency: "" }
            };

            // let volume_chart_7d: object[] = [];
            // let volume_chart_30d: object[] = [];

            // map.chart_data.volume_chart_7d = volume_chart_7d;
            // map.chart_data.volume_chart_30d = volume_chart_30d;

            // map.chart_data.quote_currency = e.tokensymbol;
            // e.days7.forEach((e: any) => {
            //     let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
            //     // let jz1 = e.currentValue * e.currentQuantity / tokendecimals;
            //     map1.dt = e.modifiedTime * 1000;
            //     map1.volume_quote = e.currentQuantity / base_decimals;
            //     map1.pretty_volume_quote = map1.volume_quote * current_price;
            //     // map1.quote_currency = map.symbol;
            //     volume_chart_7d.push(map1);
            // });
            // e.days30.forEach((e: any) => {
            //     let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
            //     map1.dt = e.modifiedTime * 1000;
            //     map1.volume_quote = e.currentQuantity / base_decimals;
            //     map1.pretty_volume_quote = map1.volume_quote * current_price;
            //     // map1.quote_currency = map.symbol;
            //     volume_chart_30d.push(map1);
            // });

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
            map.NAVPS = e.investQuantity / e.investShares;
            map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
            map.totalInvestValue = map.totalInvestQuantity * current_price;
            map.totalTradeQuantity = e.totalTradeQuantity / base_decimals;
            map.totalTradeValue = map.totalTradeQuantity * current_price;
            map.totalDisinvestQuantity = e.totalDisinvestQuantity / base_decimals;
            map.totalDisinvestValue = map.totalDisinvestQuantity * current_price;
            map.totalTradeCount = e.totalTradeCount;
            map.totalInvestCount = e.totalInvestCount;
            map.owner = e.owner;

            const m254 = new BigNumber(2).pow(254);
            const m251 = new BigNumber(2).pow(251);
            const m247 = new BigNumber(2).pow(247);
            const m244 = new BigNumber(2).pow(244);
            const m239 = new BigNumber(2).pow(239);
            const m234 = new BigNumber(2).pow(234);
            const m229 = new BigNumber(2).pow(229);
            const m224 = new BigNumber(2).pow(224);
            const m223 = new BigNumber(2).pow(223);
            const m217 = new BigNumber(2).pow(217);
            const m211 = new BigNumber(2).pow(211);
            const m204 = new BigNumber(2).pow(204);
            const m197 = new BigNumber(2).pow(197);
            const m187 = new BigNumber(2).pow(187);
            const m177 = new BigNumber(2).pow(177);
            const goodConfig = new BigNumber(e.goodConfig);
            map.investor = goodConfig.mod(m254).div(m251).integerValue(1).toNumber() * 10;
            map.operator = goodConfig.mod(m251).div(m247).integerValue(1).toNumber() * 2;
            map.portal = goodConfig.mod(m247).div(m244).integerValue(1).toNumber() * 4;
            map.referrer = goodConfig.mod(m244).div(m239).integerValue(1).toNumber();
            map.user = goodConfig.mod(m239).div(m234).integerValue(1).toNumber();
            map.protocol = goodConfig.mod(m234).div(m229).integerValue(1).toNumber();
            map.maxLiquidity = goodConfig.mod(m229).div(m224).integerValue(1).toNumber();
            if (map.maxLiquidity === 0) {
                map.maxLiquidity = 1
            }
            map.investFee = goodConfig.mod(m223).div(m217).integerValue(1).div(100).toNumber();
            map.divestFee = goodConfig.mod(m217).div(m211).integerValue(1).div(100).toNumber();
            map.buyFee = goodConfig.mod(m211).div(m204).integerValue(1).div(100).toNumber();
            map.sellFee = goodConfig.mod(m204).div(m197).integerValue(1).div(100).toNumber();
            // map.swapChips = goodConfig.mod(m197).div(m187).integerValue(1).times(BigNumber(10)).toNumber();
            map.swapChips = goodConfig.mod(m197).div(m187).integerValue(1).toNumber();
            map.divestChips = goodConfig.mod(m187).div(m177).integerValue(1).toNumber();
            let uintF = (Number(e.feeQuantity) + Number(e.investQuantity)) / e.investQuantity;
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
                let uintFY = (enY.feeQuantity + enY.investQuantity) / enY.investQuantity;
                map.APY = uintF / uintFY - 1;
                console.log(e.feeQuantity + e.investQuantity, uintF, uintFY, map.APY, "sdfsdfsd")
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
        const tokendecimals1 = powerIterative(10, goodsDatas.data.h24[0].decimals);

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
