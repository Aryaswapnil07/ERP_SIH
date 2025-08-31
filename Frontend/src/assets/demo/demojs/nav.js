document.addEventListener('DOMContentLoaded',()=>{

  const navbar=document.getElementById('navbar');
  const hamburger=document.getElementById('hamburger-menu');
  const mobileMenu=document.getElementById('mobile-menu-container');

  // Navbar scroll
  const onScroll=()=>{window.scrollY>50?navbar.classList.add('scrolled'):navbar.classList.remove('scrolled');};
  window.addEventListener('scroll',onScroll);
  onScroll();

  // Hamburger toggle
  const closeMobileMenu=()=>{
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded','false');
    mobileMenu.setAttribute('aria-hidden','true');
    document.body.style.overflow='auto';
  };
  const openMobileMenu=()=>{
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    hamburger.setAttribute('aria-expanded','true');
    mobileMenu.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click',()=>{hamburger.classList.contains('active')?closeMobileMenu():openMobileMenu();});
    mobileMenu.querySelectorAll('.nav-link,.user-btn').forEach(el=>{
      el.addEventListener('click',()=>{if(!el.classList.contains('user-btn')) closeMobileMenu();});
    });
  }

  // Role dialog
  const roleDialog=document.getElementById('role-dialog');
  const closeRoleBtn=document.getElementById('close-role-dialog');
  let currentUserType='';

  document.querySelectorAll('.user-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      currentUserType=btn.dataset.user;
      roleDialog.querySelector('#role-heading').textContent=`Choose Your Role (${currentUserType.charAt(0).toUpperCase()+currentUserType.slice(1)} User)`;
      roleDialog.classList.remove('closing');
      roleDialog.classList.add('active');
      roleDialog.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    });
  });

  closeRoleBtn.addEventListener('click',()=>{
    roleDialog.classList.add('closing');
    roleDialog.classList.remove('active');
    setTimeout(()=>{
      roleDialog.classList.remove('closing');
      roleDialog.setAttribute('aria-hidden','true');
      document.body.style.overflow='auto';
    },300);
  });

  // Google dialog
  const googleDialog=document.getElementById('google-dialog');
  const closeGoogleBtn=document.getElementById('close-google-dialog');
  roleDialog.querySelectorAll('.role-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      const role=btn.dataset.role;
      googleDialog.querySelector('#google-heading').textContent=`${currentUserType.charAt(0).toUpperCase()+currentUserType.slice(1)} ${role.charAt(0).toUpperCase()+role.slice(1)} - Signup/Login`;
      roleDialog.classList.remove('active');
      googleDialog.classList.add('active');
      googleDialog.setAttribute('aria-hidden','false');
    });
  });

  closeGoogleBtn.addEventListener('click',()=>{
    googleDialog.classList.remove('active');
    googleDialog.setAttribute('aria-hidden','true');
  });

  // Close overlay click
  roleDialog.addEventListener('click', e=>{if(e.target===roleDialog) closeRoleBtn.click();});
  googleDialog.addEventListener('click', e=>{if(e.target===googleDialog) closeGoogleBtn.click();});

  // Nav-link active
  const allNavLinks=document.querySelectorAll('.nav-list .nav-link,.mobile-nav-list .nav-link');
  allNavLinks.forEach(link=>{
    link.addEventListener('click', e=>{
      const href=(link.getAttribute('href')||'').trim();
      if(href==="#"||href.startsWith('#')){
        e.preventDefault();
        allNavLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
        if(mobileMenu && mobileMenu.classList.contains('active')) closeMobileMenu();
      }
    });
  });
});
