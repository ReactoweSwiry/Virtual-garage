import { StyleSheet } from 'react-native';

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

export default styles;
