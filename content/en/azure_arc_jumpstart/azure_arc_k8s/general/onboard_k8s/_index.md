---
type: docs
title: "Connect an existing Kubernetes cluster to Azure Arc"
linkTitle: "Connect an existing Kubernetes cluster to Azure Arc"
weight: 1
description: >
---

## Connect an existing Kubernetes cluster to Azure Arc

The following README will guide you on how to connect an existing Kubernetes cluster to Azure Arc using a simple shell script.

## Prerequisites

* Make sure your *kubeconfig* file is configured properly and you are working against your [k8s cluster context](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

* (Optional) To simplify work against multiple k8s contexts, consider using [kubectx](https://github.com/ahmetb/kubectx).

* [Install or update Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). **Azure CLI should be running version 2.7** or later. Use ```az --version``` to check your current installed version.

* [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

* [Install Helm 3](https://helm.sh/docs/intro/install/). If you are on a Windows environment, a recommended and easy way is to use the [Helm 3 Chocolatey package](https://chocolatey.org/packages/kubernetes-helm).

* Create Azure service principal (SP)

    To connect a Kubernetes cluster to Azure Arc, Azure service principal assigned with the "Contributor" role is required. To create it, login to your Azure account run the below command (this can also be done in [Azure Cloud Shell](https://shell.azure.com/)).

    ```console
    az login
    az ad sp create-for-rbac -n "<Unique SP Name>" --role contributor
    ```

    For example:

    ```console
    az ad sp create-for-rbac -n "http://AzureArcK8s" --role contributor
    ```

    Output should look like this:

    ```json
    {
    "appId": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "displayName": "AzureArcK8s",
    "name": "http://AzureArcK8s",
    "password": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "tenant": "XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
    ```

    > **Note: It is optional but highly recommended to scope the SP to a specific [Azure subscription and resource group](https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest)**

* Enable subscription for two providers for Azure Arc enabled Kubernetes. Registration is an asynchronous process, and registration may take approximately 10 minutes.

  ```console
  az provider register --namespace Microsoft.Kubernetes
  ```

  ```console
  az provider register --namespace Microsoft.KubernetesConfiguration
  ```

  Registration is still on-going. You can monitor using ```az provider show -n Microsoft.KubernetesConfiguration```. You can monitor the registration process with the following commands:
  
  ```console
  az provider show -n Microsoft.Kubernetes -o table
  az provider show -n Microsoft.KubernetesConfiguration -o table
  ```

* Create a new Azure resource group where you want your cluster(s) to show up.

  ```console
  az group create -l <Azure Region> -n <resource group name>
  ```

  For example:

  ```console
  az group create -l eastus -n Arc-k8s-Clusters
  ```

  > **Note: Currently, Azure Arc enabled Kubernetes resource creation is supported only in the following locations: eastus, westeurope. Use the --location (or -l) flag to specify one of these locations.**

  ![Screenshot showing Azure Portal with empty resource group](./01.png)

* Change the following environment variables according to your Azure service principal name and Azure environment.

  If using shell:

  ```console
  export appId='<Your Azure service principal name>'
  export password='<Your Azure service principal password>'
  export tenantId='<Your Azure tenant ID>'
  export resourceGroup='<Azure resource group name>'
  export arcClusterName='<The name of your k8s cluster as it will be shown in Azure Arc>'
  ```

  If using PowerShell:

  ```powershell
  $env:appId=<Your Azure service principal name>
  $env:password=<Your Azure service principal password>
  $env:tenantId=<Your Azure tenant ID>
  $env:resourceGroup=<Azure resource group name>
  $env:arcClusterName=<The name of your k8s cluster as it will be shown in Azure Arc>
  ```

## Deployment

* Install the Azure Arc for Kubernetes CLI extensions ***connectedk8s*** and ***k8sconfiguration***:

  ```console
  az extension add --name connectedk8s
  az extension add --name k8sconfiguration
  ```

  > **Note: If you already used this guide before and/or have the extensions installed, use the ```az extension update --name connectedk8s``` and the ```az extension update --name k8sconfiguration``` commands.**

* Login to your Azure subscription using the SP you created.  

  If using shell:

  ```console
  az login --service-principal --username $appId --password $password --tenant $tenantId
  ```

  If using PowerShell:

  ```powershell
  az login --service-principal --username $env:appId --password $env:password --tenant $env:tenantId
  ```

* If you are working in a Linux OS or MacOS environment, make sure you are the owner of the following:

  ```console
  sudo chown -R $USER /home/${USER}/.kube
  sudo chown -R $USER /home/${USER}/.kube/config
  sudo chown -R $USER /home/${USER}/.azure/config
  sudo chown -R $USER /home/${USER}/.azure
  sudo chmod -R 777 /home/${USER}/.azure/config
  sudo chmod -R 777 /home/${USER}/.azure
  ```

* To connect the Kubernetes cluster to Azure Arc use the below command.

  If using shell:

  ```console
  az connectedk8s connect --name $arcClusterName --resource-group $resourceGroup
  ```

  If using PowerShell:

  ```powershell
  az connectedk8s connect --name $env:arcClusterName --resource-group $env:resourceGroup
  ```

Upon completion, you will have your Kubernetes cluster, connected as a new Azure Arc enabled Kubernetes resource inside your resource group.

![Screenshot showing Azure ARM template deployment](./02.png)

![Screenshot showing Azure Portal with Azure Arc enabled Kubernetes resource](./03.png)

![Screenshot showing Azure Portal with Azure Arc enabled Kubernetes resource](./04.png)

## Delete the deployment

The most straightforward way is to delete the Azure Arc enabled Kubernetes resource is via the Azure Portal, just select cluster and delete it.

![Screenshot showing how to delete resources in Azure Portal](./05.png)

If you want to delete the entire environment, just delete the Azure resource group.

![Screenshot showing how to delete resource groups in Azure Portal](./06.png)
