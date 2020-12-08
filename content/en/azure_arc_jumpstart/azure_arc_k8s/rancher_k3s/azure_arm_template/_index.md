---
type: docs
title: "Deploy Rancher k3s on an Azure VM and connect it to Azure Arc using Azure ARM template"
linkTitle: "Deploy Rancher k3s on an Azure VM and connect it to Azure Arc using Azure ARM template"
weight: 1
description: >
---

## Deploy Rancher k3s on an Azure VM and connect it to Azure Arc using Azure ARM template

The following README will guide you on how to use the provided [Azure ARM Template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/overview) to deploy a "Ready to Go" Azure virtual machine installed with single-master Rancher K3s Kubernetes cluster and connected it as an Azure Arc cluster resource.

## Prerequisites

* Clone this repo

    ```terminal
    git clone https://github.com/microsoft/azure_arc.git
    ```

* [Install or update Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). **Azure CLI should be running version 2.7** or later. Use ```az --version``` to check your current installed version.

* Create Azure service principal (SP)

    To connect a Kubernetes cluster to Azure Arc, Azure service principal assigned with the "Contributor" role is required. To create it, login to your Azure account run the below command (this can also be done in [Azure Cloud Shell](https://shell.azure.com/)).

    ```console
    az login
    az ad sp create-for-rbac -n "<Unique SP Name>" --role contributor
    ```

    For example:

    ```az ad sp create-for-rbac -n "http://AzureArcK8s" --role contributor```

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

* Enable subscription for two providers for Azure Arc enabled Kubernetes.
  
  ```console
  az provider register --namespace Microsoft.Kubernetes
  az provider register --namespace Microsoft.KubernetesConfiguration
  ```

  You can monitor the registration process with the following commands:

  ```console
  az provider show -n Microsoft.Kubernetes -o table
  az provider show -n Microsoft.KubernetesConfiguration -o table
  ```

## Deployment

The deployment is using the template parameters file. Before initiating the deployment, edit the [*azuredeploy.parameters.json*](https://github.com/microsoft/azure_arc/blob/main/azure_arc_k8s_jumpstart/rancher_k3s/azure/arm_template/azuredeploy.parameters.json) file to include the OS username and password as well as the appId, password and tenant generated from the service principal creation.  

* To deploy the ARM template, navigate to the [deployment folder](https://github.com/microsoft/azure_arc/tree/main/azure_arc_k8s_jumpstart/rancher_k3s/azure/arm_template) and run the below command:

  ```console
    az group create --name <Name of the Azure resource group> --location <Azure Region>
    az deployment group create \
    --resource-group <Name of the Azure resource group> \
    --name <The name of this deployment> \
    --template-uri https://raw.githubusercontent.com/microsoft/azure_arc/main/azure_arc_k8s_jumpstart/rancher_k3s/azure/arm_template/azuredeploy.json \
    --parameters <The *azuredeploy.parameters.json* parameters file location>
  ```

  For example:

  ```console
    az group create --name Arc-K3s-Demo --location "East US"
    az deployment group create \
    --resource-group Arc-K3s-Demo \
    --name arck3sdemo01 \
    --template-uri https://raw.githubusercontent.com/microsoft/azure_arc/main/azure_arc_k8s_jumpstart/rancher_k3s/azure/arm_template/azuredeploy.json \
    --parameters azuredeploy.parameters.json
  ```

  Upon completion, you will have new VM installed as a single-host k3s cluster which is already projected as an Azure Arc enabled Kubernetes cluster in a new resource group.

  ![Azure resource group](./01.png)

## K3s External Access

Traefik is the (default) ingress controller for k3s and uses port 80. To test external access to k3s cluster, an "*hello-world*" deployment was for you and it is included in the *home* directory [(credit)](https://github.com/paulbouwer/hello-kubernetes).

* Since port 80 is taken by Traefik [(read more about here)](https://github.com/rancher/k3s/issues/436), the deployment LoadBalancer was changed to use port 32323 along side with the matching Azure Network Security Group (NSG).

  ![Azure Network Security Group (NSG) rule](./02.png)

  ![hello-kubernetes.yaml file](./03.png)

* To deploy it, use the ```kubectl apply -f hello-kubernetes.yaml``` command. Run ```kubectl get pods``` and ```kubectl get svc``` to check that the pods and the service has been created.

  ![kubectl apply -f hello-kubernetes.yaml command](./04.png)

  ![kubectl get pods command](./05.png)

  ![kubectl get svc command](./06.png)

* In your browser, enter the *cluster_public_ip:3232* which will bring up the *hello-world* application.

  ![hello-kubernetes application in a web browser](./07.png)

## Delete the deployment

To delete environment, simply just delete the Azure resource group.

![Delete Azure resource group](./08.png)
