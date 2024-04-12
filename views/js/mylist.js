(() => {
    // declarations
    const modalView = document.getElementById('noticeDialog');
    const display = document.getElementById('display');
    let list = [];

    const getList = async () => {
        try {
            const response = await fetch('/getList');
            const data = await response.json();
            console.log(data);
            if (data !== null ) {
               
                list = data;    
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    
    const displayList = async () => {
        console.log(typeof(list));
        list.forEach(async (name) => {
            let weapon = await fetch(`/weapon_stat/${name}`);
            weapon = await weapon.json();
            weapon = weapon[0];
            let materials = weapon.crafting.upgradeMaterials;
            let craftable = weapon.crafting.craftable;


            console.log("type of weapon", typeof(weapon));
            console.log("weapon", weapon);
            let div = document.createElement('div');
            div.classList.add('col-md-4');
          

            let ul = document.createElement('ul');
            materials.forEach((material) => {
                let li = document.createElement('li');
                li.textContent = ``;
                ul.appendChild(li);
            });

            div.innerHTML=`
                <div class="card">
                <img src="${weapon.assets.image}" class="card-img-top" alt="Card 1">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">
                        Materials:
                        ${ul.outerHTML}
                    </p>
                </div>
                </div>
             `;

            

            display.appendChild(div);
        });
    };
    window.addEventListener('load', async () => {
        
        
        try {
            const response = await fetch('/isSignedIn');
            const data = await response.json();
            // console.log(data);
    
            if (!data) {
                modalView.style.display = '';
            } 
        } catch (error) {
            console.error('Error:', error);
        }
        await getList();
        await displayList();
    });
})()
