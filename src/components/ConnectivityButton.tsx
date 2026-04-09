import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ConnectivityButtonProps {
  status: 'disconnected' | 'connecting' | 'connected';
  onPress: () => void;
}

export const ConnectivityButton: React.FC<ConnectivityButtonProps> = ({ status, onPress }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'connecting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return Colors.success;
      case 'connecting': return Colors.warning;
      default: return Colors.primary;
    }
  };

  const getButtonLabel = () => {
    switch (status) {
      case 'connected': return 'DISCONNECT';
      case 'connecting': return 'CANCEL';
      default: return 'CONNECT';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        {status === 'connecting' && (
          <Animated.View
            style={[
              styles.pulse,
              {
                borderColor: getStatusColor(),
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.2],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
        )}
        
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          <LinearGradient
            colors={
              status === 'connected' 
              ? [Colors.success, '#1A5F35'] 
              : status === 'connecting'
              ? [Colors.warning, '#8A5A00']
              : [Colors.primary, Colors.primaryDark]
            }
            style={styles.gradient}
          >
            <Feather name="power" size={48} color={Colors.white} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {status.toUpperCase()}
      </Text>
      <Text style={styles.label}>{getButtonLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  touchable: {
    width: 160,
    height: 160,
    borderRadius: 80,
    elevation: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
