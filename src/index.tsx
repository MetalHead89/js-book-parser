import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const root = document.querySelector('#root');

if (root != null) {
  ReactDOM.render(<App />, root);
}
