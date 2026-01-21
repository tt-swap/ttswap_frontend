import { getExplorer, getChainName } from '@/data/networks';
import { ethers } from "ethers";
import MarketManager from '@/data/abi/MarketManager.json';
import { getContractAddress } from '@/data/contractConfig';
import {
    myInvestGoodDatas, myTransactions, myDisInvestProof,
    myGoodDatas, myIndex, myCommission, referees, myReferees,
    goodStateMin, updateToken, createToken, tokensBalanceData
} from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, timestampSubH, withoutRounding, prettifyCurrencys } from '@/services/graphql/util';
import BigNumber from 'bignumber.js';

// 我的投资列表
export async function myInvestGoodsDatas(params: { id: string; address: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    let item = { items: [], pagination: { has_more: true }, error: false, error_message: "" };
    if (params.id !== "") {
        const goodsDatas = await myInvestGoodDatas({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

        // let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 12);
        // let jz = goodValue;


        let items: object[] = [];
        // let items: object[] = [{ id: "", good1: {}, good2: {} }];

        item.items = items;
        if (goodsDatas.data.proofStates.length < params.pageSize || goodsDatas.data.proofStates.length === 0) {
            item.pagination.has_more = false;
        }
        goodsDatas.data.proofStates.forEach((e: any) => {
            // let a = { id: "", islockgood: false, good1: {}, good2: {} };
            let base_decimals1 = powerIterative(10, e.good1.tokendecimals);
            let base_decimals2 = powerIterative(10, e.good2.tokendecimals);
            // let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", symbol: "", logo_url: "", investQuantity: 0, investShares: 0, allNAVPS: 0, investActualQuantity: 0,
                totalInvestValue: 0, NAVPS: 0, profit: 0, APY: 0, valueSymbol: "", earningRate: 0,
                isvaluegood: false, address: "", islockgood: false
            };
            let map1 = {
                id: "", name: "", symbol: "", logo_url: "", investQuantity: 0, investShares: 0, allNAVPS: 0, investActualQuantity: 0,
                totalInvestValue: 0, NAVPS: 0, profit: 0, APY: 0, valueSymbol: "", earningRate: 0,
                isvaluegood: false, address: "", islockgood: false
            };

            let proofValue = 0;
            if (e.good2Quantity > 0) {
                proofValue = e.proofValue / tokendecimals;// * 2;
            } else {
                proofValue = e.proofValue / tokendecimals;
            }
            map.id = e.id;
            map.name = e.good1.tokenname;
            map.symbol = e.good1.tokensymbol;
            map.islockgood = e.good1.islockgood;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.totalInvestValue = proofValue;
            map.logo_url = iconUrl(chainName, e.good1.erc20Address);
            map.investQuantity = e.good1Quantity / base_decimals1;
            map.investActualQuantity = e.good1ActualQuantity / base_decimals1;
            map.NAVPS = e.good1Quantity / e.good1Shares;//e.good1.feeQuantity / e.good1.investQuantity;
            map.allNAVPS = e.good1.investQuantity / e.good1.investShares;
            map.profit = (map.allNAVPS - map.NAVPS) * e.good1Shares / base_decimals1;//map.NAVPS * map.investQuantity - (e.good1ContructFee / base_decimals1);
            // map.APY = (map.profit / (map.investQuantity * timestampSubH(e.good1.modifiedTime))) * 365 * 100;
            map.earningRate = (map.allNAVPS - map.NAVPS) / map.NAVPS;//map.profit / map.investQuantity;
            map.investShares = e.good1Shares / base_decimals1;
            map.isvaluegood = e.good1.isvaluegood;
            map.address = e.good1.erc20Address;

            // a.id = e.id;
            // a.good1 = map;
            // if (e.good1.islockgood || e.good2.islockgood) {
            //     a.islockgood = true;
            // }
            items.push(map);
            if (e.good2Quantity > 0) {
                map1.id = e.id;
                map1.name = e.good2.tokenname;
                map1.symbol = e.good2.tokensymbol;
                map1.islockgood = e.good2.islockgood;
                map1.valueSymbol = goodsDatas.data.goodState.tokensymbol;
                map1.totalInvestValue = proofValue;
                map1.logo_url = iconUrl(chainName, e.good2.erc20Address);
                map1.investQuantity = e.good2Quantity / base_decimals2;
                map1.investActualQuantity = e.good2ActualQuantity / base_decimals2;
                map1.NAVPS = e.good2Quantity / e.good2Shares;
                map1.allNAVPS = e.good2.investQuantity / e.good2.investShares;//e.good2.feeQuantity / e.good2.investQuantity;
                map1.profit = (map1.allNAVPS - map1.NAVPS) * e.good2Shares / base_decimals2;//map1.NAVPS * map1.investQuantity - (e.good2ContructFee / base_decimals2);
                // map1.APY = (map1.profit / (map1.investQuantity * timestampSubH(e.good2.modifiedTime))) * 365;
                map1.earningRate = (map1.allNAVPS - map1.NAVPS) / map1.NAVPS;//map1.profit / map1.investQuantity;
                map1.investShares = e.good2Shares / base_decimals2;
                map1.isvaluegood = e.good2.isvaluegood;
                map1.address = e.good2.erc20Address;
                // a.good2 = map1;
                items.push(map1);
            }
            // items.push(a);
        });

        // console.log(item)
    }
    return item;
}

// 我的记录列表
export async function myTransactionsDatas(params: { id: string; address: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const blockExplorerUrls = getExplorer(ssionChian);
    // console.log(id !== "",id)
    let item = { items: {}, pagination: { has_more: true }, error: false, error_message: "", tokensymbol: "" };
    if (params.id !== "") {
        const goodsDatas = await myTransactions({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

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
            items.push(map);
        });
    }
    return item;
}

// 撤资数据
export async function myDisInvestProofGood(id: number, address: string, ssionChian: number): Promise<object> {
    const chainName = getChainName(ssionChian);
    const goodsDatas = await myDisInvestProof({ id: id, address: address.toLowerCase() }, ssionChian);

    let data = {
        id: 0, isvaluegood: false, ttsp: 0, ttsc: 0,
        good1: {},
        good2: {}
    };
    let map = {
        id: 0, symbol: "", decimals: 0, mining: 0, currentQuantity: 0, currentValue: 0, address: "",
        quantity: 0, NAVPS: 0, maxNum: 0, rate: 0, earningRate: 0, isvaluegood: false,
        profit: 0, APY: 0, nowNAVPS: 0, disfee: 0, investActualQuantity: 0,
        logo_url: "", investShares: 0, investQuantity: 0, allInvestShares: 0
    }
    let map1 = {
        id: 0, symbol: "", decimals: 0, mining: 0, currentQuantity: 0, currentValue: 0, address: "",
        quantity: 0, NAVPS: 0, maxNum: 0, rate: 0, earningRate: 0, isvaluegood: false,
        profit: 0, APY: 0, nowNAVPS: 0, disfee: 0, investActualQuantity: 0,
        logo_url: "", investShares: 0, investQuantity: 0, allInvestShares: 0
    }

    const m211 = new BigNumber(2).pow(211);
    const m217 = new BigNumber(2).pow(217);
    const m187 = new BigNumber(2).pow(187);
    const m177 = new BigNumber(2).pow(177);
    let tokendecimals1 = powerIterative(10, 12);

    data.good1 = map;
    data.good2 = map1;
    let good = goodsDatas.data.proofState;
    let good1 = good.good1;
    let decimals = powerIterative(10, 6);
    let decimals1 = powerIterative(10, good1.tokendecimals);
    let disfeeL1 = BigNumber(good1.goodConfig).mod(m217).div(m211).integerValue(1).div(10000).toNumber();// Math.floor(good1.goodConfig % (2 ** 217) / (2 ** 211)) / 10000;
    let click1 = BigNumber(good1.goodConfig).mod(m187).div(m177).toNumber();
    // let unitV1 = (good1.currentValue / decimals) / (good1.currentQuantity / decimals1);
    let good1N1: number;
    let good1N2: any;
    let maxNum1 = good1.currentQuantity / decimals1;
    if (click1 > 0) {
        good1N1 = (good1.currentQuantity / decimals1) / click1;
        // good1N2 = (good1.currentValue / decimals) / click1 / unitV1;
        maxNum1 = good1N1;// > good1N2 ? good1N2 : good1N1;
    }

    data.id = good.id;
    data.isvaluegood = good1.isvaluegood;
    data.ttsp = goodsDatas.data.ttsEnv.poolasset / goodsDatas.data.ttsEnv.poolvalue;
    data.ttsc = goodsDatas.data.customer.stakettscontruct / goodsDatas.data.customer.stakettsvalue;

    map.id = good1.id;
    map.symbol = good1.tokensymbol;
    map.isvaluegood = good1.isvaluegood;
    map.decimals = good1.tokendecimals;
    map.quantity = good.good1Quantity / decimals1;
    map.investActualQuantity = good.good1ActualQuantity / decimals1;
    map.investShares = good.good1Shares / decimals1;
    map.investQuantity = good1.investQuantity / decimals1;
    map.allInvestShares = good1.investShares / decimals1;
    map.nowNAVPS = good1.investQuantity / good1.investShares;
    map.NAVPS = good.good1Quantity / good.good1Shares;
    map.logo_url = iconUrl(chainName, good1.erc20Address);
    map.address = good1.erc20Address;
    // map.unitV = unitV1;
    // map.contructFee = good.good1ContructFee / decimals1;
    map.profit = (map.nowNAVPS - map.NAVPS) * map.investShares;//map.nowNAVPS * map.quantity - map.contructFee;
    map.APY = (map.profit / (map.quantity * timestampSubH(good.createTime))) * 365;
    map.disfee = map.quantity * disfeeL1;
    let czfs = maxNum1 / map.nowNAVPS;
    map.maxNum = withoutRounding(czfs, 6);
    console.log("??????", click1, czfs, good1, map.maxNum)
    map.rate = disfeeL1;
    map.earningRate = (map.nowNAVPS - map.NAVPS) / map.NAVPS;//map.profit / map.quantity;
    let good1v = good1.currentValue / good1.currentQuantity * good.good1ActualQuantity;
    map.mining = (good1v * data.ttsp - good1v * data.ttsc) / tokendecimals1;
    map.currentQuantity = good1.currentQuantity;
    map.currentValue = good1.currentValue;

    let good2 = good.good2;
    if (good2.id != "0x0000000000000000000000000000000000000000") {
        let decimals2 = powerIterative(10, good2.tokendecimals);
        let disfeeL2 = BigNumber(good2.goodConfig).mod(m217).div(m211).integerValue(1).div(10000).toNumber();
        let click2 = BigNumber(good2.goodConfig).mod(m187).div(m177).integerValue(1).div(10000).toNumber();
        let unitV2 = (good2.currentValue / decimals) / (good2.currentQuantity / decimals2);
        let good2N1: number;
        let good2N2: any;
        let maxNum2 = good2.currentQuantity / decimals2;
        if (click2 > 0) {
            good2N1 = (good2.currentQuantity / decimals2) / click2;
            // good2N2 = (good2.currentValue / decimals) / click2 / unitV2;
            maxNum2 = good2N1;// > good2N2 ? good2N2 : good2N1;
        }

        map1.id = good2.id;
        map1.symbol = good2.tokensymbol;
        map1.isvaluegood = good2.isvaluegood;
        map1.decimals = good2.tokendecimals;
        map1.quantity = good.good2Quantity / decimals2;
        map1.investActualQuantity = good.good2ActualQuantity / decimals2;
        map1.investShares = good.good2Shares / decimals2;
        map1.investQuantity = good2.investQuantity / decimals2;
        map1.allInvestShares = good2.investShares / decimals2;
        map1.nowNAVPS = good2.investQuantity / good2.investShares;
        map1.NAVPS = good.good2Quantity / good.good2Shares;
        // map1.unitV = unitV2;
        if (good2.id != 0) {
            map1.logo_url = iconUrl(chainName, good2.erc20Address);
        }
        map1.address = good2.erc20Address;
        // map1.nowNAVPS = good2.feeQuantity / good2.investQuantity;
        // map1.contructFee = good.good2ContructFee / decimals2;
        // map1.profit = map1.nowNAVPS * map1.quantity - map1.contructFee;
        map1.profit = (map1.nowNAVPS - map1.NAVPS) * map1.investShares;
        map1.earningRate = (map1.nowNAVPS - map1.NAVPS) / map1.NAVPS;
        map1.APY = (map1.profit / (map1.quantity * timestampSubH(good.createTime))) * 365;
        map1.disfee = map1.quantity * disfeeL2;
        let czfs2 = maxNum2 / map1.nowNAVPS;
        map1.maxNum = withoutRounding(czfs2, 6);
        map1.rate = disfeeL2;
        let good2v = good2.currentValue / good2.currentQuantity * good.good2ActualQuantity;
        map1.mining = (good2v * data.ttsp - good2v * data.ttsc) / tokendecimals1;
        map1.currentQuantity = good2.currentQuantity;
        map1.currentValue = good2.currentValue;
        // map1.earningRate = map1.profit / map1.quantity;
    }
    // console.log("??????", good1.investQuantity,good1.investShares,good2.investQuantity,good2.investShares,data)
    return data;
}


// myIndexes
export async function myIndexes(id: string, wallet_address: any, ssionChian: number): Promise<object> {

    let items = {
        disinvestCount: 0, disinvestValue: 0, investCount: 0, investValue: 0, stakettsvalue: 0, getfromstake: 0, mining: 0,
        tradeCount: 0, tradeValue: 0, totalcommissionvalue: 0, totalprofitvalue: 0, isEmpty: true, referralnum: 0
    };
    // console.log("myIndexes", id, wallet_address)
    if (id && wallet_address) {
        try {

            const goodsDatas = await myIndex({ id: id, address: wallet_address.toLowerCase() }, ssionChian);
            let goodQuantity = goodsDatas.data.goodState.currentQuantity / goodsDatas.data.goodState.currentValue;
            let tokendecimals = powerIterative(10, 6);
            let tokendecimals1 = powerIterative(10, 12);
            let data = goodsDatas.data.customer;
            items.isEmpty = false;
            items.disinvestCount = data.disinvestCount;
            items.investCount = data.investCount;
            items.tradeCount = data.tradeCount;
            items.disinvestValue = data.disinvestValue / tokendecimals * goodQuantity;
            items.investValue = data.investValue / tokendecimals * goodQuantity;
            items.tradeValue = data.tradeValue / tokendecimals * goodQuantity;
            items.totalcommissionvalue = data.totalcommissionvalue / tokendecimals * goodQuantity;
            items.totalprofitvalue = data.totalprofitvalue / tokendecimals * goodQuantity;
            items.stakettsvalue = data.stakettsvalue / tokendecimals * goodQuantity;
            items.getfromstake = data.getfromstake / tokendecimals1;
            items.mining = ((goodsDatas.data.ttsEnv.poolasset / goodsDatas.data.ttsEnv.poolvalue) * data.stakettsvalue - data.stakettscontruct) / tokendecimals1;
            items.referralnum = data.referralnum;
        } catch (error) {

        }
    }
    return items;
}

// 
export async function myGoodsDatas(params: { id: string; pageNumber: number; pageSize: number; address: string; }, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    // console.log(params,7777)
    let item = { items: {}, pagination: { page_number: 0, page_size: 0, has_more: true }, error: false, error_message: "" };

    if (params.id !== "") {
        // console.log(params,99999)
        const goodsDatas = await myGoodDatas({ id: params.id, first: params.pageSize, time: timestampdToDateSub(0), skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

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
                id: "", name: "", decimals: 0, symbol: "", logo_url: "", investQuantity: 0, investValue: 0, valueSymbol: "",
                totalInvestQuantity: 0, totalInvestValue: 0, investQuantity24: 0, investValue24: 0, unitPrice: 0, currentQuantity: 0,
                totalFee: 0, price: 0, price_24h: 0, totalFeeValue: 0, fee24: 0, feeValue24: 0, NAVPS: 0, APY: 0
            };

            map.id = e.id;
            map.name = e.tokenname;
            map.symbol = e.tokensymbol;
            map.valueSymbol = goodsDatas.data.goodStates.tokensymbol;
            map.decimals = e.tokendecimals;
            map.unitPrice = (e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals);
            map.investQuantity = e.investQuantity / base_decimals;
            map.currentQuantity = e.currentQuantity / base_decimals;
            map.investValue = e.investQuantity / base_decimals * current_price;
            map.totalInvestQuantity = e.totalInvestQuantity / base_decimals;
            map.totalFee = e.feeQuantity / base_decimals;
            map.totalInvestValue = e.totalInvestQuantity / base_decimals * current_price;
            map.totalFeeValue = e.feeQuantity / base_decimals * current_price;
            map.logo_url = iconUrl(chainName, e.erc20Address);
            map.price = current_price;
            map.NAVPS = e.investQuantity / e.investShares;//map.totalFee / map.investQuantity;

            // let uintF = e.feeQuantity / e.investQuantity;
            if (e.goodData.length > 0) {
                let en = e.goodData[0];
                // e.goodData.forEach((en: any) => {
                //     if (e.id === en.pargood.id) {
                let current_price_24h = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / jz;
                // let s = splitNumber(en.open);
                map.investQuantity24 = (e.investQuantity - en.investQuantity) / base_decimals;
                map.fee24 = (e.feeQuantity - en.feeQuantity) / base_decimals;
                map.investValue24 = (e.totalInvestQuantity - en.totalInvestQuantity) / base_decimals * current_price_24h;
                map.feeValue24 = (e.feeQuantity - en.feeQuantity) / base_decimals * current_price_24h;
                map.price_24h = current_price_24h;
                // map.APY = (uintF - en.feeQuantity / en.investQuantity) * 365;
                //     }
                // });
            } else {
                map.investQuantity24 = map.investQuantity;
                map.fee24 = map.totalFee;
                map.investValue24 = map.investValue;
                map.feeValue24 = map.totalFeeValue;
                // if (map.totalFee > 0)
                //     map.APY = (uintF - map.NAVPS) * 365;
                // map.APY = 0;
            }

            items.push(map);
            // console.log(items,8686868)
        });


        // return item;
    }
    return item;
}


// My Commission
export async function myCommissions(params: { id: string; pageNumber: number; pageSize: number; address: string; }, ssionChian: number) {
    const chainName = getChainName(ssionChian);
    const goodsDatas = await myCommission({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);
    let item = { items: {}, ids: {}, totalcommissionvalue: 0, totalValue: 0, pagination: { has_more: true }, error: false, error_message: "" };

    let items: object[] = [];
    let ids: number[] = [];
    item.items = items;
    item.ids = ids;
    if (goodsDatas.data.goodStates.length < params.pageSize || goodsDatas.data.goodStates.length === 0) {
        item.pagination.has_more = false;
    }

    let goodQuantity = goodsDatas.data.goodState.currentQuantity / goodsDatas.data.goodState.currentValue;
    let tokendecimals1 = powerIterative(10, 6);
    const goodsValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    const base_decimals = powerIterative(10, goodsDatas.data.goodState.tokendecimals);

    item.totalcommissionvalue = goodsDatas.data.customer.totalcommissionvalue / tokendecimals1 * goodQuantity;
    goodsDatas.data.goodStates.forEach((e: any) => {
        const base_decimals1 = powerIterative(10, e.tokendecimals);
        const goods = (e.currentValue / base_decimals) / (e.currentQuantity / base_decimals1);
        const price = goods / goodsValue;
        // console.log(goodsValue,goods,(e.currentValue / base_decimals),(e.currentQuantity / base_decimals1))
        let map = {
            id: "", name: "", symbol: "", logo_url: "", totalFeeQantity: 0, price: 0, valueSymbol: '', tokendecimals: 0,
            totalFeeAmount: 0, myFeeQuanity: 0, myFeeAmount: 0, totalTradeCount: 0,
        };

        map.id = e.id;
        map.name = e.tokenname;
        map.symbol = e.tokensymbol;
        map.tokendecimals = e.tokendecimals;
        map.logo_url = iconUrl(chainName, e.erc20Address);
        map.totalFeeQantity = e.feeQuantity / base_decimals1;
        map.totalFeeAmount = map.totalFeeQantity * price;
        map.totalTradeCount = e.totalTradeCount;
        map.price = price;
        map.valueSymbol = goodsDatas.data.goodState.tokensymbol;

        ids.push(e.id);
        items.push(map);
    });

    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum);
    const contractAddress = getContractAddress(ssionChian);
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, MarketManager, signer);
    console.log(item.ids);

    let feeQs: number[] = [];
    await contract.queryCommission(item.ids, params.address).then((transaction) => {
        transaction.map((num: any) => {
            feeQs.push(Number(num));
            console.log('Transaction sent:', num);
        })
        console.log('Transaction sent:', transaction, feeQs, item.ids, params.address);
    }).catch((error: any) => {
        console.error('出错:', error);
    });
    console.log("item.ids----", feeQs);
    ids.length = 0;
    let mun = 0;
    items.map((value, index) => {
        // console.log('items:', value,index);
        if (feeQs[index] > 0) {
            // @ts-ignore
            value.myFeeQuanity = feeQs[index] / 10 ** value.tokendecimals;
            // @ts-ignore
            value.myFeeAmount = value.myFeeQuanity * value.price;
            // @ts-ignore
            mun = mun + value.myFeeAmount;
            // @ts-ignore
            if (value.myFeeAmount > 0.1) {
                // @ts-ignore
                ids.push(value.id);
            }
        }
    })
    item.totalValue = mun;
    return item;
}


//refereesDatas
export async function refereesDatas(wallet_address: any, ssionChian: number): Promise<object> {

    let items = { referralnum: 0 };
    if (wallet_address !== undefined) {
        const goodsDatas = await referees({ address: wallet_address.toLowerCase() }, ssionChian);
        let data = goodsDatas.data.customer;
        items.referralnum = data.referralnum;
    }
    return items;
}


// 我的记录列表
export async function myRefereesDatas(params: { id: string; address: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const blockExplorerUrls = getExplorer(ssionChian);
    // console.log(id !== "",id)
    let item = { items: {}, pagination: { has_more: true }, error: false, error_message: "", tokensymbol: "" };
    if (params.id !== "") {
        const goodsDatas = await myReferees({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

        let goodQuantity = goodsDatas.data.goodState.currentQuantity / goodsDatas.data.goodState.currentValue;
        let tokendecimals = powerIterative(10, 6);

        let items: object[] = [];
        item.items = items;
        item.tokensymbol = goodsDatas.data.goodState.tokensymbol;

        item.items = items;
        if (goodsDatas.data.customers.length < params.pageSize || goodsDatas.data.customers.length === 0) {
            item.pagination.has_more = false;
        }

        goodsDatas.data.customers.forEach((e: any) => {
            let map = {
                id: "", disinvestValue: 0, investValue: 0, totalprofitvalue: 0, lastoptime: 0,
                link: "", tradeValue: 0, valueSymbol: ""
            };

            map.id = e.id;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            // @ts-ignore
            map.link = blockExplorerUrls[0] + "/address/" + e.id;
            map.disinvestValue = e.disinvestValue / tokendecimals * goodQuantity;
            map.investValue = e.investValue / tokendecimals * goodQuantity;
            map.tradeValue = e.tradeValue / tokendecimals * goodQuantity;
            map.totalprofitvalue = e.totalprofitvalue / tokendecimals * goodQuantity;
            map.lastoptime = e.lastoptime * 1000;
            items.push(map);
        });
    }
    return item;
}


//minThreshold
export async function minThreshold(id: string, ssionChian: number): Promise<object> {

    let items = { minThreshold: "" };
    if (id !== undefined) {
        const goodsDatas = await goodStateMin({ address: id.toLowerCase() }, ssionChian);
        let data = goodsDatas.data.goodState;
        const quantity = 500000000 * (data.currentQuantity / data.currentValue) / powerIterative(10, data.tokendecimals);
        items.minThreshold = quantity + " " + data.tokensymbol;
    }
    return items;
}



// upToken
export async function upToken(id: string, ssionChian: number): Promise<object> {

    let items = {
        investFee: 0, divestFee: 0, buyFee: 0, sellFee: 0, investM: 0, divestChips: 0, maxInvestM: 0, islock: 0,
    };
    // console.log("myIndexes", id, wallet_address)
    if (id) {
        const goodsDatas = await updateToken({ id: id }, ssionChian);
        const goodConfig = new BigNumber(goodsDatas.data.goodState.goodConfig);
        const m255 = new BigNumber(2).pow(255);
        const m254 = new BigNumber(2).pow(254);
        const m229 = new BigNumber(2).pow(229);
        const m224 = new BigNumber(2).pow(224);
        const m223 = new BigNumber(2).pow(223);
        const m217 = new BigNumber(2).pow(217);
        const m211 = new BigNumber(2).pow(211);
        const m204 = new BigNumber(2).pow(204);
        const m197 = new BigNumber(2).pow(197);
        const m192 = new BigNumber(2).pow(192);
        const m187 = new BigNumber(2).pow(187);
        const m177 = new BigNumber(2).pow(177);
        items.islock = goodConfig.mod(m255).div(m254).integerValue(1).toNumber();
        items.investFee = goodConfig.mod(m223).div(m217).integerValue(1).toNumber();
        items.divestFee = goodConfig.mod(m217).div(m211).integerValue(1).toNumber();
        items.buyFee = goodConfig.mod(m211).div(m204).integerValue(1).toNumber();
        items.sellFee = goodConfig.mod(m204).div(m197).integerValue(1).toNumber();
        items.divestChips = goodConfig.mod(m187).div(m177).integerValue(1).toNumber();
        items.investM = goodConfig.mod(m192).div(m187).integerValue(1).toNumber();
        items.maxInvestM = goodConfig.mod(m229).div(m224).integerValue(1).toNumber();
        if (items.maxInvestM === 0) {
            items.maxInvestM = 1
        }


    }
    return items;
}

// marketToken
export async function marketToken(id: string, ssionChian: number): Promise<object> {

    let items = {
        investor: 0, operator: 0, portal: 0, recommender: 0, user: 0, agreement: 0, MaxLiquidity: 0,
        isvalue: 0, islock: 0, isapply: 0
    };
    // console.log("myIndexes", id, wallet_address)
    if (id) {
        const goodsDatas = await updateToken({ id: id }, ssionChian);
        const goodConfig = new BigNumber(goodsDatas.data.goodState.goodConfig);
        const m256 = new BigNumber(2).pow(256);
        const m255 = new BigNumber(2).pow(255);
        const m254 = new BigNumber(2).pow(254);
        const m251 = new BigNumber(2).pow(251);
        const m247 = new BigNumber(2).pow(247);
        const m244 = new BigNumber(2).pow(244);
        const m239 = new BigNumber(2).pow(239);
        const m234 = new BigNumber(2).pow(234);
        const m229 = new BigNumber(2).pow(229);
        const m224 = new BigNumber(2).pow(224);
        const m223 = new BigNumber(2).pow(223);
        console.log("m223m223---", m223.integerValue(1))

        items.isvalue = goodConfig.mod(m256).div(m255).integerValue(1).toNumber();
        items.islock = goodConfig.mod(m255).div(m254).integerValue(1).toNumber();
        items.isapply = goodConfig.mod(m224).div(m223).integerValue(1).toNumber();

        items.investor = goodConfig.mod(m254).div(m251).integerValue(1).toNumber() * 10;
        items.operator = goodConfig.mod(m251).div(m247).integerValue(1).toNumber() * 2;
        items.portal = goodConfig.mod(m247).div(m244).integerValue(1).toNumber() * 4;
        items.recommender = goodConfig.mod(m244).div(m239).integerValue(1).toNumber();
        items.user = goodConfig.mod(m239).div(m234).integerValue(1).toNumber();
        items.agreement = goodConfig.mod(m234).div(m229).integerValue(1).toNumber();
        items.MaxLiquidity = goodConfig.mod(m229).div(m224).integerValue(1).toNumber();
        if (items.MaxLiquidity === 0) {
            items.MaxLiquidity = 1
        }


    }
    return items;
}


//createTokenV
export async function createTokenV(id: string, ssionChian: number) {
    const chainName = getChainName(ssionChian);
    const goodsData = await createToken({ id }, ssionChian);
    const goodState = goodsData.data.goodState;
    const good = goodsData.data.goodStates;

    const goodValue = goodState.currentValue / goodState.currentQuantity;
    const tokendecimals = powerIterative(10, 6);

    let items = [];
    good.forEach((e: any) => {

        let base_decimals = powerIterative(10, e.tokendecimals);
        let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / goodValue;

        let map = {
            id: e.id,
            name: e.tokenname,
            decimals: e.tokendecimals,
            symbol: e.tokensymbol,
            logo_url: iconUrl(chainName, e.erc20Address),
            address: e.erc20Address,
            price: current_price
        };
        items.push(map);
    });
    return items;
}



//钱包余额列表
export async function tokensBalance(params: { id: string; wallet: string }, ssionChian: number): Promise<object> {
    const chainName = getChainName(ssionChian);
    let item = { tokens: [], transactions: [] };
    if (params.id !== "") {

        const goodsDatas = await tokensBalanceData({ id: params.id, address: params.wallet?.toLowerCase(), time: timestampdToDateSub(0) }, ssionChian);

        const goodState = goodsDatas.data.goodState;
        // console.log("***&&", goodState.goodData[0].currentValue)
        const goodValue = goodState.currentValue / goodState.currentQuantity;
        // const goodValue24 = goodState.goodData[0].currentValue / goodState.goodData[0].currentQuantity;
        const tokendecimals = powerIterative(10, 6);

        goodsDatas.data.goodStates.forEach((en: any) => {
            let map1 = {
                id: "", name: "", decimals: 0, symbol: "", price: 0, logo_url: "",
                address: "", isvaluegood: false, valueSymbol: "", h24: 0, balance: 0
            };
            let base_decimals = powerIterative(10, en.tokendecimals);
            let current_price = ((en.currentValue / tokendecimals) / (en.currentQuantity / base_decimals)) / goodValue;
            let current_price24 = ((en.goodData[0].currentValue / tokendecimals) / (en.goodData[0].currentQuantity / base_decimals)) / goodValue;
            // let t24 = (en.totalTradeQuantity - en.goodData[0].totalTradeQuantity) / base_decimals
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
            // map1.trade24hValue = t24 * current_price;
            item.tokens.push(map1);
        });

        goodsDatas.data.transactions.forEach((e: any) => {
            let from_decimals = powerIterative(10, e.fromgood.tokendecimals);
            let to_decimals = powerIterative(10, e.togood.tokendecimals);
            let map = {
                id: "", type: "", symbol1: "", symbol2: "", fromgoodQuanity: 0, togoodQuantity: 0,
                time: 0, valueSymbol: ""
            };

            map.id = e.id;
            map.time = e.timestamp * 1000;
            map.type = e.transtype;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            map.symbol1 = e.fromgood.tokensymbol;
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
            item.transactions.push(map);
        });
    }
    // console.log(item,"***&&")
    return item;
}
