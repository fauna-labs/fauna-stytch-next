// This API route authenticates a Stytch magic link.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';
import { 
  Client,
  Match, 
  Index, 
  Get, 
  Create,
  Tokens,
  Ref,
  Collection, 
} from 'faunadb';
type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  error: string;
};

type Token = {
  ref: any;
  ts: number;
  data: {
    type: string;
  }
  secret: string;
}

export async function handler(req: NextIronRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const client = loadStytch();
    const { token } = req.query;
    try {
      const resp = await client.magicLinks.authenticate(token as string);
      const faunaToken = await generateFaunaToken(resp.user_id);
      console.log('faunaToken', faunaToken)

      // Set session
      req.session.destroy();
      req.session.set('user', {
        id: resp.user_id,
        fauna_access_token: faunaToken,
      });
      // Save additional user data here
      await req.session.save();
      res.redirect('/profile');
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error as string });
    }
  } else {
    // Handle any other HTTP method
  }
}

async function generateFaunaToken(stytchUserId: string) {
  try {
    const faunaClient = new Client({ secret: process.env.FAUNA_SERVER_KEY as string });
    const userfromDB: any = await faunaClient.query(
      Get(
        Match(Index('user_by_id'), stytchUserId)
      )
    );
    const token: Token = await faunaClient.query(
      Create(Tokens(), {
        instance: Ref(Collection("User"), userfromDB.ref.id),
        data: {
          type: "access"
        }
      })
    );
    return token.secret as string;
  } catch (error) {
    console.log(error);
  }
}

export default withSession(handler);

