import * as React from 'react';
import {
  FieldProps,
  isDateTimeControl,
  mapStateToFieldProps,
  mapDispatchToFieldProps,
  RankedTester,
  rankWith,
  registerStartupField
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { DateTimePicker } from 'material-ui-pickers';
import * as moment from 'moment'
import 'moment/locale/de';
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
 
moment.locale('de');

export const MaterialDateTimeField = (props: FieldProps) => {
  const { data, id, enabled, uischema, path, handleChange } = props;

  // TODO: move this to internationalization file
  const german = {
      format: 'DD.MM.YYYY HH:mm',
      cancelLabel: 'ABBRECHEN',
      clearLabel: 'LÖSCHEN'
  };

  let inputProps = {};

  return (
      <DateTimePicker
          value={data || null}
          onChange={ datetime => 
            handleChange(path, datetime ? moment(datetime).format() : '')
          }
          id={id}
          format={german.format}
          ampm={false}
          cancelLabel={german.cancelLabel}
          clearLabel={german.clearLabel}
          clearable={true}
          disabled={!enabled}
          autoFocus={uischema.options && uischema.options.focus}
          fullWidth={true}
          leftArrowIcon={<KeyboardArrowLeftIcon />}
          rightArrowIcon={<KeyboardArrowRightIcon />}
          dateRangeIcon={<DateRangeIcon />}
          timeIcon={<AccessTimeIcon />}
          onClear={() =>
              handleChange(path, '')
          }
          InputProps={inputProps}
      />
  );
};
export const datetimeFieldTester: RankedTester = rankWith(2, isDateTimeControl);
export default registerStartupField(
  datetimeFieldTester,
  connect(mapStateToFieldProps, mapDispatchToFieldProps)(MaterialDateTimeField)
);