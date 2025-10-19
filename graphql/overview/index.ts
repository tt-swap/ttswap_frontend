import { getExplorer, getChainName } from '@/data/networks';
import { ecosystemChartData, parGoodDatas, InvestGoodDatas, transactions } from './graphql';
import { timestampdToDateSub, timestampdToDateYear, powerIterative, iconUrl } from '@/graphql/util';

// let chainId = 0;
// if (sessionStorage.getItem("chainId") !== null) {
//     chainId = Number(sessionStorage.getItem("chainId"));
// }
// const blockExplorerUrls = getExplorer(chainId);
// const chainName = getChainName(chainId);


// overview charts
export async function ecosystemChartDatas(id: string, ssionChian: number): Promise<object> {


    // const chainName = getChainName(ssionChian);
    let item = {
        quote_currency: '', volume_chart_7d: [{ dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 }],
        volume_chart_30d: [{ dt: 0, quote_currency: "", pretty_volume_quote: 0, volume_quote: 0 }],
        liquidity_chart_7d: [{ dt: 0, quote_currency: "", pretty_liquidity_quote: 0, liquidity_quote: 0 }],
        liquidity_chart_30d: [{ dt: 0, quote_currency: "", pretty_liquidity_quote: 0, liquidity_quote: 0 }]
    };

    if (id !== "") {
        const data = await ecosystemChartData({ id: id, eq7: timestampdToDateSub(6), eq30: timestampdToDateSub(29) }, ssionChian);
        let goodValue = data.data.goodState.currentValue / data.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        item.quote_currency = data.data.goodState.tokensymbol;
        // let volume_chart_7d: object[] = [];
        // let volume_chart_30d: object[] = [];
        // let liquidity_chart_7d: object[] = [];
        // let liquidity_chart_30d: object[] = [];
        let volume_chart_7d: { dt: number; quote_currency: string; pretty_volume_quote: number; volume_quote: number }[] = [];
        let volume_chart_30d: { dt: number; quote_currency: string; pretty_volume_quote: number; volume_quote: number }[] = [];
        let liquidity_chart_7d: { dt: number; quote_currency: string; pretty_liquidity_quote: number; liquidity_quote: number }[] = [];
        let liquidity_chart_30d: { dt: number; quote_currency: string; pretty_liquidity_quote: number; liquidity_quote: number }[] = [];

        item.volume_chart_7d = volume_chart_7d;
        item.volume_chart_30d = volume_chart_30d;
        item.liquidity_chart_7d = liquidity_chart_7d;
        item.liquidity_chart_30d = liquidity_chart_30d;

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
    }
    return item;
}


//物品列表
export async function GoodsDatas(params: { id: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    let item = { items: {}, pagination: { page_number: 0, page_size: 0, has_more: true }, error: false, error_message: "" };

    if (params.id !== "") {
        const goodsDatas = await InvestGoodDatas({ id: params.id, first: params.pageSize, time: timestampdToDateYear(1), time24: timestampdToDateSub(0), skip: params.pageSize * params.pageNumber }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

        let items: object[] = [];
        let pagination = {
            has_more: true,
            page_number: 0,
            page_size: 10,
            total_count: null
        };

        item.items = items;
        item.pagination = pagination;
        item.pagination.page_number = params.pageNumber;
        item.pagination.page_size = params.pageSize;

        if (goodsDatas.data.goodStates.length < params.pageSize || goodsDatas.data.goodStates.length === 0) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", valueSymbol: "", totalTradeQuantity: 0, currentQuantity: 0,
                totalFee: 0, price: 0, price_24h: 0, totalTradeValue: 0, totalFeeValue: 0, NAVPS: 0, apy: 0,
                tradeQuantity24: 0, fee24: 0, tradeValue24: 0, feeValue24: 0, logo_url: "", priceC_24h: 0
            };

            if (e.goodData.length > 0) {
                let en = e.goodData[0];
                // e.parGooddata.forEach((en: any) => {
                //     if (e.id === en.pargood.id) {
                let current_price_24h = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;
                // let s = splitNumber(en.open);
                map.tradeQuantity24 = (e.totalTradeQuantity - en.totalTradeQuantity) / base_decimals;
                // map.fee24 = (e.totalProfit - en.totalProfit) / base_decimals;
                // map.tradeValue24 = (e.totalTradeQuantity - en.totalTradeQuantity) / base_decimals * current_price_24h;
                // map.feeValue24 = (e.totalProfit - en.totalProfit) / base_decimals * current_price_24h;
                map.price_24h = current_price_24h;
                map.priceC_24h = (current_price - map.price_24h) / map.price_24h;
                //     }
                // });
            } else {
                map.tradeQuantity24 = e.totalTradeQuantity / base_decimals;;
                // map.fee24 = 0;
                // map.tradeValue24 = 0;
                // map.feeValue24 = 0;
                map.priceC_24h = 0;
            }

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.decimals = e.tokendecimals;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.totalTradeQuantity = e.totalTradeQuantity / base_decimals;
            map.currentQuantity = e.currentQuantity / base_decimals;
            // map.totalFee = e.totalProfit / base_decimals;
            // map.totalTradeValue = e.totalTradeQuantity / base_decimals * current_price;
            // map.totalFeeValue = e.totalProfit / base_decimals * current_price;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.price = current_price;


            items.push(map);
        });

    }
    // console.log(item,"***&&")
    return item;
}


