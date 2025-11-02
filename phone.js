import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import * as Battery from 'expo-battery';

export default function Phone() {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(null);

  useEffect(() => {
    // Uhrzeit jede Sekunde updaten
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Batterielevel abrufen und Listener setzen
    async function getBattery() {
      const level = await Battery.getBatteryLevelAsync();
      setBattery(Math.round(level * 100));
    }
    getBattery();

    const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBattery(Math.round(batteryLevel * 100));
    });

    return () => sub.remove();
  }, []);

  return (
    <ImageBackground source={require('./background.png')} style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.time}>
          {time.getHours().toString().padStart(2, '0')}:
          {time.getMinutes().toString().padStart(2, '0')}
        </Text>
        <Text style={styles.battery}>{battery !== null ? `${battery}% 🔋` : '...'}</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.logo}>FluxOS</Text>
        <Text style={styles.sub}>Willkommen zurück</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', resizeMode: 'cover' },
  topBar: {
    position: 'absolute',
    top: 50,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  time: { fontSize: 22, fontWeight: '600', color: '#00f' },
  battery: { fontSize: 18, color: '#00f' },
  center: { alignItems: 'center' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#00f' },
  sub: { fontSize: 20, color: '#fff' }
});
