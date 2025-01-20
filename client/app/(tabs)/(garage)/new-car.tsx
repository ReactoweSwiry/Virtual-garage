import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Surface,
  TextInput,
  HelperText,
  Text,
  Snackbar,
} from 'react-native-paper';
import * as Yup from 'yup';

import { styles } from '@/lib';
import { addCar } from '@/lib/api/mutations';
import { Car } from '@/lib/types/Car';

export default function NewCar() {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationKey: ['cars'],
    mutationFn: addCar,
    onError: () => {
      setIsSnackbarVisible(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });

  return (
    <Surface style={{ ...styles.screen, alignItems: undefined }}>
      <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
        Hi
      </Text>
      <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
        Add your car here
      </Text>
      <Formik
        initialValues={{
          name: '',
          model: '',
          plate_number: '',
          year: new Date().getFullYear().toString(),
        }}
        onSubmit={(values: Car) => mutate(values)}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3, 'Too Short!')
            .max(32, 'Too Long!')
            .required('Please enter a car name'),
          model: Yup.string()
            .min(2, 'Too Short! must be at least 8 characters.')
            .max(32, 'Too Long!')
            .required('Please enter car model'),
          plate_number: Yup.string()
            .min(4, 'Too Short! must be at least 4 characters.')
            .max(10, 'Too Long!')
            .required('Please enter car plate number'),
          year: Yup.number()
            .min(1970, 'Year must be 1970 or later')
            .max(
              new Date().getFullYear(),
              `Year can't exceed the current year`
            )
            .required('Please enter the manufacturing year'),
        })}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <Surface elevation={0}>
              <TextInput
                maxLength={32}
                mode="outlined"
                label="Car Name"
                value={values.name}
                error={!!errors.name}
                onBlur={handleBlur('name')}
                placeholder="Enter your car name..."
                onChangeText={handleChange('name')}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                maxLength={64}
                mode="outlined"
                label="Car Model"
                value={values.model}
                error={!!errors.model}
                onBlur={handleBlur('model')}
                placeholder="Enter your car model..."
                onChangeText={handleChange('model')}
              />
              <HelperText type="error" visible={!!errors.model}>
                {errors.model}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                maxLength={10}
                mode="outlined"
                label="Plate Number"
                value={values.plate_number}
                error={!!errors.plate_number}
                onBlur={handleBlur('plate_number')}
                placeholder="Enter your plate number..."
                onChangeText={(text) =>
                  handleChange('plate_number')(text.toUpperCase())
                }
              />
              <HelperText type="error" visible={!!errors.plate_number}>
                {errors.plate_number}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                maxLength={4}
                mode="outlined"
                label="Year"
                value={values.year.toString()}
                error={!!errors.year}
                onBlur={handleBlur('year')}
                keyboardType="numeric"
                placeholder="Enter the manufacturing year..."
                onChangeText={handleChange('year')}
              />
              <HelperText type="error" visible={!!errors.year}>
                {errors.year}
              </HelperText>
            </Surface>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={isPending}
            >
              Add Car
            </Button>
          </>
        )}
      </Formik>
      {isSnackbarVisible && (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <Snackbar
            visible
            onDismiss={() => setIsSnackbarVisible(false)}
            action={{
              label: 'Close',
              onPress: () => setIsSnackbarVisible(false),
            }}
          >
            {error?.message}
          </Snackbar>
        </View>
      )}
    </Surface>
  );
}
