
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
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    let dateTime = new Date(year, month, date - days).getTime();
    // let dateTime = Date.parse(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) - (days * 86400000);
    // console.log("timestampdToDateSub", days * 86400000, "****", dateTime)
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

    return `https://ttswap.io/github/ttswap/assets/master/blockchains/${chainName}/assets/${ethers.getAddress(address)}/logo.png`;
}
// 物品info.json地址
export function infoUrl(chainName: string | undefined, address: string) {

    return `https://ttswap.io/github/ttswap/assets/master/blockchains/${chainName}/assets/${ethers.getAddress(address)}/info.json`;
}

// 数字处理
export function prettifyCurrencys(value: number) {
    if (value === 0) {
        return '0'
    }
    if (value < 1 && value > 0) {
        return toPrecision(value);
        // return '<0.01'
    }

    return formatLargeNumber(value, 2);
};

//正则表达式增强版获取小数位数
export function getDecimalPlaces(num: number): number {
    const match = num.toString().match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match || !match[1]) return 0;
    return match[1].length - (match[2] ? parseInt(match[2]) : 0);
}
export function toPrecision(value: number) {
    return parseFloat(value.toPrecision(3)).toString();
}

// 数字处理
export function prettifyCurrencysFee(value: number) {
    if (value === 0) {
        return '0'
    }
    if (value < 0.000001 && value > 0) {
        return '<0.000001'
    }

    return formatLargeNumber(value, 6);
};

// 小数处理（不四舍五入）
export function withoutRounding(value: number, a: number) {
    let str = value.toString();
    let decimalIndex = str.indexOf('.');
    a = Number(decimalIndex) + Number(a) + 1;
    let result = str.slice(0, a);
    console.log("---==[[", a, str, decimalIndex, result);

    return Number(result);
};

// 钱包余额数字处理
export function prettifyBalance(value: number) {
    if (value < 1) {
        if (value === 0) {
            return '0';
        }
        if (value < 0.000001) {
            return '<0.000001';
        }
        return toThousands(value.toFixed(6));
    }
    return toThousands(value.toFixed(3));
}

