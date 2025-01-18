import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  AnimatedFAB,
  Button,
  Surface,
} from 'react-native-paper';

import { Locales } from '@/lib';
import { getCars } from '@/lib/api/queries';
import { Car } from '@/lib/types/Car';

export default function Garage() {
  const {
    data: cars,
    isPending,
    error,
  } = useQuery<Car[]>({
    queryKey: ['Cars'],
    queryFn: getCars,
  });

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Something went wrong, try again</Text>
      </View>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.title}>
        <Text variant="bodyMedium">{Locales.t('garageTitleText')}</Text>
      </View>
      <View style={styles.grid}>
        {cars.map((car) => (
          <View key={car.id} style={styles.cardWrapper}>
            <Card
              style={styles.card}
              mode="contained"
              onPress={() => router.push(`/view-car?id=${car.id}`)}
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
      <AnimatedFAB
        icon="plus"
        label="Label"
        extended={false}
        onPress={() => router.push('/new-car')}
        animateFrom="right"
        iconMode="static"
        style={styles.fab}
      />
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
    marginBottom: 16,
  },
  card: {
    height: 180,
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
