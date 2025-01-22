import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Text,
  Avatar,
  ActivityIndicator,
  List,
  Chip,
  useTheme,
  Button,
  IconButton,
  Menu,
} from 'react-native-paper';

import { deleteCarActionById } from '@/lib/api/mutations';
import { getCarById } from '@/lib/api/queries';
import UploadImage from '@/lib/modals/UploadImage';
import ArrowBack from '@/lib/ui/components/ArrowBack';
import ViewAction from '@/lib/modals/ViewAction';

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

  const getIconForEventType = (type: string) => {
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
      <View style={{ padding: 16 }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>
          {car.name}
        </Text>
        <Text variant="titleLarge" style={{ marginTop: 4 }}>
          {car.model}
        </Text>
        <View style={styles.chipContainer}>
          <Chip icon="calendar">{car.year}</Chip>
          <Chip icon="car">{car.plate_number}</Chip>
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
              onPress={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
            />
          </View>
          {sortedMaintenanceHistory.map((action, index) => (
            <List.Item
              key={index}
              title={action.action || action.type}
              description={`${new Date(action.date).toLocaleDateString()} - $${action.cost}`}
              left={() => (
                <Avatar.Icon
                  size={32}
                  icon={getIconForEventType(action.type)}
                  style={[
                    styles.eventIcon,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
              right={() => (
                <View style={styles.iconButtonsContainer}>
                  <ViewAction
                    action={action}
                    getIconForEventType={getIconForEventType}
                  />
                  <IconButton
                    icon="pencil"
                    onPress={() =>
                      router.push(`/?actionId=${action.id}&mode=edit`)
                    }
                  />
                  <IconButton
                    icon="trash-can"
                    onPress={() => mutate(action.id)}
                  />
                </View>
              )}
              style={{ paddingLeft: 16 }}
            />
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
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  eventIcon: {
    marginTop: 10,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
});
