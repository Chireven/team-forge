import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <App />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getAllByText } = render(
      <App />
    );
    expect(
      getAllByText(new RegExp('Welcome shell', 'gi')).length > 0,
    ).toBeTruthy();
  });
});
