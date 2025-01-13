import React, { useState } from 'react';
import {
    Button,
    Surface,
    TextInput,
    HelperText,
    Text,
    Snackbar,
    Menu,
    TouchableRipple,
} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { getMaintenanceDetails, addAction, updateCarActionById } from '@/lib/api/queries';
import { styles } from '@/lib';

export default function MaintenanceEventForm() {
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
    const queryClient = useQueryClient();
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const { mode, carId, actionId } = useLocalSearchParams();

    const { data: fetchedData, isLoading: isFetchingInitialData } = useQuery({
        queryKey: ['MaintenanceEvent', actionId],
        queryFn: () => (mode === 'edit' && actionId ? getMaintenanceDetails(actionId) : null),
        enabled: mode === 'edit' && !!actionId,
    });

    const initialData = React.useMemo(() => {
        if (fetchedData) {
            return {
                action: fetchedData.action || '',
                details: fetchedData.details || '',
                cost: fetchedData.cost?.toString() || '', // Ensure numeric data is a string for Formik
                type: fetchedData.type || 'repair',
                service_station_name: fetchedData.service_station_name || '',
            };
        }
        return {
            action: '',
            details: '',
            cost: '',
            type: 'repair',
            service_station_name: '',
        };
    }, [fetchedData]);

    console.log('initialData:', initialData);
    // Choose mutation function dynamically
    const mutationFn =
        mode === 'add'
            ? (values: any) => addAction(carId, values) // Add mode requires carId
            : (values: any) => updateCarActionById(actionId, values); // Edit mode requires actionId

    const { mutate, isPending, error } = useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries(['MaintenanceEvents']);
            setIsSnackbarVisible(true);
        },
        onError: () => {
            setIsSnackbarVisible(true);
        },
    });

    const handleFormSubmit = (values: any) => {
        if (mode === 'edit') {
            // Only send modified fields for edit
            const editedValues = Object.keys(values).reduce((result: any, key) => {
                if (values[key] !== initialData[key]) {
                    result[key] = values[key];
                }
                return result;
            }, {});
            mutate(editedValues);
        } else {
            // Send all fields for add
            mutate(values);
        }
    };

    if (isFetchingInitialData) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView>
            <Surface style={{ ...styles.screen, alignItems: undefined }}>
                <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                    {mode === 'add' ? 'Add Maintenance Event' : 'Edit Maintenance Event'}
                </Text>
                <Formik
                    initialValues={initialData}
                    enableReinitialize
                    onSubmit={handleFormSubmit}
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
                    }) => (
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
                            <HelperText
                                type="error"
                                visible={!!errors.service_station_name}
                            >
                                {errors.service_station_name}
                            </HelperText>

                            <TouchableRipple onPress={() => setMenuVisible(true)}>
                                <TextInput
                                    mode="outlined"
                                    label="Type"
                                    value={selectedType || values.type}
                                    editable={false}
                                    placeholder="Select type"
                                />
                            </TouchableRipple>
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={<Text>Type: {selectedType}</Text>}
                            >
                                {['repair', 'maintenance', 'inspection', 'other'].map(
                                    (type) => (
                                        <Menu.Item
                                            key={type}
                                            onPress={() => {
                                                setSelectedType(type);
                                                handleChange('type')(type);
                                                setMenuVisible(false);
                                            }}
                                            title={type.charAt(0).toUpperCase() + type.slice(1)}
                                        />
                                    )
                                )}
                            </Menu>
                            <HelperText type="error" visible={!!errors.type}>
                                {errors.type}
                            </HelperText>

                            <Button
                                mode="contained"
                                onPress={() => handleSubmit()}
                                loading={isPending}
                                disabled={(mode === 'add' && !carId) || (mode === 'edit' && !actionId)}
                            >
                                {mode === 'add' ? 'Add Maintenance Event' : 'Save Changes'}
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
                    {error
                        ? error.response?.data?.message || 'An error occurred.'
                        : mode === 'add'
                            ? 'Maintenance event added successfully!'
                            : 'Maintenance event updated successfully!'}
                </Snackbar>

            </Surface>
        </ScrollView>
    );
}
