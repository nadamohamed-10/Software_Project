import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PatientDashboard() {
    const params = useLocalSearchParams();
    const userName = params.userName || 'Ahmed';
    const userEmail = params.userEmail || 'amelia.y@example.com';
    const userPhone = params.userPhone || '+1 (555) 123-4567';
    const router = useRouter();
    const [greeting, setGreeting] = useState('Good Morning 🌞');

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            setGreeting('Good Morning 🌞');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon 🌤️');
        } else {
            setGreeting('Good Evening 🌙');
        }
    }, []);

    const healthCards = [
        {
            title: 'Next Appointment',
            subtitle: 'Oct 28, 10:00 AM',
            detail: 'Dr. Sarah Connor',
            icon: '📅',
            gradient: ['#007AFF', '#0051D5'],
        },
        {
            title: 'Active Prescriptions',
            subtitle: '3 Active',
            detail: 'View Details',
            icon: '💊',
            gradient: ['#4B5563', '#1E1E1E'],
        },
        {
            title: 'Recent Tests',
            subtitle: '1 New Result',
            detail: 'Blood Panel',
            icon: '🧪',
            gradient: ['#E5E7EB', '#D1D5DB'],
        },
    ];

    const reminders = [
        { title: 'Take Painkiller', time: '8:00 PM Today', icon: '💊' },
        { title: 'Physiotherapy Session', time: 'Tomorrow, 9:00 AM', icon: '🧘' },
    ];

    const quickActions = [
        { title: 'Book Appointment', icon: '📅' },

        { title: 'My Profile', icon: '👤' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.iconText}>🏥</Text>
                    </View>
                    <Text style={styles.welcomeText}>Welcome Back 👋</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.bellIcon}>🔔</Text>
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Greeting Section */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingText}>{greeting}, {userName}!</Text>
                    <Text style={styles.greetingSubtext}>
                        Here's a quick look at your health today.
                    </Text>
                </View>

                {/* Health Summary Carousel */}
                <View style={styles.carouselSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carouselContent}
                        snapToInterval={width * 0.7}
                        decelerationRate="fast"
                    >
                        {healthCards.map((card, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.healthCard,
                                    {
                                        backgroundColor:
                                            card.title === 'Recent Tests' ? '#E5E7EB' : card.gradient[0],
                                    },
                                ]}
                            >
                                <View style={styles.cardContent}>
                                    <Text
                                        style={[
                                            styles.cardTitle,
                                            card.title === 'Recent Tests' && styles.cardTitleDark,
                                        ]}
                                    >
                                        {card.title}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cardSubtitle,
                                            card.title === 'Recent Tests' && styles.cardSubtitleDark,
                                        ]}
                                    >
                                        {card.subtitle}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.cardDetail,
                                            card.title === 'Recent Tests' && styles.cardDetailDark,
                                        ]}
                                    >
                                        {card.detail}
                                    </Text>
                                </View>
                                <Text style={styles.cardIcon}>{card.icon}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Upcoming Reminders */}
                <View style={styles.remindersSection}>
                    <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
                    <View style={styles.timelineContainer}>
                        <View style={styles.timelineLine} />
                        {reminders.map((reminder, index) => (
                            <View key={index} style={styles.reminderItem}>
                                <View style={styles.timelineDot}>
                                    <Text style={styles.reminderIcon}>{reminder.icon}</Text>
                                </View>
                                <View style={styles.reminderContent}>
                                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.actionCard}
                                onPress={() => {
                                    if (action.title === 'My Profile') {
                                        router.push({
                                            pathname: '/profile',
                                            params: {
                                                userName: userName,
                                                userEmail: userEmail,
                                                userPhone: userPhone,
                                            }
                                        });
                                    } else if (action.title === 'Book Appointment') {
                                        router.push('/appointments');
                                    }
                                }}
                            >
                                <View style={styles.actionIconContainer}>
                                    <Text style={styles.actionIcon}>{action.icon}</Text>
                                </View>
                                <Text style={styles.actionTitle}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Health Tip */}
                <View style={styles.healthTipSection}>
                    <View style={styles.healthTipCard}>
                        <Text style={styles.tipIcon}>💡</Text>
                        <Text style={styles.tipText}>
                            Stay hydrated to support joint health.
                        </Text>
                        <View style={styles.tipDots}>
                            <View style={[styles.dot, styles.dotActive]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/appointments')}
                >
                    <Text style={styles.navIcon}>📅</Text>
                    <Text style={styles.navLabel}>Appointments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/profile')}
                >
                    <Text style={styles.navIcon}>👤</Text>
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 16,
    },
    welcomeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1E1E1E',
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    bellIcon: {
        fontSize: 24,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    greetingSection: {
        marginBottom: 24,
    },
    greetingText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 4,
    },
    greetingSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },
    carouselSection: {
        marginBottom: 32,
        marginLeft: -20,
    },
    carouselContent: {
        paddingLeft: 20,
        paddingRight: 20,
        gap: 16,
    },
    healthCard: {
        width: width * 0.65,
        borderRadius: 24,
        padding: 20,
        minHeight: 140,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    cardTitleDark: {
        color: '#6B7280',
    },
    cardSubtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    cardSubtitleDark: {
        color: '#1E1E1E',
    },
    cardDetail: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    cardDetailDark: {
        color: '#6B7280',
    },
    cardIcon: {
        fontSize: 48,
        alignSelf: 'flex-end',
        opacity: 0.3,
        marginTop: -10,
    },
    remindersSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 16,
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: 32,
    },
    timelineLine: {
        position: 'absolute',
        left: 16,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#DBEAFE',
        borderRadius: 1,
    },
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    timelineDot: {
        position: 'absolute',
        left: -4,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 4,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reminderIcon: {
        fontSize: 18,
    },
    reminderContent: {
        marginLeft: 16,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 2,
    },
    reminderTime: {
        fontSize: 13,
        color: '#6B7280',
    },
    quickActionsSection: {
        marginBottom: 32,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    actionCard: {
        width: (width - 56) / 2,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 24,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E1E1E',
        textAlign: 'center',
    },
    healthTipSection: {
        marginBottom: 32,
    },
    healthTipCard: {
        backgroundColor: '#007AFF',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    tipIcon: {
        fontSize: 28,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    tipDots: {
        flexDirection: 'row',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        paddingBottom: 24,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    navIcon: {
        fontSize: 28,
        marginBottom: 4,
        opacity: 0.6,
    },
    navIconActive: {
        opacity: 1,
    },
    navLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#6B7280',
    },
    navLabelActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
});