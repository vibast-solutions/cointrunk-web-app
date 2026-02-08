// Validation result type
export interface ValidationResult {
    isValid: boolean
    error?: string
}

// BeeZee endpoint configuration
export interface BeeZeeEndpoints {
    restEndpoint: string
    rpcEndpoint: string
}

// Main application settings
export interface AppSettings {
    endpoints: BeeZeeEndpoints
    preferredFeeDenom?: string // User's preferred token for paying fees
}

// Validation results for both endpoints
export interface EndpointValidationResults {
    rest?: ValidationResult
    rpc?: ValidationResult
}

