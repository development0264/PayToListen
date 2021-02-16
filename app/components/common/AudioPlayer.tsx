import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Player from 'react-player';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import Draggable from 'react-draggable';

import {
  PlayerState,
  actions as playerActions,
} from '../../../redux/reducers/PlayerReducer';
import { RootState } from '../../../redux/reducers/RootReducer';
import { secondsToString } from '../../../utils/services';
import { ArticleInitialState } from '../../../model/SearchModel';

const AudioPlayer = (): JSX.Element => {
  const player = useRef(null);
  const dispatch = useDispatch();
  const handle = useFullScreenHandle();
  const articleSelector = (state: RootState): ArticleInitialState =>
    state.article;
  const articleState = useSelector(articleSelector);
  const playerState = useSelector(
    (state: { player: PlayerState }) => state.player
  );
  const {
    songs,
    currentIndex,
    shuffle,
    playing,
    isMiniPlayer,
    repeat,
    showPlayer,
  } = playerState;
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mediaUrl, setMediaUrl] = useState('');
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const url = songs[currentIndex]?.streamUrl;
    if (url) {
      setMediaUrl(url);
      //   setMediaUrl(
      //     !url.split('/').slice(-1)[0].includes('media')
      //       ? url.replace(/(\.mp3|\.mp4)/, '/media$1')
      //       : url
      //   );
    }
  }, [songs[currentIndex]?.streamUrl]);

  const togglePlayer = (): void => {
    if (songs[currentIndex]?.type === 'video') {
      dispatch(playerActions.togglePlayer);
    }
  };

  useEffect(() => {
    if (songs[currentIndex]?.type === 'audio' && !isMiniPlayer) {
      dispatch(playerActions.togglePlayer);
    }
  }, [currentIndex]);

  const togglePlay = (): void => {
    dispatch(playerActions.pauseSong);
  };

  const playPrevious = (): void => {
    dispatch(playerActions.playPrevious);
  };
  const playNext = (): void => {
    dispatch(playerActions.playNext);
  };

  const handleSeekMouseDown = (e): void => {
    console.log('Mouse down...', e.target.value);
  };
  const handleSeekChange = (e): void => {
    setPlayed(e.target.value);
    if (player.current) {
      if (player.current?.currentTime !== undefined) {
        player.current.seekTo(e.target.value);
      } else {
        player.current.currentTime = e.target.value;
      }
    }
  };
  const handleSeekMouseUp = (e): void => {
    console.log('Mouse up...', e.target.value);
  };

  const handleProgress = (e): void => {
    setPlayedSeconds(e.playedSeconds);
    setPlayed(e.played);
  };
  const handleDuration = (e): void => {
    if (e !== Infinity) {
      setDuration(e);
    } else {
      setDuration(songs[currentIndex]?.duration);
    }
  };
  const exitFullscreen = (): void => {
    setFullscreen(false);
    if (handle?.active) {
      handle.exit();
    }
  };

  const handleEnd = (): void => {
    dispatch(playerActions.pauseSong);
    exitFullscreen();
    setTimeout(() => {
      dispatch(playerActions.pauseSong);
    }, 10);
    player.current.seekTo(0);
    playNext();
  };

  useEffect(() => {
    if (showControls) {
      setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  }, [showControls]);

  const toggleControls = (e: any): void => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      setShowControls(true);
    }, 100);
  };

  useEffect(() => {
    if (fullscreen) {
      handle.enter();
    } else {
      exitFullscreen();
    }
  }, [fullscreen]);

  const onExpand = (): void => {
    setFullscreen((s) => !s);
  };

  const onFullScreenChange = (state, handle): void => {
    if (state === false) {
      setFullscreen(false);
    }
  };

  const closePlayer = (): void => {
    dispatch(playerActions.closePlayer);
  };

  if (!isMiniPlayer) {
    return (
      <Modal
        show={!isMiniPlayer}
        onHide={togglePlayer}
        backdrop="static"
        dialogClassName="modal-40w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <MediaInfo>
              {/* <SongImage src={songs[currentIndex].image} alt="img" /> */}
              <InfoValue>{`${songs[currentIndex].title}`}</InfoValue>
            </MediaInfo>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="playerBody" style={{ padding: 0 }}>
          <FullScreen handle={handle} onChange={onFullScreenChange}>
            <MaxPlayer onClick={toggleControls} fullscreen={fullscreen}>
              <Player
                ref={player}
                width={fullscreen ? global.screen.width : 498}
                height={fullscreen ? global.screen.height : 300}
                muted={false}
                playing={playing}
                controls={false}
                onEnded={handleEnd}
                onReady={(): void => console.log('onReady')}
                onStart={(): void => console.log('onStart')}
                onProgress={handleProgress}
                onDuration={handleDuration}
                url={mediaUrl}
              />
              <MaxControls>
                <PlayIcons show={showControls} fullscreen={fullscreen}>
                  <Controls>
                    <PrevButton onClick={playPrevious}>
                      <i className="fa fa-step-backward" />
                    </PrevButton>
                    <PlayToggle onClick={togglePlay}>
                      {playing ? (
                        <i className="fa fa-pause-circle-o" />
                      ) : (
                        <i className="fa fa-play-circle-o" />
                      )}
                    </PlayToggle>

                    <NextButton onClick={playNext}>
                      <i className="fa fa-step-forward" />
                    </NextButton>
                  </Controls>
                </PlayIcons>
                <MaxSeekBar>
                  <SeekBarContainer>
                    <SeekBar
                      type="range"
                      min="0"
                      max="0.999999"
                      value={played}
                      step="any"
                      onMouseDown={handleSeekMouseDown}
                      onChange={handleSeekChange}
                      onMouseUp={handleSeekMouseUp}
                    />
                    <TimeContainer>
                      <span>{secondsToString(playedSeconds)}</span>
                      <span>{secondsToString(duration)}</span>
                    </TimeContainer>
                  </SeekBarContainer>
                  <ToogleFullScreen onClick={onExpand}>
                    <i
                      className={`fa fa-${
                        fullscreen ? 'compress' : 'arrows-alt'
                      }`}
                    />
                  </ToogleFullScreen>
                </MaxSeekBar>
              </MaxControls>
            </MaxPlayer>
          </FullScreen>
        </Modal.Body>
      </Modal>
    );
  }
  if (songs?.length > 0 && showPlayer) {
    return (
      <Draggable>
        <AudioPlayerContainer>
          {songs[currentIndex].type === 'video' && (
            <OpenPlayer onClick={togglePlayer}>
              <i className="fa fa-film" />
            </OpenPlayer>
          )}
          <CloseButton onClick={closePlayer}>x</CloseButton>
          <>
            <SeekBarContainer>
              <SeekBar
                type="range"
                min="0"
                max="0.999999"
                value={played}
                step="any"
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
              <TimeContainer>
                <span>{secondsToString(playedSeconds)}</span>
                <span>{secondsToString(duration)}</span>
              </TimeContainer>
            </SeekBarContainer>
            <SongRow>
              <SongInfo>
                {/* <SongImage src={songs[currentIndex].image} alt="img" /> */}
                <InfoCol>
                  <Info>
                    Song Name:
                    <InfoValue>{` ${songs[currentIndex].title}`}</InfoValue>
                  </Info>
                  <Info>
                    Raga:
                    <InfoValue>{` ${songs[currentIndex].metadata.raga}`}</InfoValue>
                  </Info>
                  <Info>
                    Tala:
                    <InfoValue>{` ${songs[currentIndex].metadata.tala}`}</InfoValue>
                  </Info>
                </InfoCol>
              </SongInfo>
              <PlayerControls>
                <Controls>
                  <PrevButton onClick={playPrevious}>
                    <i className="fa fa-step-backward" />
                  </PrevButton>
                  <PlayToggle onClick={togglePlay}>
                    {playing ? (
                      <i className="fa fa-pause-circle-o" />
                    ) : (
                      <i className="fa fa-play-circle-o" />
                    )}
                  </PlayToggle>

                  <NextButton onClick={playNext}>
                    <i className="fa fa-step-forward" />
                  </NextButton>
                </Controls>
              </PlayerControls>
            </SongRow>
            <Player
              ref={player}
              width={632}
              height={0}
              muted={false}
              playing={playing}
              controls={false}
              onEnded={handleEnd}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onProgress={handleProgress}
              onDuration={handleDuration}
              // url={'https://storage.googleapis.com/ems_source/BtXFWdRiG53J87oiy6Lz/media.mp3'}
              url={mediaUrl}
              // config={{ forceHLS: true }}
              // url="https://eppomusic-source.s3.ap-south-1.amazonaws.com/69teu7N9Ip0lx98Xtc1S.mp3"
            />
          </>
        </AudioPlayerContainer>
      </Draggable>
    );
  }
  return null;
};

