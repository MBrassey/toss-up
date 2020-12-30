import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import Loading from '..';

afterEach(cleanup);

describe('Loading component', () => {
  it('renders', () => {
    render(<Loading />);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Loading />);

    expect(asFragment()).toMatchSnapshot();
  });

})