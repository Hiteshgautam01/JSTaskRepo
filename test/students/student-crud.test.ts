import { expect } from 'chai';
import axios from 'axios';
import { config } from '../config';

const { API_BASE_URL } = config;

describe('Student Management CRUD Operations', () => {
  let authToken;
  let studentId;

  // Test data
  const newStudent = {
    basicDetails: {
      name: "Test Student",
      email: "teststudent@school.com"
    },
    profileDetails: {
      phone: "1234567890",
      gender: "Male",
      dob: "2005-01-01",
      class: "10",
      section: "A",
      roll: "101",
      fatherName: "Test Father",
      fatherPhone: "9876543210",
      motherName: "Test Mother",
      motherPhone: "9876543211",
      guardianName: "Test Guardian",
      guardianPhone: "9876543212",
      relationOfGuardian: "Uncle",
      currentAddress: "123 Test Street",
      permanentAddress: "456 Home Street",
      admissionDate: new Date().toISOString().split('T')[0]
    }
  };

  before(async () => {
    // Login and get auth token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@school.com',
      password: 'admin123'
    });
    authToken = loginResponse.data.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  });

  describe('1. Create Student (POST /students)', () => {
    it('should create a new student successfully', async () => {
      const response = await axios.post(`${API_BASE_URL}/students`, newStudent);
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('message');
      expect(response.data.message).to.include('Student added');
      studentId = response.data.userId; // Save for later tests
    });

    it('should fail when creating student with duplicate email', async () => {
      try {
        await axios.post(`${API_BASE_URL}/students`, newStudent);
      } catch (error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data.error).to.include('Email already exists');
      }
    });
  });

  describe('2. Read Students (GET /students)', () => {
    it('should get all students', async () => {
      const response = await axios.get(`${API_BASE_URL}/students`);
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('students');
      expect(response.data.students).to.be.an('array');
    });

    it('should filter students by query parameters', async () => {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        params: {
          name: newStudent.basicDetails.name,
          class: newStudent.profileDetails.class,
          section: newStudent.profileDetails.section,
          roll: newStudent.profileDetails.roll
        }
      });
      expect(response.status).to.equal(200);
      expect(response.data.students).to.be.an('array');
      expect(response.data.students.length).to.be.greaterThan(0);
    });

    it('should get specific student details', async () => {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('id');
      expect(response.data.name).to.equal(newStudent.basicDetails.name);
    });
  });

  describe('3. Update Student (PUT /students/:id)', () => {
    const updatedDetails = {
      basicDetails: {
        name: "Updated Student Name",
        email: "updated.student@school.com"
      },
      profileDetails: {
        ...newStudent.profileDetails,
        phone: "9999999999"
      }
    };

    it('should update student details successfully', async () => {
      const response = await axios.put(
        `${API_BASE_URL}/students/${studentId}`,
        updatedDetails
      );
      expect(response.status).to.equal(200);
      expect(response.data.message).to.include('updated successfully');
    });

    it('should verify updated details', async () => {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
      expect(response.data.name).to.equal(updatedDetails.basicDetails.name);
      expect(response.data.email).to.equal(updatedDetails.basicDetails.email);
      expect(response.data.phone).to.equal(updatedDetails.profileDetails.phone);
    });
  });

  describe('4. Change Student Status (POST /students/:id/status)', () => {
    it('should disable student status', async () => {
      const response = await axios.post(`${API_BASE_URL}/students/${studentId}/status`, {
        status: false
      });
      expect(response.status).to.equal(200);
      expect(response.data.message).to.include('status changed successfully');
    });

    it('should verify disabled status', async () => {
      const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
      expect(response.data.systemAccess).to.equal(false);
    });

    it('should enable student status', async () => {
      const response = await axios.post(`${API_BASE_URL}/students/${studentId}/status`, {
        status: true
      });
      expect(response.status).to.equal(200);
      expect(response.data.message).to.include('status changed successfully');
    });
  });
}); 