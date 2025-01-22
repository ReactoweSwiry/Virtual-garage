import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
  IconButton,
  Menu,
} from 'react-native-paper';

import { deleteCarActionById } from '@/lib/api/mutations';
import { getCarById } from '@/lib/api/queries';
import UploadImage from '@/lib/modals/UploadImage';
import { Action } from '@/lib/types/Car';
import ArrowBack from '@/lib/ui/components/ArrowBack';

type SortOption = 'date' | 'cost' | 'type' | 'action';

export default function ViewCar() {
  const theme = useTheme();
  const { carId } = useLocalSearchParams<{ carId: string }>();

  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [menuVisible, setMenuVisible] = useState(false);

  const {
    data: carWithActions,
    isPending,
    error,
  } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => getCarById(carId),
    enabled: !!carId,
  });

  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationKey: ['car'],
    mutationFn: deleteCarActionById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car', carId] });
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

  const { car, actions } = carWithActions;

  const maintenanceHistory = [...actions];
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

  const getIconForEventType = (type: Action['type']) => {
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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.imageContainer}>
        <ArrowBack style={styles.arrowBack} />
        <Image
          source={{
            uri: car.car_image
              ? `data:image/jpeg;base64,${car.car_image}`
              : 'https://picsum.photos/200',
          }}
          style={styles.carImage}
        />
        <UploadImage carId={car.id as number} />
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
          onPress={() => router.push(`/new-action?carId=${carId}`)}
          style={styles.addButton}
        >
          New car action
        </Button>
      </View>

      <List.Section>
        <List.Accordion
          title="Car Details"
          left={(props) => <List.Icon {...props} icon="car-info" />}
        >
          {[
            {
              title: 'Manufacturer',
              description: car.name,
              icon: 'domain',
            },
            { title: 'Model', description: car.model, icon: 'car-side' },
            {
              title: 'Year',
              description: car.year,
              icon: 'calendar',
            },
            {
              title: 'Plate Number',
              description: car.plate_number,
              icon: 'card-text',
            },
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
          <View style={[styles.sortContainer]}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  Sort by: {getSortLabel(sortBy)}
                </Button>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSortBy('date');
                  setMenuVisible(false);
                }}
                title="Date"
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('cost');
                  setMenuVisible(false);
                }}
                title="Cost"
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('type');
                  setMenuVisible(false);
                }}
                title="Type"
              />
              <Menu.Item
                onPress={() => {
                  setSortBy('action');
                  setMenuVisible(false);
                }}
                title="action"
              />
            </Menu>
            <IconButton
              icon={
                sortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'
              }
              onPress={toggleSortOrder}
            />
          </View>
          {sortedMaintenanceHistory.map((event, index) => (
            <React.Fragment key={event.id}>
              <List.Item
                title={event?.action || event.type}
                description={`${new Date(event.date).toLocaleDateString()} - $${event?.cost}`}
                onPress={() => console.log('open modal here')}
                left={() => (
                  <Avatar.Icon
                    size={32}
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
                      onPress={() =>
                        router.push(`/?actionId=${event?.id}&mode=edit`)
                      }
                      style={styles.iconButton}
                    />
                    <IconButton
                      icon="trash-can"
                      onPress={() => mutate(event.id)}
                      style={styles.iconButton}
                    />
                  </View>
                )}
                style={{ paddingLeft: 8 }}
              />
              {index < sortedMaintenanceHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Accordion>
      </List.Section>
      {deleteError && (
        <View style={styles.center}>
          <Text variant="bodyMedium" style={{ color: 'red' }}>
            Error deleting event: {deleteError.message}
          </Text>
        </View>
      )}
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
  arrowBack: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
