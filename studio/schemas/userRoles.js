export default {
  name: 'userRoles',
  title: 'User Roles',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: { type: 'user' }
    },
    {
      name: 'role',
      title: 'Role',
      type: 'reference',
      to: { type: 'role' }
    },
  ]
};