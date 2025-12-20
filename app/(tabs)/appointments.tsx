import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Types
type Clinic = {
    id: string;
    name: string;
    address: string;
};

type Appointment = {
    id: string;
    name: string;
    phone: string;
    age: string;
    gender: string;
    visitType: string;
    bodyPart: string;
    bodyPartOther?: string;
    symptoms?: string;
    previousSurgery?: string;
    date: string;
    time: string;
    clinic: Clinic;
    status: 'upcoming' | 'completed' | 'canceled';
};

type AppointmentContextType = {
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => Appointment;
    cancelAppointment: (id: string) => void;
    completeAppointment: (id: string) => void;
};

const DOCTOR = {
    name: 'Dr. Ahmed Nabil',
    specialty: 'Orthopedic Surgeon',
};

const CLINICS: Clinic[] = [
    { id: 'sz', name: 'Zayed Clinic', address: 'Zayed, Giza' },
    { id: '6o', name: 'October Clinic', address: 'October City' },
    { id: 'dk', name: 'Dokki Clinic', address: 'Dokki, Giza' }
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TIME_SLOTS = {
    morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM']
};

const VISIT_TYPES = ['First Visit', 'Follow-up', 'Consultation', 'Emergency'];
const BODY_PARTS = ['Knee', 'Back', 'Shoulder', 'Hip', 'Ankle', 'Elbow', 'Wrist', 'Other'];

// Appointment Context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: Date.now().toString(),
            status: 'upcoming'
        };
        setAppointments(prev => [newAppointment, ...prev]);
        return newAppointment;
    };

    const cancelAppointment = (id: string) => {
        setAppointments(prev =>
            prev.map(apt => apt.id === id ? { ...apt, status: 'canceled' as const } : apt)
        );
    };

    const completeAppointment = (id: string) => {
        setAppointments(prev =>
            prev.map(apt => apt.id === id ? { ...apt, status: 'completed' as const } : apt)
        );
    };

    return (
        <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment, completeAppointment }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointments must be used within AppointmentProvider');
    }
    return context;
};