function toThousands(value: string) {
    let [a, b] = value.split('.');
    let num: any = (a || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result + (b ? '.' + b : '');
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


export function formatLargeNumber(num: number, a: number): string {
    const suffixes = ["", "M", "B", "T"]; // 后缀：百万、十亿、万亿
    const threshold = 1000000; // 阈值，超过 100 万才添加后缀

    // 处理负数
    const isNegative = num < 0;
    num = Math.abs(num);

    // 判断是否需要添加后缀
    let suffixIndex = 0;
    while (num >= threshold && suffixIndex < suffixes.length - 1) {
        num /= threshold;
        suffixIndex++;
    }

    // 格式化整数部分和小数部分
    const formattedNumber = num.toLocaleString("en-US", {
        minimumFractionDigits: a,
        maximumFractionDigits: a,
    });

    // 添加后缀
    const suffix = suffixes[suffixIndex];
    const result = `${formattedNumber}${suffix}`;

    // 恢复负数符号
    return isNegative ? `-${result}` : result;
}

export function calculateFeePercentage(number: number) {
    const sign = number > 0 ? "+" : "";

    const formattedPercentage = `${sign}${(number * 100).toFixed(2)}%`;

    return formattedPercentage;
}

export function complete24HourData(rawData: any[][], intervalMinutes: number = 20): any[][] {
    if (rawData.length === 0) return [];

    // 1. 创建原始数据的副本以避免修改原始数据
    const originalDataMap: Map<string, any[]> = new Map();
    const originalTimePoints: { datetime: string, totalMinutes: number }[] = [];

    rawData.forEach(item => {
        const datetime = item[0] as string;
        // 保存原始数据的副本
        originalDataMap.set(datetime, [...item]);

        // 计算时间对应的总分钟数
        const [dayStr, timeStr] = datetime.split(' ');
        const [hourStr, minuteStr] = timeStr.split(':');

        const day = parseInt(dayStr, 10);
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        // 从第一天00:00开始的总分钟数
        const totalMinutes = day * 24 * 60 + hour * 60 + minute;
        originalTimePoints.push({ datetime, totalMinutes });
    });

    // 2. 按时间排序原始数据点
    originalTimePoints.sort((a, b) => a.totalMinutes - b.totalMinutes);

    // 3. 解析第一条数据的时间作为起始点
    const firstDateTime = originalTimePoints[0].datetime;
    const [startDayStr, startTimeStr] = firstDateTime.split(' ');
    const [startHourStr, startMinuteStr] = startTimeStr.split(':');

    const startDay = parseInt(startDayStr, 10);
    const startHour = parseInt(startHourStr, 10);
    const startMinute = parseInt(startMinuteStr, 10);

    // 4. 计算起始时间对应的分钟数（从第一天00:00开始）
    const startTotalMinutes = startDay * 24 * 60 + startHour * 60 + startMinute;

    // 5. 生成24小时（1440分钟）内每intervalMinutes的时间点
    const result: any[][] = [];
    let lastValidData: any[] | null = null;

    // 跟踪已使用的原始数据索引
    let originalDataIndex = 0;

    // 遍历24小时内的每个intervalMinutes间隔
    for (let minutesOffset = 0; minutesOffset < 24 * 60; minutesOffset += intervalMinutes) {
        // 计算当前时间点的总分钟数
        const currentTotalMinutes = startTotalMinutes + minutesOffset;

        // 转换为天、小时、分钟
        const currentDay = Math.floor(currentTotalMinutes / (24 * 60));
        const minutesInDay = currentTotalMinutes % (24 * 60);
        const currentHour = Math.floor(minutesInDay / 60);
        const currentMinute = minutesInDay % 60;

        // 格式化时间字符串
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const datetimeStr = `${currentDay.toString().padStart(2, '0')} ${timeStr}`;

        // 检查是否有原始数据在这个时间点附近
        let foundOriginalData = false;

        for (let i = 0; i < originalTimePoints.length; i++) {
            const point = originalTimePoints[i];
            const timeDiff = Math.abs(point.totalMinutes - currentTotalMinutes);

            // 如果时间差在intervalMinutes/2以内，认为是同一时间点
            if (timeDiff <= intervalMinutes / 2 && !result.some(item => item[0] === point.datetime)) {
                // 使用原始数据，保留原始时间戳
                const originalData = originalDataMap.get(point.datetime)!;
                result.push([...originalData]); // 复制原始数据
                lastValidData = originalData;
                foundOriginalData = true;
                break;
            }
        }

        // 如果没有找到接近的原始数据，使用上一条数据填充
        if (!foundOriginalData) {
            if (lastValidData) {
                const filledData = [
                    datetimeStr, // 使用计算的间隔时间
                    lastValidData[2], // 使用上一条数据的收盘价作为开盘价
                    lastValidData[2], // 最高价
                    lastValidData[2], // 最低价
                    lastValidData[2], // 收盘价
                    0 // 交易量为0
                ];
                result.push(filledData);
            } else {
                // 如果没有上一条数据，使用第一条原始数据的值
                if (originalTimePoints.length > 0) {
                    const firstOriginalData = originalDataMap.get(originalTimePoints[0].datetime)!;
                    const filledData = [
                        datetimeStr,
                        firstOriginalData[2],
                        firstOriginalData[2],
                        firstOriginalData[2],
                        firstOriginalData[2],
                        0,
                        // 0,
                    ];
                    result.push(filledData);
                    lastValidData = filledData;
                }
            }
        }
    }

    // 如果原始数据点比生成的间隔点更多，将剩余的原始数据点插入到合适的位置
    for (const point of originalTimePoints) {
        const originalData = originalDataMap.get(point.datetime)!;
        // 检查这个原始数据点是否已经在结果中
        const exists = result.some(item => {
            // 检查是否是原始数据点（时间戳相同）
            return item[0] === point.datetime ||
                // 或者检查是否是来自原始数据的副本（值相同但时间可能已被修改）
                (item[1] === originalData[1] &&
                    item[2] === originalData[2] &&
                    item[3] === originalData[3] &&
                    item[4] === originalData[4] &&
                    item[5] === originalData[5]);
        });

        if (!exists) {
            // 找到应该插入的位置（按时间顺序）
            let inserted = false;
            for (let i = 0; i < result.length; i++) {
                const [resultDayStr, resultTimeStr] = result[i][0].toString().split(' ');
                const [resultHourStr, resultMinuteStr] = resultTimeStr.split(':');

                const resultDay = parseInt(resultDayStr, 10);
                const resultHour = parseInt(resultHourStr, 10);
                const resultMinute = parseInt(resultMinuteStr, 10);
                const resultTotalMinutes = resultDay * 24 * 60 + resultHour * 60 + resultMinute;

                if (point.totalMinutes < resultTotalMinutes) {
                    // 插入原始数据，保留原始时间戳
                    result.splice(i, 0, [...originalData]);
                    inserted = true;
                    break;
                }
            }

            // 如果没有找到合适的位置，添加到末尾
            if (!inserted) {
                result.push([...originalData]);
            }
        }
    }

    // 最终按时间排序
    result.sort((a, b) => {
        const [aDayStr, aTimeStr] = a[0].toString().split(' ');
        const [aHourStr, aMinuteStr] = aTimeStr.split(':');
        const aTotalMinutes = parseInt(aDayStr, 10) * 24 * 60 + parseInt(aHourStr, 10) * 60 + parseInt(aMinuteStr, 10);

        const [bDayStr, bTimeStr] = b[0].toString().split(' ');
        const [bHourStr, bMinuteStr] = bTimeStr.split(':');
        const bTotalMinutes = parseInt(bDayStr, 10) * 24 * 60 + parseInt(bHourStr, 10) * 60 + parseInt(bMinuteStr, 10);

        return aTotalMinutes - bTotalMinutes;
    });

    return result;
}

interface LiquidityData {
    dt: number;                    // 时间戳（毫秒）
    quote_currency: string;        // 报价货币
    volume: number; // 流动性报价（格式化）
}

/**
 * 从第一条数据时间开始，补全7天内每天的数据
 * @param rawData 原始数据数组
 * @returns 补全后的完整数据
 */
export function complete7DayData(rawData: LiquidityData[], days: number = 7): LiquidityData[] {
    if (rawData.length === 0) return [];

    // 1. 按时间排序原始数据
    const sortedData = [...rawData].sort((a, b) => a.dt - b.dt);

    // 2. 创建原始数据映射，按天分组（以日期字符串为键）
    const originalDataByDay = new Map<string, LiquidityData>();
    sortedData.forEach(item => {
        const dateStr = timestampToDateString(item.dt);
        originalDataByDay.set(dateStr, item);
    });

    // 3. 获取第一条数据的时间作为起始点
    const firstData = sortedData[0];
    const startDate = new Date(firstData.dt);

    // 设置起始时间为当天的 00:00:00.000
    startDate.setHours(0, 0, 0, 0);
    const startTimestamp = startDate.getTime();

    // 4. 生成7天内每天的日期时间戳（每天 00:00:00.000）
    const result: LiquidityData[] = [];
    const oneDayMs = 24 * 60 * 60 * 1000; // 一天的毫秒数

    // 用于跟踪最后有效的数据
    let lastValidData: LiquidityData = firstData;

    for (let day = 0; day < days; day++) {
        // 计算当前日期的起始时间戳
        const currentTimestamp = startTimestamp + (day * oneDayMs);
        const currentDateStr = timestampToDateString(currentTimestamp);

        // 检查这一天是否有原始数据
        if (originalDataByDay.has(currentDateStr)) {
            // 有原始数据，直接使用
            const originalData = originalDataByDay.get(currentDateStr)!;
            result.push({ ...originalData });
            lastValidData = originalData;
        } else {
            // 没有原始数据，使用上一条有效数据填充
            // 但我们需要创建一个新的数据对象，只更新时间戳
            const filledData: LiquidityData = {
                dt: currentTimestamp,
                quote_currency: lastValidData.quote_currency,
                volume: lastValidData.volume,
            };
            result.push(filledData);
        }
    }

    return result;
}

/**
 * 将时间戳转换为日期字符串（YYYY-MM-DD格式）
 */
function timestampToDateString(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 将日期字符串转换为时间戳（当天 00:00:00.000）
 */
function dateStringToTimestamp(dateStr: string): number {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day, 0, 0, 0, 0);
    return date.getTime();
}