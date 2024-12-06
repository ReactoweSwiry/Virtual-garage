import React, { useState } from 'react';
import {
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type DefaultImage = {
	id: number;
	src: number;
};

const defaultImages: DefaultImage[] = [
	{
		id: 1,
		src: require('@/assets/images/car_red_1.png'),
	},
	{
		id: 2,
		src: require('@/assets/images/car_white_1.png'),
	},
	{
		id: 3,
		src: require('@/assets/images/car_white_2.png'),
	},
];

export default function PickImageModal() {
	const [open, setOpen] = useState(false);
	const [image, setImage] = useState<number | null>(null);

	const handleImagePress = (imageSrc: number) => {
		setImage(imageSrc);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={styles.imagePicker}
				onPress={() => setOpen(true)}>
				<MaterialIcons
					name='car-crash'
					size={32}
					color='#007bff'
				/>
			</TouchableOpacity>
			<Modal
				animationType='slide'
				transparent={true}
				visible={open}
				onRequestClose={() => setOpen(false)} // Handle back button press on Android
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.imageRow}>
							{defaultImages.map((image) => (
								<TouchableOpacity
									onPress={() => handleImagePress(image.id)}
									key={image.id}>
									<Image
										source={image.src}
										style={styles.image}
									/>
								</TouchableOpacity>
							))}
						</View>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setOpen(false)}>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 4,
	},
	imagePicker: {
		width: 90,
		height: 90,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		alignSelf: 'center',
		elevation: 5, // Adds shadow for Android
		borderWidth: 2,
		borderColor: '#007bff',
		borderStyle: 'dashed',
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
	},
	modalContent: {
		width: '90%',
		padding: 20,
		backgroundColor: '#FFF',
		borderRadius: 10,
		elevation: 5, // Adds shadow for Android
	},
	imageRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingVertical: 20,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 8,
		borderColor: 'black',
		borderWidth: 1,
	},
	closeButton: {
		backgroundColor: '#007bff',
		padding: 10,
		borderRadius: 8,
	},
	closeButtonText: {
		color: '#FFF',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
