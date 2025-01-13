import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Text,
  ActivityIndicator,
  List,
  Divider,
  Avatar,
  Chip,
  useTheme,
  Button,
} from 'react-native-paper';

import { getCarById } from '@/lib/api/queries';
import EditCarImage from '@/lib/modals/edit-car-image';
import { Car, MaintenanceEvent } from '@/lib/types/Car';

interface CarResponse {
  car: Car;
}

export default function ViewCar() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();

  const { data, isPending, error } = useQuery<
    CarResponse | undefined,
    Error
  >({
    queryKey: ['Car', id],
    queryFn: async () => {
      const car = await getCarById(id);
      return { car };
    },
    enabled: !!id,
  });

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating size="large" />
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

  if (!data) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Car not found</Text>
      </View>
    );
  }

  const { car, actions }: any = data.car;

  const maintenanceHistory: MaintenanceEvent[] = [...actions];

  const getIconForEventType = (type: MaintenanceEvent['type']) => {
    switch (type) {
      case 'repair':
        return 'wrench';
      case 'oil_change':
        return 'oil';
      case 'inspection':
        return 'clipboard-check';
      default:
        return 'car';
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: car.car_image
              ? `data:image/jpeg;base64,${car.car_image}`
              : 'https://picsum.photos/200',
          }}
          style={styles.carImage}
        />
        <EditCarImage carId={car.id as number} />
      </View>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.carName}>
          {car.name}
        </Text>
        <Text variant="titleLarge" style={styles.carModel}>
          {car.model}
        </Text>
        <View style={styles.chipContainer}>
          <Chip icon="calendar" style={styles.chip}>
            {car.year}
          </Chip>
          <Chip icon="car" style={styles.chip}>
            {car.plate_number}
          </Chip>
        </View>
        <>
          <Button
            mode="outlined"
            onPress={() => router.push(`/maintenance?id=${id}`)}
            style={styles.addButton}
          >
            Add Maintenance
          </Button>
        </>
      </View>

      <List.Section>
        <List.Accordion
          title="Car Details"
          left={(props) => <List.Icon {...props} icon="car-info" />}
        >
          {[
            {
              title: 'Manufacturer',
              description: car.manufacturer,
              icon: 'domain',
            },
            { title: 'Model', description: car.model, icon: 'car-side' },
            {
              title: 'Year',
              description: car.year?.toString(),
              icon: 'calendar',
            },
            { title: 'Color', description: car.color, icon: 'palette' },
            { title: 'VIN', description: car.vin, icon: 'barcode' },
            {
              title: 'Plate Number',
              description: car.plate_number,
              icon: 'card-text',
            },
            {
              title: 'Mileage',
              description: `${car.mileage} km`,
              icon: 'speedometer',
            },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <List.Item
                key={index}
                title={item.title}
                description={item.description || 'N/A'}
                left={() => <List.Icon icon={item.icon} />}
                style={{ marginLeft: 16 }}
              />
            </React.Fragment>
          ))}
        </List.Accordion>

        <List.Accordion
          title="Maintenance History"
          left={(props) => <List.Icon {...props} icon="history" />}
        >
          {maintenanceHistory.map((event, index) => (
            <React.Fragment key={event.id}>
              <List.Item
                title={event.action || event.type || event.description}
                description={`${new Date(event.date).toLocaleDateString()} - $${event?.cost}`}
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={getIconForEventType(event.type)}
                    style={[
                      styles.eventIcon,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                )}
                style={{ marginLeft: 8 }}
              />
              {index < maintenanceHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Accordion>
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    right: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    padding: 16,
  },
  carName: {
    fontWeight: 'bold',
  },
  carModel: {
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
  },
  eventIcon: {
    margin: 8,
  },
});
