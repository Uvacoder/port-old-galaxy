import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Activity, useLanyard } from 'use-lanyard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons'
import Twemoji from 'react-twemoji'
import StatusLoader from './StatusLoader'
import styles from '../styles/Lanyard.module.scss'

export default function Lanyard() {
  const { data: activity } = useLanyard('182292736790102017');

  const [spotifyFormattedTimestamp, setSpotifyFormattedTimestamp] = useState('0:00 / 0:00');
  const [progressPercentage, setProgressPercentage] = useState('0%');

  const [intervalCheck, setIntervalCheck] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if(activity !== undefined && activity.listening_to_spotify && Date.now() <= activity.spotify.timestamps.end) {
        const current = Math.floor((Date.now() - activity.spotify.timestamps.start) / 1000);
        const currentFormatted = `${Math.floor(current / 60)}:${Math.floor(current % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    
        const endTime = Math.floor((activity.spotify.timestamps.end - activity.spotify.timestamps.start) / 1000);
        const endFormatted = `${Math.floor(endTime / 60)}:${Math.floor(endTime % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`;
    
        setSpotifyFormattedTimestamp(`${currentFormatted} / ${endFormatted}`);

        setProgressPercentage(`${((Date.now() - activity.spotify.timestamps.start) / (activity.spotify.timestamps.end - activity.spotify.timestamps.start)) * 100}%`);
      }
      setIntervalCheck(intervalCheck + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [intervalCheck]);

  function getFormattedTimestamp(start: number) {
    if ( start === 0 ) return '';
    const current = Math.floor((Date.now() - start) / 1000);
    return `${Math.floor(current / 60) >= 60 ? `${(Math.floor(Math.floor(current / 60) / 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:` : ``}${(Math.floor(Math.floor(current / 60) - (Math.floor(Math.floor(current / 60) / 60)*60))).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}:${Math.floor(current % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })} elapsed`;
  }

  function getDiscordAssetURL(application, asset) {
    return `https://cdn.discordapp.com/app-assets/${application}/${asset}.png`
  }

  function getLargeAssetOverride(name) {
    const LARGE_ASSET_OVERRIDES = {
      VALORANT: 'https://cdn.discordapp.com/app-icons/700136079562375258/e55fc8259df1548328f977d302779ab7'
    }

    return LARGE_ASSET_OVERRIDES[name] ? LARGE_ASSET_OVERRIDES[name] : undefined
  }

  const TRANSPARENT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const BLACKLISTED_GAMES = [];

  function DiscordEmoji({id, animated}) {
    return <img className='emoji' width={20} src={`https://cdn.discordapp.com/emojis/${id}${animated ? '.gif' : '.png'}`} />
  }

  function LanyardUserInfoStatus() {
    if ( activity.discord_status === 'dnd' ) {
      return (
        <>
          <DndCircle className={styles.secondaryImageOutline} />
        </>
      )
    } else if ( activity.active_on_discord_desktop ) {
      return (
        <>
          <OnlineCircle className={styles.secondaryImageOutline} />
        </>
      )
    } else if ( activity.active_on_discord_mobile ) {
      return (
        <>
          <OnlineMobile className={styles.secondaryImageMobile} ><FontAwesomeIcon icon={faMobileAlt} /></OnlineMobile>
        </>
      )
    } else { 
      return (
        <>
          <OfflineCircle className={styles.secondaryImageOutline} />
        </>
      )
    }
  }

  function LanyardUserInfo() {
    return (
      <>
        <Row style={{paddingBottom: '8px'}}>
          <ImageContainer>
            <img className={styles.avatarImage}
              src={ `https://cdn.discordapp.com/avatars/${activity.discord_user.id}/${activity.discord_user.avatar}${activity.discord_user.avatar.startsWith('a_') ? '.gif' : '.png' }` }
              alt={ `${activity.discord_user.id}#${activity.discord_user.discriminator}` }
              width={60}
              height={60}
            />
            <LanyardUserInfoStatus />
          </ImageContainer>
        </Row>
        <Row style={ activity.activities.length > 0 ? {paddingBottom: '16px'} : {}}>
          <Info style={{padding: 0, margin: 0}}><h3>{ activity.discord_user.username }<span style={{color: '#b9bbbe'}}>#{ activity.discord_user.discriminator }</span></h3></Info>
        </Row>
      </>
    )
  }

  function LanyardUserActivity(activityData: Activity, index) {
    switch(activityData.type) {
      case 0: {
        return (
          <>
            <Row>
              <ActivityHeader>PLAYING A GAME</ActivityHeader>
            </Row>
            <Row style={ index < (activity.activities.length - 1) ? {paddingBottom: '16px'} : {} }>
              <ImageContainer>
                <img className={styles.primaryImage}
                  src={ activityData.assets && activityData.assets.large_image !== undefined ? getDiscordAssetURL(activityData.application_id, activityData.assets.large_image) : getLargeAssetOverride(activityData.name) ? getLargeAssetOverride(activityData.name) : TRANSPARENT_IMAGE }
                  alt={ activityData.assets && activityData.assets.large_text !== undefined ? activityData.assets.large_text : '' }
                  width={60}
                  height={60}
                />
                <img className={styles.secondaryImageOutline}
                  src={ activityData.assets && activityData.assets.small_image !== undefined ? getDiscordAssetURL(activityData.application_id, activityData.assets.small_image) : TRANSPARENT_IMAGE }
                  alt={ activityData.assets && activityData.assets.small_text !== undefined ? activityData.assets.small_text : '' }
                  width={20}
                  height={20}
                />
              </ImageContainer>
              <InfoContainer>
                <Info><h5>{activityData.name}</h5></Info>
                <Info>{activityData.details && <p>{activityData.details}</p>}</Info>
                <Info>{activityData.state && <p>{activityData.state}</p>}</Info>
                <Info><p>{getFormattedTimestamp(activityData.timestamps.start ? activityData.timestamps.start : 0)}</p></Info>
              </InfoContainer>
            </Row>
          </>
        )
      }
      case 2: {
        return (
          <>
            <Row>
              <ActivityHeader>LISTENING TO SPOTIFY</ActivityHeader>
            </Row>
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
                <Info>{activity.spotify.artist && <p>by {activity.spotify.artist.replaceAll(';', ',')}</p>}</Info>
                <Info>{activity.spotify.album && <p>on {activity.spotify.album}</p>}</Info>
                <Info></Info>
              </InfoContainer>
            </Row>
            <Row style={ index < (activity.activities.length - 1) ? {paddingBottom: '16px'} : {} }>
              <ProgressContainer>
                <ProgressBackground>
                  <ProgressForeground style={{width: progressPercentage}} />
                </ProgressBackground>
                <TimestampContainer>
                  <p>{spotifyFormattedTimestamp.split(' / ')[0]}</p>
                  <p>{spotifyFormattedTimestamp.split(' / ')[1]}</p>
                </TimestampContainer>
              </ProgressContainer>
            </Row>
          </>
        )
      }
      case 4: {
        if ( activityData.emoji.id ) {
          return (
            <>
              <Row>
                <ActivityHeader style={{fontWeight: 400, display: 'flex', alignItems: 'center'}}><DiscordEmoji id={activityData.emoji.id} animated={activityData.emoji.animated} />{activityData.state}</ActivityHeader>
              </Row>
            </>
          )
        } else {
          return (
            <>
              <Row>
                <ActivityHeader style={{fontWeight: 400}}><Twemoji style={{display: 'flex', alignItems: 'center'}}>{activityData.emoji ? activityData.emoji.name : ''}{activityData.state}</Twemoji></ActivityHeader>
              </Row>
            </>
          )
        }
      }
    }
  }

  if (activity !== undefined) {
    return (
      <>
        <div className={styles.activity}>
          <LanyardUserInfo />
          { activity.activities.map((x, index) => LanyardUserActivity(x, index)) }
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className={styles.activityLoader}>
          <StatusLoader />
        </div>
      </>
    )
  }
}

/**
 * Flexbox shamelessly taken from https://github.com/atn/astn.me
 */

const ActivityHeader = styled.h6`
  margin-bottom: 8px;
  margin-top: 0;
  font-size: 12px;
  color: #b9bbbe;
`;

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
  min-width: 0;
`;

const Info = styled.div`
  margin-left: 1rem;
  text-align: left;
  h5 {
    margin: 0;
    font-size: 13px;
    
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  h3 {
    margin: 0;
    font-size: 20px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  p {
    margin: 0;
    padding-top: 3px;
    font-size: 10px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  margin-left: 0rem;
  text-align: left;
  h5 {
    margin: 0;
    font-size: 13px;
    
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  p {
    margin: 0;
    padding-top: 3px;
    font-size: 10px;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ProgressBackground = styled.div`
  background-color: rgba(200, 200, 200, 0.3);
  height: 5px;
  border-radius: 5px;
`;

const ProgressForeground = styled.div`
  background-color: #dcddde;
  height: 100%;
  border-radius: 5px;
`;

const TimestampContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OnlineCircle = styled.div`
  height: 25px;
  width: 25px;
  border-radius:50%;
  background-color: rgb(28, 176, 80);
  display: inline-block;
  border: 5px solid #161616;
`;

const DndCircle = styled.div`
  height: 25px;
  width: 25px;
  border-radius:50%;
  background-color: #f04747;
  display: inline-block;
  border: 5px solid #161616;
`;

const OfflineCircle = styled.div`
  height: 25px;
  width: 25px;
  border-radius:50%;
  background-color: #747f8d;
  display: inline-block;
  border: 5px solid #161616;
`;

const OnlineMobile = styled.div`
  display: inline-block;
  color: rgb(28, 176, 80);
`;