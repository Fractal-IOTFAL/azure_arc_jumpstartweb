---
type: docs
title: "Manage Arc enabled servers with Azure Policy"
linkTitle: "Manage Arc enabled servers with Azure Policy"
weight: 4
description: >
---

## Deploying Microsoft Monitoring Agent Extension (MMA) to Azure Arc Linux and Windows VMs using Azure Policies

The following README will guide you on how to use Azure Arc enabled servers to assign Azure Policies to VMs outside of Azure, whether they are on-premises or other clouds. With this feature you can now use Azure Policy to audit settings in the operating system of an Azure Arc enabled server, if a setting is not compliant you can also trigger a remediation task.

In this case, you will assign a policy to audit if the Azure Arc connected machine has the (Microsoft Monitoring Agent) MMA agent installed, if not, you will use the extensions feature to automatically deploy it to the VM, an enrollment experience that levels to Azure VMs. This approach can be used to make sure all your servers are onboarded to services such as Azure Monitor, Azure Security Center, Azure Sentinel, etc.

You can use the Azure Portal, an ARM template or PowerShell script to assign policies to Azure subscriptions or resource groups. In this guide, you will use an ARM template to assign built-in policies. 

> **Note: This guide assumes you already deployed VMs or servers that are running on-premises or other clouds and you have connected them to Azure Arc.**

* **[GCP Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/gcp/gcp_terraform_ubuntu/_index.md) / [GCP Windows VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/gcp/gcp_terraform_windows/_index.md)**
* **[AWS Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/aws/aws_terraform_ubuntu/_index.md)**
* **[VMware Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vmware/vmware_terraform_ubuntu/_index.md) / [VMware Windows Server VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vmware/vmware_terraform_winsrv/_index.md)**
* **[Local Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vagrant/local_vagrant_ubuntu/_index.md) / [Local Windows VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vagrant/local_vagrant_windows/_index.md)**

Please review the [Azure Monitor supported OS documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/vminsights-enable-overview#supported-operating-systems) and ensure that the VMs you will use for this guide are supported. For Linux VMs, check both the Linux distribution and kernel to ensure you are using a supported configuration.

## Prerequisites

* Clone this repo

    ```terminal
    git clone https://github.com/microsoft/azure_arc.git
    ```

* As mentioned, this guide starts at the point where you already deployed and connected VMs or servers to Azure Arc. In the screenshots below we can see a GCP server has been connected with Azure Arc and is visible as a resource in Azure.

    ![Screenshot Azure Arc enabled server on resource group](./01.png)

    ![Screenshot Azure Arc enabled server connected status](./02.png)

* [Install or update Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). Azure CLI should be running version 2.7** or later. Use ```az --version``` to check your current installed version.

* Create Azure service principal (SP)

    To connect a VM or bare-metal server to Azure Arc, Azure service principal assigned with the "contributor" role is required. To create it, login to your Azure account run the below command (this can also be done in [Azure Cloud Shell](https://shell.azure.com/)).

    ```console
    az login
    az ad sp create-for-rbac -n "<Unique SP Name>" --role contributor
    ```

    For example:

    ```console
    az ad sp create-for-rbac -n "http://AzureArcServers" --role contributor
    ```

    Output should look like this:

    ```json
    {
    "appId": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "displayName": "AzureArcServers",
    "name": "http://AzureArcServers",
    "password": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "tenant": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
    ```

  > **Note: It is optional but highly recommended to scope the SP to a specific [Azure subscription and resource group](https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest).**

* You will also need to have a Log Analytics workspace deployed. You can automate the deployment by editing the ARM template [parameters file](https://github.com/microsoft/azure_arc/blob/main/azure_arc_servers_jumpstart/policies/arm/log_analytics-template.parameters.json), provide a name and location for your workspace.

    ![Screenshot ARM template parameters file](./03.png)

  To deploy the ARM template, navigate to the [deployment folder](https://github.com/microsoft/azure_arc/tree/main/azure_arc_servers_jumpstart/policies/arm) and run the below command:

  ```console
    az deployment group create --resource-group <Name of the Azure resource group> \
    --template-file <The *log_analytics-template.json* template file location> \
    --parameters <The *log_analytics-template.parameters.json* template file location>
  ```

## Azure Policies on Azure Arc connected machines

* Now that you have all the prerequisites set, you can assign policies to our Arc connected machines. Edit the [parameters file](https://github.com/microsoft/azure_arc/blob/main/azure_arc_servers_jumpstart/policies/arm/policy.json) to provide your subscription ID as well as the Log Analytics workspace.

    ![Screenshot ARM template parameter file](./04.png)

  To start the deployment, use the below command:

  ```console
  az policy assignment create --name 'Enable Azure Monitor for VMs' \
  --scope '/subscriptions/<Your subscription ID>/resourceGroups/<Name of the Azure resource group>' \
  --policy-set-definition '55f3eceb-5573-4f18-9695-226972c6d74a' \
  -p <The *policy.json* template file location> \
  --assign-identity --location <Azure Region>
  ```

  The flag *policy-set-definition* points to the initiative "Enable Azure Monitor" definition ID.

* Once the initiative is assigned, it takes around 30 minutes for the assignment to be applied to the defined scope. After those 30 minutes, Azure Policy will start the evaluation cycle against the Azure Arc connected machine and recognize it as "Non-compliant" (since it still does not have the Log Analytics Agent configuration deployed). To check this, go to the Azure Arc connected Machine under the Policies section.

  ![Screenshot Azure Policy non-compliant](./05.png)

* Now, you will assign a remediation task to the non-compliant resource to put into a compliant state.

  ![Screenshot Azure Policy remediation task](./06.png)

* Under 'Policy to remediate' choose '[Preview] Deploy Log Analytics Agent to Linux Azure Arc machines' and select 'Remediate'. This remediation task is instructing Azure Policy to run the deployIfNotExists effect and use the Azure Arc extension management capabilities to deploy the Log Analytics agent on the VM

  ![Screenshot Azure Policy remediation task](./07.png)

* Once you have assigned remediation task, the policy will be evaluated again and show that the server on GCP is compliant and that the Microsoft Monitoring Agent extension is installed on the Azure Arc machine.

  ![Screenshot remediation task configuration](./08.png)

  ![Screenshot Azure Policy compliant status](./09.png)

## Clean up environment

Complete the following steps to clean up your environment.

Remove the virtual machines from each environment by following the teardown instructions from each guide.

* **[GCP Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/gcp/gcp_terraform_ubuntu/_index.md) / [GCP Windows VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/gcp/gcp_terraform_windows/_index.md)**
* **[AWS Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/aws/aws_terraform_ubuntu/_index.md)**
* **[VMware Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vmware/vmware_terraform_ubuntu/_index.md) / [VMware Windows Server VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vmware/vmware_terraform_winsrv/_index.md)**
* **[Local Ubuntu VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vagrant/local_vagrant_ubuntu/_index.md) / [Local Windows VM](https://github.com/microsoft/azure_arc/blob/main/docs/azure_arc_jumpstart/azure_arc_servers/vagrant/local_vagrant_windows/_index.md)**

Remove the Azure Policy assignment by executing the following script in Azure CLI.

  ```console
  az policy assignment delete --name 'Enable Azure Monitor for VMs' --resource-group <resource_group>
  ```

Remove the Log Analytics workspace by executing the following script in Azure CLI. Provide the workspace name you used when creating the Log Analytics workspace.

  ```console
  az monitor log-analytics workspace delete --resource-group <Name of the Azure resource group> --workspace-name <Log Analytics workspace Name> --yes
  ```
