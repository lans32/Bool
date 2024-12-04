//API.ts
import { OperationsMocks } from "../modules/mocks";
"use strict";

import Ajax from "./Ajax.ts";
import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

const API = {
    BASE_URL: `http://${window.location.hostname}:5173/api`,

    async getCsrfToken() {
        try {
            const url = this.BASE_URL + 'csrf/';
            const response = await Ajax.get(url);
            const data = await response.json()
            return data.csrfToken
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return null;
        }
    },

    async getSession() {
        const url = this.BASE_URL + 'users/check/'
        return Ajax.get(url)
    },

    async getOperations(){
        const url = this.BASE_URL + "/operations/";
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            return OperationsMocks;
        }
        //return Ajax.get(url);
    },

    async getOperationDetails(operationId: number) {
        const url = this.BASE_URL + `/operations/${operationId}/`;
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных о корабле:", error);
            const mockOperation = OperationsMocks.find((s) => s.id === operationId);
            if (mockOperation) {
                return mockOperation;
            } else {
                throw new Error("Корабль не найден в мок-данных");
            }
        }
    },

    async login({email, password}:LoginParams) {
        const url = this.BASE_URL + '/login/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    },

    async auth({email, password}:LoginParams) {
        const url = this.BASE_URL + '/users/auth/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    },
    
    async logout() {
        const url = this.BASE_URL + 'logout/';
        const body = {};
        return Ajax.post({url, body})
    },

    async updateProfile(email?: string, password?: string) {
        const url = this.BASE_URL + 'users/profile/';
        const body: any = {};
        if (email) body.email = email;
        if (password) body.password = password;

        return Ajax.put({url, body})
    }
};

export default API;