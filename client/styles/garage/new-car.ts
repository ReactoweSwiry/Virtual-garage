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
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	fileUpload: {
		borderWidth: 2,
		borderColor: '#007bff',
		borderStyle: 'dashed',
		borderRadius: 5,
		padding: 20,
		marginBottom: 15,
		alignItems: 'center',
	},
	fileUploadText: {
		color: '#007bff',
		fontSize: 14,
		fontWeight: 'semibold',
	},
	dividerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: 'black',
		opacity: 0.25,
	},
	dividerText: {
		paddingHorizontal: 10,
		opacity: 0.5,
		fontSize: 14,
	},
	additionalText: {
		fontSize: 14,
		textAlign: 'center',
		opacity: 0.75,
		paddingVertical: 8,
	},
	inputContainer: {
		paddingBottom: 12,
	},
	label: {
		fontSize: 14,
		marginBottom: 4,
		fontWeight: 'bold',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		padding: 8,
		fontSize: 14,
		backgroundColor: '#fff',
	},
	inputError: {
		borderColor: 'red',
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		paddingTop: 2,
	},
	buttonContainer: {
		paddingTop: 6,
	},
});

export default styles;
