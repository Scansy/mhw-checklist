(() => {
    // declarations
    const modalView = document.getElementById('noticeDialog');
    const display = document.getElementById('display');
    const materials = document.getElementById('materials');
    console.log(materials);
    let list = [];
    let materialsList = [];
    let currentRole;
    
    const getList = async () => {
        try {
            const response = await fetch('/getList');
            const data = await response.json();
            if (data !== null ) {
               
                list = data;    
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    const displayList = async () => {
        list.forEach(async (weaponData) => {
          
            let weapon = await fetch(`/weapon_stat/${weaponData.type}/${weaponData.name}`);
            weapon = await weapon.json();
            let craftingMaterials = weapon.crafting.craftingMaterials;
            let upgradeMaterials = weapon.crafting.upgradeMaterials;
            let craftable = weapon.crafting.craftable;
            let prevWeapon;

          
            let div = document.createElement('div');
            div.classList.add('col-md-4');
            

            let ul = document.createElement('ul');
            if(craftable){
                craftingMaterials.forEach((material) => {
                    let li = document.createElement('li');
                    li.textContent = `${material.item.name}: ${material.quantity}`;
                    addMaterial(material.item.name, material.quantity);
                    ul.appendChild(li);
                });
            }
            else{
                prevWeapon = await fetch(`/weapon_id/${weaponData.type}/${weapon.crafting.previous}`);
                prevWeapon = await prevWeapon.json();
                upgradeMaterials.forEach((material) => {
                    let li = document.createElement('li');
                    li.textContent = `${material.item.name}: ${material.quantity}`;
                    addMaterial(material.item.name, material.quantity);
                    ul.appendChild(li);
                });
            }
           

            div.innerHTML=`
                <div class="card mt-3">
                <img src="${weapon.assets.image}" class="card-img-top" alt="Card 1">
                <div class="card-body">
                    <h5 class="card-title">${weaponData.name}</h5>
                    <p class="card-text">
                        ${craftable? 'Craftable': `Upgradeable from ${prevWeapon.name}`}
                        <br>
                        Materials:
                        ${ul.outerHTML}
                    </p>
                </div>
                </div>`;

            

            display.appendChild(div);
            console.log(div)
        });
        setTimeout(() => {
            displayMaterials();}, 2000);
    };

    // adds material to the list
    const addMaterial = (material, amount) => {
        let found = false;
        materialsList.forEach((item) => {
            if (item.name === material) {
                item.amount += amount;
                found = true;
            }
        });
        if (!found) {
            materialsList.push({name: material, amount: amount});
        }
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


    const displayMaterials = () => {
        materials.innerHTML = '';
        for (let i = 0; i < materialsList.length; i++) {
            let li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = `${materialsList[i].name}: ${materialsList[i].amount}`;
            materials.appendChild(li);
        }
    };
    window.addEventListener('load', async () => {
        currentRole = await fetch('/getRole');
        currentRole = await currentRole.text();

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
        // ADMIN ONLY INTERFACE
        let adminInterface = document.getElementById('admin-only');
        
        if (currentRole === 'admin') {
            let deleteBtn = document.getElementById('delete-btn');
            adminInterface.style.display = 'block';
            deleteBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                let username = document.getElementById('delete-username').value;
                let response = await fetch(`/deleteUserList/${username}`);
                let data = await response.json();

                if (data) {
                    console.log(`User ${username} list deleted.`);
                    showNotification(`User ${username} list deleted.`, true);
                } else {
                    console.log(`User ${username} not found.`);
                    showNotification(`User ${username} not found.`, false);
                }
            });
        }
    });
})()
