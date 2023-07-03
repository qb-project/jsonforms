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
import React, { useEffect, useState } from 'react';
import type { Categorization, Category, LayoutProps } from '@jsonforms/core';
import {
  TranslateProps,
  withJsonFormsLayoutProps,
  withTranslateProps,
} from '@jsonforms/react';
import { CategorizationList } from './CategorizationList';
import { SingleCategory } from './SingleCategory';
import { isCategorization } from './tester';
import { withVanillaControlProps } from '../../util';
import type { VanillaRendererProps } from '../../index';

export interface CategorizationState {
  selectedCategory: Category;
}

export const CategorizationRenderer = ({
  uischema,
  schema,
  path,
  t,
  visible,
  getStyleAsClassName,
}: LayoutProps & VanillaRendererProps & TranslateProps) => {
  const findCategory = (categorization: Categorization): Category => {
    const category = categorization.elements[0];

    if (isCategorization(category)) {
      return findCategory(category);
    }

    return category;
  };

  const categorization = uischema as Categorization;
  const classNames = getStyleAsClassName('categorization');
  const masterClassNames = getStyleAsClassName('categorization.master');
  const detailClassNames = getStyleAsClassName('categorization.detail');
  const subcategoriesClassName = getStyleAsClassName('category.subcategories');
  const groupClassName = getStyleAsClassName('category.group');

  useEffect(() => {
    setSelectedCategory(findCategory(categorization));
  }, [uischema, schema]);

  const [selectedCategory, setSelectedCategory] = useState(
    findCategory(categorization)
  );

  const onCategorySelected = (category: Category) => () => {
    return setSelectedCategory(category);
  };

  return (
    <div
      className={classNames}
      hidden={visible === null || visible === undefined ? false : !visible}
    >
      <div className={masterClassNames}>
        <CategorizationList
          categorization={categorization}
          selectedCategory={selectedCategory}
          depth={0}
          onSelect={onCategorySelected}
          subcategoriesClassName={subcategoriesClassName}
          groupClassName={groupClassName}
          t={t}
        />
      </div>
      <div className={detailClassNames}>
        <SingleCategory
          category={selectedCategory}
          schema={schema}
          path={path}
        />
      </div>
    </div>
  );
};

export default withVanillaControlProps(
  withTranslateProps(withJsonFormsLayoutProps(CategorizationRenderer))
);
