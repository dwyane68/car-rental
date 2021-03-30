const { OTP_LENGTH } = require('../config/constants');
const moment = require('moment');

exports.getExpiry = (period, type) => {
    const momentType = {
        DAY: 'd',
        MONTH: 'M',
        YEAR: 'y',
    }[type];

    return moment().add(parseInt(period), momentType);
};

exports.getDateDiffFromNow = (date) => {
    const dateObj = new Date(date);
    const now = new Date();
    return (now - dateObj);
};

exports.filterParams = (params, filterKeys) => {
    const keys = Object.keys(params);
    const filteredAttributes = keys.filter((k) => filterKeys.indexOf(k) >= 0);
    const len = filteredAttributes.length;
    let values = {};
    for(let i=0; i < len;i++){
        values[filteredAttributes[i]] = params[filteredAttributes[i]];
    }
    return values;
};

exports.buildResponse = (payload, msg) => {
    return {
        payload: payload,
        msg: msg
    }
};

exports.invalidResponse = (msg) => {
    return {
        error: {
            code: 'INVALID_DATA',
            msg: msg
        }
    }
}


const numberRegex = /^-?\d+\.?\d*$/;
const variableRegex  = /^[a-zA-Z]+[a-zA-Z0-9_]*$/;
const emailRegex = /^([a-z]+[a-z0-9]*.)+[a-z0-9]+@([a-z]+[a-z0-9]*.)+[a-z0-9]+$/;
const phoneRegex = /^([789])[0-9]{9}$/;

const regexIndexOf = (arr, regex) => {
    for(let i=0; i < arr.length; i++){
        if(arr[i].match(regex)){
            return i;
        }
    }
    return -1;
};

const templateRules = 'required,phone,email,date,number,min=x,max=y,text,words,word';

exports.validate = (fields) => {
    let validatedData = {};
    let errors = {};
    let errorCount = 0;
    let key =  '';

    try {
        for (let i = 0; i < fields.length; i++) {

            let field = fields[i];

            field = field.split('|');
            field = {
                key: field[0],
                value: field[1],
                rule: field[2]
            };

            key = field.key;

            let rules = field.rule.split(',');

            let _null = false;
            let _typeNumber = typeof field.value === "number";
            let _typeString = typeof field.value === "string";
            let _min = regexIndexOf(rules, /^min=\d+/);
            let _max = regexIndexOf(rules, /^max=\d+/);

            if (typeof field.value === "object") {
                validatedData[field.key] = field.value;
                continue;
            }

            //if type is string , trim the string
            if (typeof field.value === 'string' || field.value instanceof String) {
                field.value = field.value.trim();
            }

            //set flag _null true if value is undefined, null, empty
            if (field.value === undefined || field.value === null || field.value === "" || field.value.length == 0) {
                _null = true;
            }

            //required
            if (rules.indexOf('required') !== -1) {
                if (_null) {
                    errorCount++;
                    errors[field.key] = 'REQUIRED';
                    continue;
                }
            }

            //number checking if not null
            if (rules.indexOf('number') !== -1 && !_null) {
                //number can also be in form of string so first check if string contain only number
                if (_typeString) {
                    if (!numberRegex.test(field.value)) {
                        errorCount++;
                        errors[field.key] = 'NAN';
                        continue;
                    } else {
                        // since string is number so parse string into number (int or float based on decimal)
                        if (field.value.indexOf('.') !== -1) {
                            field.value = parseFloat(field.value);
                        } else {
                            field.value = parseInt(field.value);
                        }
                    }
                } else if (typeof field.value !== "number") { // js outputs false if its not a number
                    errorCount++;
                    errors[field.key] = 'NAN';
                    continue;
                }
            }

            if (_min !== -1 && !_null) {
                let min = rules[_min].split('=');
                min = parseInt(min[1]);
                if (_typeNumber) {
                    if (field.value < min) {
                        errorCount++;
                        errors[field.key] = 'MIN';
                        continue;
                    }
                } else if (_typeString) {
                    if (field.value.length < min) {
                        errorCount++;
                        errors[field.key] = 'MINLENGTH';
                        continue;
                    }
                }
            }

            if (_max !== -1 && !_null) {
                let max = rules[_max].split('=');
                max = parseInt(max[1]);
                if (_typeNumber) {
                    if (field.value > max) {
                        errorCount++;
                        errors[field.key] = 'MAX';
                        continue;
                    }
                } else if (_typeString) {
                    if (field.value.length > max) {
                        errorCount++;
                        errors[field.key] = 'MAXLENGTH';
                        continue;
                    }
                }
            }

            if (rules.indexOf('date') !== -1 && !_null) {
                let testDate = new Date(field.value);
                if (testDate == 'Invalid Date') {
                    errorCount++;
                    errors[field.key] = 'INVALID_DATE';
                    continue;
                }
            }

            if (rules.indexOf('variable') !== -1 && !_null) {
                if (!variableRegex.test(field.value)) {
                    errorCount++;
                    errors[field.key] = 'NOT_VARIABLE';
                    continue;
                }
            }

            if (rules.indexOf('email') !== -1 && !_null) {
                if (!emailRegex.test(field.value)) {
                    errorCount++;
                    errors[field.key] = 'INVALID_EMAIL';
                    continue;
                }
            }

            if (rules.indexOf('phone') !== -1 && !_null) {
                if (!phoneRegex.test(field.value)) {
                    errorCount++;
                    errors[field.key] = 'INVALID_PHONE';
                    continue;
                }
            }
            validatedData[field.key] = field.value;
        }
    }catch (e) {
        console.log(e);
    }
    return {
        data: validatedData,
        error: errorCount > 0 ? errors : null,
    }
};