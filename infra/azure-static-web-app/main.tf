locals {
  name_prefix = lower(replace("${var.project_name}-${var.environment}", "_", "-"))
}

resource "azurerm_resource_group" "this" {
  name     = "rg-${local.name_prefix}"
  location = var.location
}

resource "azurerm_static_web_app" "this" {
  name                = "swa-${local.name_prefix}"
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_tier            = "Free"
  sku_size            = "Free"
}
