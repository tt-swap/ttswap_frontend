import { getExplorer, getChainName } from '@/data/networks';
import { ethers } from "ethers";
import MarketManager from '@/data/abi/MarketManager.json';
import { getContractAddress } from '@/data/contractConfig';
import { myInvestGoodDatas, myTransactions, myDisInvestProof, myGoodDatas, myIndex, myCommission, referees, myReferees,goodStateMin } from './graphql';
import { timestampdToDateSub, powerIterative, iconUrl, timestampSubH, withoutRounding } from '@/graphql/util';
import BigNumber from 'bignumber.js';
import { goodState } from '../graphql';

// 我的投资列表
export async function myInvestGoodsDatas(params: { id: string; address: string; pageNumber: number; pageSize: number; }, ssionChian: number): Promise<object> {

    const chainName = getChainName(ssionChian);
    let item = { items: {}, pagination: { has_more: true }, error: false, error_message: "" };
    if (params.id !== "") {
        const goodsDatas = await myInvestGoodDatas({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber, address: params.address.toLowerCase() }, ssionChian);

        // let goodValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
        let tokendecimals = powerIterative(10, 6);
        // let jz = goodValue;


        let items: object[] = [];

        item.items = items;
        if (goodsDatas.data.proofStates.length < params.pageSize || goodsDatas.data.proofStates.length === 0) {
            item.pagination.has_more = false;
        }
        goodsDatas.data.proofStates.forEach((e: any) => {
            let base_decimals1 = powerIterative(10, e.good1.tokendecimals);
            let base_decimals2 = powerIterative(10, e.good2.tokendecimals);
            // let current_price = ((e.currentValue / tokendecimals) / (e.currentQuantity / base_decimals)) / jz;

            let map = {
                id: "", name: "", symbol: "", logo_url: "", investQuantity: 0, investShares: 0, allNAVPS: 0, investActualQuantity: 0,
                totalInvestValue: 0, NAVPS: 0, profit: 0, APY: 0, valueSymbol: "", earningRate: 0
            };
            let map1 = {
                id: "", name: "", symbol: "", logo_url: "", investQuantity: 0, investShares: 0, allNAVPS: 0, investActualQuantity: 0,
                totalInvestValue: 0, NAVPS: 0, profit: 0, APY: 0, valueSymbol: "", earningRate: 0
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

            items.push(map);
            if (e.good2Quantity > 0) {
                map1.id = e.id;
                map1.name = e.good2.tokenname;
                map1.symbol = e.good2.tokensymbol;
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

                items.push(map1);
            }
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
export async function myDisInvestProofGood(id: number, ssionChian: number): Promise<object> {
    const chainName = getChainName(ssionChian);
    const goodsDatas = await myDisInvestProof({ id: id }, ssionChian);

    let data = {
        id: 0, isvaluegood: false,
        good1: {},
        good2: {}
    };
    let map = {
        id: 0, symbol: "", decimals: 0, quantity: 0, NAVPS: 0, maxNum: 0, rate: 0, earningRate: 0,
        profit: 0, APY: 0, nowNAVPS: 0, disfee: 0, investActualQuantity: 0, logo_url: "", investShares: 0, investQuantity: 0, allInvestShares: 0
    }
    let map1 = {
        id: 0, symbol: "", decimals: 0, quantity: 0, NAVPS: 0, maxNum: 0, rate: 0, earningRate: 0,
        profit: 0, APY: 0, nowNAVPS: 0, disfee: 0, investActualQuantity: 0, logo_url: "", investShares: 0, investQuantity: 0, allInvestShares: 0
    }

    const m211 = new BigNumber(2).pow(211);
    const m217 = new BigNumber(2).pow(217);
    const m187 = new BigNumber(2).pow(187);
    const m177 = new BigNumber(2).pow(177);

    data.good1 = map;
    data.good2 = map1;
    let good = goodsDatas.data.proofState;
    let good1 = good.good1;
    let decimals = powerIterative(10, 6);
    let decimals1 = powerIterative(10, good1.tokendecimals);
    let disfeeL1 = BigNumber(good1.goodConfig).mod(m217).div(m211).integerValue(1).div(10000).toNumber();// Math.floor(good1.goodConfig % (2 ** 217) / (2 ** 211)) / 10000;
    let click1 = BigNumber(good1.goodConfig).mod(m187).div(m177).toNumber();
    // let unitV1 = (good1.currentValue / decimals) / (good1.currentQuantity / decimals1);
    let good1N1;
    let good1N2;
    let maxNum1 = good1.currentQuantity / decimals1;
    if (click1 > 0) {
        good1N1 = (good1.currentQuantity / decimals1) / click1;
        // good1N2 = (good1.currentValue / decimals) / click1 / unitV1;
        maxNum1 = good1N1;// > good1N2 ? good1N2 : good1N1;
    }

    data.id = good.id;
    data.isvaluegood = good1.isvaluegood;

    map.id = good1.id;
    map.symbol = good1.tokensymbol;
    map.decimals = good1.tokendecimals;
    map.quantity = good.good1Quantity / decimals1;
    map.investActualQuantity = good.good1ActualQuantity / decimals1;
    map.investShares = good.good1Shares / decimals1;
    map.investQuantity = good1.investQuantity / decimals1;
    map.allInvestShares = good1.investShares / decimals1;
    map.nowNAVPS = good1.investQuantity / good1.investShares;
    map.NAVPS = good.good1Quantity / good.good1Shares;
    map.logo_url = iconUrl(chainName, good1.erc20Address);
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

    let good2 = good.good2;
    let decimals2 = powerIterative(10, good2.tokendecimals);
    let disfeeL2 = BigNumber(good2.goodConfig).mod(m217).div(m211).integerValue(1).div(10000).toNumber();
    let click2 = BigNumber(good2.goodConfig).mod(m187).div(m177).integerValue(1).div(10000).toNumber();
    let unitV2 = (good2.currentValue / decimals) / (good2.currentQuantity / decimals2);
    let good2N1;
    let good2N2;
    let maxNum2 = good2.currentQuantity / decimals2;
    if (click2 > 0) {
        good2N1 = (good2.currentQuantity / decimals2) / click2;
        // good2N2 = (good2.currentValue / decimals) / click2 / unitV2;
        maxNum2 = good2N1;// > good2N2 ? good2N2 : good2N1;
    }

    map1.id = good2.id;
    map1.symbol = good2.tokensymbol;
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
    // map1.earningRate = map1.profit / map1.quantity;
    // console.log("??????", good1.investQuantity,good1.investShares,good2.investQuantity,good2.investShares,data)
    return data;
}


// myIndexes
export async function myIndexes(id: string, wallet_address: any, ssionChian: number): Promise<object> {

    let items = {
        disinvestCount: 0, disinvestValue: 0, investCount: 0, investValue: 0, stakettsvalue: 0, getfromstake: 0, mining: 0,
        tradeCount: 0, tradeValue: 0, totalcommissionvalue: 0, totalprofitvalue: 0, isEmpty: true
    };
    if (id && wallet_address !== null) {
        const goodsDatas = await myIndex({ id: id, address: wallet_address.toLowerCase() }, ssionChian);
        let goodQuantity = goodsDatas.data.goodState.currentQuantity / goodsDatas.data.goodState.currentValue;
        let tokendecimals = powerIterative(10, 6);
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
        items.getfromstake = data.getfromstake / tokendecimals;
        items.mining = ((goodsDatas.data.ttsEnv.poolasset / goodsDatas.data.ttsEnv.poolvalue) * data.stakettsvalue - data.stakettscontruct) / tokendecimals;
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
    const goodsDatas = await myCommission({ id: params.id, first: params.pageSize, skip: params.pageSize * params.pageNumber }, ssionChian);
    let item = { items: {}, ids: {}, pagination: { has_more: true }, error: false, error_message: "" };

    let items: object[] = [];
    let ids: number[] = [];
    item.items = items;
    item.ids = ids;
    if (goodsDatas.data.goodStates.length < params.pageSize || goodsDatas.data.goodStates.length === 0) {
        item.pagination.has_more = false;
    }

    const goodsValue = goodsDatas.data.goodState.currentValue / goodsDatas.data.goodState.currentQuantity;
    const base_decimals = powerIterative(10, goodsDatas.data.goodState.tokendecimals);
    goodsDatas.data.goodStates.forEach((e: any) => {
        const base_decimals1 = powerIterative(10, e.tokendecimals);
        const goods = (e.currentValue / base_decimals) / (e.currentQuantity / base_decimals1);
        const price = goods / goodsValue;
        // console.log(goodsValue,goods,(e.currentValue / base_decimals),(e.currentQuantity / base_decimals1))
        let map = {
            id: "", name: "", symbol: "", logo_url: "", totalFeeQantity: 0, price: 0, valueSymbol: '', tokendecimals: 0,
            totalFeeAmount: 0, myFeeQuanity: 0, myFeeAmount: 0, totalTradeCount: 0
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
        })
        console.log('Transaction sent:', transaction, feeQs, item.ids, params.address);
    }).catch((error: any) => {
        console.error('出错:', error);
    });
    ids.length = 0;
    items.map((value, index) => {
        // console.log('items:', value,index);
        if (feeQs[index] > 0) {
            // @ts-ignore
            value.myFeeQuanity = feeQs[index] / 10 ** value.tokendecimals;
            // @ts-ignore
            value.myFeeAmount = value.myFeeQuanity * value.price;
            // @ts-ignore
            if (value.myFeeAmount > 0.1) {
                // @ts-ignore
                ids.push(value.id);
            }
        }
    })
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
                id: "", disinvestValue: 0, investValue: 0,
                link: "", tradeValue: 0, valueSymbol: ""
            };

            map.id = e.id;
            map.valueSymbol = goodsDatas.data.goodState.tokensymbol;
            // @ts-ignore
            map.link = blockExplorerUrls[0] + "/address/" + e.id;
            map.disinvestValue = e.disinvestValue / tokendecimals * goodQuantity;
            map.investValue = e.investValue / tokendecimals * goodQuantity;
            map.tradeValue = e.tradeValue / tokendecimals * goodQuantity;
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
        const quantity= 500000000 * (data.currentQuantity/data.currentValue) /powerIterative(10, data.tokendecimals);
        items.minThreshold = quantity+" " + data.tokensymbol;
    }
    return items;
}

