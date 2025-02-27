import { Ionicons } from '@expo/vector-icons';
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
  TextInput,
} from 'react-native-paper';

import { Locales } from '../locales';

export default function FetchSynchronizedData() {
  const [visible, setVisible] = useState(false);
  const [syncId, setSyncId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const theme = useTheme();

  const handleFetch = async () => {
    if (!syncId.trim()) {
      setErrorMessage('Please enter a valid Sync ID');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Simulate API call with timeout
    try {
      // In a real app, this would be your API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, just show success message
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch synchronized data');
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setVisible(false);
    setSyncId('');
    setIsSuccess(false);
    setErrorMessage('');
  };

  return (
    <>
      <List.Item
        title={Locales.t('fetchSyncData')}
        description={Locales.t('retrieveSyncedData')}
        left={(props) => <List.Icon {...props} icon="cloud-download" />}
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
          <Text style={styles.modalTitle}>Fetch Synchronized Data</Text>
          <Divider style={styles.divider} />

          {!isSuccess ? (
            <>
              <TextInput
                label="Sync ID"
                value={syncId}
                onChangeText={setSyncId}
                mode="outlined"
                error={!!errorMessage}
                disabled={isLoading}
              />

              {errorMessage ? (
                <Text
                  style={[styles.errorText, { color: theme.colors.error }]}
                >
                  {errorMessage}
                </Text>
              ) : null}

              <Button
                mode="contained"
                style={styles.fetchButton}
                onPress={handleFetch}
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Fetching...' : 'Fetch Data'}
              </Button>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View
                style={[
                  styles.successBox,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color={theme.colors.primary}
                  style={styles.successIcon}
                />
                <Text
                  style={[
                    styles.successText,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  Data successfully synchronized!
                </Text>
              </View>

              <Text style={styles.syncIdDisplay}>
                Sync ID:{' '}
                <Text style={{ fontWeight: 'bold' }}>{syncId}</Text>
              </Text>

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
  errorText: {
    marginTop: 4,
    fontSize: 14,
  },
  fetchButton: {
    marginTop: 20,
  },
  successContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  successIcon: {
    marginRight: 10,
  },
  successText: {
    fontSize: 16,
    fontWeight: '500',
  },
  syncIdDisplay: {
    marginTop: 15,
    fontSize: 15,
  },
  closeButton: {
    marginTop: 20,
    minWidth: 120,
  },
});
