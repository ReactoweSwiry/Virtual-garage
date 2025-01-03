import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        profilePicture: "https://via.placeholder.com/100",
        bio: "Passionate developer | Coffee enthusiast | Travel lover",
    });

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleInputChange = (field, value) => {
        setProfile(prevProfile => ({
            ...prevProfile,
            [field]: value
        }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: profile.profilePicture }} style={styles.profilePicture} />
                {isEditing ? (
                    <View style={styles.infoSection}>
                        <TextInput
                            style={styles.nameInput}
                            value={profile.name}
                            onChangeText={text => handleInputChange('name', text)}
                        />
                        <TextInput
                            style={styles.emailInput}
                            value={profile.email}
                            onChangeText={text => handleInputChange('email', text)}
                        />
                    </View>
                ) : (
                    <View style={styles.infoSection}>
                        <Text style={styles.name}>{profile.name}</Text>
                        <Text style={styles.email}>{profile.email}</Text>
                    </View>
                )}
            </View>
            <View style={styles.bioSection}>
                <Text style={styles.bioTitle}>Bio</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.bioInput}
                        value={profile.bio}
                        onChangeText={text => handleInputChange('bio', text)}
                        multiline
                    />
                ) : (
                    <Text style={styles.bioContent}>{profile.bio}</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleEdit}>
                    <Text style={styles.editButton}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 15,
    },
    nameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 5,
        marginBottom: 10,
        width: '80%',
        textAlign: 'center',
    },
    emailInput: {
        fontSize: 16,
        color: '#777',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 5,
        width: '80%',
        textAlign: 'center',
    },
    infoSection: {
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#777',
    },
    bioSection: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 30,
    },
    bioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    bioContent: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    bioInput: {
        fontSize: 14,
        color: '#555',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 5,
        textAlignVertical: 'top',
        height: 80,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;
