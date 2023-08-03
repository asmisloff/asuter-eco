import { Provider } from 'react-redux';
import React from 'react';
import Root from './economic/component/Root';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
