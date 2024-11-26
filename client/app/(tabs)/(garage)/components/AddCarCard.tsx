import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

export default function AddCarCard() {
	return (
		<View style={styles.card}>
			<Text style={styles.cardText}>+</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: 'transparent',
		borderRadius: 8,
		borderColor: '#1D3D47',
		borderStyle: 'dotted',
		borderWidth: 2,
		width: cardWidth,
		height: 140,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardText: {
		color: '#1D3D47',
		fontSize: 64,
		paddingBottom: 16,
		fontWeight: '600',
	},
});
