import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, ActivityIndicator, KeyboardAvoidingView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Phone from './Phone';

export default function App() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('Deutsch');
  const [region, setRegion] = useState('');
  const [wifiName, setWifiName] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupDone, setSetupDone] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (step === 6) {
      setLoading(true);
      const timer = setTimeout(() => setStep(7), 3000);
      return () => clearTimeout(timer);
    }
    if (step === 9) {
      setLoading(true);
      const timer = setTimeout(() => setSetupDone(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (setupDone) return <Phone />;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            <Text style={styles.welcome}>Welcome</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => setStep(1)}>
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      case 1:
        return (
          <>
            <Text style={styles.question}>Sprache auswählen:</Text>
            <TouchableOpacity style={styles.option} onPress={() => { setLanguage('Deutsch'); setStep(2); }}>
              <Text style={styles.optionText}>Deutsch</Text>
            </TouchableOpacity>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.question}>Region auswählen:</Text>
            {['Afrika', 'Asien', 'Europa', 'Amerika', 'Ozeanien', 'Antarktis'].map((c, i) => (
              <TouchableOpacity key={i} style={styles.option} onPress={() => { setRegion(c); setStep(3); }}>
                <Text style={styles.optionText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </>
        );
      case 3:
        return (
          <KeyboardAvoidingView style={{ alignItems: 'center' }}>
            <Text style={styles.question}>WLAN verbinden:</Text>
            <TextInput style={styles.input} placeholder="WLAN Name" value={wifiName} onChangeText={setWifiName} />
            <TextInput style={styles.input} placeholder="Passwort" secureTextEntry value={wifiPass} onChangeText={setWifiPass} />
            <TouchableOpacity style={styles.option} onPress={() => setStep(6)}>
              <Text style={styles.optionText}>Verbinden</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        );
      case 6:
        return (
          <>
            <Text style={styles.question}>Verbinden...</Text>
            {loading && <ActivityIndicator size="large" color="#00f" style={{ marginTop: 20 }} />}
          </>
        );
      case 7:
        return (
          <>
            <Text style={styles.question}>Weitere Details?</Text>
            <TouchableOpacity style={styles.option} onPress={() => setStep(9)}>
              <Text style={styles.optionText}>Weiter</Text>
            </TouchableOpacity>
          </>
        );
      case 9:
        return (
          <>
            <Text style={styles.question}>Wir personalisieren dein Gerät...</Text>
            {loading && <ActivityIndicator size="large" color="#00f" style={{ marginTop: 20 }} />}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#000000', '#1a1a1a', '#ffffff']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {renderStep()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  welcome: { fontSize: 50, fontFamily: 'Cochin', color: '#fff', marginBottom: 30 },
  startButton: { backgroundColor: '#00f', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  startText: { color: '#fff', fontSize: 20 },
  question: { fontSize: 24, color: '#fff', marginBottom: 20 },
  option: { backgroundColor: '#00f', padding: 15, marginVertical: 10, borderRadius: 20, width: 220, alignItems: 'center' },
  optionText: { color: '#fff', fontSize: 18 },
  input: { width: 220, padding: 10, borderWidth: 1, borderColor: '#333', borderRadius: 10, marginBottom: 10, backgroundColor: '#fff' }
});