const AudioPlayerContainer = styled.div`
  position: fixed;
  align-self: center;
  width: 50%;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 2px 5px;
  border-radius: 5px;
`;
const PlayerControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const Controls = styled.div`
  width: 250px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
const PlayToggle = styled.span`
  color: white;
  font-weight: bold;
  text-align: center;
  .fa {
    font-size: 50px;
    color: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
`;
const PrevButton = styled.div`
  .fa {
    font-size: 30px;
    color: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
`;
const NextButton = styled.div`
  .fa {
    font-size: 30px;
    color: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
`;
const SongRow = styled.div`
  display: flex;
  flex-direction: row;
`;
const SongInfo = styled.div`
  display: flex;
  flex: 1 1;
  align-items: center;
  cursor: pointer;
`;
const SongImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
`;
const Info = styled.span`
  color: white;
  font-size: 12px;
  padding: 0 10px;
`;
const InfoValue = styled.span`
  font-weight: bold;
  font-size: 14px;
`;
const SeekBarContainer = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  flex-direction: column;
`;
const SeekBar = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: ${({ theme }): string => theme.primary};
    cursor: pointer;
  }
`;
const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 12px;
    color: white;
  }
`;

// Maximized Player controls
const MaxPlayer = styled.div<{ fullscreen: boolean }>`
  width: ${({ fullscreen }): string =>
    fullscreen ? `${global.screen.width}px` : '498px'};
  height: ${({ fullscreen }): string =>
    fullscreen ? `${global.screen.height}px` : '300px'};
  position: relative;
`;

const MaxControls = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const PlayIcons = styled.div<{ show: boolean; fullscreen: boolean }>`
  top: ${({ fullscreen }): string => (fullscreen ? '50%' : '45%')};
  left: ${({ fullscreen }): string => (fullscreen ? '45%' : '26%')};
  width: 250px;
  position: absolute;
  opacity: ${({ show }): string => (show ? '1' : '0')};
  transition: opacity 2s;
`;
const MaxSeekBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(59, 67, 242, 0.8);
  display: flex;
  flex-direction: row;
`;
const MediaInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ToogleFullScreen = styled.div`
  width: 20px;
  color: white;
  cursor: pointer;
  margin: 0 10px;
`;
const CloseButton = styled.span`
  position: absolute;
  top: -30px;
  right: 0;
  border-radius: 20px;
  color: white;
  background-color: ${({ theme }): string => theme.primary};
  padding: 0 7px;
  cursor: pointer;
`;
const OpenPlayer = styled.span`
  position: absolute;
  top: -30px;
  left: 0;
  border-radius: 4px;
  background-color: ${({ theme }): string => theme.primary};
  padding: 0 5px;
  cursor: pointer;
  color: white;
`;

export default AudioPlayer;
