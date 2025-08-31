/*
 * =================================================================================
 * MODERN PERSONAL INFORMATION FORM - ENHANCED JAVASCRIPT
 * =================================================================================
 * Features:
 * 1. Real-time validation with visual feedback
 * 2. NEW: Aadhar verification flow that triggers Receipt ID generation
 * 3. Advanced form handling with loading states
 * =================================================================================
 */

class PersonalInfoForm {
    constructor() {
        this.form = document.getElementById('personalInfoForm');
        this.submitButton = document.getElementById('submitButton');
        this.successMessage = document.getElementById('successMessage');
        
        // NEW elements for verification flow
        this.verifyButton = document.getElementById('verifyButton');
        this.verificationStatus = document.getElementById('verificationStatus');
        this.aadharInput = document.getElementById('aadhar');
        this.fileUploadInput = document.getElementById('fileUpload');
        this.receiptIdInput = document.getElementById('receiptId');

        this.isVerified = false; // State to track if verification is complete

        this.validationRules = {
            firstName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/, message: 'First name must contain only letters and be at least 2 characters' },
            lastName: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/, message: 'Last name must contain only letters and be at least 2 characters' },
            email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
            phone: { required: true, pattern: /^(\+91|91)?[6-9]\d{9}$/, message: 'Please enter a valid Indian phone number' },
            dob: { required: true, custom: this.validateAge.bind(this), message: 'You must be at least 13 years old' },
            gender: { required: true, message: 'Please select your gender' },
            address: { required: true, minLength: 10, message: 'Address must be at least 10 characters long' },
            city: { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/, message: 'City name must contain only letters' },
            state: { required: true, message: 'Please select your state' },
            pincode: { required: true, pattern: /^\d{6}$/, message: 'Pincode must be exactly 6 digits' },
            aadhar: { required: true, pattern: /^\d{12}$/, message: 'Aadhar must be exactly 12 digits' },
            fileUpload: { required: true, custom: this.validateFile.bind(this), message: 'Please select a valid file (.pdf, .jpg, .png)' }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupInputFormatting();
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.verifyButton?.addEventListener('click', this.handleVerification.bind(this));

