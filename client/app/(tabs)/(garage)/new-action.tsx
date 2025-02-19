import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
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
import { Dropdown } from 'react-native-paper-dropdown';
import * as Yup from 'yup';

import { styles, Locales } from '@/lib';
import { Action } from '@/lib/types/Car';
import ArrowBack from '@/lib/ui/components/ArrowBack';

export default function NewAction() {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const { carId } = useLocalSearchParams<{ carId: string }>();

  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationKey: ['car'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car'] });
      setIsSnackbarVisible(true);
    },
    onError: () => {
      setIsSnackbarVisible(true);
    },
  });

  return (
    <Surface style={{ ...styles.screen, alignItems: undefined }}>
      <ArrowBack style={{ position: 'absolute', top: 16, left: 16 }} />
      <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
        {Locales.t('newCarAction')}
      </Text>
      <Formik
        initialValues={{
          action: '',
          details: '',
          cost: 0,
          type: 'repair',
          service_station_name: '',
        }}
        enableReinitialize
        onSubmit={(values: Omit<Action, 'id' | 'date'>) => mutate(values)}
        validationSchema={Yup.object().shape({
          action: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Please enter the action'),
          details: Yup.string()
            .max(200, 'Too Long!')
            .required('Please provide additional details'),
          cost: Yup.number().min(0, 'Cost cannot be negative'),
          type: Yup.string()
            .oneOf(
              ['repair', 'maintenance', 'inspection', 'other'],
              'Invalid type'
            )
            .required('Please select the type'),
          service_station_name: Yup.string().max(50, 'Too Long!'),
        })}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Surface elevation={0}>
              <TextInput
                mode="outlined"
                label="Action"
                value={values.action}
                error={!!errors.action}
                onBlur={handleBlur('action')}
                placeholder="e.g., Changed brakes"
                onChangeText={handleChange('action')}
              />
              <HelperText type="error" visible={!!errors.action}>
                {errors.action}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                mode="outlined"
                label="Details"
                multiline
                value={values.details}
                error={!!errors.details}
                onBlur={handleBlur('details')}
                placeholder="Enter details about the maintenance..."
                onChangeText={handleChange('details')}
              />
              <HelperText type="error" visible={!!errors.details}>
                {errors.details}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                mode="outlined"
                label="Cost"
                value={values.cost.toString()}
                error={!!errors.cost}
                onBlur={handleBlur('cost')}
                placeholder="Enter the cost"
                onChangeText={handleChange('cost')}
                keyboardType="numeric"
              />
              <HelperText type="error" visible={!!errors.cost}>
                {errors.cost}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <TextInput
                mode="outlined"
                label="Service Station Name"
                value={values.service_station_name}
                error={!!errors.service_station_name}
                onBlur={handleBlur('service_station_name')}
                placeholder="Optional"
                onChangeText={handleChange('service_station_name')}
              />
              <HelperText
                type="error"
                visible={!!errors.service_station_name}
              >
                {errors.service_station_name}
              </HelperText>
            </Surface>

            <Surface elevation={0}>
              <Dropdown
                label="Type"
                mode="outlined"
                placeholder="Type of action"
                options={[
                  { label: 'Repair', value: 'repair' },
                  { label: 'Maintenance', value: 'maintenance' },
                  { label: 'Inspection', value: 'inspection' },
                  { label: 'Other', value: 'other' },
                ]}
                value={values.type}
                onSelect={(value) => setFieldValue('type', value)}
              />
              <HelperText
                type="error"
                visible={touched.type && !!errors.type}
              >
                {errors.type}
              </HelperText>
            </Surface>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={isPending}
              disabled={isPending}
            >
              {Locales.t('submit')}
            </Button>
          </>
        )}
      </Formik>
      {isSnackbarVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '85%',
            zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center',
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
            {error
              ? (error as any).response?.data?.message ||
                'An error occurred.'
              : 'Action added successfully!'}
          </Snackbar>
        </View>
      )}
    </Surface>
  );
}
