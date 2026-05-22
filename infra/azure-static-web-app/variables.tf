variable "project_name" {
  description = "Short project name used in Azure resource names."
  type        = string
}

variable "environment" {
  description = "Deployment environment name, such as dev, stag, or prod."
  type        = string
}

variable "location" {
  description = "Azure region for the resource group and Static Web App."
  type        = string
  default     = "eastus2"
}
