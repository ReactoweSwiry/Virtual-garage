import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default function Button(props: any) {
	const { onPress, title } = props;
	return (
		<Pressable
			style={styles.button}
			onPress={onPress}>
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: '#007bff',
	},
	text: {
		fontSize: 16,
		letterSpacing: 0.25,
		color: 'white',
	},
});
