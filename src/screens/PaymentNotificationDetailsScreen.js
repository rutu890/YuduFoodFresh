
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

export default function PaymentNotificationDetailsScreen({
  navigation,
  route,
}) {
  const notification = route.params?.notification || {};

  const {
    paymentStatus = 'Unknown',
    amount = 0,
    paymentMethod = 'Not available',
    transactionId = 'Not available',
    paymentDate = 'Not available',
    orderNumber = 'Not available',
    description = '',
    failureReason,
    refundReason,
    expectedRefund,
  } = notification;

  const isSuccess = paymentStatus === 'Success';
  const isFailed = paymentStatus === 'Failed';
  const isRefund = paymentStatus === 'Refund initiated';

  const statusColor = isSuccess
    ? colors.teal
    : isFailed
    ? colors.coral
    : colors.orange;

  const statusIcon = isSuccess
    ? 'checkmark-circle'
    : isFailed
    ? 'close-circle'
    : 'time';

  const handleRetry = () => {
    Alert.alert(
      'Payment retry',
      'This is currently a demo action. The payment gateway must be integrated to retry a real transaction.'
    );
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={colors.ink}
          />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Payment Details</Text>
          <Text style={styles.headerSubtitle}>
            Transaction information
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              { backgroundColor: `${statusColor}18` },
            ]}
          >
            <Ionicons
              name={statusIcon}
              size={38}
              color={statusColor}
            />
          </View>

          <Text style={styles.statusTitle}>
            {isSuccess
              ? 'Payment successful!'
              : isFailed
              ? 'Payment failed'
              : 'Refund initiated'}
          </Text>

          <Text style={styles.statusDescription}>
            {description}
          </Text>

          <Text style={styles.amountLabel}>Amount</Text>

          <Text style={styles.amount}>
            ₹{Number(amount).toFixed(2)}
          </Text>

          <View
            style={[
              styles.statusPill,
              { backgroundColor: `${statusColor}18` },
            ]}
          >
            <Text style={{ color: statusColor, fontWeight: '800' }}>
              {paymentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>
            Transaction details
          </Text>

          <DetailRow
            label="Transaction ID"
            value={transactionId}
          />

          <DetailRow
            label="Payment method"
            value={paymentMethod}
          />

          <DetailRow
            label="Date and time"
            value={paymentDate}
          />

          <DetailRow
            label="Order number"
            value={orderNumber}
          />
        </View>

        {isFailed && failureReason ? (
          <View style={styles.infoCard}>
            <Ionicons
              name="alert-circle-outline"
              size={21}
              color={colors.coral}
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Why did the payment fail?
              </Text>
              <Text style={styles.infoDescription}>
                {failureReason}
              </Text>
            </View>
          </View>
        ) : null}

        {isRefund && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>
              Refund information
            </Text>

            <DetailRow
              label="Refund reason"
              value={refundReason || 'Not available'}
            />

            <DetailRow
              label="Expected processing"
              value={expectedRefund || 'Not available'}
            />

            <Text style={styles.refundNote}>
              Refund processing time may vary depending on your
              bank or payment provider.
            </Text>
          </View>
        )}

        {isFailed && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.85}
          >
            <Ionicons
              name="refresh"
              size={18}
              color={colors.white}
            />
            <Text style={styles.retryText}>
              Retry payment
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.backToNotifications}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backToNotificationsText}>
            Back to notifications
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBar navigation={navigation} active="" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.vanilla,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.ink,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  statusIcon: {
    width: 75,
    height: 75,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  statusTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 7,
  },
  amountLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 20,
  },
  amount: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },
  statusPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 12,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.ink,
    marginBottom: 13,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.soft,
    gap: 15,
  },
  detailLabel: {
    flex: 1,
    fontSize: 11,
    color: colors.muted,
  },
  detailValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'right',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF0F0',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  infoDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
  refundNote: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 16,
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: colors.orange,
    borderRadius: 15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginBottom: 12,
  },
  retryText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 13,
  },
  backToNotifications: {
    alignItems: 'center',
    padding: 14,
  },
  backToNotificationsText: {
    color: colors.teal,
    fontWeight: '800',
    fontSize: 12,
  },
});
