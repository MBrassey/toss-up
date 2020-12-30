import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Navbar from '..';

afterEach(cleanup);

describe('Navbar component', () => {
  it('renders', () => {
    render(<Navbar />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Navbar />);

    expect(asFragment()).toMatchSnapshot();
  });

})