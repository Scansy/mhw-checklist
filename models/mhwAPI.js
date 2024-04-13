// declarations
const url = "https://mhw-db.com/weapons";
const fs = require('fs');
let hasCached = false;

/**
 * caches the weapons data
 * @param {*} filename 
 * @param {*} data 
 */
function cacheData(filename, data) {
    try {
        fs.writeFile(filename, data, (error) => {
            if (error) throw error;
            console.log("Weapon data cached successfully.");
        })
    } catch (error) {
        console.error(`An error occured while trying to write ${filename}`, error.message);
    }
}

/**
 * reads a cached data
 * @param {*} filename 
 * @returns 
 */
function readCache(filename) {
    try {
        let data = fs.readFileSync(filename);
        console.log("Read file succesfully");
        return JSON.parse(data);
    } catch (error) {
        console.error(`An error occured while trying to read ${filename}`, error.message);
    }
}

/**
 * returns all weapon data
 */
async function getAllWeapons() {
    if (!hasCached) {
        hasCached = true;
        let response = await fetch(url);
        let data = await response.json();
        cacheData("weapons.json", JSON.stringify(data));
        return data;
    }
    
    return readCache("weapons.json");
}

/**
 * returns all weapons within this category
 * @param {} category 
 * @returns 
 */
async function getSpecificWeapon(category) {
     if (!fs.existsSync(`${category}.json`)) {
        let encoded = encodeURIComponent(category);
        let response = await fetch(`${url}?q={"type":"${encoded}"}`);
        let data = await response.json();
        cacheData(`${category}.json`, JSON.stringify(data));
        return data;
      }

      return readCache(`${category}.json`);
} 

async function getWeaponByName(weaponName) {
    let response = await fetch(`${url}?q={"name":"${weaponName}"}&p={"crafting":"true","assets":"true"}`);
    let data = await response.json();
    return data;
}

async function getWeaponByid(id) {
    let response = await fetch(`${url}/${id}`);
    let data = await response.json();
    return data;
}

// exports
module.exports = {
    cacheData,
    readCache,
    getAllWeapons,
    getSpecificWeapon,
    getWeaponByName,
};