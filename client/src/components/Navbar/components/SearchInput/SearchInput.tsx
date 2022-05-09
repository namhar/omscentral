import InputBase, { InputBaseProps } from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FeaturesContext } from 'src/components/Features';
import { paths } from 'src/constants';

import { useStyles } from './SearchInput.styles';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  const classes = useStyles();
  const history = useHistory();

  const { isEnabled } = useContext(FeaturesContext);
  const mayNotUse = !isEnabled('search');

  const handleFocus: InputBaseProps['onFocus'] = () => {
    if (mayNotUse) {
      history.push(paths.pricing(true));
    }
  };

  const handleChange: InputBaseProps['onChange'] = (event) => {
    onChange(event.target.value);
  };

  const handleKeyDown: InputBaseProps['onKeyDown'] = (event) => {
    if (event.key === 'Enter') {
      onSubmit(value);
    }
  };

  const control = (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{ root: classes.inputRoot, input: classes.inputInput }}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );

  return mayNotUse ? (
    <Tooltip
      title="This feature requires a Standard subscription"
      placement="right"
    >
      {control}
    </Tooltip>
  ) : (
    control
  );
};

export default SearchInput;
