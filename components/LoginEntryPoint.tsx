import React from 'react';
import styles from '../styles/Home.module.css';
import { LoginMethod } from '../lib/types';
import StytchContainer from './StytchContainer';
import Image from 'next/image';
import fauna from '../public/fauna.svg';

type Props = {
  setLoginMethod: (loginMethod: LoginMethod) => void;
};

const LoginEntryPoint = (props: Props) => {
  const { setLoginMethod } = props;
  return (
    <StytchContainer>
      <h2>Hello world!</h2>
      <p className={styles.entrySubHeader}>
        This example app demonstrates how you can 
        integrate with Stytch using Next.js and Fauna
        <a className={styles.fauna} href="https://fauna.com/" target="_blank" rel="noreferrer">
          <Image alt="Fauna" height={20} src={fauna} width={50} />
        </a>
        as your Database. 
        Now, let’s get started!
      </p>
      <button className={styles.entryButton} onClick={() => setLoginMethod(LoginMethod.SDK)}>
        SDK Integration (Email magic links)
      </button>
    </StytchContainer>
  );
};

export default LoginEntryPoint;
