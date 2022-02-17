/* eslint-disable prettier/prettier */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { DeviceMotion } from 'expo-sensors';

import { BaseOptions, StackParamList } from '../../App';

// Time resolution in ms
const timeResolution = 100;

// Min delta angle required to change the player state
const minDeltaAngle = 1;

DeviceMotion.setUpdateInterval(timeResolution);

let topOrLeftStartTime = 0;
let bottomOrRightStartTime = 0;

let topOrLeftCorrectionTime = 0;
let bottomOrRightCorrectionTime = 0;

// Last rotation angle
let lastAngle = 0;

export function usePrevious(value?: BaseOptions): BaseOptions | undefined {
  const ref = React.useRef<BaseOptions | undefined>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

type ClockScreenNavigationProp = StackNavigationProp<StackParamList, 'Clock'>;

type Props = {
  navigation: ClockScreenNavigationProp;
  activeMode: BaseOptions;
};

export default function Clock({ navigation, activeMode }: Props): JSX.Element {
  type Player = {
    steps: number;
    timeLeft: number;
    paused: boolean;
    increment: number;
  };

  type Orientation = 'portrait' | 'landscape';
  type PlayerSide = 'left' | 'right' | 'idle';

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
  });

  const activeModePrevius = usePrevious(activeMode);

  const { timeLeft, increment } = activeMode;

  const initialState = {
    steps: 0,
    timeLeft,
    increment,
    paused: true,
  };

  const [orientation, setOrientation] = React.useState<Orientation>('portrait');
  const [player, setPlayer] = React.useState<PlayerSide>('idle');

  const [playerTopOrLeft, setPlayerTopOrLeft] = React.useState<Player>(
    initialState
  );

  const [playerBottomOrRight, setPlayerBottomOrRight] = React.useState<Player>(
    initialState
  );

  const [gameOver, setGameOver] = React.useState<boolean>(false);

  const startplayerBottomOrRight = useCallback(() => {
    if (!playerTopOrLeft.paused && playerTopOrLeft.steps > 0) return;
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: false,
      steps: playerTopOrLeft.steps + 1,
    });
    const increment =
      playerBottomOrRight.timeLeft < timeResolution ? 0 : playerBottomOrRight.increment;
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: true,
      timeLeft:
        playerBottomOrRight.steps === 0
          ? playerBottomOrRight.timeLeft
          : playerBottomOrRight.timeLeft + increment,
    });
  }, [playerBottomOrRight, playerTopOrLeft]);

  const startPlayerTopOrLeft = useCallback(() => {
    if (!playerBottomOrRight.paused && playerBottomOrRight.steps > 0) return;
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: false,
      steps: playerBottomOrRight.steps + 1,
    });
    const increment =
      playerTopOrLeft.timeLeft < timeResolution ? 0 : playerTopOrLeft.increment;
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: true,
      timeLeft:
        playerTopOrLeft.steps === 0
          ? playerTopOrLeft.timeLeft
          : playerTopOrLeft.timeLeft + increment,
    });
  }, [playerBottomOrRight, playerTopOrLeft]);

  const reset = () => {
    setPlayerBottomOrRight(initialState);
    setPlayerTopOrLeft(initialState);
    setGameOver(false);
  };

  const formatterTime = (time: number) =>
    new Date(time).toISOString().substr(14, 7);

  React.useEffect(() => {
    topOrLeftStartTime = new Date().getTime();
    const id = setInterval(() => {
      const delta = timeResolution + topOrLeftCorrectionTime;
      const timeLeft = playerTopOrLeft.timeLeft - delta;
      setPlayerTopOrLeft({
        ...playerTopOrLeft,
        timeLeft: timeLeft < timeResolution ? 0 : timeLeft,
      });
      const end = new Date().getTime() - topOrLeftStartTime;
      topOrLeftCorrectionTime = end - timeResolution;
    }, timeResolution);
    if (playerTopOrLeft.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerTopOrLeft.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerTopOrLeft, playerTopOrLeft.paused]);

  React.useEffect(() => {
    bottomOrRightStartTime = new Date().getTime();
    const id = setInterval(() => {
      const delta = timeResolution + bottomOrRightCorrectionTime;
      const timeLeft = playerBottomOrRight.timeLeft - delta;
      setPlayerBottomOrRight({
        ...playerBottomOrRight,
        timeLeft: timeLeft < timeResolution ? 0 : timeLeft,
      });
      const end = new Date().getTime() - bottomOrRightStartTime;
      bottomOrRightCorrectionTime = end - timeResolution;
    }, timeResolution);
    if (playerBottomOrRight.timeLeft === 0) {
      clearInterval(id);
      setGameOver(true);
    }
    if (playerBottomOrRight.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerBottomOrRight, playerBottomOrRight.paused]);

  React.useEffect(() => {
    if (activeModePrevius !== activeMode) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMode]);

  React.useEffect(() => {
    const listener = DeviceMotion.addListener(
      ({ rotation }) => {
        // get actual rotation in degrees
        const beta = Object.is(rotation.beta, undefined) ? 0 : rotation.beta;
        const rotAngle = beta * (180 / Math.PI);

        const deltaAngle = rotAngle - lastAngle;
        if (Math.abs(rotAngle - lastAngle) > minDeltaAngle) {
          const state =
            deltaAngle > 0 ? 'left' : deltaAngle < 0 ? 'right' : 'idle';
          setPlayer((prevState) => {
            if (prevState !== state) return state;
            return prevState;
          });
        };
        lastAngle = rotAngle;
      }
    );
    return () => listener.remove();
  }, []);

  React.useEffect(() => {
    if (orientation === 'landscape') {
      if (player === 'left') startplayerBottomOrRight();
      if (player === 'right') startPlayerTopOrLeft();
    }
  }, [orientation, player, startPlayerTopOrLeft, startplayerBottomOrRight]);

  React.useEffect(() => {
    const listener = (info: ScreenOrientation.OrientationChangeEvent): void => {
      setOrientation(
        info.orientationInfo.orientation === 1 ? 'portrait' : 'landscape'
      );
    };

    ScreenOrientation.addOrientationChangeListener(listener);
    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <SafeAreaView />
      <View style={styles.container}>
        {orientation === 'portrait' ? (
          <>
            <Pressable
              disabled={gameOver}
              onPressIn={startPlayerTopOrLeft}
              style={{ flex: 1, width: '100%' }}
            >
              <View
                style={[
                  styles.touchView,
                  {
                    transform: [{ rotate: '180deg' }],
                    backgroundColor:
                      playerTopOrLeft.timeLeft === 0
                        ? 'red'
                        : playerTopOrLeft.paused
                          ? '#c0c0c0'
                          : 'darkorange',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color: playerTopOrLeft.paused ? '#000' : '#c0c0c0',
                      position: 'absolute',
                      left: 14
                    },
                  ]}
                >
                  {formatterTime(playerTopOrLeft.timeLeft)}
                </Text>
                <Text style={{ position: 'absolute', right: 15, bottom: 15 }}>
                  {playerTopOrLeft.steps}
                </Text>
              </View>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                padding: 25,
                backgroundColor: '#333',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={reset}>
                <Ionicons
                  name="reload"
                  size={32}
                  color="#c0c0c0"
                  style={{ marginLeft: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Ionicons
                  name="settings"
                  size={32}
                  color="#c0c0c0"
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            </View>
            <Pressable
              disabled={gameOver}
              onPressIn={startplayerBottomOrRight}
              style={{ flex: 1, width: '100%' }}
            >
              <View
                style={[
                  styles.touchView,
                  {
                    backgroundColor:
                      playerBottomOrRight.timeLeft === 0
                        ? 'red'
                        : playerBottomOrRight.paused
                          ? '#c0c0c0'
                          : 'darkorange',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color: playerBottomOrRight.paused ? '#000' : '#c0c0c0',
                      position: 'absolute',
                      left: 14
                    },
                  ]}
                >
                  {formatterTime(playerBottomOrRight.timeLeft)}
                </Text>
                <Text style={{ position: 'absolute', right: 15, bottom: 15 }}>
                  {playerBottomOrRight.steps}
                </Text>
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                padding: 25,
                backgroundColor: '#333',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={reset}>
                <Ionicons
                  name="reload"
                  size={32}
                  color="#c0c0c0"
                  style={{ marginLeft: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Ionicons
                  name="settings"
                  size={32}
                  color="#c0c0c0"
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Pressable
                disabled={gameOver}
                onPressIn={startPlayerTopOrLeft}
                style={{ flex: 1, width: '100%' }}
              >
                <View
                  style={[
                    styles.touchView,
                    {
                      backgroundColor:
                        playerTopOrLeft.timeLeft === 0
                          ? 'red'
                          : playerTopOrLeft.paused
                            ? '#c0c0c0'
                            : 'darkorange',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: playerTopOrLeft.paused ? '#000' : '#c0c0c0',
                        position: 'absolute',
                        left: 14
                      },
                    ]}
                  >
                    {formatterTime(playerTopOrLeft.timeLeft)}
                  </Text>
                  <Text style={{ position: 'absolute', right: 15, bottom: 15 }}>
                    {playerTopOrLeft.steps}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                disabled={gameOver}
                onPressIn={startplayerBottomOrRight}
                style={{ flex: 1, width: '100%' }}
              >
                <View
                  style={[
                    styles.touchView,
                    {
                      backgroundColor:
                        playerBottomOrRight.timeLeft === 0
                          ? 'red'
                          : playerBottomOrRight.paused
                            ? '#c0c0c0'
                            : 'darkorange',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: playerBottomOrRight.paused ? '#000' : '#c0c0c0',
                        position: 'absolute',
                        left: 14
                      },
                    ]}
                  >
                    {formatterTime(playerBottomOrRight.timeLeft)}
                  </Text>
                  <Text style={{ position: 'absolute', right: 15, bottom: 15 }}>
                    {playerBottomOrRight.steps}
                  </Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </View>
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 80,
    fontFamily: 'Inter_700Bold',
  },
  touchView: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
