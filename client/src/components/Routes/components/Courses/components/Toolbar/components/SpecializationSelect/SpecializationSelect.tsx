import { Theme, useMediaQuery } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { logEvent } from 'firebase/analytics';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFeatures } from 'src/components/Features';
import { useFirebase } from 'src/components/Firebase';
import { paths } from 'src/constants';
import { Nullable } from 'src/core';
import { Specialization } from 'src/graphql';
interface Props {
  className?: string;
  onChange: (changeTo: Nullable<Specialization>) => void;
  options?: Specialization[];
  value?: Specialization;
}

const SpecializationSelect: React.FC<Props> = ({
  className,
  onChange,
  options,
  value,
}) => {
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const history = useHistory();

  const firebase = useFirebase();

  const { isEnabled } = useFeatures();
  const mayNotUse = !isEnabled('spec');

  const handleFocus: SelectInputProps['onFocus'] = () => {
    if (mayNotUse) {
      history.push(paths.pricing(true));
    }
  };

  const handleChange: SelectInputProps['onChange'] = (event) => {
    const id = event.target.value;
    if (!id) {
      return onChange(null);
    }

    const specialization = options?.find((other) => other.id === id);
    if (!specialization) {
      return onChange(null);
    }

    logEvent(firebase.analytics, 'view_item_list', {
      list_name: specialization.name,
      item_list_name: specialization.name,
      item_list_id: specialization.id,
    });

    onChange(specialization);
  };

  const control = (
    <FormControl variant="filled" className={className}>
      <InputLabel id="specialization-label">Specialization</InputLabel>
      <Select
        margin="dense"
        labelId="specialization-label"
        id="specialization"
        value={value?.id || ''}
        onFocus={handleFocus}
        onChange={handleChange}
      >
        <MenuItem value="">
          <Typography variant="overline">None</Typography>
        </MenuItem>
        {options?.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return mayNotUse ? (
    <Tooltip
      title="This feature requires a Standard subscription"
      placement={xs ? 'top' : 'right'}
    >
      {control}
    </Tooltip>
  ) : (
    control
  );
};

export default SpecializationSelect;
