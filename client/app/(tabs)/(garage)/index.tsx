import { router } from 'expo-router';
import { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Card,
  Text,
  AnimatedFAB,
  Button,
  Surface,
} from 'react-native-paper';

import { useCarStore } from '@/lib/api/store/CarStore';

export default function Garage() {
  const { cars, getCars } = useCarStore();

  useMemo(() => {
    getCars();
  }, [getCars]);

  return (
    <Surface style={styles.container}>
      <View style={styles.title}>
        <Text variant="bodyMedium">My virtual garage</Text>
      </View>

      {cars.length === 0 ? (
        <View style={styles.center}>
          <Text variant="bodyMedium">No cars available</Text>
        </View>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(car) => car.id.toString()}
          renderItem={({ item: car }) => (
            <View style={styles.cardWrapper}>
              <Card
                style={styles.card}
                mode="contained"
                onPress={() => router.push(`/view-car?carId=${car.id}`)}
              >
                <Card.Content style={styles.cardContent}>
                  <Text variant="bodyMedium">
                    {car.name} {car.model} | {car.year}
                  </Text>
                  <Text variant="bodySmall">{car.plateNumber}</Text>
                </Card.Content>
                <Card.Cover
                  source={{
                    uri: car.carImage
                      ? car.carImage
                      : 'https://picsum.photos/200',
                  }}
                />
                <Card.Actions>
                  <Button>Cancel</Button>
                  <Button>Ok</Button>
                </Card.Actions>
              </Card>
            </View>
          )}
        />
      )}
      <AnimatedFAB
        icon="plus"
        label="Add Car"
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
  title: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 24,
  },
});
