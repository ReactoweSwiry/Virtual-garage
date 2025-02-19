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
import { useActionStore } from '@/lib/api/store/ActionStore';
import { Action } from '@/lib/api/types';
import ArrowBack from '@/lib/ui/components/ArrowBack';

export default function UpdateAction() {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [error, setError] = useState('');

  const { actionId } = useLocalSearchParams<{ actionId: string }>();
  const { getAction, updateAction } = useActionStore();

  const action = getAction(actionId);

  if (!action) {
    return;
  }

  return (
    <Surface style={{ ...styles.screen, alignItems: undefined }}>
      <ArrowBack style={{ position: 'absolute', top: 16, left: 16 }} />
      <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
        {Locales.t('editCarAction')}
      </Text>
      <Formik
        initialValues={{
          action: action.action,
          details: action.details,
          cost: action.cost,
          type: action.type,
          serviceStation: action.serviceStation || '',
        }}
        enableReinitialize
        onSubmit={(values: Partial<Action>, { setSubmitting }) => {
          try {
            updateAction(actionId, values);
            setIsSnackbarVisible(true);
          } catch (error) {
            console.error(error);
            setError('Something went wrong, please try again');
            setIsSnackbarVisible(true);
          } finally {
            setSubmitting(false);
          }
        }}
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
          serviceStation: Yup.string().max(50, 'Too Long!'),
        })}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
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
                value={values.cost?.toString()}
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
                label="Service Station"
                value={values.serviceStation}
                error={!!errors.serviceStation}
                onBlur={handleBlur('serviceStation')}
                onChangeText={handleChange('serviceStation')}
              />
              <HelperText type="error" visible={!!errors.serviceStation}>
                {errors.serviceStation}
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
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {Locales.t('submit')}
            </Button>
          </>
        )}
      </Formik>
      {isSnackbarVisible && (
        <View
          style={{
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
            {error ? error : 'Action updated successfully!'}
          </Snackbar>
        </View>
      )}
    </Surface>
  );
}
