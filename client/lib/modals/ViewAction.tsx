import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  List,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';

import { useActionStore } from '../api/store/ActionStore';
import { Action } from '../api/types';

export default function ViewAction({
  action,
  getIconForEventType,
}: {
  action: Action;
  getIconForEventType: (type: string) => string;
}) {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();
  const { removeAction } = useActionStore();

  return (
    <>
      <IconButton
        icon="eye"
        onPress={() => setVisible(true)}
        style={styles.iconButton}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={styles.modalTitle}>
            {action.type || action.action}
          </Text>
          <Divider style={styles.divider} />
          <List.Item
            title="Title"
            description={action.action}
            left={(props) => (
              <List.Icon
                {...props}
                icon={getIconForEventType(action.type)}
              />
            )}
          />
          <List.Item
            title="Date"
            description={new Date(action.date).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Cost"
            description={action.cost}
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
          />
          <List.Item
            title="Description"
            description={action.details}
            left={(props) => <List.Icon {...props} icon="text" />}
          />
          <Divider style={styles.divider} />
          <View style={styles.modalActions}>
            <Button
              icon="trash-can"
              onPress={() => removeAction(action.id)}
            >
              Remove
            </Button>
            <Button onPress={() => setVisible(false)}>Close</Button>
          </View>
        </Modal>
      </Portal>
    </>
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
    textTransform: 'capitalize',
  },
  divider: {
    marginVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIcon: {
    marginRight: 8,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 4,
  },
});
