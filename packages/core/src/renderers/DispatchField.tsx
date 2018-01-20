import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { UnknownRenderer } from './UnknownRenderer';
import { RankedTester } from '../testers';
import { FieldProps } from '../util';

export interface DispatchFieldProps extends FieldProps {
  fields?: { tester: RankedTester, field: any }[];
}

const Dispatch = (dispatchFieldProps: DispatchFieldProps) => {
  const uischema = dispatchFieldProps.uischema;
  const schema = dispatchFieldProps.schema;
  const config = dispatchFieldProps.config;
  const field = _.maxBy(dispatchFieldProps.fields, r => r.tester(uischema, schema));

  if (field === undefined || field.tester(uischema, schema) === -1) {
    return <UnknownRenderer type={'field'}/>;
  } else {
    const Field = field.field;

    return (
      <Field
        schema={schema}
        uischema={uischema}
        config={config}
        path={dispatchFieldProps.path}
      />
    );
  }
};

const mapStateToProps = state => ({
  fields: state.jsonforms.fields || []
});

export const DispatchField = connect(mapStateToProps)(Dispatch);
