import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { HEALTH_PROVIDERS } from './healthIntegrations';

export default function HealthDataPanel({ onConnect }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Connect your activity</Text>
      <Text style={styles.subtitle}>
        Import workouts and active calories so MacroChief can adjust your daily calorie budget automatically.
      </Text>
      {HEALTH_PROVIDERS.map(provider => (
        <Pressable key={provider.id} style={styles.row} onPress={() => onConnect?.(provider)}>
          <View>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.meta}>{provider.status}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
      <Text style={styles.note}>
        Production connections require the provider's permissions, OAuth flow, and approved API access.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{backgroundColor:'#121923',borderRadius:18,padding:18,borderWidth:1,borderColor:'#202C3A'},
  title:{color:'#FFF',fontSize:18,fontWeight:'900'},
  subtitle:{color:'#8A97A8',fontSize:13,lineHeight:19,marginTop:7,marginBottom:12},
  row:{paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#202C3A',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  name:{color:'#FFF',fontWeight:'800'},
  meta:{color:'#718092',fontSize:11,marginTop:4},
  arrow:{color:'#7EE787',fontSize:28},
  note:{color:'#667386',fontSize:10,lineHeight:15,marginTop:14}
});
