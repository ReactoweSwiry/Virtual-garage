import React, { useState } from 'react';
import {
    Button,
    Surface,
    TextInput,
    HelperText,
    Text,
    Snackbar,
} from 'react-native-paper';
import { View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { styles } from '@/lib';
import { addMaintenanceEvent } from '@/lib/api/mutations';
import { MaintenanceEvent } from '@/lib/types/Car';

export default function AddMaintenanceEvent() {
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
    const { id } = useLocalSearchParams(); // Get car_id
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationKey: ['MaintenanceEvents', id],
        mutationFn: (values: any) => addMaintenanceEvent(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries(['MaintenanceEvents', id]);
            setIsSnackbarVisible(true);
        },
        onError: () => {
            setIsSnackbarVisible(true);
        },
    });

    return (
        <Surface style={{ ...styles.screen, alignItems: undefined }}>
            <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                Add Maintenance Event
            </Text>
            <Formik
                initialValues={{
                    action: 'Change brakes and oil',
                    details: 'XDDDDDD',
                    service_station_name: '',
                }}
                onSubmit={(values) => mutate(values)}
                validationSchema={Yup.object().shape({
                    action: Yup.string()
                        .min(2, 'Too Short!')
                        .max(50, 'Too Long!')
                        .required('Please enter the action'),
                    details: Yup.string()
                        .max(200, 'Too Long!')
                        .required('Please provide additional details'),
                    service_station_name: Yup.string().max(50, 'Too Long!'),
                })}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>
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

                        <TextInput
                            mode="outlined"
                            label="Details"
                            value={values.details}
                            error={!!errors.details}
                            onBlur={handleBlur('details')}
                            placeholder="Enter details about the maintenance..."
                            onChangeText={handleChange('details')}
                        />
                        <HelperText type="error" visible={!!errors.details}>
                            {errors.details}
                        </HelperText>

                        <TextInput
                            mode="outlined"
                            label="Service Station Name"
                            value={values.service_station_name}
                            error={!!errors.service_station_name}
                            onBlur={handleBlur('service_station_name')}
                            placeholder="Optional"
                            onChangeText={handleChange('service_station_name')}
                        />
                        <HelperText type="error" visible={!!errors.service_station_name}>
                            {errors.service_station_name}
                        </HelperText>

                        <Button
                            mode="contained"
                            onPress={() => handleSubmit()}
                            loading={isPending}
                        >
                            Add Maintenance Event
                        </Button>
                    </>
                )}
            </Formik>
            <Snackbar
                visible={isSnackbarVisible}
                onDismiss={() => setIsSnackbarVisible(false)}
                action={{
                    label: 'Close',
                    onPress: () => setIsSnackbarVisible(false),
                }}
            >
                {error ? error.message : 'Maintenance event added successfully!'}
            </Snackbar>
        </Surface>
    );
}
