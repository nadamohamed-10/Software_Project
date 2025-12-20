import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

export default function ClinicRegistrationScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [role, setRole] = useState<'Doctor' | 'Patient'>('Patient');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const calculatePasswordStrength = (pass: string) => {
        if (pass.length < 6) return { label: 'Weak', width: '33.33%' as const, color: '#DC2626' };
        if (pass.length < 10) return { label: 'Medium', width: '66.66%' as const, color: '#F59E0B' };
        return { label: 'Strong', width: '100%' as const, color: '#10B981' };
    };

    const strength = calculatePasswordStrength(password);

    const validateForm = () => {
        if (!firstName || !lastName) {
            alert('Please enter your full name');
            return false;
        }
        if (!email) {
            alert('Please enter your email address');
            return false;
        }
        if (!phone) {
            alert('Please enter your phone number');
            return false;
        }
        if (role === 'Patient' && (!gender || !dob)) {
            alert('Please fill in all patient details');
            return false;
        }
        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        }
        if (!termsAccepted) {
            alert('Please accept the Terms & Privacy Policy');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            setShowSuccess(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                if (role === 'Doctor') {
                    router.replace({
                        pathname: '/doctor/dashboard',
                        params: {
                            userName: `Dr. ${firstName} ${lastName}`,
                            userEmail: email,
                            userPhone: phone,
                        }
                    });
                } else {
                    router.replace({
                        pathname: '/(tabs)/dashboard',
                        params: {
                            userName: `${firstName} ${lastName}`,
                            userEmail: email,
                            userPhone: phone,
                        }
                    });
                }
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            alert('Something went wrong, please try again');
        } finally {
            setIsLoading(false);
        }
    };

    const styles = getStyles(isDark);

    if (showSuccess) {
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
                    <View style={styles.successContent}>
                        <View style={styles.successIconContainer}>
                            <Text style={styles.checkmark}>✓</Text>
                        </View>
                        <Text style={styles.successTitle}>Registration Successful!</Text>
                        <Text style={styles.successMessage}>
                            Welcome, {firstName} {lastName}! 🎉
                        </Text>
                        <Text style={styles.redirectText}>
                            Redirecting to your dashboard...
                        </Text>
                    </View>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerSection}>
                    <Text style={styles.logo}>🏥</Text>
                    <Text style={styles.title}>Dr. Ahmed Nabil Clinic</Text>
                    <Text style={styles.subtitle}>Orthopedic Specialist</Text>
                </View>

                <View style={styles.roleSection}>
                    <Text style={styles.roleLabel}>Register as</Text>
                    <View style={styles.roleContainer}>
                        <Pressable
                            style={[styles.roleButton, role === 'Doctor' && styles.roleButtonActive]}
                            onPress={() => setRole('Doctor')}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                role === 'Doctor' && styles.roleButtonTextActive
                            ]}>
                                Doctor
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.roleButton, role === 'Patient' && styles.roleButtonActive]}
                            onPress={() => setRole('Patient')}
                        >
                            <Text style={[
                                styles.roleButtonText,
                                role === 'Patient' && styles.roleButtonTextActive
                            ]}>
                                Patient
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>
                                First Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ali"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>
                                Last Name <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Hassan"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Email Address <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.inputWithIconField}
                                placeholder="ali.hassan@example.com"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Text style={styles.inputIcon}>✉️</Text>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Phone Number <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.inputWithIconField}
                                placeholder="+20 1XX XXXXXXX"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            <Text style={styles.inputIcon}>📞</Text>
                        </View>
                    </View>

                    {role === 'Patient' && (
                        <View style={styles.patientDetails}>
                            <Text style={styles.patientDetailsTitle}>PATIENT DETAILS</Text>
                            <View style={styles.row}>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Gender</Text>
                                    <View style={styles.pickerContainer}>
                                        <Pressable
                                            style={styles.picker}
                                            onPress={() => {
                                                const options = ['Male', 'Female', 'Other'];
                                                const currentIndex = options.indexOf(gender);
                                                const nextIndex = (currentIndex + 1) % options.length;
                                                setGender(options[nextIndex]);
                                            }}
                                        >
                                            <Text style={[styles.pickerText, !gender && styles.pickerPlaceholder]}>
                                                {gender || 'Select'}
                                            </Text>
                                            <Text style={styles.pickerArrow}>▼</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View style={styles.halfInput}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="DD/MM/YYYY"
                                        placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                        value={dob}
                                        onChangeText={setDob}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>National ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your national ID"
                                    placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                    value={nationalId}
                                    onChangeText={setNationalId}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {password.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBar}>
                                    <View
                                        style={[
                                            styles.strengthFill,
                                            { width: strength.width, backgroundColor: strength.color }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.strengthText, { color: strength.color }]}>
                                    {strength.label}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Confirm Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#94A3B8'}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {confirmPassword && password !== confirmPassword && (
                            <Text style={styles.errorText}>Passwords do not match</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => setTermsAccepted(!termsAccepted)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                            {termsAccepted && <Text style={styles.checkboxMark}>✓</Text>}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f1723' : '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 32,
    },
    headerSection: {
        alignItems: 'center',
        paddingBottom: 32,
    },
    logo: {
        fontSize: 64,
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#0D6EFD',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    roleSection: {
        marginBottom: 24,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: isDark ? '#E5E7EB' : '#0c131c',
        marginBottom: 8,
        marginLeft: 4,
    },
    roleContainer: {
        flexDirection: 'row',
        height: 52,
        backgroundColor: isDark ? '#1e293b' : '#E2E8F0',
        borderRadius: 12,
        padding: 4,
    },
    roleButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    roleButtonActive: {
        backgroundColor: '#0D6EFD',
        shadowColor: '#0D6EFD',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    roleButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
    },
    roleButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    form: {
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    halfInput: {
        flex: 1,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: isDark ? '#E5E7EB' : '#0c131c',
        marginBottom: 6,
        marginLeft: 4,
    },
    required: {
        color: '#DC2626',
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#CBD5E1',
        backgroundColor: isDark ? '#0f172a' : '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#0c131c',
    },
    inputWithIcon: {
        position: 'relative',
    },
    inputWithIconField: {
        height: 52,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#CBD5E1',
        backgroundColor: isDark ? '#0f172a' : '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 48,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#0c131c',
    },
    inputIcon: {
        position: 'absolute',
        right: 16,
        top: 14,
        fontSize: 20,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        height: 52,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#CBD5E1',
        backgroundColor: isDark ? '#0f172a' : '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 50,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#0c131c',
    },
    eyeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        fontSize: 18,
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        backgroundColor: isDark ? '#334155' : '#E2E8F0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 12,
        color: '#DC2626',
        marginTop: 4,
        marginLeft: 4,
    },
    patientDetails: {
        backgroundColor: isDark ? '#1e293b50' : '#F8FAFC',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    patientDetailsTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0D6EFD',
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    pickerContainer: {
        position: 'relative',
    },
    picker: {
        height: 52,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#CBD5E1',
        backgroundColor: isDark ? '#0f172a' : '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerText: {
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#0c131c',
    },
    pickerPlaceholder: {
        color: '#94A3B8',
    },
    pickerArrow: {
        fontSize: 10,
        color: '#94A3B8',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: isDark ? '#475569' : '#CBD5E1',
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#0D6EFD',
        borderColor: '#0D6EFD',
    },
    checkboxMark: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    termsText: {
        fontSize: 14,
        color: isDark ? '#cbd5e1' : '#0c131c',
        flex: 1,
    },
    termsLink: {
        color: '#0D6EFD',
        fontWeight: '700',
    },
    registerButton: {
        height: 52,
        backgroundColor: '#0D6EFD',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        shadowColor: '#0D6EFD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    footerLink: {
        fontSize: 14,
        color: '#0D6EFD',
        fontWeight: '700',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successContent: {
        alignItems: 'center',
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkmark: {
        fontSize: 48,
        color: '#10B981',
        fontWeight: '700',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: isDark ? '#FFFFFF' : '#2C2C2C',
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 16,
        color: isDark ? '#E5E7EB' : '#2C2C2C',
        marginBottom: 4,
    },
    redirectText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
});