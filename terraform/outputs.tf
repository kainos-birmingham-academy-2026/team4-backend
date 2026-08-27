output "resource_group_name" {
  description = "Name of the Azure resource group."
  value       = module.resource_group.name
}

output "resource_group_id" {
  description = "ID of the Azure resource group."
  value       = module.resource_group.id
}

output "resource_group_location" {
  description = "Azure region of the resource group."
  value       = module.resource_group.location
}

output "key_vault_name" {
  description = "Name of the Azure Key Vault."
  value       = module.key_vault.name
}

output "key_vault_id" {
  description = "Resource ID of the Azure Key Vault."
  value       = module.key_vault.id
}

output "key_vault_uri" {
  description = "URI used later by Container Apps to pull secrets."
  value       = module.key_vault.uri
}

output "managed_identity_name" {
  description = "Name of the user-assigned managed identity."
  value       = module.managed_identity.name
}

output "managed_identity_id" {
  description = "Resource ID to attach to the Container App."
  value       = module.managed_identity.id
}

output "managed_identity_client_id" {
  description = "Client ID the Container App uses when assuming this identity."
  value       = module.managed_identity.client_id
}

output "managed_identity_principal_id" {
  description = "Object ID used later to grant Key Vault and ACR access."
  value       = module.managed_identity.principal_id
}

output "container_app_environment_name" {
  description = "Name of the Container Apps environment."
  value       = module.container_app_environment.name
}

output "container_app_environment_id" {
  description = "Resource ID of the Container Apps environment."
  value       = module.container_app_environment.id
}

output "container_app_environment_default_domain" {
  description = "Default domain for apps hosted in this environment."
  value       = module.container_app_environment.default_domain
}

output "backend_container_app_name" {
  description = "Name of the backend Container App."
  value       = module.backend_container_app.name
}

output "backend_container_app_fqdn" {
  description = "Internal FQDN of the backend Container App."
  value       = module.backend_container_app.fqdn
}
