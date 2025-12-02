import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function MyProfile() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // نحول الـ params لـ string
    const userName = typeof params.userName === 'string' ? params.userName : 'Amelia Yusuf';
    const userEmail = typeof params.userEmail === 'string' ? params.userEmail : 'amelia.y@example.com';
    const userPhone = typeof params.userPhone === 'string' ? params.userPhone : '+1 (555) 123-4567';

    const [formData, setFormData] = useState({
        fullName: userName,
        email: userEmail,
        phone: userPhone,
        password: '••••••••••••',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', onPress: () => router.push('/'), style: 'destructive' },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/dashboard')}>
                    <Text style={styles.headerIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Text style={styles.headerIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    {/* Clinic Logo */}
                    <View style={styles.profileSection}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/images/clinic-logo.png')}
                                style={styles.clinicLogoImage}
                            />
                            <Text style={styles.clinicName}>My Clinic</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.fullName}
                                onChangeText={(value) => updateField('fullName', value)}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(value) => updateField('email', value)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(value) => updateField('phone', value)}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    value={formData.password}
                                    onChangeText={(value) => updateField('password', value)}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Success Toast */}
            {showSuccess && (
                <View style={styles.successToast}>
                    <Text style={styles.successIcon}>✓</Text>
                    <Text style={styles.successText}>Profile Updated Successfully</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerIcon: {
        fontSize: 24,
        color: '#333333',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 5,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    clinicLogo: {
        fontSize: 64,
        marginBottom: 8,
    },
    clinicLogoImage: {
        width: 100,
        height: 100,
        marginBottom: 12,
        resizeMode: 'contain',
    },
    clinicName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#007BFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        opacity: 0.5,
        marginVertical: 24,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#DADCE0',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333333',
        backgroundColor: '#FFFFFF',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 48,
    },
    eyeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
        padding: 4,
    },
    eyeIcon: {
        fontSize: 20,
    },
    buttonContainer: {
        gap: 16,
    },
    saveButton: {
        height: 48,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    logoutButton: {
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#DC2626',
    },
    successToast: {
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: [{ translateX: -150 }],
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        borderRadius: 8,
        padding: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    successIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    successText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});