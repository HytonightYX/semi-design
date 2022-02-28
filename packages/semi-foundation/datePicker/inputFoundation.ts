/* eslint-disable max-len */
import { cloneDeep, isObject, set } from 'lodash';

import BaseFoundation, { DefaultAdapter } from '../base/foundation';
import { BaseValueType, ValidateStatus } from './foundation';
import { formatDateValues } from './_utils/formatter';
import { getDefaultFormatTokenByType } from './_utils/getDefaultFormatToken';
import getInlineInputFormatToken from './_utils/getInlineInputFormatToken';
import getInlineInputValueFromInlineInput from './_utils/getInlineInputValueFromInlineInput';
import { strings } from './constants';

const KEY_CODE_ENTER = 'Enter';
const KEY_CODE_TAB = 'Tab';


export type Type = 'date' | 'dateRange' | 'year' | 'month' | 'dateTime' | 'dateTimeRange';
export type RangeType = 'rangeStart' | 'rangeEnd';
export type PanelType = 'left' | 'right';

export interface DateInputEventHandlerProps {
    onClick?: (e: any) => void;
    onChange?: (value: string, e: any) => void;
    onEnterPress?: (e: any) => void;
    onBlur?: (e: any) => void;
    onFocus?: (e: any, rangeType: RangeType) => void;
    onClear?: (e: any) => void;
    onRangeInputClear?: (e: any) => void;
    onRangeEndTabPress?: (e: any) => void;
    onInlineInputChange?: (options: InlineInputChangeProps) => void;
}

export interface DateInputElementProps {
    insetLabel?: any;
    prefix?: any;
}

export interface DateInputFoundationProps extends DateInputElementProps, DateInputEventHandlerProps {
    [x: string]: any;
    value?: BaseValueType[];
    disabled?: boolean;
    type?: Type;
    multiple?: boolean;
    showClear?: boolean;
    format?: string;
    inputStyle?: React.CSSProperties;
    inputReadOnly?: boolean;
    validateStatus?: ValidateStatus;
    prefixCls?: string;
    rangeSeparator?: string;
    panelType?: PanelType;
    inlineInput?: boolean;
    inlineInputValue?: InlineInputValue;
    density?: typeof strings.DENSITY_SET[number];
}

export interface InlineInputValue {
    monthLeft: {
        dateInput: string;
        timeInput: string;
    },
    monthRight: {
        dateInput: string;
        timeInput: string;
    }
}

export interface InlineInputChangeFoundationProps {
    value: string;
    inlineInputValue: InlineInputValue;
    event: any;
    valuePath: string;
}

export interface InlineInputChangeProps { 
    inlineInput: string;
    format: string;
    inlineInputValue: InlineInputValue;
}

export interface DateInputAdapter extends DefaultAdapter {
    updateIsFocusing: (isFocusing: boolean) => void;
    notifyClick: DateInputFoundationProps['onClick'];
    notifyChange: DateInputFoundationProps['onChange'];
    notifyInlineInputChange: DateInputFoundationProps['onInlineInputChange'];
    notifyEnter: DateInputFoundationProps['onEnterPress'];
    notifyBlur: DateInputFoundationProps['onBlur'];
    notifyClear: DateInputFoundationProps['onClear'];
    notifyFocus: DateInputFoundationProps['onFocus'];
    notifyRangeInputClear: DateInputFoundationProps['onRangeInputClear'];
    notifyRangeInputFocus: DateInputFoundationProps['onFocus'];
    notifyTabPress: DateInputFoundationProps['onRangeEndTabPress'];
}

export default class InputFoundation extends BaseFoundation<DateInputAdapter> {
    constructor(adapter: DateInputAdapter) {
        super({ ...adapter });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}

    handleClick(e: any) {
        this._adapter.notifyClick(e);
    }

    handleChange(value: string, e: any) {
        this._adapter.notifyChange(value, e);
    }

