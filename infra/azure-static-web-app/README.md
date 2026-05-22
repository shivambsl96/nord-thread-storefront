# Azure Static Web App Terraform

This Terraform stack creates the Azure hosting target for the headless Shopify frontend:

- Azure resource group
- Azure Static Web App
- Free SKU

Shopify remains the commerce backend. The frontend uses the Shopify Storefront API for products, variants, cart, and checkout. Shopify handles checkout, payments, taxes, shipping, orders, and lifecycle.

## Variables

```hcl
project_name = "nord-thread"
environment  = "dev"
location     = "eastus2"
```

## Usage

```bash
cd infra/azure-static-web-app
terraform init
terraform plan -var="project_name=nord-thread" -var="environment=dev" -var="location=eastus2"
terraform apply -var="project_name=nord-thread" -var="environment=dev" -var="location=eastus2"
```

## Outputs

```bash
terraform output static_web_app_hostname
```

## GitHub Actions Deployment

In Azure Portal, open the Static Web App resource and connect it to your GitHub repository, or add a workflow manually.

Recommended workflow shape:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || github.event.action != 'closed'
    runs-on: ubuntu-latest
    name: Build and Deploy
    steps:
      - uses: actions/checkout@v4

      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: ikea-streetwear-catalogue
          output_location: .next
          app_build_command: npm run build
        env:
          NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: ${{ secrets.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN }}
          NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${{ secrets.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN }}
          NEXT_PUBLIC_SHOPIFY_API_VERSION: ${{ secrets.NEXT_PUBLIC_SHOPIFY_API_VERSION }}

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: close
```

Add these GitHub secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `NEXT_PUBLIC_SHOPIFY_API_VERSION`

Use only a Shopify Storefront API token. Do not use or expose Shopify Admin API tokens.
