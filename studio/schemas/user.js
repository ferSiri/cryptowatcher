export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string'
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string'
    },
    {
      name: 'password',
      type: 'string',
      hidden: true
    },
    {
        name: 'isAdmin',
        title: 'Is Admin',
        type: 'boolean'
    }
  ]
};