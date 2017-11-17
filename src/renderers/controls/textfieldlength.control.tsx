import { JSX } from '../JSX';
import { isControl, RankedTester, rankWith } from '../../core/testers';
import { Control, ControlProps, ControlState } from './Control';
import {
    formatErrorMessage,
    mapStateToControlProps,
    registerStartupRenderer
} from '../renderer.util';
import { connect, Event } from '../../common/binding';

/**
 * Default tester for text-based/string controls.
 * @type {RankedTester}
 */
export const textfieldlengthControlTester: RankedTester = rankWith(4, isControl);

export class TextfieldlengthControl extends Control<ControlProps, ControlState> {

    render() {
        const { classNames, id, visible, enabled, errors, label } = this.props;
        const isValid = errors.length === 0;
        const divClassNames = 'validation' + (isValid ? '' : ' validation_error');

        return (
            <div className={classNames.wrapper}>
                <label htmlFor={id} className={classNames.label}>
                    {label}
                </label>
                <input value={this.state.value}
                       onChange={
                           (ev: Event<HTMLInputElement>) =>
                               this.handleChange(ev.currentTarget.value)
                       }
                       className={classNames.input}
                       id={id}
                       hidden={!visible}
                       disabled={!enabled}
                       maxlength='10'
                       size='10'
                />
                <div className={divClassNames}>
                    {!isValid ? formatErrorMessage(errors) : ''}
                </div>
            </div>
        );
    }
}

export default registerStartupRenderer(
    textfieldlengthControlTester,
    connect(mapStateToControlProps)(TextfieldlengthControl)
);
