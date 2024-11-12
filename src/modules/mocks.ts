import { T_Operation } from './types';

export const OperationsMocks: T_Operation[] = [
    {
        'id': 1,
        'name': "Дизъюнкция",
        'operator_name': "Оператор OR",
        'description': "Возвращает истину, если хотя бы одно из значений истинно.",
        'photo': "",
        'status': "a",
        'value_0': false,
        'value_A': true,
        'value_B': true,
        'value_AB': true
    },
    {
        'id': 2,
        'name': "Конъюнкция",
        'operator_name': "Оператор AND",
        'description': "Возвращает истину только если оба значения истинны.",
        'photo': "",
        'status': "a",
        'value_0': false,
        'value_A': false,
        'value_B': false,
        'value_AB': true
    },
    {
        'id': 3,
        'name': "Исключающие 'ИЛИ'",
        'operator_name': "Оператор XOR",
        'description': "Возвращает истину, если одно из значений истинно, но не оба.",
        'photo': "",
        'status': "a",
        'value_0': false,
        'value_A': true,
        'value_B': true,
        'value_AB': false
    },
    {
        'id': 4,
        'name': "Импликация",
        'operator_name': "Оператор IMPLIES",
        'description': "Возвращает ложь, только если первое значение истинно, а второе — ложно.",
        'photo': "",
        'status': "a",
        'value_0': true,
        'value_A': false,
        'value_B': true,
        'value_AB': true
    },
    {
        'id': 5,
        'name': "Эквиваленция",
        'operator_name': "Оператор XNOR",
        'description': "Возвращает истину, если оба значения равны (оба истинны или оба ложны).",
        'photo': "",
        'status': "a",
        'value_0': true,
        'value_A': false,
        'value_B': false,
        'value_AB': true
    },
    {
        'id': 6,
        'name': "Штрих Шеффера",
        'operator_name': "Оператор NAND",
        'description': "Возвращает ложь только если оба значения истинны.",
        'photo': "",
        'status': "a",
        'value_0': true,
        'value_A': true,
        'value_B': true,
        'value_AB': false
    }
]