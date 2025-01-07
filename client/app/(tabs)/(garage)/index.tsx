import { View, StyleSheet, Dimensions } from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  AnimatedFAB,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

import { getCars } from '@/lib/api/queries';
import { Car } from '@/lib/types/Car';
import { Locales } from '@/lib';

const { width } = Dimensions.get('window');
const cardW = (width - 48) / 2;

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
        <ActivityIndicator animating={true} />
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
    <View style={styles.container}>
      <View style={styles.title}>
        <Text variant="bodyMedium">{Locales.t('garageTitleText')}</Text>
      </View>
      <View style={styles.grid}>
        {cars.map((car) => (
          <View key={car.id} style={styles.cardWrapper}>
            <Card style={styles.card}>
              <Card.Title
                title={`${car.name} ${car.model}`}
                subtitle={car.year}
              />
              <Card.Cover
                source={{
                  uri: car.car_image
                    ? `data:image/jpeg;base64,${car.car_image}`
                    : 'https://picsum.photos/200',
                }}
              />
            </Card>
          </View>
        ))}
      </View>
      <AnimatedFAB
        icon={'plus'}
        label={'Label'}
        extended={false}
        onPress={() => console.log('Pressed')}
        animateFrom={'right'}
        iconMode={'static'}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 320,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: cardW,
    marginBottom: 16,
  },
  card: {
    height: 200,
    overflow: 'hidden',
  },
  title: {
    flexDirection: 'column',
    gap: 4,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
});
