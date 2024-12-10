/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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

import type { ControlElement, JsonSchema, UISchemaElement } from '../models';
import { findUISchema } from '../reducers';
import { JsonFormsUISchemaRegistryEntry } from '../store';
import { Resolve } from '../util/util';

export interface CombinatorSubSchemaRenderInfo {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

export type CombinatorKeyword = 'anyOf' | 'oneOf' | 'allOf';

export const COMBINATOR_TYPE_PROPERTY = 'x-jsf-type-property';

export const createCombinatorRenderInfos = (
  combinatorSubSchemas: JsonSchema[],
  rootSchema: JsonSchema,
  keyword: CombinatorKeyword,
  control: ControlElement,
  path: string,
  uischemas: JsonFormsUISchemaRegistryEntry[]
): CombinatorSubSchemaRenderInfo[] =>
  combinatorSubSchemas.map((subSchema, subSchemaIndex) => {
    const resolvedSubSchema =
      subSchema.$ref && Resolve.schema(rootSchema, subSchema.$ref, rootSchema);

    const schema = resolvedSubSchema ?? subSchema;

    return {
      schema,
      uischema: findUISchema(
        uischemas,
        schema,
        control.scope,
        path,
        undefined,
        control,
        rootSchema
      ),
      label:
        subSchema.title ??
        resolvedSubSchema?.title ??
        `${keyword}-${subSchemaIndex}`,
    };
  });

/**
 * Returns the identification property of the given data object.
 * The following heuristics are applied:
 * If the schema defines a `x-jsf-type-property`, it is used as the identification property.
 * Otherwise, the first of the following data properties is used:
 * - `id`
 * - `type`
 * - `kind`
 *
 * If none of the above properties are present, the first string or number property of the data object is used.
 */
export const getCombinatorIdentificationProp = (
  data: any,
  schema: JsonSchema
): string | undefined => {
  // Determine the identification property
  let idProperty: string | undefined;
  if (
    COMBINATOR_TYPE_PROPERTY in schema &&
    typeof schema[COMBINATOR_TYPE_PROPERTY] === 'string'
  ) {
    idProperty = schema[COMBINATOR_TYPE_PROPERTY];
  } else {
    for (const prop of ['id', 'type', 'kind']) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        idProperty = prop;
        break;
      }
    }
  }

  // If no identification property was found, use the first string or number property
  // TODO should this iterate until it finds a property with a const in the schema?
  if (idProperty === undefined) {
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        idProperty = key;
        break;
      }
    }
  }

  return idProperty;
};

/**
 * @returns the index of the fitting schema or `-1` if no fitting schema was found
 */
export const getCombinatorIndexOfFittingSchema = (
  data: any,
  keyword: CombinatorKeyword,
  schema: JsonSchema,
  rootSchema: JsonSchema
): number => {
  let indexOfFittingSchema = -1;
  const idProperty = getCombinatorIdentificationProp(data, schema);
  if (idProperty === undefined) {
    return indexOfFittingSchema;
  }

  for (let i = 0; i < schema[keyword]?.length; i++) {
    let resolvedSchema = schema[keyword][i];
    if (resolvedSchema.$ref) {
      resolvedSchema = Resolve.schema(
        rootSchema,
        resolvedSchema.$ref,
        rootSchema
      );
    }

    // Match the identification property against a constant value in resolvedSchema
    const maybeConstIdValue = resolvedSchema.properties?.[idProperty]?.const;

    if (
      idProperty !== undefined &&
      maybeConstIdValue !== undefined &&
      data[idProperty] === maybeConstIdValue
    ) {
      indexOfFittingSchema = i;
      console.debug(
        `Data matches the resolved schema for property ${idProperty}`
      );
      break;
    }
  }

  return indexOfFittingSchema;
};
