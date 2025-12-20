import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

export default function PatientDashboard() {
    const params = useLocalSearchParams();
    const userName = params.userName || 'Ahmed Hassan';
    const userEmail = params.userEmail || 'ahmed@example.com';
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [currentDate, setCurrentDate] = useState({
        day: '',
        date: '',
        month: '',
        year: '',
    });

    useEffect(() => {
        const now = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        setCurrentDate({
            day: days[now.getDay()],
            date: now.getDate().toString(),
            month: months[now.getMonth()],
            year: now.getFullYear().toString(),
        });
    }, []);

    const appointments = [
        {
            time: '09:30 AM',
            type: 'General Checkup',
            patientName: 'Dr. Ahmed Nabil',
            patientId: '#A-2490',
            status: 'In Progress',
            statusColor: '#FFA726',
            borderColor: '#FFA726',
            avatar: '👨‍⚕️',
        },
        {
            time: '11:00 AM',
            type: 'Follow-up',
            patientName: 'Dr. Sarah Connor',
            patientId: '#A-2495',
            status: 'Confirmed',
            statusColor: '#42A5F5',
            borderColor: '#42A5F5',
            avatar: '👩‍⚕️',
        },
        {
            time: '02:30 PM',
            type: 'X-Ray Review',
            patientName: 'Dr. Mark Wilson',
            patientId: '#A-2501',
            status: 'Upcoming',
            statusColor: '#66BB6A',
            borderColor: '#66BB6A',
            avatar: '👨‍⚕️',
        },
    ];

    const styles = getStyles(isDark);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>😊</Text>
                            </View>
                            <View style={styles.onlineDot} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.userRole}>Patient</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Date Cards */}
                <View style={styles.dateContainer}>
                    <View style={[styles.dateCard, styles.dateCardDay]}>
                        <Text style={styles.dateLabel}>Day</Text>
                        <Text style={[styles.dateValue, styles.dateValueDay]}>{currentDate.day}</Text>
                    </View>
                    <View style={[styles.dateCard, styles.dateCardDate]}>
                        <Text style={styles.dateLabel}>Date</Text>
                        <Text style={[styles.dateValue, styles.dateValueDate]}>{currentDate.date}</Text>
                    </View>
                    <View style={[styles.dateCard, styles.dateCardMonth]}>
                        <Text style={styles.dateLabel}>Month</Text>
                        <Text style={[styles.dateValue, styles.dateValueMonth]}>{currentDate.month}</Text>
                    </View>
                    <View style={[styles.dateCard, styles.dateCardYear]}>
                        <Text style={styles.dateLabel}>Year</Text>
                        <Text style={[styles.dateValue, styles.dateValueYear]}>{currentDate.year}</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardPrimary]}>
                            <View style={[styles.statIcon, styles.statIconPrimary]}>
                                <Text style={styles.iconText}>📅</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Today's Appts</Text>
                                <Text style={styles.statValue}>3</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, styles.statCardBlue]}>
                            <View style={[styles.statIcon, styles.statIconBlue]}>
                                <Text style={styles.iconText}>⏰</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Upcoming</Text>
                                <Text style={styles.statValue}>2</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.statCardPurple]}>
                            <View style={[styles.statIcon, styles.statIconPurple]}>
                                <Text style={styles.iconText}>🏥</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Total Visits</Text>
                                <Text style={styles.statValue}>24</Text>
                            </View>
                        </View>
                        <View style={[styles.statCard, styles.statCardGreen]}>
                            <View style={[styles.statIcon, styles.statIconGreen]}>
                                <Text style={styles.iconText}>✅</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Completed</Text>
                                <Text style={styles.statValue}>1</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Today's Schedule */}
                <View style={styles.scheduleSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Schedule</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllButton}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.appointmentsList}>
                        {appointments.map((appointment, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.appointmentCard,
                                    { borderLeftColor: appointment.borderColor }
                                ]}
                            >
                                <View style={styles.appointmentHeader}>
                                    <View style={styles.appointmentTime}>
                                        <Text style={styles.timeText}>{appointment.time}</Text>
                                        <Text style={styles.typeText}>{appointment.type}</Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor: `${appointment.statusColor}20`,
                                            borderColor: `${appointment.statusColor}40`
                                        }
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: appointment.statusColor }
                                        ]}>
                                            {appointment.status}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.doctorInfo}>
                                    <View style={[
                                        styles.doctorAvatar,
                                        { backgroundColor: `${appointment.borderColor}15` }
                                    ]}>
                                        <Text style={styles.doctorAvatarText}>{appointment.avatar}</Text>
                                    </View>
                                    <View style={styles.doctorDetails}>
                                        <Text style={styles.doctorName}>{appointment.patientName}</Text>
                                        <Text style={styles.patientId}>{appointment.patientId}</Text>
                                    </View>
                                </View>

                                <View style={styles.appointmentActions}>
                                    <TouchableOpacity
                                        style={[
                                            styles.primaryButton,
                                            { backgroundColor: appointment.borderColor }
                                        ]}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {index === 0 ? 'Resume' : 'Start Consultation'}
                                        </Text>
                                    </TouchableOpacity>
                                    {index === 1 && (
                                        <TouchableOpacity style={styles.secondaryButton}>
                                            <Text style={styles.secondaryButtonText}>Check-in</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIconActive}>🏠</Text>
                    <Text style={styles.navLabelActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/appointments')}
                >
                    <Text style={styles.navIcon}>📅</Text>
                    <Text style={styles.navLabel}>Schedule</Text>
                </TouchableOpacity>
                <View style={styles.fabContainer}>
                    <TouchableOpacity style={styles.fab}>
                        <Text style={styles.fabIcon}>➕</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={styles.navIcon}>👥</Text>
                    <Text style={styles.navLabel}>Doctors</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/profile')}
                >
                    <Text style={styles.navIcon}>💬</Text>
                    <Text style={styles.navLabel}>Messages</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f1723' : '#F0F4FF',
    },
    header: {
        backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
        paddingTop: 50,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFE5B4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFA726',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarText: {
        fontSize: 28,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#66BB6A',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userInfo: {
        gap: 2,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: isDark ? '#FFFFFF' : '#1A237E',
    },
    userRole: {
        fontSize: 14,
        fontWeight: '500',
        color: '#7E57C2',
    },
    notificationButton: {
        position: 'relative',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8EAF6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 22,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF5252',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    dateContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
    },
    dateCard: {
        flex: 1,
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    dateCardDay: {
        backgroundColor: '#E3F2FD',
    },
    dateCardDate: {
        backgroundColor: '#F3E5F5',
    },
    dateCardMonth: {
        backgroundColor: '#FFF9C4',
    },
    dateCardYear: {
        backgroundColor: '#E8F5E9',
    },
    dateLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#78909C',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    dateValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    dateValueDay: {
        color: '#1976D2',
    },
    dateValueDate: {
        color: '#7B1FA2',
    },
    dateValueMonth: {
        color: '#F57F17',
    },
    dateValueYear: {
        color: '#388E3C',
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    statCardPrimary: {
        backgroundColor: '#FFFFFF',
    },
    statCardBlue: {
        backgroundColor: '#FFFFFF',
    },
    statCardPurple: {
        backgroundColor: '#FFFFFF',
    },
    statCardGreen: {
        backgroundColor: '#FFFFFF',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconPrimary: {
        backgroundColor: '#E8EAF6',
    },
    statIconBlue: {
        backgroundColor: '#E1F5FE',
    },
    statIconPurple: {
        backgroundColor: '#F3E5F5',
    },
    statIconGreen: {
        backgroundColor: '#E8F5E9',
    },
    iconText: {
        fontSize: 24,
    },
    statInfo: {
        flex: 1,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#78909C',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 26,
        fontWeight: '700',
        color: '#1A237E',
    },
    scheduleSection: {
        paddingHorizontal: 20,
        paddingTop: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A237E',
    },
    seeAllButton: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5E35B1',
    },
    appointmentsList: {
        gap: 16,
    },
    appointmentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 20,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    appointmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    appointmentTime: {
        gap: 4,
    },
    timeText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A237E',
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#78909C',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    doctorAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorAvatarText: {
        fontSize: 24,
    },
    doctorDetails: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A237E',
        marginBottom: 2,
    },
    patientId: {
        fontSize: 12,
        fontWeight: '500',
        color: '#78909C',
    },
    appointmentActions: {
        flexDirection: 'row',
        gap: 10,
    },
    primaryButton: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#616161',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E8EAF6',
        paddingTop: 8,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    navIcon: {
        fontSize: 26,
        marginBottom: 4,
        opacity: 0.4,
    },
    navIconActive: {
        fontSize: 26,
        marginBottom: 4,
        opacity: 1,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#B0BEC5',
    },
    navLabelActive: {
        fontSize: 10,
        fontWeight: '700',
        color: '#5E35B1',
    },
    fabContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: -36,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#5E35B1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#5E35B1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 30,
        color: '#FFFFFF',
        fontWeight: '700',
    },
});