import './Form.scss';

const Form = (): JSX.Element => {
  return (
    <form className="form">
      <textarea
        className="form__addresses"
        placeholder="Введите адреса книг"
        name="addresses"
      ></textarea>
      <button className="form__submit" type="submit">
        Начать парсинг
      </button>
    </form>
  );
};

export default Form;
