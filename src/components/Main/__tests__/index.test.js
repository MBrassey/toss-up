import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Main from '..';

afterEach(cleanup);

describe('Main component', () => {
  it('renders', () => {
    render(<Main />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Main />);

    expect(asFragment()).toMatchSnapshot();
  });

})