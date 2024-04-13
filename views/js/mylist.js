(() => {
    // declarations
    const modalView = document.getElementById('noticeDialog');
    const display = document.getElementById('display');
    let list = [];
    let currentRole;
    
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
                <div class="card mt-3">
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


    const displayMaterials = (materials) => {

    };
    window.addEventListener('load', async () => {
        currentRole = await fetch('/getRole');
        currentRole = await currentRole.text();
        console.log(currentRole);

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
            console.log("admin hit")
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
