import { JSX } from '../../src/renderers/JSX';
import test from 'ava';
import { initJsonFormsStore } from '../helpers/setup';
import { HorizontalLayout, UISchemaElement } from '../../src/models/uischema';
import { JsonForms } from '../../src/core';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester
} from '../../src/renderers/layouts/horizontal.layout';
import { findRenderedDOMElementWithClass, renderIntoDocument } from '../helpers/binding';
import { Provider } from '../../src/common/binding';

test.before(() => {
  JsonForms.stylingRegistry.registerMany([
    {
      name: 'horizontal-layout',
      classNames: ['horizontal-layout']
    }
  ]);
});
test.beforeEach(t => {
  t.context.uischema = {
    type: 'HorizontalLayout',
    elements: [{type: 'Control'}]
  };
});

test('tester', t => {
  t.is(horizontalLayoutTester(undefined, undefined), -1);
  t.is(horizontalLayoutTester(null, undefined), -1);
  t.is(horizontalLayoutTester({ type: 'Foo' }, undefined), -1);
  t.is(horizontalLayoutTester({ type: 'HorizontalLayout' }, undefined), 1);
});

test('render with undefined elements', t => {
  const uischema: UISchemaElement = {
    type: 'HorizontalLayout'
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );

  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with null elements', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: null
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 0);
});

test('render with children', t => {
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      { type: 'Control' },
      { type: 'Control' }
    ]
  };
  const store = initJsonFormsStore({}, {}, uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={uischema} />
    </Provider>
  );
  const horizontalLayout = findRenderedDOMElementWithClass(tree, 'horizontal-layout');
  t.not(horizontalLayout, undefined);
  t.is(horizontalLayout.children.length, 2);
});

test('hide', t => {
  const store = initJsonFormsStore({}, {}, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={t.context.uischema}
                                visible={false}
      />
    </Provider>
  );
  const horizontalLayout = findRenderedDOMElementWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.true(horizontalLayout.hidden);
});

test('show by default', t => {
  const store = initJsonFormsStore({}, {}, t.context.uischema);
  const tree = renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer uischema={t.context.uischema}/>
    </Provider>
  );
  const horizontalLayout = findRenderedDOMElementWithClass(
    tree, 'horizontal-layout'
  ) as HTMLDivElement;
  t.false(horizontalLayout.hidden);
});
