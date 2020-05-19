import React from 'react';
import { RenderResult, render, act, screen } from '@testing-library/react';
import '../matchMedia.tsx';

import { EnumBill, EnumMonth, TypeBill, TypeCategory } from '../types';
import BillShow from './BillShow';

describe('<BillShow />', () => {
    const fakeDataCategory: TypeCategory[] = [{
        id: 'cid_1111',
        name: 'cname_1111',
        type: EnumBill.In,
    }, {
        id: 'cid_2222',
        name: 'cname_2222',
        type: EnumBill.Out,
    }, {
        id: 'cid_3333',
        name: 'cname_3333',
        type: EnumBill.Out,
    }];
    const fakeDataBill: TypeBill[] = [{
        time: new Date('2048-12-12 11:10:20'),
        type: EnumBill.In,  // 收入，将不计算
        category: 'cid_1111',
        amount: -10,
    }, {
        time: new Date('2048-12-12 11:10:20'),
        type: EnumBill.Out,
        category: 'cid_2222',
        amount: 10,
    }, {
        time: new Date('2048-12-12 12:10:20'),
        type: EnumBill.Out,
        category: 'cid_2222',
        amount: 20,
    }, {
        time: new Date('2048-12-12 13:10:20'),
        type: EnumBill.Out,
        category: 'cid_3333',
        amount: 60,
    }, {
        time: new Date('2048-12-12 14:10:20'),
        type: EnumBill.Out,
        category: 'cid_3333',
        amount: 40,
    }];

    test('January no data', () => {
        // 根据 fakeDataBill ，事实只有 12 月有数据显示
        act(() => {
            render(<BillShow dataBill={fakeDataBill} dataCategory={fakeDataCategory} monthIndex={EnumMonth.Jan} onClick={() => {}} />);  // 1月
        });
        expect(screen.queryByText('cname_1111')).toBeNull();
        expect(screen.queryByText('cname_2222')).toBeNull();
        expect(screen.queryByText('cname_3333')).toBeNull();
    });

    test('December should have data', () => {
        // 根据 fakeDataBill ，事实只有 12 月有数据显示
        act(() => {
            render(<BillShow dataBill={fakeDataBill} dataCategory={fakeDataCategory} monthIndex={EnumMonth.Dec} onClick={() => {}} />);  // 12 月
        });
        expect(screen.queryAllByText('cname_1111').length).toBeGreaterThan(0);
        expect(screen.queryAllByText('cname_2222').length).toBeGreaterThan(0);
        expect(screen.queryAllByText('cname_3333').length).toBeGreaterThan(0);
    });

    test('income and outgo calculate correctly', () => {
        act(() => {
            render(<BillShow dataBill={fakeDataBill} dataCategory={fakeDataCategory} monthIndex={EnumMonth.Dec} onClick={() => {}} />);
        });
        expect(screen.queryByText('￥-10.00')).not.toBeNull();  // 支出统计
        expect(screen.queryByText('￥130.00')).not.toBeNull();  // 收入统计
    });

    test('should match snapshot', () => {
        let renderResult: any = null;
        act(() => {
            renderResult = render(<BillShow dataBill={fakeDataBill} dataCategory={fakeDataCategory} monthIndex={EnumMonth.Dec} onClick={() => {}} />);
        });
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
