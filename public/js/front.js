

const menuIcon = document.getElementById('menu-icon');
const navBar = document.querySelector('.nav-bar');
const closeButton = document.querySelector('.close-btn');
const header = document.querySelector('header');
let lastScrollTop = 0;

// Function to update the visibility of the menu icon
function updateMenuIconVisibility() {
    if (window.innerWidth > 1090) {
        menuIcon.style.display = 'none'; // Hide menu icon when width is greater than 1090px
    } else if (!navBar.classList.contains('open')) {
        menuIcon.style.display = 'block'; // Show menu icon when nav-bar is not open and width is less than or equal to 1090px
    }
}

// Toggle nav-bar on menu icon click
menuIcon.addEventListener('click', () => {
    navBar.classList.add('open');
    menuIcon.style.display = 'none'; // Hide the menu icon
});

// Close nav-bar when the close button is clicked
closeButton.addEventListener('click', () => {
    navBar.classList.remove('open');
    updateMenuIconVisibility(); // Update menu icon visibility
});

// Update the menu icon visibility on load and resize
window.addEventListener('load', updateMenuIconVisibility);
window.addEventListener('resize', updateMenuIconVisibility);

// Auto-hide the header when scrolling down and show when scrolling up
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // If scrolling down, hide the header
    if (scrollTop > lastScrollTop) {
        header.style.top = '-100px'; // Hide header (adjust this based on your header height)
    } else {
        header.style.top = '0'; // Show the header again
    }

    lastScrollTop = scrollTop; // Update the last scroll position
});


// ------------------------------------------------------------------------------------------------------------

//for choise
const item1 = document.querySelector('#item1')
const item2 = document.querySelector('#item2')
const x = document.querySelector('#x')

item1.addEventListener('change',function(){
    if(item1.checked){
        x.style.display = 'none'
    }
})

item2.addEventListener('change',function(){
    if(item2.checked){
        x.style.display = 'block'
    }
})


//for submit delete button
