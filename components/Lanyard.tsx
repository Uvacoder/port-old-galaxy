import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useLanyard } from 'use-lanyard'
import styles from './Lanyard.module.scss'

export default function Lanyard() {
  const { data: activity } = useLanyard('182292736790102017');

  const [spotifyFormattedTimestamp, setSpotifyFormattedTimestamp] = useState('0:00 / 0:00');
  const [formattedTimestamp, setFormattedTimestamp] = useState('');

  const [intervalCheck, setIntervalCheck] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if(activity !== undefined && activity.listening_to_spotify) {
        const current = Math.floor((Date.now() - activity.spotify.timestamps.start) / 1000);
        const currentFormatted = `${Math.floor(current / 60)}:${Math.floor(current % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    
        const endTime = Math.floor((activity.spotify.timestamps.end - activity.spotify.timestamps.start) / 1000);
        const endFormatted = `${Math.floor(endTime / 60)}:${Math.floor(endTime % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    
        setSpotifyFormattedTimestamp(`${currentFormatted} / ${endFormatted}`);
      }
  
      if(activity !== undefined && activity.activities.find(act => act.type === 0) !== undefined && activity.activities.find(act => act.type === 0).timestamps.start !== undefined){
        const current = Math.floor((Date.now() - activity.activities.find(act => act.type === 0).timestamps.start) / 1000);
        const currentFormatted = `${Math.floor(current / 60) >= 60 ? `${Math.floor(Math.floor(current / 60) / 60)}:` : ``}${Math.floor(Math.floor(current / 60) - (Math.floor(Math.floor(current / 60) / 60)*60))}:${Math.floor(current % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
  
        setFormattedTimestamp(`${currentFormatted} elapsed`);
      }
      setIntervalCheck(intervalCheck + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [intervalCheck]);

  function getDiscordAssetURL(application, asset) {
    return `https://cdn.discordapp.com/app-assets/${application}/${asset}.png`
  }

  const TRANSPARENT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const WHITELISTED_GAMES = ['Visual Studio Code'];

  if (activity !== undefined && activity.activities.find(act => act.type === 0) !== undefined && WHITELISTED_GAMES.includes(activity.activities.find(act => act.type === 0).name)) {
    return (
      <>
        <div className={styles.activity}>
          <Row>
            <ImageContainer>
              <img className={styles.primaryImage}
                src={ activity.activities.find(act => act.type === 0).assets.large_image !== undefined ? getDiscordAssetURL(activity.activities.find(act => act.type === 0).application_id, activity.activities.find(act => act.type === 0).assets.large_image) : TRANSPARENT_IMAGE }
                alt={ activity.activities.find(act => act.type === 0).assets.large_text !== undefined ? activity.activities.find(act => act.type === 0).assets.large_text : '' }
                width={60}
                height={60}
              />
              <img className={styles.secondaryImage}
                src={ activity.activities.find(act => act.type === 0).assets.small_image !== undefined ? getDiscordAssetURL(activity.activities.find(act => act.type === 0).application_id, activity.activities.find(act => act.type === 0).assets.small_image) : TRANSPARENT_IMAGE }
                alt={ activity.activities.find(act => act.type === 0).assets.small_text !== undefined ? activity.activities.find(act => act.type === 0).assets.small_text : '' }
                width={20}
                height={20}
              />
            </ImageContainer>
            <InfoContainer>
              <Info><h5>{activity.activities.find(act => act.type === 0).name}</h5></Info>
              <Info>{activity.activities.find(act => act.type === 0).details && <p>{activity.activities.find(act => act.type === 0).details}</p>}</Info>
              <Info>{activity.activities.find(act => act.type === 0).state && <p>{activity.activities.find(act => act.type === 0).state}</p>}</Info>
              <Info><p>{formattedTimestamp}</p></Info>
            </InfoContainer>
          </Row>
        </div>
      </>
    )
  } else if (activity !== undefined && activity.listening_to_spotify) {
    return (
      <>
        <div className={styles.activitySpotify}>
          <Row>
            <ImageContainer>
              <img className={styles.primaryImage}
                src={ activity.listening_to_spotify ? activity.spotify.album_art_url : '' }
                width={60}
                height={60}
              />
            </ImageContainer>
            <InfoContainer>
              <Info>{activity.spotify.song && <h5>{activity.spotify.song}</h5>}</Info>
              <Info>{activity.spotify.artist && <p>{activity.spotify.artist.replaceAll(';', ',')}</p>}</Info>
              <Info>{activity.spotify.album && <p>{activity.spotify.album}</p>}</Info>
              <Info><p>{spotifyFormattedTimestamp}</p></Info>
            </InfoContainer>
          </Row>
        </div>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}

/**
 * Flexbox shamelessly taken from https://github.com/atn/astn.me
 */

const ImageContainer = styled.div`
  position: relative;
  height: 60px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Info = styled.div`
  margin-left: 1rem;
  text-align: left;
  h5 {
    margin: 0;
    font-size: 13px;
  }
  p {
    margin: 0;
    padding-top: 3px;
    font-size: 10px;
  }
`;