    handleInputComplete(e: any) {
        /**
         * onKeyPress, e.key Code gets a value of 0 instead of 13
         * Here key is used to judge the button
         */
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(e.target.value);
        }
    }

    handleInputClear(e: any) {
        this._adapter.notifyClear(e);
    }

    handleRangeInputClear(e: any) {
        // prevent trigger click outside
        this.stopPropagation(e);
        this._adapter.notifyRangeInputClear(e);
    }

    handleRangeInputEnterPress(e: any, rangeInputValue: string) {
        if (e.key === KEY_CODE_ENTER) {
            this._adapter.notifyEnter(rangeInputValue);
        }
    }

    handleRangeInputEndKeyPress(e: any) {
        if (e.key === KEY_CODE_TAB) {
            this._adapter.notifyTabPress(e);
        }
    }

    handleRangeInputFocus(e: any, rangeType: RangeType) {
        this._adapter.notifyRangeInputFocus(e, rangeType);
    }

    formatShowText(value: BaseValueType[], customFormat?: string) {
        const { type, dateFnsLocale, format, rangeSeparator } = this._adapter.getProps();
        const formatToken = customFormat || format || getDefaultFormatTokenByType(type);
        let text = '';
        switch (type) {
            case 'date':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'dateTime':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            case 'dateTimeRange':
                text = formatDateValues(value, formatToken, { groupSize: 2, groupInnerSeparator: rangeSeparator }, dateFnsLocale);
                break;
            case 'month':
                text = formatDateValues(value, formatToken, undefined, dateFnsLocale);
                break;
            default:
                break;
        }
        return text;
    }

    handleInlineInputChange(options: InlineInputChangeFoundationProps) {
        const { value, valuePath, inlineInputValue } = options;
        const { format, type } = this._adapter.getProps();
        const inlineFormatToken = getInlineInputFormatToken({ type, format });
        const newInlineInputValue = set(cloneDeep(inlineInputValue), valuePath, value);
        const newInputValue = this.concatInlineInputValue({ inlineInputValue: newInlineInputValue });
        this._adapter.notifyInlineInputChange({ inlineInputValue: newInlineInputValue, format: inlineFormatToken, inlineInput: newInputValue });
    }

    /**
     * 只有传入的 format 符合 formatReg 时，才会使用用户传入的 format
     * 否则会使用默认的 format 作为 placeholder
     * 
     * The format passed in by the user will be used only if the incoming format conforms to formatReg
     * Otherwise the default format will be used as placeholder
     */
    getInlineInputPlaceholder() {
        const { type, format } = this._adapter.getProps();
        const inlineInputFormat = getInlineInputFormatToken({ type, format });
        let datePlaceholder, timePlaceholder;

        switch (type) {
            case 'date':
            case 'month':
            case 'dateRange':
                datePlaceholder = inlineInputFormat;
                break;
            case 'dateTime':
            case 'dateTimeRange':
                [datePlaceholder, timePlaceholder] = inlineInputFormat.split(' ');
                break;
        }

        return ({
            datePlaceholder,
            timePlaceholder,
        });
    }

    /**
     * 从当前日期值或 inputValue 中解析出 inlineInputValue
     * 
     * Parse out inlineInputValue from current date value or inputValue
     */
    getInlineInputValue({ value, inlineInputValue } : { value: BaseValueType[]; inlineInputValue: InlineInputValue }) {
        const { type, rangeSeparator, format } = this._adapter.getProps();

        let inputValueAllInOne = '';
        if (isObject(inlineInputValue)) {
            inputValueAllInOne = this.concatInlineInputValue({ inlineInputValue });
        } else {
            const inlineInputFormat = getInlineInputFormatToken({ format, type });
            inputValueAllInOne = this.formatShowText(value, inlineInputFormat);
        }

        const newInlineInputValue = getInlineInputValueFromInlineInput({ inputValue: inputValueAllInOne, type, rangeSeparator });
        return newInlineInputValue;
    }

    concatInlineDateAndTime({ date, time }) {
        return `${date} ${time}`;
    }

    concatInlineDateRange({ rangeStart, rangeEnd }) {
        const { rangeSeparator } = this._adapter.getProps();
        return `${rangeStart}${rangeSeparator}${rangeEnd}`;
    }

    concatInlineInputValue({ inlineInputValue }: { inlineInputValue: InlineInputValue }) {
        const { type } = this._adapter.getProps();
        let inputValue = '';

        switch (type) {
            case 'date':
            case 'month':
                inputValue = inlineInputValue.monthLeft.dateInput;
                break;
            case 'dateRange':
                inputValue = this.concatInlineDateRange({ rangeStart: inlineInputValue.monthLeft.dateInput, rangeEnd: inlineInputValue.monthRight.dateInput });
                break;
            case 'dateTime':
                inputValue = this.concatInlineDateAndTime({ date: inlineInputValue.monthLeft.dateInput, time: inlineInputValue.monthLeft.timeInput });
                break;
            case 'dateTimeRange':
                const rangeStart = this.concatInlineDateAndTime({ date: inlineInputValue.monthLeft.dateInput, time: inlineInputValue.monthLeft.timeInput });
                const rangeEnd = this.concatInlineDateAndTime({ date: inlineInputValue.monthRight.dateInput, time: inlineInputValue.monthRight.timeInput });
                inputValue = this.concatInlineDateRange({ rangeStart, rangeEnd });
                break;
        }

        return inputValue;
    }
}
