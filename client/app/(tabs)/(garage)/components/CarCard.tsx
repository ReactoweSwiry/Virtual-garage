import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

export default function CarCard({ carNo }: { carNo: number }) {
	return (
		<View style={styles.card}>
			<Text style={styles.cardText}>Car #{carNo}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#1D3D47',
		borderRadius: 8,
		width: cardWidth,
		height: 140,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
});
