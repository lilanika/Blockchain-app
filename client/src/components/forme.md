/* NAVBAR

How to make code dynamically: 

1. make a simple functional Component that return an li element
class and cotent are dynamic

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

2.  creating an Array and map through them 

  {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))}


Other question: 

  {toggleMenu && (

  this means is goign to show only when the toggle menu is set to true. e decide to reder ali 


  classProps wurde in der componente NavBarItem als props hinzugefügt und kann deshalb als propertie benutzt werden

*/
