variable "resource_group_name" {
  description = "Name of the Azure resource group."
  type        = string
  default     = "team4-backend-terraform"
}

variable "location" {
  description = "Azure region where the resource group is created."
  type        = string
  default     = "UK South"
}

variable "network_resource_group_name" {
  description = "Resource group containing the shared frontend and backend network."
  type        = string
  default     = "team4-shared-network-dev"
}

variable "network_name" {
  description = "Name of the shared virtual network."
  type        = string
  default     = "vnet-team4-dev"
}

variable "backend_subnet_name" {
  description = "Delegated subnet for the backend Container Apps Environment."
  type        = string
  default     = "snet-backend-aca-dev"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be dev, test, or prod."
  }
}

variable "key_vault_name" {
  description = "Globally unique Key Vault name. Must be 3-24 characters and unique across Azure."
  type        = string
  default     = "kv-team4-backend-dev"

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9-]{1,22}[a-zA-Z0-9]$", var.key_vault_name))
    error_message = "Key Vault name must be 3-24 characters, start with a letter, and contain only letters, numbers, or hyphens."
  }
}

variable "managed_identity_name" {
  description = "Name of the user-assigned managed identity used by the Container App."
  type        = string
  default     = "id-team4-backend-dev"
}

variable "container_app_environment_name" {
  description = "Name of the Container Apps environment."
  type        = string
  default     = "cae-team4-backend-dev"
}

variable "container_app_name" {
  description = "Name of the backend Container App."
  type        = string
  default     = "ca-team4-backend-dev"
}

variable "acr_name" {
  description = "Existing Azure Container Registry the app will pull images from."
  type        = string
  default     = "acraiacademy26"
}

variable "acr_resource_group_name" {
  description = "Resource group that already contains the shared ACR."
  type        = string
  default     = "rg-ai-academy-26"
}

variable "backend_image_name" {
  description = "Repository name of the backend image in ACR."
  type        = string
  default     = "team4-backend"
}

variable "backend_image_tag" {
  description = "Image tag to deploy. CD pushes latest before apply."
  type        = string
  default     = "latest"
}

variable "database_url_secret_name" {
  description = "Key Vault secret name for DATABASE_URL."
  type        = string
  default     = "database-url"
}

variable "jwt_secret_name" {
  description = "Key Vault secret name for JWT_SECRET."
  type        = string
  default     = "jwt-secret"
}

variable "feature_flags_enabled" {
  description = "Feature flag toggle passed into the Container App as FEATURE_FLAGS_ENABLED."
  type        = bool
  default     = false
}
