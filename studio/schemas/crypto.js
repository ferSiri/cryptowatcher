export default {
  name: 'crypto',
  title: 'Crypto',
  type: 'document',
  fields: [
    {
      name: 'cryptoName',
      title: 'Crypto Name',
      type: 'string',
    },
    {
      name: 'internalId',
      title: 'Internal Id',
      type: 'string'
    },
    {
      name: 'canBeSaved',
      title: 'Allow save',
      type: 'boolean'
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image'
    }
  ]
}
