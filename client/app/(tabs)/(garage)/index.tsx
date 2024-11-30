import { Image, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { FLASK_API_DEV } from '@/constants/api';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import CarCard from './components/CarCard';
import AddCarCard from './components/AddCarCard';
import { Car } from './shared/types';

export default function Garage() {
	const {
		data: cars,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['Cars'],
		queryFn: async () => {
			const response = await axios.get(`${FLASK_API_DEV}/cars`);
			return response.data;
		},
	});

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image
					source={require('@/assets/images/partial-react-logo.png')}
					style={styles.reactLogo}
				/>
			}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Welcome to your virtual garage!</Text>
				<Text style={styles.description}>Here is your collection of cars</Text>
			</View>
			<View style={styles.content}>
				{isLoading ? (
					<Text>Preparing your vehicles...</Text> //Change to skeleton later
				) : (
					cars.map((car: Car) => (
						<View
							key={car.id}
							style={styles.card}>
							<CarCard {...car} />
						</View>
					))
				)}
				{!isLoading && <AddCarCard />}
				{error && (
					<Text>Error occured while preparing vehicles for you :(</Text>
				)}
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
	card: {
		paddingBottom: 12,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
	},
});
