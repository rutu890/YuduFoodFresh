
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';
import NotificationCard from '../components/notifications/NotificationCard';

import {
  initialNotifications,
  notificationCategories,
} from '../data/notificationsData';

export default function NotificationsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showSuccess, setShowSuccess] = useState(false);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(12)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(15)).current;
  const toastTimer = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslate, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter(
      (item) =>
        selectedCategory === 'All' ||
        item.category === selectedCategory
    );
  }, [notifications, selectedCategory]);

  const todayNotifications = useMemo(
    () => filteredNotifications.filter((item) => item.group === 'Today'),
    [filteredNotifications]
  );

  const yesterdayNotifications = useMemo(
    () => filteredNotifications.filter((item) => item.group === 'Yesterday'),
    [filteredNotifications]
  );

  const showSuccessMessage = () => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setShowSuccess(true);

    toastOpacity.setValue(0);
    toastTranslate.setValue(15);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(toastTranslate, {
        toValue: 0,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslate, {
          toValue: 12,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setShowSuccess(false));
    }, 1800);
  };

  const handleNotificationPress = (notification) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? { ...item, unread: false }
          : item
      )
    );

    if (
      notification.category === 'Orders' ||
      notification.category === 'Delivery'
    ) {
      navigation.navigate('OrderUpdateDetails', {
        notification,
      });
    }
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        unread: false,
      }))
    );

    showSuccessMessage();
  };

  const renderSection = (title, items) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>

          <Text style={styles.sectionCount}>
            {items.length} {items.length === 1 ? 'alert' : 'alerts'}
          </Text>
        </View>

        {items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onPress={handleNotificationPress}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslate }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.ink}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              Stay updated with your orders
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person-outline"
              size={19}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Inbox summary */}
          <View style={styles.inboxRow}>
            <View style={styles.inboxLabel}>
              <Text style={styles.inboxTitle}>Inbox</Text>

              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount} Unread
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
              activeOpacity={0.7}
            >
              <View style={styles.markReadRow}>
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  color={
                    unreadCount > 0
                      ? colors.teal
                      : colors.muted
                  }
                />

                <Text
                  style={[
                    styles.markReadText,
                    unreadCount === 0 && styles.disabledText,
                  ]}
                >
                  Mark all as read
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Category filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {notificationCategories.map((category) => {
              const selected = selectedCategory === category;

              const count =
                category === 'All'
                  ? unreadCount
                  : notifications.filter(
                      (item) =>
                        item.category === category && item.unread
                    ).length;

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selected && styles.selectedChip,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>

                  {count > 0 && (
                    <View
                      style={[
                        styles.categoryCount,
                        selected && styles.selectedCategoryCount,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryCountText,
                          selected && styles.selectedCountText,
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Notification sections */}
          {filteredNotifications.length > 0 ? (
            <>
              {renderSection('Today', todayNotifications)}
              {renderSection('Yesterday', yesterdayNotifications)}
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="notifications-off-outline"
                  size={34}
                  color={colors.orange}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No notifications here
              </Text>

              <Text style={styles.emptyDescription}>
                Updates in this category will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Success message */}
      {showSuccess && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.successToast,
            {
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslate }],
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.white}
          />
          <Text style={styles.successText}>
            All notifications marked as read
          </Text>
        </Animated.View>
      )}

      <BottomTabBar
        navigation={navigation}
        active=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 17,
    backgroundColor: colors.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 37,
    height: 37,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.ink,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },
  profileButton: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 25,
  },
  inboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inboxLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  inboxTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.ink,
  },
  unreadBadge: {
    backgroundColor: colors.orange,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
  markReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  markReadText: {
    color: colors.teal,
    fontSize: 10,
    fontWeight: '800',
  },
  disabledText: {
    color: colors.muted,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  selectedChip: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  categoryText: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: '700',
  },
  selectedCategoryText: {
    color: colors.white,
  },
  categoryCount: {
    minWidth: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  selectedCategoryCount: {
    backgroundColor: colors.white,
  },
  categoryCountText: {
    color: colors.orangeDeep,
    fontSize: 8,
    fontWeight: '900',
  },
  selectedCountText: {
    color: colors.orangeDeep,
  },
  section: {
    marginBottom: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.ink,
  },
  sectionCount: {
    fontSize: 9,
    color: colors.muted,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 65,
    paddingHorizontal: 25,
  },
  emptyIcon: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.ink,
  },
  emptyDescription: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 7,
  },
  successToast: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealDeep,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  successText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});
