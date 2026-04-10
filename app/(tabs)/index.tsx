import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Switch } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { ConnectivityButton } from '../../src/components/ConnectivityButton';
import { useVpn } from '../../src/hooks/useVpn';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInDown, Layout } from 'react-native-reanimated';

export default function HomeScreen() {
  const { 
    status, connect, disconnect, selectedServer, loading, refreshServers,
    isKillSwitch, setKillSwitch, isAutoConnect, setAutoConnect 
  } = useVpn();
  
  const insets = useSafeAreaInsets();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  // SMART CONNECT LOGIC: Trigger if auto-connect is on and list just finished loading
  useEffect(() => {
    if (isAutoConnect && !loading && status === 'disconnected' && selectedServer) {
        // Automatically start connecting after a short delay
        const timeout = setTimeout(() => {
            connect();
        }, 1500);
        return () => clearTimeout(timeout);
    }
  }, [loading, isAutoConnect, status]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handlePress = () => {
    if (status === 'connected') {
      disconnect();
    } else {
      connect();
    }
  };

  const flagUrl = selectedServer 
    ? `https://flagcdn.com/w80/${selectedServer.countryShort.toLowerCase()}.png`
    : null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#121212']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={[styles.stickyHeader, { paddingTop: Math.max(insets.top, Spacing.md) }]}>
        <View style={styles.headerTitleRow}>
          <Image 
            source={require('../../assets/images/icon_fg.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.greeting}>SkyVPN</Text>
            <Text style={styles.subtitle}>{status === 'connected' ? 'SECURED CONNECTION' : 'UNSECURED'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={refreshServers} 
          style={styles.iconButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Feather name="refresh-cw" size={24} color={Colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* KILL SWITCH ALERT */}
        {isKillSwitch && status === 'disconnected' && (
            <Animated.View entering={FadeInDown} style={styles.killSwitchBanner}>
                <Feather name="alert-triangle" size={16} color={Colors.error} />
                <Text style={styles.killSwitchText}>INTERNET TRAFFIC BLOCKED (KILL SWITCH ACTIVE)</Text>
            </Animated.View>
        )}

        <View style={styles.toggleContainer}>
          {status === 'connected' && (
            <Animated.View entering={FadeInDown} style={styles.timerWrapper}>
                <Text style={styles.timerLabel}>CONNECTION TIME</Text>
                <Text style={styles.timerValue}>{formatTime(timer)}</Text>
            </Animated.View>
          )}
          <ConnectivityButton status={status} onPress={handlePress} />
        </View>

        {/* Real-time Stats */}
        {status === 'connected' && (
          <Animated.View entering={FadeInUp} style={styles.statsRow}>
            <View style={styles.statBox}>
                <Feather name="arrow-down" size={20} color={Colors.primary} />
                <View>
                    <Text style={styles.statLabel}>DOWNLOAD</Text>
                    <Text style={styles.statMain}>42.5 Mbps</Text>
                </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
                <Feather name="arrow-up" size={20} color={Colors.textSecondary} />
                <View>
                    <Text style={styles.statLabel}>UPLOAD</Text>
                    <Text style={styles.statMain}>12.8 Mbps</Text>
                </View>
            </View>
          </Animated.View>
        )}

        {/* Selected Server Card */}
        {selectedServer && (
          <View style={styles.serverInfoCard}>
            <View style={styles.serverHeader}>
              <View style={styles.iconWrapper}>
                {flagUrl ? (
                  <Image source={{ uri: flagUrl }} style={styles.flagIcon} resizeMode="cover" />
                ) : (
                  <Feather name="globe" size={24} color={Colors.primary} />
                )}
              </View>
              <View style={styles.serverDetails}>
                <Text style={styles.serverLabel}>SELECTED SERVER</Text>
                <Text style={styles.serverName}>{selectedServer.countryLong}</Text>
              </View>
              <Feather name="chevron-right" size={24} color={Colors.textSecondary} />
            </View>
          </View>
        )}

        {/* Settings Toggles */}
        <View style={styles.settingsSection}>
            <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Kill Switch</Text>
                    <Text style={styles.settingDesc}>Block traffic if VPN drops</Text>
                </View>
                <Switch 
                    value={isKillSwitch} 
                    onValueChange={setKillSwitch}
                    trackColor={{ false: '#333', true: Colors.primaryDark }}
                    thumbColor={isKillSwitch ? Colors.primary : '#fff'}
                />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Smart Connect</Text>
                    <Text style={styles.settingDesc}>Auto-connect on launch</Text>
                </View>
                <Switch 
                    value={isAutoConnect} 
                    onValueChange={setAutoConnect}
                    trackColor={{ false: '#333', true: Colors.primaryDark }}
                    thumbColor={isAutoConnect ? Colors.primary : '#fff'}
                />
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  killSwitchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    marginBottom: 20,
    gap: 10,
  },
  killSwitchText: {
    color: Colors.error,
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  greeting: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  timerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  timerValue: {
    color: Colors.primary,
    fontSize: 48,
    fontWeight: '100',
    fontFamily: 'sans-serif-thin',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: Spacing.md,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statMain: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
  },
  serverInfoCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    overflow: 'hidden',
  },
  flagIcon: {
    width: '100%',
    height: '100%',
  },
  serverDetails: {
    flex: 1,
  },
  serverLabel: {
    color: Colors.textSecondary,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  serverName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  settingsSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 10,
  },
});
