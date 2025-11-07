import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useSidebar } from "../context/SidebarContext";

// Assume these icons are correctly imported
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  UserIcon,
  DocsIcon
} from "../icons";

// Define the structure for a navigation item
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { user } = useAuth(); // Get user information from the Auth context

  // Use useMemo to dynamically generate nav items based on user role.
  // This recalculates only when the `user` object changes.
  const navItems = useMemo<NavItem[]>(() => {
    const menuItems: NavItem[] = [];

    // === Role-Based Items ===
    // Add specific items only if the user is an admin
    if (user?.role === 'admin') {
      menuItems.push(
        {
          icon: <GridIcon />,
          name: "Dashboard",
          path: "/admin/dashboard",
        },
        {
          icon: <UserIcon />,
          name: "Users",
          subItems: [
            { name: "List", path: "/admin/users" },
            { name: "Add", path: "/admin/users/add" },
          ],
        },
        {
          icon: <ListIcon />,
          name: "Banners",
          subItems: [
            { name: "List", path: "/admin/banners" },
            { name: "Add", path: "/admin/banner/add" },
          ],
        },
        {
          icon: <BoxCubeIcon />,
          name: "Categories",
          subItems: [
            { name: "List", path: "/admin/categories" },
            { name: "Add", path: "/admin/category/add" },
          ],
        },
        {
          icon: <ListIcon />,
          name: "Products",
          subItems: [
            { name: "List", path: "/admin/products" },
            { name: "Add", path: "/admin/product/add" },
          ],
        },
        {
          icon: <DocsIcon />,
          name: "Orders",
          subItems: [
            { name: "List", path: "/admin/orders" }
          ],
        },
      );
    }

    // === Common Items ===
    // These items are visible to all logged-in users
    // menuItems.push(
    //   {
    //     icon: <UserCircleIcon />,
    //     name: "User Profile",
    //     path: "/profile",
    //   },
    //   {
    //     icon: <CalenderIcon />,
    //     name: "Calendar",
    //     path: "/calendar",
    //   }
    // );

    return menuItems;
  }, [user]); // The dependency array ensures this runs only when the user state changes

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Effect to automatically open the submenu if a child route is active
  useEffect(() => {
    let activeSubmenuIndex: number | null = null;
    navItems.forEach((item, index) => {
      if (item.subItems?.some(subItem => isActive(subItem.path))) {
        activeSubmenuIndex = index;
      }
    });
    setOpenSubmenu(activeSubmenuIndex);
  }, [location.pathname, navItems, isActive]);

  // Effect to calculate and set the height of the open submenu for smooth animation
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu}`;
      const scrollHeight = subMenuRefs.current[key]?.scrollHeight;
      if (scrollHeight) {
        setSubMenuHeight(prev => ({ ...prev, [key]: scrollHeight }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(prevIndex => (prevIndex === index ? null : index));
  };
  
  // Renders the list of navigation items
  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={`${nav.name}-${index}`}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group w-full ${openSubmenu === index ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <span className={`menu-item-icon-size ${openSubmenu === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu === index ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`menu-item-icon-size ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={el => { subMenuRefs.current[`submenu-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu === index ? `${subMenuHeight[`submenu-${index}`] || 0}px` : "0px" }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map(subItem => (
                  <li key={subItem.path}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
          </h2>
          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