// Components
const ClinicSelector = ({ clinics, selectedClinic, onSelectClinic }: {
    clinics: Clinic[];
    selectedClinic: string;
    onSelectClinic: (id: string) => void;
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.sectionTitle}>Select Clinic</Text>
            </View>
            {clinics.map(clinic => (
                <TouchableOpacity
                    key={clinic.id}
                    onPress={() => onSelectClinic(clinic.id)}
                    style={[
                        styles.clinicOption,
                        selectedClinic === clinic.id && styles.clinicSelected
                    ]}
                >
                    <View style={styles.clinicRadio}>
                        {selectedClinic === clinic.id && <View style={styles.clinicRadioInner} />}
                    </View>
                    <View style={styles.clinicDetails}>
                        <Text style={[
                            styles.clinicName,
                            selectedClinic === clinic.id && styles.clinicNameSelected
                        ]}>
                            {clinic.name}
                        </Text>
                        <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const Calendar = ({ selectedDate, onSelectDate }: {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = dateStr === selectedDate;
        const isPast = date < today && !isToday;

        days.push(
            <TouchableOpacity
                key={day}
                style={[
                    styles.calendarDay,
                    isSelected && styles.calendarDaySelected,
                    isPast && styles.calendarDayDisabled
                ]}
                onPress={() => !isPast && onSelectDate(dateStr)}
                disabled={isPast}
            >
                <Text style={[
                    styles.calendarDayText,
                    isSelected && styles.calendarDayTextSelected,
                    isPast && styles.calendarDayTextDisabled,
                    isToday && !isSelected && styles.calendarDayTextToday
                ]}>
                    {day}
                </Text>
            </TouchableOpacity>
        );
    }

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.sectionTitle}>Select Date</Text>
            </View>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={prevMonth} style={styles.calendarNav}>
                    <Text style={styles.calendarNavText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.calendarMonthYear}>
                    {MONTHS[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={styles.calendarNav}>
                    <Text style={styles.calendarNavText}>›</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.calendarWeekDays}>
                {DAYS.map(day => (
                    <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
                ))}
            </View>
            <View style={styles.calendarGrid}>{days}</View>
        </View>
    );
};

const TimeSlots = ({ selectedTime, onSelectTime }: {
    selectedTime: string;
    onSelectTime: (time: string) => void;
}) => {
    const [period, setPeriod] = useState<'morning' | 'afternoon'>('morning');

    return (
        <View style={styles.card}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.sectionTitle}>Select Time</Text>
            </View>
            <View style={styles.periodToggle}>
                <TouchableOpacity
                    onPress={() => setPeriod('morning')}
                    style={[
                        styles.periodButton,
                        period === 'morning' && styles.periodButtonActive
                    ]}
                >
                    <Text style={[
                        styles.periodButtonText,
                        period === 'morning' && styles.periodButtonTextActive
                    ]}>
                        Morning
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPeriod('afternoon')}
                    style={[
                        styles.periodButton,
                        period === 'afternoon' && styles.periodButtonActive
                    ]}
                >
                    <Text style={[
                        styles.periodButtonText,
                        period === 'afternoon' && styles.periodButtonTextActive
                    ]}>
                        Afternoon
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.timeGrid}>
                {TIME_SLOTS[period].map(time => (
                    <TouchableOpacity
                        key={time}
                        onPress={() => onSelectTime(time)}
                        style={[
                            styles.timeSlot,
                            selectedTime === time && styles.timeSlotSelected
                        ]}
                    >
                        <Text style={[
                            styles.timeSlotText,
                            selectedTime === time && styles.timeSlotTextSelected
                        ]}>
                            {time}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const PatientForm = ({ formData, onUpdateForm }: {
    formData: any;
    onUpdateForm: (field: string, value: string) => void;
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.sectionTitle}>Patient Information</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(value) => onUpdateForm('name', value)}
                    placeholder="Enter full name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(value) => onUpdateForm('phone', value)}
                    placeholder="+20 XXX XXX XXXX"
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.age}
                    onChangeText={(value) => onUpdateForm('age', value)}
                    placeholder="Enter age"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.radioGroup}>
                    {['Male', 'Female'].map(gender => (
                        <TouchableOpacity
                            key={gender}
                            onPress={() => onUpdateForm('gender', gender)}
                            style={styles.radioOption}
                        >
                            <View style={styles.radio}>
                                {formData.gender === gender && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.radioLabel}>{gender}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Visit Type *</Text>
                <View style={styles.chipGroup}>
                    {VISIT_TYPES.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => onUpdateForm('visitType', type)}
                            style={[
                                styles.chip,
                                formData.visitType === type && styles.chipSelected
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                formData.visitType === type && styles.chipTextSelected
                            ]}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Body Part of Concern *</Text>
                <View style={styles.chipGroup}>
                    {BODY_PARTS.map(part => (
                        <TouchableOpacity
                            key={part}
                            onPress={() => onUpdateForm('bodyPart', part)}
                            style={[
                                styles.chip,
                                formData.bodyPart === part && styles.chipSelected
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                formData.bodyPart === part && styles.chipTextSelected
                            ]}>
                                {part}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {formData.bodyPart === 'Other' && (
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Please specify</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.bodyPartOther}
                        onChangeText={(value) => onUpdateForm('bodyPartOther', value)}
                        placeholder="Specify body part"
                    />
                </View>
            )}

            <View style={styles.formGroup}>
                <Text style={styles.label}>Symptoms (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.symptoms}
                    onChangeText={(value) => onUpdateForm('symptoms', value)}
                    placeholder="Describe your symptoms"
                    multiline
                    numberOfLines={3}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Previous Surgery (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.previousSurgery}
                    onChangeText={(value) => onUpdateForm('previousSurgery', value)}
                    placeholder="Any previous surgeries?"
                    multiline
                    numberOfLines={2}
                />
            </View>
        </View>
    );
};

const BookAppointmentScreen = () => {
    const router = useRouter();
    const { addAppointment } = useAppointments();

    const [selectedClinic, setSelectedClinic] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        age: '',
        gender: '',
        visitType: '',
        bodyPart: '',
        bodyPartOther: '',
        symptoms: '',
        previousSurgery: ''
    });

    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = () => {
        return (
            selectedClinic &&
            selectedDate &&
            selectedTime &&
            formData.name.trim() &&
            formData.phone.trim() &&
            formData.age.trim() &&
            formData.gender &&
            formData.visitType &&
            formData.bodyPart
        );
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        const clinic = CLINICS.find(c => c.id === selectedClinic);
        if (!clinic) return;

        addAppointment({
            ...formData,
            date: selectedDate,
            time: selectedTime,
            clinic
        });

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            router.push('/dashboard');
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Book Appointment</Text>
                    <Text style={styles.headerSubtitle}>{DOCTOR.name}</Text>
                    <Text style={styles.headerSpecialty}>{DOCTOR.specialty}</Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <ClinicSelector
                    clinics={CLINICS}
                    selectedClinic={selectedClinic}
                    onSelectClinic={setSelectedClinic}
                />

                {selectedClinic && (
                    <Calendar
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                )}

                {selectedDate && (
                    <TimeSlots
                        selectedTime={selectedTime}
                        onSelectTime={setSelectedTime}
                    />
                )}

                {selectedTime && (
                    <PatientForm
                        formData={formData}
                        onUpdateForm={updateForm}
                    />
                )}

                {selectedTime && (
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !isFormValid() && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={!isFormValid()}
                    >
                        <Text style={styles.submitButtonText}>Confirm Appointment</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {showSuccess && (
                <View style={styles.successModal}>
                    <View style={styles.successContent}>
                        <Text style={styles.successIcon}>✓</Text>
                        <Text style={styles.successTitle}>Appointment Booked!</Text>
                        <Text style={styles.successText}>
                            Your appointment has been confirmed
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default function AppointmentsPage() {
    return (
        <AppointmentProvider>
            <BookAppointmentScreen />
        </AppointmentProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 12,
    },
    backIcon: {
        fontSize: 24,
        color: '#1E293B',
    },
    headerContent: {
        gap: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#3B82F6',
    },
    headerSpecialty: {
        fontSize: 14,
        color: '#64748B',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3B82F6',
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    clinicOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 8,
    },
    clinicSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    clinicRadio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clinicRadioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    clinicDetails: {
        flex: 1,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2,
    },
    clinicNameSelected: {
        color: '#3B82F6',
    },
    clinicAddress: {
        fontSize: 14,
        color: '#64748B',
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    calendarNav: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarNavText: {
        fontSize: 24,
        color: '#3B82F6',
    },
    calendarMonthYear: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    calendarWeekDays: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    calendarWeekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    calendarDaySelected: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
    },
    calendarDayDisabled: {
        opacity: 0.3,
    },
    calendarDayText: {
        fontSize: 14,
        color: '#1E293B',
    },
    calendarDayTextSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    calendarDayTextDisabled: {
        color: '#94A3B8',
    },
    calendarDayTextToday: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    periodToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: '#FFFFFF',
    },
    periodButtonText: {
        fontSize: 14,
        color: '#64748B',
    },
    periodButtonTextActive: {
        color: '#1E293B',
        fontWeight: '600',
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    timeSlot: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    timeSlotSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    timeSlotText: {
        fontSize: 14,
        color: '#1E293B',
    },
    timeSlotTextSelected: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#1E293B',
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 16,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    radioLabel: {
        fontSize: 14,
        color: '#1E293B',
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    chipSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#EFF6FF',
    },
    chipText: {
        fontSize: 14,
        color: '#64748B',
    },
    chipTextSelected: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    submitButtonDisabled: {
        backgroundColor: '#CBD5E1',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    successModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        width: '80%',
        maxWidth: 300,
    },
    successIcon: {
        fontSize: 48,
        color: '#10B981',
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
    },
});