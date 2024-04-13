
(() =>{
  const carousel = document.querySelector('.carousel-inner');
  const itemList = document.querySelector('#displaySection');
  const weaponTypes = [
    'great-sword', 'long-sword', 'sword-and-shield',
    'dual-blades', 'hammer', 'hunting-horn',
    'lance', 'gunlance', 'switch-axe',
    'charge-blade', 'insect-glaive', 'light-bowgun',
    'heavy-bowgun', 'bow'
  ];  

  
  let category = document.querySelector('#category-select');
  let isFirst = true;
  let cart = [];

  const displayCarousel = async () => {
    fetch('/weapon_brief/great-sword')
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

  // factory design pattern
  const displayList = (item) => {
    let div = document.createElement('div');
    div.classList.add('my-2');
    
    // check if item assets exist
    if (item.assets) {
      div.innerHTML = `
      <div class="card">
        <div class="card-body d-flex flex-column flex-md-row">
          <div class="flex-grow-1">
            <h5>${item.name}</h5>
            <p>${item.type}</p>
          </div>
          <img src="${item.assets.image}" class="img-fluid justify-self-end" width="80" alt="${item.name}">

          <button class="btn btn-primary my-3 addToList">Add to List</button>

        </div>
      </div>
      `;
    } else {
      div.innerHTML = `
      <div class="card">
        <div class="card-body d-flex flex-column flex-md-row">
          <div class="flex-grow-1">
            <h5>${item.name}</h5>
            <p>${item.type}</p>
          </div>
          <img src="" class="img-fluid justify-self-end" width="80" alt="${item.name}">

          <button class="btn btn-primary my-3 addToList">Add to List</button>

        </div>
      </div>
      `;
    }
    
    let btn = div.querySelector('.addToList');
    btn.addEventListener('click', async() => {
      let logged = await fetch('/isSignedIn');
      logged = await logged.json();
      if(!logged){
        document.getElementById('noticeDialog').style.display = "block";
        return;
      }
      if(cart.includes(item.name)){
        return;
      }
      cart.push(item.name);
      const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
      };
      fetch('/saveList', request);
      console.log(cart);
      showNotification(`${item.name} added to list`, true);
    });

    return div;
  }
  const createCarouselItem = (item) => {
    let div = document.createElement('div');
    if (isFirst) {
      div.classList.add('active');
      isFirst = false;
      carousel.innerHTML = '';
    }
      
    div.classList.add('carousel-item');
    div.innerHTML = `
      <div class="card">
        <img src="${item.assets.image}" class="card-img-top img-fluid m-auto" style="max-width: 400px;" alt="${item.name}">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.type}</p>
        </div>
      </div>
    `;
    return div;
  };

  const fillCategory = () => {
    weaponTypes.forEach((type) => {
      let option = document.createElement('option');
      option.value = type;
      option.text = type;
      category.appendChild(option);
    });
  }

  const changeCategory = async () => {
    let selected = category.value;
    isFirst = true;
    fetch(`/weapon_brief/${selected}`)
    .then(response => response.json())
    .then(data => {
      carousel.innerHTML = '';
      itemList.innerHTML = '';
      data.forEach((item,i) => {
        if(i < 10){
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

  const showNotification = (message, isSuccess) => {
    // removes old notification
    let oldNotice = document.querySelector(".notification");
    if(oldNotice)
        oldNotice.remove();

    let notice = document.createElement("div");
    notice.textContent = message;
    notice.classList.add("notification");

    if (isSuccess) {
        let icon = document.createElement("i");
        icon.classList.add("bi", "bi-check", "h5");
        notice.appendChild(icon);
        notice.style.backgroundColor = "#198754";
    } else
        notice.style.backgroundColor = "#ffc107";
    document.body.appendChild(notice);

    setTimeout(() => {
        notice.remove();
    }, 2000);
}

  window.addEventListener('load', async () => {
    fillCategory();
    console.log('Page is fully loaded');
    await displayCarousel();

  });
  category.addEventListener('change', changeCategory);
})();