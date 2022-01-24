import './Preloader.scss';

const Preloader = ({ color }: { color: 'black' | 'white' }): JSX.Element => (
  <img
    className="preloader"
    src={`/images/${color}-preloader.svg`}
    alt="preloader"
  />
);

export default Preloader;
