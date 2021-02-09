import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AllTypesOptions, StackParamList } from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Settings'
>;

type PlayMode = {
  name: string;
  type: string;
};

type Props = {
  navigation: SettingsScreenNavigationProp;
  generatorOption: (type: AllTypesOptions) => void;
  playMode: PlayMode[];
  mode: string;
};

const iconsType = {
  Bullet: 'bullet',
  Rapid: 'rabbit',
  Blitz: 'fire',
  Classical: 'tortoise',
};

export default function Settings({
  navigation,
  generatorOption,
  playMode,
  mode,
}: Props): JSX.Element {
  return (
    <View>
      <FlatList
        data={playMode}
        keyExtractor={(_, index) => `${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 0.5,
              padding: 15,
              backgroundColor: mode === item.name ? '#ededed' : '#fff',
            }}
            onPress={() => generatorOption(item.name)}
          >
            <MaterialCommunityIcons
              name={iconsType[item.type]}
              size={24}
              color="orange"
              style={{
                transform: [
                  { rotate: item.type === 'Bullet' ? '90deg' : '0deg' },
                ],
              }}
            />
            <Text style={{ marginHorizontal: 10 }}> {item.type} </Text>
            <Text>{item.name}</Text>
            {mode === item.name && (
              <MaterialCommunityIcons
                name="check-bold"
                size={24}
                color="green"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>go back</Text>
      </TouchableOpacity>
    </View>
  );
}
