import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import withSession, { ServerSideProps } from '../lib/withSession';
import { useRouter } from 'next/router';
import { Client, Collection, Documents, Get, Lambda, Map, Paginate } from 'faunadb';

type Props = {
  user?: {
    id: string;
    fauna_access_token?: string
  };
};

const Profile = (props: Props) => {
  const { user } = props;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  });

  const signOut = async () => {
    const resp = await fetch('/api/logout', { method: 'POST' });
    if (resp.status === 200) {
      router.push('/');
    }
  };

  const queryData = async () => {
    try {
      const faunaClient = new Client({ secret: user?.fauna_access_token as string });
      const movies: any = await faunaClient.query(
        Map(
          Paginate(Documents(Collection('Movie'))),
          Lambda(x => Get(x))
        )
      );
      console.log(movies);
    } catch (error) {
      console.log('Error', error);
    }
  }

  return (
    <>
      {!user ? (
        <div />
      ) : (
        <StytchContainer>
          <h2>{'Welcome!'}</h2>
          <p className={styles.profileSubHeader}>Thank you for using Stytch! Here’s your user info.</p>
          <pre className={styles.code}>{JSON.stringify(user, null, 1).replace(' ', '')}</pre>
          <button className={styles.primaryButton} onClick={signOut}>
            Sign out
          </button>

          <button className={styles.queryBtn} onClick={queryData}>
            Query Data
          </button>
        </StytchContainer>
      )}
    </>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  const user = req.session.get('user') ?? null;
  const props: Props = { user };
  return { props };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);

export default Profile;
