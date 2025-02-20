import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Divider,
  List,
  useTheme,
} from 'react-native-paper';

import { Locales } from '../locales';

export default function SynchronizeData() {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const theme = useTheme();

  return (
    <>
      <List.Item
        title={Locales.t('syncOnline')}
        description={Locales.t('syncWithDb')}
        left={(props) => <List.Icon {...props} icon="cloud" />}
        onPress={() => setVisible(true)}
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
          <Text style={styles.modalTitle}>Synchronize Data</Text>
          <Divider style={styles.divider} />

          <TextInput
            style={[
              styles.input,
              {
                color: theme.colors.secondary,
                borderColor: theme.colors.backdrop,
              },
            ]}
            placeholder="Enter name"
            value={inputValue}
            onChangeText={setInputValue}
          />

          <Button
            mode="contained"
            style={styles.syncButton}
            onPress={() => {}}
          >
            Synchronize
          </Button>
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
  },
  divider: {
    marginVertical: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 4,
  },
  input: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  syncButton: {
    marginBottom: 10,
  },
});
