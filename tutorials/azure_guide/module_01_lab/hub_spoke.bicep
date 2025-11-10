@description('Prefix for resource names')
param prefix string = 'm1hub'
param location string = 'eastus'

var hubVnetPrefix = '10.100.0.0/16'
var spoke1Prefix = '10.101.0.0/16'
var spoke2Prefix = '10.102.0.0/16'

resource hubVnet 'Microsoft.Network/virtualNetworks@2020-11-01' = {
  name: '${prefix}-hub-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [ hubVnetPrefix ]
    }
    subnets: [
      {
        name: 'AzureFirewallSubnet'
        properties: {
          addressPrefix: '10.100.1.0/24'
        }
      }
      {
        name: 'hub-gateway'
        properties: {
          addressPrefix: '10.100.2.0/24'
        }
      }
    ]
  }
}

resource spoke1 'Microsoft.Network/virtualNetworks@2020-11-01' = {
  name: '${prefix}-spoke1-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [ spoke1Prefix ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.101.0.0/24'
        }
      }
    ]
  }
}

resource spoke2 'Microsoft.Network/virtualNetworks@2020-11-01' = {
  name: '${prefix}-spoke2-vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [ spoke2Prefix ]
    }
    subnets: [
      {
        name: 'default'
        properties: {
          addressPrefix: '10.102.0.0/24'
        }
      }
    ]
  }
}

// vNet peering: hub <-> spoke1
resource hubToSpoke1 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-11-01' = {
  name: '${hubVnet.name}/hub-to-spoke1'
  properties: {
    remoteVirtualNetwork: {
      id: spoke1.id
    }
    allowVirtualNetworkAccess: true
    allowForwardedTraffic: false
    allowGatewayTransit: false
    useRemoteGateways: false
  }
}

// vNet peering: spoke1 -> hub
resource spoke1ToHub 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-11-01' = {
  name: '${spoke1.name}/spoke1-to-hub'
  properties: {
    remoteVirtualNetwork: {
      id: hubVnet.id
    }
    allowVirtualNetworkAccess: true
    allowForwardedTraffic: false
  }
}

// vNet peering: hub <-> spoke2
resource hubToSpoke2 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-11-01' = {
  name: '${hubVnet.name}/hub-to-spoke2'
  properties: {
    remoteVirtualNetwork: {
      id: spoke2.id
    }
    allowVirtualNetworkAccess: true
  }
}

resource spoke2ToHub 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2020-11-01' = {
  name: '${spoke2.name}/spoke2-to-hub'
  properties: {
    remoteVirtualNetwork: {
      id: hubVnet.id
    }
    allowVirtualNetworkAccess: true
  }
}

output hubVnetId string = hubVnet.id
output spoke1Id string = spoke1.id
output spoke2Id string = spoke2.id
