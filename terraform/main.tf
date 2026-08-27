terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "team4-backend-terraform-state"
    storage_account_name = "danefirstterraformstate"
    container_name       = "tfstate"
    key                  = "team4-backend.tfstate"
    use_azuread_auth     = true
  }
}

provider "azurerm" {
  features {
    key_vault {
      # Dev-friendly: destroy can purge a soft-deleted vault so the name can be reused.
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

# Who is running Terraform (your user locally, later the GitHub Actions OIDC identity).
data "azurerm_client_config" "current" {}

module "resource_group" {
  source = "./modules/resource-group"

  name        = var.resource_group_name
  location    = var.location
  environment = var.environment
}

module "key_vault" {
  source = "./modules/key-vault"

  name                = var.key_vault_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  environment         = var.environment
  tenant_id           = data.azurerm_client_config.current.tenant_id
}

# Identity the Container App will use later to read Key Vault secrets and pull from ACR.
module "managed_identity" {
  source = "./modules/managed-identity"

  name                = var.managed_identity_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  environment         = var.environment
}

# Shared platform for Container Apps. The app itself comes later.
module "container_app_environment" {
  source = "./modules/container-app-environment"

  name                = var.container_app_environment_name
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  environment         = var.environment
}

moved {
  from = azurerm_resource_group.academy
  to   = module.resource_group.azurerm_resource_group.this
}
