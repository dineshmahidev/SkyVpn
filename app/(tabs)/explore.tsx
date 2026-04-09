import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { ServerCard } from '../../src/components/ServerCard';
import { useVpn } from '../../src/hooks/useVpn';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ServerListScreen() {
  const { servers, loading, selectServer, selectedServer, refreshServers } = useVpn();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const filteredServers = servers.filter(server => 
    server.countryLong.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.countryShort.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.ping - b.ping);

  const handleSelect = (server: any) => {
    selectServer(server);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={[styles.stickyContainer, { paddingTop: Math.max(insets.top, Spacing.xl) }]}>
        <View style={styles.header}>
          <Text style={styles.title}>All Servers</Text>
          <TouchableOpacity onPress={refreshServers} disabled={loading}>
            <Feather name="refresh-cw" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by country..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loaderText}>Fetching latest servers...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredServers}
            keyExtractor={(item) => item.ip + item.hostName}
            renderItem={({ item }) => (
              <ServerCard
                server={item}
                isSelected={selectedServer?.ip === item.ip}
                onSelect={handleSelect}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No servers found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stickyContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
