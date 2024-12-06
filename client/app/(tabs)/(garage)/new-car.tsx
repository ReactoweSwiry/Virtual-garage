import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {
	View,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	Button,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import styles from '@/styles/garage/new-car';
import { FLASK_API_DEV } from '@/constants/api';
import PickImageModal from '@/components/garage/PickImageModal';

const carFormSchema = z.object({
	name: z.string().min(3, 'Atleast 3 characters long').max(25),
	model: z.string().min(3, 'Atleast 4 characters long').max(30),
	plate_number: z.string().min(4, 'Minimum 4 characters').max(10),
	year: z
		.number()
		.int()
		.min(1970)
		.refine((val) => `${val}`.length == 4, 'Year can only have 4 digits'),
});

export default function NewCar() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationKey: ['Cars'],
		mutationFn: async (data: z.infer<typeof carFormSchema>) => {
			await axios.post(`${FLASK_API_DEV}/car/add`, data);
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(carFormSchema),
		defaultValues: {
			name: '',
			model: '',
			plate_number: '',
			year: new Date().getFullYear(),
		},
	});

	const onSubmit = (data: z.infer<typeof carFormSchema>) => {
		mutate(data);
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image source={require('@/assets/images/partial-react-logo.png')} />
			}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Here you can add your car</Text>
				<Text style={styles.description}>
					Make sure to fill all the important for you information!
				</Text>
			</View>
			<View style={styles.container}>
				<TouchableOpacity style={styles.fileUpload}>
					<MaterialIcons
						name='upload-file'
						size={40}
						color='#007bff'
					/>
					<Text style={styles.fileUploadText}>Upload car image</Text>
				</TouchableOpacity>
				<View style={styles.dividerContainer}>
					<View style={styles.divider} />
					<Text style={styles.dividerText}>or</Text>
					<View style={styles.divider} />
				</View>
				<Text style={styles.additionalText}>
					Choose one of our icons that fits your car!
				</Text>
				<PickImageModal />
				<Controller
					control={control}
					name='name'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Name</Text>
							<TextInput
								style={[styles.input, errors.name && styles.inputError]}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								placeholder='Opel'
							/>
							{errors.name && (
								<Text style={styles.errorText}>{errors.name.message}</Text>
							)}
						</View>
					)}
				/>
				<Controller
					control={control}
					name='model'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Model</Text>
							<TextInput
								style={[styles.input, errors.model && styles.inputError]}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								placeholder='Astra'
							/>
							{errors.model && (
								<Text style={styles.errorText}>{errors.model.message}</Text>
							)}
						</View>
					)}
				/>
				<Controller
					control={control}
					name='year'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Year</Text>
							<TextInput
								style={[styles.input, errors.year && styles.inputError]}
								keyboardType='numeric'
								onBlur={onBlur}
								onChangeText={(text) =>
									onChange(text ? parseInt(text, 10) : '')
								}
								value={value ? value.toString() : ''}
								placeholder='2011'
							/>
							{errors.year && (
								<Text style={styles.errorText}>{errors.year.message}</Text>
							)}
						</View>
					)}
				/>
				<Controller
					control={control}
					name='plate_number'
					render={({ field: { onChange, onBlur, value } }) => (
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Car plate</Text>
							<TextInput
								style={[styles.input, errors.plate_number && styles.inputError]}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								placeholder='WZW 91230'
							/>
							{errors.plate_number && (
								<Text style={styles.errorText}>
									{errors.plate_number.message}
								</Text>
							)}
						</View>
					)}
				/>
				<View style={styles.buttonContainer}>
					<Button
						title={isPending ? 'Saving your new car...' : 'Add a new car'}
						onPress={handleSubmit(onSubmit)}
					/>
				</View>
				{isError && <Text style={styles.errorText}>{error.message}</Text>}
			</View>
		</ParallaxScrollView>
	);
}
