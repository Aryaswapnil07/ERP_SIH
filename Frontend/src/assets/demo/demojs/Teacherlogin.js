// Tab switching
function switchTab(event, tab) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
    document.getElementById(tab === 'email' ? 'emailForm' : 'teacherIdForm').classList.add('active');
    clearMessages();
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    if(input.type === 'password'){ input.type='text'; button.textContent='🙈'; }
    else{ input.type='password'; button.textContent='👁'; }
}

// Password strength meter
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    let strength = 0;
    if(password.length>=8) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;
    strengthBar.className='strength-bar';
    if(password.length>0){
        switch(strength){
            case 1: strengthBar.classList.add('strength-weak'); break;
            case 2: strengthBar.classList.add('strength-fair'); break;
            case 3: strengthBar.classList.add('strength-good'); break;
            case 4: strengthBar.classList.add('strength-strong'); break;
        }
    }
}

// Form submission simulation
function handleFormSubmit(form, isTeacherId=false){
    const spinner = form.querySelector('.loading-spinner');
    const submitText = form.querySelector('.submit-btn span');
    const submitBtn = form.querySelector('.submit-btn');
    spinner.style.display='inline-block'; submitText.textContent='Signing in...'; submitBtn.disabled=true;
    clearMessages();
    setTimeout(()=>{
        spinner.style.display='none'; submitText.textContent='Sign In'; submitBtn.disabled=false;
        showSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(()=>{ showSuccessMessage('Welcome to your Teacher Dashboard! 🎉'); }, 1500);
    },2000);
}

// Messages
function showErrorMessage(msg){ const e=document.getElementById('errorMessage'); e.textContent=msg; e.style.display='block'; document.getElementById('successMessage').style.display='none'; }
function showSuccessMessage(msg){ const e=document.getElementById('successMessage'); e.textContent=msg; e.style.display='block'; document.getElementById('errorMessage').style.display='none'; }
function clearMessages(){ document.getElementById('errorMessage').style.display='none'; document.getElementById('successMessage').style.display='none'; }

// Forgot password
function showForgotPassword() {
    const email=prompt('Enter your email address to reset your password:');
    if(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showSuccessMessage(`If an account exists for ${email}, a password reset link has been sent.`);
    else if(email) showErrorMessage('Please enter a valid email address.');
}

// Social login
function socialLogin(provider){
    showSuccessMessage(`Redirecting to ${provider} login...`);
    setTimeout(()=>{ showSuccessMessage(`${provider} login successful! Welcome back! 🎉`); },1500);
}

// Form validation
function validateForm(form){
    const inputs=form.querySelectorAll('input[required]'); let isValid=true;
    inputs.forEach(input=>{
        if(!input.value.trim()) isValid=false;
        if(input.type==='email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) isValid=false;
    });
    return isValid;
}

// Event listeners
document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('password').addEventListener('input',function(){ updatePasswordStrength(this.value); });
    document.getElementById('emailForm').addEventListener('submit',function(e){ e.preventDefault(); if(!validateForm(this)){ showErrorMessage('Please fill in all required fields correctly.'); return;} handleFormSubmit(this,false); });
    document.getElementById('teacherIdForm').addEventListener('submit',function(e){ e.preventDefault(); if(!validateForm(this)){ showErrorMessage('Please fill in all required fields correctly.'); return;} handleFormSubmit(this,true); });
});

// Keyboard shortcuts (Ctrl+Enter)
document.addEventListener('keydown',function(e){
    if(e.key==='Enter' && e.ctrlKey){
        const activeForm=document.querySelector('.login-form.active');
        if(activeForm) activeForm.querySelector('.submit-btn').click();
    }
});
