import React, { useState } from 'react';
import {
    Button,
    Select,
    DatePicker,
    InputNumber,
    message
} from 'antd';

import {
    TypeBill,
    TypeCategory,
} from '../types';
import '../styles.css';

type TypeProp = {
    dataCategory: TypeCategory[],
    onClick: (billNew: TypeBill) => void
};

const BillAdd: React.FunctionComponent<TypeProp> = (props): JSX.Element => {
    const [billTime, setBillDate]         = useState<Date>(new Date(0));  // 日期
    const [billCategory, setBillCategory] = useState<string>('');         // 类型
    const [billAmount, setBillAmount]     = useState<number>(0);          // 金额

    const handleDateChange = (value: any, dateString: string) => {
        setBillDate(new Date(dateString));
    }
    const handleCategoryChange = (categoryID: string) => {
        setBillCategory(categoryID);
    }
    const handleAmountChange = (amount: any) => {
        setBillAmount(amount as number);
    }
    const handleBillAdd = () => {
        if (billTime.getTime() === (new Date(0).getTime())) {
            message.warn('time must be selected ~');
            return;
        }
        if (billCategory === '') {
            message.warn('category must be selected ~');
            return;
        }
        if (billAmount === 0) {
            message.warn('amount cant be ￥0.00 ~');
            return;
        }

        const c = props.dataCategory.find(v => v.id === billCategory);  // 为了该 category 是什么 type
        c && props.onClick({
            time: billTime,
            type: c.type,
            category: billCategory,
            amount: billAmount
        });
        message.success('success ~');
    }

    return (
        <div className="bill-add">
            <DatePicker className="bill-add-part" showTime onChange={handleDateChange} />
            <Select className="bill-add-part" placeholder='Select category' onChange={handleCategoryChange}>
                {props.dataCategory.map((v, i) => {
                    return <Select.Option key={i} value={v.id}>{v.name}</Select.Option>
                })}
            </Select>
            <InputNumber
                className="bill-add-part"
                precision={2}
                defaultValue={0}
                formatter={value => `￥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? value.replace(/￥\s?|(,*)/g, '') : 0}
                onChange={handleAmountChange}
            />
            <Button className="bill-add-part" type='primary' onClick={handleBillAdd}>添加账单</Button>
        </div>
    );
};

export default BillAdd;
