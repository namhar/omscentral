import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import React from 'react';

interface Props {
  className?: string;
  label: React.ReactElement | string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<Props> = ({ className, label, value, onChange }) => (
  <FormGroup className={className}>
    <FormControlLabel
      label={label}
      control={<Switch checked={value} onChange={() => onChange(!value)} />}
    />
  </FormGroup>
);

export default Toggle;
