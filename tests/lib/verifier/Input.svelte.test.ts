import type { Control } from '$lib/verifier/types';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ControlForTest from './InputForTest.svelte';

describe('Input Component', () => {
  it('renders a text input when control.type is "text"', async () => {
    const control: Control = {
      id: 'username',
      label: 'Username',
      type: 'text',
      required: true,
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText(/Username\*/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('required');

    await user.type(input, 'john');
    expect(input).toHaveValue('john');
  });

  it('renders a text input when control.type is "text" (error)', async () => {
    const control: Control = {
      id: 'username',
      label: 'Username',
      type: 'text',
      required: true,
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control, error: 'Required' } });

    const input = screen.getByLabelText(/Username\*/);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAccessibleErrorMessage('Required');

    await user.type(input, 'john');
    expect(input).toHaveValue('john');
  });

  it('renders a number input when control.type is "number"', async () => {
    const control: Control = {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: false,
      min: 0,
      max: 120,
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText('Age');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '120');
    expect(input).not.toHaveAttribute('required');
    expect(input).not.toHaveAccessibleErrorMessage();

    await user.type(input, '75');
    expect(input).toHaveValue(75);
  });

  it('renders a number input with step when control.type is "number"', async () => {
    const control: Control = {
      id: 'segments',
      label: 'Segments',
      type: 'number',
      required: true,
      min: 10,
      max: 50,
      step: 10,
    };

    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText(/Segments\*/);
    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '50');
    expect(input).toHaveAttribute('step', '10');
  });

  it('renders a select input when control.type is "select"', async () => {
    const control: Control = {
      id: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: ['uk', 'us'],
    };

    const user = userEvent.setup();
    render(ControlForTest, { props: { control, value: 'uk' } });

    const select = screen.getByLabelText(/Country\*/);
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('uk');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('uk');
    expect(options[1]).toHaveTextContent('us');

    await user.selectOptions(select, 'us');
    expect(select).toHaveValue('us');
  });

  it('renders a select input with error state when control.type is "select" (error)', async () => {
    const control: Control = {
      id: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: ['uk', 'us'],
    };

    render(ControlForTest, { props: { control, value: 'uk', error: 'Required' } });

    const select = screen.getByLabelText(/Country\*/);
    expect(select).toHaveAccessibleErrorMessage('Required');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders nothing visible when control.type is "hidden"', () => {
    const control: Control = { id: 'state', type: 'hidden' };

    render(ControlForTest, { props: { control } });

    const input = document.querySelector('#state') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'hidden');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders a disabled display field when control.type is "static"', () => {
    const control: Control = {
      id: 'blockhash',
      label: 'Block Hash',
      type: 'static',
      value: 'abc123',
    };

    render(ControlForTest, { props: { control } });

    const input = screen.getByLabelText(/Block Hash \(disabled\)/);
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(input).toHaveValue('abc123');
  });
});
