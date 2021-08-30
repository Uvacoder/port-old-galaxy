import Head from 'next/head'
import { useState, useEffect } from 'react'

import styles from '../styles/Tab.module.scss'
import Lanyard from '../components/Lanyard'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function getName(): string {
  if (typeof window == 'undefined') return;
  if (new URLSearchParams(window.location.search).get('name'))
    return new URLSearchParams(window.location.search).get('name');
  if (!localStorage.getItem('igalaxy_newtab_name'))
    localStorage.setItem('igalaxy_newtab_name', 'William');
  return localStorage.getItem('igalaxy_newtab_name');
}

function getDiscordID(): string {
  if (typeof window == 'undefined') return;
  if (new URLSearchParams(window.location.search).get('discordId'))
    return new URLSearchParams(window.location.search).get('discordId');
  if (!localStorage.getItem('igalaxy_newtab_discord_id'))
    localStorage.setItem('igalaxy_newtab_discord_id', '182292736790102017');
  return localStorage.getItem('igalaxy_newtab_discord_id');
}

export default function Tab() {
  const [greeting, setGreeting] = useState(
    new Date().getHours() >= 12 && new Date().getHours() < 18
      ? 'Good afternoon'
      : new Date().getHours() < 12
      ? 'Good morning'
      : 'Good evening'
  );

  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [date, setDate] = useState(DAYS[new Date().getDay().toString()]);

  useEffect(() => {
    const int = setInterval(() => {
      const currentDate = new Date();

      setDate(DAYS[currentDate.getDay().toString()]);
      setTime(
        currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setGreeting(
        currentDate.getHours() >= 12 && new Date().getHours() < 18
        ? 'Good afternoon'
        : new Date().getHours() < 12
        ? 'Good morning'
        : 'Good evening'
      );

    }, 1000);

    return () => {
      clearInterval(int);
    };
  }, []);

  return (
    <>
      <Head>
        <title>New Tab</title>
        <link rel='icon' href='/none.ico'/>
      </Head>

      <div className={styles.tabBackground}>
        <div></div>
        <div className={styles.bottomContainer}>
          <Lanyard discordId={getDiscordID()} newTab={true} />
          <div className={styles.greetingContainer}>
            <h1 className={styles.greetingPrimary}>
              {greeting}, {getName()}.
            </h1>
            <h2 className={styles.greetingSecondary}>
              {date} • {time}
            </h2>
          </div>
        </div>
      </div>
    </>
  )
}