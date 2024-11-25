import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
	return (
		<Fragment>
			<View style={styles.titleContainer}>
				<Text>Welcome!</Text>
			</View>
			<View style={styles.stepContainer}>
				<Text>Settings app</Text>
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
});
