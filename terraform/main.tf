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
  features {}
}

module "resource_group" {
  source = "./modules/resource-group"

  name        = var.resource_group_name
  location    = var.location
  environment = var.environment
}

moved {
  from = azurerm_resource_group.academy
  to   = module.resource_group.azurerm_resource_group.this
}
