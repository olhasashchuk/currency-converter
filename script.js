function handleButtonClick() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const subMenu = document.querySelector('.sub-menu');
  const btnCreateRate = document.querySelector('.btn-create-rate--js');
  const btnCreateRateSubMenu = document.querySelector('.btn-create-rate-sub-menu--js');
  const btnOpenMenu = document.querySelector('.btn-open-menu--js');
  const btnCloseMenu = document.querySelector('.btn-close-menu--js');
    
  btnCreateRate.addEventListener('click', function() {
    const flyoutMenu = document.getElementById('menu-create-rate');
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      flyoutMenu.classList.add('opacity-0', 'translate-y-1', 'invisible');
      flyoutMenu.classList.remove('opacity-100', 'translate-y-0', 'visible');
    } else {
      flyoutMenu.classList.remove('opacity-0', 'translate-y-1', 'invisible');
      flyoutMenu.classList.add('opacity-100', 'translate-y-0', 'visible');
    }
    btnCreateRate.querySelector('svg').classList.toggle('rotate-180');
    this.setAttribute('aria-expanded', !isExpanded);
  });

  btnCreateRateSubMenu.addEventListener('click', function() {
    subMenu.classList.toggle('hidden');
    btnCreateRateSubMenu.querySelector('svg').classList.toggle('rotate-180')
  });

  btnOpenMenu.addEventListener('click', function() { 
    mobileMenu.style.display = 'block';
  })

  btnCloseMenu.addEventListener('click', function() {
    mobileMenu.style.display = 'none';
  })
}

handleButtonClick();

function changeMode() {
  const themeToggleDarkIcon = document.querySelector("#theme-toggle-dark-icon");
  console.log(themeToggleDarkIcon)
  const themeToggleLightIcon = document.querySelector("#theme-toggle-light-icon");
  console.log(themeToggleLightIcon)
  // Change the icons inside the button based on previous settings
  if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    themeToggleDarkIcon.classList.remove("hidden");
  } else {
    themeToggleLightIcon.classList.remove("hidden");
  }

  const themeToggleBtn = document.querySelector('#theme-toggle');
  console.log(themeToggleBtn)

  themeToggleBtn.addEventListener("click", function () {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle("hidden");
    themeToggleLightIcon.classList.toggle("hidden");

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        }

        // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        }
    }
  });
}

changeMode()





 