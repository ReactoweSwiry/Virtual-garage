import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ImageBackground,
} from 'react-native';
import { Car } from '../shared/types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

export default function CarCard({ name, model, year, car_image }: Car) {
	return (
		<View style={styles.card}>
			<ImageBackground
				source={{ uri: `data:image/jpeg;base64,${car_image}` }}
				style={styles.imageBackground}
				imageStyle={styles.image}>
				<View style={styles.infoContainer}>
					<Text style={styles.infoText}>
						{name} {model} - {year}
					</Text>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 8,
		width: cardWidth,
		height: 140,
		overflow: 'hidden',
		backgroundColor: '#ccc', // Fallback background color
	},
	imageBackground: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	image: {
		borderRadius: 8,
	},
	infoContainer: {
		backgroundColor: 'white',
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
	infoText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1D3D47',
	},
});
