import { getExplorer, getChainName } from '@/data/networks';
// import { ethers } from "ethers";
// import MarketManager from '@/data/abi/MarketManager.json';
// import { getContractAddress } from '@/data/contractConfig';
import { goodsTransactions, goodDataView } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, timestampdToDateYear } from '@/graphql/util';
import BigNumber from 'bignumber.js';

// 物品记录列表
export async function goodsTransactionsDatas(params: { id: string; address: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const blockExplorerUrls = getExplorer(ssionChian);
    let item = { items: {}, pagination: { has_more: true }, error: false, error_message: "", tokensymbol: "" };
    if (params.id !== "") {
        const goodsDatas = await goodsTransactions({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;



        let items: object[] = [];

        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

        item.items = items;
        if (goodsDatas.data.transactions.length < params.pageSize) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.transactions.forEach((e: any) => {
            let from_decimals = powerIterative(10, e.frompargood.tokendecimals);
            let to_decimals = powerIterative(10, e.togood.tokendecimals);
            // let from_price = 0;
            // if (e.frompargood.currentValue > 0 || e.frompargood.currentQuantity > 0 || e.frompargood.tokendecimals > 0) {
            //     from_price = ((e.frompargood.currentValue / tokendecimals) / (e.frompargood.currentQuantity / from_decimals)) / jz;
            // }
            // let to_price = 0;
            // if (e.togood.currentValue > 0 || e.togood.currentQuantity > 0 || e.togood.tokendecimals > 0) {
            //     to_price = ((e.togood.currentValue / tokendecimals) / (e.togood.currentQuantity / to_decimals)) / jz;
            // }

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

    let item = { items: {}, error: false, error_message: "" };

    if (id !== "") {
        // console.log(params,99999)
        const goodsDatas = await goodDataView({ id: id, time: timestampdToDateYear(1), time24: timestampdToDateSub(0), address: address.toLowerCase(),eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

        let items: object[] = [];
        item.items = items;

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", logo_url: "", exp_url: "", address: "", valueSymbol: "",
                price: 0, unitFee: 0, APY: 0, price_24h: 0,
                currentQuantity: 0, currentValue: 0, investQuantity: 0, investValue: 0, currentFee: 0, currentFeeValue: 0,
                tradeQuantity24: 0, tradeValue24: 0, fee24: 0, feeValue24: 0, investQuantity24: 0, investValue24: 0,
                totalInvestQuantity: 0, totalInvestValue: 0, totalTradeQuantity: 0, totalTradeValue: 0, totalDisinvestQuantity: 0, totalDisinvestValue: 0,
                totalTradeCount: 0, totalInvestCount: 0, owner: "",
                buyFee: 0, sellFee: 0, investFee: 0, divestFee: 0, swapChips: 0, divestChips: 0,
                chart_data: {volume_chart_7d:{},volume_chart_30d:{}}
            };

            let volume_chart_7d: object[] = [];
            let volume_chart_30d: object[] = [];
    
            map.chart_data.volume_chart_7d = volume_chart_7d;
            map.chart_data.volume_chart_30d = volume_chart_30d;
    
            e.days7.forEach((e: any) => {
                let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
                // let jz1 = e.currentValue * e.currentQuantity / tokendecimals;
                map1.dt = e.modifiedTime * 1000;
                map1.volume_quote = e.currentQuantity/base_decimals;
                map1.pretty_volume_quote = map1.volume_quote * current_price;
                map1.quote_currency = goodsDatas.data.goodState.tokensymbol;
                volume_chart_7d.push(map1);
            });
            e.days30.forEach((e: any) => {
                let map1 = { dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 };
                map1.dt = e.modifiedTime * 1000;
                map1.volume_quote = e.currentQuantity/base_decimals;
                map1.pretty_volume_quote = map1.volume_quote * current_price;
                map1.quote_currency = goodsDatas.data.goodState.tokensymbol;
                volume_chart_30d.push(map1);
            });

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.address = e.erc20Address;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            // @ts-ignore
            map.exp_url = blockExplorerUrls[0] + "/address/" + e.erc20Address;
            map.decimals = e.tokendecimals;
            map.price = current_price;
            map.investQuantity = e.investQuantity / base_decimals;
            map.investValue = map.investQuantity * current_price;
            map.currentQuantity = e.currentQuantity / base_decimals;
            map.currentValue = map.currentQuantity * current_price;
            map.currentFee = e.feeQuantity / base_decimals;
            map.currentFeeValue = map.currentFee * current_price;
            map.unitFee = map.currentFee / map.investQuantity;
            map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
            map.totalInvestValue = map.totalInvestQuantity * current_price;
            map.totalTradeQuantity = e.totalTradeQuantity / base_decimals;
            map.totalTradeValue = map.totalTradeQuantity * current_price;
            map.totalDisinvestQuantity = e.totalDisinvestQuantity / base_decimals;
            map.totalDisinvestValue = map.totalDisinvestQuantity * current_price;
            map.totalTradeCount = e.totalTradeCount;
            map.totalInvestCount = e.totalInvestCount;
            map.owner = e.owner;

            const m223 = new BigNumber(2).pow(223);
            const m217 = new BigNumber(2).pow(217);
            const m211 = new BigNumber(2).pow(211);
            const m204 = new BigNumber(2).pow(204);
            const m197 = new BigNumber(2).pow(197);
            const m187 = new BigNumber(2).pow(187);
            const m177 = new BigNumber(2).pow(177);
            const goodConfig = new BigNumber(e.goodConfig);
            map.investFee = goodConfig.mod(m223).div(m217).integerValue(1).div(100).toNumber();
            map.divestFee = goodConfig.mod(m217).div(m211).integerValue(1).div(100).toNumber();
            map.buyFee = goodConfig.mod(m211).div(m204).integerValue(1).div(100).toNumber();
            map.sellFee = goodConfig.mod(m204).div(m197).integerValue(1).div(100).toNumber();
            map.swapChips = goodConfig.mod(m197).div(m187).integerValue(1).times(BigNumber(64)).toNumber();
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
                console.log(e.feeQuantity + e.investQuantity,uintF,uintFY, map.APY,"sdfsdfsd")
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