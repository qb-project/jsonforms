/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the 'Software'), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import React, { useEffect, useState } from 'react';
import { JsonForms, JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { ExampleDescription } from '@jsonforms/examples';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema
} from '@jsonforms/core';
import { resolveRefs } from 'json-refs';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Highlight from 'react-highlight';
import 'highlight.js/styles/default.css';
import './App.css';

type AppProps = {
  examples: ExampleDescription[],
  cells: JsonFormsCellRendererRegistryEntry[],
  renderers: JsonFormsRendererRegistryEntry[],
};

type Action = {
  label: string,
  apply: any
};

const ResolvedJsonForms = (
  props: JsonFormsInitStateProps & JsonFormsReactProps
) => {
  const [init, setInit] = useState(false);
  const [schema, setSchema] = useState<JsonSchema>();
  useEffect(() => {
    if (!props.schema) {
      setInit(true);
      setSchema(props.schema);
    } else {
      resolveRefs(props.schema).then((result) => {
        setInit(true);
        setSchema(result.resolved);
      });
    }
  }, [props.schema]);
  if (!init) {
    return null;
  }
  return <JsonForms {...props} schema={schema} />;
};

const getProps = (example: ExampleDescription, cells?: any, renderers?: any) => {
  const schema = example.schema;
  const uischema = example.uischema;
  const data = example.data;
  const uischemas = example.uischemas;
  const config = example.config;
  return {
    schema,
    uischema,
    data,
    config,
    uischemas,
    cells,
    renderers
  }
}

const App = ({ examples, cells, renderers}: AppProps) => {
  const [currentExample, setExample] = useState<ExampleDescription>(examples[0]);
  const [currentIndex, setIndex] = useState<number>(0);
  const [dataAsString, setDataAsString] = useState<any>('');
  const [schemaAsString, setSchemaAsString] = useState<any>('');
  const [uiSchemaAsString, setUiSchemaAsString] = useState<any>('');
  const [props, setProps] = useState<any>(getProps(currentExample, cells, renderers)); // helper function
  const [showPanel, setShowPanel] = useState<boolean>(true);

  const actions: Action[] = currentExample.actions;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const exampleIndex = examples.findIndex(example => {
      return example.name === hash
    });
    if(exampleIndex !== -1) {
      setIndex(exampleIndex);
    }
  }, []);

  const changeExample = (exampleID: number) => {
    let example = examples[exampleID];
    setIndex(exampleID);
    setExample(example);
    setProps(getProps(example, cells, renderers));
    window.location.hash = example.name;
    if(example.name == 'huge') {
      setShowPanel(false);
    }
  };

  useEffect(() => {
    if(props.schema != undefined) {
      setSchemaAsString(JSON.stringify(props.schema, null, 2));
    } else {
      setSchemaAsString('No schema set');
    }
    if(props.uischema != undefined) {
      setUiSchemaAsString(JSON.stringify(props.uischema, null, 2));
    } else {
      setUiSchemaAsString('No ui schema set');
    }
  }, [props]);

  useEffect(() => {
    var panel = document.getElementsByClassName("current")[0];
    if(showPanel) {
      panel.classList.remove('hide');
    } else {
      panel.classList.add('hide');
    }
  }, [showPanel]);

  const changeData = (data: any) => {
    setDataAsString(JSON.stringify(data, null, 2));
  };

  const togglePanelHeight = () => {
    var panel = document.getElementsByClassName("panel-wrapper")[0];
    panel.classList.toggle('full-height');
  }

  const togglePanel = (checked: boolean) => {
    setShowPanel(checked);
  }

  return (
    <div>
      <div className='App'>
        <header className='App-header'>
          <img src='assets/logo.svg' className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to JSON Forms with React</h1>
          <p className='App-intro'>More Forms. Less Code.</p>
        </header>
        <div className='content'>
          <div className='example-selector'>
            <h4>Select Example:</h4>
            <select
              value={currentIndex}
              onChange={ev => changeExample(Number(ev.currentTarget.value))}
            >
              {examples.map((optionValue: ExampleDescription, index: number) => (
                <option
                  value={index}
                  label={optionValue.label}
                  key={index}
                >
                  {optionValue.label}
                </option>
              ))}
            </select>
          </div>
          <div className='toggle-panel'>
            <input type="checkbox" id="panel" name="panel" checked={showPanel} onChange={e => togglePanel(e.target.checked)} />
            <label htmlFor="panel">Show sidepanel</label>
          </div>

          <div className='demo-wrapper'>
            <div className='current'>
              <Tabs>
                <TabList>
                  <Tab>Data</Tab>
                  <Tab>Schema</Tab>
                  <Tab>UISchema</Tab>
                </TabList>
                <p className='expand-hint' onClick={() => togglePanelHeight()}>Click here to expand</p>
                <div className="panel-wrapper">
                  <TabPanel>
                    <Highlight className='json'>
                      {dataAsString}
                    </Highlight>
                  </TabPanel>
                  <TabPanel>
                    <Highlight className='json'>
                      {schemaAsString}
                    </Highlight>
                  </TabPanel>
                  <TabPanel>
                    <Highlight className='json'>
                      {uiSchemaAsString}
                    </Highlight>
                  </TabPanel>
                </div>
              </Tabs>
            </div>
            <div className='demoform'>
              <div className="buttons">
                {actions?.map((action: Action, index: number) => (
                  <button className="action-button" onClick={ () => setProps((oldProps: JsonFormsInitStateProps) => action.apply(oldProps))} key={index}>{action.label}</button>
                ))}
              </div>
              <div className='demo'>
                <h4><span>Example</span></h4>
                <ResolvedJsonForms
                  key={currentIndex}
                  {...props}
                  onChange={({ data }) => changeData(data)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
