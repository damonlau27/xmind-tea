import React, { useState, useEffect } from 'react';
import {
    Table,
    Menu, 
    Dropdown,
    Typography,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import {
    EnumBill,
    EnumMonth,
    TypeBill,
    TypeCategory,
    TypeAmountInOut,
    ConstMonthsText
} from '../types';
import '../styles.css';

type TypeProp = {
    dataBill: TypeBill[],
    dataCategory: TypeCategory[],
    monthIndex: EnumMonth,
    onClick: (o: object) => void
}

const { Text } = Typography;

const BillShow: React.FunctionComponent<TypeProp> = (props): JSX.Element => {
    const [amountInOut, setAmountInOut]   = useState<TypeAmountInOut>({in: 0, out: 0});  // 选择月份后收支统计

    let billColumns = [{
        title: '账单时间',
        dataIndex: 'time',
        key: 'time',
        align: 'center' as any,
    }, {
        title: '账单类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center' as any,
    }, {
        title: '账单分类',
        dataIndex: 'category',
        key: 'category',
        align: 'center' as any,
        filters: props.dataCategory.map(v => { return { text: v.name, value: v.name } }),
        onFilter: (value: any, record: any) => record.category.indexOf(value as string) === 0,
    }, {
        title: '账单金额(￥)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center' as any,
    }];

    const checkBillDataForMonth = (): object[] => {
        return props.dataBill.filter(v => Number(dayjs(v.time).month()) === Number(props.monthIndex)).map((v, i) => {
            const c = props.dataCategory.find(vc => vc.id === v.category);
            return {
                key: i,
                time: dayjs(v.time).format(),
                type: v.type === EnumBill.In? "收入" : "支出",
                category: c ? c.name : v.category,
                amount: v.amount.toFixed(2)
            }
        });
    }

    // 月份的下拉菜单选项
    const MonthMenu: React.ReactElement = (
        <Menu onClick={props.onClick} >
            {ConstMonthsText.map((v, i) => (<Menu.Item key={i}>{v}</Menu.Item>))}
        </Menu>
    );

    // 计算收支
    useEffect(() => {
        let amountIO: TypeAmountInOut = {in: 0, out: 0};
        props.dataBill.filter(v => Number(dayjs(v.time).month()) === Number(props.monthIndex)).forEach(v => {
            v.type === EnumBill.In ? amountIO.in += v.amount : amountIO.out += v.amount;
        });
        setAmountInOut(amountIO);
    }, [props.monthIndex, props.dataBill]);

    return (
        <div className="bill-show">
            <div className="monnth-select-in-out">
                <Dropdown overlay={MonthMenu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {ConstMonthsText[props.monthIndex]} <DownOutlined />
                    </a>
                </Dropdown>
                <Text className="in-out">收入总额: <Text code>￥{amountInOut.in.toFixed(2)} </Text></Text>
                <Text className="in-out">支出总额: <Text code>￥{amountInOut.out.toFixed(2)}</Text></Text>
            </div>
            <Table
                pagination={false}
                scroll={{ y: 420 }}
                loading={props.dataCategory.length ? false : true}
                columns={billColumns}
                dataSource={checkBillDataForMonth()}
            />
        </div>
    );
};

export default BillShow;
