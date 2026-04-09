import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { VpnServer } from '../services/vpnService';

interface ServerCardProps {
  server: VpnServer;
  onSelect: (server: VpnServer) => void;
  isSelected?: boolean;
}

export const ServerCard: React.FC<ServerCardProps> = ({ server, onSelect, isSelected }) => {
  const formatSpeed = (speed: number) => {
    if (speed > 1000000) return `${(speed / 1000000).toFixed(1)} Mbps`;
    return `${(speed / 1000).toFixed(1)} Kbps`;
  };

  const flagUrl = `https://flagcdn.com/w80/${server.countryShort.toLowerCase()}.png`;

  return (
    <TouchableOpacity
      onPress={() => onSelect(server)}
      activeOpacity={0.7}
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]}
    >
      <View style={styles.header}>
        <View style={styles.countryContainer}>
            <View style={styles.iconWrapper}>
                <Image 
                  source={{ uri: flagUrl }} 
                  style={styles.flagIcon}
                  resizeMode="cover"
                />
            </View>
          <View>
            <Text style={styles.countryName}>{server.countryLong}</Text>
            <Text style={styles.ipText}>{server.ip}</Text>
          </View>
        </View>
        <View style={[styles.badge, isSelected && styles.selectedBadge]}>
          <Text style={styles.badgeText}>{server.countryShort}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Feather name="clock" size={14} color={Colors.textSecondary} />
          <Text style={styles.statText}>{server.ping} ms</Text>
        </View>
        <View style={styles.stat}>
          <Feather name="zap" size={14} color={Colors.success} />
          <Text style={styles.statText}>{formatSpeed(server.speed)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(10, 132, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.sm,
      overflow: 'hidden',
  },
  flagIcon: {
    width: '100%',
    height: '100%',
  },
  countryName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ipText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  selectedBadge: {
      backgroundColor: Colors.primary,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: Spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  statText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
});
