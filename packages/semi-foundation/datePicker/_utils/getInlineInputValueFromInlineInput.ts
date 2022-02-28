import { strings } from '../constants'; 

/**
 * 从 inlineInput 字符串解析出 inlineInputValue 对象
 * Parse the inlineInputValue object from the inlineInput string
 * 
 * @example
 * ```
 * '2022-02-01' => { monthLeft: { dateInput: '2022-02-01' } }
 * '2022-02-01 00:00:00' => { monthLeft: { dateInput: '2022-02-01', timeInput: '00:00:00' } }
 * '2022-02-01 00:00:00 ~ 2022-02-15 00:00:00' => { monthLeft: { dateInput: '2022-02-01', timeInput: '00:00:00'}, monthRight: { dateInput: '2022-02-15', timeInput: '00:00:00' } }
 * 
 * '2022-0' => { monthLeft: { dateInput: '2022-0' } }
 * '2022-02-01 00:00:' => { monthLeft: { dateInput: '2022-02-01', timeInput: '00:00:' } }
 * '2022-02-01 00:00:00 ~ ' => { monthLeft: { dateInput: '2022-02-01', timeInput: '00:00:00'}, monthRight: { dateInput: '', timeInput: '' } }
 * ' ~ 2022-02-15 00:00:00' => { monthLeft: { dateInput: '', timeInput: '' }, monthRight: { dateInput: '2022-02-15', timeInput: '00:00:00' } }
 * ```
 */
export default function getInlineInputValueFromInlineInput(options: { inputValue: string; rangeSeparator: string, type: typeof strings.TYPE_SET[number] }) {
    const timeSeparator = ' ';
    const { inputValue = '', rangeSeparator, type } = options;
    let leftDateInput, leftTimeInput, rightDateInput, rightTimeInput;
    const inlineInputValue = {
        monthLeft: {
            dateInput: '',
            timeInput: '',
        },
        monthRight: {
            dateInput: '',
            timeInput: '',
        }
    };

    switch (type) {
        case 'date':
        case 'month':
            inlineInputValue.monthLeft.dateInput = inputValue;
            break;
        case 'dateRange':
            [leftDateInput = '', rightDateInput = ''] = inputValue.split(rangeSeparator);
            inlineInputValue.monthLeft.dateInput = leftDateInput;
            inlineInputValue.monthRight.dateInput = rightDateInput;
            break;
        case 'dateTime':
            [leftDateInput = '', leftTimeInput = ''] = inputValue.split(timeSeparator);
            inlineInputValue.monthLeft.dateInput = leftDateInput;
            inlineInputValue.monthLeft.timeInput = leftTimeInput;
            break;
        case 'dateTimeRange':
            const [leftInput = '', rightInput = ''] = inputValue.split(rangeSeparator);
            [leftDateInput = '', leftTimeInput = ''] = leftInput.split(timeSeparator);
            [rightDateInput = '', rightTimeInput = ''] = rightInput.split(timeSeparator);
            inlineInputValue.monthLeft.dateInput = leftDateInput;
            inlineInputValue.monthLeft.timeInput = leftTimeInput;
            inlineInputValue.monthRight.dateInput = rightDateInput;
            inlineInputValue.monthRight.timeInput = rightTimeInput;
            break;
    }
    return inlineInputValue;
}