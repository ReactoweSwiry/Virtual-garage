
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import {
  Text,
  ActivityIndicator,
  List,
  Divider,
  Avatar,
  Chip,
  useTheme,
  Button,
  IconButton,
  Menu,
} from 'react-native-paper';

import MaintenanceDetailsModal from '@/lib/modals/maintenance';
import { getCarById, deleteCarActionById } from '@/lib/api/queries';
import EditCarImage from '@/lib/modals/edit-car-image';
import { Car, MaintenanceEvent } from '@/lib/types/Car';

interface CarResponse {
  car: Car;
}

type SortOption = 'date' | 'cost' | 'type' | 'action';

export default function ViewCar() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isPending, error, refetch } = useQuery<
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

  const {
    mutate: deleteCarAction,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationKey: ['DeleteAction'],
    mutationFn: async (eventId: string) => {
      await deleteCarActionById(eventId);
    },
    onSuccess: () => {
      refetch();
      console.log('Maintenance event deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Delete failed:', error.message);
    },
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
  const sortedMaintenanceHistory = maintenanceHistory.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'cost':
        return sortOrder === 'asc' ? a.cost - b.cost : b.cost - a.cost;
      case 'type':
        return sortOrder === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      case 'action':
        return sortOrder === 'asc'
          ? a.action.localeCompare(b.action)
          : b.action.localeCompare(a.action);
      default:
        return 0;
    }
  });

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

  const handleDelete = (eventId: string) => {
    deleteCarAction(eventId);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'date':
        return 'Date';
      case 'cost':
        return 'Cost';
      case 'type':
        return 'Type';
      case 'action':
        return 'Action';
    }
  };

  const showEventDetails = (event: MaintenanceEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
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
        <Button
          mode="outlined"
          onPress={() => router.push(`/maintenance?carId=${id}&mode=add`)}
          style={styles.addButton}
        >
          Add Maintenance
        </Button>
      </View>

      <List.Section>
        <List.Accordion
          title="Car Details"
          left={(props) => <List.Icon {...props} icon="car-info" />}
        >
          {[
            { title: 'Manufacturer', description: car.manufacturer, icon: 'domain' },
            { title: 'Model', description: car.model, icon: 'car-side' },
            { title: 'Year', description: car.year?.toString(), icon: 'calendar' },
            { title: 'Color', description: car.color, icon: 'palette' },
            { title: 'VIN', description: car.vin, icon: 'barcode' },
            { title: 'Plate Number', description: car.plate_number, icon: 'card-text' },
            { title: 'Mileage', description: `${car.mileage} km`, icon: 'speedometer' },
          ].map((item, index) => (
            <List.Item
              key={index}
              title={item.title}
              description={item.description || 'N/A'}
              left={() => <List.Icon icon={item.icon} />}
              style={{ marginLeft: 16 }}
            />
          ))}
        </List.Accordion>

        <List.Accordion
          title="Maintenance History"
          left={(props) => <List.Icon {...props} icon="history" />}
        >
          <View style={[
            styles.sortContainer,
            width > 600 ? styles.sortContainerWide : null
          ]}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  Sort by: {getSortLabel(sortBy)}
                </Button>
              }
            >
              <Menu.Item onPress={() => { setSortBy('date'); setMenuVisible(false); }} title="Date" />
              <Menu.Item onPress={() => { setSortBy('cost'); setMenuVisible(false); }} title="Cost" />
              <Menu.Item onPress={() => { setSortBy('type'); setMenuVisible(false); }} title="Type" />
              <Menu.Item onPress={() => { setSortBy('action'); setMenuVisible(false); }} title="action" />
            </Menu>
            <IconButton
              icon={sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
              onPress={toggleSortOrder}
            />
          </View>
          {sortedMaintenanceHistory.map((event, index) => (
            <React.Fragment key={event.id}>
              <List.Item
                title={event?.action || event.type || event.description}
                description={`${new Date(event.date).toLocaleDateString()} - $${event?.cost}`}
                onPress={() => showEventDetails(event)}
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
                right={() => (
                  <View style={styles.iconButtonsContainer}>
                    <IconButton
                      icon="pencil"
                      onPress={() => router.push(`/maintenance?actionId=${event?.id}&mode=edit`)}
                      style={styles.iconButton}
                    />
                    <IconButton
                      icon="trash-can"
                      onPress={() => handleDelete(event?.id.toString())}
                      style={styles.iconButton}
                    />
                  </View>
                )}
                style={{ marginLeft: 8 }}
              />
              {index < sortedMaintenanceHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Accordion>
      </List.Section>
      {isDeleting && (
        <View style={styles.center}>
          <ActivityIndicator animating={true} size="small" />
          <Text variant="bodyMedium">Deleting...</Text>
        </View>
      )}
      {deleteError && (
        <View style={styles.center}>
          <Text variant="bodyMedium" style={{ color: 'red' }}>
            Error deleting event: {deleteError.message}
          </Text>
        </View>
      )}
      <MaintenanceDetailsModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        event={selectedEvent}
      />
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
  iconButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortContainerWide: {
    justifyContent: 'flex-end',
  },
});