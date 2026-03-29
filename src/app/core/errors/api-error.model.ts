export interface ApiValidationError {
    field: string;
    message: string;
}

export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    errors?: ApiValidationError[];
}
