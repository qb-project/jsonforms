import { expect } from 'chai';
import { merge } from 'lodash';
import { mountJsonForms } from '../util';

const schema = {
  type: 'string',
  title: 'My Date Time',
  format: 'date-time'
};
const uischema = {
  type: 'Control',
  scope: '#',
  options: {
    placeholder: 'date-time placeholder'
  }
};

describe('DateTimeControlRenderer.vue', () => {
  it('renders a date time input', () => {
    const wrapper = mountJsonForms('2021-03-09T21:54:00.000Z', schema, uischema);
    expect(wrapper.find('input[type="datetime-local"]').exists()).to.be.true;
  });

  it('renders title as label', () => {
    const wrapper = mountJsonForms('2021-03-09T21:54:00.000Z', schema, uischema);
    expect(wrapper.find('label').text()).to.equal('My Date Time');
  });

  it('emits a data change', async () => {
    const wrapper = mountJsonForms('2021-03-09T21:54:00.000Z', schema, uischema);
    const input = wrapper.find('input');
    await input.setValue('2021-03-10T21:10');
    await input.trigger('blur');
    expect(wrapper.vm.data).to.equal('2021-03-10T21:10:00.000Z');
  });

  it('should have a placeholder', async () => {
    const wrapper = mountJsonForms('2021-03-09T21:54:00.000Z', schema, uischema);
    const input = wrapper.find('input');
    const placeholder = input.attributes('placeholder');
    expect(placeholder).to.equal('date-time placeholder');
  });

  describe('removeWhenEmpty: true', () => {
    const rweUischema = merge(uischema, { options: { removeWhenEmpty: true } });

    it('data should be undefined', async () => {
      const wrapper = mountJsonForms(
        '2021-03-09T21:54:00.000Z',
        schema,
        rweUischema
      );
      const input = wrapper.find('input');
      await input.setValue('2021-03-10T21:10');
      await input.trigger('blur');
      await input.setValue('');
      await input.trigger('blur');
      expect(wrapper.vm.data).to.equal(undefined);
    });
  });
});