        // Validation listeners
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const eventType = ['select-one', 'date', 'file'].includes(field.type) ? 'change' : 'blur';
                field.addEventListener(eventType, () => this.validateField(fieldName));
                if (field.type !== 'file') {
                    field.addEventListener('input', () => this.clearFieldError(fieldName));
                }
            }
        });

        // Listen for changes to enable the Verify button
        this.aadharInput?.addEventListener('input', () => this.checkVerificationReadyState());
        this.fileUploadInput?.addEventListener('change', () => this.checkVerificationReadyState());
        
        // Formatters
        document.getElementById('phone')?.addEventListener('input', this.formatNumericOnly.bind(this, 10));
        document.getElementById('pincode')?.addEventListener('input', this.formatNumericOnly.bind(this, 6));
        this.aadharInput?.addEventListener('input', this.formatNumericOnly.bind(this, 12));
    }
    
    setupInputFormatting() {
        ['firstName', 'lastName', 'city'].forEach(fieldName => {
            document.getElementById(fieldName)?.addEventListener('input', (e) => {
                e.target.value = this.capitalizeWords(e.target.value);
            });
        });
        this.fileUploadInput?.addEventListener('change', this.handleFileSelect.bind(this));
    }
    
    checkVerificationReadyState() {
        const isAadharValid = /^\d{12}$/.test(this.aadharInput.value);
        const isFileUploaded = this.fileUploadInput.files.length > 0;

        if (isAadharValid && isFileUploaded) {
            this.verifyButton.disabled = false;
        } else {
            this.verifyButton.disabled = true;
        }
        
        // Reset verification if details change
        this.isVerified = false;
        this.receiptIdInput.value = '';
        this.receiptIdInput.placeholder = 'Pending verification...';
        this.verificationStatus.textContent = '';
        this.verificationStatus.className = 'verification-status';
    }

    async handleVerification(event) {
        event.preventDefault();
        this.verifyButton.disabled = true;
        this.verificationStatus.textContent = 'Verifying... Please wait.';
        this.verificationStatus.className = 'verification-status verifying';

        // Simulate API call for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.isVerified = true;
        this.verificationStatus.textContent = 'Aadhar Verified Successfully ✔️';
        this.verificationStatus.className = 'verification-status verified';
        this.generateReceiptIdFromAadhar();
    }

    generateReceiptIdFromAadhar() {
        const aadharValue = this.aadharInput.value;
        const lastFourDigits = aadharValue.slice(-4);
        const timestamp = Date.now().toString().slice(-6);
        this.receiptIdInput.value = `RCPT-${lastFourDigits}-${timestamp}`;
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const rule = this.validationRules[fieldName];
        const value = field.type === 'file' ? field.files[0] : field.value.trim();

        this.clearFieldError(fieldName);

        if (rule.required && (field.type === 'file' ? field.files.length === 0 : !value)) {
            this.showFieldError(fieldName, `${this.getFieldDisplayName(fieldName)} is required`);
            return false;
        }

        if (!value && !rule.required) return true;
        
        if (rule.minLength && value.length < rule.minLength) {
            this.showFieldError(fieldName, rule.message);
            return false;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
            this.showFieldError(fieldName, rule.message);
            return false;
        }

        if (rule.custom && !rule.custom(value)) {
            this.showFieldError(fieldName, rule.message);
            return false;
        }

        this.showFieldSuccess(fieldName);
        return true;
    }

    validateAge(dateString) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 13;
    }

    validateFile(file) {
        if (!file) return false;
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return allowedTypes.includes(file.type);
    }
    
    handleFileSelect(event) {
        const fileInput = event.target;
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            fileNameDisplay.classList.remove('text-slate-600');
            fileNameDisplay.classList.add('text-primary-600', 'font-medium');
            this.validateField('fileUpload');
        } else {
            fileNameDisplay.textContent = 'Choose a file (.pdf, .jpg, .png)';
            fileNameDisplay.classList.add('text-slate-600');
            fileNameDisplay.classList.remove('text-primary-600', 'font-medium');
        }
    }
    
    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        const targetElement = field.type === 'file' ? field.parentElement : field;

        targetElement.classList.add('error');
        targetElement.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    showFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const targetElement = field.type === 'file' ? field.parentElement : field;
        
        targetElement.classList.remove('error');
        targetElement.classList.add('success');
        
        this.clearErrorMessage(fieldName);
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const targetElement = field.type === 'file' ? field.parentElement : field;
        
        targetElement.classList.remove('error', 'success');
        
        this.clearErrorMessage(fieldName);
    }
    
    clearErrorMessage(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    getFieldDisplayName(fieldName) {
        const displayNames = {
            firstName: 'First Name', lastName: 'Last Name', email: 'Email Address', phone: 'Phone Number',
            dob: 'Date of Birth', gender: 'Gender', address: 'Address', city: 'City', state: 'State',
            pincode: 'Pincode', aadhar: 'Aadhar Number', fileUpload: 'Document'
        };
        return displayNames[fieldName] || fieldName;
    }

    formatNumericOnly(maxLength, event) {
        let value = event.target.value.replace(/\D/g, '');
        event.target.value = value.substring(0, maxLength);
    }

    capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    validateAllFields() {
        let isValid = true;
        const firstErrorField = [];
        
        Object.keys(this.validationRules).forEach(fieldName => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isValid = false;
                if (firstErrorField.length === 0) firstErrorField.push(fieldName);
            }
        });

        if (firstErrorField.length > 0) {
            document.getElementById(firstErrorField[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return isValid;
    }

    showLoadingState() {
        this.submitButton.querySelector('.button-text').style.opacity = '0';
        this.submitButton.querySelector('.loading-spinner').classList.remove('hidden');
        this.submitButton.disabled = true;
    }

    hideLoadingState() {
        this.submitButton.querySelector('.button-text').style.opacity = '1';
        this.submitButton.querySelector('.loading-spinner').classList.add('hidden');
        this.submitButton.disabled = false;
    }

    showSuccessMessage() {
        this.successMessage.classList.remove('hidden');
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        data.submittedAt = new Date().toISOString();
        if (data.phone) data.phone = `+91${data.phone.replace(/\D/g, '').slice(-10)}`;
        return data;
    }

    async handleSubmit(event) {
        event.preventDefault();
        const allFieldsValid = this.validateAllFields();

        if (!allFieldsValid) return;

        if (!this.isVerified) {
            alert('Please verify your Aadhar number before submitting.');
            this.aadharInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        this.showLoadingState();

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const formData = this.collectFormData();
            console.log('Form Data Submitted:', formData);
            this.showSuccessMessage();
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting the form. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PersonalInfoForm();
});