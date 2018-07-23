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
import { registerExamples } from './register';
import {
  data as day3Data,
  schema as day3Schema,
  uischema as day3UiSchema,
} from './day3';

export const schema = {
  type: 'object',
  properties: {
    ...day3Schema.properties,
    recurrence: {
        type: 'string',
        enum: ['Never', 'Daily', 'Weekly', 'Monthly']
    },
    recurrenceInterval: {
        type: 'integer'
    }
  },
  required: ['name']
};

export const uischema = {
  type: 'VerticalLayout',
  elements: [
    ...day3UiSchema.elements,
    {
      type: 'Control',
      scope: '#/properties/recurrence'
    },
    {
      type: 'Control',
      scope: '#/properties/recurrenceInterval',
      rule: {
          effect: 'HIDE',
          condition: {
              scope: '#/properties/recurrence',
              expectedValue: 'Never'
          }
      }
    }
  ]
};

export const data = {
  ...day3Data,
  recurrence: 'Daily',
  recurrenceInterval: 5
};

registerExamples([
  {
    name: 'day4',
    label: 'Day 4',
    data,
    schema,
    uischema
  }
]);
