(() =>{
  let carousel = document.querySelector('.carousel-inner');
  const displayCarousel = async () => {
    fetch('/weapon_breif')
    .then(response => response.json())
    .then(data => {
      console.log(data);
     
    });
  };
  window.addEventListener('load', async () => {
    displayCarousel();

  });
})();