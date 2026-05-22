output "resource_group_name" {
  description = "Azure resource group name."
  value       = azurerm_resource_group.this.name
}

output "static_web_app_name" {
  description = "Azure Static Web App resource name."
  value       = azurerm_static_web_app.this.name
}

output "static_web_app_hostname" {
  description = "Default Azure Static Web App hostname."
  value       = azurerm_static_web_app.this.default_host_name
}
