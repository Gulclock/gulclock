/* eslint-disable react/style-prop-object */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
  });

  type Player = {
    steps: number;
    timeLeft: number;
    paused: boolean;
  };

  type Orientation = 'portrait' | 'landscape';

  const initialState = {
    steps: 0,
    timeLeft: 360,
    paused: true,
  };

  const [orientation, setOrientation] = React.useState<Orientation>('portrait');

  const [playerTopOrLeft, setPlayerTopOrLeft] = React.useState<Player>(
    initialState,
  );

  const [playerBottomOrRight, setPlayerBottomOrRight] = React.useState<Player>(
    initialState,
  );

  const startplayerBottomOrRight = () => {
    setPlayerTopOrLeft({
      ...playerTopOrLeft,
      paused: false,
      steps: playerTopOrLeft.steps + 1,
    });
    setPlayerBottomOrRight({ ...playerBottomOrRight, paused: true });
  };

  const startPlayerTopOrLeft = () => {
    setPlayerBottomOrRight({
      ...playerBottomOrRight,
      paused: false,
      steps: playerBottomOrRight.steps + 1,
    });
    setPlayerTopOrLeft({ ...playerTopOrLeft, paused: true });
  };

  const reset = () => {
    setPlayerBottomOrRight(initialState);
    setPlayerTopOrLeft(initialState);
  };

  const formatterTime = (time: number) =>
    new Date(time * 1000).toISOString().substr(14, 5);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerTopOrLeft({
        ...playerTopOrLeft,
        timeLeft: (playerTopOrLeft.timeLeft -= 1),
      });
    }, 1000);
    if (playerTopOrLeft.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerTopOrLeft, playerTopOrLeft.paused]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPlayerBottomOrRight({
        ...playerBottomOrRight,
        timeLeft: (playerBottomOrRight.timeLeft -= 1),
      });
    }, 1000);
    if (playerBottomOrRight.paused) {
      clearInterval(id);
    }

    return () => clearInterval(id);
  }, [playerBottomOrRight, playerBottomOrRight.paused]);

  React.useEffect(() => {
    const listener = (info: ScreenOrientation.OrientationChangeEvent): void => {
      setOrientation(
        info.orientationInfo.orientation === 1 ? 'portrait' : 'landscape',
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
    <View style={styles.container}>
      {orientation === 'portrait' ? (
        <>
          <Pressable
            onPressIn={startPlayerTopOrLeft}
            style={{ flex: 1, width: '100%' }}
          >
            <View
              style={[
                styles.touchView,
                {
                  transform: [{ rotate: '180deg' }],
                  backgroundColor: playerTopOrLeft.paused
                    ? '#c0c0c0'
                    : 'darkorange',
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { color: playerTopOrLeft.paused ? '#000' : '#c0c0c0' },
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
            <Ionicons
              name="settings"
              size={32}
              color="#c0c0c0"
              style={{ marginRight: 20 }}
            />
          </View>
          <Pressable
            onPressIn={startplayerBottomOrRight}
            style={{ flex: 1, width: '100%' }}
          >
            <View
              style={[
                styles.touchView,
                {
                  backgroundColor: playerBottomOrRight.paused
                    ? '#c0c0c0'
                    : 'darkorange',
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { color: playerBottomOrRight.paused ? '#000' : '#c0c0c0' },
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
            <Ionicons
              name="settings"
              size={32}
              color="#c0c0c0"
              style={{ marginRight: 20 }}
            />
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Pressable
              onPressIn={startPlayerTopOrLeft}
              style={{ flex: 1, width: '100%' }}
            >
              <View
                style={[
                  styles.touchView,
                  {
                    backgroundColor: playerTopOrLeft.paused
                      ? '#c0c0c0'
                      : 'darkorange',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: playerTopOrLeft.paused ? '#000' : '#c0c0c0' },
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
              onPressIn={startplayerBottomOrRight}
              style={{ flex: 1, width: '100%' }}
            >
              <View
                style={[
                  styles.touchView,
                  {
                    backgroundColor: playerBottomOrRight.paused
                      ? '#c0c0c0'
                      : 'darkorange',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: playerBottomOrRight.paused ? '#000' : '#c0c0c0' },
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
