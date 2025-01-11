import { Fragment, useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import {
  Modal,
  Portal,
  IconButton,
  useTheme,
  Button,
} from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

import { uploadCarImage } from '../api/mutations';
import { Locales } from '../locales';

export default function EditCarImage({ carId }: { carId: number }) {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  const theme = useTheme();

  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationKey: ['Car', carId],
    mutationFn: ({ carId, file }: { carId: number; file: File }) =>
      uploadCarImage(carId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Car'] });
    },
  });

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
    }
  };

  return (
    <Fragment>
      <Portal>
        <Modal
          visible={visible}
          dismissable={true}
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
              <Button
                onPress={() => mutate({ carId, file: image.file as File })}
                loading={isPending}
              >
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
    </Fragment>
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
