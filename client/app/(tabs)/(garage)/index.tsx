import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
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
import { Car } from '@/lib/types/Car';
import { CarApiResponse } from '@/lib/interfaces/CarApiResponse';

export default function Garage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
    isPending,
    error,
  } = useInfiniteQuery({
    queryKey: ['cars'],
    queryFn: getCars,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage;
      return page < total_pages ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage;
      return page > 1 ? page - 1 : undefined;
    },
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

  const pageIndex =
    data.pageParams.length === 1
      ? (data.pageParams[0] as number)
      : (data.pageParams[data.pageParams.length - 1] as number);

  return (
    <Surface style={styles.container}>
      <View style={styles.title}>
        <Text variant="bodyMedium">{Locales.t('garageTitleText')}</Text>
      </View>
      <View style={styles.grid}>
        {data.pages[pageIndex - 1].cars.map((car) => (
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
      <View style={styles.bottomContainer}>
        <View style={styles.paginationContainer}>
          <IconButton
            icon="arrow-left"
            size={18}
            onPress={() => fetchPreviousPage()}
            disabled={!hasPreviousPage || isFetchingPreviousPage}
          />
          <Text variant="bodyMedium">Page {pageIndex}</Text>
          <IconButton
            icon="arrow-right"
            size={18}
            onPress={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
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
    height: 195,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pageNumber: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'relative',
    bottom: 0,
    right: 0,
  },
});
