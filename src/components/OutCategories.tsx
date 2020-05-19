import React from 'react';
import { Table, Divider } from 'antd';
import dayjs from 'dayjs';

import {
    EnumBill,
    EnumMonth,
    TypeBill,
    TypeCategory,
    ConstMonthsText
} from '../types';

type TypeProp = {
    dataBill: TypeBill[],
    dataCategory: TypeCategory[],
    monthIndex: EnumMonth,
}

const OutCategories: React.FunctionComponent<TypeProp> = (props): JSX.Element => {
    const outCategoryColumns = [{
        title: '账单类型',
        dataIndex: 'category',
        key: 'category',
        align: 'center' as any,
    }, {
        title: '支出金额统计(￥)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center' as any,
        sorter: (a: any, b: any) => a.amount - b.amount,
        defaultSortOrder: 'descend' as any
    }];

    const checkOutCategoryData = (): Array<object> => {  // 分类统计支出
        let mapCategoryAmount = new Map<string, number>();
        const dataBillForMonth = props.dataBill.filter(v => Number(dayjs(v.time).month()) === Number(props.monthIndex));  // 选择月份后的账单数据

        // => Map
        dataBillForMonth.forEach(v => {
            if (v.type === EnumBill.Out && v.category) {  // v.type === EnumBill.Out: 只统计支出的
                let prevAmount = mapCategoryAmount.get(v.category);
                prevAmount ? mapCategoryAmount.set(v.category, prevAmount + v.amount) : mapCategoryAmount.set(v.category, v.amount);
            }
        });

        // Map => Array
        let arrayCategoryAmount: Array<object> = [];
        mapCategoryAmount.forEach((v, k) => {
            const c = props.dataCategory.find(vc => vc.id === k);  // 为了分类(category)的名称(name)
            c && arrayCategoryAmount.push({
                key: c.id,
                category: c.name,
                amount: v
            });
        });
        return arrayCategoryAmount
    }

    return (
        <div>
            <Divider style={{ padding: "0 80px" }}>{ConstMonthsText[props.monthIndex]}账单分类统计</Divider>
            <Table
                pagination={false}
                scroll={{ y: 340 }}
                columns={outCategoryColumns}
                dataSource={checkOutCategoryData()}
            />
        </div>
    );
};

export default OutCategories;
