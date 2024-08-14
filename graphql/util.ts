
import { ethers } from "ethers";

// x的n次方
export function powerIterative(x: number, n: number): number {
    let result = 1;
    for (let i = 0; i < n; i++) {
        result *= x;
    }
    return result;
}


//   时间戳转换
export function timestampdToDate(timestamp: number): Date {
    return new Date(timestamp);
}


// 方法1: 使用Date对象的getTime方法
export function convertDateTimeToTimestamp(dateTime: string): number {
    const date = new Date(dateTime);
    return date.getTime();
}

// 方法2: 使用Date.parse静态方法
export function convertDateTimeToTimestampUsingParse(dateTime: string): number {
    return Date.parse(dateTime);
}

// 当前时间戳
export function Timestamp(): number {
    const date = new Date();
    return Math.floor(date.getTime() / 1000);
}

// 时间戳加减
export function timestampdToDateSub(days: number): number {
    let dateTime = Date.parse(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) - (days * 86400000);
    // console.log(days * 86400000,"****")
    return Math.floor(dateTime / 1000);
}

// 时间戳加减年
export function timestampdToDateYear(year: number): number {
    const timestamp = Date.now(); // 获取当前时间戳
    let date = new Date(timestamp); // 将时间戳转换为Date对象
    date.setFullYear(date.getFullYear() - year); // 减一年
    const newTimestamp = date.getTime();
    // let dateTime = Date.parse(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) - (days * 86400000);
    // console.log(days * 86400000,"****")
    return Math.floor(newTimestamp / 1000);
}

// 物品图标地址
export function iconUrl(chainName: string | undefined, address: string) {

    return `https://raw.githubusercontent.com/tt-swap/assets/master/blockchains/${chainName}/assets/${ethers.getAddress(address)}/logo.png`;
}

// 数字处理
export function prettifyCurrencys(value: number) {
    if (value < 1000000) {

        if (value < 0.01 && value > 0) {
            return '<0.01'
        }

        return toThousands(value.toFixed(2));
    }

    const suffixes = ['', '', 'M', 'B', 'T'];
    let magnitude = Math.floor(Math.log(value) / Math.log(1000));
    let scaled = value / Math.pow(1000, magnitude);
    // 将数字保留到适当的小数位
    // 例如：如果scaled < 10, 保留一位小数；如果 scaled < 100, 则不保留小数
    // if (scaled < 10) {
    return toThousands(scaled.toFixed(2)) + suffixes[magnitude];
};


// 数字处理
export function prettifyCurrencysFee(value: number) {
    if (value < 1000000) {

        if (value < 0.000001 && value > 0) {
            return '<0.000001'
        }
        if (value === 0) {
            return '0'
        }

        return toThousands(value.toFixed(6));
    }

    const suffixes = ['', '', 'M', 'B', 'T'];
    let magnitude = Math.floor(Math.log(value) / Math.log(1000));
    let scaled = value / Math.pow(1000, magnitude);
    // 将数字保留到适当的小数位
    // 例如：如果scaled < 10, 保留一位小数；如果 scaled < 100, 则不保留小数
    // if (scaled < 10) {
    return toThousands(scaled.toFixed(6)) + suffixes[magnitude];
};


// 钱包余额数字处理
export function prettifyBalance(value: number) {

    if (value < 1) {

        if (value < 0.000001) {
            return '<0.000001'
        }
        if (value === 0) {
            return '0'
        }

        return toThousands(value.toFixed(6));
    }

    return toThousands(value.toFixed(3));
};

function toThousands(value: string) {
    let a = value.split('.')[0];
    let b = value.split('.')[1];
    // console.log(a)
    var num: any = (a || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result + '.' + b;
}


// 时间戳相减换算为小时
export function timestampSubH(values: number) {
    let value = (new Date().getTime() - (values * 1000)) / 86400000;

    return Math.ceil(value);
}



// 数据编码处理
export function splitNumber(values: number) {
    let value = values / powerIterative(2, 128);
    let quantity = values % powerIterative(2, 128);

    return { value: value, quantity: quantity };
}