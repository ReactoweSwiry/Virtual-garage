import React, { useState } from 'react';
import {
    Button,
    Surface,
    TextInput,
    HelperText,
    Text,
    Snackbar,
    Menu,
    Divider,
    TouchableRipple,
} from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { styles } from '@/lib';
import { addMaintenanceEvent } from '@/lib/api/mutations';
import { MaintenanceEvent } from '@/lib/types/Car';

export default function AddMaintenanceEvent() {
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
    const { id: idParam } = useLocalSearchParams();
    const id = Array.isArray(idParam) ? parseInt(idParam[0], 10) : parseInt(idParam, 10);
    const queryClient = useQueryClient();

    const [visible, setVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('repair');

    const { mutate, isPending, error } = useMutation({
        mutationKey: ['MaintenanceEvents', id],
        mutationFn: (values: any) => addMaintenanceEvent(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['MaintenanceEvents', id] });
            setIsSnackbarVisible(true);
        },
        onError: () => {
            setIsSnackbarVisible(true);
        },
    });

    return (
        <ScrollView>
            <Surface style={{ ...styles.screen, alignItems: undefined }}>
                <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                    Add Maintenance Event
                </Text>
                <Formik
                    initialValues={{
                        action: 'Change brakes and oil',
                        details: 'all brakes changed and oil changed 2L',
                        cost: 100,
                        type: 'repair',
                        service_station_name: 'Opole',
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
                        cost: Yup.number()
                            .min(0, 'Cost cannot be negative'),
                        type: Yup.string()
                            .oneOf(['repair', 'maintenance', 'inspection', 'other'], 'Invalid type')
                            .required('Please select the type'),
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
                                multiline={true}
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

                            <TouchableRipple onPress={() => setVisible(true)}>
                                <TextInput
                                    mode="outlined"
                                    label="Type"
                                    value={selectedType}
                                    editable={false}
                                    placeholder="Select type"
                                />
                            </TouchableRipple>
                            <Menu
                                visible={visible}
                                onDismiss={() => setVisible(false)}
                                anchor={<Text>Type: {selectedType}</Text>}
                            >
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedType('repair');
                                        handleChange('type')('repair');
                                        setVisible(false);
                                    }}
                                    title="Repair"
                                />
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedType('maintenance');
                                        handleChange('type')('maintenance');
                                        setVisible(false);
                                    }}
                                    title="Maintenance"
                                />
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedType('inspection');
                                        handleChange('type')('inspection');
                                        setVisible(false);
                                    }}
                                    title="Inspection"
                                />
                                <Divider />
                                <Menu.Item
                                    onPress={() => {
                                        setSelectedType('other');
                                        handleChange('type')('other');
                                        setVisible(false);
                                    }}
                                    title="Other"
                                />
                            </Menu>
                            <HelperText type="error" visible={!!errors.type}>
                                {errors.type}
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
        </ScrollView>
    );
}
