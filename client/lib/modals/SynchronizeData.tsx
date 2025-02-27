import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  Divider,
  List,
  useTheme,
  IconButton,
  Snackbar,
} from 'react-native-paper';

import { Locales } from '../locales';

export default function SynchronizeData() {
  const [visible, setVisible] = useState(false);
  const [syncId, setSyncId] = useState('');
  const [showSyncId, setShowSyncId] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const theme = useTheme();

  const handleSync = () => {
    const newSyncId = nanoid();
    setSyncId(newSyncId);
    setShowSyncId(true);
    console.log(newSyncId);
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(syncId);
    setSnackbarVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setShowSyncId(false);
    setSyncId('');
  };

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
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={styles.modalTitle}>Synchronize Data</Text>
          <Divider style={styles.divider} />

          {!showSyncId && (
            <Button
              mode="contained"
              style={styles.syncButton}
              onPress={handleSync}
            >
              Synchronize
            </Button>
          )}

          {showSyncId && (
            <View style={styles.resultContainer}>
              <View
                style={[
                  styles.syncIdBox,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primaryContainer,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.syncIdText,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                  selectable
                >
                  {syncId}
                </Text>
                <IconButton
                  icon={() => (
                    <Ionicons
                      name="copy-outline"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                  onPress={copyToClipboard}
                  style={styles.copyButton}
                />
              </View>

              <Button
                mode="outlined"
                style={styles.closeButton}
                onPress={closeModal}
              >
                Close
              </Button>
            </View>
          )}
        </Modal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={styles.snackbar}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          Sync ID copied to clipboard!
        </Snackbar>
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
    textAlign: 'center',
  },
  divider: {
    marginVertical: 10,
  },
  resultContainer: {
    width: '100%',
    marginTop: 10,
  },
  syncIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  syncIdText: {
    fontSize: 16,
    flex: 1,
    marginRight: 4,
  },
  copyButton: {
    margin: 0,
  },
  closeButton: {
    marginTop: 20,
  },
  syncButton: {
    marginVertical: 15,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 24,
  },
});
