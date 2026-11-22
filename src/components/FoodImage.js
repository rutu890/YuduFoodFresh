
import React, { memo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../constants/colors';

function FoodImage({
  uri,
  style,
  contentFit = 'cover',
  transition = 350,
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!loaded && !failed && (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.orange} size="small" />
        </View>
      )}

      {failed ? (
        <View style={styles.fallback}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.fallbackIcon}
            contentFit="contain"
          />
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={transition}
          cachePolicy="memory-disk"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

export default memo(FoodImage);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F3EFEA',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EFEA',
  },
  fallbackIcon: {
    width: 38,
    height: 38,
    opacity: 0.5,
  },
});
