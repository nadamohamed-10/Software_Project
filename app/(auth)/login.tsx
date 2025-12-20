import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [role, setRole] = useState<'Doctor' | 'Patient'>('Patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleLogin = async () => {
        setShowError(false);

        if (!email || !password) {
            setShowError(true);
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate based on role
            if (role === 'Doctor') {
                router.replace({
                    pathname: '/doctor/dashboard',
                    params: {
                        userName: 'Dr. User Name',
                        userEmail: email,
                    }
                });
            } else {
                router.replace({
                    pathname: '/dashboard',
                    params: {
                        userName: 'User Name',
                        userEmail: email,
                    }
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const styles = getStyles(isDark);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🏥</Text>
                    </View>
                    <Text style={styles.title}>Clinic Management System</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    {/* Role Selection */}
                    <View style={styles.roleSection}>
                        <Text style={styles.roleLabel}>Login as</Text>
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

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setShowError(false);
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter your password"
                                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setShowError(false);
                                }}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
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
                    </View>

                    {/* Remember Me Checkbox */}
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && <Text style={styles.checkboxMark}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxText}>Remember me</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Error Message */}
                    {showError && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorIcon}>⚠️</Text>
                            <Text style={styles.errorText}>Invalid email or password</Text>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.footerLink}>Create one</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 24 }} />
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
        paddingTop: 80,
        paddingBottom: 32,
        alignItems: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 56,
        height: 56,
        backgroundColor: isDark ? '#1e40af20' : '#0D6EFD15',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0D6EFD',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
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
        backgroundColor: isDark ? '#0f172a' : '#E2E8F0',
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
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: isDark ? '#E5E7EB' : '#0c131c',
        marginBottom: 8,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#cdd9e9',
        backgroundColor: isDark ? '#0f172a' : '#F8FAFC',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#0c131c',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        height: 56,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#cdd9e9',
        backgroundColor: isDark ? '#0f172a' : '#F8FAFC',
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
        fontSize: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: isDark ? '#475569' : '#cdd9e9',
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
    checkboxText: {
        fontSize: 16,
        color: isDark ? '#cbd5e1' : '#0c131c',
    },
    loginButton: {
        height: 48,
        backgroundColor: '#0D6EFD',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0D6EFD',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#7f1d1d20' : '#FEE2E2',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
    },
    errorIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#E2E8F0',
        width: '100%',
        maxWidth: 420,
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
});