export enum EnumBill { Out=0, In=1 };  // 支出收入
export enum EnumMonth { Jan, Fed, Mar, Apr, May, Jun, Jul, Aug, Seq, Oct, Nov, Dec };

// 账单
export type TypeBill = {
    time: Date,
    type: EnumBill,
    category?: string,
    amount: number
};

// 分类
export type TypeCategory = {
    id: string,
    name: string,
    type: EnumBill
}

// 收支
export type TypeAmountInOut = {
    in: number,
    out: number
}

export const ConstMonthsText = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
