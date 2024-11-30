import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayout() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 5 * (60 * 1000), // Keep data in cache for 5 minutes
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={DefaultTheme}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name='(tabs)' />
					<Stack.Screen name='+not-found' />
				</Stack>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
