import { id } from "date-fns/locale";

const businesses = [
  {
    id: 1,
    name: "gas station",
    type: "Petrol Station",
    icon: "gas-station",
    iconSet: "MaterialCommunityIcons",
    colors: {
      background: "#DCFCE7",
      icon: "#16A34A",
    },
  },
  {
    id: 2,
    name: "Alfa",
    type: "Convenience Store",
    icon: "shopping-cart",
    iconSet: "FontAwesome",
    colors: {
      background: "#FEF3C7",
      icon: "#D97706",
    },
  },
  {
    id: 3,
    name: "Coded Canteen",
    type: "Grocery Store",
    icon: "shopping-basket",
    iconSet: "FontAwesome",
    colors: {
      background: "#DBEAFE",
      icon: "#2563EB",
    },
  },
  {
    id: 4,
    name: "Hi&Buy",
    type: "Convenience Store",
    icon: "store",
    iconSet: "MaterialCommunityIcons",
    colors: {
      background: "#FEC7F4",
      icon: "#E65069",
    },
  },
];

export default businesses;
