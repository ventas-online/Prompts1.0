const PREFIX="emprendetools:";
const defaults={business:{name:"",phone:"",currency:"USD",logo:""},products:[],sales:[],expenses:[],settings:{theme:"system"}};
function clone(value){return JSON.parse(JSON.stringify(value));}
function read(key,fallback){try{const raw=localStorage.getItem(PREFIX+key);return raw===null?clone(fallback):JSON.parse(raw);}catch{return clone(fallback);}}
function write(key,value){localStorage.setItem(PREFIX+key,JSON.stringify(value));return value;}
export function getBusiness(){return read("business",defaults.business)}
export function saveBusiness(data){return write("business",{...defaults.business,...data})}
export function getProducts(){return read("products",defaults.products)}
export function saveProducts(items){return write("products",items)}
export function addProduct(product){const items=getProducts();const item={id:crypto.randomUUID(),createdAt:new Date().toISOString(),...product};items.push(item);saveProducts(items);return item}
export function updateProduct(id,changes){const items=getProducts().map(p=>p.id===id?{...p,...changes}:p);saveProducts(items);return items.find(p=>p.id===id)||null}
export function deleteProduct(id){saveProducts(getProducts().filter(p=>p.id!==id))}
export function getSales(){return read("sales",defaults.sales)}
export function saveSales(items){return write("sales",items)}
export function addSale(sale){const items=getSales();const item={id:crypto.randomUUID(),date:new Date().toISOString(),...sale};items.push(item);saveSales(items);return item}
export function getExpenses(){return read("expenses",defaults.expenses)}
export function saveExpenses(items){return write("expenses",items)}
export function addExpense(expense){const items=getExpenses();const item={id:crypto.randomUUID(),date:new Date().toISOString(),...expense};items.push(item);saveExpenses(items);return item}
export function getSettings(){return read("settings",defaults.settings)}
export function saveSettings(data){return write("settings",{...defaults.settings,...data})}
export function exportData(){return {business:getBusiness(),products:getProducts(),sales:getSales(),expenses:getExpenses(),settings:getSettings(),exportedAt:new Date().toISOString()}}
export function importData(data){if(!data||typeof data!=="object")throw new Error("Archivo no válido");if(data.business)saveBusiness(data.business);if(Array.isArray(data.products))saveProducts(data.products);if(Array.isArray(data.sales))saveSales(data.sales);if(Array.isArray(data.expenses))saveExpenses(data.expenses);if(data.settings)saveSettings(data.settings);return true}
export function clearAll(){Object.keys(defaults).forEach(key=>localStorage.removeItem(PREFIX+key))}
