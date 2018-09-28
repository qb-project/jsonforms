import * as React from 'react';
import {
    ControlProps,
    findUISchema,
    isObjectControl,
    JsonSchema,
    mapStateToControlProps,
    RankedTester,
    rankWith,
} from '@jsonforms/core';
import { connectToJsonForms, JsonForms } from '@jsonforms/react';

interface MaterialObjectRendererProps extends ControlProps {
    findUiSchema(
        schema: JsonSchema,
        schemaPath: string,
        instancePath: string,
        fallbackLayoutType: string
    );
}

class MaterialObjectRenderer extends React.Component<MaterialObjectRendererProps, any> {
    render() {
        const {
            findUiSchema,
            scopedSchema,
            path,
            visible,
        } = this.props;

        const style: {[x: string]: any} = { marginBottom: '10px' };
        if (!visible) {
            style.display = 'none';
        }

        const detailUiSchema = findUiSchema(scopedSchema, undefined, path, 'Group');

        return (
          <JsonForms
            visible={visible}
            schema={scopedSchema}
            uischema={detailUiSchema}
            path={path}
          />
        );
    }
}

const mapStateToObjectControlProps = (state, ownProps) => {
    const props =  mapStateToControlProps(state, ownProps);
    return {
        ...props,
        findUiSchema: findUISchema(state)
    };
};

const ConnectedMaterialObjectRenderer = connectToJsonForms(
    mapStateToObjectControlProps
)(MaterialObjectRenderer);

export const materialObjectControlTester: RankedTester = rankWith(2, isObjectControl);
export default ConnectedMaterialObjectRenderer;
