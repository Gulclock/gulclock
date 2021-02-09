import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AllTypesOptions, StackParamList } from '../../App';

type SettingsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Settings'
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
  generatorOption: (type: AllTypesOptions) => void;
  playMode: string[];
  mode: string;
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
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 0.5,
              padding: 15,
              backgroundColor: mode === item ? '#ededed' : '#fff',
            }}
            onPress={() => generatorOption(item)}
          >
            <MaterialCommunityIcons
              name={index % 2 === 0 ? 'fire' : 'rabbit'}
              size={24}
              color="orange"
            />

            <Text style={{ marginLeft: 10 }}>{item}</Text>
            {mode === item && (
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
