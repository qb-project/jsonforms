import * as React from 'react';
import {
  FieldProps,
  handleChange,
  isIntegerControl,
  mapStateToInputProps,
  RankedTester,
  rankWith,
  registerStartupInput
} from 'jsonforms-core';
import { connect } from 'react-redux';

import Input from 'material-ui/Input';

export const MaterialIntegerField = (props: FieldProps) => {
  const { data, className, id, enabled, uischema } = props;

  return <Input type='number'
    value={data || ''}
    onChange={ev => handleChange(props, parseInt(ev.target.value, 10))}
    className={className}
    id={id}
    disabled={!enabled}
    autoFocus={uischema.options && uischema.options.focus}
    fullWidth
  />;
};
export const integerFieldTester: RankedTester = rankWith(2, isIntegerControl);
export default registerStartupInput(
    integerFieldTester,
    connect(mapStateToInputProps)(MaterialIntegerField)
);