//投资列表
export async function investGoodsDatas(params: { id: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    let item = {
        items: [{
            id: "", name: "", decimals: 0, symbol: "", logo_url: "", currentQuantity: 0, currentValue: 0, valueSymbol: "",
            priceC_24h: 0, price: 0, price_24h: 0, NAVPS: 0, apy: 0, unitPrice: 0
        }], pagination: { page_number: 0, page_size: 0, has_more: false }, error: false, error_message: ""
    };

    if (params.id !== "") {
        console.log("investGoodsDatas", params);
        const goodsDatas = await InvestGoodDatas({ id: params.id, first: params.pageSize, time: timestampdToDateYear(1), time24: timestampdToDateSub(0), skip: params.pageSize * params.pageNumber }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;

        let items: {
            id: string;
            name: string;
            decimals: number;
            symbol: string;
            logo_url: string;
            currentQuantity: number;
            currentValue: number;
            valueSymbol: string;
            priceC_24h: number;
            price: number;
            price_24h: number;
            NAVPS: number;
            apy: number;
            unitPrice: number;
        }[] = [];
        let pagination = {
            has_more: true,
            page_number: 0,
            page_size: 10,
            total_count: null
        };

        item.items = items;
        item.pagination = pagination;
        item.pagination.page_number = params.pageNumber;
        item.pagination.page_size = params.pageSize;

        if (goodsDatas.data.goodStates.length < params.pageSize || goodsDatas.data.goodStates.length === 0) {
            item.pagination.has_more = false;
        }
        goodsDatas.data.goodStates.forEach((e: any) => {
            let base_decimals = powerIterative(10, e.tokendecimals);
            let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", decimals: 0, symbol: "", logo_url: "", currentQuantity: 0, currentValue: 0, valueSymbol: "",
                priceC_24h: 0, price: 0, price_24h: 0, NAVPS: 0, apy: 0, unitPrice: 0
            };

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.decimals = e.tokendecimals;
            map.unitPrice = (e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals);
            map.currentQuantity = e.currentQuantity / base_decimals;
            map.currentValue = e.currentQuantity / base_decimals * current_price;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.price = current_price;
            map.NAVPS = e.investQuantity / e.investShares;
            // let uintF = (Number(e.feeQuantity) + Number(e.investQuantity)) / e.investQuantity;
            let en = e.goodData[0];
            let d24 = e.date24[0];
            console.log("investGoodsData-----s", en);
            // let uintFY = (en.feeQuantity + en.investQuantity) / en.investQuantity;
            let NAVPS = en.investQuantity / en.investShares;
            console.log(22222222, jz)
            let current_price_24h = ((d24.currentValue / tokendecimals) / (d24.currentQuantity / base_decimals)) / jz;
            map.price_24h = current_price_24h;
            map.priceC_24h = (current_price - current_price_24h) / current_price_24h;
            map.apy = map.NAVPS / NAVPS - 1;//uintF / uintFY - 1;

            items.push(map);
        });

    }
    console.log(3333333333, params, item)
    return item;
}

//记录列表
export async function transactionsDatas(id: string, ssionChian: number): Promise<object> {

    const blockExplorerUrls = getExplorer(ssionChian);
    let item = { items: {}, pagination: {}, error: false, error_message: "", tokensymbol: "" };
    if (id !== "") {
        const goodsDatas = await transactions({ id: id, first: 10 }, ssionChian);

        let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        let jz = goodValue;



        let items: object[] = [];
        let pagination = {
            "has_more": true,
            "page_number": 0,
            "page_size": 10,
            "total_count": null
        };

        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;
        item.pagination = pagination;

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
    }

    // console.log(item,"********")
    return item;
}
