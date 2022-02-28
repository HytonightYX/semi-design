import { strings } from '../constants';
import { getDefaultFormatTokenByType } from './getDefaultFormatToken';

/**
 * 获取 inlineInput 输入框的 placeholder
 * Get the placeholder of the inlineInput input
 * 
 * If type is time related, we only recognize the format like `dateFormat timeFormat`
 *  - 'yyyy-MM-dd HH:mm:ss' // ok
 *  - 'yyyy-MM-dd  HH:mm:ss' // bad format
 * 
 * @example
 * 'yyyy-MM-dd' => 'yyyy-MM-dd'
 * 'yyyy-MM' => 'yyyy-MM'
 * 'yyyy-MM-dd HH:mm:ss' => 'yyyy-MM-dd HH:mm:ss'
 * 'yyyy-MM-dd HH:mm' => 'yyyy-MM-dd HH:mm'
 * 'Pp' => 'yyyy-MM-dd'
 */
export default function getInlineInputFormatToken(options: { format: string, type: typeof strings.TYPE_SET[number]; }) {
    const { format, type } = options;
    const dateReg = /([yMd]{0,4}[^a-z\s]*[yMd]{0,4}[^a-z\s]*[yMd]{0,4})/i;
    const dateTimeReg = /([yMd]{0,4}[^a-z\s]*[yMd]{0,4}[^a-z\s]*[yMd]{0,4}) (H{0,2}[^a-z\s]*m{0,2}[^a-z\s]*s{0,2})/i;
    const defaultToken = getDefaultFormatTokenByType(type);
    let inlineInputFormat: string;

    switch (type) {
        case 'dateTime':
        case 'dateTimeRange':
            const dateTimeResult = dateTimeReg.exec(format);
            inlineInputFormat = (dateTimeResult && dateTimeResult[1] && dateTimeResult[2]) ? `${dateTimeResult[1]} ${dateTimeResult[2]}` : defaultToken;
            break;
        case 'date':
        case 'month':
        case 'dateRange':
        default:
            const dateResult = dateReg.exec(format);
            inlineInputFormat = dateResult && dateResult[1] || defaultToken;
            break;
    }

    return inlineInputFormat;
}