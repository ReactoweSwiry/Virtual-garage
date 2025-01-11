import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Text,
  ActivityIndicator,
  List,
  Divider,
  Avatar,
  Chip,
  useTheme,
} from 'react-native-paper';

import { getCarById } from '@/lib/api/queries';
import { Car } from '@/lib/types/Car';
import EditCarImage from '@/lib/modals/edit-car-image';

interface CarResponse {
  car: Car;
}

interface MaintenanceEvent {
  id: string;
  date: string;
  type: 'repair' | 'oil_change' | 'inspection';
  description: string;
  cost: number;
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
        <ActivityIndicator animating={true} size="large" />
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

  const { car } = data.car;
  console.log(car);

  const maintenanceHistory: MaintenanceEvent[] = [
    {
      id: '1',
      date: '2023-05-15',
      type: 'oil_change',
      description: 'Regular oil change',
      cost: 50,
    },
    {
      id: '2',
      date: '2023-03-10',
      type: 'repair',
      description: 'Brake pad replacement',
      cost: 200,
    },
    {
      id: '3',
      date: '2023-01-05',
      type: 'inspection',
      description: 'Annual inspection',
      cost: 100,
    },
  ];

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
        <EditCarImage carId={id} />
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
                title={event.description}
                description={`${event.date} - $${event.cost}`}
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
