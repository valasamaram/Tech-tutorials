@description('Prefix for resource names')
param prefix string = 'm1lab'
@minLength(3)
param adminUsername string
@secure()
param adminPasswordOrKey string
param location string = resourceGroup().location

var vmSku = 'Standard_DS1_v2'
var instanceCount = 2

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = if(false) {}

resource lb 'Microsoft.Network/loadBalancers@2020-11-01' = {
  name: '${prefix}-lb'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    frontendIPConfigurations: [
      {
        name: 'LoadBalancerFront'
        properties: {
          subnet: null
        }
      }
    ]
    backendAddressPools: [
      {
        name: 'bePool'
      }
    ]
    loadBalancingRules: [
      {
        name: 'httpRule'
        properties: {
          frontendIPConfiguration: {
            id: resourceId('Microsoft.Network/loadBalancers/frontendIPConfigurations', lb.name, 'LoadBalancerFront')
          }
          backendAddressPool: {
            id: resourceId('Microsoft.Network/loadBalancers/backendAddressPools', lb.name, 'bePool')
          }
          protocol: 'Tcp'
          frontendPort: 80
          backendPort: 80
          enableFloatingIP: false
          idleTimeoutInMinutes: 4
          probe: {
            id: resourceId('Microsoft.Network/loadBalancers/probes', lb.name, 'httpProbe')
          }
        }
      }
    ]
    probes: [
      {
        name: 'httpProbe'
        properties: {
          protocol: 'Http'
          port: 80
          requestPath: '/'
          intervalInSeconds: 5
          numberOfProbes: 2
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2020-11-01' = {
  name: '${prefix}-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [ '10.1.0.0/16' ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.1.0.0/24'
        }
      }
    ]
  }
}

resource nicConfig 'Microsoft.Compute/virtualMachineScaleSets@2021-07-01' = {
  name: '${prefix}-vmss'
  location: location
  sku: {
    name: vmSku
    capacity: instanceCount
  }
  properties: {
    upgradePolicy: {
      mode: 'Manual'
    }
    virtualMachineProfile: {
      storageProfile: {
        imageReference: {
          publisher: 'Canonical'
          offer: 'UbuntuServer'
          sku: '18.04-LTS'
          version: 'latest'
        }
      }
      osProfile: {
        adminUsername: adminUsername
        adminPassword: adminPasswordOrKey
        computerNamePrefix: '${prefix}-vm'
      }
      networkProfile: {
        networkInterfaceConfigurations: [
          {
            name: '${prefix}-nic'
            properties: {
              primary: true
              ipConfigurations: [
                {
                  name: 'ipconfig'
                  properties: {
                    subnet: {
                      id: vnet::subnets[0].id
                    }
                    loadBalancerBackendAddressPools: [
                      {
                        id: lb::backendAddressPools[0].id
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
    virtualMachineScaleSetNetworkConfigurations: []
  }
}

output vmssName string = nicConfig.name
output loadBalancerName string = lb.name
