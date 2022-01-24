import Preloader from '../Preloader/Preloader';
import './ModalWindow.scss';

const ModalWindow = (): JSX.Element => (
  <div className="modalWindow">
    <Preloader color="black" />
  </div>
);

export default ModalWindow;
