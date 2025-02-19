import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Text,
  Avatar,
  List,
  Chip,
  useTheme,
  Button,
  IconButton,
  Menu,
} from 'react-native-paper';

import { useActionStore } from '@/lib/api/store/ActionStore';
import { useCarStore } from '@/lib/api/store/CarStore';
import UploadImage from '@/lib/modals/UploadImage';
import ViewAction from '@/lib/modals/ViewAction';
import ArrowBack from '@/lib/ui/components/ArrowBack';

type SortOption = 'date' | 'cost' | 'type' | 'action';

export default function ViewCar() {
  const theme = useTheme();
  const { carId } = useLocalSearchParams<{ carId: string }>();

  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [menuVisible, setMenuVisible] = useState(false);

  const { getCar } = useCarStore();
  const { getActions, getActionsById } = useActionStore();

  useMemo(() => {
    getActions();
  }, [getActions]);

  const car = getCar(carId);
  const actions = getActionsById(carId);

  if (!car) {
    return (
      <View style={styles.center}>
        <Text variant="bodyMedium">Car not found.</Text>
      </View>
    );
  }

  const sortedActions = [...actions].sort((a, b) => {
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
            uri: car.carImage ? car.carImage : 'https://picsum.photos/200',
          }}
          style={styles.carImage}
        />
        <UploadImage carId={car.id} />
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
          <Chip icon="car">{car.plateNumber}</Chip>
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
              description: car.plateNumber,
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
          <View style={styles.sortContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button onPress={() => setMenuVisible(true)}>
                  Sort by: {getSortLabel(sortBy)}
                </Button>
              }
            >
              {['date', 'cost', 'type', 'action'].map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setSortBy(option as SortOption);
                    setMenuVisible(false);
                  }}
                  title={getSortLabel(option as SortOption)}
                />
              ))}
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
          {sortedActions.map((action, index) => (
            <List.Item
              key={index}
              title={action.action || action.type}
              description={`${new Date(action.date).toLocaleDateString()} - $${action.cost}`}
              left={() => (
                <Avatar.Icon
                  size={32}
                  icon={getIconForEventType(action.type)}
                  style={{
                    backgroundColor: theme.colors.primary,
                    marginTop: 10,
                  }}
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
                      router.push(`/update-action?actionId=${action.id}`)
                    }
                  />
                </View>
              )}
              style={{ paddingLeft: 12, paddingRight: 12 }}
            />
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
    marginTop: 16,
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
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
});
