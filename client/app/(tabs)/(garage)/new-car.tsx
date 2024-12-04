import ParallaxScrollView from '@/components/ParallaxScrollView';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

import Button from '@/components/ui/Button';

async function PickFile() {
	try {
		const result = await DocumentPicker.getDocumentAsync({});
		console.log(result);
	} catch (err) {
		Alert.alert('Error', 'Failed to pick a file');
	}
}

export default function NewCar() {
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
				<TouchableOpacity
					style={styles.fileUpload}
					onPress={PickFile}>
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
					We will pick an icon that correspondts to the type of your vehicle!
				</Text>
				<TextInput
					style={styles.input}
					placeholder='Name'
				/>
				<TextInput
					style={styles.input}
					placeholder='Model'
				/>
				<TextInput
					style={styles.input}
					placeholder='Year'
					keyboardType='numeric'
				/>
				<Button title='Save' />
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'column',
		gap: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	description: {
		fontSize: 14,
		fontWeight: 300,
	},
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	fileUpload: {
		borderWidth: 2,
		borderColor: '#007bff',
		borderStyle: 'dashed',
		borderRadius: 5,
		padding: 20,
		marginBottom: 15,
		alignItems: 'center',
	},
	fileUploadText: {
		color: '#007bff',
		fontSize: 14,
		fontWeight: 'semibold',
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: 'black',
		opacity: 0.25,
	},
	dividerText: {
		paddingHorizontal: 10,
		opacity: 0.5,
		fontSize: 14,
	},
	additionalText: {
		fontSize: 14,
		textAlign: 'center',
		opacity: 0.75,
		paddingVertical: 20,
	},
	input: {
		padding: 10,
		borderRadius: 5,
		marginBottom: 15,
	},
	button: {
		textTransform: 'capitalize',
	},
});
