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
        list.forEach(async (weaponData) => {
            console.log("name", weaponData);
            console.log("name.type", weaponData.type);
            let weapon = await fetch(`/weapon_stat/${weaponData.type}/${weaponData.name}`);
            weapon = await weapon.json();
            let craftingMaterials = weapon.crafting.materials;
            let upgradeMaterials = weapon.crafting.upgradeMaterials;
            let craftable = weapon.crafting.craftable;
            let prevWeapon;

            
            console.log("type of weapon", typeof(weapon));
            console.log("weapon", weapon);
            let div = document.createElement('div');
            div.classList.add('col-md-4');
            

            let ul = document.createElement('ul');
            console.log("craftable: ", craftable);
            if(craftable){
                craftingMaterials.forEach((material) => {
                    let li = document.createElement('li');
                    li.textContent = `${material.item.name}: ${material.quantity}`;
                    ul.appendChild(li);
                });
            }
            else{
                prevWeapon = await fetch(`/weapon_id/${weaponData.type}/${weapon.crafting.previous}`);
                console.log("prevWeapon", prevWeapon);
                prevWeapon = await prevWeapon.json();
                console.log("prevWeaponJSON", prevWeapon);
                upgradeMaterials.forEach((material) => {
                    let li = document.createElement('li');
                    li.textContent = `${material.item.name}: ${material.quantity}`;
                    ul.appendChild(li);
                });
            }
           

            div.innerHTML=`
                <div class="card h-100">
                <img src="${weapon.assets.image}" class="card-img-top" alt="Card 1">
                <div class="card-body">
                    <h5 class="card-title">${weaponData.name}</h5>
                    <p class="card-text">
                        ${craftable? 'Craftable': `Upgradeable from ${prevWeapon.name}`}
                        Materials:
                        ${ul.outerHTML}
                    </p>
                </div>
                </div>`;

            

            display.appendChild(div);
        });
    };

    const displayMaterials = (materials) => {

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
