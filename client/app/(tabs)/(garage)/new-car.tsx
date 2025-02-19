import { Formik } from 'formik';
import { useState } from 'react';
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
import { useCarStore } from '@/lib/api/store/carStore';
import ArrowBack from '@/lib/ui/components/ArrowBack';

export default function NewCar() {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { addCar } = useCarStore();

  return (
    <Surface style={{ ...styles.screen, alignItems: undefined }}>
      <ArrowBack style={{ position: 'absolute', top: 16, left: 16 }} />
      <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
        Hi! Thank you for using our app!
      </Text>
      <Text
        variant="bodyLarge"
        style={{ textAlign: 'center', paddingVertical: 16 }}
      >
        Add your car here
      </Text>
      <Formik
        initialValues={{
          name: '',
          model: '',
          plateNumber: '',
          year: new Date().getFullYear().toString(),
        }}
        onSubmit={(values, { resetForm }) => {
          try {
            addCar(values);
            setSnackbarMessage('Car added successfully!');
            resetForm();
          } catch (error: unknown) {
            console.error(error);
            setSnackbarMessage('Failed to add car.');
          }
          setIsSnackbarVisible(true);
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3, 'Too Short!')
            .max(32, 'Too Long!')
            .required('Please enter a car name'),
          model: Yup.string()
            .min(2, 'Too Short! must be at least 8 characters.')
            .max(32, 'Too Long!')
            .required('Please enter car model'),
          plateNumber: Yup.string()
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
                value={values.plateNumber}
                error={!!errors.plateNumber}
                onBlur={handleBlur('plateNumber')}
                placeholder="Enter your plate number..."
                onChangeText={(text) =>
                  handleChange('plateNumber')(text.toUpperCase())
                }
              />
              <HelperText type="error" visible={!!errors.plateNumber}>
                {errors.plateNumber}
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

            <Button mode="contained" onPress={() => handleSubmit()}>
              Add Car
            </Button>
          </>
        )}
      </Formik>

      {isSnackbarVisible && (
        <Snackbar
          visible
          onDismiss={() => setIsSnackbarVisible(false)}
          action={{
            label: 'Close',
            onPress: () => setIsSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      )}
    </Surface>
  );
}
