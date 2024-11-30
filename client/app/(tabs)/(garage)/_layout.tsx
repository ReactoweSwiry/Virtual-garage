import { Stack } from 'expo-router';

export default function GarageLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='new-car'></Stack.Screen>
		</Stack>
	);
}
