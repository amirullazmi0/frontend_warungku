export interface GlobalsAxiosResponse<T> {
    success?: boolean
    message?: string
    data?: T
    error?: any
}