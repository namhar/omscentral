import { Theme, useMediaQuery } from '@material-ui/core';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFeatures } from 'src/components/Features';
import { paths } from 'src/constants';
interface Props {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

const KeywordFilter: React.VFC<Props> = ({ className, value, onChange }) => {
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const history = useHistory();

  const { isEnabled } = useFeatures();
  const mayNotUse = !isEnabled('filtering');

  const handleFocus: TextFieldProps['onFocus'] = () => {
    if (mayNotUse) {
      history.push(paths.pricing(true));
    }
  };

  const handleChange: TextFieldProps['onChange'] = (event) => {
    onChange(event.target.value);
  };

  const control = (
    <TextField
      className={className}
      id="filter"
      name="filter"
      label="Filter Courses"
      placeholder="e.g. ML4T, 6501, Network..."
      size="small"
      autoComplete="filter"
      variant="filled"
      value={value}
      onFocus={handleFocus}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );

  return mayNotUse ? (
    <Tooltip
      title="This feature requires a Basic subscription"
      placement={xs ? 'top' : 'left'}
    >
      {control}
    </Tooltip>
  ) : (
    control
  );
};

export default KeywordFilter;
