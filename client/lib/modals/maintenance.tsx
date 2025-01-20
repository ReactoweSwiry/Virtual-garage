import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';

import { MaintenanceEvent } from '@/lib/types/Car';

interface MaintenanceDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  event: MaintenanceEvent | null;
}

export default function MaintenanceDetailsModal({
  visible,
  onDismiss,
  event,
}: MaintenanceDetailsModalProps) {
  const theme = useTheme();
  console.log(event);
  if (!event) return null;
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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <ScrollView>
          <Text style={styles.modalTitle}>
            {event.type || event.action}
          </Text>
          <Divider style={styles.divider} />
          <List.Item
            title="Title"
            description={event.action}
            left={(props) => (
              <List.Icon
                {...props}
                icon={getIconForEventType(event.type)}
              />
            )}
          />
          <List.Item
            title="Date"
            description={new Date(event.date).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Cost"
            description={`$${event.cost.toFixed(2)}`}
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
          />
          <List.Item
            title="Description"
            description={event.details}
            left={(props) => <List.Icon {...props} icon="text" />}
          />
          <Divider style={styles.divider} />
          <View style={styles.modalActions}>
            <Button onPress={onDismiss}>Close</Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
