import ParallaxScrollView from '@/components/ParallaxScrollView';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';

export default function NewCar() {
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image source={require('@/assets/images/partial-react-logo.png')} />
			}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Welcome to your virtual garage!</Text>
				<Text style={styles.description}>Here is your collection of cars</Text>
			</View>
			<View style={styles.content}>
				<Text>Here form</Text>
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
	content: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingTop: 8,
		paddingBottom: 4,
	},
});
