import { Link } from 'react-router';
import PortfolioIcon from './PortfolioIcon';

const Header = () => {
  return (
    <div className='top-nav'>
      <Link to='/'>Home</Link>
      <Link to='/about'>About</Link>
      <PortfolioIcon />
    </div>
  );
};

export default Header;