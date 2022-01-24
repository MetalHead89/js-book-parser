import { useField, useForm } from 'react-final-form-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_BOOKS } from '../../redux/Parser/Types';
import { RootState } from '../../redux/Store';
import ModalWindow from '../ModalWindow/ModalWindow';
import './Form.scss';
import ParsingFormData from './Types';
import validate from './validate';

const Form = (): JSX.Element => {
  const dispatch = useDispatch();

  const isButtonDisabled = useSelector(
    (state: RootState) => state.ParserReducer.isButtonDisabled
  );

  const isModalWindowEnabled = useSelector(
    (state: RootState) => state.ModalWindowReducer.isEnabled
  );

  const handleFormSubmit = (values: ParsingFormData) => {
    dispatch({ type: SAVE_BOOKS, payload: values.addresses });
  };

  const { form, handleSubmit } = useForm({
    onSubmit: handleFormSubmit,
    validate,
  });

  const addresses = useField('addresses', form);

  return (
    <>
    <form onSubmit={handleSubmit} className="form">
      <textarea
        {...addresses.input}
        className="form__addresses"
        placeholder="Введите адреса книг"
      ></textarea>
      {addresses.meta.touched && addresses.meta.error && (
        <span className="form__error">{addresses.meta.error}</span>
      )}

      <button
        type="submit"
        disabled={isButtonDisabled}
        className="form__submit"
      >
        Скачать книги
      </button>
    </form>
    {isModalWindowEnabled ? <ModalWindow /> : null}
    </>
  );
};

export default Form;
