import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  AnimatedFAB,
  Button,
  Surface,
  IconButton,
} from 'react-native-paper';

import { Locales } from '@/lib';
import { getCars } from '@/lib/api/queries';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Garage() {
  const [page, setPage] = useState(1);
  const { height } = Dimensions.get('window');

  const pageSize = useMemo(() => Math.floor(height / 275), [height]);

  const { data, isPending, error, isPlaceholderData, isFetching } =
    useQuery({
      queryKey: ['cars', page, pageSize],
      queryFn: () => getCars(page, pageSize),
      placeholderData: keepPreviousData,
      enabled: pageSize > 0,
    });

  // Schedule initial notification only on mobile
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Look at that notification',
          body: "I'm so proud of myself!",
        },
        trigger: null,
      });
    }
  }, []);

  // Schedule notification when data changes (only on mobile)
  useEffect(() => {
    if (Platform.OS !== 'web' && data) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Cars Loaded',
          body: 'The car data has been successfully loaded!',
        },
        trigger: null,
      });
    }
  }, [data]);

  // Early return for loading state
  if (isPending) {
    return (
      <Surface style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator animating />
        </View>
      </Surface>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <Surface style={styles.container}>
        <View style={styles.center}>
          <Text variant="bodyMedium">Something went wrong, try again</Text>
        </View>
      </Surface>
    );
  }

  // Main render
  return (
    <Surface style={styles.container}>
      <View style={styles.title}>
        <Text variant="bodyMedium">{Locales.t('garageTitleText')}</Text>
      </View>
      <View style={styles.grid}>
        {data.cars.map((car) => (
          <View key={car.id} style={styles.cardWrapper}>
            <Card
              style={styles.card}
              mode="contained"
              onPress={() => router.push(`/view-car?carId=${car.id}`)}
            >
              <Card.Content style={styles.cardContent}>
                <Text variant="bodyMedium">
                  {car.name} {car.model} | {car.year}
                </Text>
                <Text variant="bodySmall">{car.plate_number}</Text>
              </Card.Content>
              <Card.Cover
                source={{
                  uri: car.car_image
                    ? `data:image/jpeg;base64,${car.car_image}`
                    : 'https://picsum.photos/200',
                }}
              />
              <Card.Actions>
                <Button>Cancel</Button>
                <Button>Ok</Button>
              </Card.Actions>
            </Card>
          </View>
        ))}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.paginationContainer}>
          <IconButton
            icon="arrow-left"
            size={18}
            onPress={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 1}
            loading={isFetching}
          />
          <Text variant="bodyMedium">
            Page {page} of {data.total_pages}
          </Text>
          <IconButton
            icon="arrow-right"
            size={18}
            onPress={() => {
              if (!isPlaceholderData && page < data.total_pages) {
                setPage((old) => old + 1);
              }
            }}
            disabled={isPlaceholderData || page >= data.total_pages}
            loading={isFetching}
          />
        </View>
        <AnimatedFAB
          icon="plus"
          label="Label"
          extended={false}
          onPress={() => router.push('/new-car')}
          animateFrom="right"
          iconMode="static"
          style={styles.fab}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 640,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  card: {
    height: 190,
    overflow: 'hidden',
  },
  cardContent: {
    paddingVertical: 12,
    gap: 4,
  },
  title: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingLeft: 8,
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'relative',
    bottom: 0,
    right: 0,
  },
});
