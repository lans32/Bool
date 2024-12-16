"use strict";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

interface APIResponse<T = any> {
    json: () => Promise<T>;
    ok: boolean;
    status: number;
    statusText: string;
}

class API {
    private static instance: AxiosInstance;

    private static getInstance(): AxiosInstance {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: "http://localhost:5173/api/",
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.instance.interceptors.request.use(
                (config) => {
                    if (["post", "put", "delete"].includes(config.method || "")) {
                        const csrfToken = getCookie("csrftoken");
                        if (!csrfToken) {
                            throw new Error("CSRF token is missing");
                        }
                        config.headers["X-CSRFToken"] = csrfToken;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            this.instance.interceptors.response.use(
                (response) => response,
                (error) => {
                    console.error("[API Error]:", error.response?.data || error.message);
                    return Promise.reject(error);
                }
            );
        }
        return this.instance;
    }

    private static handleResponse<T>(response: AxiosResponse<T>): APIResponse<T> {
        return {
            json: async () => response.data,
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
        };
    }

    private static async safeRequest<T>(promise: Promise<AxiosResponse<T>>): Promise<APIResponse<T>> {
        try {
            const response = await promise;
            return this.handleResponse(response);
        } catch (error: any) {
            if (error.response) {
                return this.handleResponse(error.response);
            }
            throw error; // Network or unexpected error
        }
    }

    static async getCsrfToken(): Promise<string | null> {
        try {
            const response = await this.getInstance().get("csrf/");
            return response.data.csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
            return null;
        }
    }

    static async getSession() {
        return this.safeRequest(this.getInstance().get("users/check/"));
    }

    static async getOperations(postfix?: string) {
        const url = postfix ? `operations/${postfix}` : "operations/";
        return this.safeRequest(this.getInstance().get(url));
    }

    static async getOperationDetails(id: string) {
        return this.safeRequest(this.getInstance().get(`operations/${id}/`));
    }

    static async login({ email, password }: LoginParams) {
        return this.safeRequest(this.getInstance().post("login/", { email, password }));
    }

    static async logout() {
        return this.safeRequest(this.getInstance().post("logout/", {}));
    }

    static async auth({ email, password }: LoginParams) {
        return this.safeRequest(this.getInstance().post("users/auth/", { email, password }));
    }

    static async getAsks(filters?: { date_from?: string; date_to?: string; status?: string }) {
        const query = new URLSearchParams(filters).toString();
        return this.safeRequest(this.getInstance().get(`asks/?${query}`));
    }

    static async getAskById(id: number) {
        return this.safeRequest(this.getInstance().get(`asks/${id}/`));
    }

    static async addOperationToDraft(id: number) {
        return this.safeRequest(this.getInstance().post(`operations/${id}/draft/`, {}));
    }

    static async changeOperationFields(operationId: number, askId: number, secondOperand?: boolean) {
        return this.safeRequest(this.getInstance().put(`asks/${askId}/operations/${operationId}/`, { second_operand: secondOperand }));
    }

    static async changeAddFields(id: number, firstOperand?: boolean) {
        const body: Record<string, any> = {};
        body.first_operand = firstOperand;
        return this.safeRequest(this.getInstance().put(`asks/${id}/edit/`, body));
    }

    static async deleteOperationFromDraft(askId: number, operationId: number) {
        return this.safeRequest(this.getInstance().delete(`asks/${askId}/operations/${operationId}/`));
    }

    static async formAsk(askId: number) {
        return this.safeRequest(this.getInstance().put(`asks/${askId}/form/`, { status: "f" }));
    }

    static async deleteAsk(askId: number) {
        return this.safeRequest(this.getInstance().delete(`asks/${askId}/`));
    }

    static async updateProfile(email?: string, password?: string) {
        const body: Record<string, any> = {};
        if (email) body.email = email;
        if (password) body.password = password;
        return this.safeRequest(this.getInstance().put("users/profile/", body));
    }
}

export default API;