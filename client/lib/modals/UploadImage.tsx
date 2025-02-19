import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import {
  Modal,
  Portal,
  IconButton,
  useTheme,
  Button,
} from 'react-native-paper';

import { useCarStore } from '../api/store/carStore';
import { Locales } from '../locales';

export default function UploadImage({ carId }: { carId: string }) {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const { uploadImage } = useCarStore();

  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    } else {
      setError(
        'Somehting went wrong, please try again or contact support'
      );
    }
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          dismissable
          onDismiss={() => setVisible(false)}
          contentContainerStyle={[
            styles.container,
            {
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <View style={styles.picker}>
            <Button onPress={imagePicker}>
              {Locales.t('uploadCarImage')}
            </Button>
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={[
                  styles.image,
                  {
                    borderWidth: 8,
                    borderColor: theme.colors.backdrop,
                  },
                ]}
              />
            )}
            {image && (
              <Button onPress={() => uploadImage(carId, image.uri)}>
                Upload
              </Button>
            )}
          </View>
          {error && (
            <Text
              style={{
                color: theme.colors.error,
                paddingTop: 8,
                textAlign: 'center',
              }}
            >
              {Locales.t('errorTextCommon')}
            </Text>
          )}
        </Modal>
      </Portal>
      <IconButton
        icon="pencil"
        size={24}
        style={[
          styles.editIcon,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        onPress={() => setVisible(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
  },
  picker: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  image: {
    width: 120,
    height: 120,
  },
  editIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
});
