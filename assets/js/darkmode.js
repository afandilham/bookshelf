const html = document.querySelector('.html');
const changeTheme = document.getElementById('changeTheme');

changeTheme.addEventListener('click', () => {
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.theme = 'dark';
  }
});

html.classList.add(localStorage.getItem('theme'));
