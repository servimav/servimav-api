import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';


/**
 * initAxios
 * @returns 
 */
function initAxios(config: IConfig, handleToken?: () => string) {

	const baseURL = config.host ?? 'https://api.servimav.com';

	const api = axios.create({
		baseURL,
		withCredentials: true,
		timeout: 30000
	});

	let token = config.token;
	if (handleToken) token = handleToken();

	api.interceptors.request.use(req => {
		/* Append content type header if its not present */
		if (!(req.headers as AxiosRequestHeaders)['Content-Type']) {
			(req.headers as AxiosRequestHeaders)['Content-Type'] =
				'application/json';
		}

		/* Check if authorization is set */
		if (!(req.headers as AxiosRequestHeaders)['Authorization']) {
			if (token && token.length > 0) {
				(req.headers as AxiosRequestHeaders).Authorization =
					'Bearer ' + token;
			}
		}

		return req;
	});

	return api;
}

/**
 * -----------------------------------------
 *	Main Instance
 * -----------------------------------------
 */

export const useServimav = (config: IConfig, instance: AxiosInstance) => {

	const { host, token } = config;
	const baseURL = host ?? 'https://api.servimav.com';
	/**
	 * Axios Instance
	 */
	const api = instance ?? initAxios(config);


	return {
		auth: {
			login: (param: ILoginRequest) => api.post<IAuthResponse>('/api/auth/login', param),
			register: (param: IRegisterRequest) => api.post<IAuthResponse>('/api/auth/register', param),
		},
		profile: {
			getProfile: () => api.get<IUserProfile>('/api/profile'),
			setProfile: (param: IUserProfile) => api.post<IUserProfile>('/api/profile', param),
			updateProfile: (param: IUpdateProfile) => api.post<IUserProfile>('/api/profile/update', param),
		}
	}
}


/**
 * -----------------------------------------
 *	Types
 * -----------------------------------------
 */
/**
 * @interface IConfig
 */
export interface IConfig {
	host?: string;
	token?: string;
}
/**
 * @interface IUser
 */
export interface IUser {
	id: number;
	name: string;
	email: string;
}
/**
 * @interface IUserProfile
 */
export interface IUserProfile {
	first_name: string;
	last_name: string;
	mobile_phone: string;
	address: IAddress;
	lang: 'es' | 'en'
}
/**
 * @interface IAddress
 */
export interface IAddress {
	address: string;
	city: string;
	state: string;
	country: string;
	postal_code: number;
}
/**
 * IAuthResponse
 */
export interface IAuthResponse {
	user: IUser;
	token: string;
}
/**
 * @interface ILoginRequest
 */
export interface ILoginRequest {
	email: string;
	password: string;
}
/**
 * @interface IRegisterRequest
 */
export interface IRegisterRequest extends ILoginRequest {
	name: string;
	password_confirmation: string;
}
/**
 * @interface IUpdateProfile
 */
export interface IUpdateProfile extends Partial<IUserProfile> {
	avatar: File;
}