import Button from '@material-ui/core/Button';
import React from 'react';
import { useHistory } from 'react-router';

interface Props {
  path?: string;
  onClick?: () => void | Promise<void> | any;
  'data-cy'?: string;
}

const NavbarButton: React.FC<Props> = ({
  children,
  path,
  onClick,
  ...rest
}) => {
  const history = useHistory();

  const handleClick = async () => {
    onClick && (await onClick());
    path && history.push(path);
  };

  return (
    <Button color="inherit" onClick={handleClick} disableRipple {...rest}>
      {children}
    </Button>
  );
};

export default NavbarButton;
