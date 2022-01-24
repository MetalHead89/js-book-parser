import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { START_PARSER } from '../../redux/Parser/Types';
import { RootState } from '../../redux/Store';
import Form from '../Form/Form';
import './Content.scss';

const Content = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isParserStarts, isParserReady } = {
    ...useSelector((state: RootState) => state.ParserReducer),
  };

  useEffect(() => {
    if (!isParserStarts && !isParserReady) {
      dispatch({ type: START_PARSER });
    }
  });

  const content =
    !isParserStarts && isParserReady ? (
      <Form />
    ) : (
      <div> Идет подготовка сервера... </div>
    );

  return <div className="content">{content}</div>;
};

export default Content;
