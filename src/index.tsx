import ReactDOM from 'react-dom';
import App from './components/App';

import 'normalize.css';

const root = document.querySelector('#root');

if (root != null) {
  ReactDOM.render(<App />, root);
}