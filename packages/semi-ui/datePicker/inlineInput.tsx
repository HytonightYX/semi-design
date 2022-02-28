import React from 'react';
import { get } from 'lodash';

import {
    InlineInputValue,
    Type,
    InlineInputChangeFoundationProps,
} from '@douyinfe/semi-foundation/datePicker/inputFoundation';
import Input, { InputProps } from '../input';

export interface InlineDateInputProps {
    forwardRef: InputProps['forwardRef'];
    inlineInputValue: InlineInputValue;
    placeholder: string;
    valuePath: string;
    onChange: (options: InlineInputChangeFoundationProps) => void;
    onFocus: InputProps['onFocus'];
}

export interface InlineTimeInputProps {
    disabled: boolean;
    inlineInputValue: InlineInputValue;
    placeholder: string;
    valuePath: string;
    type: Type;
    onChange: (options: InlineInputChangeFoundationProps) => void;
    onFocus: InputProps['onFocus'];
}

export function InlineDateInput(props: InlineDateInputProps) {
    const { inlineInputValue, valuePath, onFocus, onChange, placeholder, forwardRef } = props;
    const value = get(inlineInputValue, valuePath);

    return (
        <Input
            value={value}
            onChange={(value, event) => {
                onChange({
                    value,
                    event,
                    inlineInputValue,
                    valuePath,
                });
            }}
            onFocus={onFocus}
            placeholder={placeholder}
            ref={forwardRef}
        />
    );
}

export function InlineTimeInput(props: InlineTimeInputProps) {
    const { inlineInputValue, valuePath, type, onFocus, onChange, placeholder, disabled } = props;
    const _isTimeType = type.includes('Time');
    if (!_isTimeType) {
        return null;
    }
    const value = get(inlineInputValue, valuePath);

    return (
        <Input
            value={value}
            onChange={(value, event) => {
                onChange({
                    value,
                    event,
                    inlineInputValue,
                    valuePath,
                });
            }}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
}
