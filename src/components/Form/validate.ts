import ParsingFormData from './Types';

const validate = (values: ParsingFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (values.addresses === undefined || values.addresses.trim() === '') {
    errors.addresses = 'Это поле обязательно к заполнению';
  }

  return errors;
};

export default validate;
