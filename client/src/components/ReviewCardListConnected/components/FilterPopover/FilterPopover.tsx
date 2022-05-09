import Popover, { PopoverProps } from '@material-ui/core/Popover';
import React, { useState } from 'react';
import { Nullable } from 'src/core';

import ToolbarButton from '../ToolbarButton/ToolbarButton';

interface Props {
  id: string;
  name: string;
  total: number;
  selected: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
  children: React.ReactNode;
}

const FilterPopover: React.FC<Props> = ({
  id,
  name,
  total,
  selected,
  open,
  onOpen,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  transformOrigin = { vertical: 'top', horizontal: 'right' },
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState<Nullable<Element>>(null);

  const handleOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
    onOpen();
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  const caption = [
    name,
    selected === 0 || selected === total ? 'All' : selected,
  ].join(': ');

  return (
    <>
      <ToolbarButton
        id={id}
        caption={caption}
        open={open}
        onClick={handleOpen}
      />
      <Popover
        keepMounted
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Popover>
    </>
  );
};

export default FilterPopover;
