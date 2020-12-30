import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import App from '../App';

afterEach(cleanup);

describe('App component', () => {
  it('renders', () => {
    render(<App />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
  });

})