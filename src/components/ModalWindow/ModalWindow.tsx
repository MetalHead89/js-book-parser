import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import Preloader from '../Preloader/Preloader';
import './ModalWindow.scss';

const ModalWindow = (): JSX.Element => {
  const text = useSelector((state: RootState) => state.ModalWindowReducer.text);

  return (
    <div className="modalWindow">
      <Preloader color="black" />
      <div className="modalWindow__text">{text}</div>
    </div>
  );
};

export default ModalWindow;
