export default {
  name: 'userFavs',
  title: 'User Favourite Coins',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: { type: 'user' }
    },
    {
      title: 'Coins',
      name: 'coins',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type:'crypto' }
        }
      ]
    }
  ]
};