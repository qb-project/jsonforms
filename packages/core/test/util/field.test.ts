/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import test from 'ava';
import * as _ from 'lodash';
import {
  defaultMapDispatchToControlProps,
  defaultMapStateToEnumFieldProps,
  mapStateToFieldProps
} from '../../src/util';
import { UPDATE_DATA, UpdateAction } from '../../src/actions';
import configureStore from 'redux-mock-store';

const middlewares = [];
const mockStore = configureStore(middlewares);

const hideRule = {
  effect: 'HIDE',
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const disableRule = {
  effect: 'DISABLE',
  condition: {
    type: 'LEAF',
    scope: '#/properties/firstName',
    expectedValue: 'Homer'
  }
};

const coreUISchema = {
  type: 'Control',
  scope: '#/properties/firstName',
};

const createState = uischema => ({
  jsonforms: {
    core: {
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          nationality: {
            type: 'string',
            enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
          }
        }
      },
      data: {
        firstName: 'Homer'
      },
      uischema,
      errors: []
    }
  }
});

test('mapStateToFieldProps - visible via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: true,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.true(props.visible);
});

test('mapStateToFieldProps - hidden via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    visible: false,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToFieldProps - hidden via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.visible);
});

test('mapStateToFieldProps - visible via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: hideRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToFieldProps(clonedState, ownProps);
  t.true(props.visible);
});

test('mapStateToFieldProps - enabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: true,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.true(props.enabled);
});

test('mapStateToFieldProps - disabled via ownProps ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    enabled: false,
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToFieldProps - disabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const props = mapStateToFieldProps(createState(uischema), ownProps);
  t.false(props.enabled);
});

test('mapStateToFieldProps - enabled via state ', t => {
  const uischema = {
    ...coreUISchema,
    rule: disableRule
  };
  const ownProps = {
    uischema
  };
  const clonedState = _.cloneDeep(createState(uischema));
  clonedState.jsonforms.core.data.firstName = 'Lisa';
  const props = mapStateToFieldProps(clonedState, ownProps);
  t.true(props.enabled);
});

test('mapStateToFieldProps - path', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'firstName');
});

test('mapStateToFieldProps - compose path with ownProps.path', t => {
  const ownProps = {
    uischema: coreUISchema,
    path: 'yo'
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.path, 'yo.firstName');
});

test('mapStateToFieldProps - data', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.data, 'Homer');
});

test('mapStateToFieldProps - id', t => {
  const ownProps = {
    uischema: coreUISchema
  };
  const props = mapStateToFieldProps(createState(coreUISchema), ownProps);
  t.is(props.id, '#/properties/firstName');
});

test('mapStateToEnumFieldProps - set default options for dropdown list', t => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const ownProps = {
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        }
      }
    },
    uischema: uiSchema
  };

  const props = defaultMapStateToEnumFieldProps(createState(uiSchema), ownProps);
  t.deepEqual(props.options, ['DE', 'IT', 'JP', 'US', 'RU', 'Other']);
  t.is(props.data, undefined);
});

test('mapStateToEnumFieldProps - set data of enum field', t => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const ownProps = {
    data: {
      nationality: 'JP'
    },
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other']
        }
      }
    },
    uischema: uiSchema
  };

  const props = defaultMapStateToEnumFieldProps(createState(uiSchema), ownProps);
  t.is(props.data.nationality, 'JP');
});

test('defaultMapDispatchToControlProps, initialized with custom handleChange', t => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const ownProps = {
    handleChange: () => {
      return 'Custom handleChange';
    }
  };
  const store = mockStore(createState(uiSchema));
  const props = defaultMapDispatchToControlProps(store.dispatch, ownProps);
  t.is(props.handleChange(), 'Custom handleChange');
});

test('defaultMapDispatchToControlProps, with default handleChange', t => {
  const uiSchema = {
    type: 'Control',
    scope: '#/properties/nationality',
  };
  const store = mockStore(createState(uiSchema));
  const props = defaultMapDispatchToControlProps(store.dispatch, {});
  props.handleChange('nationality', 'DE');
  const updateAction = _.head<any>(store.getActions()) as UpdateAction;
  t.is(updateAction.type, UPDATE_DATA);
  t.is(updateAction.path, 'nationality');
  t.is(updateAction.updater(), 'DE');
});
