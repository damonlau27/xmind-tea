import React from 'react';
import { RenderResult, render, act, screen } from '@testing-library/react';

import BillAdd from './BillAdd';

describe('<BillAdd />', () => {
    let renderResult: RenderResult;

    beforeEach(() => {
        act(() => {
            renderResult = render(<BillAdd dataCategory={[]} onClick={() => {}} />);
        });
    });

    test('there should be a date picker', () => {
        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });
    test('there should be a catory selector', () => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('there should be an amount input with default value of ￥0.00', () => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        expect(screen.getByRole('spinbutton')).toHaveValue('￥0.00');
    });

    test('there should be a button to add bill', () => {
        expect(screen.getByText('添加账单')).toBeInTheDocument();
    });

    test('should match snapshot', () => {
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

