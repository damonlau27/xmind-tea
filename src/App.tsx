import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import Papa from 'papaparse';
import './App.css';

import {
  EnumMonth,
  TypeBill,
  TypeCategory
} from './types';

const BillAdd = React.lazy(() => import('./components/BillAdd'));
const BillShow = React.lazy(() => import('./components/BillShow'));
const OutCategories = React.lazy(() => import('./components/OutCategories'));


function App() {
  const [dataBill, setDataBill]         = useState<TypeBill[]>([]);            // 账单数据 bill.csv
  const [dataCategory, setDataCategory] = useState<TypeCategory[]>([]);        // 账单分类 categories.csv
  const [monthIndex, setMonthIndex]     = useState<EnumMonth>(EnumMonth.Dec);  // 选择的月份

  const handleMonthIndexChange = ({ key }: any): void => {
    setMonthIndex(key as EnumMonth);
  }

  const handleDataBillChange = (billNew: TypeBill): void => {
    setDataBill(prevBill => {
      prevBill.push(billNew);
      return prevBill;
    });
  };

  useEffect(() => {  // fetch bill.csv && parse to state
    Papa.parse("https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv", {
      download: true,
      complete: (res) => {
        if (res.errors.length === 0) {
          // filed's index
          const indexType     = res.data[0].indexOf('type');
          const indexTime     = res.data[0].indexOf('time');
          const indexCategory = res.data[0].indexOf('category');
          const indexAmount   = res.data[0].indexOf('amount');

          let bill: TypeBill[] = [];
          for (let i = 1; i < res.data.length; i++) {  // res.data[0] for fileds
            bill.push({
              time: new Date(Number(res.data[i][indexTime])),
              type: Number(res.data[i][indexType]),
              category: String(res.data[i][indexCategory]),
              amount: Number(res.data[i][indexAmount])
            });
          }
          setDataBill(bill);
        }
      }
    });
  }, []);

  useEffect(() => {  // fetch categories.csv && parse to state
    Papa.parse("https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/categories.csv", {
      download: true,
      complete: (res) => {
        if (res.errors.length === 0) {
          // filed's index
          const indexId   = res.data[0].indexOf('id');
          const indexType = res.data[0].indexOf('type');
          const indexName = res.data[0].indexOf('name');

          let categories: TypeCategory[] = [];
          for (let i = 1; i < res.data.length; i++) {  // res.data[0] for fileds
            categories.push({
              id: String(res.data[i][indexId]),
              type: Number(res.data[i][indexType]),
              name: String(res.data[i][indexName])
            });
          }
          setDataCategory(categories);
        }
      }
    });
  }, []);

  return (
    <div className="App">
      <React.Suspense fallback={<Spin tip='drinking tea ...' size='large'/>}>
        <BillAdd dataCategory={dataCategory} onClick={handleDataBillChange} />
        <BillShow dataBill={dataBill} dataCategory={dataCategory} monthIndex={monthIndex} onClick={handleMonthIndexChange} />
        <OutCategories dataBill={dataBill} dataCategory={dataCategory} monthIndex={monthIndex} />
      </React.Suspense>
    </div>
  );
}

export default App;
