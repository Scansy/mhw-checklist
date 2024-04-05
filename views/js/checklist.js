
(() =>{
  const carousel = document.querySelector('.carousel-inner');
  const itemList = document.querySelector('#displaySection');
  const displayCarousel = async () => {
    fetch('/weapon_breif')
    .then(response => response.json())
    .then(data => {
      data.forEach((item,i) => {
        if(i < 10){
          console.log(item);
          let carouselItem = createCarouselItem(item);
          carousel.appendChild(carouselItem);
        }
        else{
          let listItem = displayList(item);
          itemList.appendChild(listItem);
        }
      });
     
    });
  };
  const displayList = (item) => {
    let div = document.createElement('div');
    div.classList.add('my-2');
    div.innerHTML = `
    <div class="card">
      <div class="card-body d-flex flex-column flex-md-row">
        <div class="flex-grow-1">
          <h5>${item.name} </h5>
          <p>${item.type}</p>
        </div>
        <img src="${item.assets.image}" class="img-fluid justify-self-end" width="80" alt="${item.name}">

        <button class="btn btn-primary my-3">Add to List</button>

      </div>
    </div>
    `;
    return div;
  }
  const createCarouselItem = (item) => {
    let div = document.createElement('div');
    div.classList.add('carousel-item');
    div.innerHTML = `
      <div class="card">
        <img src="${item.assets.image}" class="card-img-top img-fluid m-auto" style="max-width: 600px;" alt="${item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.type}</p>
        </div>
      </div>
    `;
    return div;
  };
  window.addEventListener('load', async () => {
    console.log('Page is fully loaded');
    await displayCarousel();

  });
})();