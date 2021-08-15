const accesscontrol = require("accesscontrol");
let grantList = [
  { role: "Admin", resource: "sliders", action: "create:any" },
  {
    role: "Admin",
    resource: "sliders",
    action: "read:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "sliders",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "sliders",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "blogs", action: "create:any" },
  { role: "Admin", resource: "blogs", action: "read:any", attributes: "*" },
  { role: "Admin", resource: "blogs", action: "update:any", attributes: "*" },
  { role: "Admin", resource: "blogs", action: "delete:any", attributes: "*" },

  { role: "Admin", resource: "categories", action: "create:any" },
  {
    role: "Admin",
    resource: "categories",
    action: "read:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "categories",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "categories",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "blogCateogries", action: "create:any" },
  {
    role: "Admin",
    resource: "blogCateogries",
    action: "read:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "blogCateogries",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "blogCateogries",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "products", action: "create:any" },
  { role: "Admin", resource: "products", action: "read:any", attributes: "*" },
  {
    role: "Admin",
    resource: "products",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "products",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "banners", action: "create:any" },
  { role: "Admin", resource: "banners", action: "read:any", attributes: "*" },
  {
    role: "Admin",
    resource: "banners",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "banners",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "coupons", action: "create:any" },
  { role: "Admin", resource: "coupons", action: "read:any", attributes: "*" },
  {
    role: "Admin",
    resource: "coupons",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "coupons",
    action: "delete:any",
    attributes: "*",
  },

  { role: "Admin", resource: "transactions", action: "create:any" },
  {
    role: "Admin",
    resource: "transactions",
    action: "read:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "transactions",
    action: "update:any",
    attributes: "*",
  },
  {
    role: "Admin",
    resource: "transactions",
    action: "delete:any",
    attributes: "*",
  },
  

  { role: "Admin", resource: "users", action: "create:any" },
  { role: "Admin", resource: "users", action: "read:any", attributes: "*" },
  { role: "Admin", resource: "users", action: "update:any", attributes: "*" },
  { role: "Admin", resource: "users", action: "delete:any", attributes: "*" },
 
  
  { role: "Admin", resource: "admins", action: "read:any" },
  { role: "Admin", resource: "admins", action: "delete:any" },

  { role: "Admin", resource: "smsPanel", action: "create:any" },
  { role: "Admin", resource: "smsPanel", action: "read:any", attributes: "*" },
  { role: "Admin", resource: "smsPanel", action: "delete:any", attributes: "*" },

  { role: "Admin", resource: "image", action: "create:any" },
  { role: "Admin", resource: "image", action: "read:any", attributes: "*" },
  { role: "Admin", resource: "image", action: "update:any", attributes: "*" },
  { role: "Admin", resource: "image", action: "delete:any", attributes: "*" },

  { role: "Admin", resource: "contactUs", action: "create:any" },
  { role: "Admin", resource: "contactUs", action: "read:any", attributes: "*" },
  { role: "Admin", resource: "contactUs", action: "update:any", attributes: "*" },

];
const ac = new accesscontrol(grantList);

module.exports = ac;
