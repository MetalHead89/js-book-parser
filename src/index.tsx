import ReactDOM from 'react-dom';
import App from './components/App';

import 'normalize.css';
import { Provider } from 'react-redux';
import store from './redux/Store';

const root = document.querySelector('#root');

if (root != null) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    root
  );
}
