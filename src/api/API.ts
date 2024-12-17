"use strict";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getCookie } from "./Utils";
import { Operation } from './Types'; // Убедитесь, что импортируете правильный тип

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
    private static navigate: any;
    static setNavigate(navigate: any) {
        this.navigate = navigate;
    }

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
                    const { response } = error;

                    if (response) {
                        const { status } = response;

                        // Проверка на статус 401 или 403
                        if (status === 401 || status === 403) {
                            if (this.navigate) {
                                this.navigate("/error/403");  // Переход на страницу ошибки 403
                            } else {
                                window.location.href = "/error/403";  // Для случаев, когда navigate недоступен
                            }
                        } else if (status === 404) {
                            if (this.navigate) {
                                this.navigate("/error/404");  // Переход на страницу ошибки 404
                            } else {
                                window.location.href = "/error/404";  // Для случаев, когда navigate недоступен
                            }
                        }
                    }

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
        const response = await this.safeRequest(this.getInstance().get("users/check/"));
        if (response.ok) {
            const data = await response.json();
            return { 
                username: data.username, 
                isStaff: data.is_staff 
            };
        }
        return { username: null, isStaff: false };
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

    static async createOperation(operationData: Omit<Operation, 'id'>) {
        return this.safeRequest(
            this.getInstance().post("operations/", operationData)
        );
    }

    static async updateOperation(id: number, operationData: Omit<Operation, 'id'>) {
        return this.safeRequest(
            this.getInstance().put(`operations/${id}/`, operationData)
        );
    }

    static async deleteOperation(id: number) {
        return this.safeRequest(
            this.getInstance().delete(`operations/${id}/`)
        );
    }

    static async operationsImageUpdate(id: string, data: FormData) {
        return this.safeRequest(this.getInstance().put(`/operations/${id}/image/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }));
    }

    static async completeAsk(askId: number) {
        return this.safeRequest(this.getInstance().put(`asks/${askId}/complete/`, { status: "c" }));
    }
    static async rejectedAsk(askId: number) {
        return this.safeRequest(this.getInstance().put(`asks/${askId}/complete/`, { status: "r" }));
    }
}

export default API;