import chai from 'chai';
import axios from 'axios';

// Configure axios defaults
axios.defaults.validateStatus = () => true;

// Export chai expect
export const { expect } = chai; 