import { Stack } from 'expo-router';

export default function GarageLayout() {
	return (
		<Stack>
			<Stack.Screen
				name='index'
				options={{ title: 'Garage' }}
			/>
			<Stack.Screen
				name='new-car'
				options={{ title: 'New car' }}
			/>
		</Stack>
	);
}
