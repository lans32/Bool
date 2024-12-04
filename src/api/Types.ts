'use strict';

export interface Operation {
    id: number;
    name: string;
    operator_name: string;
    description: string;
    photo: string;
    status: string;
    value_0: boolean;
    value_A: boolean;
    value_B: boolean;
    value_AB: boolean;
}
export interface Ask {
    id: string;
    first_operand: boolean | null;
    status: string;
    created_at: string;
    formed_at: string | null;
    completed_at: string | null,
    creator: number;
    moderator: number | null;
}