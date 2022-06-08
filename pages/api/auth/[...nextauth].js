
import NextAuth, { NextAuthOptions } from 'next-auth';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import { client } from '../../../lib/sanity';

const options = {
  providers: [
    SanityCredentials(client)
  ],
  session: {
    strategy: 'jwt'
  },
  secret: 'any-secret-word',
  adapter: SanityAdapter(client)
};

export default NextAuth(options);