import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCSRFToken } from '../utils/security';
import { getCache, setCache } from '../utils/cache';

// Define API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Define authentication types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'Patient' | 'Doctor';
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Patient' | 'Doctor';
    phoneNumber: string;
  };
}

// Define appointment types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Confirmed' | 'CheckedIn' | 'InProgress' | 'Completed' | 'Cancelled' | 'NoShow' | 'Rescheduled';
  reason?: string;
  doctorName: string;
  specialty: string;
}

// Define medical record types
export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
  prescriptions: string[];
}

// Define prescription types
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  status: 'Pending' | 'Processing' | 'ReadyForPickup' | 'Dispensed' | 'Cancelled' | 'Expired';
  dateIssued: string;
  doctorName: string;
}

// Define doctor schedule types
export interface DoctorSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

class ApiService {
  private api: AxiosInstance;
  private baseUrl: string;

  constructor() {
    // In a real app, this would be configurable via environment variables
    this.baseUrl = 'http://localhost:8080/api/v1';
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token and CSRF protection
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add CSRF token for non-GET requests
        if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
          const csrfToken = getCSRFToken();
          if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
          }
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          this.clearAuthToken();
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      if (response.data.success && response.data.data) {
        // Store token based on rememberMe preference
        if (data.rememberMe) {
          localStorage.setItem('token', response.data.data.token);
        } else {
          sessionStorage.setItem('token', response.data.data.token);
        }
        return response.data.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout(): void {
    this.clearAuthToken();
  }

  // Appointment methods
  async getAppointments(status?: string): Promise<Appointment[]> {
    try {
      // Check cache first
      const cacheKey = `appointments_${status || 'all'}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const params = status ? { status } : {};
      const response = await this.api.get<ApiResponse<Appointment[]>>('/appointments', { params });
      if (response.data.success && response.data.data) {
        // Cache the response for 5 minutes
        setCache(cacheKey, response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch appointments');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    try {
      const response = await this.api.post<ApiResponse<Appointment>>('/appointments', appointment);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create appointment');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await this.api.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointment);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update appointment');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Medical record methods
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      // Check cache first
      const cacheKey = `medical_records_${patientId}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const response = await this.api.get<ApiResponse<MedicalRecord[]>>(`/medical-records/${patientId}`);
      if (response.data.success && response.data.data) {
        // Cache the response for 5 minutes
        setCache(cacheKey, response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch medical records');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    try {
      const response = await this.api.post<ApiResponse<MedicalRecord>>('/medical-records', record);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create medical record');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Prescription methods
  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    try {
      // Check cache first
      const cacheKey = `prescriptions_${patientId}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const response = await this.api.get<ApiResponse<Prescription[]>>(`/prescriptions/${patientId}`);
      if (response.data.success && response.data.data) {
        // Cache the response for 5 minutes
        setCache(cacheKey, response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch prescriptions');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<Prescription> {
    try {
      const response = await this.api.post<ApiResponse<Prescription>>('/prescriptions', prescription);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create prescription');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Doctor schedule methods
  async getDoctorSchedule(doctorId: string): Promise<DoctorSchedule[]> {
    try {
      // Check cache first
      const cacheKey = `schedule_${doctorId}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      const response = await this.api.get<ApiResponse<DoctorSchedule[]>>(`/schedule/${doctorId}`);
      if (response.data.success && response.data.data) {
        // Cache the response for 5 minutes
        setCache(cacheKey, response.data.data);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch schedule');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateDoctorSchedule(doctorId: string, schedule: DoctorSchedule[]): Promise<DoctorSchedule[]> {
    try {
      const response = await this.api.put<ApiResponse<DoctorSchedule[]>>(`/schedule/${doctorId}`, schedule);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update schedule');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  private getAuthToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  private clearAuthToken(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        return new Error(error.response.data.message);
      }
      
      switch (error.response?.status) {
        case 400:
          return new Error('Bad Request - Please check your input');
        case 401:
          return new Error('Unauthorized - Please log in again');
        case 403:
          return new Error('Forbidden - You do not have permission to access this resource');
        case 404:
          return new Error('Resource not found');
        case 409:
          return new Error('Conflict - This resource already exists');
        case 429:
          return new Error('Too Many Requests - Please try again later');
        case 500:
          return new Error('Internal Server Error - Please try again later');
        default:
          return new Error('An unexpected error occurred');
      }
    }
    
    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;