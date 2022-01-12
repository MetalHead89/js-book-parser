import { useField, useForm } from 'react-final-form-hooks';
import './Form.scss';
import ParsingFormData from './Types';
import validate from './validate';

const Form = (): JSX.Element => {
  const handleFormSubmit = (values: ParsingFormData) => {
    console.log(values);
    //не забываем про TRIM
  };

  const { form, handleSubmit } = useForm({
    onSubmit: handleFormSubmit,
    validate,
  });

  const addresses = useField('addresses', form);

  return (
    <form onSubmit={handleSubmit} className="form">
      <textarea
        {...addresses.input}
        className="form__addresses"
        placeholder="Введите адреса книг"
      ></textarea>
      {addresses.meta.touched && addresses.meta.error && (
        <span className="form__error">{addresses.meta.error}</span>
      )}

      <button className="form__submit" type="submit">
        Начать парсинг
      </button>
    </form>
  );
};

export default Form;
