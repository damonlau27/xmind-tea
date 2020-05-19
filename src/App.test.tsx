import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import './matchMedia';

test('App match snapshot', () => {
  expect(render(<App />).asFragment()).toMatchSnapshot();
});
